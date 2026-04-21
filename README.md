# 寶璣建設官方網站（Astro 版本）

> 以 Astro 5 重建的 bqfox.com，內建 SEO、GEO 優化、301 轉址、sitemap 自動產生。

## 🎯 這版做了什麼（對比舊站）

| 項目 | 舊站（GoDaddy → Cloudflare + 靜態 HTML） | 新站（Astro） |
|---|---|---|
| URL 結構 | 中文路徑（encoded 成亂碼） | 英文 slug，SEO 友善 |
| sitemap.xml | ❌ 無 | ✅ 自動產生 + 優先級設定 |
| robots.txt | ❌ 無 | ✅ 含 AI 爬蟲明確允許 |
| 301 轉址 | ❌ 無 | ✅ 806 條規則，覆蓋全部 811 個舊 URL |
| JSON-LD Schema | ❌ 幾乎無 | ✅ Organization / Article / FAQ / Breadcrumb 全面導入 |
| Content Collections | ❌ 逐篇寫 HTML | ✅ Markdown + frontmatter 驗證 |
| OG / Twitter Card | ❌ 不完整 | ✅ 全面覆蓋 |
| RSS Feed | ❌ 無 | ✅ /rss.xml |
| 404 頁面 | ❌ 預設 | ✅ 友善引導到服務頁 |

## 📁 專案結構

```
bqfox-v3/
├── astro.config.mjs          # Astro 主設定（含 sitemap）
├── package.json              # 依賴管理
├── src/
│   ├── content/
│   │   ├── config.ts         # Content Collection Schema 定義
│   │   ├── articles/         # 文章 Markdown（目前 2 篇範例）
│   │   └── services/         # 服務頁 Markdown（8 篇）
│   ├── components/
│   │   ├── SEO.astro         # SEO head（meta、OG、JSON-LD）
│   │   ├── Nav.astro         # 導覽列
│   │   └── Footer.astro      # 頁腳
│   ├── layouts/
│   │   ├── BaseLayout.astro  # 基礎 layout
│   │   └── ArticleLayout.astro  # 文章頁 layout（含 FAQ Schema）
│   ├── pages/
│   │   ├── index.astro       # 首頁
│   │   ├── about.astro       # 關於我們
│   │   ├── contact.astro     # 聯絡諮詢
│   │   ├── 404.astro         # 404 頁
│   │   ├── rss.xml.js        # RSS Feed
│   │   ├── services/
│   │   │   ├── index.astro   # 服務總覽
│   │   │   └── [...slug].astro  # 動態服務頁
│   │   └── blog/
│   │       ├── index.astro   # 文章列表（分類篩選）
│   │       └── [...slug].astro  # 動態文章頁
│   ├── lib/
│   │   └── schemas.ts        # JSON-LD Schema.org 產生器
│   └── styles/
│       └── global.css        # 全站樣式（深色+金色）
├── public/
│   ├── _redirects            # Cloudflare 301 規則（806 條）
│   ├── robots.txt            # 爬蟲規則
│   ├── favicon.svg           # 璣字金色 logo
│   └── logo.svg              # 大尺寸 logo
├── scripts/
│   └── generate-redirects.py # _redirects 產生器（未來補 URL 可以重跑）
└── docs/
    ├── gsc-urls.json         # GSC 匯出的 811 個舊 URL
    ├── url-mapping.json      # URL 對照表
    └── URL-MAPPING-REVIEW.md # 人類可讀的對照表
```

## 🚀 快速開始

### 1. 本機預覽（需要 Node.js 18+）

```bash
npm install
npm run dev
```

打開 http://localhost:4321 即可預覽。

### 2. 本機 build 測試

```bash
npm run build
```

輸出在 `dist/` 資料夾，可以用 `npm run preview` 檢視 build 後版本。

### 3. 部署到 Cloudflare Pages

**方法 A：上 GitHub → Cloudflare Pages 自動部署（推薦）**

1. 把整個 `bqfox-v3` 資料夾 push 到 `kunyucorp-gif/bqfox-site` repo 的新分支（例如 `astro-rebuild`）
2. 到 Cloudflare Dashboard → Workers & Pages → `bqfox-site` 專案 → Settings → Builds & deployments
3. **修改 Build command**：`npm run build`
4. **修改 Build output directory**：`dist`
5. 儲存後 Cloudflare 會自動重新部署
6. 測試成功後再合併到 `main` 分支

**方法 B：Wrangler CLI 手動部署**

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name=bqfox-site
```

## ✅ 部署後必做

1. **提交新 sitemap 到 Google Search Console**
   - 位置：https://www.bqfox.com/sitemap-index.xml
   - Search Console → Sitemaps → 新增：`sitemap-index.xml`

2. **確認 301 轉址生效**
   - 測試：`curl -I "https://www.bqfox.com/三七五租約解約"` 應回 301 + Location: `/services/tenancy-375/`

3. **阻擋 Cloudflare 預覽網域被索引**
   - 到 Cloudflare Dashboard → Bulk Redirects 或 Page Rules
   - 針對 `*.pages.dev/*` 加 `X-Robots-Tag: noindex`

4. **監控索引恢復**
   - Search Console → 頁面 → 觀察「已建立索引」數字變化（約 2-4 週穩定）

## 📝 新增文章

在 `src/content/articles/` 建一個新的 `.md` 檔案：

```markdown
---
title: 文章標題
description: 150 字內的摘要
pubDate: 2026-04-21
category: 道路用地   # 必須是 config.ts 中定義的分類
articleType: 教學
faq:
  - question: 問題 1
    answer: 答案 1
---

## 第一段 H2

內文⋯⋯

:::callout
**重點提示**：可以用這種 callout 樣式
:::
```

檔案存好後 `npm run dev` 就能立即看到。

## 🔜 待完成清單

- [ ] 批量遷移現有 58 篇文章（從 `kunyucorp-gif/bqfox-site` repo 的 `blog/articles/`）
- [ ] 完整補齊 7 個服務頁內容（目前是 placeholder）
- [ ] 使用 Wayback Machine 搶救 363 篇舊文章（方案 C 第二階段）
- [ ] 製作 og-default.png
- [ ] 加入 Google Analytics / Search Console 驗證

---

© 2012–2026 寶璣建設有限公司
