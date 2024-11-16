import SurahList from "@/app/client-components/surah-list";

export default function AudioResources() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          test
          <SurahList />
        </div>
      </div>
    </div>
  );
}
