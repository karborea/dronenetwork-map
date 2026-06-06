"use client";

import { Icon } from "../icon";
import { TextInput } from "../ui/text-input";
import { DN_MEMBER_TYPES, DN_SPECIALTIES, type MemberTypeId } from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { SpecialtyId } from "@/types/pilot";

interface MobileFilterStripProps {
  locale: Locale;
  query: string;
  onQueryChange: (q: string) => void;
  memberType: MemberTypeId;
  onMemberTypeChange: (m: MemberTypeId) => void;
  activeSpecs: SpecialtyId[];
  onToggleSpec: (id: SpecialtyId) => void;
}

/**
 * Mobile filter strip — postal search + filter icon (decorative for now) on
 * top row, then a horizontally scrollable chip row mixing member-type tabs
 * (in ink/paper) with specialty chips (in iris) separated by a thin divider.
 */
export function MobileFilterStrip({
  locale,
  query,
  onQueryChange,
  memberType,
  onMemberTypeChange,
  activeSpecs,
  onToggleSpec,
}: MobileFilterStripProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  return (
    <div
      className="relative z-40 flex-shrink-0 bg-white"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Search row */}
      <div className="flex gap-2 px-3.5 pt-2.5 pb-2">
        <div className="flex-1">
          <TextInput
            value={query}
            onChange={onQueryChange}
            icon="search"
            placeholder={t("Code postal — ex. G7K 1H3", "Postal code — e.g. G7K 1H3")}
          />
        </div>
        <button
          type="button"
          aria-label={t("Filtres", "Filters")}
          className="flex h-11 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-md bg-white"
          style={{ border: "1px solid var(--border-strong)" }}
        >
          <Icon name="filter" size={18} stroke="var(--color-ink)" />
        </button>
      </div>

      {/* Chip row — horizontal scroll */}
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto px-3.5 pt-1 pb-3">
        {DN_MEMBER_TYPES.map((m) => {
          const active = memberType === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMemberTypeChange(m.id)}
              aria-pressed={active}
              className={`flex-shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3 py-2 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.05em] transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "bg-white text-ink"
              }`}
              style={!active ? { borderColor: "var(--border-strong)" } : undefined}
            >
              {locale === "fr" ? m.fr : m.en}
            </button>
          );
        })}

        <div
          className="mx-1 h-[22px] w-px flex-shrink-0 self-center"
          style={{ background: "var(--border)" }}
          aria-hidden="true"
        />

        {DN_SPECIALTIES.map((s) => {
          const active = activeSpecs.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onToggleSpec(s.id)}
              aria-pressed={active}
              className={`flex-shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3 py-2 font-[family-name:var(--font-display)] text-[11px] font-medium uppercase tracking-[.07em] transition-colors ${
                active
                  ? "border-iris bg-iris text-white"
                  : "bg-white text-ink"
              }`}
              style={!active ? { borderColor: "var(--border-strong)" } : undefined}
            >
              {locale === "fr" ? s.fr : s.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
