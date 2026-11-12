# EASON STUDIO — 一頁式 GitHub Pages 網站 V2.1

所有前台內容都在 `index.html`；頂部導覽順序為「關於工作室 → 服務項目 → 作品集 → 聯絡合作」，點擊後在同一頁捲動。作品詳情以彈出視窗顯示，不會換頁。

## 檔案功能
- `index.html`：首頁、關於工作室、服務、作品、聯絡表單（單頁）。
- `css/style.css`：視覺樣式、科技漸層與手機版。
- `js/main.js`：手機選單、區塊高亮、聯絡表單。
- `js/portfolio.js`：載入 JSON、分類篩選、作品詳情彈窗、YouTube 影片。
- `data/projects.json`：作品名稱、摘要、分類、圖片、YouTube、公開狀態和排序。新增作品只需編輯 JSON 並上傳對應圖片。
- `assets/images/projects/`：作品示範圖與替換用圖片。
- `assets/icons/favicon.svg`：分頁圖示。
- `.nojekyll`：GitHub Pages 發布設定。

## 本機預覽
在資料夾內執行 `python -m http.server 8000`，開啟 `http://localhost:8000/`。作品資料透過 fetch 讀取，請勿直接雙擊 HTML 使用 file:// 開啟。

## 上傳 GitHub Pages
將 ZIP 解壓縮後**內容**上傳至 `kevinwang2201/eason-studio` 儲存庫根目錄（main 分支）。Settings → Pages → Deploy from a branch → main / (root)。

**重要：** 此版本移除了舊版 `about.html`、`services.html`、`portfolio.html`、`project.html`、`contact.html`。如果先前已上傳舊版，請在 GitHub 儲存庫刪除這五個舊檔案，以免殘留可存取的舊頁面。

## 修改作品
編輯 `data/projects.json`：`published: true` 代表顯示，`false` 代表隱藏；`cover` 與 `images` 放 `assets/images/projects/` 開頭的相對路徑；`youtube` 可放 YouTube watch / shorts / youtu.be URL。`order` 越小越前面。編輯 JSON 時注意括號、逗號和雙引號。

## 聯絡表單
預設不會真正寄信，也不儲存詢價資料。請先到 `js/main.js` 將 `STUDIO_CONFIG.contactEmail` 設為自己的公開工作室 Email；送出後會啟動訪客郵件應用程式，訪客必須自行寄出。

## 限制
GitHub Pages 是靜態網站，不提供登入後台或資料庫。作品由 GitHub 網頁直接編輯。請勿公開帳密、API Key 或客戶私密資料。
