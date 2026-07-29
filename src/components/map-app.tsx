"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "./header";
import { FilterBar } from "./filter-bar";
import { ResultList } from "./result-list";
import { ProfilePanel } from "./profile-panel";
import { MobileHeader } from "./mobile/mobile-header";
import { MobileFilterStrip } from "./mobile/mobile-filter-strip";
import { MobileFilterSheet } from "./mobile/mobile-filter-sheet";
import { MobileBottomSheet } from "./mobile/mobile-bottom-sheet";
import { useIsMobile } from "@/lib/use-is-mobile";
import type { Locale } from "@/lib/i18n";
import type { MemberTypeId } from "@/lib/taxonomies";
import type { PilotProfile, SpecialtyId } from "@/types/pilot";

// Leaflet hits window/document at module load, so dynamically import the
// MapCanvas on the client only.
const MapCanvas = dynamic(
  () => import("./map-canvas").then((m) => m.MapCanvas),
  { ssr: false }
);

interface MapAppProps {
  pilots: PilotProfile[];
}

/**
 * Root client wrapper. Holds shared interactive state (locale, filters,
 * selected pilot, sheet expansion) and renders either the desktop layout
 * (Header · FilterBar · 40/60 split) or the mobile layout (compact Header ·
 * filter strip · full-bleed map · bottom sheet) depending on viewport width.
 */
export function MapApp({ pilots }: MapAppProps) {
  const isMobile = useIsMobile();

  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState("");
  const [memberType, setMemberType] = useState<MemberTypeId>("all");
  const [activeSpecs, setActiveSpecs] = useState<SpecialtyId[]>([]);
  const [selected, setSelected] = useState<PilotProfile | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [specsSheetOpen, setSpecsSheetOpen] = useState(false);

  const toggleSpec = (id: SpecialtyId) =>
    setActiveSpecs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const clearSpecs = () => setActiveSpecs([]);

  // Selecting a pilot collapses the mobile bottom sheet so the profile takes over
  const handleSelect = (pilot: PilotProfile) => {
    setSelected(pilot);
    setSheetExpanded(false);
  };

  const handleHome = () => {
    setQuery("");
    setMemberType("all");
    setActiveSpecs([]);
    setSelected(null);
    setSheetExpanded(false);
    setSpecsSheetOpen(false);
  };

  const handleRegister = () => {
    // TODO: wire the real RegisterModal when ported
    alert(locale === "fr" ? "Inscription à venir" : "Register flow coming");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return pilots.filter((p) => {
      // Skip members without real coordinates: a profile with no address
      // geocodes to (0,0), which would drop a stray pin off Africa and blow
      // out the map's auto-fit bounds. No coordinates means not on the map.
      if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return false;
      if (p.lat === 0 && p.lng === 0) return false;

      if (memberType === "recreatif" && !(p.kind === "pilot" && !p.pro)) return false;
      if (memberType === "pro" && !(p.kind === "pilot" && p.pro)) return false;
      if (memberType === "shop" && p.kind !== "shop") return false;
      if (memberType === "school" && p.kind !== "school") return false;

      if (activeSpecs.length > 0) {
        const pilotSpecs = p.specs ?? [];
        if (!activeSpecs.some((s) => pilotSpecs.includes(s))) return false;
      }

      if (q.length > 0) {
        const postalMatch = p.postal.toUpperCase().startsWith(q.slice(0, 3));
        const cityMatch = p.city.toUpperCase().includes(q);
        if (!postalMatch && !cityMatch) return false;
      }

      return true;
    });
  }, [pilots, memberType, activeSpecs, query]);

  // ---- Mobile layout ----
  if (isMobile) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        <MobileHeader
          locale={locale}
          onLocaleChange={setLocale}
          onRegister={handleRegister}
          onHome={handleHome}
        />

        <MobileFilterStrip
          locale={locale}
          query={query}
          onQueryChange={setQuery}
          memberType={memberType}
          onMemberTypeChange={setMemberType}
          activeSpecs={activeSpecs}
          onOpenSpecsSheet={() => setSpecsSheetOpen(true)}
        />

        <main className="relative flex flex-1 overflow-hidden">
          <MapCanvas
            pilots={filtered}
            activeId={selected?.id ?? null}
            onSelect={handleSelect}
            locale={locale}
          />
          <MobileBottomSheet
            pilots={filtered}
            activeId={selected?.id ?? null}
            onSelect={handleSelect}
            locale={locale}
            expanded={sheetExpanded}
            onExpandedChange={setSheetExpanded}
          />
        </main>

        {selected && (
          <ProfilePanel
            key={selected.id}
            pilot={selected}
            locale={locale}
            onClose={() => setSelected(null)}
            mobile
          />
        )}

        <MobileFilterSheet
          open={specsSheetOpen}
          onClose={() => setSpecsSheetOpen(false)}
          locale={locale}
          activeSpecs={activeSpecs}
          onToggleSpec={toggleSpec}
          onClearSpecs={clearSpecs}
          count={filtered.length}
        />
      </div>
    );
  }

  // ---- Desktop layout ----
  return (
    <div className="flex h-screen flex-col">
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        onRegister={handleRegister}
        onHome={handleHome}
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
            onSelect={handleSelect}
            locale={locale}
          />
        </div>

        <div
          className="relative"
          style={{
            flex: "3 1 0",
            minWidth: 0,
            background: "var(--color-onyx)",
          }}
        >
          <MapCanvas
            pilots={filtered}
            activeId={selected?.id ?? null}
            onSelect={handleSelect}
            locale={locale}
          />
          {selected && (
            <ProfilePanel
              key={selected.id}
              pilot={selected}
              locale={locale}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
