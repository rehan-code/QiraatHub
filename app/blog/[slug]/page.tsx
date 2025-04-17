import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug } from '../../lib/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ResourcesSection } from '../../qiraat/components/ResourcesSection';
import { Metadata } from "next";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | QiraatHub Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | QiraatHub Blog`,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}


interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Improved */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 container mx-auto px-4">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-bold mr-2">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <span>{post.author}</span>
              </div>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content with Sidebar Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className={`flex flex-col ${post.resources && post.resources.length > 0 ? 'lg:flex-row gap-8 justify-center' : 'items-center'}`}>
          {/* Main Content */}
          <div className={post.resources && post.resources.length > 0 ? 'lg:w-[58%]' : 'max-w-3xl w-full'}>
            <article className="bg-white rounded-lg p-4 mb-12 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-6 mt-10 text-gray-800" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-xl font-bold mb-3 mt-6 text-gray-800" {...props} />,
                    p: ({ ...props }) => <p className="mb-5 text-gray-700 leading-relaxed" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-6 mb-5 text-gray-700" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-5 text-gray-700" {...props} />,
                    li: ({ ...props }) => <li className="mb-2" {...props} />,
                    strong: ({ ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                    em: ({ ...props }) => <em className="italic" {...props} />,
                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-yellow-600 pl-4 italic my-6 text-gray-600" {...props} />,
                    a: ({ ...props }) => <a className="text-yellow-700 hover:text-yellow-900 underline" {...props} />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Related Posts Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-3">Continue Reading</h2>
              <div className="flex justify-center">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-theme_primary hover:bg-theme_primary/90 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to All Articles
                </Link>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-[27%]">
            {/* Resources Section - Only shown if resources exist */}
            {post.resources && post.resources.length > 0 && (
              <div className="sticky top-8 mb-8">
                <ResourcesSection resources={post.resources} className="!shadow-[0_0_8px_rgba(0,0,0,0.05)] " />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
