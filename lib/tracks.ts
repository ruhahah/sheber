import type { Attempt } from "./store";
import type { Catalog, LessonInfo, MissionInfo } from "./types";

// The quick route: ten missions from the first three levels that a newcomer (or a juror)
// can finish in about twenty minutes. They are ordinary missions, played in this order.
export const QUICK_ROUTE = [
  "open-loop",
  "led-backwards-battery",
  "no-resistor-9v",
  "wrong-pin",
  "missing-semicolon",
  "setup-once",
  "led-backwards",
  "missing-pinmode",
  "floating-button",
  "pullup-inverted",
];

export function quickRoute(missions: MissionInfo[]) {
  return QUICK_ROUTE.flatMap((id) => {
    const mission = missions.find((m) => m.id === id);
    return mission ? [mission] : [];
  });
}

// The next unanswered mission of a route: the first one after `afterId`, or failing that
// the first one anywhere in the route. `afterId` itself is never returned.
export function nextInRoute(
  route: MissionInfo[],
  attempts: Record<string, Attempt>,
  afterId?: string,
) {
  const open = route.filter((m) => m.id !== afterId && !attempts[m.id]);
  const from = route.findIndex((m) => m.id === afterId);
  return open.find((m) => route.indexOf(m) > from) ?? open[0];
}

const DAY = 24 * 60 * 60 * 1000;

// One mission per calendar day, the same all day long. It is drawn from the levels the
// visitor has reached plus the next one, so a beginner is not handed interrupts on day one.
export function dailyMission(
  missions: MissionInfo[],
  attempts: Record<string, Attempt>,
  now: number,
) {
  const reached = Math.max(1, ...missions.filter((m) => attempts[m.id]).map((m) => m.level));
  const pool = missions.filter((m) => m.level <= reached + 1);
  return pool.length ? pool[(Math.floor(now / DAY) * 37) % pool.length] : undefined;
}

// The topic where the visitor has missed the largest share of faults, among topics with at
// least two answers. Nothing is returned while every answered fault has been found.
export function weakestLesson({ missions, lessons }: Catalog, attempts: Record<string, Attempt>) {
  let worst: { lesson: LessonInfo; found: number; answered: number } | null = null;
  for (const lesson of lessons) {
    const answered = missions.filter((m) => m.lesson === lesson.slug && attempts[m.id]);
    const found = answered.filter((m) => attempts[m.id].correct).length;
    if (answered.length < 2 || found === answered.length) continue;
    const better =
      !worst ||
      found / answered.length < worst.found / worst.answered ||
      (found / answered.length === worst.found / worst.answered && answered.length > worst.answered);
    if (better) worst = { lesson, found, answered: answered.length };
  }
  return worst;
}
