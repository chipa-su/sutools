# 第 02 章：入口介面與視覺設計規格

> **章節狀態**：✅ 已全數實作完成（詳見 [index.html](../../index.html)、[learning-language/index.html](../../learning-language/index.html)、[assets/css/dashboard.css](../../assets/css/dashboard.css) 與 [assets/js/portal.js](../../assets/js/portal.js)）。

---

## 2.1 視覺主題：深藍專業儀表板風 (Navy Professional Dashboard)

整體視覺承襲「行程規劃板 (Trip Board)」的深藍儀表板美學，強調高資訊清晰度、沉穩質感與跨裝置響應式（RWD）體驗：

- **色彩系統 (Color Tokens)**：
  - `--bg-canvas`: `#EDF0F6`（淺灰藍背景搭配微細幾何點陣網格）
  - `--bg-header`: `#1B2B47`（深海藍頂部導覽列）
  - `--text-header`: `#F4F7FD`（導覽列高對比白字）
  - `--text-header-muted`: `#8FA3C4`（導覽列英文副標與次要資訊）
  - `--bg-card`: `#FFFFFF`（純白卡片面板）
  - `--border-card`: `#D9DFEA`（卡片預設邊框）
  - `--text-primary`: `#17233B`（深藍黑主文字）
  - `--text-secondary`: `#5B6B85`（次要說明文字）
  - `--accent-primary`: `#0B7285`（青藍強調色，用於主要按鈕、Icon 徽章與 Hover 邊框）
  - `--accent-soft`: `#E3F3F5`（Icon 徽章淺青底色）

- **字體排印 (Typography)**：
  - 中文與無襯線主字體：`"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`
  - 英文副標與版本號等寬字體：`"IBM Plex Mono", "Consolas", "Courier New", monospace`

---

## 2.2 圖示規範：Google Material Symbols (Outlined)

所有卡片代表 Icon 與操作小圖示，**強制統一採用 Google Fonts 官方提供的 Material Symbols Outlined**，不使用雜亂的第三方圖片或不一致的 Emoji：

- **CDN 引入標準**：
  ```html
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  ```
- **核心卡片 Icon 配置**：
  - 行程規劃板 (`trip-planner`)：`map`
  - 語言學習中心 (`learning-language`)：`translate`
    - 冬季旅遊日文手冊：`flight_takeoff`（或 `menu_book`）
    - 美東旅遊英文手冊：`record_voice_over`（或 `public`）
  - 純淨網頁列印 (`web-print`)：`print`
  - S2 Design 官方網站 (`https://s2design.com.tw/`)：`captive_portal`（或 `design_services`）

---

## 2.3 資料驅動結構 (`data/tools.json` & `learning-language/topics.json`)

主入口頁面 (`index.html`) 與次主題頁面 (`learning-language/index.html`) 均由 JSON 設定檔驅動渲染，確保日後新增工具只需編輯 JSON：

```json
{
  "portalTitle": "蘇的工具箱",
  "portalSubtitle": "SU's TOOLBOX",
  "tools": [
    {
      "id": "trip-planner",
      "title": "行程規劃板",
      "subtitle": "TRIP BOARD",
      "version": "v6.0",
      "category": "旅遊出行",
      "icon": "map",
      "description": "支援多日行程排程、Leaflet 互動地圖、Excel 樣板匯入與 QR Code 分享。",
      "url": "./trip-planner/",
      "isExternal": false,
      "subLinks": [
        { "label": "下載倫敦樣板 (.xlsx)", "url": "./trip-planner/template-london-35-v4.xlsx", "icon": "download" }
      ]
    },
    {
      "id": "learning-language",
      "title": "語言學習中心",
      "subtitle": "LANGUAGE HUB",
      "version": "Multi-Topic",
      "category": "語言學習",
      "icon": "translate",
      "description": "高對比、老花眼友善的旅遊與實戰外語會話手冊集（內含日文、英文等主題卡片）。",
      "url": "./learning-language/",
      "isExternal": false,
      "subLinks": [
        { "label": "冬季旅遊日文", "url": "./learning-language/japanese.html", "icon": "menu_book" },
        { "label": "美東旅遊英文", "url": "./learning-language/english.html", "icon": "public" }
      ]
    },
    {
      "id": "web-print",
      "title": "純淨網頁列印",
      "subtitle": "WEB PRINT STUDIO",
      "version": "v2.2",
      "category": "文書排版",
      "icon": "print",
      "description": "擷取網頁核心正文並提供 1:1 A4 紙張精準排版模擬、字級調整與無干擾列印。",
      "url": "./web-print/",
      "isExternal": false,
      "subLinks": [
        { "label": "操作說明", "url": "./web-print/guide.html", "icon": "help" },
        { "label": "改版紀錄", "url": "./web-print/history.html", "icon": "history" }
      ]
    },
    {
      "id": "s2-design",
      "title": "S2 Design 官方網站",
      "subtitle": "S2DESIGN.COM.TW",
      "version": "OFFICIAL",
      "category": "個人品牌",
      "icon": "captive_portal",
      "description": "前往蘇的設計與官方作品集網站（外部連結）。",
      "url": "https://s2design.com.tw/",
      "isExternal": true,
      "subLinks": []
    }
  ]
}
```
