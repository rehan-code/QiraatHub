/**
 * Thin wrapper around the Web Speech API for continuous Arabic recitation
 * capture. Chrome/Edge/Safari expose it (mostly as webkitSpeechRecognition);
 * Firefox does not.
 *
 * Browsers silently end continuous sessions (silence timeouts, ~60s caps,
 * iOS quirks), so the wrapper auto-restarts while active and carries the
 * accumulated final transcript across restarts. The engine consumes the
 * final text append-only, so downstream nothing notices restarts.
 */

// Minimal Web Speech API typings (not part of TS dom lib).
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
  length: number;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart?: (() => void) | null;
  onaudiostart?: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
    /** Test seam: lets dev tooling substitute a scripted recognizer. */
    __qhFakeSpeechCtor?: SpeechRecognitionCtor;
  }
  interface Navigator {
    userAgentData?: { brands?: { brand: string; version: string }[] };
  }
}

/**
 * Chromium forks (Arc, Brave, Vivaldi…) expose `webkitSpeechRecognition` but
 * are built without Google's speech API keys, so every session captures audio
 * and then dies with `network` — nothing the user can fix. Chrome and Edge
 * name themselves in the UA-CH brand list; the forks only claim "Chromium".
 */
function isUnbrandedChromium(): boolean {
  if (typeof navigator === "undefined") return false;
  const brands = navigator.userAgentData?.brands;
  if (!brands?.length) return false; // Safari/Firefox don't expose UA-CH
  return (
    brands.some((b) => /Chromium/i.test(b.brand)) &&
    !brands.some((b) => /Google Chrome|Microsoft Edge/i.test(b.brand))
  );
}

/** Why recognition can't reach a speech service, in order of likelihood. */
function speechServiceMessage(): string {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "You appear to be offline. Speech recognition needs a connection — reconnect and try again.";
  }
  if (isUnbrandedChromium()) {
    return "This browser has no speech recognition service. Arc, Brave and similar Chromium browsers ship without it — open the Quran page in Chrome, Edge or Safari to follow along.";
  }
  return "The speech recognition service is unreachable. Check your connection, or try Chrome, Edge or Safari.";
}

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.__qhFakeSpeechCtor ??
    window.SpeechRecognition ??
    window.webkitSpeechRecognition ??
    null
  );
}

export function isSpeechRecognitionSupported(): boolean {
  return getCtor() !== null;
}

export type MicPermissionState = "granted" | "denied" | "prompt" | "unknown";

/**
 * Best-effort microphone permission probe via the Permissions API. Safari
 * and some browsers don't expose the "microphone" permission name — they
 * report "unknown" and the recognizer's own prompt/error flow takes over.
 */
export async function queryMicrophonePermission(): Promise<MicPermissionState> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return "unknown";
  }
  try {
    const status = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    if (status.state === "granted" || status.state === "denied") {
      return status.state;
    }
    return "prompt";
  } catch {
    return "unknown";
  }
}

export interface SpeechSessionCallbacks {
  /** Full final transcript so far + the current volatile interim tail. */
  onTranscript: (finalText: string, interimText: string) => void;
  /** Unrecoverable failure; the session is stopped when this fires. */
  onFatalError: (message: string) => void;
  /**
   * Recognition actually began (permission granted, audio flowing). Fires
   * once per underlying instance; treat as idempotent.
   */
  onCaptureStart?: () => void;
}

export interface SpeechSession {
  start(): void;
  stop(): void;
}

const RESTART_DELAY_MS = 250;
const MAX_SILENT_RESTARTS = 6; // consecutive restarts with no results
const MAX_NETWORK_ERRORS = 3; // consecutive speech-service failures

export function createSpeechSession(
  cb: SpeechSessionCallbacks,
  lang = "ar-SA"
): SpeechSession | null {
  const Ctor = getCtor();
  if (!Ctor) return null;

  let active = false;
  let recognition: SpeechRecognitionLike | null = null;
  /** Finals accumulated in completed recognition instances. */
  let committedFinal = "";
  /** Finals within the current recognition instance. */
  let instanceFinal = "";
  let gotResultsThisInstance = false;
  let silentRestarts = 0;
  /** Consecutive speech-service failures; any successful result clears them. */
  let networkErrors = 0;
  let restartTimer: ReturnType<typeof setTimeout> | null = null;

  const fail = (message: string) => {
    active = false;
    if (restartTimer) clearTimeout(restartTimer);
    try {
      recognition?.abort();
    } catch {
      // already stopped
    }
    recognition = null;
    cb.onFatalError(message);
  };

  const spin = () => {
    if (!active) return;
    // A fresh instance per (re)start: reusing one after `onend` misbehaves
    // on iOS Safari.
    const rec = new Ctor();
    recognition = rec;
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    instanceFinal = "";
    gotResultsThisInstance = false;

    const captureStarted = () => {
      if (!active || recognition !== rec) return;
      cb.onCaptureStart?.();
    };
    rec.onstart = captureStarted;
    rec.onaudiostart = captureStarted;

    rec.onresult = (e) => {
      if (!active || recognition !== rec) return;
      gotResultsThisInstance = true;
      silentRestarts = 0;
      networkErrors = 0;
      let finals = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        const text = res[0]?.transcript ?? "";
        if (res.isFinal) finals += ` ${text}`;
        else interim += ` ${text}`;
      }
      instanceFinal = finals;
      cb.onTranscript(committedFinal + instanceFinal, interim);
    };

    rec.onerror = (e) => {
      if (!active || recognition !== rec) return;
      switch (e.error) {
        case "not-allowed":
        case "service-not-allowed":
          fail(
            "Microphone access is blocked. Allow the microphone for this site (padlock icon in the address bar) and try again."
          );
          break;
        case "audio-capture":
          fail("No microphone was found. Check your audio input and try again.");
          break;
        case "network":
          // A browser without a working speech service fails this way on
          // every attempt, so a short run of them is diagnostic, not a blip.
          if (++networkErrors >= MAX_NETWORK_ERRORS) fail(speechServiceMessage());
          break;
        default:
          // no-speech / aborted: onend fires next and the session restarts.
          break;
      }
    };

    rec.onend = () => {
      if (!active || recognition !== rec) return;
      committedFinal += instanceFinal;
      instanceFinal = "";
      if (!gotResultsThisInstance) {
        silentRestarts++;
        if (silentRestarts >= MAX_SILENT_RESTARTS) {
          fail(
            "Speech recognition keeps stopping. Check your connection and microphone, then try again."
          );
          return;
        }
      }
      restartTimer = setTimeout(spin, RESTART_DELAY_MS);
    };

    try {
      rec.start();
    } catch {
      // start() throws if called while another instance is winding down;
      // retry shortly.
      restartTimer = setTimeout(spin, RESTART_DELAY_MS * 2);
    }
  };

  return {
    start() {
      if (active) return;
      active = true;
      committedFinal = "";
      instanceFinal = "";
      silentRestarts = 0;
      networkErrors = 0;
      spin();
    },
    stop() {
      active = false;
      if (restartTimer) clearTimeout(restartTimer);
      const rec = recognition;
      recognition = null;
      try {
        rec?.abort();
      } catch {
        // already stopped
      }
    },
  };
}
