"use client";

import Link from "next/link";
import { useCatalog } from "@/components/Catalog";
import { profileStats, rankFor } from "@/lib/profile";
import { useAppState } from "@/lib/store";
import { ui } from "@/lib/ui";

// A printable summary of the visitor's own progress. Nothing is issued or checked by a
// server: it shows what is saved in this browser, which is why it says "progress".
export default function Certificate() {
  const state = useAppState();
  const { lang, nickname, group, ready, loadedAt } = state;
  const t = ui[lang];
  const catalog = useCatalog();
  const stats = profileStats(catalog, state);
  const rank = rankFor(stats.found);
  const name = nickname.trim();
  const date = ready
    ? new Date(loadedAt).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })
    : "";

  const figures = [
    { label: t.statFound, value: `${stats.found}/${catalog.missions.length}` },
    { label: t.statAccuracy, value: `${stats.accuracy}%` },
    { label: t.statLessons, value: `${stats.lessonsRead}/${catalog.lessons.length}` },
  ];

  return (
    <main className="mx-auto max-w-2xl">
      <section className="pop px-6 py-10 text-center sm:px-12 sm:py-14">
        <p className="font-display text-xl font-bold">Sheber</p>
        <p className="eyebrow mt-1">{t.certTitle}</p>

        <p className="mt-10 text-mute">{t.certIntro}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold break-words sm:text-4xl">
          {name || t.guest}
        </h1>
        {group.trim() && <p className="mt-1 text-mute">{group}</p>}

        <p className="mt-8 text-sm text-mute">{t.certRank}</p>
        <p className="mt-2">
          <span className="stamp stamp-lg text-accent-text">{rank.current[lang]}</span>
        </p>

        <dl className="mt-10 grid grid-cols-3 gap-3">
          {figures.map((f) => (
            <div key={f.label}>
              <dd className="font-display text-2xl font-extrabold">{f.value}</dd>
              <dt className="mt-1 text-xs text-mute sm:text-sm">{f.label}</dt>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-sm text-mute">{date}</p>
      </section>

      {ready && !name && (
        <p className="note mt-6 px-5 py-4 print:hidden">
          {t.certNeedName}{" "}
          <Link href="/profile" className="font-medium underline underline-offset-2">
            {t.navProfile} →
          </Link>
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button onClick={() => window.print()} className="btn btn-primary">
          {t.certPrint}
        </button>
        <Link href="/profile" className="btn">
          {t.navProfile}
        </Link>
      </div>
    </main>
  );
}
