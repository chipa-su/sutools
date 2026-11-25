# 第 03 章：資安防護與 Git 發布審查制度

> **章節狀態**：本地伺服器資安防護與 Git 發布審查規範已正式生效（同步寫入 [AGENTS.md](../../AGENTS.md)）。

---

## 3.1 本地開發伺服器 (`server.js`) 資安控制

為了確保在本地電腦測試時不會暴露風險，`server.js` 實作了以下五項縱深防禦：
1. **僅綁定本機迴路 (`127.0.0.1`)**：不對外網或區網 (`0.0.0.0`) 開放，防止同 Wi-Fi 下的其他裝置掃描存取。
2. **嚴格的目錄穿越與 NTFS 資料流防護 (Path Traversal & ADS Prevention)**：
   - 拒絕任何包含 `\0`（Null Byte）、`:`（Windows NTFS `::$DATA` 替代資料流或磁碟代號）、`..` 父目錄穿越或尾端句點/空白之請求。
   - 先透過 `path.resolve(ROOT_DIR, relativeReqPath)` 與 `fs.realpath` 強制驗證目標位於專案根目錄內，再以正規化後的 `path.relative(ROOT_DIR, safeTarget)` 進行黑名單比對（徹底阻絕 `/.%2fserver.js` 等編碼繞過）。
3. **敏感檔案黑名單 (Sensitive File Blocklist)**：禁止透過 HTTP 讀取任何以 `.` 開頭的隱藏檔或系統控制檔（如 `.git/`、`.env`、`.gitignore`、`.server.pid`、`server.js`、`*.ps1`、`*.bat`、`config.local.js`、`*.private.json`、`*secret*`、`*credentials*`、`*.sqlite*`、`*.db*` 及其 `-wal`/`-shm` 檔案）。
4. **僅允許安全 HTTP 方法**：只接受 `GET` 與 `HEAD`，其餘方法一律回傳 `405 Method Not Allowed`。
5. **內建安全回應標頭 (Security Headers)**：
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Cross-Origin-Opener-Policy: same-origin`
   - `X-Robots-Tag: noindex, nofollow`
   - `Cache-Control: no-store, no-cache, must-revalidate`

---

## 3.2 靜態網站與未來 API / 權限控管四大防線

1. **前端零機密 (No Secrets in Frontend)**：GitHub Pages 上任何 HTML/JS/JSON 皆為公開可讀，嚴禁將任何 API Key 或密碼寫死於原始碼中。
2. **BYOK 本地金鑰保險箱 (`assets/js/vault.js`) 集中管理與 API Header 傳遞規範**：
   - **首頁集中管理、子分頁零重複輸入框**：所有需要外部 AI API（如 `invoice-scanner`、`copier-counter` 呼叫 Google Gemini API）的小工具，**不在子工具頁面重複放置 API Key 輸入框**，一律由工具箱首頁右上角「🔑 金鑰保險箱 (BYOK)」集中設定並透過 `assets/js/vault.js` 跨新分頁自動連動（支援 8 小時 TTL 自動過期銷毀之暫存模式與本機長期記憶模式，並透過 `storage` 事件即時同步跨分頁狀態）。
   - 子工具頂部導覽列僅呈現「金鑰連動狀態指示徽章」與最新 Gemini 辨識引擎選擇器（`gemini-2.5-flash`、`gemini-2.5-flash-lite`、`gemini-2.5-pro`、`gemini-3-flash-preview`）。
   - 呼叫 Google Gemini API 時，**嚴禁將 API Key 串接於 URL Query String (`?key=...`)**，強制改由 HTTP Request Header (`x-goog-api-key`) 傳遞，避免金鑰殘留於網址列或代理紀錄中。
3. **外部連結與防 XSS 規範**：
   - 所有外部連結（含 `https://s2design.com.tw/`）強制加上 `target="_blank" rel="noopener noreferrer"`，防止 Tabnabbing 釣魚劫持。
   - 渲染 JSON 卡片與搜尋過濾時，一律使用 `textContent` / `createElement` 等安全 DOM API，禁止將未過濾字串直接餵給 `innerHTML`。
4. **家人存取控管預留架構**：未來開放給家人且涉及私密功能時，可無縫接入 Cloudflare Pages + Cloudflare Zero Trust Access（Email 白名單 OTP 驗證）。

---

## 3.3 🚨 Git 發布前強制資安審查與人工授權制度 (Pre-Release Security Gate)

**所有協作 AI Agent 與開發者必須嚴格遵守以下鐵律**：
在執行任何 `git commit` 或 `git push` 發布更新之前，**必須先對新增或修改的內容執行 5 項資安檢查並向使用者提交報告，經使用者明確回覆同意後，方可執行 Git 發布**：

1. **🔑 機密與金鑰掃描 (Secret Scan)**：確認無殘留 API Key、Token、私鑰或硬編碼帳密。
2. **🕵️ 個人隱私資料檢查 (PII & Privacy Check)**：確認 HTML、JSON 與 Excel 樣板中無洩露真實個資（電話、身分證、護照、私人地址等）。
3. **💉 跨站腳本與注入風險 (XSS & Injection Check)**：確認無不安全的 `innerHTML`、`eval()` 或路徑穿越漏洞。
4. **📦 第三方套件與外部連結審查 (CDN & External Links)**：確認外部 CDN 來源可信，且外部連結皆具 `rel="noopener noreferrer"`。
5. **📝 版控範圍與文件同步檢查 (Git Scope & Docs Sync)**：確認 `.server.pid`、`.env` 等暫存/機密檔已排除於版控外，且 `README.md` 與 `doc/spec/` 已同步更新。
