import type { Attempt } from "./store";
import {
  LANGS,
  REPORT_KINDS,
  type FaultType,
  type Lang,
  type MissionInfo,
  type Report,
  type ReportKind,
} from "./types";

// Every function here takes the mission index as its first argument (see useCatalog), so
// this file never pulls the full mission catalog into the browser.

export function summarize(missions: MissionInfo[], attempts: Record<string, Attempt>) {
  const answered = missions.filter((m) => attempts[m.id]);
  const found = answered.filter((m) => attempts[m.id].correct).length;
  const unknown = answered.filter((m) => attempts[m.id].choice === -1).length;
  const totalMs = answered.reduce((sum, m) => sum + attempts[m.id].ms, 0);
  const types = [...new Set(missions.map((m) => m.faultType))] as FaultType[];

  return {
    answered: answered.length,
    found,
    unknown,
    missed: answered.length - found - unknown,
    total: missions.length,
    avgSeconds: answered.length ? Math.round(totalMs / answered.length / 1000) : 0,
    byType: types.map((type) => {
      const ofType = missions.filter((m) => m.faultType === type);
      return {
        type,
        total: ofType.length,
        found: ofType.filter((m) => attempts[m.id]?.correct).length,
      };
    }),
  };
}

// Plain text a tester can paste into a chat; one line per mission:
// id,correct,choice,seconds,hint. choice is -1 when the tester picked "I don't know"; hint is
// 1 when they asked for the hint before answering. Problems the tester reported follow
// as "report,id,kind,language,comment"; the comment comes last because it may hold commas.
export function resultText(
  missions: MissionInfo[],
  nickname: string,
  group: string,
  attempts: Record<string, Attempt>,
  reports: Record<string, Report> = {},
) {
  const s = summarize(missions, attempts);
  const lines = missions
    .filter((m) => attempts[m.id])
    .map((m) => {
      const a = attempts[m.id];
      const seconds = Math.round(a.ms / 1000);
      return `${m.id},${a.correct ? 1 : 0},${a.choice},${seconds},${a.hint ? 1 : 0}`;
    });
  const reportLines = missions
    .filter((m) => reports[m.id])
    .map((m) => {
      const r = reports[m.id];
      return `report,${m.id},${r.kind},${r.lang},${r.text.replace(/\s+/g, " ").trim()}`;
    });
  return [
    "Sheber result",
    `name: ${nickname.trim() || "-"}`,
    `group: ${group.trim() || "-"}`,
    `score: ${s.found}/${s.total} (answered ${s.answered})`,
    `avg_seconds: ${s.avgSeconds}`,
    ...lines,
    ...reportLines,
  ].join("\n");
}

type Row = { correct: boolean; choice: number; seconds: number; hint: boolean };
export type ParsedReport = { mission: string; kind: ReportKind; lang: Lang; text: string };
export type ParsedResult = { name: string; rows: Record<string, Row>; reports: ParsedReport[] };

// Reads any number of pasted resultText() blocks back, ignoring everything it doesn't know.
export function parseResults(missions: MissionInfo[], text: string): ParsedResult[] {
  const known = new Set(missions.map((m) => m.id));
  const results: ParsedResult[] = [];
  let current: ParsedResult | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^sheber result$/i.test(line)) {
      current = { name: "-", rows: {}, reports: [] };
      results.push(current);
      continue;
    }
    if (!current) continue;
    // name and group both identify the tester; keep them together so two different
    // "Aruzhan"s from different classes are not mistaken for a duplicate.
    const who = line.match(/^(name|group):\s*(.*)$/i);
    if (who) {
      current.name = who[1].toLowerCase() === "name" ? who[2] || "-" : `${current.name} · ${who[2]}`;
      continue;
    }
    // The fifth column (hint) is missing in results copied from older versions of the site.
    const row = line.match(/^([a-z0-9-]+),([01]),(-?\d+),(\d+)(?:,([01]))?$/);
    if (row && known.has(row[1])) {
      current.rows[row[1]] = {
        correct: row[2] === "1",
        choice: Number(row[3]),
        seconds: Number(row[4]),
        hint: row[5] === "1",
      };
      continue;
    }
    const report = line.match(/^report,([a-z0-9-]+),([a-z]+),([a-z]+),(.*)$/);
    if (
      report &&
      known.has(report[1]) &&
      (REPORT_KINDS as readonly string[]).includes(report[2]) &&
      (LANGS as readonly string[]).includes(report[3])
    ) {
      current.reports.push({
        mission: report[1],
        kind: report[2] as ReportKind,
        lang: report[3] as Lang,
        text: report[4].trim(),
      });
    }
  }
  // The same block pasted twice (a tester re-sent it, or it was copied twice) counts once.
  const seen = new Set<string>();
  return results.filter((r) => {
    if (Object.keys(r.rows).length === 0 && r.reports.length === 0) return false;
    const key = JSON.stringify(r);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function aggregate(missions: MissionInfo[], results: ParsedResult[]) {
  const perMission = missions.map((m) => {
    const rows = results.flatMap((r) => (r.rows[m.id] ? [r.rows[m.id]] : []));
    const found = rows.filter((r) => r.correct).length;
    const unknown = rows.filter((r) => r.choice === -1).length;
    return {
      mission: m,
      answered: rows.length,
      found,
      unknown,
      missed: rows.length - found - unknown,
      hinted: rows.filter((r) => r.hint).length,
      avgSeconds: rows.length
        ? Math.round(rows.reduce((sum, r) => sum + r.seconds, 0) / rows.length)
        : 0,
    };
  });
  const foundPerPerson = results.map((r) => Object.values(r.rows).filter((x) => x.correct).length);
  return {
    people: results.length,
    avgFound: results.length
      ? Math.round((foundPerPerson.reduce((a, b) => a + b, 0) / results.length) * 10) / 10
      : 0,
    perMission,
    // Every reported problem, in mission order, with who sent it.
    reports: missions.flatMap((m, index) =>
      results.flatMap((r) =>
        r.reports
          .filter((x) => x.mission === m.id)
          .map((x) => ({ ...x, name: r.name, title: m.title, number: index + 1 })),
      ),
    ),
  };
}

// Semicolons, not commas: that is what Excel expects with Russian and Kazakh settings, and
// Google Sheets recognises both.
function csv(rows: (string | number)[][]) {
  const cell = (value: string | number) => {
    const text = String(value);
    return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return rows.map((row) => row.map(cell).join(";")).join("\r\n");
}

// The class summary as a table, one row per mission.
export function missionsCsv(summary: ReturnType<typeof aggregate>, lang: Lang) {
  return csv([
    ["number", "id", "title", "answered", "found", "not_sure", "missed", "with_hint", "avg_seconds"],
    ...summary.perMission.map((p, i) => [
      i + 1,
      p.mission.id,
      p.mission.title[lang],
      p.answered,
      p.found,
      p.unknown,
      p.missed,
      p.hinted,
      p.avgSeconds,
    ]),
  ]);
}

// The class summary as a table, one row per tester.
export function peopleCsv(results: ParsedResult[]) {
  return csv([
    ["name", "answered", "found", "not_sure", "missed", "with_hint", "total_seconds", "reports"],
    ...results.map((r) => {
      const rows = Object.values(r.rows);
      const found = rows.filter((x) => x.correct).length;
      const unknown = rows.filter((x) => x.choice === -1).length;
      return [
        r.name,
        rows.length,
        found,
        unknown,
        rows.length - found - unknown,
        rows.filter((x) => x.hint).length,
        rows.reduce((sum, x) => sum + x.seconds, 0),
        r.reports.length,
      ];
    }),
  ]);
}
