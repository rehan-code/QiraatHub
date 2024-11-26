import AudioPlayers from "@/app/client-components/audio-players";
import QiraatButtons from "@/app/client-components/qiraat-buttons";
import SurahList from "@/app/client-components/surah-list";

export default function AudioResources() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[300px,1fr] gap-4 md:gap-6">
        <div className="w-full md:sticky md:top-24 md:h-[calc(100vh-6rem)]">
          <SurahList />
        </div>
        <div className="space-y-4 md:space-y-8">
          <QiraatButtons />
          <AudioPlayers />
        </div>
      </div>
    </div>
  );
}
