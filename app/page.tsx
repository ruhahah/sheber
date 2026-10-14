"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrokenCircuit } from "@/components/BrokenCircuit";
import { useCatalog } from "@/components/Catalog";
import { Icon } from "@/components/Icon";
import { Status } from "@/components/Status";
import { levelTitle, levelsOf } from "@/lib/profile";
import { summarize } from "@/lib/stats";
import { setState, useAppState } from "@/lib/store";
import { dailyMission, nextInRoute, quickRoute } from "@/lib/tracks";
import type { MissionInfo } from "@/lib/types";
import { fill, ui, type Dict } from "@/lib/ui";

// Levels from this one on are marked as advanced.
const ADVANCED_FROM = 10;

const FILTERS: { id: "all" | "todo" | "missed" | "saved"; label: keyof Dict }[] = [
  { id: "all", label: "filterAll" },
  { id: "todo", label: "filterTodo" },
  { id: "missed", label: "filterMissed" },
  { id: "saved", label: "filterSaved" },
];
type Filter = (typeof FILTERS)[number]["id"];

const pickRandom = (list: MissionInfo[]) => list[Math.floor(Math.random() * list.length)];

export default function Home() {
  const { lang, attempts, ready, nickname, welcomeDismissed, bookmarks, track, loadedAt } =
    useAppState();
  const t = ui[lang];
  const router = useRouter();
  const catalog = useCatalog();
  const { missions } = catalog;
  const stats = summarize(missions, attempts);
  const nextMission = missions.find((m) => !attempts[m.id]);

  const route = quickRoute(missions);
  const routeDone = route.filter((m) => attempts[m.id]).length;
  const routeNext = nextInRoute(route, attempts);
  // Known only in the browser, where "today" and the saved answers are.
  const daily = ready ? dailyMission(missions, attempts, loadedAt) : undefined;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const needle = query.trim().toLocaleLowerCase(lang);
  const matches = (m: MissionInfo) => {
    const a = attempts[m.id];
    if (needle && !m.title[lang].toLocaleLowerCase(lang).includes(needle)) return false;
    if (filter === "todo") return !a;
    if (filter === "missed") return a !== undefined && !a.correct;
    if (filter === "saved") return bookmarks.includes(m.id);
    return true;
  };
  const shown = missions.filter(matches);
  const filtering = needle !== "" || filter !== "all";

  function openRandom() {
    const open = shown.filter((m) => !attempts[m.id]);
    const pool = open.length ? open : shown;
    if (pool.length === 0) return;
    setState({ track: null });
    router.push(`/missions/${pickRandom(pool).id}`);
  }

  return (
    <main>
      {ready && !nickname.trim() && !welcomeDismissed && (
        <aside className="note mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
          <p className="flex-1">
            <span className="font-semibold">{t.welcomeTitle}</span> {t.welcomeText}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/profile" className="btn btn-primary">
              {t.welcomeAction}
            </Link>
            <button onClick={() => setState({ welcomeDismissed: true })} className="btn">
              {t.dismiss}
            </button>
          </div>
        </aside>
      )}

      <section className="grid gap-8 md:grid-cols-[1fr_20rem] md:items-center">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 font-display text-[1.7rem] leading-[1.12] font-extrabold text-balance sm:text-5xl">
            {t.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-mute">{t.intro}</p>
          <Link href="/demo/1" className="btn mt-6">
            {t.demoStart} →
          </Link>
        </div>

        <div className="pop p-5">
          <BrokenCircuit />
          <p className="mt-2 font-semibold">
            {fill(t.progress, { found: stats.found, total: stats.total })}
          </p>
          <div className="mt-3 flex gap-0.5" aria-hidden="true">
            {missions.map((m) => {
              const a = attempts[m.id];
              return (
                <span
                  key={m.id}
                  className={`h-2.5 flex-1 rounded-sm ${
                    !a
                      ? "bg-sunken"
                      : a.correct
                        ? "bg-good"
                        : a.choice === -1
                          ? "bg-mute"
                          : "bg-bad"
                  }`}
                />
              );
            })}
          </div>
          <p className="mt-2 text-sm text-mute">{fill(t.answered, { n: stats.answered })}</p>
          <Link
            href={nextMission ? `/missions/${nextMission.id}` : "/results"}
            onClick={() => track && setState({ track: null })}
            className="btn btn-primary mt-4 w-full"
          >
            {!nextMission ? t.allDone : stats.answered === 0 ? t.start : t.continue}
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card flex flex-col p-5">
          <p className="eyebrow">{t.quickTitle}</p>
          <p className="mt-2 flex-1">{t.quickText}</p>
          <div className="mt-4 flex gap-1" aria-hidden="true">
            {route.map((m) => {
              const a = attempts[m.id];
              return (
                <span
                  key={m.id}
                  className={`h-2.5 flex-1 rounded-sm border border-edge ${
                    !a ? "bg-sunken" : a.correct ? "bg-good" : a.choice === -1 ? "bg-mute" : "bg-bad"
                  }`}
                />
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {routeNext ? (
              <Link
                href={`/missions/${routeNext.id}`}
                onClick={() => setState({ track: "quick" })}
                className="btn"
              >
                {routeDone === 0 ? t.quickStart : t.quickContinue} →
              </Link>
            ) : (
              <span className="stamp text-good">{t.quickDone}</span>
            )}
            <span className="text-sm text-mute">
              {fill(t.quickProgress, { n: routeDone, total: route.length })}
            </span>
          </div>
        </div>

        <div className="card flex flex-col p-5">
          <p className="eyebrow">{t.dailyTitle}</p>
          {daily ? (
            <>
              <p className="mt-2 flex-1 text-lg font-semibold">{daily.title[lang]}</p>
              <p className="mt-1 text-sm text-mute">{levelTitle(daily.level, lang)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href={`/missions/${daily.id}`}
                  onClick={() => track && setState({ track: null })}
                  className="btn"
                >
                  {t.open} →
                </Link>
                {attempts[daily.id] && <Status attempt={attempts[daily.id]} lang={lang} />}
              </div>
            </>
          ) : (
            <p className="mt-2 flex-1 text-mute">…</p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="min-w-0 flex-1 rounded-lg border-[1.5px] border-edge bg-panel px-3 py-2 placeholder:text-mute/70 sm:max-w-xs"
          />
          <button onClick={openRandom} className="btn">
            {t.randomMission}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border-[1.5px] px-3 py-1 text-sm ${
                filter === f.id
                  ? "border-accent bg-accent/15 font-medium"
                  : "border-line bg-panel hover:border-edge"
              }`}
            >
              {t[f.label]}
            </button>
          ))}
          {filtering && (
            <span className="ml-1 text-sm text-mute">
              {fill(t.filterCount, { n: shown.length })}
            </span>
          )}
        </div>
        {filtering && shown.length === 0 && <p className="mt-6 text-mute">{t.filterEmpty}</p>}
      </section>

      {levelsOf(catalog).map((level) => {
        if (!shown.some((m) => m.level === level)) return null;
        return (
          <section key={level} className="ticket-group mt-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b-[1.5px] border-edge pb-3">
              <h2 className="font-display text-xl font-bold">{levelTitle(level, lang)}</h2>
              {level >= ADVANCED_FROM && <span className="stamp mb-1 text-mute">{t.advanced}</span>}
            </div>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {missions.map((m, i) => {
                if (m.level !== level || !matches(m)) return null;
                return (
                  <li key={m.id}>
                    <Link
                      href={`/missions/${m.id}`}
                      onClick={() => track && setState({ track: null })}
                      className="ticket"
                    >
                      <span className="ticket-stub">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex flex-1 items-center justify-between gap-3 px-4 py-3.5">
                        <span className="flex items-center gap-2 font-medium">
                          {bookmarks.includes(m.id) && (
                            <span className="shrink-0 text-accent-text">
                              <Icon name="star" size={15} />
                            </span>
                          )}
                          {m.title[lang]}
                        </span>
                        <Status attempt={attempts[m.id]} lang={lang} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
