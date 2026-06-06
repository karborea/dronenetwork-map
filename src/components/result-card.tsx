"use client";

import { useState } from "react";
import { Icon } from "./icon";
import {
  DN_FORMATIONS,
  DN_KIND_LABEL,
  DN_SERVICES,
  DN_SPECIALTIES,
} from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { PilotProfile } from "@/types/pilot";

interface ResultCardProps {
  pilot: PilotProfile;
  active: boolean;
  onClick: (pilot: PilotProfile) => void;
  locale: Locale;
}

/**
 * Airbnb-style listing card. Cover image with gradient + symbol overlay,
 * "Verified Pro" or "Verified member" pill top-left, favourite heart
 * top-right, text block below (name · kind · city · taxonomy list).
 *
 * The card has no outer border — relies on whitespace between cards in the
 * grid. The active state (when a pin or this card is selected) shows a 2px
 * iris outline around the image.
 */
export function ResultCard({ pilot, active, onClick, locale }: ResultCardProps) {
  const [hover, setHover] = useState(false);
  const [fav, setFav] = useState(false);
  const k = DN_KIND_LABEL[pilot.kind];
  const isPro = !!pilot.pro;
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  // Pick the right taxonomy for this kind to render under the city line
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex cursor-pointer flex-col gap-2.5"
    >
      {/* Cover */}
      <div
        className="relative overflow-hidden rounded-[14px]"
        style={{
          aspectRatio: "4 / 3",
          background: "linear-gradient(135deg, var(--color-lavender), var(--color-iris))",
          outline: active ? "2px solid var(--color-iris)" : "none",
          outlineOffset: active ? 2 : 0,
        }}
      >
        {/* Symbol watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 m-auto"
          style={{
            width: "50%",
            height: "50%",
            backgroundImage: "url(/assets/symbol-paper.svg)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.55,
            transition: "transform .35s ease",
            transform: hover ? "scale(1.05) rotate(2deg)" : "none",
          }}
        />

        {/* Badge top-left */}
        <div
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-[family-name:var(--font-display)] text-[11px] font-semibold"
          style={{
            background: isPro ? "var(--color-ink)" : "#fff",
            color: isPro ? "var(--color-lime)" : "var(--color-ink)",
            boxShadow: "0 2px 6px rgba(10,11,14,0.18)",
          }}
        >
          {isPro ? (
            <Icon name="award" size={12} stroke="var(--color-lime)" strokeWidth={2.4} />
          ) : (
            <Icon name="check" size={12} stroke="var(--color-sap-700)" strokeWidth={3} />
          )}
          {isPro ? t("Pro vérifié", "Verified Pro") : t("Membre vérifié", "Verified member")}
        </div>

        {/* Heart top-right */}
        <button
          type="button"
          aria-label={t("Favori", "Favourite")}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            setFav((v) => !v);
          }}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent p-0"
        >
          <Icon
            name="heart"
            size={22}
            stroke="#fff"
            strokeWidth={2.2}
            style={{
              fill: fav ? "var(--color-iris)" : "rgba(10,11,14,0.45)",
              transition: "fill .15s",
            }}
          />
        </button>
      </div>

      {/* Text block */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-snug text-ink"
            style={{ letterSpacing: "0.005em" }}
          >
            {pilot.name}
          </div>
          <div
            className="flex-shrink-0 font-[family-name:var(--font-display)] text-[10.5px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--fg3)" }}
          >
            {locale === "fr" ? k.fr : k.en}
          </div>
        </div>
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-body)] text-[13px] leading-snug"
          style={{ color: "var(--fg2)" }}
        >
          {pilot.city}
        </div>
        {taxonomyNames.length > 0 && (
          <div
            className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-[family-name:var(--font-body)] text-[12.5px] leading-snug"
            style={{ color: "var(--fg3)" }}
          >
            {taxonomyNames.join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
