"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Avatar, Icon } from "@/components/Icon";
import { LANGS } from "@/lib/types";
import { setState, useAppState } from "@/lib/store";
import { langName, ui, type Dict } from "@/lib/ui";

const NAV: { href: string; label: keyof Dict; active: (path: string) => boolean }[] = [
  {
    href: "/",
    label: "navMissions",
    active: (p) => p === "/" || p.startsWith("/missions") || p.startsWith("/demo"),
  },
  { href: "/learn", label: "navLearn", active: (p) => p.startsWith("/learn") },
  {
    href: "/results",
    label: "navResults",
    active: (p) => p.startsWith("/results") || p.startsWith("/teacher"),
  },
  { href: "/profile", label: "navProfile", active: (p) => p.startsWith("/profile") },
];

// Pages outside the main navigation, for the browser tab title.
const OTHER: { prefix: string; label: keyof Dict }[] = [
  { prefix: "/teacher", label: "teacherTitle" },
  { prefix: "/settings", label: "navSettings" },
  { prefix: "/about", label: "about" },
];

function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  setState({ theme: dark ? "light" : "dark" });
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { lang, theme, textSize, reduceMotion, avatarColor, avatarIcon } = useAppState();
  const pathname = usePathname();
  const t = ui[lang];

  // Mirror the settings onto <html>; the stylesheet reads them from there.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
    root.dataset.size = textSize;
    root.dataset.motion = reduceMotion ? "reduced" : "full";
    root.lang = lang;
    // The inline script in the layout hides the page until the saved language is applied.
    root.classList.remove("pending");
  }, [theme, lang, textSize, reduceMotion]);

  // Mission and lesson pages name the tab themselves.
  useEffect(() => {
    if (/^\/(missions|learn|demo)\/./.test(pathname)) return;
    const label =
      OTHER.find((o) => pathname.startsWith(o.prefix))?.label ??
      NAV.find((item) => item.href !== "/" && item.active(pathname))?.label;
    document.title = label ? `${t[label]} · Sheber` : "Sheber";
  }, [pathname, t]);

  const settingsActive = pathname.startsWith("/settings");

  return (
    <>
      <header className="top-0 z-10 border-b-[1.5px] border-edge bg-bg/90 backdrop-blur sm:sticky">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            {/* A wire with a break in it: the fault to find. */}
            <svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true">
              <path
                d="M1 10H9M19 10H27"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M12 4l4 6-4 0 4 6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sheber
          </Link>

          <nav className="order-last flex w-full justify-between gap-1 text-[13px] sm:order-none sm:w-auto sm:justify-start sm:text-sm">
            {NAV.map((item) => {
              const active = item.active(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-md border-[1.5px] px-1.5 py-1 font-medium sm:px-3 ${
                    active
                      ? "border-edge bg-panel text-ink"
                      : "border-transparent text-mute hover:text-ink"
                  }`}
                >
                  {item.href === "/profile" && (
                    <Avatar color={avatarColor} icon={avatarIcon} size={20} />
                  )}
                  {t[item.label]}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border-[1.5px] border-edge text-xs">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setState({ lang: l })}
                  aria-pressed={lang === l}
                  title={langName[l].full}
                  className={`px-2 py-1.5 sm:px-2.5 ${
                    lang === l
                      ? "bg-accent font-bold text-accent-ink"
                      : "bg-panel text-mute hover:text-ink"
                  }`}
                >
                  {langName[l].short}
                </button>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              aria-label={t.toggleTheme}
              title={t.toggleTheme}
              className="rounded-md border-[1.5px] border-edge bg-panel p-1.5 hover:text-accent-text"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 3a7 7 0 0 1 0 14z" fill="currentColor" />
              </svg>
            </button>
            <Link
              href="/settings"
              aria-label={t.navSettings}
              title={t.navSettings}
              aria-current={settingsActive ? "page" : undefined}
              className={`rounded-md border-[1.5px] border-edge p-1.5 hover:text-accent-text ${
                settingsActive ? "bg-accent text-accent-ink" : "bg-panel"
              }`}
            >
              <Icon name="gear" size={18} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-20 sm:pt-10">{children}</div>

      <footer className="border-t-[1.5px] border-edge bg-panel/60">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-6 text-sm">
          <p className="max-w-md text-mute">{t.aboutNote}</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 font-medium">
            <Link href="/about" className="hover:text-accent-text">
              {t.aboutLink}
            </Link>
            <Link href="/teacher" className="hover:text-accent-text">
              {t.teacherTitle}
            </Link>
            <Link href="/settings" className="hover:text-accent-text">
              {t.navSettings}
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
