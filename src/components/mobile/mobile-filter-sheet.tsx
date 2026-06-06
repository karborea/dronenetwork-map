"use client";

import { useEffect } from "react";
import { Icon } from "../icon";
import { Chip } from "../ui/chip";
import { DN_SPECIALTIES } from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { SpecialtyId } from "@/types/pilot";

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  activeSpecs: SpecialtyId[];
  onToggleSpec: (id: SpecialtyId) => void;
  onClearSpecs: () => void;
  count: number;
}

/**
 * Mobile specialty filter — bottom sheet that slides up from the bottom of
 * the viewport. Backdrop fades in. Contains the 12 specialty chips, a clear
 * button, and an Apply button that shows the live result count.
 */
export function MobileFilterSheet({
  open,
  onClose,
  locale,
  activeSpecs,
  onToggleSpec,
  onClearSpecs,
  count,
}: MobileFilterSheetProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,11,14,0.45)",
          animation: "dn-fade-in .2s ease forwards",
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label={t("Filtrer par spécialités", "Filter by specialties")}
        className="relative flex flex-col"
        style={{
          background: "var(--color-paper)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "78vh",
          minHeight: "60vh",
          boxShadow: "0 -10px 28px rgba(10,11,14,0.32)",
          animation: "dn-sheet-up .3s cubic-bezier(.2,.7,.2,1) forwards",
          zIndex: 1,
        }}
      >
        {/* Drag handle */}
        <div className="flex h-[26px] flex-shrink-0 items-center justify-center">
          <div
            className="h-1 w-[38px] rounded-sm"
            style={{ background: "var(--border-strong)" }}
          />
        </div>

        {/* Header */}
        <div
          className="flex flex-shrink-0 items-center justify-between px-5 pb-4 pt-1"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3
              className="m-0 font-[family-name:var(--font-display)] text-lg font-bold uppercase text-ink"
              style={{ letterSpacing: "-.005em" }}
            >
              {t("Spécialités", "Specialties")}
            </h3>
            {activeSpecs.length > 0 && (
              <div
                className="mt-0.5 font-[family-name:var(--font-mono)] text-xs"
                style={{ color: "var(--fg3)" }}
              >
                {activeSpecs.length} {t("sélectionnées", "selected")}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Fermer", "Close")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0"
            style={{ background: "var(--color-mist)" }}
          >
            <Icon name="x" size={18} stroke="var(--color-ink)" />
          </button>
        </div>

        {/* Chips */}
        <div className="scrollbar-hidden flex-1 overflow-y-auto px-5 py-5">
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

        {/* Footer */}
        <div
          className="flex flex-shrink-0 items-center gap-3 px-5 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={onClearSpecs}
            disabled={activeSpecs.length === 0}
            className="cursor-pointer font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.05em] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: "var(--color-iris)" }}
          >
            {t("Tout effacer", "Clear all")}
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 cursor-pointer rounded-full border-0 bg-iris px-6 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-white transition-colors hover:bg-iris-700"
          >
            {t(`Voir ${count} résultats`, `Show ${count} results`)}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dn-sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes dn-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
