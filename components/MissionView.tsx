"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Breadboard } from "@/components/Breadboard";
import { useCatalog } from "@/components/Catalog";
import { Diagram } from "@/components/Diagram";
import { ReportProblem } from "@/components/ReportProblem";
import { termsIn } from "@/lib/glossary";
import { nextOpening, optionOrder } from "@/lib/shuffle";
import { markRedeemed, recordAttempt, useAppState } from "@/lib/store";
import type { Highlight, Mission, Source } from "@/lib/types";
import { fill, ui } from "@/lib/ui";

const LETTERS = ["A", "B", "C", "D"];
const DONT_KNOW = -1;

// The mission itself and everything about it come from the server page, so the browser
// loads one mission and not the catalog. Lists and counts come from the light index.
export function MissionView({
  mission,
  index,
  fault,
  source,
  verified,
  demo,
}: {
  mission: Mission;
  // The mission's position in the play order, from 0.
  index: number;
  // What to mark on the circuit and in the code once the answer is revealed.
  fault?: Highlight;
  source?: Source;
  // True when the symptom was reproduced on a physical board.
  verified: boolean;
  // Set when the mission is shown as a step of the three-minute tour.
  demo?: { step: number; total: number };
}) {
  const { lang, attempts, primerOpen, seed, loadedAt, ready } = useAppState();
  const t = ui[lang];
  const { missions, lessons } = useCatalog();
  const attempt = attempts[mission.id];
  const lesson = lessons.find((l) => l.slug === mission.lesson);
  // A new order of options on every opening of the mission and every practice run.
  const [opening, setOpening] = useState(nextOpening);
  const order = optionOrder(
    mission.id,
    mission.options.length,
    ready ? seed + loadedAt + opening * 7919 : 0,
  );

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
  const highlight = revealed ? fault : undefined;

  function pick(option: number) {
    if (revealed) return;
    if (practice) setPractice({ picked: option, checked: false });
    else setPicked(option);
  }

  function check() {
    if (choice === null) return;
    if (practice) {
      setPractice({ picked: choice, checked: true });
      if (correct && attempt && !attempt.correct) markRedeemed(mission.id);
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

  // A–D or 1–4 pick an option, "?" picks "I don't know", Enter checks. Re-bound on every
  // render so the handler always sees the current choice.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Keys pressed inside a form field or the report form are not answers.
      if (target?.closest("input, textarea, select, [data-report]")) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        // Enter on a link or button does that control's own job, except on an answer
        // option, where it confirms the choice (otherwise click-then-Enter would do nothing).
        const control = target?.closest("a, button, summary");
        if (control && !control.hasAttribute("data-option")) return;
        e.preventDefault();
        check();
        return;
      }
      const position = "abcd".indexOf(e.key.toLowerCase()) + 1 || "1234".indexOf(e.key) + 1;
      if (e.key.length === 1 && position > 0 && position <= order.length) {
        pick(order[position - 1]);
      } else if (e.key === "?") {
        pick(DONT_KNOW);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const nextMission = missions[index + 1];
  const next = demo
    ? demo.step < demo.total
      ? { href: `/demo/${demo.step + 1}`, label: t.next }
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
            ? fill(t.demoOf, { n: demo.step, total: demo.total })
            : fill(t.missionOf, { n: index + 1, total: missions.length })}
        </span>
      </div>

      <h1 className="mt-5 font-display text-2xl leading-tight font-bold text-balance sm:text-3xl">
        {mission.title[lang]}
      </h1>
      <p className="mt-1.5 text-sm text-mute">
        {mission.diagram.pins.length ? t.board : t.noBoard}
        {verified && (
          <span className="ml-2 font-medium text-good">✓ {t.verified}</span>
        )}
      </p>

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

      {mission.board && (
        <Section title={t.boardTitle}>
          <div className="pop overflow-x-auto">
            <Breadboard board={mission.board} highlight={highlight?.holes} label={t.boardTitle} />
          </div>
          <p className="mt-2 text-sm text-mute">{t.boardHint}</p>
        </Section>
      )}

      <Section title={mission.board ? t.planTitle : t.circuit}>
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
        {/* Hidden until the saved state is read: the order of options depends on it, and
            they would visibly jump otherwise. */}
        <div className={`space-y-2.5 ${ready ? "" : "invisible"}`}>
          {order.map((option, position) => {
            const isAnswer = revealed && option === mission.answer;
            const isWrongPick = revealed && option === choice && !correct;
            return (
              <button
                key={option}
                data-option
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
            data-option
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
                onClick={() => {
                  setPractice({ picked: null, checked: false });
                  setOpening(nextOpening());
                }}
                className="btn"
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        )}
      </Section>

      <ReportProblem missionId={mission.id} />
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
