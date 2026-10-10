"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppState } from "@/lib/store";
import { ui } from "@/lib/ui";

export default function NotFound() {
  const { lang } = useAppState();
  const t = ui[lang];

  useEffect(() => {
    document.title = `${t.notFoundTitle} · Sheber`;
  }, [t]);

  return (
    <main>
      <p className="font-display text-6xl font-extrabold text-accent-text">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">{t.notFoundTitle}</h1>
      <p className="mt-3 text-lg text-mute">{t.notFoundText}</p>
      <Link href="/" className="btn btn-primary mt-6">
        ← {t.back}
      </Link>
    </main>
  );
}
