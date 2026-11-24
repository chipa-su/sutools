# 🛠️ 蘇的工具箱 / SU's TOOLBOX

個人與家庭跨平台 Web 小工具入口平台。採用 **深藍專業儀表板風（Navy Professional Dashboard）** 與 **Google Material Symbols Outlined** 圖示系統，結合本地零相依安全開發伺服器、嚴謹的文件治理（`doc/spec` & `doc/dev`）、BYOK 本地金鑰保險箱與 Git 發布前強制資安審查機制。

- **官方品牌連結**：[S2 Design (https://s2design.com.tw/)](https://s2design.com.tw/)
- **設計規範**：[DESIGN.md](DESIGN.md)
- **AI 協作與資安準則**：[AGENTS.md](AGENTS.md)
- **系統規格書總覽**：[doc/spec/00_overview.md](doc/spec/00_overview.md)
- **開發計畫紀錄**：[doc/dev/plan_portal_initial_setup.md](doc/dev/plan_portal_initial_setup.md)

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

| 卡片名稱 | 標準路徑 | 版本 / 類型 | Google Icon | 功能簡介與活文件連結 |
| :--- | :--- | :--- | :--- | :--- |
| **蘇的工具箱 (主入口)** | [`/index.html`](index.html) | `v1.0.0` | `home_repair_service` | 跨平台工具總覽、分類篩選、即時搜尋與 BYOK 金鑰保險箱（設定檔：[`data/tools.json`](data/tools.json)） |
| **行程規劃板** | [`/trip-planner/`](trip-planner/index.html) | `v6.0` | `map` | 多日行程排程、Leaflet 互動地圖、QR Code 分享。附屬樣板：[`template-london-35-v4.xlsx`](trip-planner/template-london-35-v4.xlsx) |
| **語言學習中心** | [`/learning-language/`](learning-language/index.html) | `Multi-Topic` | `translate` | 次主題入口頁（設定檔：[`learning-language/topics.json`](learning-language/topics.json)），內含：<br/>• [冬季旅遊日文實戰手冊 (`japanese.html`)](learning-language/japanese.html)<br/>• [美東旅遊英文實戰手冊 (`english.html`)](learning-language/english.html) |
| **純淨網頁列印** | [`/web-print/`](web-print/index.html) | `v2.2` | `print` | 多通道正文擷取、1:1 A4 分頁格線模擬與無干擾列印。附屬活文件（保留於主目錄）：<br/>• [互動操作說明 (`guide.html`)](web-print/guide.html)<br/>• [版本演進日誌 (`history.html`)](web-print/history.html) |
| **S2 Design 官方網站** | `https://s2design.com.tw/` | `OFFICIAL` | `captive_portal` | 蘇的官方設計品牌與作品集網站（外部連結卡片） |

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
│   └── tools.json                      # 【主入口註冊表】首頁所有工具卡片與 S2 Design 官網連結
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
├── doc/
│   ├── spec/                           # 【正式規格書】(分章節撰寫，跨電腦無縫接續基準)
│   │   ├── 00_overview.md
│   │   ├── 01_architecture_and_naming.md
│   │   ├── 02_portal_and_ui_design.md
│   │   ├── 03_security_and_release_gate.md
│   │   └── 04_workflow_and_database_policy.md
│   └── dev/                            # 【開發計畫區】(plan_<功能名稱>.md)
│       └── plan_portal_initial_setup.md
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

- **2026-11-24 (v1.0.0)**：
  - 完成資料夾與檔名標準化英文 `kebab-case` 重構（`trip-planner/`、`learning-language/`、`web-print/`、`_skills/`），保留 `web-print/guide.html` 與 `history.html` 於工具第一層主目錄。
  - 完成深藍專業儀表板風主入口首頁 (`index.html` + `data/tools.json`) 與語言學習次主題入口頁 (`learning-language/index.html` + `topics.json`)，全面採用 Google Material Symbols Outlined 圖示，並收錄 `https://s2design.com.tw/` 官方品牌卡片。
  - 完成 BYOK 本地 API 金鑰保險箱 (`assets/js/vault.js`) 與既有工具 XSS / Tabnabbing 紅隊強化修補。
- **2026-11-24 (v0.1.0-env)**：
  - 建立本地開發伺服器 (`server.js`) 與啟停腳本、`doc/spec/`、`doc/dev/`、`DESIGN.md` 與 `AGENTS.md`。
