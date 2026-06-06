"use client";

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
  count: number;
}

/**
 * Horizontal filter bar — two rows:
 *  1) Postal-code search · count · "All filters" button
 *  2) Member-type tabs · vertical divider · specialty chips
 *
 * Mobile gets a different treatment (horizontally scrollable single row);
 * that lives in a separate component when the mobile layout lands.
 */
export function FilterBar({
  locale,
  query,
  onQueryChange,
  memberType,
  onMemberTypeChange,
  activeSpecs,
  onToggleSpec,
  count,
}: FilterBarProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  return (
    <div
      className="bg-white"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Row 1: search · count · filters button */}
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="w-[320px] flex-shrink-0">
          <TextInput
            value={query}
            onChange={onQueryChange}
            icon="search"
            placeholder={t("Code postal — ex. G7K 1H3", "Postal code — e.g. G7K 1H3")}
          />
        </div>

        <div className="flex-1" />

        <div
          className="flex items-center gap-1.5 whitespace-nowrap font-[family-name:var(--font-mono)] text-xs"
          style={{ color: "var(--fg3)" }}
        >
          <span className="font-semibold text-iris">{count}</span>
          {t("membres vérifiés", "verified members")}
        </div>

        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-transparent px-6 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-iris transition-colors hover:bg-[color:var(--color-iris-100)]"
        >
          <Icon name="filter" size={15} stroke="var(--color-ink)" />
          {t("Tous les filtres", "All filters")}
        </button>
      </div>

      {/* Row 2: member-type tabs · divider · specialty chips */}
      <div className="flex flex-wrap items-center gap-3.5 px-6 pb-3.5">
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

        <div
          className="h-[22px] w-px flex-shrink-0"
          style={{ background: "var(--border)" }}
          aria-hidden="true"
        />

        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
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
    </div>
  );
}
