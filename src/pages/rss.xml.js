import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  articles.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: '寶璣建設土地法律知識專欄',
    description:
      '寶璣建設專業團隊撰寫的道路用地、容積移轉、三七五租約、持分土地、祭祀公業、兩岸繼承等特殊土地深度解析。',
    site: context.site,
    items: articles.slice(0, 50).map((article) => ({
      title: article.data.title,
      pubDate: article.data.pubDate,
      description: article.data.description,
      categories: [article.data.category],
      author: article.data.author,
      link: `/blog/${article.slug}/`,
    })),
    customData: `
      <language>zh-TW</language>
      <copyright>© 2012–${new Date().getFullYear()} 寶璣建設有限公司</copyright>
    `,
  });
}
