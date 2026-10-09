import type { Lang } from "@/lib/missions";
import type { Attempt } from "@/lib/store";
import { ui, type Dict } from "@/lib/ui";

// How an answered mission is labelled and coloured everywhere on the site.
export function verdict(attempt: Attempt, t: Dict) {
  if (attempt.correct) return { label: t.found, color: "text-good" };
  if (attempt.choice === -1) return { label: t.unknown, color: "text-mute" };
  return { label: t.missed, color: "text-bad" };
}

// The right-hand mark on a mission ticket: an arrow while open, a stamp once answered.
export function Status({ attempt, lang }: { attempt: Attempt | undefined; lang: Lang }) {
  const t = ui[lang];
  if (!attempt) {
    return (
      <span className="shrink-0 font-mono text-lg text-accent-text" aria-label={t.open}>
        →
      </span>
    );
  }
  const v = verdict(attempt, t);
  return <span className={`stamp shrink-0 ${v.color}`}>{v.label}</span>;
}
