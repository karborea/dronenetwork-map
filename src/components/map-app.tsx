"use client";

import { useMemo, useState } from "react";
import { Header } from "./header";
import { FilterBar } from "./filter-bar";
import type { Locale } from "@/lib/i18n";
import type { MemberTypeId } from "@/lib/taxonomies";
import type { PilotProfile, SpecialtyId } from "@/types/pilot";

interface MapAppProps {
  pilots: PilotProfile[];
}

/**
 * Root client wrapper for the map experience. Holds the shared interactive
 * state (locale, filters, selected pilot, register modal) and renders the
 * Header + FilterBar + main map area.
 *
 * Pilots come from the parent Server Component (page.tsx) which fetches them
 * via getPilots() — mock today, WordPress REST endpoint later.
 */
export function MapApp({ pilots }: MapAppProps) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState("");
  const [memberType, setMemberType] = useState<MemberTypeId>("all");
  const [activeSpecs, setActiveSpecs] = useState<SpecialtyId[]>([]);

  const toggleSpec = (id: SpecialtyId) =>
    setActiveSpecs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const clearSpecs = () => setActiveSpecs([]);

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return pilots.filter((p) => {
      // Member-type filter
      if (memberType === "recreatif" && !(p.kind === "pilot" && !p.pro)) return false;
      if (memberType === "pro" && !(p.kind === "pilot" && p.pro)) return false;
      if (memberType === "shop" && p.kind !== "shop") return false;
      if (memberType === "school" && p.kind !== "school") return false;

      // Specialty filter (only applies if at least one is selected)
      if (activeSpecs.length > 0) {
        const pilotSpecs = p.specs ?? [];
        if (!activeSpecs.some((s) => pilotSpecs.includes(s))) return false;
      }

      // Postal-code / city query
      if (q.length > 0) {
        const postalMatch = p.postal.toUpperCase().startsWith(q.slice(0, 3));
        const cityMatch = p.city.toUpperCase().includes(q);
        if (!postalMatch && !cityMatch) return false;
      }

      return true;
    });
  }, [pilots, memberType, activeSpecs, query]);

  return (
    <div className="flex h-screen flex-col">
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        onRegister={() => {
          // TODO: wire the real RegisterModal when ported
          alert(locale === "fr" ? "Inscription à venir" : "Register flow coming");
        }}
        onHome={() => {
          setQuery("");
          setMemberType("all");
          setActiveSpecs([]);
        }}
      />

      <FilterBar
        locale={locale}
        query={query}
        onQueryChange={setQuery}
        memberType={memberType}
        onMemberTypeChange={setMemberType}
        activeSpecs={activeSpecs}
        onToggleSpec={toggleSpec}
        onClearSpecs={clearSpecs}
        count={filtered.length}
      />

      <main className="relative flex-1 overflow-hidden">
        <div className="flex h-full items-center justify-center px-6">
          <div className="max-w-md text-center">
            <p className="eyebrow mb-3">
              {filtered.length}{" "}
              {locale === "fr" ? "résultats filtrés" : "filtered results"}
            </p>
            <h2 className="mb-4 text-2xl">
              {locale === "fr"
                ? "Filtres branchés"
                : "Filters wired up"}
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--fg2)" }}
            >
              {locale === "fr"
                ? "Joue avec les chips et les onglets : le compteur réagit en direct. Les cartes de résultats et la carte Leaflet arrivent dans la prochaine session."
                : "Play with the chips and tabs — the count reacts live. The result cards and Leaflet map land next session."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm" style={{ color: "var(--fg3)" }}>
              {filtered.slice(0, 5).map((p) => (
                <span
                  key={p.id}
                  className="rounded-full border px-3 py-1 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[.06em]"
                  style={{ borderColor: "var(--border)" }}
                >
                  {p.name}
                </span>
              ))}
              {filtered.length > 5 && (
                <span className="font-[family-name:var(--font-mono)] text-[11px]">
                  +{filtered.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
