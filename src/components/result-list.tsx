"use client";

import { ResultCard } from "./result-card";
import type { Locale } from "@/lib/i18n";
import type { PilotProfile } from "@/types/pilot";

interface ResultListProps {
  pilots: PilotProfile[];
  activeId: number | null;
  onSelect: (pilot: PilotProfile) => void;
  locale: Locale;
}

/**
 * Scrollable container for ResultCards. Renders a 2-column grid on the desktop
 * result column. Empty state shows a quiet "no members yet" line.
 */
export function ResultList({ pilots, activeId, onSelect, locale }: ResultListProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  if (pilots.length === 0) {
    return (
      <div
        className="flex flex-1 items-center justify-center px-6 py-16 text-center font-[family-name:var(--font-body)] text-sm"
        style={{ color: "var(--fg3)" }}
      >
        {t("Aucun membre ici… pour l'instant.", "No members here… yet.")}
      </div>
    );
  }

  return (
    <div
      className="scrollbar-hidden flex-1 overflow-y-auto px-5 pb-8 pt-5"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {pilots.map((p) => (
          <ResultCard
            key={p.id}
            pilot={p}
            active={activeId === p.id}
            onClick={onSelect}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
