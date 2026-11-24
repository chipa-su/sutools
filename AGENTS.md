# 🤖 AGENTS.md — AI 代理與協作開發最高行為準則

> 本文件為所有參與「蘇的工具箱 / SU's TOOLBOX」專案之 AI Agent 與開發者的**強制性行為規範（Mandatory Rules）**。任何程式碼修改、擴充、測試與 Git 發布均須無條件遵守以下條款。

---

## 📜 規則一：文件生命周期、「計畫先行、完工回寫」與「跨電腦無縫接續」鐵律

> **核心精神**：確保使用者在**切換不同電腦環境、或開啟全新對話階段**維護本專案時，只需閱讀 `doc/spec/` 與 `doc/dev/`，就能 100% 理解專案當下的真實樣貌，並立即無縫接續開發或維護。

1. **換電腦 / 新階段接手時（Onboarding & Spec Drift Check）**：
   - 當在新電腦環境開啟專案、或開始新的維護階段時，必須先讀取 [doc/spec/00_overview.md](doc/spec/00_overview.md) 與 `doc/dev/` 下的計畫書，並與工作區實際檔案結構比對。
   - **若發現使用者已手動修改過程式碼導致 `doc/spec/` 落後於實作成果，必須優先將 `doc/spec/` 補齊跟上實作現況**，確保規格書永遠反映最新事實（As-Is Reality）。
2. **功能開發前（Plan First in `doc/dev/`）**：
   - 在動手開發任何新功能或重構之前，必須先與使用者討論確認方向，並在 `doc/dev/` 目錄下建立或更新開發計畫，檔名格式強制為 **`plan_<功能名稱>.md`**（例如 `doc/dev/plan_portal_initial_setup.md`）。
   - 開發過程中必須嚴格參照該計畫書執行。
3. **功能開發完成後（Sync Back to `doc/spec/` & `README.md`）**：
   - 功能實作與測試完成後，必須立即執行 **「Spec vs 實作成果落差檢查（4 項核對清單）」**：
     1. **目錄與檔名核對**：實際資料夾與檔案是否與 [01_architecture_and_naming.md](doc/spec/01_architecture_and_naming.md) 完全一致？
     2. **介面與設定檔核對**：`tools.json` / `topics.json`、Icon 與視覺元件是否與 [02_portal_and_ui_design.md](doc/spec/02_portal_and_ui_design.md) 一致？
     3. **資安與伺服器核對**：`server.js` 防護規則與前端防護是否與 [03_security_and_release_gate.md](doc/spec/03_security_and_release_gate.md) 一致？
     4. **總覽狀態表核對**：[00_overview.md](doc/spec/00_overview.md) 的實作狀態表是否已更新為最新進度？
   - **每次修改或擴充工具時，強制同步更新根目錄的 `README.md`**（包含工具清單、目錄樹結構與更新日誌）。

---

## 📂 規則二：資料夾管控、命名與活文件保留規範

1. **英文 `kebab-case` 命名**：所有工具資料夾與檔名一律採用全小寫英數字與連字號（如 `trip-planner`、`learning-language`、`web-print`），預設入口檔統一命名為 `index.html`。
2. **活文件（`guide.html` / `history.html`）嚴禁放入 `_archive/`**：
   - 凡是工具附帶的「操作說明 (`guide.html`)」或「改版歷史紀錄 (`history.html`)」，屬於會跟隨改版持續維護與引用的活文件，**必須保留在該工具的主目錄下**，不得丟進 `_archive/`。
   - 只有被新版完全取代的歷史快照（如 `v4`、`v5` 舊檔）才放入 `_archive/`。
3. **Skill 檔案專區**：所有 AI Skill 與提示詞範本（如 `gemini-code-1795498926267.md`）一律集中收納於根目錄的 **`_skills/`** 資料夾。
4. **視覺與 Icon 一致性**：遵循 [DESIGN.md](DESIGN.md)，採用「深藍專業儀表板風」，所有卡片代表 Icon 統一從 **Google Material Symbols Outlined** 字型庫選用。

---

## 🗄️ 規則三：資料庫分支與 SQLite 強制規範

- 當未來任何工具或系統功能需要引入後端資料庫（Database）時：
  1. **強制先開立新的 Git 分支（Branch）**（例如 `git checkout -b feat/sqlite-<功能名稱>`），嚴禁直接在主分支上破壞純靜態相容架構。
  2. **後端資料庫強制改用 SQLite**（單一檔案型資料庫），並遵循以下資安要求：
     - 強制使用 **Parameterized Queries（參數化查詢）** 防範 SQL Injection。
     - 資料庫實例檔案（`*.sqlite`, `*.sqlite3`, `*.db`）必須加入 `.gitignore` 並在本地 HTTP 伺服器 (`server.js`) 列入禁止直接下載黑名單。

---

## 🧪 規則四：測試驗證與跨模型紅隊檢查（Testing & Red Team Policy）

每次完成環境建置或重大功能變更時，必須執行以下三層驗證：
1. **冒煙測試（Smoke Test）**：透過 `start-server.ps1` 啟動本地伺服器，驗證 `/__health` 端點與核心頁面是否能以 `HTTP 200` 正常回應，且透過 `stop-server.ps1` 能乾淨關閉不留殘留程序。
2. **回歸測試（Regression Test）**：全面檢查既有工具（行程規劃板、旅遊日文/英文、網頁列印及其操作手冊与歷史紀錄）檔案完整性、靜態資源載入與內部連結無斷連。
3. **紅隊資安檢查（Red Team Audit — 強制切換不同模型執行）**：
   - 執行紅隊檢查時，**必須呼叫子代理（Subagent）並明確切換為不同模型**（例如主代理為 Pro/High 時，切換子代理 `Model: "flash"` 或反之），從攻擊者視角獨立測試本地伺服器（Path Traversal 目錄穿越、敏感隱藏檔存取、HTTP Method 濫用）與前端程式碼（硬編碼金鑰、XSS 注入、Tabnabbing 漏洞）。

---

## 🛡️ 規則五：Git 發布前強制資安審查與使用者授權關卡（Pre-Release Security Gate）

> [!CAUTION]
> **最高天條：未完成資安檢查回報並取得使用者明確同意前，嚴禁執行 `git commit` 或 `git push`！**

每次準備將修改或新模組透過 Git 發布前，Agent 必須先執行並向使用者回報以下 **《發布前 5 項資安檢查報告》**：
1. **🔑 機密金鑰掃描**：確認所有檔案無硬編碼 API Key、Token 或帳密（若有 API 需求須改用 BYOK 本地 `vault.js` 保險箱）。
2. **🕵️ 個人隱私檢查**：確認無未脫敏之個人真實隱私資料。
3. **💉 注入與 XSS 檢查**：確認無不安全的 `innerHTML`、路徑穿越或未過濾輸入。
4. **📦 外部資源與連結安全**：確認外部連結皆包含 `rel="noopener noreferrer"`，CDN 來源安全。
5. **📝 版控清單與文件同步**：列出 `git status` 預計提交之檔案，確認 `README.md` 與 `doc/spec/` 已同步更新。

**👉 僅在使用者審閱報告並回覆「同意」後，方可執行 Git 提交與發布指令。**
