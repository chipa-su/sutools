# 第 01 章：系統架構與目錄命名規範

> **章節狀態**：✅ 已全數實作落地（與工作區實際檔案結構 100% 吻合）。

---

## 1.1 雙層導覽系統架構

系統採用 **「主入口網 →（直達工具 或 次主題入口）→ 實際工具 / 操作手冊 / 改版歷史」** 的雙層彈性架構：
- **第一層（主入口 `index.html`）**：由 `assets/js/portal.js` 讀取 `data/tools.json`，展示所有核心工具卡片與 **[S2 Design 官方網站 (https://s2design.com.tw/)](https://s2design.com.tw/)** 品牌卡片，並內建 BYOK 本地 API 金鑰保險箱 (`assets/js/vault.js`)。
- **第二層（次主題入口 `learning-language/index.html`）**：點擊「語言學習中心」卡片後進入次主題選擇頁，由 `learning-language/topics.json` 動態渲染「冬季旅遊日文實戰手冊 (`japanese.html`)」與「美東旅遊英文實戰手冊 (`english.html`)」，未來可無限擴充其他語言或學習主題。

---

## 1.2 資料夾與檔案命名黃金法則

1. **全面採用 `kebab-case`（全小寫英數字 + 連字號 `-`）**：
   - 避免 GitHub Pages 中文網址出現 `%E6%97%85...` 等 URL Encoding 亂碼。
   - 避免 Windows（不區分大小寫）與 Linux/GitHub Pages（區分大小寫）跨平台部署時發生 404 錯誤。
2. **預設入口統一為 `index.html`**：
   - 每個工具子目錄的主程式一律命名為 `index.html`，使網址可簡化為 `./trip-planner/`、`./learning-language/`、`./web-print/`。
3. **活文件（`guide.html` 與 `history.html`）保留於工具主目錄**：
   - 操作手冊（`guide.html`）與版本演進紀錄（`history.html`）屬於隨版本持續維護的活文件，**嚴禁移入 `_archive/`**，必須保留在該工具第一層目錄下，方便工具內部與入口卡片直接連結。
4. **淘汰的舊版快照移入 `_archive/`**：
   - 如 `trip-board-v4.html`、`trip-board-v5.html`、`trip-board-v6.html` 等純歷史備份檔，收納於該工具目錄下的 `_archive/`。
5. **AI Skills 獨立收納於 `_skills/`**：
   - 如 `gemini-code-1795498926267.md` 等 AI 提示詞與開發 Skill 檔案，統一存放於根目錄 `_skills/`。

---

## 1.3 專案實際路徑與歷史來源對照表 (As-Is Directory Map)

| 工具 / 資源名稱 | 目前實際標準路徑 (As-Is Reality) | 原始舊路徑 (Historical Origin) | 狀態與備註 |
| :--- | :--- | :--- | :--- |
| **主入口首頁與設定** | `index.html`, `data/tools.json` | *(全新建置)* | 深藍專業儀表板風 + Google Material Icons |
| **共用樣式與核心引擎** | `assets/css/dashboard.css`, `assets/js/portal.js`, `assets/js/vault.js` | *(全新建置)* | 含零 `innerHTML` 渲染引擎與 BYOK 金鑰保險箱 |
| **本地伺服器與腳本** | `server.js`, `start-server.ps1/.bat`, `stop-server.ps1/.bat` | *(全新建置)* | 本地 `http://127.0.0.1:8080` |
| **行程規劃板 (主程式)** | `trip-planner/index.html` | `旅行計畫表/index.html` | v6.0 版，已完成紅隊 XSS 跳脫修補 |
| **行程規劃板 (匯入樣板)** | `trip-planner/template-london-35-v4.xlsx` | `旅行計畫表/行程事件匯入樣板_倫敦35點_v4.xlsx` | 可由首頁卡片附屬按鈕直接下載 |
| **行程規劃板 (舊版備份)** | `trip-planner/_archive/trip-board-v4.html`, `v5.html`, `v6.html` | `旅行計畫表/行程規劃板_v4~v6.html` | 歷史版本歸檔保存 |
| **語言學習 (次主題入口)** | `learning-language/index.html`, `learning-language/topics.json` | *(全新建置)* | 選擇日文/英文手冊之次主題卡片頁 |
| **冬季旅遊日文手冊** | `learning-language/japanese.html` | `旅遊日文/旅遊日文.html` | 次主題卡片 1 |
| **美東旅遊英文手冊** | `learning-language/english.html` | `旅遊日文/旅遊英文.html` | 次主題卡片 2 |
| **AI Skill 檔案** | `_skills/gemini-code-1795498926267.md` | `旅遊日文/gemini-code-1795498926267.md` | 獨立 Skill 資料夾 |
| **純淨網頁列印 (主程式)** | `web-print/index.html` | `網頁列印/網頁列印.html` | v2.2 版，已內建導覽按鈕與 DOM XSS 淨化 |
| **純淨網頁列印 (操作說明)** | `web-print/guide.html` | `網頁列印/網頁列印_操作說明_v2.2.html` | **活文件保留於 `web-print/` 主目錄** |
| **純淨網頁列印 (改版歷史)** | `web-print/history.html` | `網頁列印/網頁列印_history_v2.2.html` | **活文件保留於 `web-print/` 主目錄** |
