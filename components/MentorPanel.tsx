"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { saveMentorChat, useAppState } from "@/lib/store";
import type { MentorMessage, Mission } from "@/lib/types";
import { fill, ui, type Dict } from "@/lib/ui";

// Must match the server (app/api/mentor/route.ts).
const ERROR_MARK = "\u0000error";
const REFUSAL_MARK = "\u0000refusal";
const QUESTION_MAX = 500;

type MentorError =
  | { kind: "notConfigured" }
  | { kind: "rate"; wait: number }
  | { kind: "daily" }
  | { kind: "down" }
  | { kind: "refusal" }
  | { kind: "network" };

// Whether the server has the mentor set up, asked once per page load.
let availability: Promise<boolean> | null = null;
function mentorAvailable() {
  availability ??= fetch("/api/mentor", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : { enabled: false }))
    .then((d: { enabled?: boolean }) => d.enabled === true)
    .catch(() => false);
  return availability;
}

function errorFrom(status: number, data: { error?: string; retryAfter?: number }): MentorError {
  if (data.error === "not_configured") return { kind: "notConfigured" };
  if (data.error === "rate_limited") return { kind: "rate", wait: data.retryAfter ?? 60 };
  if (data.error === "daily_limit") return { kind: "daily" };
  return status >= 500 || status === 429 ? { kind: "down" } : { kind: "network" };
}

function errorText(error: MentorError, t: Dict) {
  switch (error.kind) {
    case "notConfigured":
      return t.mentorErrNotConfigured;
    case "rate":
      return fill(t.mentorErrRate, { n: error.wait });
    case "daily":
      return t.mentorErrDaily;
    case "down":
      return t.mentorErrDown;
    case "refusal":
      return t.mentorErrRefusal;
    default:
      return t.mentorErrNetwork;
  }
}

