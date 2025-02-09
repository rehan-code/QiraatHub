'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { YoutubeEmbed } from "@/components/youtube-embed";

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
      >
        <h1 className="text-4xl font-bold text-center mb-8">Video Resources</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Explore our collection of educational videos to enhance your learning journey
        </p>
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
