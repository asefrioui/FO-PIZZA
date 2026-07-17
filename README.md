# FØ Pizza — site premium

Site vitrine et parcours de commande FØ Pizza, construit avec Vite et TypeScript strict.

## Commandes

Prérequis : Node.js 20.19+ et pnpm 11.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

Le build déployable est généré dans `dist/`.

## Architecture

- `src/data/` : produits, restaurants et configuration des ingrédients.
- `src/components/` : navigation, commande, carte et comptoir d’inspiration.
- `src/styles/` : design tokens, base, composants, sections et responsive.
- `src/lib/` : utilitaires DOM et formatage.
- `src/main.ts` : initialisation et chargement différé des expériences interactives.
- `assets/` : visuels locaux optimisés.

Le comptoir d’inspiration est isolé dans un chunk chargé uniquement à proximité de sa section. La structure HTML/CSS conserve les contenus essentiels sans JavaScript. Les polices Instrument Sans et Instrument Serif sont auto-hébergées afin de garantir un rendu cohérent des accents français.

## Qualité

Le projet impose :

- TypeScript strict avec vérifications supplémentaires ;
- ESLint avec règles TypeScript typées ;
- respect de `prefers-reduced-motion` ;
- validation du build de production ;
- contrôle visuel desktop et mobile.

## Hypothèses et validations client

- Les adresses, téléphones, prix et liens de commande proviennent du site officiel FØ Pizza.
- Les photos des restaurants proviennent de sa médiathèque.
- Le visuel héro est une création originale générée pour cette direction artistique.
- Les prix, horaires, services disponibles, textes légaux, visuels de présentation et données commerciales affichées (65 ingrédients, cuisson en deux minutes, prix à partir de 8,95 €) doivent être validés par le client avant publication.
- Une photographie propre au restaurant de Saclay et le logo officiel vectoriel restent à fournir pour une version définitive de marque.
