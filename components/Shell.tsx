"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LANGS } from "@/lib/missions";
import { setState, useAppState } from "@/lib/store";
import { langName, ui, type Dict } from "@/lib/ui";

const NAV: { href: string; label: keyof Dict; active: (path: string) => boolean }[] = [
  {
    href: "/",
    label: "navMissions",
    active: (p) => p === "/" || p.startsWith("/missions"),
  },
  { href: "/learn", label: "navLearn", active: (p) => p.startsWith("/learn") },
  { href: "/results", label: "navResults", active: (p) => p.startsWith("/results") },
  { href: "/settings", label: "navSettings", active: (p) => p.startsWith("/settings") },
];

function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  setState({ theme: dark ? "light" : "dark" });
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { lang, theme } = useAppState();
  const pathname = usePathname();
  const t = ui[lang];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
    root.lang = lang;
    // The inline script in the layout hides the page until the saved language is applied.
    root.classList.remove("pending");
  }, [theme, lang]);

  // Mission and lesson pages name the tab themselves.
  useEffect(() => {
    if (/^\/(missions|learn|demo)\/./.test(pathname)) return;
    const section = NAV.find((item) => item.href !== "/" && item.active(pathname));
    const name = section
      ? t[section.label]
      : pathname.startsWith("/teacher")
        ? t.teacherTitle
        : "";
    document.title = name ? `${name} · Sheber` : "Sheber";
  }, [pathname, t]);

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
                  className={`rounded-md border-[1.5px] px-2 py-1 font-medium sm:px-3 ${
                    active
                      ? "border-edge bg-panel text-ink"
                      : "border-transparent text-mute hover:text-ink"
                  }`}
                >
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
                  className={`px-2.5 py-1.5 ${
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
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:pt-10">{children}</div>
    </>
  );
}
