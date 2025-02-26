import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '../lib/blog';

export default function BlogPage() {
  const blogPosts = getBlogPosts();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <Image
          src="https://old.qiraathub.com/wp-content/uploads/2024/10/PInk-Feminine-Blog-Digital-Marketing-Facebook-Post-2-768x644.png"
          alt="QiraatHub Blog"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Our Blog
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto leading-relaxed">
            Insights and knowledge about Quranic recitations and the Qiraat
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={index} className="no-underline">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg h-[450px] flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
