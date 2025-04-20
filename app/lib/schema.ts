// Schema utility for QiraatHub

// Base website schema that can be used across the site
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QiraatHub',
    url: 'https://qiraathub.com',
    description: 'Learn about the 10 distinct qiraat (Quran recitation styles)',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://qiraathub.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

// Organization schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QiraatHub',
    url: 'https://qiraathub.com',
    logo: 'https://qiraathub.com/logo.png',
    sameAs: [
      'https://www.youtube.com/@qiraat',
      'https://www.facebook.com/QiraatHub/',
      'https://www.instagram.com/qiraathub/',
      'https://x.com/QiraatHub'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        'telephone': '+1 (519) 760-2953',
        'contactType': 'customer service',
        'email': 'info@qiraathub.com',
        'availableLanguage': 'en'
      }
    ]
  };
}

// Home page schema
export function generateHomePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QiraatHub',
    description: 'Learn about the 10 distinct qiraat (Quran recitation styles)',
    url: 'https://qiraathub.com',
    logo: 'https://qiraathub.com/logo.png',
    isPartOf: generateOrganizationSchema(),
  };
}

// Blog post schema
export function generateBlogPostSchema(post: {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  slug: string;
  imageUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: generateOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://qiraathub.com/blog/${post.slug}`
    }
  };
}

// Scholar page schema
export function generateScholarSchema(scholar: {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: scholar.name,
    description: scholar.description,
    url: `https://qiraathub.com/qiraat/${scholar.slug}`,
    image: scholar.imageUrl,
    affiliation: generateOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://qiraathub.com/qiraat/${scholar.slug}`
    }
  };
}
