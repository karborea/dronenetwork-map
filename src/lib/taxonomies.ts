/**
 * Drone Network — taxonomies.
 *
 * Bilingual lists for specialties, deliverables, payloads, services, training,
 * and member-type filters. The IDs in each list match the union types in
 * src/types/pilot.ts.
 *
 * If you add or remove a value here, update:
 *   - the matching union type in src/types/pilot.ts
 *   - champs-profils.csv at the project root (the source of truth Annie-Pier
 *     validates)
 */

import type {
  DeliverableId,
  FormationId,
  PayloadId,
  ServiceId,
  SpecialtyId,
} from "@/types/pilot";

export interface TaxonomyEntry<TId extends string = string> {
  id: TId;
  fr: string;
  en: string;
}

// Official specialty list (validated by Annie-Pier, June 2026)
export const DN_SPECIALTIES: TaxonomyEntry<SpecialtyId>[] = [
  { id: "agri-precision", fr: "Agriculture de précision",       en: "Precision agriculture" },
  { id: "arpentage",      fr: "Arpentage",                      en: "Surveying" },
  { id: "carto-3d",       fr: "Cartographie 3D",                en: "3D mapping" },
  { id: "construction",   fr: "Construction et topographie",    en: "Construction & topography" },
  { id: "environnement",  fr: "Environnement et recherche",     en: "Environment & research" },
  { id: "foresterie",     fr: "Foresterie",                     en: "Forestry" },
  { id: "flotte",         fr: "Gestion de flotte & logistique", en: "Fleet management & logistics" },
  { id: "inspection",     fr: "Inspection et industrie",        en: "Inspection & industry" },
  { id: "lavage",         fr: "Lavage industriel",              en: "Industrial cleaning" },
  { id: "photo-video",    fr: "Photo / Vidéo / Marketing",      en: "Photo / Video / Marketing" },
  { id: "securite",       fr: "Sécurité et urgence",            en: "Safety & emergency" },
  { id: "autres",         fr: "Autres",                         en: "Other" },
];

export const DN_LIVRABLES: TaxonomyEntry<DeliverableId>[] = [
  { id: "ortho",            fr: "Orthomosaïque",            en: "Orthomosaic" },
  { id: "modele3d",         fr: "Modèle 3D",                en: "3D model" },
  { id: "video",            fr: "Vidéo aérienne",           en: "Aerial video" },
  { id: "photo",            fr: "Photographie aérienne",    en: "Aerial photography" },
  { id: "thermique",        fr: "Inspection thermique",     en: "Thermal inspection" },
  { id: "carto-precision",  fr: "Cartographie de précision", en: "Precision mapping" },
  { id: "chantier",         fr: "Suivi de chantier",        en: "Construction monitoring" },
  { id: "topo",             fr: "Étude topographique",      en: "Topographic survey" },
  { id: "epandage",         fr: "Épandage agricole",        en: "Agricultural spraying" },
];

export const DN_PAYLOADS: TaxonomyEntry<PayloadId>[] = [
  { id: "rgb",     fr: "Caméra RGB",              en: "RGB camera" },
  { id: "multi",   fr: "Caméra multispectrale",   en: "Multispectral camera" },
  { id: "thermal", fr: "Caméra thermique",        en: "Thermal camera" },
  { id: "lidar",   fr: "LiDAR",                   en: "LiDAR" },
  { id: "sprayer", fr: "Module de pulvérisation", en: "Spraying module" },
  { id: "rtk",     fr: "Capteur RTK",             en: "RTK sensor" },
];

export const DN_SERVICES: TaxonomyEntry<ServiceId>[] = [
  { id: "vente",      fr: "Vente",      en: "Sales" },
  { id: "reparation", fr: "Réparation", en: "Repair" },
  { id: "location",   fr: "Location",   en: "Rental" },
  { id: "formation",  fr: "Formation",  en: "Training" },
  { id: "pieces",     fr: "Pièces",     en: "Parts" },
];

export const DN_FORMATIONS: TaxonomyEntry<FormationId>[] = [
  { id: "base",        fr: "Pilotage de base",         en: "Basic piloting" },
  { id: "avance",      fr: "Pilotage avancé",          en: "Advanced piloting" },
  { id: "examen",      fr: "Préparation examen TC",    en: "TC exam prep" },
  { id: "specialisee", fr: "Spécialisée",              en: "Specialized" },
];

export type MemberTypeId = "all" | "recreatif" | "pro" | "shop" | "school";

export const DN_MEMBER_TYPES: TaxonomyEntry<MemberTypeId>[] = [
  { id: "all",       fr: "Tous",               en: "All" },
  { id: "recreatif", fr: "Pilotes récréatifs", en: "Recreational pilots" },
  { id: "pro",       fr: "Pilotes Pro",        en: "Pro pilots" },
  { id: "shop",      fr: "Boutiques",          en: "Shops" },
  { id: "school",    fr: "Écoles",             en: "Schools" },
];

export const DN_KIND_LABEL = {
  pilot:  { fr: "Pilote",   en: "Pilot",  icon: "pin" },
  shop:   { fr: "Boutique", en: "Shop",   icon: "building" },
  school: { fr: "École",    en: "School", icon: "graduation" },
} as const;
