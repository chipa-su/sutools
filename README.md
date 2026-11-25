# 🛠️ 蘇的工具箱 / SU's TOOLBOX

個人與家庭跨平台 Web 小工具入口平台。採用 **深藍專業儀表板風（Navy Professional Dashboard）** 與 **Google Material Symbols Outlined** 圖示系統，結合本地零相依安全開發伺服器、嚴謹的文件治理（`doc/spec` & `doc/dev`）、BYOK 本地金鑰保險箱與 Git 發布前強制資安審查機制。

- **官方品牌連結**：[S2 Design (https://s2design.com.tw/)](https://s2design.com.tw/)
- **設計規範**：[DESIGN.md](DESIGN.md)
- **AI 協作與資安準則**：[AGENTS.md](AGENTS.md)
- **系統規格書總覽**：[doc/spec/00_overview.md](doc/spec/00_overview.md)
- **開發計畫紀錄**：[doc/dev/plan_portal_initial_setup.md](doc/dev/plan_portal_initial_setup.md)、[doc/dev/plan_card_layout_refinement.md](doc/dev/plan_card_layout_refinement.md)、[doc/dev/plan_ai_ocr_tools_integration.md](doc/dev/plan_ai_ocr_tools_integration.md)

---

## 🚀 本地伺服器快速啟停 (Local Dev Server)

本專案內建經紅隊資安加固的零相依 Node.js 本地伺服器（嚴格綁定本機 `http://127.0.0.1:8080/`）：

### 方式 A：PowerShell 指令啟停
```powershell
# 啟動本地伺服器（加 -OpenBrowser 可自動開啟瀏覽器）
.\start-server.ps1

# 關閉本地伺服器
.\stop-server.ps1
```

### 方式 B：Windows 檔案總管雙擊啟停
- 雙擊 **`start-server.bat`**：背景啟動伺服器並自動開啟瀏覽器預覽 `http://127.0.0.1:8080/`。
- 雙擊 **`stop-server.bat`**：安全關閉背景伺服器並清理暫存 PID。

---

## 🧰 工具箱收錄清單 (Tools Inventory)

| 卡片名稱 | 標準路徑 | 版本 / 類型 | 開啟方式 | Google Icon | 功能簡介與活文件連結 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **蘇的工具箱 (主入口)** | [`/index.html`](index.html) | `v1.2.0` | 主頁面 | `home_repair_service` | 跨平台緊湊工具卡片總覽、分類篩選、即時搜尋、右上角 S2 Design 官網連結與 BYOK 金鑰保險箱（設定檔：[`data/tools.json`](data/tools.json)） |
| **行程規劃板** | [`/trip-planner/`](trip-planner/index.html) | `v6.0` | **新分頁** | `map` | 多日行程排程、Leaflet 互動地圖、QR Code 分享。目錄內含樣板：[`template-london-35-v4.xlsx`](trip-planner/template-london-35-v4.xlsx) |
| **語言學習中心** | [`/learning-language/`](learning-language/index.html) | `2 主題` | **原頁面** (次主題卡開新分頁) | `translate` | 次主題入口頁（設定檔：[`learning-language/topics.json`](learning-language/topics.json)），內含兩張開啟新分頁之主題卡：<br/>• [冬季旅遊日文實戰手冊 (`japanese.html`)](learning-language/japanese.html)<br/>• [美東旅遊英文實戰手冊 (`english.html`)](learning-language/english.html) |
| **純淨網頁列印** | [`/web-print/`](web-print/index.html) | `v2.2` | **新分頁** | `print` | 多通道正文擷取、1:1 A4 分頁格線模擬與無干擾列印。工具頂部內建活文件導覽按鈕（保留於主目錄）：<br/>• [互動操作說明 (`guide.html`)](web-print/guide.html)<br/>• [版本演進日誌 (`history.html`)](web-print/history.html) |
| **智能發票報帳辨識** | [`/invoice-scanner/`](invoice-scanner/index.html) | `BYOK AI` | **新分頁** | `receipt_long` | 台灣電子發票 QR Code 本地條碼直讀結合 Gemini AI 店名與報帳分類辨識，支援單筆編輯與一鍵匯出 Excel 報帳表（連動 `vault.js` 金鑰保險箱） |
| **影印機計數清單擷取** | [`/copier-counter/`](copier-counter/index.html) | `BYOK AI` | **新分頁** | `document_scanner` | 批次上傳事務機計數清單照片，透過 Gemini AI 自動擷取右上角日期與黑白/全彩讀數，一鍵複製貼入 Excel（連動 `vault.js` 金鑰保險箱） |

---

## ➕ 如何擴充新工具或新語言主題？

1. **新增第一層工具卡片**：
   - 先於 `doc/dev/plan_<功能名稱>.md` 建立計畫。
   - 在根目錄建立英文 `kebab-case` 資料夾（如 `expense-splitter/`），主檔命名為 `index.html`（若有手冊或歷史紀錄則命名為 `guide.html`、`history.html` 並留在該工具第一層目錄）。
   - 於 [`data/tools.json`](data/tools.json) 的 `tools` 陣列新增一筆設定（圖示名稱從 [Google Material Symbols](https://fonts.google.com/icons) 選用）。
   - 完工後同步回寫 `doc/spec/` 與本 `README.md`。
2. **在「語言學習中心」新增次主題卡片**：
   - 將新語言手冊 HTML 放入 `learning-language/`（如 `korean.html`）。
   - 於 [`learning-language/topics.json`](learning-language/topics.json) 的 `topics` 陣列新增一筆主題卡片設定，並同步更新本 `README.md`。
3. **若未來工具需要後端資料庫**：
   - 依據 [AGENTS.md 規則三](AGENTS.md)，**強制先開立新的 Git 分支**（如 `git checkout -b feat/sqlite-<功能>`），並**統一採用 SQLite**。

---

## 📂 專案目錄樹 (Directory Tree)

```text
tools/
├── index.html                          # 【主入口首頁】蘇的工具箱 / SU's TOOLBOX
├── assets/                             # 全站共用靜態資源
│   ├── css/
│   │   └── dashboard.css               # 深藍專業儀表板共用樣式表
│   └── js/
│       ├── portal.js                   # 資料驅動卡片渲染、分類篩選與搜尋引擎 (Zero-innerHTML)
│       └── vault.js                    # 本地 API Key 保險箱模組 (BYOK 資安防護)
├── data/
│   └── tools.json                      # 【主入口註冊表】首頁所有工具卡片設定
├── _skills/                            # 【AI Skills 與開發提示詞專區】
│   └── gemini-code-1795498926267.md
├── trip-planner/                       # 【工具 1】行程規劃板
│   ├── index.html                      # 主程式 (v6.0)
│   ├── template-london-35-v4.xlsx      # 倫敦 35 點匯入樣板
│   └── _archive/                       # 歷史舊版備份區 (v4, v5, v6)
├── learning-language/                  # 【工具 2】語言學習中心
│   ├── index.html                      # ★ 次主題選擇入口頁
│   ├── topics.json                     # ★ 次主題卡片設定檔
│   ├── japanese.html                   # 冬季旅遊日文實戰手冊
│   └── english.html                    # 美東旅遊英文實戰手冊
├── web-print/                          # 【工具 3】純淨網頁列印
│   ├── index.html                      # 主程式 (v2.2)
│   ├── guide.html                      # ★ 互動操作手冊 (活文件，保留於主目錄)
│   └── history.html                    # ★ 版本演進日誌 (活文件，保留於主目錄)
├── invoice-scanner/                    # 【工具 4】智能發票報帳辨識 (BYOK Gemini AI + QR 直讀)
│   └── index.html
├── copier-counter/                     # 【工具 5】影印機計數清單擷取 (BYOK Gemini AI 批次擷取)
│   └── index.html
├── doc/
│   ├── spec/                           # 【正式規格書】(分章節撰寫，跨電腦無縫接續基準)
│   │   ├── 00_overview.md
│   │   ├── 01_architecture_and_naming.md
│   │   ├── 02_portal_and_ui_design.md
│   │   ├── 03_security_and_release_gate.md
│   │   └── 04_workflow_and_database_policy.md
│   └── dev/                            # 【開發計畫區】(plan_<功能名稱>.md)
│       ├── plan_portal_initial_setup.md
│       ├── plan_card_layout_refinement.md
│       └── plan_ai_ocr_tools_integration.md
├── server.js                           # 本地安全開發伺服器 (Node.js 127.0.0.1:8080)
├── start-server.ps1 / start-server.bat # 啟動伺服器腳本
├── stop-server.ps1  / stop-server.bat  # 關閉伺服器腳本
├── DESIGN.md                           # 視覺、圖示與系統架構設計規範
├── AGENTS.md                           # AI 代理開發、SQLite 分支與 Git 資安審查最高準則
├── .gitignore                          # Git 機密與暫存檔過濾清單
└── README.md                           # 專案總覽與操作手冊（每次異動強制同步更新）
```

---

## 📝 更新日誌 (Changelog)

- **2026-11-25 (v1.2.0)**：
  - **新增兩項 BYOK Gemini AI 辨識工具**（詳見 [`doc/dev/plan_ai_ocr_tools_integration.md`](doc/dev/plan_ai_ocr_tools_integration.md)）：
    1. 新增 [`invoice-scanner/index.html`](invoice-scanner/index.html)（**智能發票報帳辨識**）與 [`copier-counter/index.html`](copier-counter/index.html)（**影印機計數清單擷取**），並在首頁註冊兩張獨立緊湊卡片（分類：`AI 辨識`）。
    2. 兩項工具全面統一為 **深藍專業儀表板風（Navy Professional Dashboard）** 與 **Google Material Symbols Outlined** 圖示系統。
    3. 完成 4 道資安加固：打通 `assets/js/vault.js` 全站金鑰保險箱（支援 Session 暫存與 Local 記憶互通）、Gemini API Key 改由 `x-goog-api-key` HTTP Header 傳送（不暴露於 URL）、全欄位 `escapeHtml()` 防範 DOM XSS、外部連結補齊 `rel="noopener noreferrer"`。
- **2026-11-25 (v1.1.1)**：
  - 新增跨裝置靜態資源防快取版本參數（Cache-Busting `?v=1.1.1`）於 `index.html` 與 `learning-language/index.html`，確保 GitHub Pages 更新後手機與電腦瀏覽器皆能自動載入最新樣式與設定。
- **2026-11-25 (v1.1.0)**：
  - **卡片版面緊湊化改版**（詳見 [`doc/dev/plan_card_layout_refinement.md`](doc/dev/plan_card_layout_refinement.md)）：
    1. 移除首頁重複的「S2 Design 官方網站」卡片（保留頂部導覽列右上角官網按鈕）。
    2. 取消卡片底部灰色附屬按鈕欄，將灰色區塊上移至標題下方包覆說明文字（`.card-desc-box`），大幅縮減卡片高度。
    3. 移除卡片標題後方的小箭頭符號。
    4. 除「語言學習中心」在原頁面切換外，其餘所有工具卡片及語言學習第二頁的主題小卡片皆統一為點擊開啟新分頁（`target="_blank" rel="noopener noreferrer"`）。
- **2026-11-24 (v1.0.0)**：
  - 完成資料夾與檔名標準化英文 `kebab-case` 重構（`trip-planner/`、`learning-language/`、`web-print/`、`_skills/`），保留 `web-print/guide.html` 與 `history.html` 於工具第一層主目錄。
  - 完成深藍專業儀表板風主入口首頁 (`index.html` + `data/tools.json`) 與語言學習次主題入口頁 (`learning-language/index.html` + `topics.json`)，全面採用 Google Material Symbols Outlined 圖示，並收錄 `https://s2design.com.tw/` 官方品牌卡片。
  - 完成 BYOK 本地 API 金鑰保險箱 (`assets/js/vault.js`) 與既有工具 XSS / Tabnabbing 紅隊強化修補。
- **2026-11-24 (v0.1.0-env)**：
  - 建立本地開發伺服器 (`server.js`) 與啟停腳本、`doc/spec/`、`doc/dev/`、`DESIGN.md` 與 `AGENTS.md`。
