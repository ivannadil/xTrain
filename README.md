# xTrain

Soccer training that fits your driveway. xTrain is an AI training app for players who train on their own: tell it what you have (a ball, a wall, cones, a goal, a friend, how many minutes) and it plans the session from the team's drill library, runs it drill by drill, and adjusts the next one from how this one felt.

This repo is the landing page. Live: https://xtrain-pi.vercel.app

The earlier React prototype of the app lives at the git tag `prototype-final`.

## Run it

```bash
npm run serve        # static preview at http://localhost:4321 (no build step)
vercel dev           # same, plus the /api/join signup function
```

Useful query strings: `?motion=off` shows every animated state at rest, `?kit=wall,cones&min=45` opens on a given setup.

## What's where

| Path | What |
|---|---|
| `public/index.html` | The page |
| `public/css/site.css` | All styles. Tokens at the top |
| `public/js/drills.js` | Drill data from the team's Drill Library and the demo session planner |
| `public/js/field.js` | Draws and animates any drill from data (cones, ball, wall, goal, routes) |
| `public/js/main.js` | Hero kit state, session lane, pinned session, too easy / too hard, drill strip, signup |
| `public/vendor/` | GSAP 3.15 with plugins, Lenis 1.3.26 (see `VERSIONS.md`) |
| `api/join.js` | Early-access signups, stored privately in Vercel Blob |
| `docs/BUILD-PROMPT.md` | The prompt the page was built from |
| `docs/research/` | Teardowns of the reference site, competitors, and 20 craft references |
| `PRODUCT.md`, `DESIGN.md` | Product truth and the design system |

## Signups

Each signup is one private JSON file in the project's Blob store. To export them:

```bash
vercel env pull .env.local
npm install
npm run signups > signups.csv
```

## Deploy

`vercel --prod` from the repo root (the Vercel project is `xtrain`).

## Credits

Type: Mona Sans (SIL Open Font License, `public/assets/fonts/OFL.txt`). Icons: Phosphor (MIT). Animation: GSAP (standard no-charge license), Lenis (MIT).
