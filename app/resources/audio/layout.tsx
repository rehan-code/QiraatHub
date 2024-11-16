import { SurahProvider } from "@/contexts/surah-context";

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SurahProvider>{children}</SurahProvider>
    </div>
  );
}
