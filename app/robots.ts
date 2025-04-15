import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', // Disallow API routes
        '/admin/', // Disallow admin routes if you have any
      ],
    },
    sitemap: 'https://qiraathub.com/sitemap.xml',
    host: 'https://qiraathub.com',
  };
}
