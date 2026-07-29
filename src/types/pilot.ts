/**
 * Drone Network — pilot profile schema.
 *
 * The exact shape returned by `GET /wp-json/dn/v1/pilots` (when WordPress is wired up).
 * Mirrors `champs-profils.csv` (validated by Annie-Pier).
 *
 * Any change here must be reflected in:
 *   - the CSV at /Users/martin/Desktop/drone-network/champs-profils.csv
 *   - the WP custom endpoint (when built)
 *   - the mock data at src/lib/pilots.ts
 */

export type MemberKind = "pilot" | "shop" | "school";

export type LicenceType = "Base" | "Avancée" | "BVLOS" | "Instructeur";

export type SubscriptionTier = "Récréatif" | "Pro";

export type ApprovalStatus = "En attente" | "Approuvé" | "Refusé" | "Suspendu";

export type SpecialtyId =
  | "agri-precision"
  | "arpentage"
  | "carto-3d"
  | "construction"
  | "environnement"
  | "foresterie"
  | "flotte"
  | "inspection"
  | "lavage"
  | "photo-video"
  | "securite"
  | "droneshow"
  | "fpv"
  | "autres";

export type DeliverableId =
  | "ortho"
  | "modele3d"
  | "video"
  | "photo"
  | "thermique"
  | "carto-precision"
  | "chantier"
  | "topo"
  | "epandage";

export type PayloadId = "rgb" | "multi" | "thermal" | "lidar" | "sprayer" | "rtk";

export type ServiceId = "vente" | "reparation" | "location" | "formation" | "pieces";

export type FormationId = "base" | "avance" | "examen" | "specialisee";

export type Language = "FR" | "EN" | "ES" | (string & {});

export interface Localized {
  fr: string;
  en?: string;
}

/** Public profile shape — what the carte renders. */
export interface PilotProfile {
  // Identity
  id: number;
  slug: string;
  kind: MemberKind;
  name: string;
  photo_url?: string | null;

  // Location
  city: string;
  postal: string;
  province: string;
  adresse?: string | null;
  lat: number;
  lng: number;

  // Profile
  description: Localized;
  bio: Localized;
  gallery: string[];
  annees_experience?: number | null;
  langues: Language[];

  // Specialties (kind-specific)
  specs?: SpecialtyId[];
  livrables?: DeliverableId[];
  payloads?: PayloadId[];
  services?: ServiceId[];
  marques?: string[];
  formations?: FormationId[];
  formations_tc?: boolean;

  // Certifications (pilots only)
  type_licence?: LicenceType;
  licence_file_url?: string | null;
  assurance?: boolean;
  autres_certs?: string | null;

  // Equipment (pilots only)
  drones?: string[];

  // Contact (public)
  email: string;
  phone: string;

  // Links
  site_web?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  facebook?: string | null;
  avis_google_url?: string | null;

  // Platform meta
  plan_abonnement: SubscriptionTier;
  status: ApprovalStatus;
  badge_pro: boolean;
  date_inscription: string;

  // Derived (computed at the API layer or client-side)
  pro: boolean;
  verified: boolean;
}
