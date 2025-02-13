'use client';

import React from 'react';

interface DownloadButtonProps {
  downloadUrl: string;
}

export default function DownloadButton({ downloadUrl }: DownloadButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <a
      href={downloadUrl}
      className="group w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      onClick={handleClick}
    >
      <svg
        className="w-5 h-5 mr-2 transform group-hover:translate-y-[1px] transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download Book
    </a>
  );
}
