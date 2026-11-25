/**
 * 蘇的工具箱 (SU's TOOLBOX) — 資料驅動入口渲染引擎 (portal.js v1.1)
 * -----------------------------------------------------------------
 * 資安與版面設計原則：
 * 1. 全面採用 createElement 與 textContent，零 innerHTML 動態拼接，徹底杜絕 DOM XSS。
 * 2. 嚴格檢查所有 URL Schema，僅允許相對路徑 (./ 或 ../) 與 http://, https://。
 * 3. 緊湊卡片結構：無標題後箭頭、無底部附屬按鈕欄，說明文字統一置於標題下方的灰色色帶框 (.card-desc-box)。
 * 4. 除語言學習中心 (openInNewTab: false) 外，各工具與語言手冊卡片皆以新分頁開啟並強制加上 rel="noopener noreferrer"。
 */

(function () {
  'use strict';

  function isSafeUrl(url) {
    if (typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (/^(\.\/|\.\.\/|\/[^/])/.test(trimmed)) return true;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch (_) {
      return false;
    }
  }

  function createIcon(iconName, extraClass) {
    const span = document.createElement('span');
    span.className = 'material-symbols-outlined' + (extraClass ? ' ' + extraClass : '');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = iconName || 'widgets';
    return span;
  }

  function buildCardElement(item) {
    const article = document.createElement('article');
    article.className = 'tool-card';
    if (item.accentColor) {
      article.style.setProperty('--card-accent', item.accentColor);
    }
    if (item.accentSoft) {
      article.style.setProperty('--card-accent-soft', item.accentSoft);
    }

    // 整張卡片主連結區域
    const mainLink = document.createElement('a');
    mainLink.className = 'card-main-link';
    mainLink.href = isSafeUrl(item.url) ? item.url : '#';

    const shouldOpenNewTab = Boolean(item.openInNewTab || item.isExternal);
    if (shouldOpenNewTab) {
      mainLink.target = '_blank';
      mainLink.rel = 'noopener noreferrer';
    }

    // 卡片上半部：Google Material Icon + 徽章 + 標題
    const headerBlock = document.createElement('div');
    headerBlock.className = 'card-header-block';

    const topRow = document.createElement('div');
    topRow.className = 'card-top';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'card-icon-wrap';
    iconWrap.appendChild(createIcon(item.icon || 'construction'));

    const badgesWrap = document.createElement('div');
    badgesWrap.className = 'card-badges';

    if (item.category) {
      const catBadge = document.createElement('span');
      catBadge.className = 'badge';
      catBadge.textContent = item.category;
      badgesWrap.appendChild(catBadge);
    }

    if (item.version) {
      const verBadge = document.createElement('span');
      verBadge.className = 'badge version';
      verBadge.textContent = item.version;
      badgesWrap.appendChild(verBadge);
    }

    topRow.appendChild(iconWrap);
    topRow.appendChild(badgesWrap);

    // 卡片標題與英文副標 (不顯示後方箭頭符號)
    const headings = document.createElement('div');
    headings.className = 'card-headings';

    if (item.subtitle) {
      const sub = document.createElement('span');
      sub.className = 'card-subtitle';
      sub.textContent = item.subtitle;
      headings.appendChild(sub);
    }

    const titleH2 = document.createElement('h2');
    titleH2.className = 'card-title';
    titleH2.textContent = item.title || '未命名工具';
    headings.appendChild(titleH2);

    headerBlock.appendChild(topRow);
    headerBlock.appendChild(headings);

    // 標題下方灰色框：放置簡短說明文字
    const descBox = document.createElement('div');
    descBox.className = 'card-desc-box';

    const descP = document.createElement('p');
    descP.className = 'card-desc';
    descP.textContent = item.description || '';
    descBox.appendChild(descP);

    mainLink.appendChild(headerBlock);
    mainLink.appendChild(descBox);
    article.appendChild(mainLink);

    return article;
  }

  async function initPortal() {
    const gridEl = document.getElementById('cards-grid');
    const tabsEl = document.getElementById('category-tabs');
    const searchInput = document.getElementById('search-input');
    const countBadge = document.getElementById('tool-count-badge');
    if (!gridEl) return;

    const configUrl = gridEl.getAttribute('data-config-url') || './data/tools.json';

    let items = [];
    try {
      const res = await fetch(configUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      items = Array.isArray(data.tools) ? data.tools : (Array.isArray(data.topics) ? data.topics : []);
    } catch (err) {
      gridEl.textContent = '';
      const errBox = document.createElement('div');
      errBox.className = 'empty-state';
      errBox.appendChild(createIcon('error'));
      const p = document.createElement('p');
      p.textContent = '無法載入工具設定檔 (' + configUrl + ')，請確認透過本地伺服器開啟。';
      errBox.appendChild(p);
      gridEl.appendChild(errBox);
      return;
    }

    let activeCategory = 'ALL';
    let searchQuery = '';

    // 建立分類標籤列
    if (tabsEl) {
      const categories = ['ALL'];
      items.forEach(item => {
        if (item.category && !categories.includes(item.category)) {
          categories.push(item.category);
        }
      });

      const renderTabs = () => {
        tabsEl.textContent = '';
        categories.forEach(cat => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cat-tab' + (activeCategory === cat ? ' active' : '');
          btn.textContent = cat === 'ALL' ? '全部項目 (' + items.length + ')' : cat;
          btn.addEventListener('click', () => {
            activeCategory = cat;
            renderTabs();
            renderCards();
          });
          tabsEl.appendChild(btn);
        });
      };
      renderTabs();
    }

    function renderCards() {
      gridEl.textContent = '';
      const q = searchQuery.trim().toLowerCase();

      const filtered = items.filter(item => {
        const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
        if (!matchCat) return false;
        if (!q) return true;
        const hay = [
          item.title,
          item.subtitle,
          item.category,
          item.description,
          Array.isArray(item.tags) ? item.tags.join(' ') : ''
        ].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });

      if (countBadge) {
        countBadge.textContent = '顯示 ' + filtered.length + ' / ' + items.length + ' 項';
      }

      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.appendChild(createIcon('search_off'));
        const msg = document.createElement('p');
        msg.textContent = '找不到符合「' + searchQuery + '」的工具卡片。';
        empty.appendChild(msg);
        gridEl.appendChild(empty);
        return;
      }

      filtered.forEach(item => {
        gridEl.appendChild(buildCardElement(item));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value || '';
        renderCards();
      });
    }

    renderCards();
  }

  // 初始化 BYOK 金鑰保險箱彈窗互動
  function initVaultModal() {
    const openBtn = document.getElementById('open-vault-btn');
    const backdrop = document.getElementById('vault-backdrop');
    const closeBtn = document.getElementById('close-vault-btn');
    const saveBtn = document.getElementById('vault-save-btn');
    const clearBtn = document.getElementById('vault-clear-btn');
    const nameInput = document.getElementById('vault-key-name');
    const valInput = document.getElementById('vault-key-value');
    const scopeSelect = document.getElementById('vault-key-scope');
    const statusBox = document.getElementById('vault-status-list');

    if (!openBtn || !backdrop || !window.SuVault) return;

    function refreshVaultStatus() {
      if (!statusBox) return;
      statusBox.textContent = '';
      const keys = window.SuVault.listConfiguredKeys();
      if (keys.length === 0) {
        const p = document.createElement('p');
        p.textContent = '目前瀏覽器尚無儲存任何 API 金鑰（零機密殘留狀態）。';
        statusBox.appendChild(p);
        return;
      }
      keys.forEach(k => {
        const row = document.createElement('div');
        row.style.fontFamily = 'var(--font-mono)';
        row.style.fontSize = '12px';
        row.textContent = '🔑 ' + k.name + ' : ' + k.masked + ' [' + k.scope + ']';
        statusBox.appendChild(row);
      });
    }

    openBtn.addEventListener('click', () => {
      refreshVaultStatus();
      backdrop.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });

    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const kName = (nameInput.value || '').trim();
        const kVal = (valInput.value || '').trim();
        const kScope = scopeSelect ? scopeSelect.value : 'session';
        if (!kName || !kVal) {
          alert('請輸入金鑰識別名稱與金鑰內容！');
          return;
        }
        window.SuVault.setKey(kName, kVal, kScope);
        valInput.value = '';
        refreshVaultStatus();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        window.SuVault.clearAll();
        refreshVaultStatus();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPortal();
    initVaultModal();
  });
})();
