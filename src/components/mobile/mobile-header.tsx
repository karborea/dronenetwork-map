"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface MobileHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onRegister: () => void;
  onHome: () => void;
}

/**
 * Compact mobile header (60px) — wordmark · FR/EN switch · S'inscrire.
 * No inline nav; nav lives on the WP marketing pages.
 */
export function MobileHeader({
  locale,
  onLocaleChange,
  onRegister,
  onHome,
}: MobileHeaderProps) {
  return (
    <header className="relative z-50 flex h-[60px] flex-shrink-0 items-center justify-between border-b border-[#1c1d22] bg-onyx px-4">
      <Link
        href="/"
        onClick={onHome}
        className="flex cursor-pointer items-center"
        aria-label="Drone Network — accueil"
      >
        <Image
          src="/assets/logo-wordmark-blanc.svg"
          alt="Drone Network"
          width={200}
          height={28}
          priority
          style={{ width: "auto", height: "28px" }}
        />
      </Link>

      <div className="flex items-center gap-2.5">
        <div className="flex overflow-hidden rounded-full border border-[#34363c]">
          {(["fr", "en"] as const).map((lc) => {
            const active = locale === lc;
            return (
              <button
                key={lc}
                type="button"
                onClick={() => onLocaleChange(lc)}
                aria-pressed={active}
                className={`cursor-pointer border-0 px-[9px] py-[5px] font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[.1em] transition-colors ${
                  active
                    ? "bg-iris text-white"
                    : "bg-transparent text-[#9b9da4]"
                }`}
              >
                {lc}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onRegister}
          className="cursor-pointer rounded-full bg-lime px-[13px] py-[7px] font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.04em] text-ink transition-colors hover:bg-lime-700"
        >
          {locale === "fr" ? "S'inscrire" : "Register"}
        </button>
      </div>
    </header>
  );
}
