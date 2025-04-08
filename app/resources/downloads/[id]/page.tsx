import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import DownloadButton from '@/components/DownloadButton';
import { books } from '../data/books';
import { BookOpen } from 'lucide-react';

interface PageProps {
  params: Promise <{
    id: string;
  }>;
}

export default async function BookPage({ params }: PageProps) {
  const {id} = await params;
  const book = books.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-600 mix-blend-multiply opacity-10" />
            <div className="relative lg:flex">
              <div className="md:flex-shrink-0 md:w-96">
                <div className="relative h-96 w-full md:h-[36rem]">
                  {book.coverImage ? (
                    <>
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </>
                  ) : (
                    <div className="rounded-bl-3xl absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100">
                      <BookOpen className="w-24 h-24 text-emerald-600 mb-6 opacity-80" />
                      <h4 className="text-center font-medium text-emerald-800 text-xl line-clamp-3">{book.title}</h4>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-8 md:p-12 lg:p-16 lg:pl-32 flex flex-col justify-between">
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
                        <div className="whitespace-pre-wrap">{book.description}</div>
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
