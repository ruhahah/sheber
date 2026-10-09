import { useSyncExternalStore } from "react";
import type { Lang } from "./missions";

export type Theme = "system" | "light" | "dark";

// Only the first answer to a mission is kept, so the numbers reflect a real first try.
// choice is the option's index in the mission data, or -1 for "I don't know".
export type Attempt = { choice: number; correct: boolean; ms: number; at: string };

export type AppState = {
  lang: Lang;
  theme: Theme;
  nickname: string;
  primerOpen: boolean;
  // Per-device seed for the order of answer options; 0 means "not shuffled yet".
  seed: number;
  attempts: Record<string, Attempt>;
};

// Also read by the inline script in app/layout.tsx.
const STORAGE_KEY = "sheber:v1";

const initial: AppState = {
  lang: "en",
  theme: "system",
  nickname: "",
  primerOpen: true,
  seed: 0,
  attempts: {},
};

let state = initial;
let loaded = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep working in memory when storage is unavailable.
  }
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    // Storage is blocked or holds something unreadable: start fresh.
  }
  if (!state.seed) {
    state = { ...state, seed: 1 + Math.floor(Math.random() * 1e9) };
    persist();
  }
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
  listeners.forEach((l) => l());
}

export function recordAttempt(missionId: string, attempt: Attempt) {
  load();
  if (state.attempts[missionId]) return;
  setState({ attempts: { ...state.attempts, [missionId]: attempt } });
}

export function useAppState() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initial);
}
