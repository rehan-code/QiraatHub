import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug } from '../../lib/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center max-w-4xl">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-6 mt-8" {...props} />,
                h2: ({ ...props }) => <h2 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                h3: ({ ...props }) => <h3 className="text-xl font-bold mb-3 mt-5" {...props} />,
                p: ({ ...props }) => <p className="mb-4" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                li: ({ ...props }) => <li className="mb-2" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                em: ({ ...props }) => <em className="italic" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Back to Blog Button */}
        <div className="text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition duration-150"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
