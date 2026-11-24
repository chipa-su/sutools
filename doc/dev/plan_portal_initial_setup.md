# 📋 開發計畫：入口網站建置與標準化英文目錄重構 (`plan_portal_initial_setup`)

> **計畫編號**：`plan_portal_initial_setup`  
> **建立日期**：2026-11-24  
> **目前狀態**：`✅ Stage 0 ~ Stage 3 全數實作與測試完成`  
> **對應規格章節**：[00_overview.md](../spec/00_overview.md), [01_architecture_and_naming.md](../spec/01_architecture_and_naming.md), [02_portal_and_ui_design.md](../spec/02_portal_and_ui_design.md), [03_security_and_release_gate.md](../spec/03_security_and_release_gate.md)

---

## 1. 計畫背景與目標

將現有三個以中文命名的獨立小工具（`旅行計畫表`、`旅遊日文`、`網頁列印`）整合至統一的 **「蘇的工具箱 / SU's TOOLBOX」** 跨平台入口網，並建立完善的本地開發環境、文件治理體系與 Git 版控資安審查流程。

---

## 2. 分階段執行清單

### ✅ Stage 0：開發環境、治理文件與自動化測試建置（已完成）
- [x] 建立零相依性且具備資安防護的本地 Node.js 伺服器 (`server.js`)。
- [x] 建立啟動伺服器腳本 (`start-server.ps1` / `start-server.bat`) 與關閉伺服器腳本 (`stop-server.ps1` / `stop-server.bat`)。
- [x] 建立 `doc/spec/` 分章節規格書與 `doc/dev/` 開發計畫目錄。
- [x] 建立 `DESIGN.md`（視覺與架構設計規範）與 `AGENTS.md`（AI 代理開發、資料庫分支、紅隊與資安審查規範）。
- [x] 執行冒煙測試（Smoke Test）、回歸測試（Regression Test）與跨模型紅隊資安檢查（Red Team Audit）。

### ✅ Stage 1：英文目錄重構與檔案整理（已完成）
- [x] 建立 `_skills/` 資料夾，將 `旅遊日文/gemini-code-1795498926267.md` 移入 `_skills/`。
- [x] 將 `旅行計畫表/` 重新命名並整理為 `trip-planner/`：
  - 主程式保留為 `trip-planner/index.html`。
  - **【紅隊資安修補】**：為 `trip-planner/index.html` 分享連結渲染處的 `ev.tm`、`n.id`、`id`、`ev.c` 補上 `esc()` 跳脫，並將外部連結補齊 `rel="noopener noreferrer"`。
  - 匯入樣板重新命名為 `trip-planner/template-london-35-v4.xlsx`。
  - 舊版 `v4`、`v5`、`v6` 移入 `trip-planner/_archive/`。
- [x] 將 `旅遊日文/` 重新命名並整理為 `learning-language/`：
  - `旅遊日文.html` 改名為 `learning-language/japanese.html`。
  - `旅遊英文.html` 改名為 `learning-language/english.html`。
- [x] 將 `網頁列印/` 重新命名並整理為 `web-print/`：
  - `網頁列印.html` 改名為 `web-print/index.html`。
  - `網頁列印_操作說明_v2.2.html` 改名為 `web-print/guide.html`（**保留在 `web-print/` 第一層目錄，不放 `_archive`**）。
  - `網頁列印_history_v2.2.html` 改名為 `web-print/history.html`（**保留在 `web-print/` 第一層目錄，不放 `_archive`**）。
  - 補齊 `web-print/index.html`、`guide.html`、`history.html` 彼此間的導覽按鈕，並依紅隊建議補齊 `target="_blank"` 的 `rel="noopener noreferrer"` 與 `cleanUpContent()` 的 HTML 事件屬性/危險標籤淨化。

### ✅ Stage 2：主入口頁與 `learning-language` 次主題頁開發（已完成）
- [x] 建立 `assets/css/dashboard.css`（深藍專業儀表板風格 + Google Material Symbols Outlined）。
- [x] 建立 `assets/js/portal.js`（安全 DOM 渲染引擎、搜尋與分類過濾）與 `assets/js/vault.js`（BYOK 本地 API Key 保險箱模組）。
- [x] 建立 `data/tools.json` 與根目錄主入口 `index.html`（含三個工具卡片與 `https://s2design.com.tw/` 品牌卡片）。
- [x] 建立 `learning-language/topics.json` 與次主題選擇頁 `learning-language/index.html`（含日文、英文選擇卡片與返回主工具箱導覽）。

### ✅ Stage 3：文件回寫、資安審查與首次 Git 發布準備（已完成）
- [x] 更新 `doc/spec/00_overview.md`、`01_architecture_and_naming.md`、`02_portal_and_ui_design.md` 落差盤點表為全數完成，並同步更新 `README.md`。
- [x] 執行全站冒煙與回歸測試、跨模型紅隊複檢，並提交《發布前 5 項資安檢查報告》供使用者審閱授權。
