"use client";

import { Icon } from "../icon";
import { MobileCard } from "./mobile-card";
import type { Locale } from "@/lib/i18n";
import type { PilotProfile } from "@/types/pilot";

interface MobileBottomSheetProps {
  pilots: PilotProfile[];
  activeId: number | null;
  onSelect: (pilot: PilotProfile) => void;
  locale: Locale;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

/**
 * Bottom sheet over the mobile map. Two snap points (tap-toggled):
 *  - Peek (268px): handle bar + count + horizontal carousel of compact cards
 *  - Expanded (~78%): handle bar + chevron-down + vertical list of full cards
 *
 * State is owned by the parent (MapApp) so we can collapse it automatically
 * when a profile opens.
 */
export function MobileBottomSheet({
  pilots,
  activeId,
  onSelect,
  locale,
  expanded,
  onExpandedChange,
}: MobileBottomSheetProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: expanded ? "78%" : 268,
        background: "var(--color-paper)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: "0 -10px 28px rgba(10,11,14,0.22)",
        transition: "height .3s cubic-bezier(.2,.7,.2,1)",
      }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onClick={() => onExpandedChange(!expanded)}
        aria-label={t("Élargir la liste", "Expand list")}
        className="flex h-[26px] flex-shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent"
      >
        <div
          className="h-1 w-[38px] rounded-sm"
          style={{ background: "var(--border-strong)" }}
        />
      </button>

      {/* Header */}
      <div className="flex flex-shrink-0 items-baseline justify-between px-[18px] pb-2.5 pt-0.5">
        <div>
          <div
            className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase text-ink"
            style={{ letterSpacing: "-.005em" }}
          >
            {pilots.length}{" "}
            {t("membres vérifiés", "verified members")}
          </div>
          <div
            className="mt-0.5 font-[family-name:var(--font-body)] text-xs"
            style={{ color: "var(--fg3)" }}
          >
            {expanded
              ? t("Touche le handle pour réduire", "Tap the handle to collapse")
              : t("Glisse pour voir la liste complète", "Swipe up for the full list")}
          </div>
        </div>
        {expanded && (
          <button
            type="button"
            onClick={() => onExpandedChange(false)}
            aria-label={t("Réduire", "Collapse")}
            className="cursor-pointer border-0 bg-transparent p-1"
          >
            <Icon name="chevronDown" size={20} stroke="var(--color-ink)" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="scrollbar-hidden flex-1 overflow-y-auto overflow-x-hidden">
        {pilots.length === 0 ? (
          <div
            className="px-8 py-8 text-center font-[family-name:var(--font-body)] text-sm"
            style={{ color: "var(--fg3)" }}
          >
            {t("Aucun membre ici… pour l'instant.", "No members here… yet.")}
          </div>
        ) : expanded ? (
          <div className="grid grid-cols-1 gap-[18px] px-[18px] pb-6 pt-1">
            {pilots.map((p) => (
              <MobileCard
                key={p.id}
                pilot={p}
                active={activeId === p.id}
                onClick={onSelect}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="scrollbar-hidden flex gap-3 overflow-x-auto px-3.5 pb-3.5 pt-1">
            {pilots.map((p) => (
              <MobileCard
                key={p.id}
                pilot={p}
                active={activeId === p.id}
                onClick={onSelect}
                locale={locale}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
