import type { PilotProfile } from "@/types/pilot";

/**
 * Drone Network — pilot data adapter.
 *
 * Today: returns mock pilots so we can build the UI without WordPress.
 * Tomorrow: swap the body of getPilots() for a fetch call to the WP REST endpoint.
 *
 * The mock and the API must return the SAME shape. The contract is in
 * src/types/pilot.ts. If you change the contract here, update the type and
 * notify whoever is building the WordPress side.
 */

const MOCK_PILOTS: PilotProfile[] = [
  // Ported from design-system/ui_kits/marketplace/data.jsx — the validated demo set.
  // More entries get added as we port the prototype components.
  {
    id: 1,
    slug: "aero-beauce",
    kind: "pilot",
    name: "Aéro Beauce",
    city: "Saint-Georges, QC",
    postal: "G5Y",
    province: "QC",
    lat: 46.1255,
    lng: -70.6647,
    description: {
      fr: "Spécialiste de l'épandage agricole par drone BVLOS dans la Beauce.",
      en: "BVLOS agricultural spraying specialist in Beauce.",
    },
    bio: {
      fr: "Relevés agricoles et cartographie de précision pour les fermes de la Beauce. Spécialisé en épandage par drone de classe 25 kg+.",
      en: "Precision agriculture surveys and mapping for Beauce farms. Specialized in 25 kg+ drone spraying.",
    },
    gallery: [],
    annees_experience: 7,
    langues: ["FR", "EN"],
    specs: ["agri-precision", "foresterie"],
    livrables: ["ortho", "carto-precision", "epandage"],
    payloads: ["multi", "sprayer", "rtk"],
    type_licence: "BVLOS",
    licence_file_url: "/mock/licence-aerobeauce.pdf",
    assurance: true,
    autres_certs: "Opérations à proximité de personnes (TC-OPP)",
    drones: ["DJI Agras T40", "DJI Mavic 3 Multispectral"],
    email: "contact@aerobeauce.ca",
    phone: "418 555-0142",
    site_web: "https://aerobeauce.ca",
    instagram: "aerobeauce",
    linkedin: "aero-beauce",
    avis_google_url: "https://www.google.com/maps/place/aero-beauce",
    plan_abonnement: "Pro",
    status: "Approuvé",
    badge_pro: true,
    date_inscription: "2026-06-01",
    pro: true,
    verified: true,
  },
];

/**
 * Returns every approved + active pilot for the map.
 * Calls the WP REST endpoint in production; returns mocks in dev until WP is ready.
 */
export async function getPilots(): Promise<PilotProfile[]> {
  // TODO: when WordPress is ready, replace with:
  //   const res = await fetch(`${process.env.WP_API_URL}/dn/v1/pilots`, {
  //     next: { revalidate: 60 },
  //   });
  //   if (!res.ok) throw new Error(`WP /dn/v1/pilots returned ${res.status}`);
  //   return res.json();
  return MOCK_PILOTS;
}

/** Returns a single pilot by slug, or null if not found. */
export async function getPilotBySlug(slug: string): Promise<PilotProfile | null> {
  const pilots = await getPilots();
  return pilots.find((p) => p.slug === slug) ?? null;
}
