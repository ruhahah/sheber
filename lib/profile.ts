import type { IconName } from "@/components/Icon";
import { lessons } from "./lessons";
import { missions, type Text } from "./missions";
import type { AppState } from "./store";
import { ui } from "./ui";

// Titles earned by the number of faults found.
export const RANKS: { at: number; title: Text }[] = [
  { at: 0, title: { en: "Newcomer", kk: "Жаңадан бастаушы", ru: "Новичок" } },
  { at: 8, title: { en: "Apprentice", kk: "Шәкірт", ru: "Подмастерье" } },
  { at: 22, title: { en: "Technician", kk: "Техник", ru: "Техник" } },
  { at: 45, title: { en: "Engineer", kk: "Инженер", ru: "Инженер" } },
  { at: 70, title: { en: "Sheber", kk: "Шебер", ru: "Мастер" } },
];

export function rankFor(found: number) {
  let index = 0;
  RANKS.forEach((r, i) => {
    if (found >= r.at) index = i;
  });
  const next = RANKS[index + 1];
  const from = RANKS[index].at;
  return {
    current: RANKS[index].title,
    next: next ? { title: next.title, need: next.at - found } : null,
    // How far along the way from this rank to the next, 0 to 1.
    progress: next ? (found - from) / (next.at - from) : 1,
  };
}

const dayOf = (iso: string) => new Date(iso).toDateString();

// Days in a row with any activity, counted back from today (or from yesterday, so the
// streak is not shown as lost before the day is over).
export function streakDays(state: AppState) {
  if (!state.ready) return 0;
  const active = new Set(
    [...Object.values(state.attempts).map((a) => a.at), ...Object.values(state.lessonsRead)].map(
      dayOf,
    ),
  );
  const day = new Date(state.loadedAt);
  if (!active.has(day.toDateString())) day.setDate(day.getDate() - 1);
  let streak = 0;
  while (active.has(day.toDateString())) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

export function profileStats(state: AppState) {
  const answered = missions.filter((m) => state.attempts[m.id]);
  const found = answered.filter((m) => state.attempts[m.id].correct).length;
  const totalMs = answered.reduce((sum, m) => sum + state.attempts[m.id].ms, 0);
  return {
    answered: answered.length,
    found,
    accuracy: answered.length ? Math.round((found / answered.length) * 100) : 0,
    minutes: Math.round(totalMs / 60000),
    lessonsRead: lessons.filter((l) => state.lessonsRead[l.slug]).length,
    byLevel: [1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
      const inLevel = missions.filter((m) => m.level === level);
      return {
        level,
        missions: inLevel,
        found: inLevel.filter((m) => state.attempts[m.id]?.correct).length,
      };
    }),
    // Newest first.
    recent: answered
      .map((m) => ({ mission: m, attempt: state.attempts[m.id] }))
      .sort((a, b) => b.attempt.at.localeCompare(a.attempt.at))
      .slice(0, 8),
  };
}

export type Achievement = {
  id: string;
  icon: IconName;
  title: Text;
  hint: Text;
  earned: boolean;
};

const levelHint: Text = {
  en: "Find every fault in this level",
  kk: "Осы деңгейдегі барлық ақауды тап",
  ru: "Найди все поломки этого уровня",
};

// "Level 1 · Basics" -> "Basics", in every language.
const levelName = (level: number): Text => {
  const key = `level${level}` as "level1";
  const name = (lang: "en" | "kk" | "ru") => ui[lang][key].split(" · ")[1];
  return { en: name("en"), kk: name("kk"), ru: name("ru") };
};

export function achievements(state: AppState): Achievement[] {
  const attempts = Object.values(state.attempts).sort((a, b) => a.at.localeCompare(b.at));
  const stats = profileStats(state);

  let run = 0;
  let bestRun = 0;
  for (const a of attempts) {
    run = a.correct ? run + 1 : 0;
    bestRun = Math.max(bestRun, run);
  }

  const levels: Achievement[] = stats.byLevel.map(({ level, missions: inLevel, found }) => {
    const name = levelName(level);
    return {
      id: `level-${level}`,
      icon: "flag",
      title: {
        en: `Cleared: ${name.en}`,
        kk: `Өтілді: ${name.kk}`,
        ru: `Пройдено: ${name.ru}`,
      },
      hint: levelHint,
      earned: found === inLevel.length,
    };
  });

  return [
    {
      id: "first",
      icon: "bolt",
      title: { en: "First fault", kk: "Алғашқы ақау", ru: "Первая поломка" },
      hint: {
        en: "Find your first fault",
        kk: "Алғашқы ақауыңды тап",
        ru: "Найди первую поломку",
      },
      earned: stats.found >= 1,
    },
    {
      id: "run",
      icon: "eye",
      title: { en: "Sharp eye", kk: "Қырағы көз", ru: "Острый глаз" },
      hint: {
        en: "Find 5 faults in a row",
        kk: "Қатарынан 5 ақау тап",
        ru: "Найди 5 поломок подряд",
      },
      earned: bestRun >= 5,
    },
    {
      id: "fast",
      icon: "clock",
      title: { en: "Quick diagnosis", kk: "Жылдам диагноз", ru: "Быстрый диагноз" },
      hint: {
        en: "Find a fault in under 30 seconds",
        kk: "Ақауды 30 секундтан аз уақытта тап",
        ru: "Найди поломку быстрее чем за 30 секунд",
      },
      earned: attempts.some((a) => a.correct && a.ms < 30000),
    },
    {
      id: "honest",
      icon: "question",
      title: { en: "Honest engineer", kk: "Адал инженер", ru: "Честный инженер" },
      hint: {
        en: "Admit once that you don't know",
        kk: "Білмейтініңді бір рет мойында",
        ru: "Один раз признайся, что не знаешь",
      },
      earned: attempts.some((a) => a.choice === -1),
    },
    {
      id: "comeback",
      icon: "repeat",
      title: { en: "Second try", kk: "Екінші талпыныс", ru: "Вторая попытка" },
      hint: {
        en: "Practise a missed mission again and get it right",
        kk: "Табылмаған миссияны қайта жаттығып, дұрыс шеш",
        ru: "Вернись к ненайденной поломке и реши её на тренировке",
      },
      earned: state.redeemed.length > 0,
    },
    {
      id: "reader",
      icon: "book",
      title: { en: "Reader", kk: "Оқырман", ru: "Читатель" },
      hint: { en: "Read 5 lessons", kk: "5 сабақ оқы", ru: "Прочитай 5 уроков" },
      earned: stats.lessonsRead >= 5,
    },
    {
      id: "scholar",
      icon: "book",
      title: { en: "Whole textbook", kk: "Бүкіл оқулық", ru: "Весь учебник" },
      hint: { en: "Read every lesson", kk: "Барлық сабақты оқы", ru: "Прочитай все уроки" },
      earned: stats.lessonsRead === lessons.length,
    },
    {
      id: "half",
      icon: "wrench",
      title: { en: "Halfway", kk: "Жарты жол", ru: "Полпути" },
      hint: {
        en: "Answer half of the missions",
        kk: "Миссиялардың жартысына жауап бер",
        ru: "Ответь на половину миссий",
      },
      earned: stats.answered >= Math.ceil(missions.length / 2),
    },
    {
      id: "all",
      icon: "star",
      title: { en: "Nothing left to fix", kk: "Жөндейтін ештеңе қалмады", ru: "Чинить больше нечего" },
      hint: {
        en: "Answer every mission",
        kk: "Барлық миссияға жауап бер",
        ru: "Ответь на все миссии",
      },
      earned: stats.answered === missions.length,
    },
    ...levels,
  ];
}
