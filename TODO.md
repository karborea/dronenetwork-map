# Drone Network — TODO

Notes vivantes pour le projet de la carte. Suit l'avancement et garde en
mémoire les décisions à revisiter.

## À revoir quand le sitemap WordPress sera arrêté

- **Items de navigation du Header** — actuellement codés en dur dans
  `src/components/header.tsx` (constante `NAV_ITEMS`). Aligner avec ce que
  Bricks Builder rendra côté WP dès que la liste finale est validée. Trois
  items pour l'instant: La carte / Spécialités / Devenir membre.

## Roadmap des composants à porter (du prototype vers production)

- [x] Icon system
- [x] Header (avec switch FR/EN + bouton S'inscrire)
- [ ] FilterBar (search + tabs membre + chips spécialités)
- [ ] ResultCard + ResultList (grille 2 colonnes Airbnb-style)
- [ ] MapCanvas avec Leaflet (pins teardrop, clustering, fitBounds)
- [ ] ProfilePanel (slide-in desktop, fullscreen mobile)
- [ ] Mobile bottom sheet
- [ ] RegisterModal
- [ ] TC Badge component

## Intégrations à brancher pour le launch

- [ ] Endpoint WP REST `/wp-json/dn/v1/pilots` (remplacer le mock dans
      `src/lib/pilots.ts`)
- [ ] Auth JWT cross-subdomain (cookie sur `.dronenetwork.ca`)
- [ ] Twilio pour les SMS quand un client clique "Me joindre"
- [ ] Endpoint serveur `/api/reveal-phone` qui déclenche le SMS
- [ ] Google Reviews via Places API (Phase 1.5 — pour MVP, lien externe
      seulement)
- [ ] Cookie consent banner Loi 25 du Québec
- [ ] Sentry (error tracking dès le premier déploiement client)
- [ ] GA4 (pas Microsoft Clarity — confirmé par Martin)

## Sous-domaine

- À configurer: `carte.dronenetwork.ca` pointe vers Vercel. Pour l'instant on
  utilise l'URL générée par Vercel (`dronenetwork-map-*.vercel.app`).

## Décisions reportées

- **Style custom de la carte** — Mapbox Studio pourrait donner une carte aux
  couleurs brand. Pour l'instant on utilise CARTO Dark Matter via Leaflet
  (gratuit, no token). À revoir si le rendu raster manque de fluidité en prod.
- **Vector tiles** — option pour passer à MapLibre GL JS + Protomaps si
  Leaflet raster devient une limite. Garde l'option ouverte.
- **Logo officiel Transport Canada** — utiliser un badge stylisé avec feuille
  d'érable rouge pour le moment. Demander l'autorisation FIP pour utiliser le
  vrai logo en production si Annie-Pier souhaite.
