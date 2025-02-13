import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DownloadButton from '@/components/DownloadButton';
import { books } from '../data/books';

export default function BookPage({ params }: { params: { id: string } }) {
  const book = books.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/resources/downloads"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-12 group"
        >
          <svg
            className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Books
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-600 mix-blend-multiply opacity-10" />
            <div className="relative md:flex">
              <div className="md:flex-shrink-0 md:w-96">
                <div className="relative h-96 w-full md:h-[32rem]">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    {book.category}
                  </span>
                  <h1 className="mt-6 text-4xl font-bold text-gray-900 lg:text-5xl">
                    {book.title}
                  </h1>
                  {book.author && (
                    <p className="mt-4 text-xl text-emerald-600 font-medium">
                      {book.author}
                    </p>
                  )}
                  {book.description && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold text-gray-900">About this Book</h2>
                      <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-12 max-w-xs">
                  <DownloadButton downloadUrl={book.downloadUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
