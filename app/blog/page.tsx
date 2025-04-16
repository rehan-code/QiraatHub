import type { Metadata } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '../lib/blog';

export const metadata: Metadata = {
  title: "QiraatHub Blog | Insights on Quranic Recitations",
  description: "Explore in-depth articles about Quranic recitations, the 10 Qiraat, and Islamic scholarship on QiraatHub's official blog.",
};


export default function BlogPage() {
  const blogPosts = getBlogPosts();
  const featuredPost = blogPosts[0]; // Use the first post as featured
  const regularPosts = blogPosts.slice(1); // All other posts
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern and clean design */}
      <div className="bg-yellow-700 text-white">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              QiraatHub Blog
            </h1>
            <p className="text-lg md:text-xl text-yellow-100 max-w-2xl mx-auto leading-relaxed">
              Explore insights about Quranic recitations and the rich tradition of Qiraat
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Featured Post - Modern card design */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 inline-block relative after:content-[''] after:absolute after:w-1/2 after:h-1 after:bg-yellow-600 after:left-0 after:-bottom-2">
            Featured Article
          </h2>
          <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-[350px] md:h-auto">
                <Image
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-bold">
                      {featuredPost.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.date}</p>
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles - Clean grid layout */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-gray-800 inline-block relative after:content-[''] after:absolute after:w-1/2 after:h-1 after:bg-yellow-600 after:left-0 after:-bottom-2">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={index} className="no-underline group">
                <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:translate-y-[-3px] h-[400px] flex flex-col border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-2 group-hover:text-yellow-700 transition-colors">{post.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-sm mt-auto pt-3 border-t border-gray-100">
                      <span className="text-gray-700 font-medium">{post.author}</span>
                      <span className="text-gray-500">{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
