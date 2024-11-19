import AudioPlayer from "@/app/client-components/audio-player";
import AudioPlayers from "@/app/client-components/audio-players";
import QiraatButtons from "@/app/client-components/qiraat-buttons";
import SurahList from "@/app/client-components/surah-list";

export default function AudioResources() {
  return (
    <div className="min-h-screen p-20 place-items-center">
      <div className="max-w-6xl grid md:grid-cols-[300px,1fr] gap-6">
        <SurahList />
        <div className="mx-auto space-y-8">
          <QiraatButtons />
          <AudioPlayers />
        </div>
      </div>
    </div>
  );
}
