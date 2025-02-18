interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
}

export default function BlogCard({ title, excerpt, date, author, imageUrl }: BlogPost) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
