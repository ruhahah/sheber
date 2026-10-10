import { useSyncExternalStore } from "react";
import { LANGS, type Lang } from "./missions";

export type Theme = "system" | "light" | "dark";
export type TextSize = "normal" | "large";

// Only the first answer to a mission is kept, so the numbers reflect a real first try.
// choice is the option's index in the mission data, or -1 for "I don't know".
export type Attempt = { choice: number; correct: boolean; ms: number; at: string };

export type AppState = {
  // False on the server and until localStorage has been read in the browser.
  ready: boolean;
  // When this visit started (ms since epoch); 0 until ready. Anchors "today" for streaks.
  loadedAt: number;
  lang: Lang;
  theme: Theme;
  textSize: TextSize;
  reduceMotion: boolean;
  nickname: string;
  group: string;
  avatarColor: string;
  avatarIcon: string;
  primerOpen: boolean;
  welcomeDismissed: boolean;
  // Per-device seed for the order of answer options; 0 means "not shuffled yet".
  seed: number;
  attempts: Record<string, Attempt>;
  // Lesson slug -> when it was first opened.
  lessonsRead: Record<string, string>;
  // Missions missed at first and later solved in a practice run.
  redeemed: string[];
};

// Also read by the inline script in app/layout.tsx.
const STORAGE_KEY = "sheber:v1";

const initial: AppState = {
  ready: false,
  loadedAt: 0,
  lang: "en",
  theme: "system",
  textSize: "normal",
  reduceMotion: false,
  nickname: "",
  group: "",
  avatarColor: "orange",
  avatarIcon: "bolt",
  primerOpen: true,
  welcomeDismissed: false,
  seed: 0,
  attempts: {},
  lessonsRead: {},
  redeemed: [],
};

let state = initial;
let loaded = false;
const listeners = new Set<() => void>();

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// Keeps only well-formed, known fields. Saved or imported data may be old, edited by hand
// or simply not ours, and one bad value (an unknown language, say) would break every page.
function sanitize(input: unknown): Partial<AppState> {
  if (!isRecord(input)) return {};
  const out: Partial<AppState> = {};
  const text = (v: unknown) => (typeof v === "string" ? v.slice(0, 30) : undefined);

  if ((LANGS as readonly unknown[]).includes(input.lang)) out.lang = input.lang as Lang;
  if (input.theme === "system" || input.theme === "light" || input.theme === "dark") {
    out.theme = input.theme;
  }
  if (input.textSize === "normal" || input.textSize === "large") out.textSize = input.textSize;
  if (typeof input.reduceMotion === "boolean") out.reduceMotion = input.reduceMotion;
  if (typeof input.primerOpen === "boolean") out.primerOpen = input.primerOpen;
  if (typeof input.welcomeDismissed === "boolean") out.welcomeDismissed = input.welcomeDismissed;
  if (typeof input.seed === "number" && input.seed > 0) out.seed = input.seed;
  for (const key of ["nickname", "group", "avatarColor", "avatarIcon"] as const) {
    const value = text(input[key]);
    if (value !== undefined) out[key] = value;
  }

  if (isRecord(input.attempts)) {
    out.attempts = {};
    for (const [id, a] of Object.entries(input.attempts)) {
      if (
        isRecord(a) &&
        typeof a.choice === "number" &&
        typeof a.correct === "boolean" &&
        typeof a.ms === "number" &&
        a.ms >= 0 &&
        typeof a.at === "string" &&
        !Number.isNaN(Date.parse(a.at))
      ) {
        out.attempts[id] = { choice: a.choice, correct: a.correct, ms: a.ms, at: a.at };
      }
    }
  }
  if (isRecord(input.lessonsRead)) {
    out.lessonsRead = Object.fromEntries(
      Object.entries(input.lessonsRead).filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === "string" && !Number.isNaN(Date.parse(entry[1])),
      ),
    );
  }
  if (Array.isArray(input.redeemed)) {
    out.redeemed = input.redeemed.filter((id): id is string => typeof id === "string");
  }
  return out;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep working in memory when storage is unavailable.
  }
}

function notify() {
  listeners.forEach((l) => l());
}

function load() {
  if (loaded) return;
  loaded = true;
  let saved: Partial<AppState> = {};
  try {
    saved = sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    // Storage is blocked or holds something unreadable: start fresh.
  }
  state = {
    ...initial,
    ...saved,
    ready: true,
    loadedAt: Date.now(),
    seed: saved.seed || 1 + Math.floor(Math.random() * 1e9),
  };
  persist();

  // Another tab saved something: adopt it, otherwise this tab's next save would wipe it.
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      state = { ...state, ...sanitize(JSON.parse(e.newValue)) };
      notify();
    } catch {
      // Not ours; ignore.
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  load();
  return state;
}

export function setState(patch: Partial<AppState>) {
  load();
  state = { ...state, ...patch };
  persist();
  notify();
}

export function recordAttempt(missionId: string, attempt: Attempt) {
  load();
  if (state.attempts[missionId]) return;
  setState({ attempts: { ...state.attempts, [missionId]: attempt } });
}

export function markLessonRead(slug: string) {
  load();
  if (state.lessonsRead[slug]) return;
  setState({ lessonsRead: { ...state.lessonsRead, [slug]: new Date().toISOString() } });
}

export function markRedeemed(missionId: string) {
  load();
  if (state.redeemed.includes(missionId)) return;
  setState({ redeemed: [...state.redeemed, missionId] });
}

// Everything worth carrying to another device, as written by the Settings export.
export function exportState() {
  load();
  return { app: "sheber", version: 1, exportedAt: new Date().toISOString(), state };
}

// Accepts a file produced by exportState(); returns false when it is something else.
export function importState(data: unknown) {
  if (!isRecord(data) || data.app !== "sheber") return false;
  // Older exports held only the nickname and the answers at the top level.
  const incoming = sanitize(data.state ?? { attempts: data.attempts, nickname: data.nickname });
  if (!incoming.attempts) return false;
  load();
  state = {
    ...initial,
    ...incoming,
    ready: true,
    loadedAt: state.loadedAt,
    seed: incoming.seed || state.seed,
  };
  persist();
  notify();
  return true;
}

// Forgets the profile, the settings and every answer, keeping only the chosen language.
export function resetAll() {
  load();
  state = {
    ...initial,
    ready: true,
    loadedAt: state.loadedAt,
    lang: state.lang,
    seed: state.seed,
  };
  persist();
  notify();
}

export function useAppState() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initial);
}
