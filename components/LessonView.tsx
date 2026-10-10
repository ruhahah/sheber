"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Breadboard } from "@/components/Breadboard";
import { useCatalog } from "@/components/Catalog";
import { Diagram } from "@/components/Diagram";
import { Status } from "@/components/Status";
import { markLessonRead, useAppState } from "@/lib/store";
import type { Board, Diagram as DiagramData, Lesson } from "@/lib/types";
import { fill, ui } from "@/lib/ui";

// The lesson and its pictures come from the server page; lists come from the light index.
export function LessonView({
  lesson,
  index,
  figure,
  board,
}: {
  lesson: Lesson;
  index: number;
  // A circuit that illustrates the lesson, if it has one.
  figure?: DiagramData;
  // A breadboard layout, for the lesson on breadboards.
  board?: Board;
}) {
  const { lang, attempts } = useAppState();
  const t = ui[lang];
  const { missions, lessons } = useCatalog();
  const nextLesson = lessons[index + 1];
  const practice = missions.filter((m) => m.lesson === lesson.slug);

  useEffect(() => {
    document.title = `${lesson.title[lang]} · Sheber`;
  }, [lesson, lang]);

  useEffect(() => {
    markLessonRead(lesson.slug);
  }, [lesson.slug]);

  return (
    <main className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-mute">
        <Link href="/learn" className="font-medium hover:text-ink">
          ← {t.allLessons}
        </Link>
        <span>{fill(t.lessonOf, { n: index + 1, total: lessons.length })}</span>
      </div>

      <h1 className="mt-5 font-display text-2xl leading-tight font-bold text-balance sm:text-3xl">
        {lesson.title[lang]}
      </h1>
      <p className="mt-2 text-lg text-mute">{lesson.summary[lang]}</p>

      <div className="mt-8 space-y-4 text-lg leading-relaxed">
        {lesson.body.map((paragraph, i) => (
          <p key={i}>{paragraph[lang]}</p>
        ))}
      </div>

      {board && (
        <figure className="mt-8">
          <div className="pop overflow-x-auto">
            <Breadboard board={board} label={t.boardTitle} />
          </div>
          <figcaption className="mt-2 text-sm text-mute">{t.boardHint}</figcaption>
        </figure>
      )}

      {figure && (
        <figure className="mt-8">
          <div className="pop overflow-x-auto">
            <Diagram diagram={figure} lang={lang} />
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
