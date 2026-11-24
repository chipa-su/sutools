/**
 * 蘇的工具箱 (SU's TOOLBOX) — 本地開發與預覽伺服器 (Red-Team Hardened v1.1)
 * --------------------------------------------------------
 * 特點：
 * 1. 零第三方套件相依 (Pure Node.js built-in http/fs/path)
 * 2. 僅綁定本地迴路 127.0.0.1 (防止區網未授權存取)
 * 3. 嚴格防範 Path Traversal、URL 編碼繞過 (/.%2f)、Windows NTFS ADS (::$DATA) 與 Symlink 越界
 * 4. 敏感檔案黑名單於 path.resolve 標準化後執行，與 .gitignore 完全對齊 (含 SQLite WAL/SHM)
 * 5. 內建完整資安 HTTP Headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, COOP, Cache-Control)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const rawPort = parseInt(process.env.PORT || '8080', 10);
const PORT = (Number.isInteger(rawPort) && rawPort > 0 && rawPort <= 65535) ? rawPort : 8080;
const ROOT_DIR = fs.realpathSync(path.resolve(__dirname));
const PID_FILE = path.join(ROOT_DIR, '.server.pid');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// 禁止透過 HTTP 存取的敏感檔案或目錄規則 (針對 path.relative 標準化後的路徑進行比對)
const BLOCKED_PATTERNS = [
  /^server\.js$/i,
  /^start-server\.(ps1|bat)$/i,
  /^stop-server\.(ps1|bat)$/i,
  /^config\.local\.js$/i,
  /\.private\.json$/i,
  /secret/i,
  /credentials/i,
  /\.key$/i,
  /\.pem$/i,
  /\.(sqlite3?|db)(-shm|-wal|-journal)?$/i
];

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
}

function sendError(res, statusCode, message) {
  setSecurityHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ status: statusCode, error: message }));
}

function isBlockedRelativePath(canonicalRelPath) {
  if (!canonicalRelPath) return false;
  const segments = canonicalRelPath.split('/');
  for (const seg of segments) {
    // 阻擋任何以 . 開頭的隱藏檔或隱藏目錄 (.git, .env, .gitignore, .server.pid 等)
    if (seg.startsWith('.')) return true;
    // 阻擋 Windows 檔名尾端空白或句點繞過 (如 "server.js." 或 "server.js ")
    if (seg.endsWith('.') || seg.endsWith(' ')) return true;
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(canonicalRelPath) || segments.some(seg => pattern.test(seg))) {
      return true;
    }
  }
  return false;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  let decodedPathname;
  try {
    // 先檢查原始 URL 是否包含編碼的父目錄穿越 (%2e%2e / ..)
    const rawUrlPath = (req.url || '/').split('?')[0];
    const preDecoded = decodeURIComponent(rawUrlPath);
    if (preDecoded.includes('\0') || preDecoded.includes(':')) {
      return sendError(res, 403, 'Forbidden: Invalid characters or NTFS stream detected');
    }
    if (/(^|[\\/])\.\.([\\/]|$)/.test(preDecoded)) {
      return sendError(res, 403, 'Forbidden: Path traversal blocked');
    }
    const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);
    decodedPathname = decodeURIComponent(parsedUrl.pathname);
  } catch (err) {
    return sendError(res, 400, 'Bad Request: Malformed URL');
  }

  if (decodedPathname === '/__health') {
    setSecurityHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'ok',
      project: "SU's TOOLBOX (蘇的工具箱)",
      pid: process.pid,
      port: PORT
    }));
  }

  // 移除開頭斜線並透過 path.resolve 取得完全正規化的絕對路徑
  const relativeReqPath = decodedPathname.replace(/^[\\/]+/, '');
  let safeTarget = path.resolve(ROOT_DIR, relativeReqPath);

  const rootWithSep = ROOT_DIR.endsWith(path.sep) ? ROOT_DIR : ROOT_DIR + path.sep;
  if (safeTarget !== ROOT_DIR && !safeTarget.startsWith(rootWithSep)) {
    return sendError(res, 403, 'Forbidden: Path traversal blocked');
  }

  // 使用正規化後的相對路徑進行黑名單與隱藏檔檢查 (徹底防堵 /.%2fserver.js 等繞過手法)
  const canonicalRel = path.relative(ROOT_DIR, safeTarget).replace(/\\/g, '/');
  if (canonicalRel.startsWith('..') || isBlockedRelativePath(canonicalRel)) {
    return sendError(res, 403, 'Forbidden: Access to sensitive or hidden resource denied');
  }

  fs.stat(safeTarget, (err, stats) => {
    if (err) {
      return sendError(res, 404, 'Not Found');
    }

    if (stats.isDirectory()) {
      if (!decodedPathname.endsWith('/')) {
        setSecurityHeaders(res);
        res.writeHead(301, { 'Location': decodedPathname + '/' });
        return res.end();
      }
      safeTarget = path.join(safeTarget, 'index.html');
    }

    // 針對最終目標檔案再做一次正規化黑名單與 realpath 邊界驗證
    const finalRel = path.relative(ROOT_DIR, safeTarget).replace(/\\/g, '/');
    if (finalRel.startsWith('..') || isBlockedRelativePath(finalRel)) {
      return sendError(res, 403, 'Forbidden: Access to sensitive resource denied');
    }

    fs.realpath(safeTarget, (realErr, realTarget) => {
      if (realErr) {
        if (decodedPathname === '/') {
          setSecurityHeaders(res);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(`<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="UTF-8"><title>蘇的工具箱 / SU's TOOLBOX (Dev Server)</title></head>
<body style="font-family:system-ui,sans-serif;background:#1B2B47;color:#F4F7FD;padding:2rem;">
  <h1>🛠️ 蘇的工具箱 / SU's TOOLBOX — 本地開發伺服器運作中</h1>
  <p>伺服器狀態：<code>ONLINE (127.0.0.1:${PORT})</code> | 首頁 <code>index.html</code> 將於下一階段正式建置。</p>
  <h3>📂 目前可測試之現有工具路徑：</h3>
  <ul>
    <li><a style="color:#66D9E8" href="/trip-planner/">行程規劃板 (/trip-planner/)</a></li>
    <li><a style="color:#66D9E8" href="/learning-language/">語言學習中心 (/learning-language/)</a></li>
    <li><a style="color:#66D9E8" href="/web-print/">純淨網頁列印 (/web-print/)</a></li>
  </ul>
</body>
</html>`);
        }
        return sendError(res, 404, 'Not Found');
      }

      if (realTarget !== ROOT_DIR && !realTarget.startsWith(rootWithSep)) {
        return sendError(res, 403, 'Forbidden: Symlink traversal blocked');
      }

      fs.stat(realTarget, (fileErr, fileStats) => {
        if (fileErr || !fileStats.isFile()) {
          return sendError(res, 404, 'Not Found');
        }

        const ext = path.extname(realTarget).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        setSecurityHeaders(res);
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': fileStats.size
        });

        if (req.method === 'HEAD') {
          return res.end();
        }

        const stream = fs.createReadStream(realTarget);
        stream.on('error', () => {
          if (!res.headersSent) {
            sendError(res, 500, 'Internal Server Error');
          } else {
            res.destroy();
          }
        });
        stream.pipe(res);
      });
    });
  });
});

server.listen(PORT, HOST, () => {
  try {
    fs.writeFileSync(PID_FILE, String(process.pid), 'utf8');
  } catch (e) {
    console.error('無法寫入 PID 檔案:', e.message);
  }
  console.log(`====================================================`);
  console.log(`🛠️  蘇的工具箱 (SU's TOOLBOX) 本地伺服器已啟動！`);
  console.log(`🌐 網址: http://${HOST}:${PORT}/`);
  console.log(`🔒 綁定: 僅限本機存取 (${HOST}) | PID: ${process.pid}`);
  console.log(`====================================================`);
});

function cleanup() {
  try {
    if (fs.existsSync(PID_FILE)) {
      const currentPid = fs.readFileSync(PID_FILE, 'utf8').trim();
      if (currentPid === String(process.pid)) {
        fs.unlinkSync(PID_FILE);
      }
    }
  } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
