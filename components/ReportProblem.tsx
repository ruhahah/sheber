"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { REPORT_TEXT_MAX, removeReport, saveReport, useAppState } from "@/lib/store";
import { REPORT_KINDS, type ReportKind } from "@/lib/types";
import { reportKindLabel, ui } from "@/lib/ui";

// Lets a tester say that a mission is wrong or unclear. There is no server to send it to:
// the report is kept with the answers and travels in the result text the tester shares,
// where the class summary collects it (see lib/stats.ts).
export function ReportProblem({ missionId }: { missionId: string }) {
  const { lang, reports } = useAppState();
  const t = ui[lang];
  const saved = reports[missionId];
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ReportKind | null>(null);
  const [text, setText] = useState("");

  function start() {
    setKind(saved?.kind ?? null);
    setText(saved?.text ?? "");
    setOpen(true);
  }

  function save() {
    if (!kind) return;
    saveReport(missionId, { kind, text: text.trim(), lang, at: new Date().toISOString() });
    setOpen(false);
  }

  if (!open) {
    return (
      <div className="mt-10 border-t border-line pt-4 text-sm" data-report>
        {saved ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2 text-mute">
              <Icon name="flag" size={16} />
              {t.reportSaved}
            </span>
            <button onClick={start} className="font-medium underline underline-offset-2">
              {t.edit}
            </button>
            <button
              onClick={() => removeReport(missionId)}
              className="font-medium text-mute underline underline-offset-2 hover:text-ink"
            >
              {t.reportDelete}
            </button>
          </div>
        ) : (
          <button
            onClick={start}
            className="flex items-center gap-2 font-medium text-mute hover:text-ink"
          >
            <Icon name="flag" size={16} />
            {t.reportOpen}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card mt-10 p-5" data-report>
      <p className="eyebrow">{t.reportQuestion}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {REPORT_KINDS.map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-full border-[1.5px] px-3 py-1.5 text-sm ${
              kind === k
                ? "border-accent bg-accent/15 font-medium"
                : "border-line bg-panel hover:border-edge"
            }`}
          >
            {reportKindLabel[k][lang]}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={REPORT_TEXT_MAX}
        aria-label={t.reportPlaceholder}
        placeholder={t.reportPlaceholder}
        className="mt-3 w-full rounded-lg border-[1.5px] border-edge bg-panel px-3 py-2 text-sm placeholder:text-mute/70"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <button onClick={save} disabled={!kind} className="btn btn-primary">
          {t.reportSave}
        </button>
        <button onClick={() => setOpen(false)} className="btn">
          {t.reportCancel}
        </button>
      </div>
    </div>
  );
}
