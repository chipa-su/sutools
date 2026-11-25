/**
 * 蘇的工具箱 (SU's TOOLBOX) — BYOK 本地金鑰保險箱模組 (vault.js v1.2)
 * -----------------------------------------------------------------
 * 資安與跨分頁設計原則 (doc/spec/03_security_and_release_gate.md)：
 * 1. 前端程式碼與 GitHub 儲存庫中 100% 不存放任何硬編碼 API Key。
 * 2. 所有需要 API Key 的子工具統一由首頁「金鑰保險箱 (BYOK)」集中設定與管理，子工具頁面不重複放置金鑰輸入框。
 * 3. 因工具卡片皆以新分頁 (target="_blank") 開啟，而瀏覽器 sessionStorage 無法跨新分頁讀取，
 *    故統一底層採用同源跨分頁共享之 localStorage 封裝，並提供：
 *    - 'ttl' 模式 (預設推薦：跨分頁共享，8 小時後自動過期銷毀)
 *    - 'local' 模式 (本機長期記憶，免重複輸入)
 */

(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'su_toolbox_vault_';
  const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 小時自動過期銷毀

  function sanitizeKeyName(keyName) {
    return String(keyName || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  }

  function maskSecret(val) {
    const s = String(val || '');
    if (s.length > 8) {
      return s.slice(0, 4) + '••••••••' + s.slice(-3);
    }
    return '••••••••';
  }

  const SuVault = {
    /**
     * 儲存金鑰至本地瀏覽器 (支援跨分頁讀取與自動過期銷毀)
     * @param {string} keyName - 金鑰識別名 (例如 'gemini_api_key')
     * @param {string} secretValue - 金鑰內容
     * @param {'ttl'|'session'|'local'} scope - 'ttl'/'session' 為 8 小時自動銷毀，'local' 為本機長期保留
     */
    setKey(keyName, secretValue, scope = 'ttl') {
      const cleanName = sanitizeKeyName(keyName);
      if (!cleanName) throw new Error('無效的金鑰名稱');
      const fullKey = STORAGE_PREFIX + cleanName;
      const trimmedVal = String(secretValue || '').trim();

      try {
        localStorage.removeItem(fullKey);
        sessionStorage.removeItem(fullKey);
        if (cleanName === 'gemini_api_key') {
          localStorage.removeItem('gemini_api_key');
        }

        if (!trimmedVal) return false;

        const isPersistent = scope === 'local';
        const payload = {
          v: trimmedVal,
          scope: isPersistent ? 'local' : 'ttl',
          exp: isPersistent ? null : (Date.now() + DEFAULT_TTL_MS),
          updatedAt: Date.now()
        };

        localStorage.setItem(fullKey, JSON.stringify(payload));
        return true;
      } catch (err) {
        console.error('SuVault 儲存失敗:', err);
        return false;
      }
    },

    /**
     * 讀取本地金鑰 (若已過期則自動清除並回傳 null)
     * @param {string} keyName
     * @returns {string|null}
     */
    getKey(keyName) {
      const cleanName = sanitizeKeyName(keyName);
      if (!cleanName) return null;
      const fullKey = STORAGE_PREFIX + cleanName;

      try {
        const raw = localStorage.getItem(fullKey) || sessionStorage.getItem(fullKey);
        if (raw) {
          if (raw.startsWith('{')) {
            const parsed = JSON.parse(raw);
            if (parsed.exp && Date.now() > parsed.exp) {
              localStorage.removeItem(fullKey);
              return null;
            }
            return parsed.v || null;
          }
          // 相容舊版純字串格式
          return raw;
        }
        // 向下相容舊工具直寫的 gemini_api_key
        if (cleanName === 'gemini_api_key') {
          return localStorage.getItem('gemini_api_key') || null;
        }
      } catch (_) {}
      return null;
    },

    /**
     * 清除所有已儲存的本地金鑰
     */
    clearAll() {
      try {
        [localStorage, sessionStorage].forEach(store => {
          const toRemove = [];
          for (let i = 0; i < store.length; i++) {
            const k = store.key(i);
            if (k && (k.startsWith(STORAGE_PREFIX) || k === 'gemini_api_key')) {
              toRemove.push(k);
            }
          }
          toRemove.forEach(k => store.removeItem(k));
        });
      } catch (_) {}
    },

    /**
     * 列出目前已設定且未過期的金鑰清單 (僅回傳遮罩狀態，不回傳明文)
     */
    listConfiguredKeys() {
      const result = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k || !k.startsWith(STORAGE_PREFIX)) continue;
          const name = k.slice(STORAGE_PREFIX.length);
          const val = this.getKey(name);
          if (!val) continue;

          let scopeLabel = 'Local (本機長期記憶)';
          try {
            const raw = localStorage.getItem(k);
            if (raw && raw.startsWith('{')) {
              const parsed = JSON.parse(raw);
              if (parsed.scope === 'ttl' && parsed.exp) {
                const remainHrs = Math.max(0.1, (parsed.exp - Date.now()) / 3600000).toFixed(1);
                scopeLabel = '暫存模式 (跨分頁共享，剩餘 ' + remainHrs + ' 小時自動銷毀)';
              }
            }
          } catch (_) {}

          result.push({
            name,
            scope: scopeLabel,
            masked: maskSecret(val)
          });
        }
      } catch (_) {}
      return result;
    }
  };

  global.SuVault = SuVault;
})(window);
