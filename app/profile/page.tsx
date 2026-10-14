"use client";

import Link from "next/link";
import { useState } from "react";
import { useCatalog } from "@/components/Catalog";
import { AVATAR_COLORS, AVATAR_ICONS, Avatar, Icon } from "@/components/Icon";
import { verdict } from "@/components/Status";
import { achievements, levelTitle, profileStats, rankFor, streakDays } from "@/lib/profile";
import { setState, useAppState } from "@/lib/store";
import { fill, ui } from "@/lib/ui";

export default function Profile() {
  const state = useAppState();
  const { lang, nickname, group, avatarColor, avatarIcon } = state;
  const t = ui[lang];
  const [editing, setEditing] = useState(false);

  const catalog = useCatalog();
  const { missions, lessons } = catalog;
  const stats = profileStats(catalog, state);
  const rank = rankFor(stats.found);
  const badges = achievements(catalog, state);
  const earned = badges.filter((b) => b.earned).length;

  const tiles = [
    { label: t.statFound, value: `${stats.found}/${missions.length}` },
    { label: t.statAccuracy, value: `${stats.accuracy}%` },
    { label: t.statTime, value: fill(t.minutes, { n: stats.minutes }) },
    { label: t.statLessons, value: `${stats.lessonsRead}/${lessons.length}` },
    { label: t.statStreak, value: String(streakDays(state)) },
  ];

  return (
    <main>
      <p className="eyebrow">{t.navProfile}</p>

      <section className="pop mt-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <Avatar color={avatarColor} icon={avatarIcon} size={84} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-extrabold break-words">
              {nickname.trim() || t.guest}
            </h1>
            {group.trim() && <p className="mt-0.5 text-mute">{group}</p>}
            <p className="mt-2">
              <span className="stamp text-accent-text">{rank.current[lang]}</span>
            </p>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn">
            {editing ? t.done : t.edit}
          </button>
        </div>

        <div className="mt-5">
          <div className="h-2.5 overflow-hidden rounded-full border border-edge bg-sunken">
            <div className="h-full bg-accent" style={{ width: `${rank.progress * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-mute">
            {rank.next
              ? fill(t.nextRank, { n: rank.next.need, rank: rank.next.title[lang] })
              : t.topRank}
          </p>
        </div>

        {editing && (
          <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">{t.nickname}</span>
              <input
                value={nickname}
                onChange={(e) => setState({ nickname: e.target.value })}
                placeholder={t.nicknamePlaceholder}
                maxLength={30}
                className="mt-2 w-full rounded-lg border-[1.5px] border-edge bg-panel px-3 py-2 placeholder:text-mute/70"
              />
            </label>
            <label className="block">
              <span className="eyebrow">{t.group}</span>
              <input
                value={group}
                onChange={(e) => setState({ group: e.target.value })}
                placeholder={t.groupPlaceholder}
                maxLength={30}
                className="mt-2 w-full rounded-lg border-[1.5px] border-edge bg-panel px-3 py-2 placeholder:text-mute/70"
              />
            </label>
            <div className="sm:col-span-2">
              <span className="eyebrow">{t.avatar}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(AVATAR_COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    onClick={() => setState({ avatarColor: name })}
                    aria-label={name}
                    aria-pressed={avatarColor === name}
                    className={`size-9 rounded-full border-[1.5px] border-edge ${
                      avatarColor === name ? "ring-2 ring-accent ring-offset-2 ring-offset-panel" : ""
                    }`}
                    style={{ background: hex }}
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {AVATAR_ICONS.map((name) => (
                  <button
                    key={name}
                    onClick={() => setState({ avatarIcon: name })}
                    aria-label={name}
                    aria-pressed={avatarIcon === name}
                    className={`flex size-11 items-center justify-center rounded-lg border-[1.5px] ${
                      avatarIcon === name
                        ? "border-accent bg-accent/15"
                        : "border-line bg-panel hover:border-edge"
                    }`}
                  >
                    <Icon name={name} size={24} />
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-mute sm:col-span-2">{t.profileIntro}</p>
          </div>
        )}
      </section>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <li key={tile.label} className="card p-4">
            <p className="font-display text-2xl font-extrabold">{tile.value}</p>
            <p className="mt-1 text-sm text-mute">{tile.label}</p>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">{t.levelsTitle}</h2>
        <ul className="pop mt-5 divide-y divide-line">
          {stats.byLevel.map(({ level, missions: inLevel, found }) => (
            <li
              key={level}
              className="grid items-center gap-x-4 gap-y-1.5 px-5 py-3 sm:grid-cols-[21rem_1fr_3rem]"
            >
              <span className="font-medium">{levelTitle(level, lang)}</span>
              <span className="flex gap-1" aria-hidden="true">
                {inLevel.map((m) => {
                  const a = state.attempts[m.id];
                  return (
                    <span
                      key={m.id}
                      className={`h-3 flex-1 rounded-sm border border-edge ${
                        !a
                          ? "bg-sunken"
                          : a.correct
                            ? "bg-good"
                            : a.choice === -1
                              ? "bg-mute"
                              : "bg-bad"
                      }`}
                    />
                  );
                })}
              </span>
              <span className="font-mono text-sm text-mute sm:text-right">
                {found}/{inLevel.length}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">
          {t.achievementsTitle}{" "}
          <span className="font-mono text-base font-normal text-mute">
            {earned}/{badges.length}
          </span>
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className={`flex items-center gap-3 rounded-xl border-[1.5px] p-3 ${
                badge.earned ? "border-edge bg-panel" : "border-dashed border-line text-mute"
              }`}
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                  badge.earned ? "border-edge bg-accent text-accent-ink" : "border-line bg-sunken"
                }`}
              >
                <Icon name={badge.earned ? badge.icon : "question"} size={22} />
              </span>
              <span>
                <span className={`block ${badge.earned ? "font-semibold" : "font-medium"}`}>
                  {badge.title[lang]}
                </span>
                <span className="block text-sm text-mute">{badge.hint[lang]}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">{t.recentTitle}</h2>
        {stats.recent.length === 0 ? (
          <p className="mt-4 text-mute">{t.noActivity}</p>
        ) : (
          <ul className="pop mt-5 divide-y divide-line overflow-hidden">
            {stats.recent.map(({ mission, attempt }) => {
              const v = verdict(attempt, t);
              return (
                <li key={mission.id}>
                  <Link
                    href={`/missions/${mission.id}`}
                    className="flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-sunken"
                  >
                    <span className="w-20 shrink-0 font-mono text-mute">
                      {new Date(attempt.at).toLocaleDateString(lang, {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="flex-1">{mission.title[lang]}</span>
                    <span className={`shrink-0 font-semibold ${v.color}`}>{v.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/certificate" className="btn btn-primary">
          {t.certOpen} →
        </Link>
        <Link href="/results" className="btn">
          {t.navResults} →
        </Link>
        <Link href="/settings" className="btn">
          {t.navSettings} →
        </Link>
      </div>
    </main>
  );
}
