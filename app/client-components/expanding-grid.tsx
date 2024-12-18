"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";

interface Scholar {
  name: string;
  image: string;
}

export default function ExpandingGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scholars: Scholar[] = [
    {
      name: "Nafi' al-Madani",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg",
    },
    {
      name: "Ibn Kathir",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg",
    },
    {
      name: "Abu Amr Basri",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg",
    },
    {
      name: "Ibn Amir Shami",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg",
    },
    {
      name: "Asim Al Koofi",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg",
    },
    {
      name: "Hamza Al Kufi",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
    },
    {
      name: "Al-Kisa'i",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/quran-light-spirituality-5385907-1-2-768x512.jpg",
    },
    {
      name: "Abu Jaafar",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/quran-light-recite-5385901-1-1-768x512.jpg",
    },
    {
      name: "Yaqub Hadrani",
      image:
        "https://qiraathub.com/wp-content/uploads/2024/09/87948b6c923b69c5e451fcb5d3a5577a-1.webp",
    },
    {
      name: "Khalaf Al Ashir",
      image: "https://qiraathub.com/wp-content/uploads/2024/09/i-768x768.webp",
    },
  ];

  const getGridTemplateColumns = useCallback(
    (hoverIndex: number | null): string => {
      if (isMobile) return "repeat(2, 1fr)";
      if (hoverIndex === null) return "repeat(5, 1fr)";
      const columns = Array(5).fill("1fr");
      columns[hoverIndex % 5] = "2.25fr";
      return columns.join(" ");
    },
    [isMobile]
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className={`grid gap-4 ${isMobile ? 'h-auto' : 'grid-rows-2 h-[1000px] gap-y-6'}`}>
        {isMobile ? (
          // Mobile Layout
          <div className="grid grid-cols-2 gap-4">
            {scholars.map((scholar, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden cursor-pointer rounded-lg group hover:ring-2 hover:ring-theme_primary transition-all duration-300"
                onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
              >
                <Image
                  src={scholar.image}
                  alt={scholar.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-center">
                  <h2 className="text-white text-base md:text-lg font-semibold text-center px-2 drop-shadow-lg">
                    {scholar.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Layout
          [0, 1].map((rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 transition-all duration-300 ease-in-out"
              style={{
                gridTemplateColumns: getGridTemplateColumns(
                  hoveredIndex !== null &&
                    Math.floor(hoveredIndex / 5) === rowIndex
                    ? hoveredIndex % 5
                    : null
                ),
              }}
            >
              {scholars
                .slice(rowIndex * 5, (rowIndex + 1) * 5)
                .map((scholar, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden cursor-pointer rounded-lg"
                    onMouseEnter={() => setHoveredIndex(rowIndex * 5 + index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Image
                      src={scholar.image}
                      alt={scholar.name}
                      fill
                      className="object-cover px-1"
                    />
                    <div className="absolute inset-0 bg-black/20 mx-1"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h2 className="text-white text-lg font-semibold truncate px-4">
                        {scholar.name}
                      </h2>
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
