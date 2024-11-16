"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SurahContextType {
  selectedSurah: string;
  setSelectedSurah: (surah: string) => void;
}

const SurahContext = createContext<SurahContextType | undefined>(undefined);

export function SurahProvider({ children }: { children: ReactNode }) {
  const [selectedSurah, setSelectedSurah] = useState<string>("001 Al-fatiha");

  return (
    <SurahContext.Provider value={{ selectedSurah, setSelectedSurah }}>
      {children}
    </SurahContext.Provider>
  );
}

export function useSurah() {
  const context = useContext(SurahContext);
  if (context === undefined) {
    throw new Error("useSurah must be used within a SurahProvider");
  }
  return context;
}
