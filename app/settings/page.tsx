"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Avatar } from "@/components/Icon";
import { LANGS } from "@/lib/missions";
import {
  exportState,
  importState,
  resetAll,
  setState,
  useAppState,
  type TextSize,
  type Theme,
} from "@/lib/store";
import { langName, ui } from "@/lib/ui";

const THEMES: Theme[] = ["system", "light", "dark"];
const SIZES: TextSize[] = ["normal", "large"];

export default function Settings() {
  const state = useAppState();
  const { lang, theme, textSize, reduceMotion, nickname, primerOpen, attempts } = state;
  const t = ui[lang];
  const themeLabel = { system: t.themeSystem, light: t.themeLight, dark: t.themeDark };
  const sizeLabel = { normal: t.sizeNormal, large: t.sizeLarge };
  const fileInput = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<"ok" | "bad" | null>(null);

  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(exportState(), null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "sheber-results.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      setImportResult(importState(JSON.parse(await file.text())) ? "ok" : "bad");
    } catch {
      setImportResult("bad");
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <main className="mx-auto max-w-2xl">
      <p className="eyebrow">{t.navSettings}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{t.settingsTitle}</h1>

      <Link
        href="/profile"
        className="ticket mt-8 items-center gap-4 px-4 py-3"
        aria-label={t.navProfile}
      >
        <Avatar color={state.avatarColor} icon={state.avatarIcon} size={48} />
        <span className="flex-1">
          <span className="block font-semibold">{nickname.trim() || t.guest}</span>
          <span className="block text-sm text-mute">{t.navProfile}</span>
        </span>
        <span className="font-mono text-lg text-accent-text">→</span>
      </Link>

      <Group title={t.appearance}>
        <Row label={t.language}>
          <Segmented
            options={LANGS.map((l) => ({ value: l, label: langName[l].full }))}
            value={lang}
            onChange={(l) => setState({ lang: l })}
          />
        </Row>
        <Row label={t.theme}>
          <Segmented
            options={THEMES.map((th) => ({ value: th, label: themeLabel[th] }))}
            value={theme}
            onChange={(th) => setState({ theme: th })}
          />
        </Row>
        <Row label={t.textSize}>
          <Segmented
            options={SIZES.map((s) => ({ value: s, label: sizeLabel[s] }))}
            value={textSize}
            onChange={(s) => setState({ textSize: s })}
          />
        </Row>
        <Toggle
          label={t.reduceMotion}
          hint={t.reduceMotionHint}
          checked={reduceMotion}
          onChange={(v) => setState({ reduceMotion: v })}
        />
      </Group>

      <Group title={t.navMissions}>
        <Toggle
          label={t.primerOpen}
          hint={t.primerOpenHint}
          checked={primerOpen}
          onChange={(v) => setState({ primerOpen: v })}
        />
        <Row label={t.keyboard}>
          <p className="text-sm text-mute">{t.keyboardHint}</p>
        </Row>
      </Group>

      <Group title={t.data}>
        <p className="text-sm text-mute">{t.importHint}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={download} className="btn">
            {t.exportJson}
          </button>
          <button onClick={() => fileInput.current?.click()} className="btn">
            {t.importJson}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </div>
        {importResult && (
          <p className={`text-sm font-medium ${importResult === "ok" ? "text-good" : "text-bad"}`}>
            {importResult === "ok" ? t.importOk : t.importBad}
          </p>
        )}
        <div className="flex flex-wrap gap-3 border-t border-line pt-4">
          <button
            onClick={() => window.confirm(t.resetConfirm) && setState({ attempts: {}, redeemed: [] })}
            disabled={Object.keys(attempts).length === 0}
            className="btn text-bad"
          >
            {t.reset}
          </button>
          <button
            onClick={() => window.confirm(t.resetAllConfirm) && resetAll()}
            className="btn text-bad"
          >
            {t.resetAll}
          </button>
        </div>
        <p className="text-sm">
          <Link href="/teacher" className="text-accent-text underline underline-offset-2">
            {t.teacherLink} →
          </Link>
        </p>
      </Group>

      <Group title={t.about}>
        <p className="text-mute">{t.aboutNote}</p>
        <p className="text-sm">
          <Link href="/about" className="text-accent-text underline underline-offset-2">
            {t.aboutLink} →
          </Link>
        </p>
      </Group>
    </main>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="card mt-4 space-y-4 p-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-center">
      <span className="font-medium">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-(--accent)"
      />
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-sm text-mute">{hint}</span>
      </span>
    </label>
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
