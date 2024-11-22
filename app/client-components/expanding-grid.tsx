"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface Scholar {
  name: string;
  image: string;
}

export default function ExpandingGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // const getWidth = (index: number) => {
  //   if (hoveredIndex === null) return "19%";
  //   if (index === hoveredIndex) return "29%";
  //   if (Math.floor(index / 5) === Math.floor(hoveredIndex / 5)) return "15%";
  //   return "19%";
  // };

  // const getWidt = (index: number) => {
  //   const expandedWidth = 30;
  //   if (hoveredIndex === null) return `${100 / 5}%`;
  //   if (index === hoveredIndex) {
  //     return `${expandedWidth}%`;
  //   }
  //   if (Math.floor(index / 5) === Math.floor(hoveredIndex / 5)) {
  //     return `${(100 - expandedWidth) / 4}%`;
  //   }
  //   return `${100 / 5}%`;
  // };

  const getGridTemplateColumns = useCallback(
    (hoverIndex: number | null): string => {
      if (hoverIndex === null) return "repeat(5, 1fr)";
      const columns = Array(5).fill("1fr");
      columns[hoverIndex % 5] = "2.25fr";
      return columns.join(" ");
    },
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-rows-2 gap-1 h-[1000px] gap-y-6">
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
                <div
                  key={index}
                  className="relative overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(rowIndex * 5 + index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={scholar.image}
                    alt={scholar.name}
                    fill
                    className="object-cover px-1 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 mx-1 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-lg font-semibold truncate px-4">
                      {scholar.name}
                    </h2>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
