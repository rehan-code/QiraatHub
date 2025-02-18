'use client';

import { useEffect, useRef } from 'react';
import BlogCard from './blog-card';

// This is temporary mock data - will be replaced with real data in the future
const mockBlogs = [
  {
    title: "Understanding the Origins of Qiraat",
    excerpt: "Explore the historical development and transmission of the various Quranic readings...",
    date: "Feb 18, 2025",
    author: "Dr. Ahmad Khan",
    imageUrl: "https://qiraathub.com/wp-content/uploads/2024/11/masjid-maba-zaP_cttTQdE-unsplash-scaled-1.jpg"
  },
  {
    title: "The Significance of Imam Asim's Reading",
    excerpt: "Discover why Imam Asim's Qiraat became one of the most widely practiced readings...",
    date: "Feb 15, 2025",
    author: "Sarah Ahmed",
    imageUrl: "https://qiraathub.com/wp-content/uploads/2024/11/masjid-maba-zaP_cttTQdE-unsplash-scaled-1.jpg"
  },
  {
    title: "Modern Applications of Qiraat Studies",
    excerpt: "Learn how contemporary scholars are preserving and teaching the various Qiraat...",
    date: "Feb 12, 2025",
    author: "Dr. Mohammed Ali",
    imageUrl: "https://qiraathub.com/wp-content/uploads/2024/11/masjid-maba-zaP_cttTQdE-unsplash-scaled-1.jpg"
  }
];

export default function BlogSection() {
  return (
    <section className="py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4 relative inline-block">
            Latest from Our Blog
            <div className="absolute right-[-10px] bottom-[-5px] w-[120px] h-[3px] bg-yellow-400 rounded-full"></div>
          </h2>
          <p className="text-gray-600">Stay updated with our latest articles and insights</p>
        </div>
        
        <div className="relative overflow-hidden py-6">
          <div className="animate-scroll flex">
            <style jsx>{`
              .animate-scroll {
                animation: scroll 40s linear infinite;
                display: flex;
                gap: 2rem;
              }

              .animate-scroll > div {
                flex: 0 0 auto;
              }

              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(calc(-350px * ${mockBlogs.length} - 2rem * ${mockBlogs.length}));
                }
              }

              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* First set of cards */}
            {mockBlogs.map((blog, index) => (
              <div key={`first-${index}`} className="w-[350px]">
                <BlogCard {...blog} />
              </div>
            ))}
            {/* Second set of cards */}
            {mockBlogs.map((blog, index) => (
              <div key={`second-${index}`} className="w-[350px]">
                <BlogCard {...blog} />
              </div>
            ))}
            {/* Third set of cards for seamless wrapping */}
            {mockBlogs.map((blog, index) => (
              <div key={`third-${index}`} className="w-[350px]">
                <BlogCard {...blog} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
