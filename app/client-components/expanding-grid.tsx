"use client";

import { useState } from "react";
import Image from "next/image";

interface Scholar {
  name: string;
  image: string;
}

export default function ExpandingGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scholars: Scholar[] = [
    { name: "Nafi' al-Madani", image: "/placeholder.svg?height=300&width=200" },
    { name: "Ibn Kathir", image: "/placeholder.svg?height=300&width=200" },
    { name: "Abu Amr Basri", image: "/placeholder.svg?height=300&width=200" },
    { name: "Ibn Amir Shami", image: "/placeholder.svg?height=300&width=200" },
    { name: "Asim Al Koofi", image: "/placeholder.svg?height=300&width=200" },
    { name: "Hamza Al Kufi", image: "/placeholder.svg?height=300&width=200" },
    { name: "Al-Kisa'i", image: "/placeholder.svg?height=300&width=200" },
    { name: "Abu Jaafar", image: "/placeholder.svg?height=300&width=200" },
    { name: "Yaqub Hadrani", image: "/placeholder.svg?height=300&width=200" },
    { name: "Khalaf Al Ashir", image: "/placeholder.svg?height=300&width=200" },
  ];

  const getWidth = (index: number) => {
    if (hoveredIndex === null) return "19%";
    if (index === hoveredIndex) return "35%";
    if (Math.floor(index / 5) === Math.floor(hoveredIndex / 5)) return "15%";
    return "19%";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap h-[1000px] gap-y-6 gap-x-1">
        {scholars.map((scholar, index) => (
          <div
            key={index}
            className="relative overflow-hidden cursor-pointer transition-all duration-1000 ease-in-out h-1/2 rounded-lg"
            style={{ width: getWidth(index) }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={scholar.image}
              alt={scholar.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-lg font-semibold truncate px-4">
                {scholar.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
