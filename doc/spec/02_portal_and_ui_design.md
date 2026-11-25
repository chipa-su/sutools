# 第 02 章：入口介面與視覺設計規格

> **章節狀態**：✅ 已全數實作完成（v1.1.1 緊湊兩截式卡片與防快取版，詳見 [index.html](../../index.html)、[learning-language/index.html](../../learning-language/index.html)、[assets/css/dashboard.css](../../assets/css/dashboard.css) 與 [assets/js/portal.js](../../assets/js/portal.js)）。

---

## 2.1 視覺主題：深藍專業儀表板風 (Navy Professional Dashboard)

整體視覺承襲「行程規劃板 (Trip Board)」的深藍儀表板美學，強調高資訊清晰度、沉穩質感與跨裝置響應式（RWD）體驗：

- **色彩系統 (Color Tokens)**：
  - `--bg-canvas`: `#EDF0F6`（淺灰藍背景搭配微細幾何點陣網格）
  - `--board-bg`: `#1B2B47`（深海藍頂部導覽列）
  - `--board-text`: `#F4F7FD`（導覽列高對比白字）
  - `--board-muted`: `#8FA3C4`（導覽列英文副標與次要資訊）
  - `--bg-panel`: `#FFFFFF`（卡片上半截純白面板底色）
  - `--bg-subtle`: `#F4F7FB`（卡片下半截滿版灰色說明區底色）
  - `--line-default`: `#D9DFEA`（卡片外框與上下半截中間滿版橫向分隔線）
  - `--ink-primary`: `#17233B`（深藍黑主文字）
  - `--ink-secondary`: `#5B6B85`（次要說明文字）
  - `--accent-primary`: `#0B7285`（青藍強調色，用於主要按鈕、Icon 徽章與 Hover 邊框）
  - `--accent-soft`: `#E3F3F5`（Icon 徽章淺青底色）

- **字體排印 (Typography)**：
  - 中文與無襯線主字體：`"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`
  - 英文副標與版本號等寬字體：`"IBM Plex Mono", "Consolas", "Courier New", monospace`

---

## 2.2 圖示與緊湊卡片版面規範 (Compact Card & Iconography)

1. **Google Material Symbols (Outlined)**：
   - 所有卡片代表 Icon 與導覽列小圖示，**強制統一採用 Google Fonts 官方提供的 Material Symbols Outlined**。
   - 核心圖示對應：
     - 行程規劃板 (`trip-planner`)：`map`
     - 語言學習中心 (`learning-language`)：`translate`
       - 冬季旅遊日文手冊：`flight_takeoff`
       - 美東旅遊英文手冊：`record_voice_over`
     - 純淨網頁列印 (`web-print`)：`print`
     - Header 右上角 S2 Design 官網按鈕：`captive_portal`
2. **緊湊卡片結構（v1.1 規範）**：
   - **不放置重複的官方網站卡片**：因頂部 Header 右上角已有「S2 Design 官網」按鈕，卡片網格僅呈現實際工具卡片。
   - **標題後方無箭頭符號**：`.card-title` 僅呈現純淨的中文標題文字，不附加 `→` 箭頭圖示。
   - **取消底部附屬按鈕列，卡片下半截改為滿版灰色說明區**：移除原本卡片底部的 `.card-footer` 與附屬小按鈕；在標題下方以一條橫向滿版分隔線（`border-top: 1px solid #D9DFEA`）將卡片切分為上（白底標題區）、下（滿版淺灰底 `#F4F7FB` 說明文字區 `.card-desc-box`）兩截，非框中框設計，有效縮減卡片高度。
3. **點擊開啟分頁邏輯 (`openInNewTab`)**：
   - **主入口 (`data/tools.json`)**：除 **「語言學習中心 (`learning-language`)」** 設為 `"openInNewTab": false`（於原頁面進入第二層次主題頁）外，其餘所有工具卡片皆設為 `"openInNewTab": true`（點擊開啟新分頁並帶入 `target="_blank" rel="noopener noreferrer"`）。
   - **語言學習中心第二頁 (`learning-language/topics.json`)**：所有語言手冊小卡片版面格式與開啟方式完全比照辦理，皆設為 `"openInNewTab": true`（點擊開啟新分頁）。
4. **靜態資源防快取機制 (Cache-Busting `?v=x.y.z`)**：
   - 為防止 GitHub Pages CDN 與跨裝置（特別是手機/平板）瀏覽器快取舊版 CSS、JS 或 JSON，於 `index.html` 與 `learning-language/index.html` 引入 `dashboard.css`、`portal.js`、`vault.js` 及 `data-config-url` 時統一附加版本查詢參數（如 `?v=1.1.1`）。

---

## 2.3 資料驅動結構 (`data/tools.json` & `learning-language/topics.json`)

```json
{
  "portalTitle": "蘇的工具箱",
  "portalSubtitle": "SU's TOOLBOX",
  "updatedAt": "2026-11-25",
  "tools": [
    {
      "id": "trip-planner",
      "title": "行程規劃板",
      "subtitle": "TRIP BOARD",
      "version": "v6.0",
      "category": "旅遊出行",
      "icon": "map",
      "accentColor": "#0B7285",
      "accentSoft": "#E3F3F5",
      "description": "多日自由行排程看板，支援事件庫拖曳、Leaflet 互動地圖路線、Excel 樣板匯入與 QR Code 跨裝置分享。",
      "url": "./trip-planner/",
      "openInNewTab": true,
      "tags": ["旅遊", "行程", "地圖", "Excel", "QR Code", "倫敦"]
    },
    {
      "id": "learning-language",
      "title": "語言學習中心",
      "subtitle": "LANGUAGE HUB",
      "version": "2 主題",
      "category": "語言學習",
      "icon": "translate",
      "accentColor": "#2F9E44",
      "accentSoft": "#E9F5EC",
      "description": "高對比、老花眼友善的實戰外語會話手冊集。點擊進入次主題頁面選擇「冬季旅遊日文」或「美東旅遊英文」。",
      "url": "./learning-language/",
      "openInNewTab": false,
      "tags": ["日文", "英文", "旅遊會話", "語言學習", "發音"]
    },
    {
      "id": "web-print",
      "title": "純淨網頁列印",
      "subtitle": "WEB PRINT STUDIO",
      "version": "v2.2",
      "category": "文書排版",
      "icon": "print",
      "accentColor": "#9C36B5",
      "accentSoft": "#F6EAF9",
      "description": "多通道擷取網頁核心正文，提供 1:1 A4 紙張分頁格線精準模擬、螢光筆標註、字級行距調整與省墨水列印。",
      "url": "./web-print/",
      "openInNewTab": true,
      "tags": ["列印", "A4", "排版", "閱讀器", "Markdown", "文章擷取"]
    }
  ]
}
```
