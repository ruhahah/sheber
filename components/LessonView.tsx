"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Diagram } from "@/components/Diagram";
import { Status } from "@/components/Status";
import { lessonFigures } from "@/lib/extras";
import { lessons } from "@/lib/lessons";
import { missions } from "@/lib/missions";
import { useAppState } from "@/lib/store";
import { fill, ui } from "@/lib/ui";

export function LessonView({ index }: { index: number }) {
  const { lang, attempts } = useAppState();
  const t = ui[lang];
  const lesson = lessons[index];
  const nextLesson = lessons[index + 1];
  const practice = missions.filter((m) => m.lesson === lesson.slug);
  const figure = missions.find((m) => m.id === lessonFigures[lesson.slug]);

  useEffect(() => {
    document.title = `${lesson.title[lang]} · Sheber`;
  }, [lesson, lang]);

  return (
    <main className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-mute">
        <Link href="/learn" className="font-medium hover:text-ink">
          ← {t.allLessons}
        </Link>
        <span>{fill(t.lessonOf, { n: index + 1, total: lessons.length })}</span>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <span className="outline-num text-6xl">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h1 className="font-display text-2xl leading-tight font-bold text-balance sm:text-3xl">
            {lesson.title[lang]}
          </h1>
          <p className="mt-2 text-lg text-mute">{lesson.summary[lang]}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-lg leading-relaxed">
        {lesson.body.map((paragraph, i) => (
          <p key={i}>{paragraph[lang]}</p>
        ))}
      </div>

      {figure && (
        <figure className="mt-8">
          <div className="pop overflow-x-auto">
            <Diagram diagram={figure.diagram} lang={lang} />
          </div>
          <figcaption className="mt-2 text-sm text-mute">{t.figure}</figcaption>
        </figure>
      )}

      <div className="note mt-10 p-5">
        <p className="eyebrow text-ink">{t.rule}</p>
        <p className="mt-2 text-lg font-semibold">{lesson.rule[lang]}</p>
      </div>

      {practice.length > 0 && (
        <section className="mt-12">
          <h2 className="eyebrow">{t.practice}</h2>
          <ul className="mt-4 space-y-4">
            {practice.map((m) => (
              <li key={m.id}>
                <Link href={`/missions/${m.id}`} className="ticket">
                  <span className="ticket-stub">
                    {String(missions.indexOf(m) + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-1 items-center justify-between gap-3 px-4 py-3.5">
                    <span className="font-medium">{m.title[lang]}</span>
                    <Status attempt={attempts[m.id]} lang={lang} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nextLesson && (
        <Link href={`/learn/${nextLesson.slug}`} className="btn mt-12">
          {t.nextLesson}: {nextLesson.title[lang]} →
        </Link>
      )}
    </main>
  );
}
