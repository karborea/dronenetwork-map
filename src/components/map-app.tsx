"use client";

import { useState } from "react";
import { Header } from "./header";
import type { Locale } from "@/lib/i18n";
import type { PilotProfile } from "@/types/pilot";

interface MapAppProps {
  pilots: PilotProfile[];
}

/**
 * Root client wrapper for the map experience. Holds the shared interactive
 * state (locale, filters, selected pilot, register modal) and renders the
 * Header + main map experience.
 *
 * Pilots come from the parent Server Component (page.tsx) which fetches them
 * via getPilots() — mock today, WordPress REST endpoint later.
 */
export function MapApp({ pilots }: MapAppProps) {
  const [locale, setLocale] = useState<Locale>("fr");

  return (
    <div className="flex h-screen flex-col">
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        onRegister={() => {
          // TODO: wire register modal in next session
          alert(locale === "fr" ? "Inscription à venir" : "Register flow coming");
        }}
      />

      <main className="relative flex-1 overflow-hidden">
        <div className="flex h-full items-center justify-center px-6">
          <div className="max-w-md text-center">
            <p className="eyebrow mb-3">
              {pilots.length}{" "}
              {locale === "fr" ? "membres vérifiés prêts" : "verified members ready"}
            </p>
            <h2 className="mb-4 text-2xl">
              {locale === "fr"
                ? "La carte arrive bientôt"
                : "The map is coming"}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--fg2)" }}>
              {locale === "fr"
                ? "Header en place. FilterBar et MapCanvas arrivent dans les prochaines sessions."
                : "Header in place. FilterBar and MapCanvas coming in upcoming sessions."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
