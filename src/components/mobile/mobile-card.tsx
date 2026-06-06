"use client";

import { useState } from "react";
import { Icon } from "../icon";
import {
  DN_FORMATIONS,
  DN_KIND_LABEL,
  DN_SERVICES,
  DN_SPECIALTIES,
} from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { PilotProfile } from "@/types/pilot";

interface MobileCardProps {
  pilot: PilotProfile;
  active: boolean;
  onClick: (pilot: PilotProfile) => void;
  locale: Locale;
  compact?: boolean;
}

/**
 * Mobile result card. Two display modes:
 * - `compact` (carousel peek): 220px wide, 5:3 image, name + city only
 * - default (vertical list): full-width column, 4:3 image, full taxonomy row
 */
export function MobileCard({
  pilot,
  active,
  onClick,
  locale,
  compact = false,
}: MobileCardProps) {
  const [fav, setFav] = useState(false);
  const k = DN_KIND_LABEL[pilot.kind];
  const isPro = !!pilot.pro;
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  let taxonomyNames: string[] = [];
  if (pilot.specs?.length) {
    taxonomyNames = pilot.specs.map((id) => {
      const found = DN_SPECIALTIES.find((x) => x.id === id);
      return found ? (locale === "fr" ? found.fr : found.en) : id;
    });
  } else if (pilot.services?.length) {
    taxonomyNames = pilot.services.map((id) => {
      const found = DN_SERVICES.find((x) => x.id === id);
      return found ? (locale === "fr" ? found.fr : found.en) : id;
    });
  } else if (pilot.formations?.length) {
    taxonomyNames = pilot.formations.map((id) => {
      const found = DN_FORMATIONS.find((x) => x.id === id);
      return found ? (locale === "fr" ? found.fr : found.en) : id;
    });
  }

  return (
    <div
      onClick={() => onClick(pilot)}
      className="flex flex-col gap-2"
      style={{
        cursor: "pointer",
        width: compact ? 220 : "100%",
        flexShrink: 0,
      }}
    >
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          aspectRatio: compact ? "5 / 3" : "4 / 3",
          background: "linear-gradient(135deg, var(--color-lavender), var(--color-iris))",
          outline: active ? "2px solid var(--color-iris)" : "none",
          outlineOffset: active ? 2 : 0,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 m-auto"
          style={{
            width: "46%",
            height: "46%",
            backgroundImage: "url(/assets/symbol-paper.svg)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.55,
          }}
        />

        <div
          className="absolute left-2 top-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-[family-name:var(--font-display)] text-[9.5px] font-semibold"
          style={{
            background: isPro ? "var(--color-ink)" : "#fff",
            color: isPro ? "var(--color-lime)" : "var(--color-ink)",
            boxShadow: "0 2px 6px rgba(10,11,14,0.18)",
          }}
        >
          {isPro ? (
            <Icon name="award" size={10} stroke="var(--color-lime)" strokeWidth={2.4} />
          ) : (
            <Icon name="check" size={10} stroke="var(--color-sap-700)" strokeWidth={3} />
          )}
          {isPro ? t("Pro", "Pro") : t("Vérifié", "Verified")}
        </div>

        <button
          type="button"
          aria-label={t("Favori", "Favourite")}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            setFav((v) => !v);
          }}
          className="absolute right-1.5 top-1.5 flex h-[30px] w-[30px] cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <Icon
            name="heart"
            size={18}
            stroke="#fff"
            strokeWidth={2.2}
            style={{
              fill: fav ? "var(--color-iris)" : "rgba(10,11,14,0.45)",
              transition: "fill .15s",
            }}
          />
        </button>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex items-baseline justify-between gap-1.5">
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-semibold leading-snug text-ink"
          >
            {pilot.name}
          </div>
          {!compact && (
            <div
              className="flex-shrink-0 font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[.13em]"
              style={{ color: "var(--fg3)" }}
            >
              {locale === "fr" ? k.fr : k.en}
            </div>
          )}
        </div>
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-body)] text-[12.5px] leading-snug"
          style={{ color: "var(--fg2)" }}
        >
          {pilot.city}
        </div>
        {!compact && taxonomyNames.length > 0 && (
          <div
            className="mt-px overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-body)] text-xs leading-snug"
            style={{ color: "var(--fg3)" }}
          >
            {taxonomyNames.join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
