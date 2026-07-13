"use client";

/**
 * React hook wiring the speech session to the recitation tracker.
 *
 * The caller supplies the built RecitationIndex (or null while it is being
 * prepared). While the user wants to listen and the index is ready, a
 * speech session runs; each transcript update advances the tracker and the
 * snapshot exposes the current position for highlighting/navigation.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { RecitationTracker } from "./engine";
import type { RecitationIndex } from "./indexer";
import {
  createSpeechSession,
  isSpeechRecognitionSupported,
  queryMicrophonePermission,
  type SpeechSession,
} from "./speech";

export type FollowerStatus = "idle" | "preparing" | "listening" | "error";

export interface FollowerSnapshot {
  status: FollowerStatus;
  /** null until listening; searching until a location locks. */
  phase: "searching" | "locked" | null;
  surah: number | null;
  ayah: number | null;
  /** Page of the currently recited word (jump target). */
  page: number | null;
  /** Span id of the current word (word-level highlight + scroll target). */
  wordId: number | null;
  /** Span id range of the current ayah (ayah highlight). */
  ayahStartId: number | null;
  ayahEndId: number | null;
  /** Last few words heard, for the status pill. */
  tail: string;
  /** True once the recognizer is actually capturing audio (mic granted). */
  micActive: boolean;
  error: string | null;
}

const IDLE: FollowerSnapshot = {
  status: "idle",
  phase: null,
  surah: null,
  ayah: null,
  page: null,
  wordId: null,
  ayahStartId: null,
  ayahEndId: null,
  tail: "",
  micActive: false,
  error: null,
};

const MIC_BLOCKED_MESSAGE =
  "Microphone access is blocked. Allow the microphone for this site (padlock icon in the address bar) and try again.";

function tailOf(finalText: string, interimText: string, words = 5): string {
  const all = `${finalText} ${interimText}`.trim().split(/\s+/);
  return all.slice(-words).join(" ");
}

export function useRecitationFollower(index: RecitationIndex | null) {
  const [wantListening, setWantListening] = useState(false);
  const [snapshot, setSnapshot] = useState<FollowerSnapshot>(IDLE);
  const sessionRef = useRef<SpeechSession | null>(null);
  // Written by the speech callback (outside React), read by effects.
  const snapshotRef = useRef<FollowerSnapshot>(IDLE);
  // Invalidates in-flight start() permission checks when stop() is called.
  const startTokenRef = useRef(0);

  const update = useCallback((next: FollowerSnapshot) => {
    const prev = snapshotRef.current;
    if (
      prev.status === next.status &&
      prev.phase === next.phase &&
      prev.wordId === next.wordId &&
      prev.surah === next.surah &&
      prev.ayah === next.ayah &&
      prev.page === next.page &&
      prev.tail === next.tail &&
      prev.micActive === next.micActive &&
      prev.error === next.error
    ) {
      return;
    }
    snapshotRef.current = next;
    setSnapshot(next);
  }, []);

  useEffect(() => {
    if (!wantListening) return;
    if (!index) {
      update({ ...IDLE, status: "preparing" });
      return;
    }

    const tracker = new RecitationTracker(index);
    const session = createSpeechSession({
      onCaptureStart: () => {
        const prev = snapshotRef.current;
        if (prev.status === "listening" && !prev.micActive) {
          update({ ...prev, micActive: true });
        }
      },
      onTranscript: (finalText, interimText) => {
        const r = tracker.feed(finalText, interimText);
        const tail = tailOf(finalText, interimText);
        if (r.phase === "locked" && r.word && r.ayah) {
          update({
            status: "listening",
            phase: "locked",
            surah: r.word.surah,
            ayah: r.word.ayah,
            page: r.word.page,
            wordId: r.word.id,
            ayahStartId: r.ayah.startId,
            ayahEndId: r.ayah.endId,
            tail,
            micActive: true,
            error: null,
          });
        } else {
          // keep the last locked position visible while re-searching
          const prev = snapshotRef.current;
          update({
            ...prev,
            status: "listening",
            phase: "searching",
            tail,
            micActive: true,
            error: null,
          });
        }
      },
      onFatalError: (message) => {
        setWantListening(false);
        update({ ...IDLE, status: "error", error: message });
      },
    });

    if (!session) {
      setWantListening(false);
      update({
        ...IDLE,
        status: "error",
        error:
          "Speech recognition is not supported in this browser. Try Chrome, Edge or Safari.",
      });
      return;
    }

    sessionRef.current = session;
    update({ ...IDLE, status: "listening", phase: "searching" });
    session.start();

    return () => {
      sessionRef.current = null;
      session.stop();
    };
  }, [wantListening, index, update]);

  const start = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      update({
        ...IDLE,
        status: "error",
        error:
          "Speech recognition is not supported in this browser. Try Chrome, Edge or Safari.",
      });
      return;
    }
    update({ ...IDLE, status: "preparing" });
    // Pre-check the mic permission so an already-denied state gets clear
    // guidance immediately instead of a dead-looking session. "prompt" and
    // "unknown" proceed — the recognizer itself asks the user.
    const token = ++startTokenRef.current;
    void queryMicrophonePermission().then((perm) => {
      if (token !== startTokenRef.current) return; // stopped meanwhile
      if (perm === "denied") {
        update({ ...IDLE, status: "error", error: MIC_BLOCKED_MESSAGE });
        return;
      }
      setWantListening(true);
    });
  }, [update]);

  const stop = useCallback(() => {
    startTokenRef.current++;
    setWantListening(false);
    update(IDLE);
  }, [update]);

  return { snapshot, listening: wantListening, start, stop };
}
