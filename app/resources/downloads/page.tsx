import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DownloadButton from '@/components/DownloadButton';
import { books } from './data/books';

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="block">Islamic Books</span>
            <span className="block mt-2 text-emerald-600">Collection</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Download and benefit from our curated collection of Islamic literature
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href={`/resources/downloads/${book.id}`} className="flex-1">
                <div className="relative pt-[140%] bg-emerald-50">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100/90 text-emerald-800 backdrop-blur-sm">
                    {book.category}
                  </span>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex-1">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                        {book.title}
                      </h3>
                      {book.author && (
                        <p className="mt-2 text-sm font-medium text-emerald-600">
                          {book.author}
                        </p>
                      )}
                      {book.description && (
                        <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-6 pt-0">
                <DownloadButton downloadUrl={book.downloadUrl} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}