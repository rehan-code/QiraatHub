'use client';

import BlogCard from '../components/blog-card';

const mockBlogs = [
  {
    title: "How Long Does It Take to Read the Quran? | Tips & Insights",
    excerpt: "Discover practical tips and insights on the time required to read the entire Quran, factors affecting reading speed, and strategies for consistent Quran reading",
    date: "Nov 23, 2024",
    author: "qiraathub",
    imageUrl: "https://old.qiraathub.com/wp-content/uploads/2024/11/masjid-maba-zaP_cttTQdE-unsplash-scaled-1.jpg"
  },
  {
    title: "Teaching Quran for Non Arabic Speakers",
    excerpt: "Explore effective methods and resources for teaching the Quran to non-Arabic speakers",
    date: "Oct 15, 2024",
    author: "qiraathub",
    imageUrl: "https://old.qiraathub.com/wp-content/uploads/2024/10/PInk-Feminine-Blog-Digital-Marketing-Facebook-Post-300x251.png"
  },
  {
    title: "Understanding the Ijazah Tradition",
    excerpt: "Delve into the rich history and significance of the Ijazah tradition in Quranic studies, its role in preserving authentic recitations, and its relevance in modern Islamic education",
    date: "Oct 15, 2024",
    author: "qiraathub",
    imageUrl: "https://old.qiraathub.com/wp-content/uploads/2024/10/PInk-Feminine-Blog-Digital-Marketing-Facebook-Post-1-300x251.png"
  }
];

export default function BlogSection() {
  return (
    <section className="py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4 relative inline-block">
            Latest from Our Blogs
            <div className="absolute right-[-10px] bottom-[-5px] w-[154px] h-[3px] bg-yellow-400 rounded-full"></div>
          </h2>
          <p className="text-gray-600">Stay updated with our latest articles and insights</p>
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
                  transform: translateX(calc(-350px * ${mockBlogs.length} - 2rem * ${mockBlogs.length}));
                }
              }

              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* First set of cards */}
            {mockBlogs.map((blog, index) => (
              <div key={`first-${index}`} className="w-[350px]">
                <BlogCard {...blog} />
              </div>
            ))}
            {/* Second set of cards */}
            {mockBlogs.map((blog, index) => (
              <div key={`second-${index}`} className="w-[350px]">
                <BlogCard {...blog} />
              </div>
            ))}
            {/* Third set of cards for seamless wrapping */}
            {mockBlogs.map((blog, index) => (
              <div key={`third-${index}`} className="w-[350px]">
                <BlogCard {...blog} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