// A chat with the AI mentor about one mission. Before the first answer it only guides;
// after it, it explains. Questions asked before answering count as a hint (onFirstUse).
export function MentorPanel({
  mission,
  answered,
  choice,
  onFirstUse,
}: {
  mission: Mission;
  answered: boolean;
  // The first answer's option index, -1 for "I don't know", null before answering.
  choice: number | null;
  onFirstUse: () => void;
}) {
  const { lang, seed, mentorChats } = useAppState();
  const t = ui[lang];
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<MentorError | null>(null);
  // The conversation while it differs from the saved one: during a reply, or after a failure.
  const [live, setLive] = useState<MentorMessage[] | null>(null);
  const abort = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const saved = mentorChats[mission.id] ?? [];
  const messages = live ?? saved;
  const lastText = messages[messages.length - 1]?.text;

  useEffect(() => {
    let current = true;
    mentorAvailable().then((value) => {
      if (current) setEnabled(value);
    });
    return () => {
      current = false;
    };
  }, []);

  // Leaving the mission stops a reply that is still coming.
  useEffect(() => () => abort.current?.abort(), []);

  // Keep the newest words in view while the reply grows.
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages.length, lastText, open]);

  async function send(text: string, base: MentorMessage[] = messages) {
    const question = text.trim().slice(0, QUESTION_MAX);
    if (!question || busy) return;
    if (!answered) onFirstUse();
    const history: MentorMessage[] = [...base, { role: "user", text: question }];
    setLive([...history, { role: "assistant", text: "" }]);
    setDraft("");
    setError(null);
    setBusy(true);

    const controller = new AbortController();
    abort.current = controller;
    let reply = "";
    let failed = false;
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: mission.id,
          lang,
          client: String(seed),
          answered,
          choice,
          messages: history,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw errorFrom(res.status, await res.json().catch(() => ({})));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        if (reply.includes(ERROR_MARK)) {
          reply = reply.replace(ERROR_MARK, "");
          throw { kind: "down" } satisfies MentorError;
        }
        if (reply.includes(REFUSAL_MARK)) {
          reply = reply.replace(REFUSAL_MARK, "");
          failed = true;
          setError({ kind: "refusal" });
        }
        setLive([...history, { role: "assistant", text: reply }]);
      }
    } catch (problem) {
      if (!controller.signal.aborted) {
        failed = true;
        setError(
          typeof problem === "object" && problem !== null && "kind" in problem
            ? (problem as MentorError)
            : { kind: "network" },
        );
      }
    } finally {
      abort.current = null;
      setBusy(false);
      const answer = reply.trim();
      if (answer) {
        // A reply cut short by Stop or by an error is kept, marked as unfinished.
        const cut = (controller.signal.aborted || failed) && !answer.endsWith("…");
        saveMentorChat(mission.id, [
          ...history,
          { role: "assistant", text: cut ? `${answer}…` : answer },
        ]);
        setLive(null);
      } else {
        setLive(history);
      }
    }
  }

  // Asks the last question again, replacing a reply that failed or broke off.
  function retry() {
    let index = messages.length - 1;
    while (index >= 0 && messages[index].role !== "user") index--;
    if (index >= 0) send(messages[index].text, messages.slice(0, index));
  }

  function clear() {
    abort.current?.abort();
    saveMentorChat(mission.id, []);
    setLive(null);
    setError(null);
  }

  function prefill(text: string) {
    setDraft(text);
    requestAnimationFrame(() => {
      const box = input.current;
      if (!box) return;
      box.focus();
      box.setSelectionRange(text.length, text.length);
    });
  }

  if (enabled === null) return null;
  if (!enabled) {
    // In development only: a reminder of how to switch the mentor on.
    return process.env.NODE_ENV === "production" ? null : (
      <p className="mt-8 text-xs text-mute">
        AI mentor is off: put ANTHROPIC_API_KEY (or MENTOR_MOCK=1) in .env.local and restart.
      </p>
    );
  }

  const quick: { label: string; run: () => void }[] = answered
    ? [
        ...(choice !== null && choice !== mission.answer
          ? [{ label: t.mentorAskWhy, run: () => send(t.mentorAskWhy) }]
          : []),
        { label: t.mentorAskDeeper, run: () => send(t.mentorAskDeeper) },
        { label: t.mentorAskBoard, run: () => send(t.mentorAskBoard) },
        { label: t.mentorAskSimilar, run: () => send(t.mentorAskSimilar) },
      ]
    : [
        { label: t.mentorAskStart, run: () => send(t.mentorAskStart) },
        { label: t.mentorAskSimpler, run: () => send(t.mentorAskSimpler) },
        ...(mission.code ? [{ label: t.mentorAskCode, run: () => send(t.mentorAskCode) }] : []),
        { label: t.mentorAskGuessLabel, run: () => prefill(t.mentorAskGuess) },
      ];

  return (
    <section data-mentor className="pop mt-8 overflow-hidden" aria-label={t.mentorTitle}>
      <div className="flex items-start gap-3 p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-edge bg-accent text-accent-ink">
          <Icon name="robot" size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold">{t.mentorTitle}</h2>
          <p className="text-sm text-mute">{answered ? t.mentorIntroAfter : t.mentorIntroBefore}</p>
        </div>
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 text-sm font-medium text-mute hover:text-ink"
          >
            {t.mentorClose}
          </button>
        )}
      </div>

      {!open ? (
        <div className="px-5 pb-5">
          <button onClick={() => setOpen(true)} className="btn btn-primary">
            {t.mentorOpen}
            {saved.length > 0 && <span className="font-mono text-xs">({saved.length})</span>}
          </button>
          {!answered && <p className="mt-2 text-xs text-mute">{t.mentorHintNote}</p>}
        </div>
      ) : (
        <div className="border-t border-line">
          {messages.length > 0 && (
            <div
              ref={log}
              role="log"
              aria-live="polite"
              className="max-h-[28rem] space-y-3 overflow-y-auto px-5 py-4"
            >
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 break-words whitespace-pre-wrap">
                      <span className="sr-only">{t.mentorYou}: </span>
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="max-w-[92%] rounded-xl bg-sunken px-3 py-2 leading-relaxed break-words">
                    <span className="sr-only">{t.mentorTitle}: </span>
                    {m.text ? (
                      <Rich text={m.text} />
                    ) : (
                      <span className="text-mute motion-safe:animate-pulse">{t.mentorThinking}</span>
                    )}
                  </div>
                ),
              )}
            </div>
          )}

          {error && (
            <div className="mx-5 mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-bad/40 bg-bad/10 px-3 py-2 text-sm">
              <span className="flex-1">{errorText(error, t)}</span>
              {error.kind !== "notConfigured" && error.kind !== "daily" && error.kind !== "refusal" && (
                <button onClick={retry} className="font-medium underline underline-offset-2">
                  {t.mentorRetry}
                </button>
              )}
            </div>
          )}

          {!busy && (
            <div className="flex flex-wrap gap-2 px-5 pt-4">
              {quick.map((q) => (
                <button
                  key={q.label}
                  onClick={q.run}
                  className="rounded-full border-[1.5px] border-line bg-panel px-3 py-1 text-sm hover:border-edge"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex items-end gap-2 px-5 pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <textarea
              ref={input}
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, QUESTION_MAX))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              rows={2}
              maxLength={QUESTION_MAX}
              placeholder={t.mentorPlaceholder}
              aria-label={t.mentorPlaceholder}
              className="min-w-0 flex-1 resize-y rounded-lg border-[1.5px] border-edge bg-panel px-3 py-2 placeholder:text-mute/70"
            />
            {busy ? (
              <button type="button" onClick={() => abort.current?.abort()} className="btn">
                {t.mentorStop}
              </button>
            ) : (
              <button type="submit" disabled={!draft.trim()} className="btn btn-primary">
                {t.mentorSend}
              </button>
            )}
          </form>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 pt-2 pb-4 text-xs text-mute">
            <span>
              {t.mentorPrivacy}
              {draft.length > QUESTION_MAX - 100 && ` · ${draft.length}/${QUESTION_MAX}`}
            </span>
            {messages.length > 0 && !busy && (
              <button onClick={clear} className="font-medium underline underline-offset-2 hover:text-ink">
                {t.mentorClear}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// Inline `code` and **bold**: the only formatting the mentor is asked to use.
function inline(text: string) {
  return text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g).map((part, i) => {
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-panel px-1 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Paragraphs and "- " bullet lists, built as React elements: the reply is never inserted
// as HTML.
function Rich({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/^#+\s*/, "");
    if (!line.trim()) {
      blocks.push({ list: false, lines: [] });
      continue;
    }
    const item = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (last && last.list === Boolean(item) && last.lines.length > 0) {
      last.lines.push(item ? item[1] : line);
    } else {
      blocks.push({ list: Boolean(item), lines: [item ? item[1] : line] });
    }
  }
  return (
    <div className="space-y-2">
      {blocks
        .filter((b) => b.lines.length > 0)
        .map((b, i) =>
          b.list ? (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {b.lines.map((l, j) => (
                <li key={j}>{inline(l)}</li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              {b.lines.map((l, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  {inline(l)}
                </Fragment>
              ))}
            </p>
          ),
        )}
    </div>
  );
}
