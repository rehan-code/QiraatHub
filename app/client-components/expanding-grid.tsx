"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Scholar {
  name: string;
  image: string;
  slug: string;
}

export default function ExpandingGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scholars: Scholar[] = [
    {
      name: "Nafi' al-Madani",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg",
      slug: "nafi-al-madani",
    },
    {
      name: "Ibn Kathir",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg",
      slug: "ibn-kathir",
    },
    {
      name: "Abu Amr Basri",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg",
      slug: "abu-amr-basri",
    },
    {
      name: "Ibn Amir Shami",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg",
      slug: "ibn-amir-shami",
    },
    {
      name: "Asim Al Koofi",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg",
      slug: "asim-al-koofi",
    },
    {
      name: "Hamza Al Kufi",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
      slug: "hamza-al-kufi",
    },
    {
      name: "Al-Kisa'i",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-light-spirituality-5385907-1-2-768x512.jpg",
      slug: "al-kisai",
    },
    {
      name: "Abu Jaafar",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-light-recite-5385901-1-1-768x512.jpg",
      slug: "abu-jaafar",
    },
    {
      name: "Yaqub Hadrani",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/87948b6c923b69c5e451fcb5d3a5577a-1.webp",
      slug: "yaqub-hadrani",
    },
    {
      name: "Khalaf Al Ashir",
      image:
        "https://old.qiraathub.com/wp-content/uploads/2024/09/i-768x768.webp",
      slug: "khalaf-al-ashir",
    },
  ];

  const getGridTemplateColumns = useCallback(
    (hoverIndex: number | null): string => {
      if (isMobile) return "repeat(2, 1fr)";
      if (hoverIndex === null) return "1fr 1fr 1fr 1fr 1fr";
      const columns = Array(5).fill("0.8fr");
      columns[hoverIndex % 5] = "1.8fr";
      return columns.join(" ");
    },
    [isMobile]
  );

  return (
    <div className="container mx-auto px-10 py-12">
      {isMobile ? (
        // Mobile Layout
        <div className="grid grid-cols-2 gap-4 h-auto">
          {scholars.map((scholar, index) => (
            <Link
              key={index}
              href={`/qiraat/${scholar.slug}`}
              className="relative aspect-square overflow-hidden cursor-pointer rounded-lg group hover:ring-2 transition-all duration-300"
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
            </Link>
          ))}
        </div>
      ) : (
        // Desktop Layout
        <div className={`grid grid-rows-2 h-[900px]`}>
          {[0, 1].map((rowIndex) => (
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
                  <Link
                    key={index}
                    href={`/qiraat/${scholar.slug}`}
                    className="relative overflow-hidden cursor-pointer rounded-lg m-1.5 hover:m-0 transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(rowIndex * 5 + index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Image
                      src={scholar.image}
                      alt={scholar.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h2 className="text-white text-lg font-bold truncate">
                        {scholar.name}
                      </h2>
                    </div>
                  </Link>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
