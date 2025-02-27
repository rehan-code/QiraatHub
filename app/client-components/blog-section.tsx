"use client";

import Link from "next/link";
import BlogCard from "../components/blog-card";
import { getBlogPosts } from "../lib/blog";

export default function BlogSection() {
  const blogPosts = getBlogPosts();

  return (
    <section className="py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4 relative inline-block">
            Latest from{" "}
            <span className="relative inline-block">
              Our Blogs
              <div className="absolute left-0 right-0 bottom-[-5px] h-[3px] bg-yellow-400 rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-600">
            Stay updated with our latest articles and insights
          </p>
          <div className="mt-4">
            <Link
              href="/blog"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View All Blogs →
            </Link>
          </div>
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
                  transform: translateX(
                    calc(
                      -350px * ${blogPosts.length} - 2rem * ${blogPosts.length}
                    )
                  );
                }
              }

              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* First set of cards */}
            {blogPosts.map((blog, index) => (
              <div key={`first-${index}`} className="w-[350px]">
                <Link href={`/blog/${blog.slug}`} className="no-underline">
                  <BlogCard {...blog} />
                </Link>
              </div>
            ))}
            {/* Second set of cards */}
            {blogPosts.map((blog, index) => (
              <div key={`second-${index}`} className="w-[350px]">
                <Link href={`/blog/${blog.slug}`} className="no-underline">
                  <BlogCard {...blog} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
