import { defineCollection, z } from 'astro:content';

/**
 * 文章分類
 * 這份清單對應網站實際業務類別，請勿隨意新增
 */
export const CATEGORIES = [
  '道路用地',
  '容積移轉',
  '三七五租約',
  '持分土地',
  '公同共有',
  '祭祀公業',
  '重劃地',
  '兩岸繼承',
  '農地',
  '地籍清理',
  '未辦繼承',
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * 分類 → URL slug 對應，用於分類頁面的 URL
 */
export const CATEGORY_SLUGS: Record<Category, string> = {
  道路用地: 'road-land',
  容積移轉: 'floor-area-ratio',
  三七五租約: 'tenancy-375',
  持分土地: 'co-ownership',
  公同共有: 'joint-ownership',
  祭祀公業: 'ancestral-land',
  重劃地: 'rezoning-land',
  兩岸繼承: 'cross-strait-inheritance',
  農地: 'farmland',
  地籍清理: 'cadastral-cleanup',
  未辦繼承: 'inheritance',
};

/**
 * 文章 Collection
 * 每篇文章都要符合這個 schema，否則 build 時會報錯
 */
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(5).max(80),
    description: z.string().min(50).max(200), // Google 偏好 120-160 字
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(CATEGORIES),
    author: z.string().default('寶璣建設編輯部'),
    draft: z.boolean().default(false),

    // GEO 優化：FAQ Schema 支援
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    // SEO：關鍵字（僅供內部參考，不輸出 meta keywords）
    keywords: z.array(z.string()).optional(),

    // 精選圖片（相對於 public/ 或 absolute URL）
    heroImage: z.string().optional(),

    // 文章類型：教學、案例、新聞、法規解析
    articleType: z
      .enum(['教學', '案例', '新聞', '法規解析', '懶人包'])
      .default('教學'),

    // 相關文章手動推薦（slug）
    relatedArticles: z.array(z.string()).optional(),
  }),
});

/**
 * 服務頁 Collection
 * 8 個核心服務各一份 Markdown
 */
const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(200),
    order: z.number(), // 顯示排序
    category: z.enum(CATEGORIES),

    // Hero 區文案
    heroTitle: z.string(),
    heroSubtitle: z.string().optional(),

    // 關鍵特色（3-5 個 bullet）
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      )
      .optional(),

    // FAQ Schema
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    // 處理流程步驟
    process: z
      .array(
        z.object({
          step: z.number(),
          title: z.string(),
          description: z.string(),
        })
      )
      .optional(),

    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  articles,
  services,
};
