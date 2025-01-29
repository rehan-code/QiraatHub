import { YouTubeVideo } from '../types';

export const VideoCard = ({ video }: { video: YouTubeVideo }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${video.videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
      <p className="text-gray-600">{video.description}</p>
    </div>
  </div>
);
