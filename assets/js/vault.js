/**
 * 蘇的工具箱 (SU's TOOLBOX) — BYOK 本地金鑰保險箱模組 (vault.js)
 * -----------------------------------------------------------------
 * 資安設計原則 (doc/spec/03_security_and_release_gate.md)：
 * 1. 前端程式碼與 GitHub 儲存庫中 100% 不存放任何硬編碼 API Key。
 * 2. 當未來任何工具需要呼叫外部 API (如 OpenAI, Gemini, Google Maps) 時，
 *    統一透過 SuVault 讀取使用者保存在自己瀏覽器 (sessionStorage 或 localStorage) 的金鑰。
 */

(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'su_toolbox_vault_';

  const SuVault = {
    /**
     * 儲存金鑰至本地瀏覽器
     * @param {string} keyName - 金鑰識別名 (例如 'gemini_api_key')
     * @param {string} secretValue - 金鑰內容
     * @param {'session'|'local'} scope - 預設 'session' (關閉分頁即銷毀)，選 'local' 則跨次保留於本機
     */
    setKey(keyName, secretValue, scope = 'session') {
      const cleanName = String(keyName || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
      if (!cleanName) throw new Error('無效的金鑰名稱');
      const fullKey = STORAGE_PREFIX + cleanName;
      const trimmedVal = String(secretValue || '').trim();

      localStorage.removeItem(fullKey);
      sessionStorage.removeItem(fullKey);

      if (!trimmedVal) return false;
      const store = scope === 'local' ? localStorage : sessionStorage;
      store.setItem(fullKey, trimmedVal);
      return true;
    },

    /**
     * 讀取本地金鑰
     * @param {string} keyName
     * @returns {string|null}
     */
    getKey(keyName) {
      const cleanName = String(keyName || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
      if (!cleanName) return null;
      const fullKey = STORAGE_PREFIX + cleanName;
      return sessionStorage.getItem(fullKey) || localStorage.getItem(fullKey) || null;
    },

    /**
     * 清除所有已儲存的本地金鑰
     */
    clearAll() {
      [localStorage, sessionStorage].forEach(store => {
        const toRemove = [];
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            toRemove.push(k);
          }
        }
        toRemove.forEach(k => store.removeItem(k));
      });
    },

    /**
     * 列出目前已設定的金鑰名稱清單 (不回傳明文，僅回傳遮罩狀態)
     */
    listConfiguredKeys() {
      const result = [];
      const checkStore = (store, scopeLabel) => {
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            const val = store.getItem(k) || '';
            const masked = val.length > 8
              ? val.slice(0, 4) + '••••••••' + val.slice(-3)
              : '••••••••';
            result.push({
              name: k.slice(STORAGE_PREFIX.length),
              scope: scopeLabel,
              masked
            });
          }
        }
      };
      checkStore(sessionStorage, 'Session (關閉即清)');
      checkStore(localStorage, 'Local (本機記憶)');
      return result;
    }
  };

  global.SuVault = SuVault;
})(window);
