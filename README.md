# Culture SZN

The home of a Nairobi music-and-design collective — XiiX, Wavy SRF, Pipí Ciagi. Every release findable and playable in one tap, built for mid-range Android over metered data.

- **Product truth:** [`PRODUCT.md`](./PRODUCT.md)
- **Visual world:** [`DESIGN.md`](./DESIGN.md) (Nganya Livery — chosen in the [direction round](./docs/design/direction-round.md))
- **What the team still needs to supply:** [`docs/ASSETS-NEEDED.md`](./docs/ASSETS-NEEDED.md)
- **Publishing a SZNal:** [`docs/CONTENT-GUIDE.md`](./docs/CONTENT-GUIDE.md)
- **Launch checklist:** [`docs/LAUNCH.md`](./docs/LAUNCH.md)

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # vitest: data honesty, link integrity, every surface
npm run build        # tsc -b → vite build → per-route <head> prerender (scripts/prerender.mjs)
npm run check:size   # fails when the largest JS chunk exceeds the gzip budget
npm run lint
npm run preview      # serve dist/
```

The newsletter endpoint (`api/newsletter/subscribe`) is a Vercel function and does not run under `npm run dev`; use `vercel dev` to exercise it locally. Everything else is static.

## Stack

React 19 · TypeScript (strict) · Vite 7 · Tailwind CSS 4 · Framer Motion (three moves, see `src/lib/motion.ts`) · React Router 7 · MDX journal · Vercel (static + one serverless function) · Vitest + Testing Library.

## How data flows

| Source | Where | How it reaches the site |
|---|---|---|
| Artist profiles | `src/data/artists/*.json`, `*Profile.ts` | Lightweight index in `summaries.ts` (hand-maintained, test-guarded); full profile loads per artist on demand |
| Releases | `src/data/releases.ts` | Merged with the Spotify catalog by `src/lib/catalog.ts` |
| Spotify catalog | `src/data/generated/spotify-catalog.json` | `.github/workflows/sync-spotify.yml` runs `scripts/sync-spotify.mjs` daily (06:00 Nairobi) with client credentials and commits changes. Sources in `src/data/spotify-sources.json` |
| Journal | `content/sznals/*.mdx` | `src/content/sznals.ts` reads `meta` eagerly, bodies lazily |
| Site facts | `src/config/site.ts` | WhatsApp URL, verified socials, playlist ids — empty until supplied, and the UI hides what is empty |

Playback is Spotify Embed and YouTube behind click-to-load facades (`src/components/media/`). No third-party iframe loads before a tap. No user login.

## Environment

| Variable | Where | Purpose |
|---|---|---|
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | GitHub repo secrets | Catalog sync workflow |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` | Vercel project env | Newsletter subscribe function |

Never prefix a secret with `VITE_`. See `.env.example`.

## Structure

```
api/newsletter/        Resend-backed subscribe (Vercel function)
content/sznals/        Journal articles (MDX)
public/fonts/          Self-hosted subset faces (LICENSES.md)
scripts/               sync-spotify, prerender, bundle-size gate, mdx-meta plugin
src/components/        layout · sections · media · shared · artist · releases · journal · ui
src/pages/             Home, Artists, Artist, Releases, Release, SZNals, SZNal, Join, NotFound
src/styles/            tokens.css (role tokens), fonts.css
src/entry-seo.ts       Route metadata for the prerendered <head>
```

---

Built in Nairobi. Crafted by [VOYANI](https://voyani.tech) for the Culture SZN team.
