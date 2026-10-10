import { missions, type FaultType } from "./missions";
import type { Attempt } from "./store";

export function summarize(attempts: Record<string, Attempt>) {
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

// Plain text a tester can paste into a chat; one line per mission: id,correct,choice,seconds.
// choice is -1 when the tester picked "I don't know".
export function resultText(nickname: string, group: string, attempts: Record<string, Attempt>) {
  const s = summarize(attempts);
  const lines = missions
    .filter((m) => attempts[m.id])
    .map((m) => {
      const a = attempts[m.id];
      return `${m.id},${a.correct ? 1 : 0},${a.choice},${Math.round(a.ms / 1000)}`;
    });
  return [
    "Sheber result",
    `name: ${nickname.trim() || "-"}`,
    `group: ${group.trim() || "-"}`,
    `score: ${s.found}/${s.total} (answered ${s.answered})`,
    `avg_seconds: ${s.avgSeconds}`,
    ...lines,
  ].join("\n");
}

type Row = { correct: boolean; choice: number; seconds: number };
export type ParsedResult = { name: string; rows: Record<string, Row> };

// Reads any number of pasted resultText() blocks back, ignoring everything it doesn't know.
export function parseResults(text: string): ParsedResult[] {
  const known = new Set(missions.map((m) => m.id));
  const results: ParsedResult[] = [];
  let current: ParsedResult | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^sheber result$/i.test(line)) {
      current = { name: "-", rows: {} };
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
    const row = line.match(/^([a-z0-9-]+),([01]),(-?\d+),(\d+)$/);
    if (row && known.has(row[1])) {
      current.rows[row[1]] = {
        correct: row[2] === "1",
        choice: Number(row[3]),
        seconds: Number(row[4]),
      };
    }
  }
  // The same block pasted twice (a tester re-sent it, or it was copied twice) counts once.
  const seen = new Set<string>();
  return results.filter((r) => {
    if (Object.keys(r.rows).length === 0) return false;
    const key = JSON.stringify(r);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function aggregate(results: ParsedResult[]) {
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
  };
}
