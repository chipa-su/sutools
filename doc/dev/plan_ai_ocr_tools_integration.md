# 📋 開發計畫：整合「發票辨識」與「影印機讀數辨識」雙工具暨資安與視覺標準化 (`plan_ai_ocr_tools_integration`)

> **計畫編號**：`plan_ai_ocr_tools_integration`  
> **建立日期**：2026-11-25  
> **目前狀態**：`✅ 已全數實作、回寫 Spec 並完成測試`  
> **對應規格章節**：[00_overview.md](../spec/00_overview.md), [01_architecture_and_naming.md](../spec/01_architecture_and_naming.md), [02_portal_and_ui_design.md](../spec/02_portal_and_ui_design.md), [03_security_and_release_gate.md](../spec/03_security_and_release_gate.md)

---

## 1. 計畫背景與目標

將使用者於 `new project/` 中新增之兩個 Gemini AI 視覺辨識工具（`發票.html` 與 `影印機辨識.html`）正式整合進「蘇的工具箱 / SU's TOOLBOX」：
1. **首頁新增兩張獨立緊湊卡片**（分類：`AI 辨識`，點擊皆開啟新分頁）。
2. **視覺風格全面統一**：套用工具箱一致的 **深藍專業儀表板風（Navy Professional Dashboard）**（深海藍 Header `#1B2B47`、22px 幾何點陣畫布 `#EDF0F6`、純白面板與 `#D9DFEA` 邊框、青藍強調色 `#0B7285`、`Noto Sans TC` + `IBM Plex Mono` 字體），並將介面圖示統一改為 **Google Material Symbols Outlined**。
3. **落實 4 道 BYOK 與前端資安加固**，並於搬遷完成後清理臨時目錄 `new project/`。

---

## 2. 目錄命名與卡片配置規格

| 工具名稱 | 標準英文路徑 (`kebab-case`) | 原始檔案來源 | 首頁卡片 Icon | 分類標籤 | 開啟方式 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **智能發票報帳辨識** (`INVOICE SCANNER`) | `invoice-scanner/index.html` | `new project/發票.html` | `receipt_long` | `AI 辨識` | 新分頁 (`openInNewTab: true`) |
| **影印機計數清單擷取** (`COPIER COUNTER`) | `copier-counter/index.html` | `new project/影印機辨識.html` | `document_scanner` | `AI 辨識` | 新分頁 (`openInNewTab: true`) |

---

## 3. 四道資安加固規格 (Security Hardening)

1. **🔑 集中式全站 BYOK 金鑰保險箱 (`../assets/js/vault.js`) 連動（子分頁無須重複輸入）**：
   - 所有 API 金鑰統一於工具箱首頁右上角「金鑰保險箱 (BYOK)」集中設定（支援跨新分頁共享之 8 小時自動過期銷毀暫存模式與 Local 本機長期記憶模式）。
   - 兩個子工具頁面**不重複放置金鑰輸入框**，僅於頂部深海藍 Header 右側顯示「已連動首頁金鑰」狀態徽章（並透過 `window.addEventListener('storage')` 跨分頁即時同步）以及最新一代 Gemini 辨識引擎選單（`gemini-2.5-flash`、`gemini-2.5-flash-lite`、`gemini-2.5-pro`、`gemini-3-flash-preview`）。
2. **📡 API Key 改由 HTTP Header (`x-goog-api-key`) 傳遞**：
   - 將 Gemini API 請求網址改為不含 `?key=` 的純淨端點：`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`。
   - 金鑰改置於 Request Header：`'x-goog-api-key': apiKey`，避免金鑰暴露於 URL Query String。
3. **💉 防範 DOM XSS 注入 (`escapeHtml` 全面保護)**：
   - 針對上傳圖片檔名 (`file.name`)、AI 回傳之所有文字欄位（日期 `date`、店家名稱 `vendor`、發票號碼 `invoiceNo`、分類 `category`、統編 `buyerId`、錯誤訊息 `errorMsg`）全面執行 HTML 跳脫或使用安全 DOM 屬性賦值，杜絕惡意圖片文字觸發 DOM XSS。
4. **📦 外部連結與爬蟲防護**：
   - 所有外部連結（如 Google AI Studio 申請金鑰連結）強制加上 `target="_blank" rel="noopener noreferrer"`。
   - 兩支 HTML 皆加上 `<meta name="robots" content="noindex, nofollow">`。

---

## 4. 執行與驗收清單

- [x] 建立 `invoice-scanner/index.html`（含深藍專業儀表板視覺重構、Google Material Symbols 圖示與 4 道資安加固，100% 保留原有 QR Code 直讀 + AI 分類 + 表格編輯 + Excel 匯出功能）。
- [x] 建立 `copier-counter/index.html`（含深藍專業儀表板視覺重構、Google Material Symbols 圖示與 4 道資安加固，100% 保留原有批次圖片上傳 + 指數退避重試 + 日期排序 + TSV 一鍵複製貼入 Excel 功能）。
- [x] 更新 `data/tools.json`（新增 `invoice-scanner` 與 `copier-counter` 兩張卡片）與 `index.html` 防快取版本號（`?v=1.2.0`），並移除臨時資料夾 `new project/`。
- [x] 同步回寫更新 `doc/spec/00_overview.md`、`01_architecture_and_naming.md`、`02_portal_and_ui_design.md`、`03_security_and_release_gate.md` 與 `README.md`。
- [x] 執行冒煙測試、回歸測試、跨模型 (`flash`) 紅隊資安審查，並提交《發布前 5 項資安檢查報告》。
