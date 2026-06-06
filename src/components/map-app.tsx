"use client";

import { useMemo, useState } from "react";
import { Header } from "./header";
import { FilterBar } from "./filter-bar";
import { ResultList } from "./result-list";
import type { Locale } from "@/lib/i18n";
import type { MemberTypeId } from "@/lib/taxonomies";
import type { PilotProfile, SpecialtyId } from "@/types/pilot";

interface MapAppProps {
  pilots: PilotProfile[];
}

/**
 * Root client wrapper for the map experience. Holds the shared interactive
 * state (locale, filters, selected pilot) and lays out Header · FilterBar ·
 * (ResultList | MapCanvas) · ProfilePanel.
 *
 * Pilots come from the parent Server Component (page.tsx) which fetches them
 * via getPilots() — mock today, WordPress REST endpoint later.
 */
export function MapApp({ pilots }: MapAppProps) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState("");
  const [memberType, setMemberType] = useState<MemberTypeId>("all");
  const [activeSpecs, setActiveSpecs] = useState<SpecialtyId[]>([]);
  const [selected, setSelected] = useState<PilotProfile | null>(null);

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
          alert(locale === "fr" ? "Inscription à venir" : "Register flow coming");
        }}
        onHome={() => {
          setQuery("");
          setMemberType("all");
          setActiveSpecs([]);
          setSelected(null);
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

      {/* Main area — 40% result list / 60% map (locked layout) */}
      <main className="relative flex flex-1 overflow-hidden">
        <div
          className="flex flex-col"
          style={{
            flex: "2 1 0",
            minWidth: 0,
            borderRight: "1px solid var(--border)",
          }}
        >
          <ResultList
            pilots={filtered}
            activeId={selected?.id ?? null}
            onSelect={setSelected}
            locale={locale}
          />
        </div>

        <div
          className="relative flex"
          style={{
            flex: "3 1 0",
            minWidth: 0,
            background: "var(--color-onyx)",
          }}
        >
          <div className="flex w-full items-center justify-center">
            <div className="text-center" style={{ color: "#787a85" }}>
              <p className="mb-2 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[.22em]">
                {locale === "fr" ? "Carte" : "Map"}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">
                Leaflet · prochaine session
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
