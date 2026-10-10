"use client";

import { useState } from "react";
import { useCatalog } from "@/components/Catalog";
import { aggregate, parseResults } from "@/lib/stats";
import { useAppState } from "@/lib/store";
import { fill, ui } from "@/lib/ui";

const percent = (part: number, whole: number) => (whole ? `${(part / whole) * 100}%` : "0%");

// For whoever runs a test: paste the result texts testers sent and see the class as a whole.
// Everything is computed in the browser; nothing is uploaded.
export default function Teacher() {
  const { lang } = useAppState();
  const t = ui[lang];
  const [text, setText] = useState("");
  const { missions } = useCatalog();
  const results = parseResults(missions, text);
  const summary = aggregate(missions, results);

  return (
    <main>
      <p className="eyebrow">{t.navResults}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{t.teacherTitle}</h1>
      <p className="mt-4 max-w-xl text-lg text-mute">{t.teacherIntro}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        spellCheck={false}
        aria-label={t.teacherTitle}
        placeholder={"Sheber result\nname: …\nopen-loop,1,1,24\n…"}
        className="mt-6 w-full rounded-xl border-[1.5px] border-edge bg-panel p-4 font-mono text-xs leading-relaxed placeholder:text-mute/70"
      />

      {summary.people === 0 ? (
        <p className="mt-4 text-mute">{t.teacherEmpty}</p>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="pop p-5">
              <p className="font-display text-4xl font-extrabold">{summary.people}</p>
              <p className="mt-1 text-mute">{fill(t.testers, { n: summary.people })}</p>
            </div>
            <div className="pop p-5">
              <p className="font-display text-4xl font-extrabold">
                {summary.avgFound}
                <span className="text-xl text-mute">/{summary.perMission.length}</span>
              </p>
              <p className="mt-1 text-mute">{t.avgFound}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <Legend color="bg-good" label={t.found} />
            <Legend color="bg-mute" label={t.unknown} />
            <Legend color="bg-bad" label={t.missed} />
          </div>

          <ul className="pop mt-3 divide-y divide-line overflow-hidden">
            {summary.perMission.map(
              ({ mission, answered, found, unknown, missed, avgSeconds }, i) => (
                <li
                  key={mission.id}
                  className="grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-sm sm:grid-cols-[2rem_1fr_10rem_3.5rem_4rem]"
                >
                  <span className="font-mono text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span>{mission.title[lang]}</span>
                  <span
                    className="col-start-2 flex h-3 overflow-hidden rounded-sm bg-sunken sm:col-start-auto"
                    aria-hidden="true"
                  >
                    <span className="bg-good" style={{ width: percent(found, answered) }} />
                    <span className="bg-mute" style={{ width: percent(unknown, answered) }} />
                    <span className="bg-bad" style={{ width: percent(missed, answered) }} />
                  </span>
                  <span className="col-start-2 font-mono text-mute sm:col-start-auto sm:text-right">
                    {found}/{answered}
                  </span>
                  <span className="hidden font-mono text-mute sm:block sm:text-right">
                    {answered ? fill(t.seconds, { n: avgSeconds }) : "—"}
                  </span>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </main>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`size-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
