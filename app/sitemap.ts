import { MetadataRoute } from 'next';
import { scholars } from './qiraat/data/scholars';
import { getBlogSlugs } from './lib/blog';

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
    // Qiraat section
    {
      url: `${baseUrl}/qiraat`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
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

  // Try to import blog posts if available
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    // This is a placeholder - you would need to import your blog posts data
    // If you have a blog posts data file, replace this with the actual import
    const slugs = await getBlogSlugs();
    
    blogRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.log('Blog posts data not available for sitemap');
  }

  // Try to import downloads if available
  let downloadRoutes: MetadataRoute.Sitemap = [];
  try {
    // This is a placeholder - you would need to import your downloads data
    // If you have a downloads data file, replace this with the actual import
    // import { downloads } from './resources/downloads/data/downloads';
    
    // downloadRoutes = downloads.map((download) => ({
    //   url: `${baseUrl}/resources/downloads/${download.slug}`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // }));
  } catch (error) {
    console.log('Downloads data not available for sitemap');
  }
  
  // Combine all routes
  return [...staticRoutes, ...scholarRoutes, ...blogRoutes, ...downloadRoutes];
}
