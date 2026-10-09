"use client";

import Link from "next/link";
import { glossary } from "@/lib/glossary";
import { lessons } from "@/lib/lessons";
import { useAppState } from "@/lib/store";
import { ui } from "@/lib/ui";

export default function Learn() {
  const { lang } = useAppState();
  const t = ui[lang];

  return (
    <main>
      <p className="eyebrow">{t.navLearn}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{t.learnTitle}</h1>
      <p className="mt-4 max-w-xl text-lg text-mute">{t.learnIntro}</p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link href={`/learn/${lesson.slug}`} className="ticket">
              <span className="ticket-stub">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 px-4 py-3.5">
                <span className="block font-semibold">{lesson.title[lang]}</span>
                <span className="mt-1 block text-sm text-mute">{lesson.summary[lang]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{t.glossary}</h2>
        <dl className="pop mt-5 divide-y divide-line">
          {glossary.map((term) => (
            <div key={term.id} className="grid gap-x-6 gap-y-1 px-5 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="font-semibold">{term.label[lang]}</dt>
              <dd className="text-mute">{term.definition[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
