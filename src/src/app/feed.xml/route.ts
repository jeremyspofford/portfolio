import { getAllPosts } from '@/lib/blog';
import { config } from '@/config';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = config.urls.site || 'https://www.jeremyspofford.dev'; // Fallback

  const itemsXml = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>
  `).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Jeremy Spofford's Blog</title>
    <link>${siteUrl}</link>
    <description>Musings on DevOps, AI, and building for the modern web.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
