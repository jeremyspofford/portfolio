import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jeremyspofford.com'; // Replace with actual domain

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const blogs = posts.map((post) => {
    let dateStr = post.date;
    try {
        new Date(dateStr).toISOString();
    } catch (e) {
        console.warn(`Invalid date for post ${post.slug}: ${post.date}. Fallback to now.`);
        dateStr = new Date().toISOString();
    }

    return {
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(dateStr).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    };
  });

  const routes = [
    '',
    '/about',
    '/blog',
    '/resume',
    '/contact', // Assuming this exists or handles scrolling
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes, ...blogs];
}
