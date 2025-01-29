import { Scholar } from '../types';
import { ResourceCard } from './ResourceCard';
import { VideoCard } from './VideoCard';

export const MainContent = ({ scholar }: { scholar: Scholar }) => (
  <div className="flex-1">
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholar.resources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Lessons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholar.youtubeVideos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </section>
  </div>
);
