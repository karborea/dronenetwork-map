"use client";

import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { WP_SITE_URL } from "@/lib/site";
import type { AuthState } from "@/lib/use-auth";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onOpenMenu: () => void;
  auth: AuthState;
}

/**
 * Desktop header — mirrors the WordPress site header: logo · FR/EN · the
 * login-aware CTAs (Connexion + Devenir membre when logged out, Mon espace when
 * logged in) · hamburger that opens the full slide-over menu.
 */
export function Header({ locale, onLocaleChange, onOpenMenu, auth }: HeaderProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  return (
    <header className="relative z-40 flex h-[92px] flex-shrink-0 items-center justify-between border-b border-[#1c1d22] bg-onyx px-8">
      <a
        href={WP_SITE_URL}
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
      </a>

      <div className="flex items-center gap-4">
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

        {auth.loggedIn ? (
          <a
            href={auth.dashboardUrl}
            className="rounded-full bg-lime px-6 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-ink transition-colors hover:bg-lime-700"
          >
            {t("Mon espace", "My account")}
          </a>
        ) : (
          <>
            <a
              href={auth.loginUrl}
              className="rounded-full border border-[#34363c] px-5 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-paper transition-colors hover:border-paper"
            >
              {t("Connexion", "Log in")}
            </a>
            <a
              href={auth.registerUrl}
              className="rounded-full bg-lime px-6 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-ink transition-colors hover:bg-lime-700"
            >
              {t("Devenir membre", "Become a member")}
            </a>
          </>
        )}

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t("Menu", "Menu")}
          className="ml-1 flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-[#34363c] bg-transparent transition-colors hover:border-paper"
        >
          <span className="h-[2px] w-[18px] bg-paper" />
          <span className="h-[2px] w-[18px] bg-paper" />
          <span className="h-[2px] w-[18px] bg-paper" />
        </button>
      </div>
    </header>
  );
}
