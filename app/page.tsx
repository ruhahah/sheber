"use client";

import Link from "next/link";
import { BrokenCircuit } from "@/components/BrokenCircuit";
import { Status } from "@/components/Status";
import { missions } from "@/lib/missions";
import { summarize } from "@/lib/stats";
import { setState, useAppState } from "@/lib/store";
import { fill, ui } from "@/lib/ui";

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const ADVANCED_FROM = 7;

export default function Home() {
  const { lang, attempts, ready, nickname, welcomeDismissed } = useAppState();
  const t = ui[lang];
  const stats = summarize(attempts);
  const nextMission = missions.find((m) => !attempts[m.id]);
  const levelTitle = {
    1: t.level1,
    2: t.level2,
    3: t.level3,
    4: t.level4,
    5: t.level5,
    6: t.level6,
    7: t.level7,
    8: t.level8,
  };

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
            className="btn btn-primary mt-4 w-full"
          >
            {!nextMission ? t.allDone : stats.answered === 0 ? t.start : t.continue}
          </Link>
        </div>
      </section>

      {LEVELS.map((level) => (
        <section key={level} className="mt-14">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b-[1.5px] border-edge pb-3">
            <h2 className="font-display text-xl font-bold">{levelTitle[level]}</h2>
            {level >= ADVANCED_FROM && <span className="stamp mb-1 text-mute">{t.advanced}</span>}
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {missions.map((m, i) => {
              if (m.level !== level) return null;
              return (
                <li key={m.id}>
                  <Link href={`/missions/${m.id}`} className="ticket">
                    <span className="ticket-stub">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex flex-1 items-center justify-between gap-3 px-4 py-3.5">
                      <span className="font-medium">{m.title[lang]}</span>
                      <Status attempt={attempts[m.id]} lang={lang} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
