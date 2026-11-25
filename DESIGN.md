# 🎨 DESIGN.md — 蘇的工具箱 (SU's TOOLBOX) 系統與視覺設計規範

> 本文件定義「蘇的工具箱 / SU's TOOLBOX」之視覺設計系統、UI 元件標準、資料夾結構設計與資料庫演進架構。所有新工具或頁面擴充均須遵循本設計規範。

---

## 1. 品牌與標題識別 (Brand Identity)

- **中文主標題**：`蘇的工具箱`
- **英文副標題**：`SU's TOOLBOX`
- **官方品牌連結**：固定於頂部 Header 右上角提供連往 **[S2 Design (https://s2design.com.tw/)](https://s2design.com.tw/)** 的品牌按鈕（不在卡片網格重複放置官網卡片）。
- **設計氣質**：**深藍專業儀表板風（Navy Professional Dashboard）** —— 沉穩、高對比、資訊結構分明、緊湊卡片設計與跨平台（桌機/平板/手機）響應式友善。

---

## 2. 色彩與字體系統 (Design Tokens)

```css
:root {
  /* 背景與畫布 */
  --bg-canvas: #EDF0F6;          /* 淺灰藍底色，搭配 22px 點陣背景 */
  --bg-panel: #FFFFFF;           /* 卡片與內容面板純白底色 */
  --bg-subtle: #F4F7FB;          /* 次要區塊或附屬連結底色 */

  /* 頂部深藍儀表板導覽列 */
  --board-bg: #1B2B47;           /* 深海藍 Header 底色 */
  --board-text: #F4F7FD;         /* Header 主標題白字 */
  --board-muted: #8FA3C4;        /* Header 英文副標與徽章字色 */

  /* 文字與線條 */
  --ink-primary: #17233B;        /* 主標題與內文深藍黑 */
  --ink-secondary: #5B6B85;      /* 卡片描述與次要說明文字 */
  --line-default: #D9DFEA;       /* 卡片與區塊邊框色 */

  /* 強調色與狀態色 */
  --accent-primary: #0B7285;     /* 專業青藍主強調色 */
  --accent-soft: #E3F3F5;        /* Icon 容器淺青底色 */
  --accent-brand: #1971C2;       /* 品牌外部連結強調色 */

  /* 圓角與字體 */
  --radius-card: 12px;
  --font-sans: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", "Consolas", "Courier New", monospace;
}
```

---

## 3. 圖示系統規範 (Iconography Rule)

- **唯一指定圖示庫**：全面統一使用 Google 官方提供的 **[Google Material Symbols Outlined](https://fonts.google.com/icons)** 字型圖示。
- **禁止事項**：卡片主圖示不得混用系統 Emoji 或未經統一的外部 PNG，以確保在 Windows、macOS、iOS、Android 各平台呈現 100% 一致的專業視覺。
- **使用方式**：
  ```html
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <span class="material-symbols-outlined" aria-hidden="true">map</span>
  ```

---

## 4. 雙層卡片導覽與目錄架構設計

### 4.1 雙層入口與緊湊卡片設計 (Compact Card Layout)
1. **緊湊卡片規範**：
   - 每張卡片上半部包含：Google Material Icon、分類與版本標籤、英文 Mono 副標、以及中文主標題（**標題後方不加箭頭符號**）。
   - **下半截滿版灰色說明區（`.card-desc-box`）**：取消卡片最下方的附屬小按鈕底欄；在標題下方以一條滿版橫線（`border-top: 1px solid var(--line-default)`）將卡片分為上白、下灰兩半，整個卡片下半截填滿淺灰色（`--bg-subtle: #F4F7FB`）並放置簡短說明文字，使卡片尺寸更緊湊精練。
2. **點擊開啟行為（新分頁 vs. 原頁面）**：
   - **主入口頁 (`/index.html`)**：由 `/data/tools.json` 驅動。除了 **「語言學習中心 (`learning-language`)」** 點擊後在**原頁面**進入次主題頁之外，其餘所有工具卡片（`trip-planner`、`web-print` 等）點擊後一律**開啟新分頁**（`target="_blank" rel="noopener noreferrer"`）。
   - **次主題入口頁 (`/learning-language/index.html`)**：由 `/learning-language/topics.json` 驅動。上面的語言手冊小卡片（如冬季旅遊日文 `japanese.html`、美東旅遊英文 `english.html`）100% 比照上述緊湊卡片格式，且點擊後一律**開啟新分頁**。

### 4.2 檔案命名與分類設計原則
- **全小寫英文 `kebab-case`**：所有工具資料夾與檔案名稱一律採用英文小寫與連字號（如 `trip-planner`、`learning-language`、`web-print`）。
- **活文件保留於工具第一層目錄**：工具專屬的 `guide.html`（操作手冊）與 `history.html`（改版歷史）會在未來改版時持續更新與被引用，**必須留在該工具主目錄下，不得移入 `_archive/`**。
- **純舊版快照歸檔於 `_archive/`**：僅有不再被直接引用的舊版備份（如 `v4`、`v5`）才放入各工具下的 `_archive/`。
- **AI Skill 規範獨立於 `_skills/`**：專案中的 AI Skill 定義檔（如 `gemini-code-1795498926267.md`）統一收納於根目錄 `_skills/`。

---

## 5. 資料庫與後端演進架構設計 (SQLite Strategy)

- **純靜態優先原則**：能以瀏覽器 `localStorage`、JSON 設定檔或前端匯入/匯出完成之工具，維持純靜態架構，確保可零成本部署於 GitHub Pages。
- **SQLite 演進原則**：當未來任何新工具或改版涉及後端持久化資料庫需求時：
  1. **必須先切出獨立 Git 分支**（如 `feat/sqlite-<feature>`）進行開發。
  2. **統一採用 SQLite** 作為後端資料庫引擎，搭配本地 `server.js` API 路由與參數化查詢（Prepared Statements），兼顧輕量單檔備份便利性與資安防護。
