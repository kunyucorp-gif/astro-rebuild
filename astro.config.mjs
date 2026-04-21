// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// 正式站網址
const SITE_URL = 'https://www.bqfox.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // URL 結尾統一加斜線 /，讓 /services/road-land/ 成為唯一正規形式
  // 避免 Cloudflare Pages 自動加 slash 導致多餘的 301 鏈
  trailingSlash: 'always',

  // 建置輸出改為 directory（每頁變成一個資料夾的 index.html），配合 trailingSlash
  build: {
    format: 'directory',
  },

  integrations: [
    // 自動產生 sitemap.xml（這是 SEO 最關鍵的一塊）
    sitemap({
      // 過濾掉預覽與測試路徑
      filter: (page) =>
        !page.includes('/preview/') &&
        !page.includes('/draft/') &&
        !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      // 依路徑設定不同優先級
      serialize(item) {
        if (item.url === `${SITE_URL}/`) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/services/')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.endsWith('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
    mdx(),
  ],

  // 影像優化設定
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
