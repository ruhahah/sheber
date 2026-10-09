"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Diagram } from "@/components/Diagram";
import { DEMO, highlights, optionOrder, sources, verifiedOnHardware } from "@/lib/extras";
import { termsIn } from "@/lib/glossary";
import { lessons } from "@/lib/lessons";
import { missions } from "@/lib/missions";
import { recordAttempt, useAppState } from "@/lib/store";
import { fill, ui } from "@/lib/ui";

const LETTERS = ["A", "B", "C", "D"];
const DONT_KNOW = -1;

// demo is the 1-based step when the mission is shown as part of the three-minute tour.
export function MissionView({ index, demo }: { index: number; demo?: number }) {
  const { lang, attempts, primerOpen, seed } = useAppState();
  const t = ui[lang];
  const mission = missions[index];
  const attempt = attempts[mission.id];
  const lesson = lessons.find((l) => l.slug === mission.lesson);
  const source = sources[mission.id];
  const order = optionOrder(mission.id, mission.options.length, seed);

  const [picked, setPicked] = useState<number | null>(null);
  // A practice run after the first answer: played locally, never recorded.
  const [practice, setPractice] = useState<{ picked: number | null; checked: boolean } | null>(
    null,
  );
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  // Time counts only while the tab is visible, so a forgotten tab doesn't skew the numbers.
  const clock = useRef({ total: 0, since: 0 });
  useEffect(() => {
    const c = clock.current;
    c.since = Date.now();
    const onVisibility = () => {
      if (document.hidden) c.total += Date.now() - c.since;
      else c.since = Date.now();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    document.title = `${mission.title[lang]} · Sheber`;
  }, [mission, lang]);

  const choice = practice ? practice.picked : (attempt?.choice ?? picked);
  const revealed = practice ? practice.checked : attempt !== undefined;
  const correct = choice === mission.answer;
  const highlight = revealed ? highlights[mission.id] : undefined;

  function pick(option: number) {
    if (revealed) return;
    if (practice) setPractice({ picked: option, checked: false });
    else setPicked(option);
  }

  function check() {
    if (choice === null) return;
    if (practice) {
      setPractice({ picked: choice, checked: true });
      return;
    }
    const c = clock.current;
    recordAttempt(mission.id, {
      choice,
      correct,
      ms: c.total + (document.hidden ? 0 : Date.now() - c.since),
      at: new Date().toISOString(),
    });
  }

  const nextMission = missions[index + 1];
  const next = demo
    ? demo < DEMO.length
      ? { href: `/demo/${demo + 1}`, label: t.next }
      : { href: "/", label: t.demoDone }
    : nextMission
      ? { href: `/missions/${nextMission.id}`, label: t.next }
      : { href: "/results", label: t.seeResults };

  const codeLines = mission.code ? mission.code.split("\n") : [];
  const terms = termsIn(
    [
      mission.primer[lang],
      mission.goal[lang],
      mission.symptom[lang],
      ...mission.options.map((o) => o[lang]),
      mission.code,
    ].join(" "),
    lang,
  );
  const shownTerm = terms.find((term) => term.id === openTerm);
  const wiringText = mission.wiring.map((w) => `${w.from[lang]} → ${w.to[lang]}`).join("; ");

  return (
    <main className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-sm text-mute">
        <Link href="/" className="font-medium hover:text-ink">
          ← {demo ? t.demoExit : t.back}
        </Link>
        <span>
          {demo
            ? fill(t.demoOf, { n: demo, total: DEMO.length })
            : fill(t.missionOf, { n: index + 1, total: missions.length })}
        </span>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <span className="outline-num text-5xl sm:text-6xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight font-bold text-balance sm:text-3xl">
            {mission.title[lang]}
          </h1>
          <p className="mt-1.5 text-sm text-mute">
            {mission.diagram.pins.length ? t.board : t.noBoard}
            {verifiedOnHardware.has(mission.id) && (
              <span className="ml-2 font-medium text-good">✓ {t.verified}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <section className="card px-5 py-4">
          <h2 className="eyebrow">{t.goal}</h2>
          <p className="mt-2 text-lg">{mission.goal[lang]}</p>
        </section>
        <section className="pop overflow-hidden">
          <div className="hazard" />
          <div className="px-5 py-4">
            <h2 className="eyebrow text-bad">{t.symptom}</h2>
            <p className="mt-2 text-lg font-medium">{mission.symptom[lang]}</p>
          </div>
        </section>
      </div>

      {/* On a phone the options are two screens down; offer a way straight to them. */}
      <a href="#answer" className="btn mt-4 w-full sm:hidden">
        {t.question} ↓
      </a>

      <details className="card mt-4 px-4 py-3" open={primerOpen}>
        <summary className="eyebrow text-accent-text">{t.primer}</summary>
        <p className="mt-2 leading-relaxed text-mute">{mission.primer[lang]}</p>
      </details>

      {terms.length > 0 && (
        <div className="mt-4">
          <p className="eyebrow">{t.terms}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {terms.map((term) => (
              <button
                key={term.id}
                onClick={() => setOpenTerm(openTerm === term.id ? null : term.id)}
                aria-expanded={openTerm === term.id}
                className={`rounded-full border-[1.5px] px-3 py-1 text-sm ${
                  openTerm === term.id
                    ? "border-accent bg-accent/15 font-medium"
                    : "border-line bg-panel hover:border-edge"
                }`}
              >
                {term.label[lang]}
              </button>
            ))}
          </div>
          {shownTerm && (
            <p className="card mt-2 px-4 py-3 text-sm leading-relaxed">
              <span className="font-semibold">{shownTerm.label[lang]}.</span>{" "}
              {shownTerm.definition[lang]}
            </p>
          )}
        </div>
      )}

      <Section title={t.circuit}>
        <div className="pop overflow-x-auto">
          <Diagram
            diagram={mission.diagram}
            lang={lang}
            highlight={highlight}
            description={wiringText}
          />
        </div>
        <p className="mt-2 text-xs text-mute sm:hidden">{t.swipe}</p>
        <details className="mt-3 text-sm">
          <summary className="font-medium text-mute hover:text-ink">{t.wiring}</summary>
          <ul className="mt-2 space-y-1.5">
            {mission.wiring.map((w, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span>{w.from[lang]}</span>
                <span className="text-accent-text">→</span>
                <span>{w.to[lang]}</span>
              </li>
            ))}
          </ul>
        </details>
      </Section>

      {codeLines.length > 0 && (
        <Section title={t.code}>
          <pre className="pop overflow-x-auto bg-sunken py-3 font-mono text-[13px] leading-relaxed">
            {codeLines.map((line, i) => {
              const faulty = highlight?.lines?.includes(i + 1);
              return (
                <div
                  key={i}
                  className={`flex border-l-4 pr-4 ${
                    faulty ? "border-bad bg-bad/15" : "border-transparent"
                  }`}
                >
                  <span className="w-9 shrink-0 pr-3 text-right text-mute select-none">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">{line || " "}</span>
                </div>
              );
            })}
          </pre>
        </Section>
      )}

      <Section title={t.question} id="answer">
        {practice && <p className="mb-3 text-sm text-mute">{t.practiceNote}</p>}
        <div className="space-y-2.5">
          {order.map((option, position) => {
            const isAnswer = revealed && option === mission.answer;
            const isWrongPick = revealed && option === choice && !correct;
            return (
              <button
                key={option}
                disabled={revealed}
                onClick={() => pick(option)}
                aria-pressed={choice === option}
                className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left transition-colors ${
                  isAnswer
                    ? "border-good bg-good/10"
                    : isWrongPick
                      ? "border-bad bg-bad/10"
                      : choice === option
                        ? "border-accent bg-accent/10"
                        : "border-line bg-panel hover:border-edge"
                }`}
              >
                <span className="keycap">{LETTERS[position]}</span>
                <span>{mission.options[option][lang]}</span>
              </button>
            );
          })}
          <button
            disabled={revealed}
            onClick={() => pick(DONT_KNOW)}
            aria-pressed={choice === DONT_KNOW}
            className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] border-dashed px-4 py-3 text-left text-mute transition-colors ${
              choice === DONT_KNOW ? "border-accent bg-accent/10 text-ink" : "border-line"
            }`}
          >
            <span className="keycap">?</span>
            <span>{t.dontKnow}</span>
          </button>
        </div>

        {!revealed && (
          <button onClick={check} disabled={choice === null} className="btn btn-primary mt-5">
            {t.check}
          </button>
        )}

        {revealed && (
          <div className="pop mt-6 p-5">
            <span
              className={`stamp stamp-lg stamp-in ${
                correct ? "text-good" : choice === DONT_KNOW ? "text-mute" : "text-bad"
              }`}
            >
              {correct ? t.found : choice === DONT_KNOW ? t.unknown : t.missed}
            </span>
            <p className="mt-4 leading-relaxed">{mission.explanation[lang]}</p>
            {source && (
              <p className="mt-3 text-sm text-mute">
                {t.source}:{" "}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent-text underline underline-offset-2"
                >
                  {source.label} ↗
                </a>
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={next.href} className="btn btn-primary">
                {next.label} →
              </Link>
              {lesson && (
                <Link href={`/learn/${lesson.slug}`} className="btn">
                  {t.readLesson}: {lesson.title[lang]}
                </Link>
              )}
              <button
                onClick={() => setPractice({ picked: null, checked: false })}
                className="btn"
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        )}
      </Section>
    </main>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-4">
      <h2 className="eyebrow mb-3">{title}</h2>
      {children}
    </section>
  );
}
