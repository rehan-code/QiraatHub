import Image from 'next/image';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
}

export default function BlogCard({ title, excerpt, date, author, imageUrl }: BlogPost) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg h-[400px] flex flex-col">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2 h-[56px]">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
