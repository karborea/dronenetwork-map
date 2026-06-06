"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import { Chip } from "./ui/chip";
import { TextInput } from "./ui/text-input";
import { DN_MEMBER_TYPES, DN_SPECIALTIES, type MemberTypeId } from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { SpecialtyId } from "@/types/pilot";

interface FilterBarProps {
  locale: Locale;
  query: string;
  onQueryChange: (q: string) => void;
  memberType: MemberTypeId;
  onMemberTypeChange: (m: MemberTypeId) => void;
  activeSpecs: SpecialtyId[];
  onToggleSpec: (id: SpecialtyId) => void;
  onClearSpecs: () => void;
  count: number;
}

/**
 * Single-row filter bar. The specialty chips live inside a popover that opens
 * under the "Spécialités" button — keeps the bar compact and gives the map
 * more vertical breathing room.
 */
export function FilterBar({
  locale,
  query,
  onQueryChange,
  memberType,
  onMemberTypeChange,
  activeSpecs,
  onToggleSpec,
  onClearSpecs,
  count,
}: FilterBarProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);
  const [specsOpen, setSpecsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click or Escape
  useEffect(() => {
    if (!specsOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSpecsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSpecsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [specsOpen]);

  return (
    <div
      className="bg-white"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex flex-wrap items-center gap-4 px-6 py-3">
        {/* Postal-code search */}
        <div className="w-[280px] flex-shrink-0">
          <TextInput
            value={query}
            onChange={onQueryChange}
            icon="search"
            placeholder={t("Code postal — ex. G7K 1H3", "Postal code — e.g. G7K 1H3")}
          />
        </div>

        {/* Member-type tabs */}
        <div className="flex flex-shrink-0 gap-1.5">
          {DN_MEMBER_TYPES.map((m) => {
            const active = memberType === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onMemberTypeChange(m.id)}
                aria-pressed={active}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 font-[family-name:var(--font-display)] text-[11.5px] font-semibold uppercase tracking-[.05em] transition-colors duration-150 ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-[color:var(--border)] bg-white text-ink hover:bg-mist"
                }`}
              >
                {locale === "fr" ? m.fr : m.en}
              </button>
            );
          })}
        </div>

        {/* Specialties button + popover */}
        <div className="relative flex-shrink-0" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setSpecsOpen((v) => !v)}
            aria-expanded={specsOpen}
            aria-haspopup="true"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 font-[family-name:var(--font-display)] text-[11.5px] font-semibold uppercase tracking-[.05em] transition-colors duration-150 ${
              activeSpecs.length > 0 || specsOpen
                ? "border-iris bg-[color:var(--color-iris-100)] text-iris-700"
                : "border-[color:var(--border)] bg-white text-ink hover:bg-mist"
            }`}
          >
            <Icon
              name="filter"
              size={13}
              stroke={activeSpecs.length > 0 || specsOpen ? "var(--color-iris-700)" : "var(--color-ink)"}
            />
            {t("Spécialités", "Specialties")}
            {activeSpecs.length > 0 && (
              <span className="ml-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-iris px-[5px] text-[10px] font-bold text-white">
                {activeSpecs.length}
              </span>
            )}
            <Icon
              name="chevronDown"
              size={12}
              stroke={activeSpecs.length > 0 || specsOpen ? "var(--color-iris-700)" : "var(--color-ink)"}
              style={{
                transform: specsOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform .15s ease",
              }}
            />
          </button>

          {specsOpen && (
            <div
              role="dialog"
              aria-label={t("Filtrer par spécialités", "Filter by specialties")}
              className="absolute left-0 top-[calc(100%+10px)] z-50 w-[520px] rounded-xl bg-white p-5 shadow-lg"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="eyebrow">
                  {t("Filtrer par spécialités", "Filter by specialties")}
                </span>
                {activeSpecs.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearSpecs}
                    className="cursor-pointer font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.08em] text-iris hover:text-iris-700"
                  >
                    {t(
                      `Tout effacer (${activeSpecs.length})`,
                      `Clear all (${activeSpecs.length})`,
                    )}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {DN_SPECIALTIES.map((s) => (
                  <Chip
                    key={s.id}
                    active={activeSpecs.includes(s.id)}
                    onClick={() => onToggleSpec(s.id)}
                  >
                    {locale === "fr" ? s.fr : s.en}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Live result count */}
        <div
          className="flex items-center gap-1.5 whitespace-nowrap font-[family-name:var(--font-mono)] text-xs"
          style={{ color: "var(--fg3)" }}
        >
          <span className="font-semibold text-iris">{count}</span>
          {t("membres vérifiés", "verified members")}
        </div>
      </div>
    </div>
  );
}
