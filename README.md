# Drone Network — La carte

Application Next.js du marketplace Drone Network. Carte interactive du Canada
qui affiche pilotes, boutiques et écoles de drones. Les données viennent de
WordPress (source de vérité), la carte les rend.

## Stack

- **Next.js 16** (App Router) + **TypeScript** strict
- **Tailwind CSS 4** — design tokens dans `src/app/globals.css`
- **Leaflet** + **leaflet.markercluster** pour la carte
- **next/font/local** pour Chakra Petch (display) et Aeonik Pro (body)
- Déployé sur **Vercel**

## Commandes

```bash
npm install
npm run dev      # serveur de développement (http://localhost:3000)
npm run build    # build de production
npm run start    # serveur de production (après build)
npm run lint     # lint
```

Le projet utilise Turbopack par défaut.

## Structure

```
src/
├── app/
│   ├── globals.css       # design tokens (couleurs, fonts, radii, shadows)
│   ├── layout.tsx        # layout racine + fonts via next/font/local
│   └── page.tsx          # placeholder en attendant le port du prototype
├── components/           # composants UI (à venir)
│   └── mobile/           # composants mobile-spécifiques
├── lib/
│   ├── i18n.ts           # helper FR/EN
│   └── pilots.ts         # data adapter (mock pour l'instant, WP plus tard)
└── types/
    └── pilot.ts          # schéma de profil — contrat avec l'API WordPress
```

## La couche de données

Aujourd'hui, `src/lib/pilots.ts` retourne des pilotes factices. Quand
WordPress sera prêt, on remplace le corps de `getPilots()` par un `fetch` vers
`/wp-json/dn/v1/pilots`. **La forme du JSON est fixée dans
`src/types/pilot.ts`** — c'est le contrat que la version WP devra respecter.

Toute modification du schéma doit être propagée:

1. `src/types/pilot.ts` (ce repo)
2. `champs-profils.csv` (à la racine du projet drone-network)
3. L'endpoint custom du WordPress (quand il sera construit)

## Brand foundations

- Fonts dans `public/fonts/` — Chakra Petch (display) et Aeonik Pro (body)
- Assets brand dans `public/assets/` — logos wordmark et symboles propeller
- Tokens couleurs définis dans `globals.css` sous `@theme` — utilisables comme
  classes Tailwind (`bg-iris`, `text-lime-700`, etc.)

Source de vérité visuelle: `design-system/` à la racine du projet
drone-network. Le prototype interactif est dans
`design-system/ui_kits/marketplace/`.

## Roadmap immédiate

- [ ] Porter les composants du prototype (Header, FilterBar, MapCanvas,
      ResultCard, ProfilePanel, MobileBottomSheet) en `.tsx` typés
- [ ] Charger les 8 pilotes de démo dans `MOCK_PILOTS`
- [ ] Routes `/pilotes/[slug]` SSG avec ISR
- [ ] Bilingue FR/EN avec hreflang
- [ ] Brancher la carte sur WordPress quand l'endpoint sera prêt
- [ ] Brancher Twilio pour les SMS "Me joindre"
