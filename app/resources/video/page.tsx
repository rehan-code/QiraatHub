'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// YouTube channel ID from the URL
const CHANNEL_ID = 'UCuTil7rnBMIzYkb2mp5Z-Lg';
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export default function VideoResources() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        setVideos(data.items);
      } catch (err) {
        setError('Error loading videos. Please try again later.');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

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
              href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaYoutube className="w-5 h-5" />
              <span>Subscribe to our YouTube Channel</span>
            </Link>
          </Button>
        </div>
      </motion.div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading videos...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <motion.div
            key={video.id.videoId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-video">
                <YoutubeEmbed
                  videoId={video.id.videoId}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{video.snippet.title}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
