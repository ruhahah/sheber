"use client";

import Link from "next/link";
import { LANGS } from "@/lib/missions";
import { setState, useAppState, type Theme } from "@/lib/store";
import { langName, ui } from "@/lib/ui";

const THEMES: Theme[] = ["system", "light", "dark"];

export default function Settings() {
  const state = useAppState();
  const { lang, theme, nickname, primerOpen, attempts } = state;
  const t = ui[lang];
  const themeLabel = { system: t.themeSystem, light: t.themeLight, dark: t.themeDark };

  function exportJson() {
    const data = { app: "sheber", exportedAt: new Date().toISOString(), nickname, attempts };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "sheber-results.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    if (window.confirm(t.resetConfirm)) setState({ attempts: {} });
  }

  return (
    <main className="mx-auto max-w-2xl">
      <p className="eyebrow">{t.navSettings}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{t.settingsTitle}</h1>

      <Group title={t.language}>
        <Segmented
          options={LANGS.map((l) => ({ value: l, label: langName[l].full }))}
          value={lang}
          onChange={(l) => setState({ lang: l })}
        />
      </Group>

      <Group title={t.theme}>
        <Segmented
          options={THEMES.map((th) => ({ value: th, label: themeLabel[th] }))}
          value={theme}
          onChange={(th) => setState({ theme: th })}
        />
      </Group>

      <Group title={t.nickname} hint={t.nicknameHint}>
        <input
          value={nickname}
          onChange={(e) => setState({ nickname: e.target.value })}
          placeholder={t.nicknamePlaceholder}
          maxLength={30}
          aria-label={t.nickname}
          className="w-full max-w-xs rounded-lg border-[1.5px] border-edge bg-panel px-3 py-2 placeholder:text-mute/70"
        />
      </Group>

      <Group title={t.primer} hint={t.primerOpenHint}>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={primerOpen}
            onChange={(e) => setState({ primerOpen: e.target.checked })}
            className="size-4 accent-(--accent)"
          />
          <span>{t.primerOpen}</span>
        </label>
      </Group>

      <Group title={t.data} hint={t.resetHint}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportJson}
            disabled={Object.keys(attempts).length === 0}
            className="btn"
          >
            {t.exportJson}
          </button>
          <button onClick={reset} className="btn text-bad">
            {t.reset}
          </button>
        </div>
        <p className="mt-5 text-sm">
          <Link href="/teacher" className="text-accent-text underline underline-offset-2">
            {t.teacherLink} →
          </Link>
        </p>
      </Group>
    </main>
  );
}

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-line pt-6">
      <h2 className="font-medium">{title}</h2>
      {hint && <p className="mt-1 text-sm text-mute">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap overflow-hidden rounded-lg border-[1.5px] border-edge">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`px-4 py-2 text-sm ${
            value === o.value
              ? "bg-accent font-medium text-accent-ink"
              : "bg-panel text-mute hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
