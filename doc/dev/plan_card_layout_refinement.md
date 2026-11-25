# 📋 開發計畫：卡片版面緊湊化與開啟行為調整 (`plan_card_layout_refinement`)

> **計畫編號**：`plan_card_layout_refinement`  
> **建立日期**：2026-11-25  
> **目前狀態**：`✅ 已全數實作、回寫 Spec 並通過測試`  
> **對應規格章節**：[00_overview.md](../spec/00_overview.md), [02_portal_and_ui_design.md](../spec/02_portal_and_ui_design.md)

---

## 1. 變更背景與設計目標

依據使用者實際預覽首頁後的回饋與標註截圖，目前卡片下方帶有附屬按鈕的灰色底欄使卡片高度過大，且右上角導覽列已有「S2 Design 官網」按鈕，無須在卡片區重複放置官網卡片。本次調整旨在讓首頁與語言學習次主題頁的卡片更緊湊精練，並統一工具開啟分頁的互動邏輯。

---

## 2. 具體修改規格（4 大項目）

1. **移除首頁「S2 Design 官方網站」卡片**：
   - 於 [`data/tools.json`](../../data/tools.json) 移除 `id: "s2-design"` 項目（連帶使分類篩選列不再出現「個人品牌」頁籤），僅保留頂部 Header 右上角的「S2 Design 官網」按鈕。
2. **取消底部灰色附屬按鈕欄，將卡片下半截改為以橫線分隔的滿版灰色說明區**：
   - 完全移除原本卡片底部的 `.card-footer`（取消附屬小按鈕如「倫敦樣板」、「冬季旅遊日文/英文」、「操作說明」、「改版紀錄」與右下角「開啟規劃板 >」等文字）。
   - 在**標題區塊下方以一條滿版橫線（`border-top: 1px solid var(--line-default)`）切分**，使整個卡片下半截填滿淺灰色（`--bg-subtle: #F4F7FB`，非框中框小卡片），將每張卡片的說明文字（`.card-desc`）直接放在下半截灰色區域內，並適度縮小卡片內距、圖示尺寸與總高度。
3. **移除標題後方的小箭頭符號**：
   - 於 [`assets/js/portal.js`](../../assets/js/portal.js) 移除 `.card-title` 後方動態產生的 `arrow_forward` / `open_in_new` 圖示（`.launch-arrow`）。
4. **統一卡片點擊開啟新分頁邏輯（除「語言學習中心」外皆開新頁面）**：
   - 在 JSON 設定檔支援 `"openInNewTab": true | false` 屬性：
     - **主入口 (`data/tools.json`)**：
       - `learning-language`（語言學習中心）：設為 `"openInNewTab": false`（在原頁面切換至次主題選擇頁）。
       - `trip-planner`（行程規劃板）、`web-print`（純淨網頁列印）及未來工具：設為 `"openInNewTab": true`，點擊卡片時以 `target="_blank" rel="noopener noreferrer"` 開啟新分頁。
     - **語言學習中心次主題頁 (`learning-language/topics.json`)**：
       - 所有語言主題小卡片（`japanese-winter`、`english-us-east`）採用完全相同的緊湊卡片格式（無標題箭頭、無底部按鈕列、說明文字位於標題下方灰色框），且皆設為 `"openInNewTab": true`（點擊開啟新分頁）。

---

## 3. 預計修改檔案與完工檢查清單

- [x] 修改 [`data/tools.json`](../../data/tools.json)：移除 `s2-design` 卡片、移除 `subLinks` 與 `actionLabel`、設定 `openInNewTab`。
- [x] 修改 [`learning-language/topics.json`](../../learning-language/topics.json)：移除 `actionLabel`、設定 `"openInNewTab": true`。
- [x] 修改 [`assets/js/portal.js`](../../assets/js/portal.js)：移除標題後方箭頭圖示、移除 `.card-footer` 渲染、將 `.card-desc` 放入標題下方的灰色框容器、並依據 `item.openInNewTab || item.isExternal` 加上 `target="_blank" rel="noopener noreferrer"`。
- [x] 修改 [`assets/css/dashboard.css`](../../assets/css/dashboard.css)：調整 `.tool-card` 緊湊度與標題下方灰色說明框樣式。
- [x] 完工後同步回寫更新 [`doc/spec/00_overview.md`](../spec/00_overview.md)、[`doc/spec/02_portal_and_ui_design.md`](../spec/02_portal_and_ui_design.md)、[`DESIGN.md`](../../DESIGN.md) 與 [`README.md`](../../README.md)。
- [x] 執行冒煙與回歸測試、跨模型紅隊檢查，並提交《發布前 5 項資安檢查報告》。
