"use client";

import Image from "next/image";
import { Icon } from "./icon";
import type { Locale } from "@/lib/i18n";
import type { AuthState } from "@/lib/use-auth";

const WP = "https://dev.dronenetwork.ca";

const LINKS: { fr: string; en: string; href: string }[] = [
  { fr: "À propos", en: "About", href: `${WP}/#apropos` },
  { fr: "Nous joindre", en: "Contact", href: `${WP}/nous-joindre/` },
  { fr: "Location d'équipements", en: "Equipment rental", href: `${WP}/#location` },
  { fr: "FAQ", en: "FAQ", href: `${WP}/faq/` },
];

const SOCIALS = ["instagram", "facebook", "linkedin"] as const;

const CTA_LIME =
  "rounded-full bg-lime px-6 py-3.5 text-center font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-ink transition-colors hover:bg-lime-700";
const CTA_OUTLINE =
  "rounded-full border border-[#34363c] px-6 py-3.5 text-center font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-paper transition-colors hover:border-paper";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  auth: AuthState;
}

export function NavMenu({ open, onClose, locale, onLocaleChange, auth }: NavMenuProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-[1200] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[1300] flex w-[min(400px,88vw)] flex-col bg-onyx shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1c1d22] px-6 py-5">
          <Image
            src="/assets/logo-wordmark-blanc.svg"
            alt="Drone Network"
            width={180}
            height={26}
            style={{ width: "auto", height: "26px" }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Fermer", "Close")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#9b9da4] transition-colors hover:text-paper"
          >
            <Icon name="x" size={22} stroke="currentColor" strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-7">
          <div className="flex flex-col gap-3">
            {auth.loggedIn ? (
              <a href={auth.dashboardUrl} className={CTA_LIME}>
                {t("Mon espace", "My account")}
              </a>
            ) : (
              <>
                <a href={auth.registerUrl} className={CTA_LIME}>
                  {t("Devenir membre", "Become a member")}
                </a>
                <a href={auth.loginUrl} className={CTA_OUTLINE}>
                  {t("Connexion", "Log in")}
                </a>
              </>
            )}
          </div>

          <div className="flex flex-col">
            <span className="mb-2 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[.18em] text-[#6b6d74]">
              {t("Explorer", "Explore")}
            </span>
            {LINKS.map((l) => (
              <a
                key={l.fr}
                href={l.href}
                className="flex items-center justify-between border-b border-[#17181d] py-3.5 font-[family-name:var(--font-display)] text-lg text-paper transition-colors hover:text-lime"
              >
                {t(l.fr, l.en)}
                <Icon name="arrowUpRight" size={18} stroke="currentColor" strokeWidth={2} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[.16em] text-[#6b6d74]">
              {t("Langue", "Language")}
            </span>
            <div className="flex overflow-hidden rounded-full border border-[#34363c]">
              {(["fr", "en"] as const).map((lc) => {
                const active = locale === lc;
                return (
                  <button
                    key={lc}
                    type="button"
                    onClick={() => onLocaleChange(lc)}
                    aria-pressed={active}
                    className={`cursor-pointer border-0 px-3.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.1em] transition-colors ${
                      active ? "bg-iris text-white" : "bg-transparent text-[#9b9da4] hover:text-paper"
                    }`}
                  >
                    {lc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-4">
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2c32] text-[#9b9da4] transition-colors hover:border-[#3a3c42] hover:text-paper"
                >
                  <Icon name={s} size={18} stroke="currentColor" strokeWidth={2} />
                </a>
              ))}
            </div>
            <a
              href="mailto:info@dronenetwork.ca"
              className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-[.02em] text-lime transition-opacity hover:opacity-80"
            >
              <Icon name="mail" size={16} stroke="currentColor" strokeWidth={2} />
              info@dronenetwork.ca
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
