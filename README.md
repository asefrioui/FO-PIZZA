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
- `src/components/` : navigation, commande, carte, rituel narratif et studio 3D.
- `src/lib/` : utilitaires DOM et formatage.
- `src/main.ts` : initialisation et chargement différé des expériences interactives.
- `assets/` : visuels locaux optimisés.

Le rituel au scroll et le studio 3D sont isolés dans des chunks chargés uniquement à proximité de leur section. La structure HTML/CSS conserve un aperçu statique et les informations essentielles restent accessibles sans les interactions.

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
- Les prix, horaires, textes légaux, visuels de présentation et données de cuisson affichées (450 °C / environ deux minutes) doivent être validés par le client avant publication.
