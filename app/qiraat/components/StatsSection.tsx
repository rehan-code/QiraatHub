import { Scholar } from '../types';

interface StatsCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  bgColor?: string
}

const StatsCard = ({ icon, count, label, bgColor = 'bg-blue-100' }: StatsCardProps) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
    <div className={`p-3 ${bgColor} rounded-xl`}>
      {icon}
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900">{count}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  </div>
);

export const StatsSection = ({ scholar }: { scholar: Scholar }) => (
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:-mt-12 -mt-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
        count={scholar.transmission.length}
        label="Transmissions"
        bgColor='bg-blue-100'
      />
      <StatsCard
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
        count={scholar.resources.length}
        label="Resources"
        bgColor='bg-emerald-100'
      />
      <StatsCard
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        count={scholar.youtubeVideos.length}
        label="Videos"
        bgColor='bg-red-100'
      />
    </div>
  </div>
);
