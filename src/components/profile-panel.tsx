"use client";

import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import {
  DN_FORMATIONS,
  DN_KIND_LABEL,
  DN_LIVRABLES,
  DN_PAYLOADS,
  DN_SERVICES,
  DN_SPECIALTIES,
} from "@/lib/taxonomies";
import type { Locale } from "@/lib/i18n";
import type { LicenceType, PilotProfile } from "@/types/pilot";

interface ProfilePanelProps {
  pilot: PilotProfile;
  locale: Locale;
  onClose: () => void;
  mobile?: boolean;
}

// -------- Inline helpers --------

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-3.5 mt-7 font-[family-name:var(--font-display)] text-xs uppercase tracking-[.2em]"
      style={{ color: "var(--fg3)" }}
    >
      {children}
    </div>
  );
}

interface InfoRowProps {
  icon: IconName;
  label?: string;
  value: ReactNode;
  iconColor?: string;
}

function InfoRow({ icon, label, value, iconColor }: InfoRowProps) {
  if (value == null || value === "" || value === false) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon
        name={icon}
        size={18}
        stroke={iconColor || "var(--color-iris)"}
        style={{ marginTop: 1 }}
      />
      <div className="flex flex-col gap-px">
        {label && (
          <span
            className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
            style={{ color: "var(--fg3)" }}
          >
            {label}
          </span>
        )}
        <span
          className="font-[family-name:var(--font-body)] text-[14.5px]"
          style={{ color: "var(--fg1)" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function TCBadge({ label = "Transport Canada" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[.1em]"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border-strong)",
        color: "var(--color-ink)",
      }}
    >
      {/* Stylized maple leaf — not the official TC mark.
          Swap for the federal Canada wordmark if FIP authorization is granted. */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#D52B1E" aria-hidden="true">
        <path d="M12 2.2 l1.4 4.3 c.2.5.7.7 1.2.5 l2.5-1 -.6 2.9 c-.1.5.3 1 .9 1 l2.8 .1 -2 2 c-.4.4-.3 1 .1 1.3 l2.2 1.5 -3 1.1 c-.5.2-.7.7-.5 1.2 l1 2.5 -2.9-.4 c-.5-.1-1 .3-1 .8 l-.2 2.8 -2-2 c-.4-.4-1-.4-1.3 0 l-2 2 -.2-2.8 c0-.5-.5-.9-1-.8 l-2.9 .4 1-2.5 c.2-.5 0-1-.5-1.2 l-3-1.1 2.2-1.5 c.5-.3.5-.9.1-1.3 l-2-2 2.8-.1 c.6 0 1-.5 .9-1 l-.6-2.9 2.5 1 c.5.2 1 0 1.2-.5 z" />
      </svg>
      {label}
    </span>
  );
}

interface SocialButtonProps {
  name: IconName;
  href: string | null | undefined;
  label: string;
}

function SocialButton({ name, href, label }: SocialButtonProps) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-full border no-underline transition-colors duration-150 hover:bg-mist"
      style={{
        borderColor: "var(--border-strong)",
        background: "var(--surface)",
        color: "var(--color-ink)",
      }}
    >
      <Icon name={name} size={16} stroke="var(--color-ink)" />
    </a>
  );
}

// License type badge — different tone per cert level
function LicenceBadge({ type }: { type: LicenceType }) {
  let bg = "var(--color-iris-100)";
  let color = "var(--color-iris-700)";
  if (type === "Base") {
    bg = "var(--color-mist)";
    color = "var(--color-ink)";
  } else if (type === "BVLOS") {
    bg = "var(--color-lime)";
    color = "var(--color-sap-700)";
  } else if (type === "Instructeur") {
    bg = "var(--color-ink)";
    color = "var(--color-lime)";
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-[.1em]"
      style={{ background: bg, color }}
    >
      {type}
    </span>
  );
}

// -------- Chip rows --------

