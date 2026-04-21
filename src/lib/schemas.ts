/**
 * JSON-LD Schema.org 結構化資料產生器
 *
 * 這是 GEO（生成式引擎優化）的核心：
 * - Google 精選摘要（Featured Snippets）要靠這些 schema 抓資料
 * - ChatGPT/Claude/Gemini/Perplexity 在訓練與回答時也會優先引用有良好 schema 標記的頁面
 *
 * 參考：https://schema.org/
 */

const SITE_URL = 'https://www.bqfox.com';

// 公司基本資料（組織 Schema 的核心）
export const ORGANIZATION = {
  name: '寶璣建設有限公司',
  alternateName: 'BAO CHI CONSTRUCTION CO., LTD.',
  legalName: '寶璣建設有限公司',
  taxID: '94157953',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  telephone: '+886-2-2274-6789',
  email: 'baiqicorp888@gmail.com',
  address: {
    streetAddress: '南雅南路二段144巷73號',
    addressLocality: '板橋區',
    addressRegion: '新北市',
    postalCode: '220',
    addressCountry: 'TW',
  },
  foundingDate: '2012',
  areaServed: '台灣',
  sameAs: [] as string[], // 如果有 FB、IG、YouTube 可填
};

/**
 * 組織 Schema - 每頁都該放（首頁、about 頁必放）
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.alternateName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    image: ORGANIZATION.logo,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.address.streetAddress,
      addressLocality: ORGANIZATION.address.addressLocality,
      addressRegion: ORGANIZATION.address.addressRegion,
      postalCode: ORGANIZATION.address.postalCode,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    taxID: ORGANIZATION.taxID,
    foundingDate: ORGANIZATION.foundingDate,
    areaServed: {
      '@type': 'Country',
      name: '台灣',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  };
}

/**
 * 網站 Schema - 首頁放
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: '寶璣建設有限公司',
    description:
      '寶璣建設專業處理道路用地買賣、容積移轉代辦、三七五租約解約、持份土地整合、公同共有、祭祀公業、重劃地、兩岸三地繼承等特殊土地案件。',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'zh-TW',
  };
}

/**
 * 麵包屑 Schema - 所有內頁放
 */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * 文章 Schema - 所有文章頁放
 */
export function articleSchema(data: {
  title: string;
  description: string;
  slug: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
  category: string;
  heroImage?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.heroImage
      ? `${SITE_URL}${data.heroImage}`
      : `${SITE_URL}/og-default.png`,
    datePublished: data.pubDate.toISOString(),
    dateModified: (data.updatedDate ?? data.pubDate).toISOString(),
    author: {
      '@type': 'Organization',
      name: data.author,
      url: SITE_URL,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${data.slug}/`,
    },
    articleSection: data.category,
    inLanguage: 'zh-TW',
  };
}

/**
 * FAQ Schema - 有 Q&A 區塊的頁面必放
 * 這是 GEO 優化的關鍵：Google 精選摘要和 AI 引用都優先挑有 FAQ schema 的頁面
 */
export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 服務 Schema - 8 個服務頁各放一份
 */
export function serviceSchema(data: {
  name: string;
  description: string;
  slug: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    serviceType: data.serviceType,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: {
      '@type': 'Country',
      name: '台灣',
    },
    url: `${SITE_URL}/services/${data.slug}/`,
  };
}

/**
 * HowTo Schema - 有步驟流程的頁面可用
 */
export function howToSchema(data: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
