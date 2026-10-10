"use client";

import Link from "next/link";
import { useState } from "react";
import { verdict } from "@/components/Status";
import { missions } from "@/lib/missions";
import { resultText, summarize } from "@/lib/stats";
import { useAppState } from "@/lib/store";
import { faultTypeLabel, fill, ui } from "@/lib/ui";

const RING = 2 * Math.PI * 52;

export default function Results() {
  const { lang, attempts, nickname, group } = useAppState();
  const t = ui[lang];
  const stats = summarize(attempts);
  const [copied, setCopied] = useState(false);

  if (stats.answered === 0) {
    return (
      <main>
        <p className="eyebrow">{t.navResults}</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">{t.resultTitle}</h1>
        <p className="mt-4 text-lg text-mute">{t.noResults}</p>
        <Link href={`/missions/${missions[0].id}`} className="btn btn-primary mt-6">
          {t.start}
        </Link>
      </main>
    );
  }

  const text = resultText(nickname, group, attempts);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable; the text stays visible to select by hand.
    }
  }

  return (
    <main>
      <p className="eyebrow">{t.navResults}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{t.resultTitle}</h1>

      <div className="mt-8 grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="pop flex items-center gap-5 p-5">
          <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={t.faultsFound}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--sunken)" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--good)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(stats.found / stats.total) * RING} ${RING}`}
              transform="rotate(-90 60 60)"
            />
            <text
              x="60"
              y="68"
              textAnchor="middle"
              fill="var(--ink)"
              className="font-display text-[22px] font-extrabold"
            >
              {stats.found}/{stats.total}
            </text>
          </svg>
          <div>
            <p className="font-semibold">{t.faultsFound}</p>
            <p className="mt-1 text-sm text-mute">
              {t.missed}: {stats.missed} · {t.unknown}: {stats.unknown}
            </p>
            <p className="mt-3 font-mono text-2xl font-bold">
              {fill(t.seconds, { n: stats.avgSeconds })}
            </p>
            <p className="text-sm text-mute">{t.avgTime}</p>
          </div>
        </div>

        <div className="pop p-5">
          <h2 className="eyebrow">{t.byType}</h2>
          <ul className="mt-3 space-y-2.5">
            {stats.byType.map(({ type, found, total }) => (
              <li key={type} className="grid grid-cols-[9rem_1fr_auto] items-center gap-3 text-sm">
                <span>{faultTypeLabel[type][lang]}</span>
                <span className="flex gap-1" aria-hidden="true">
                  {Array.from({ length: total }, (_, i) => (
                    <span
                      key={i}
                      className={`h-3 flex-1 rounded-sm border border-edge ${
                        i < found ? "bg-good" : "bg-sunken"
                      }`}
                    />
                  ))}
                </span>
                <span className="font-mono text-mute">
                  {found}/{total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="eyebrow">{t.byMission}</h2>
        <ul className="pop mt-4 divide-y divide-line overflow-hidden">
          {missions.map((m, i) => {
            const attempt = attempts[m.id];
            return (
              <li key={m.id}>
                <Link
                  href={`/missions/${m.id}`}
                  className="flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-sunken"
                >
                  <span className="font-mono text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{m.title[lang]}</span>
                  {attempt && (
                    <span className="font-mono text-mute">
                      {fill(t.seconds, { n: Math.round(attempt.ms / 1000) })}
                    </span>
                  )}
                  <span
                    className={`w-24 shrink-0 text-right font-semibold ${
                      attempt ? verdict(attempt, t).color : "text-mute"
                    }`}
                  >
                    {attempt ? verdict(attempt, t).label : "—"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="eyebrow">{t.share}</h2>
        <p className="mt-2 max-w-xl text-sm text-mute">{t.shareHint}</p>
        <pre className="card mt-4 max-h-48 overflow-auto bg-sunken p-4 font-mono text-xs leading-relaxed">
          {text}
        </pre>
        <button onClick={copy} className="btn btn-primary mt-4">
          {copied ? t.copied : t.copy}
        </button>
        <p className="mt-6 text-sm">
          <Link href="/teacher" className="text-accent-text underline underline-offset-2">
            {t.teacherLink} →
          </Link>
        </p>
      </section>
    </main>
  );
}
