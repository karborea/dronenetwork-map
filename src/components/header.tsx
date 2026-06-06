"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface NavItem {
  fr: string;
  en: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { fr: "La carte", en: "The map", href: "/" },
  { fr: "Spécialités", en: "Specialties", href: "#" },
  { fr: "Devenir membre", en: "Become a member", href: "#" },
];

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onRegister?: () => void;
  onHome?: () => void;
}

export function Header({ locale, onLocaleChange, onRegister, onHome }: HeaderProps) {
  return (
    <header className="relative z-40 flex h-[92px] flex-shrink-0 items-center justify-between border-b border-[#1c1d22] bg-onyx px-8">
      <Link
        href="/"
        onClick={onHome}
        className="flex cursor-pointer items-center"
        aria-label="Drone Network — accueil"
      >
        <Image
          src="/assets/logo-wordmark-blanc.svg"
          alt="Drone Network"
          width={310}
          height={44}
          priority
          style={{ width: "auto", height: "44px" }}
        />
      </Link>

      <nav className="flex items-center gap-7">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.fr}
            href={item.href}
            className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[.12em] text-[#9b9da4] transition-colors hover:text-paper"
          >
            {locale === "fr" ? item.fr : item.en}
          </Link>
        ))}

        <div className="flex overflow-hidden rounded-full border border-[#34363c]">
          {(["fr", "en"] as const).map((lc) => {
            const active = locale === lc;
            return (
              <button
                key={lc}
                type="button"
                onClick={() => onLocaleChange(lc)}
                aria-pressed={active}
                className={`cursor-pointer border-0 px-3 py-[7px] font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.1em] transition-colors ${
                  active
                    ? "bg-iris text-white"
                    : "bg-transparent text-[#9b9da4] hover:text-paper"
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
          className="cursor-pointer rounded-full bg-lime px-6 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-ink transition-colors hover:bg-lime-700"
        >
          {locale === "fr" ? "S'inscrire" : "Register"}
        </button>
      </nav>
    </header>
  );
}
