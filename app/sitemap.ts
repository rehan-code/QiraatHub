import { MetadataRoute } from 'next';
import { scholars } from './qiraat/data/scholars';
import { getBlogSlugs } from './lib/blog';
import { books } from './resources/downloads/data/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for your site
  const baseUrl = 'https://qiraathub.com';
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    // Main sections
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // Resources section
    {
      url: `${baseUrl}/resources/audio`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/video`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/downloads`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];
  
  // Dynamic routes for each scholar
  const scholarRoutes = scholars.map((scholar) => ({
    url: `${baseUrl}/qiraat/${scholar.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Add blog post routes
  const blogSlugs = await getBlogSlugs();
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add download routes from books.ts
  const downloadRoutes: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${baseUrl}/resources/downloads/${book.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add routes for PDF files in public/books directory
  const publicBookRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/books/AlDurrah.pdf`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/books/Shaatbiyyah-English.pdf`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
  ];
  
  // Combine all routes
  return [...staticRoutes, ...scholarRoutes, ...blogRoutes, ...downloadRoutes, ...publicBookRoutes];
}
