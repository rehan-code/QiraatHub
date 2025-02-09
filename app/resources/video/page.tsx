'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { Youtube } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// YouTube video data
const videos = [
  {
    id: "Fusq_ro3_pg", 
  },
  {
    id: "kVdCVkFkc8E",
  },
  // Add more videos as needed
];

export default function VideoResources() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-center mb-6">Video Resources</h1>
        
        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            className="bg-white hover:bg-red-50 border-2 text-gray-800 hover:text-red-600 px-6 py-2 h-auto transition-all duration-300"
          >
            <Link
              href="https://www.youtube.com/channel/UCuTil7rnBMIzYkb2mp5Z-Lg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Youtube className="w-5 h-5" />
              <span>Subscribe to our YouTube Channel</span>
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-video">
                <YoutubeEmbed videoId={video.id} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