function ChipRow({ items, tone }: { items: string[]; tone: "iris" | "lime" | "mist" }) {
  const toneStyles: Record<"iris" | "lime" | "mist", { bg: string; color: string; border?: string }> = {
    iris: { bg: "var(--color-iris-100)", color: "var(--color-iris-700)" },
    lime: { bg: "var(--color-lime)", color: "var(--color-sap-700)" },
    mist: {
      bg: "var(--color-mist)",
      color: "var(--color-ink)",
      border: "1px solid var(--border-strong)",
    },
  };
  const s = toneStyles[tone];
  return (
    <div className="flex flex-wrap gap-[7px]">
      {items.map((n) => (
        <span
          key={n}
          className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[.08em]"
          style={{
            padding: "6px 12px",
            borderRadius: "var(--radius-pill)",
            background: s.bg,
            color: s.color,
            border: s.border,
          }}
        >
          {n}
        </span>
      ))}
    </div>
  );
}

// -------- Main panel --------

export function ProfilePanel({
  pilot,
  locale,
  onClose,
  mobile = false,
}: ProfilePanelProps) {
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);
  // State resets per-pilot via the `key` prop on the parent — see map-app.tsx
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [smsToast, setSmsToast] = useState(false);

  const k = DN_KIND_LABEL[pilot.kind];
  const isPro = !!pilot.pro;

  const lookup = <T extends string>(
    list: { id: T; fr: string; en: string }[],
    ids: T[] | undefined,
  ): string[] =>
    (ids ?? []).map((id) => {
      const found = list.find((x) => x.id === id);
      return found ? (locale === "fr" ? found.fr : found.en) : id;
    });

  const specNames = lookup(DN_SPECIALTIES, pilot.specs);
  const livrableNames = lookup(DN_LIVRABLES, pilot.livrables);
  const payloadNames = lookup(DN_PAYLOADS, pilot.payloads);
  const serviceNames = lookup(DN_SERVICES, pilot.services);
  const formationNames = lookup(DN_FORMATIONS, pilot.formations);

  const handleReveal = () => {
    setPhoneRevealed(true);
    setSmsToast(true);
    setTimeout(() => setSmsToast(false), 5200);
  };

  const insta = pilot.instagram ? `https://instagram.com/${pilot.instagram}` : null;
  const linked = pilot.linkedin ? `https://linkedin.com/in/${pilot.linkedin}` : null;
  const yt = pilot.youtube ? `https://youtube.com/@${pilot.youtube}` : null;
  const fb = pilot.facebook ? `https://facebook.com/${pilot.facebook}` : null;

  return (
    <div
      className="flex justify-end"
      style={{
        position: mobile ? "fixed" : "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: mobile ? 0 : "auto",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        className="relative h-full overflow-y-auto scrollbar-hidden"
        style={{
          width: mobile ? "100%" : 600,
          maxWidth: mobile ? "100%" : "92%",
          background: "var(--color-paper)",
          boxShadow: mobile ? "none" : "var(--shadow-lg)",
          pointerEvents: "auto",
        }}
      >
        {/* Cover */}
        <div
          className="relative"
          style={{
            height: 200,
            background: "linear-gradient(135deg, var(--color-lavender), var(--color-iris))",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Fermer", "Close")}
            className="absolute right-4 top-4 flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-none"
            style={{ background: "rgba(10,11,14,.4)" }}
          >
            <Icon name="x" size={18} stroke="#fff" />
          </button>
          <div
            aria-hidden="true"
            className="absolute right-8 top-8"
            style={{
              width: 70,
              height: 70,
              opacity: 0.55,
              backgroundImage: "url(/assets/symbol-paper.svg)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Avatar tile */}
          <div
            className="absolute left-7 flex items-center justify-center"
            style={{
              bottom: -34,
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "var(--color-onyx)",
              border: "4px solid var(--color-paper)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 38,
                height: 38,
                backgroundImage: `url(${isPro ? "/assets/symbol-lime.svg" : "/assets/symbol-paper.svg"})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
          {/* Pro / Verified badge */}
          <div className="absolute left-7 top-[18px]">
            {isPro ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.1em]"
                style={{ background: "var(--color-ink)", color: "var(--color-lime)" }}
              >
                <Icon name="award" size={11} stroke="var(--color-lime)" strokeWidth={2.4} />
                {t("Pro vérifié", "Verified Pro")}
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[.1em]"
                style={{ background: "var(--color-lime)", color: "var(--color-sap-700)" }}
              >
                <Icon name="check" size={11} stroke="var(--color-sap-700)" strokeWidth={3} />
                {t("Vérifié", "Verified")}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-7 pb-9 pt-12">
          {/* Header */}
          <h2 className="m-0 text-[32px] uppercase tracking-[-.01em] text-ink">{pilot.name}</h2>
          <div
            className="mt-1 flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[15px]"
            style={{ color: "var(--fg2)" }}
          >
            <Icon name={k.icon as IconName} size={15} stroke="var(--fg3)" />
            {locale === "fr" ? k.fr : k.en} · {pilot.city}
          </div>

          {/* Short description (tagline) */}
          {pilot.description?.[locale] && (
            <p
              className="mb-0 mt-[18px] max-w-[500px] font-[family-name:var(--font-display)] text-[17px] font-medium leading-[1.4] text-ink"
              style={{ letterSpacing: "-.005em" }}
            >
              {pilot.description[locale]}
            </p>
          )}

          {/* Full bio */}
          {pilot.bio?.[locale] && (
            <p
              className="mt-3 max-w-[500px] font-[family-name:var(--font-body)] text-[15.5px] leading-[1.6]"
              style={{ color: "var(--fg1)" }}
            >
              {pilot.bio[locale]}
            </p>
          )}

          {/* Pilot — specialties + livrables + payloads */}
          {pilot.kind === "pilot" && specNames.length > 0 && (
            <>
              <SectionLabel>{t("Spécialités", "Specialties")}</SectionLabel>
              <ChipRow items={specNames} tone="iris" />
            </>
          )}
          {pilot.kind === "pilot" && livrableNames.length > 0 && (
            <>
              <SectionLabel>{t("Livrables", "Deliverables")}</SectionLabel>
              <ChipRow items={livrableNames} tone="lime" />
            </>
          )}
          {pilot.kind === "pilot" && payloadNames.length > 0 && (
            <>
              <SectionLabel>{t("Payloads utilisés", "Payloads")}</SectionLabel>
              <ChipRow items={payloadNames} tone="mist" />
            </>
          )}

          {/* Shop — services + brands */}
          {pilot.kind === "shop" && serviceNames.length > 0 && (
            <>
              <SectionLabel>{t("Services offerts", "Services offered")}</SectionLabel>
              <ChipRow items={serviceNames} tone="iris" />
            </>
          )}
          {pilot.kind === "shop" && pilot.marques && pilot.marques.length > 0 && (
            <>
              <SectionLabel>{t("Marques distribuées", "Brands carried")}</SectionLabel>
              <ChipRow items={pilot.marques} tone="mist" />
            </>
          )}

          {/* School — formations + TC recognition */}
          {pilot.kind === "school" && formationNames.length > 0 && (
            <>
              <SectionLabel>{t("Types de formations", "Training types")}</SectionLabel>
              <ChipRow items={formationNames} tone="iris" />
              {pilot.formations_tc && (
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <TCBadge label={t("Formations reconnues", "Recognized training")} />
                  <span
                    className="font-[family-name:var(--font-body)] text-[13px]"
                    style={{ color: "var(--fg2)" }}
                  >
                    {t(
                      "Programme validé par Transport Canada",
                      "Program validated by Transport Canada",
                    )}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Gallery */}
          <SectionLabel>{t("Réalisations", "Work")}</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4/3",
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, var(--color-lavender), var(--color-iris))",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="absolute inset-0 m-auto"
                  style={{
                    width: "40%",
                    height: "40%",
                    backgroundImage: "url(/assets/symbol-paper.svg)",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.45,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Certifications (pilots only) */}
          {pilot.kind === "pilot" && (
            <>
              <SectionLabel>{t("Certifications", "Certifications")}</SectionLabel>
              <div className="flex flex-col gap-2.5">
                {/* TC license card */}
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: "12px 14px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Icon name="shield" size={20} stroke="var(--color-iris)" />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
                        style={{ color: "var(--fg3)" }}
                      >
                        {t("Licence", "License")}
                      </span>
                      <TCBadge />
                    </div>
                    <div className="mt-1 flex items-center gap-2.5">
                      {pilot.type_licence && <LicenceBadge type={pilot.type_licence} />}
                      {pilot.licence_file_url && (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(
                              t(
                                "Aperçu non disponible dans le prototype",
                                "Preview not available in prototype",
                              ),
                            );
                          }}
                          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] text-[11.5px] font-semibold uppercase tracking-[.04em] text-iris no-underline"
                        >
                          <Icon name="arrowUpRight" size={12} stroke="var(--color-iris)" />
                          {t("Voir la licence (PDF)", "View license (PDF)")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {pilot.assurance && (
                  <InfoRow
                    icon="shield"
                    label={t("Assurance", "Insurance")}
                    value={t(
                      "Responsabilité civile active",
                      "Active liability coverage",
                    )}
                    iconColor="var(--color-sap-700)"
                  />
                )}
                {pilot.autres_certs && (
                  <InfoRow
                    icon="award"
                    label={t("Autres certifications", "Other certifications")}
                    value={pilot.autres_certs}
                  />
                )}
              </div>
            </>
          )}

          {/* Equipment (pilots only) */}
          {pilot.kind === "pilot" && pilot.drones && pilot.drones.length > 0 && (
            <>
              <SectionLabel>{t("Équipement", "Equipment")}</SectionLabel>
              <div
                className="font-[family-name:var(--font-body)] text-[14.5px]"
                style={{ color: "var(--fg1)" }}
              >
                {pilot.drones.join(" · ")}
              </div>
            </>
          )}

          {/* Address (shop/school) */}
          {(pilot.kind === "shop" || pilot.kind === "school") && pilot.adresse && (
            <>
              <SectionLabel>{t("Adresse", "Address")}</SectionLabel>
              <div
                className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[14.5px]"
                style={{ color: "var(--fg1)" }}
              >
                <Icon name="pin" size={16} stroke="var(--color-iris)" />
                {pilot.adresse}
              </div>
            </>
          )}

          {/* About — experience + languages */}
          {(pilot.annees_experience != null ||
            (pilot.langues && pilot.langues.length > 0)) && (
            <>
              <SectionLabel>{t("À propos", "About")}</SectionLabel>
              <div className="flex flex-wrap gap-7">
                {pilot.annees_experience != null && (
                  <div>
                    <div className="font-[family-name:var(--font-display)] text-[28px] font-bold text-ink">
                      {pilot.annees_experience}
                    </div>
                    <div
                      className="-mt-0.5 font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
                      style={{ color: "var(--fg3)" }}
                    >
                      {t("Années d'expérience", "Years of experience")}
                    </div>
                  </div>
                )}
                {pilot.langues && pilot.langues.length > 0 && (
                  <div>
                    <div className="font-[family-name:var(--font-display)] text-[28px] font-bold text-ink">
                      {pilot.langues.join(" / ")}
                    </div>
                    <div
                      className="-mt-0.5 font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
                      style={{ color: "var(--fg3)" }}
                    >
                      {t("Langues parlées", "Languages spoken")}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Contact */}
          <SectionLabel>{t("Contact", "Contact")}</SectionLabel>
          <div
            className="flex flex-col gap-3.5"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 18,
            }}
          >
            {/* Email (always visible) */}
            <a
              href={`mailto:${pilot.email}`}
              className="flex items-center gap-3 no-underline transition-colors"
              style={{
                padding: "12px 14px",
                background: "var(--color-paper)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-ink)",
              }}
            >
              <Icon name="mail" size={18} stroke="var(--color-iris)" />
              <div className="flex-1">
                <div
                  className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
                  style={{ color: "var(--fg3)" }}
                >
                  {t("Courriel", "Email")}
                </div>
                <div
                  className="font-[family-name:var(--font-body)] text-[15px]"
                  style={{ color: "var(--color-ink)" }}
                >
                  {pilot.email}
                </div>
              </div>
              <Icon name="arrowUpRight" size={14} stroke="var(--fg3)" />
            </a>

            {/* Phone reveal */}
            {!phoneRevealed ? (
              <button
                type="button"
                onClick={handleReveal}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-iris px-6 py-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[.04em] text-white transition-colors hover:bg-iris-700"
              >
                <Icon name="phone" size={15} stroke="#fff" />
                {t("Me joindre — révéler le téléphone", "Contact me — reveal phone")}
              </button>
            ) : (
              <div
                className="flex items-center gap-3"
                style={{
                  padding: "12px 14px",
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-iris)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Icon name="phone" size={18} stroke="var(--color-iris)" />
                <div className="flex-1">
                  <div
                    className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
                    style={{ color: "var(--fg3)" }}
                  >
                    {t("Téléphone", "Phone")}
                  </div>
                  <a
                    href={`tel:${pilot.phone.replace(/[^0-9+]/g, "")}`}
                    className="font-[family-name:var(--font-body)] text-[17px] font-semibold no-underline"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {pilot.phone}
                  </a>
                </div>
              </div>
            )}

            {/* SMS toast */}
            {smsToast && (
              <div
                className="flex items-start gap-2.5"
                style={{
                  padding: "11px 14px",
                  background: "var(--color-lime)",
                  borderRadius: "var(--radius-md)",
                  animation: "dn-fade-in .25s ease",
                }}
              >
                <Icon
                  name="send"
                  size={16}
                  stroke="var(--color-sap-700)"
                  strokeWidth={2.4}
                  style={{ marginTop: 1 }}
                />
                <div>
                  <div
                    className="font-[family-name:var(--font-display)] text-[12.5px] font-semibold uppercase tracking-[.04em]"
                    style={{ color: "var(--color-sap-700)" }}
                  >
                    {t(`SMS envoyé à ${pilot.name}`, `SMS sent to ${pilot.name}`)}
                  </div>
                  <div
                    className="mt-0.5 font-[family-name:var(--font-body)] text-[13px]"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {t(
                      "Le pilote a été averti de votre appel.",
                      "The pilot has been notified of your call.",
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Socials + website */}
            {(pilot.site_web || insta || linked || yt || fb) && (
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <SocialButton name="globe" href={pilot.site_web} label={t("Site web", "Website")} />
                <SocialButton name="instagram" href={insta} label="Instagram" />
                <SocialButton name="linkedin" href={linked} label="LinkedIn" />
                <SocialButton name="youtube" href={yt} label="YouTube" />
                <SocialButton name="facebook" href={fb} label="Facebook" />
              </div>
            )}

            {/* Google Reviews — MVP link out. Places API integration deferred. */}
            {pilot.avis_google_url && (
              <a
                href={pilot.avis_google_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 no-underline transition-colors"
                style={{
                  padding: "11px 14px",
                  background: "var(--color-paper)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-ink)",
                }}
              >
                <Icon
                  name="star"
                  size={18}
                  stroke="var(--color-iris)"
                  strokeWidth={2}
                  style={{ fill: "var(--color-lime)" }}
                />
                <div className="flex-1">
                  <div
                    className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[.14em]"
                    style={{ color: "var(--fg3)" }}
                  >
                    {t("Avis Google", "Google reviews")}
                  </div>
                  <div
                    className="mt-px font-[family-name:var(--font-body)] text-[13.5px]"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {t("Voir les avis sur Google Maps", "See reviews on Google Maps")}
                  </div>
                </div>
                <Icon name="arrowUpRight" size={14} stroke="var(--fg3)" />
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes dn-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
