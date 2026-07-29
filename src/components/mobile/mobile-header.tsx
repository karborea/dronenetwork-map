"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface MobileHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onHome: () => void;
  onOpenMenu: () => void;
}

/**
 * Compact mobile header (60px) — wordmark · FR/EN switch · hamburger.
 * The login-aware CTAs and nav links live in the slide-over menu (NavMenu).
 */
export function MobileHeader({
  locale,
  onLocaleChange,
  onHome,
  onOpenMenu,
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
          onClick={onOpenMenu}
          aria-label={locale === "fr" ? "Menu" : "Menu"}
          className="flex h-[38px] w-[38px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-[#34363c] bg-transparent"
        >
          <span className="h-[2px] w-4 bg-paper" />
          <span className="h-[2px] w-4 bg-paper" />
          <span className="h-[2px] w-4 bg-paper" />
        </button>
      </div>
    </header>
  );
}
