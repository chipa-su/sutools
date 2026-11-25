# 📘 蘇的工具箱 (SU's TOOLBOX) — 系統規格書總目錄 (Spec Index)

> **最後同步日期**：2026-11-25  
> **目前專案階段**：`Phase 1.1 (v1.1.0) — 緊湊卡片版面精簡與新分頁開啟行為全面完工`

---

## 📑 分章節規格書導覽

本目錄 (`doc/spec/`) 記載系統之**正式規格與當下真實狀態（Single Source of Truth）**。依據專案治理規範（詳見 [AGENTS.md](../../AGENTS.md)），當你在不同電腦環境切換維護本專案時，只需閱讀本目錄即可 100% 理解專案現況；任何新功能開發前須先於 `doc/dev/plan_<功能名稱>.md` 撰寫開發計畫，待功能開發與測試完成後，再回寫更新至本目錄各章節。

1. **[第 01 章：系統架構與目錄命名規範](01_architecture_and_naming.md)**
   - 雙層導覽架構（主入口 + `learning-language` 次主題頁）、`kebab-case` 英文命名系統、活文件（`guide.html` / `history.html`）與 `_archive/`、`_skills/` 管理規範。
2. **[第 02 章：入口介面與視覺設計規格](02_portal_and_ui_design.md)**
   - 深藍專業儀表板風（Navy Professional Dashboard）、Google Material Symbols Outlined 圖示系統、`tools.json` 與 `topics.json` 資料結構。
3. **[第 03 章：資安防護與 Git 發布審查制度](03_security_and_release_gate.md)**
   - 靜態網站零機密原則、BYOK 本地金鑰保險箱 (`vault.js`)、本地伺服器防禦機制、強制 5 項資安檢查與使用者授權發布流程。
4. **[第 04 章：擴充 SOP、文件生命周期與資料庫策略](04_workflow_and_database_policy.md)**
   - 工具與次主題擴充步驟、`doc/dev` → `doc/spec` 與 `README.md` 同步生命周期、**未來涉及資料庫時開立新分支並採用 SQLite 之強制規範**。

---

## 🔍 Spec 與專案實作成果落差盤點表 (Implementation Status & Gap Analysis)

> **核對結論**：所有模組之「目前實作現況 (As-Is)」與「目標規格狀態 (To-Be)」已 **100% 同步吻合（零落差）**。

| 模組 / 項目 | 目前實作現況 (As-Is Reality) | 目標規格狀態 (To-Be Target) | 狀態標記 | 對應開發計畫 |
| :--- | :--- | :--- | :--- | :--- |
| **本地開發伺服器** | 已建立 `server.js` (v1.1 紅隊加固版)、`start-server.ps1/.bat`、`stop-server.ps1/.bat` | 本地 `127.0.0.1:8080` 預覽與健康檢查 `/__health` | ✅ **已實作完成** | [plan_portal_initial_setup.md](../dev/plan_portal_initial_setup.md) |
| **文件與治理架構** | 已建立 `doc/spec/`、`doc/dev/`、`DESIGN.md`、`AGENTS.md` | 計畫先行、完工回寫 Spec、README 同步更新 | ✅ **已實作完成** | [plan_portal_initial_setup.md](../dev/plan_portal_initial_setup.md) |
| **主入口首頁** | 已建立 `index.html`、`data/tools.json`、`assets/css/dashboard.css`、`assets/js/portal.js`、`assets/js/vault.js` | 深藍專業儀表板首頁 + 緊湊卡片（標題下方灰色說明框、無箭頭、無底部附屬列、移除重複官網卡片）+ 除語言學習中心外皆開新分頁 | ✅ **已實作完成** | [plan_card_layout_refinement.md](../dev/plan_card_layout_refinement.md) |
| **工具 1：行程規劃板** | 位於 `trip-planner/index.html` 與 `template-london-35-v4.xlsx`，舊版已歸檔於 `trip-planner/_archive/` | `trip-planner/` 標準化結構（首頁卡片點擊開啟新分頁），並已完成紅隊 XSS 跳脫加固 | ✅ **已實作完成** | [plan_portal_initial_setup.md](../dev/plan_portal_initial_setup.md) |
| **工具 2：語言學習中心** | 位於 `learning-language/index.html` + `topics.json`，連結 `japanese.html` 與 `english.html` | 主頁點擊原頁進入次主題頁；次主題頁小卡片比照緊湊格式且點擊開啟新分頁 | ✅ **已實作完成** | [plan_card_layout_refinement.md](../dev/plan_card_layout_refinement.md) |
| **工具 3：純淨網頁列印** | 位於 `web-print/index.html`，活文件 `guide.html` 與 `history.html` 均保留在 `web-print/` 主目錄 | `web-print/` 標準化結構（首頁卡片點擊開啟新分頁）、活文件保留於第一層目錄且工具內建頂部導覽 | ✅ **已實作完成** | [plan_portal_initial_setup.md](../dev/plan_portal_initial_setup.md) |
| **AI Skill 規範檔** | 位於 `_skills/gemini-code-1795498926267.md` | 獨立收納至根目錄 `_skills/` | ✅ **已實作完成** | [plan_portal_initial_setup.md](../dev/plan_portal_initial_setup.md) |
