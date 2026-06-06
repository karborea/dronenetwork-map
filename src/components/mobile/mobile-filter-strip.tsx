"use client";

import { Icon } from "../icon";
import { TextInput } from "../ui/text-input";
import { DN_MEMBER_TYPES, type MemberTypeId } from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { SpecialtyId } from "@/types/pilot";

interface MobileFilterStripProps {
  locale: Locale;
  query: string;
  onQueryChange: (q: string) => void;
  memberType: MemberTypeId;
  onMemberTypeChange: (m: MemberTypeId) => void;
  activeSpecs: SpecialtyId[];
  onOpenSpecsSheet: () => void;
}

/**
 * Mobile filter strip — postal search on top row, then a horizontally
 * scrollable row of member-type tabs followed by a "Spécialités" button that
 * opens the full filter sheet (specialty chips can't fit inline on mobile).
 */
export function MobileFilterStrip({
  locale,
  query,
  onQueryChange,
  memberType,
  onMemberTypeChange,
  activeSpecs,
  onOpenSpecsSheet,
}: MobileFilterStripProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  return (
    <div
      className="relative z-40 flex-shrink-0 bg-white"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Search row */}
      <div className="px-3.5 pt-2.5 pb-2">
        <TextInput
          value={query}
          onChange={onQueryChange}
          icon="search"
          placeholder={t("Code postal — ex. G7K 1H3", "Postal code — e.g. G7K 1H3")}
        />
      </div>

      {/* Member-type tabs + Spécialités button (horizontal scroll) */}
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

        <button
          type="button"
          onClick={onOpenSpecsSheet}
          className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.05em] transition-colors ${
            activeSpecs.length > 0
              ? "border-iris bg-[color:var(--color-iris-100)] text-iris-700"
              : "bg-white text-ink"
          }`}
          style={
            activeSpecs.length === 0
              ? { borderColor: "var(--border-strong)" }
              : undefined
          }
        >
          <Icon
            name="filter"
            size={12}
            stroke={activeSpecs.length > 0 ? "var(--color-iris-700)" : "var(--color-ink)"}
          />
          {t("Spécialités", "Specialties")}
          {activeSpecs.length > 0 && (
            <span className="ml-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-iris px-1.5 text-[10px] font-bold text-white">
              {activeSpecs.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
