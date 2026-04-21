# 舊 URL → 新 URL 對照表（初版）

**產出日期**：2026-04-21
**資料來源**：Google `site:bqfox.com` 搜尋（已抓到 ~40 個代表性 URL）
**狀態**：初版，待使用者確認英文 slug 是否採用

---

## 一、URL 結構設計原則

### 新站 URL 架構
```
/                         ← 首頁
/services/                ← 服務總覽
/services/road-land/      ← 道路用地買賣
/services/floor-area-ratio/  ← 容積移轉代辦
/services/tenancy-375/    ← 三七五租約解約
/services/co-ownership/   ← 持份土地買賣
/services/joint-ownership/← 公同共有處理
/services/ancestral-land/ ← 祭祀公業
/services/rezoning-land/  ← 重劃地買賣
/services/cross-strait-inheritance/  ← 兩岸三地繼承
/about/                   ← 關於我們
/contact/                 ← 聯絡我們
/blog/                    ← 文章列表
/blog/[slug]/             ← 單篇文章
```

### 為什麼這樣設計
- `/services/` 語意清楚，對 SEO 和 GEO 都友善（AI 抓取時能理解頁面類型）
- 每個路徑最後加 `/`（trailing slash）統一格式，避免 Cloudflare 自動轉址鏈
- 英文 slug 全部用 kebab-case（連字號）
- 單篇文章不額外加 `/articles/` 層級，直接 `/blog/[slug]/`，URL 更短更好記

---

## 二、服務類別頁對照（8 頁）

| 舊 URL | 新 URL | 分類 |
|---|---|---|
| `/道路用地買賣` | `/services/road-land/` | 道路用地 |
| `/容積移轉代辦` | `/services/floor-area-ratio/` | 容積移轉 |
| `/祭祀公業` | `/services/ancestral-land/` | 祭祀公業 |
| `/公同共有` | `/services/joint-ownership/` | 公同共有 |
| `/三七五租約解約` | `/services/tenancy-375/` | 三七五租約 |
| `/持份土地買賣` | `/services/co-ownership/` | 持分土地 |
| `/重劃地買賣` | `/services/rezoning-land/` | 重劃地 |
| `/兩岸三地繼承` | `/services/cross-strait-inheritance/` | 兩岸繼承 |

---

## 三、文章頁對照（已抓到 34 篇，另有約 24 篇待 Search Console 補）

### 道路用地（11 篇）
- `/f/既成道路地主權利全解析...` → `/blog/road-established/`
- `/首頁/f/馬路學問大！3分鐘看懂「私設/既成/計畫道路」差在哪裡` → `/blog/road-types-comparison/`
- `/f/都市計畫綠地是什麼？...` → `/blog/urban-green-land/`
- `/f/建築套繪管制全解析...` → `/blog/building-trace-regulation/`
- `/f/道路用地可以做停車場嗎？` → `/blog/road-land-parking/`
- `/首頁/f/道路用地公告現值全攻略...` → `/blog/road-land-announced-price/`
- `/f/道路用地公告現值怎麼查？...` → `/blog/road-land-price-query/`
- `/f/道路用地可以圍起來嗎` → `/blog/road-land-fence/`
- `/f/道路用地用途1分鐘全解析！` → `/blog/road-land-usage/`
- `/首頁/f/道路用地可以蓋房子嗎？內行人告訴你` → `/blog/road-land-construction/`
- `/f/公共設施保留地完全攻略...` → `/blog/public-facility-reserved-land/`
- `/f/政府道路用地徵收，如何補償?民眾權益必知` → `/blog/road-land-compensation/`

### 持分土地（8 篇）
- `/f/如何知道土地是共同共有還是分別共有？` → `/blog/co-ownership-vs-joint-ownership/`
- `/f/持分土地可以買賣嗎？-1` → `/blog/co-ownership-sale/`
- `/f/持分土地怎麼賣最划算？...` → `/blog/co-ownership-selling-strategy/`
- `/f/持分土地是什麼？` → `/blog/what-is-co-ownership/`
- `/f/土地分別共有買賣解決方式` → `/blog/co-ownership-transaction/`
- `/f/持分土地如何分割？...` → `/blog/co-ownership-partition/`
- `/f/持分土地能蓋房子嗎？...` → `/blog/co-ownership-construction/`
- `/f/持分土地怎麼繼承？...` → `/blog/co-ownership-inheritance/`
- `/f/分別共有土地的基本概念...` → `/blog/separate-co-ownership/`

### 三七五租約（3 篇）
- `/f/耕地三七五減租條例釋憲解析...` → `/blog/tenancy-375-constitutional-interpretation/`
- `/f/三七五減租廢除了嗎？` → `/blog/tenancy-375-abolished/`
- `/f/三七五減租懶人包...` → `/blog/tenancy-375-overview/`

### 祭祀公業（5 篇）
- `/f/《祭祀公業土地標售全攻略》...` → `/blog/ancestral-land-auction-guide/`
- `/f/祭祀公業土地可以買賣嗎` → `/blog/ancestral-land-sale/`
- `/f/何謂祭祀公業` → `/blog/what-is-ancestral-land/`
- `/f/祭祀公業可以買賣土地嗎` → `/blog/ancestral-land-can-sell/`
- `/首頁/f/祭祀公業土地應如何申報及處分或設定負擔` → `/blog/ancestral-land-registration/`

### 其他類別（7 篇）
- `/首頁/f/自地自建必備手冊` → `/blog/self-build-handbook/`
- `/首頁/f/未保存登記建物是什麼？...` → `/blog/unregistered-building/`
- `/首頁/f/地上權移轉登記全攻略...` → `/blog/superficies-transfer/`
- `/f/小心假繼承！土地過戶前，你該知道的三件事` → `/blog/inheritance-fraud-warning/`
- `/首頁/f/土地買賣注意事項全解析...` → `/blog/land-purchase-guide/`

---

## 四、保底轉址規則（catch-all）

對於沒抓到具體對應的舊 URL，用通配符導到相關位置，避免 404：

| 舊路徑樣式 | 新位置 | 用途 |
|---|---|---|
| `/f/*` | `/blog/` | 未對應的舊文章 → 文章列表 |
| `/首頁/f/*` | `/blog/` | 另一種舊文章格式 |
| `/首頁` | `/` | 舊首頁入口 |
| `/?blog=y&blogcategory=*` | `/blog/` | 舊分類 query string |

---

## 五、⚠ 需要你配合的動作

**現有清單只有 40 個 URL，但你 GoDaddy 網站累積應該有 100+ 頁。**
最完整的清單在 Google Search Console，請協助：

1. 登入 https://search.google.com/search-console
2. 選擇 `bqfox.com` 資源（如果還沒驗證，先驗證）
3. 左側選單 → **「頁面」**
4. 右上角 **「匯出」** → 下載 CSV
5. 把 CSV 傳給我（拖進對話視窗）

我會把遺漏的舊 URL 補進對照表，確保每一個有權重的舊網址都有對應的 301 轉址。

---

## 六、下一步規劃

本對照表確認後，立刻進入：
1. 建立 Astro 專案骨架（`package.json`、`astro.config.mjs`、基本 layout）
2. 設定 Content Collections（文章的 schema）
3. 把現有 `bqfox-site` 的 58 篇文章 HTML 抽取內容，轉成 Markdown + frontmatter
4. 建 SEO Component（canonical、OG、JSON-LD Schema）
5. 設定 `@astrojs/sitemap` 自動產生 sitemap
6. 寫 `public/_redirects`（根據這份對照表）
