"use client";

import { useEffect, useState } from "react";
import { useSurah } from "@/contexts/surah-context";
import { allSurahs } from "@/app/lib/surah-definitions";

interface SharedAudioHandlerProps {
  surah?: string;
  qiraat?: string;
  reciter?: string;
}

export default function SharedAudioHandler({ 
  surah, 
  qiraat, 
  reciter 
}: SharedAudioHandlerProps) {
  const { setSelectedSurah, setSelectedQiraat } = useSurah();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Only auto-select if we have URL parameters (shared link) and haven't processed yet
    if (surah && qiraat && reciter && !hasProcessed) {
      // Validate if the surah exists in our available surahs list
      const validSurah = allSurahs.find(s => s.fullName === surah);
      
      if (validSurah) {
        setSelectedSurah(surah);
        
        // Store the qiraat and reciter for other components to use
        sessionStorage.setItem('sharedQiraat', qiraat);
        sessionStorage.setItem('sharedReciter', reciter);
        sessionStorage.setItem('sharedAudioProcessed', 'true');
      } else {
        console.error(`Shared Surah '${surah}' not found in available Surahs.`);
        // Could show a toast notification or redirect to first Surah
        // For now, we'll just not set anything and let the user manually select
      }
      
      // Clean up URL parameters after a short delay regardless of validation
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('surah');
        url.searchParams.delete('qiraat');
        url.searchParams.delete('reciter');
        
        // Update URL without page reload (clean URL)
        window.history.replaceState({}, '', url.toString());
      }, 1000);
      
      setHasProcessed(true);
    }
  }, [surah, qiraat, reciter, setSelectedSurah, setSelectedQiraat, hasProcessed]);

  // Clean up sessionStorage on component unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining shared audio data when component unmounts
      sessionStorage.removeItem('sharedQiraat');
      sessionStorage.removeItem('sharedReciter');
      sessionStorage.removeItem('sharedAudioProcessed');
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
