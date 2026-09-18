# Culture SZN — World-Class Rebuild & UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Phase 3 additionally REQUIRES the `impeccable:impeccable` skill — its tasks name the exact reference file and script to run.

**Goal:** Turn Culture SZN from an undeployable, Spotify-Premium-centred template into a fast, secure, authentically African, world-class site for Nairobi's creatives — artists, releases, journal, and a real "Join SZN" — that works on mid-range Android over metered data.

**Architecture:** Five phases, each independently shippable. Phase 0 makes the repo buildable and testable. Phase 1 deletes the broken Spotify auth/player layer and all dead code (the security findings are closed by deletion, not repair). Phase 2 builds the honest data layer: a scheduled Spotify catalog sync committed as static JSON, an MDX journal, a real newsletter endpoint, and a single platform registry. Phase 3 is the impeccable UI revamp — a seeded direction round with the user, a direction contract, every surface rebuilt in the chosen world, a finish review, and DESIGN.md. Phase 4 attacks payload and sharing (lazy routes, image transforms, self-hosted fonts, per-route prerendered `<head>` so WhatsApp previews work).

**Tech Stack:** React 19, TypeScript 5.9 strict, Vite 7, Tailwind CSS 4, Framer Motion 12, React Router 7, Vercel serverless (Node 22), Vitest + Testing Library, `@mdx-js/rollup`, Resend (newsletter), GitHub Actions (CI + Spotify sync cron).

**Spec:** This document. The sections [Scope Decisions](#scope-decisions-confirmed-2026-09-18), [Market Constraints](#market-constraints), [Findings Baseline](#findings-baseline) and [Information Architecture](#information-architecture) are the spec the tasks argue from. It supersedes `roadmaplatest.md` (2026-08-31), whose Phase 0 is carried forward here with amendments and whose Phases 1–2 (repairing OAuth and the Premium player) are withdrawn.

## Global Constraints

Every task's requirements implicitly include this section.

- **Node 22.x** locally and on Vercel. No APIs newer than Node 22 LTS.
- **TypeScript strict stays on** (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`). Never widen to `any` to silence an error.
- **`npm run build` must exit 0 after every task** from Task 4 onward. A task that leaves the build red is not done.
- **No new runtime dependencies** without an explicit line item in the task. Dev/build tooling may be added as `devDependencies`. Every byte shipped to a metered-data audience must earn its place.
- **Bundle budget** (`npm run check:size`): largest initial JS chunk ≤ **210 KB gzip** from Task 4, lowered to **120 KB** in Task 28 and **100 KB** in Task 30.
- **Path alias:** `@/...` inside `src/`. Code in `api/` and `scripts/` must **never** import from `src/`.
- **Secrets:** nothing read via `import.meta.env.VITE_*` may ever be a secret. Server secrets (`SPOTIFY_CLIENT_SECRET`, `RESEND_API_KEY`) are read only in `api/` and `scripts/`.
- **No fabricated facts.** No invented stats, testimonials, follower counts, fake streaming URLs, or stock photos presented as members. Missing content renders an honest state or is omitted; `docs/ASSETS-NEEDED.md` lists what the team must supply.
- **No dead ends.** Every rendered internal link resolves to a route (enforced by the link-integrity test from Task 9). Every button does something.
- **Locale:** user-facing dates use `en-KE`, time zone `Africa/Nairobi`. Money is KES. Never hardcode `en-US` in new code.
- **Copy rules:** the collective is `Culture SZN` (two words, SZN capitalised). The artist is `XiiX`. Journal entries are `SZNals`. Do not "correct" these.
- **Accessibility floor:** every interactive element ≥ 44×44 px, visible focus ring, `prefers-reduced-motion` respected, colour contrast ≥ 4.5:1 for body text, landmarks (`header`, `main`, `nav`, `footer`) on every page.
- **Commit after every task** with Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `test:`, `chore:`, `design:`), ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

---

## Scope Decisions (confirmed 2026-09-18)

| # | Decision | Consequence |
|---|----------|-------------|
| **D1** | Product scope = **Artists + Releases + Journal (SZNals) + Join SZN**. Events, Merch, Live Sessions, Archives, Hub, Collaborate are **out**. | Footer/nav link only to surfaces that exist. |
| **D2** | **Join SZN = WhatsApp community link + email newsletter.** | `/join` page; newsletter via Resend behind `api/newsletter/subscribe`; WhatsApp CTA rendered only when a URL is configured. |
| **D3** | **Spotify = Embed player + server-side catalog sync. No user login, no Web Playback SDK.** | Delete all OAuth, encryption, session, player code. A scheduled script pulls artist discographies and curated Culture SZN playlists into committed JSON. Playback = Spotify Embed (click-to-load) with YouTube click-to-play as the always-works surface. |
| **D4** | **No brand direction exists.** Target: *authentic African, world-class.* | Phase 3 runs impeccable's direction round with the user; no colours/fonts are chosen in this plan. |
| **D5** | **Very few real assets.** Placeholders allowed for now; the need is documented. | Placeholders must be labelled/typographic, never stock photos posing as members. `docs/ASSETS-NEEDED.md` is a deliverable. |
| **D6** | **Foundations first, then revamp.** | Phases 0–2 before Phase 3. |
| **D7** | **Newsletter provider = Resend** (Audiences + Contacts API, no SDK — plain `fetch`). Assumed; confirm with the user before Task 14. | |
| **D8** | **Journal = MDX in the repo** (no CMS). Assumed; confirm before Task 13. | Articles are `content/sznals/*.mdx`, code-split per article. |

## Market Constraints

Design decisions, not statistics — implement as stated.

- **C1 — Mid-range Android over metered mobile data.** Payload is a user-cost problem. Hard bundle gate; click-to-load for every third-party embed; Cloudinary `f_auto,q_auto,w_` transforms; self-hosted subset fonts.
- **C2 — Spotify is not the primary listening surface** and Premium is rare. The core experience never depends on Spotify.
- **C3 — YouTube is the default music surface.** A release without a YouTube link is a release most visitors cannot play. YouTube loads behind a facade.
- **C4 — WhatsApp and Instagram are the share channels.** WhatsApp share is the primary share action; every artist/release page must produce a correct WhatsApp link preview (per-route OG meta — Task 29).
- **C5 — Connections drop mid-session.** Static-first data; nothing waits on a network call to render.
- **C6 — Nothing may be a dead end.**

## Findings Baseline

Verified 2026-09-18 against `npx tsc -b` and a file-by-file read. Nothing from the 2026-08-31 audit has been fixed.

| ID | Sev | Finding | Closed by |
|----|-----|---------|-----------|
| F1 | Critical | `npm run build` fails: 24 TS errors in `pipiProfile.ts`, `wavyProfile.ts`, `sync.ts`, `releases.ts`, `client.ts`, `enhanced-client.ts`, `latest-releases.ts`, `performance.ts` | T2, T3, T5 |
| F2 | Critical | Token encryption discards IV; decryption impossible | T5 (deleted) |
| F3 | Critical | OAuth `state` never validated (login CSRF) | T5 (deleted) |
| F4 | Critical | XSS via raw interpolation in `auth/callback.ts` | T5 (deleted) |
| F5 | Critical | Client secret read via `VITE_SPOTIFY_CLIENT_SECRET` in browser code | T3 (deleted) |
| F6 | High | `/api/spotify/latest-releases` imports browser code → 500 → permanent "Offline" | T5 (deleted), T10–11 replace |
| F7 | High | Node `fs`/`path` bundled for browser | T3 |
| F8 | High | Multiple `Spotify.Player` instances | T5 (deleted) |
| F9 | High | No way to connect Spotify | moot (D3) |
| F10 | Medium | ~4,500 lines never rendered | T7 |
| F11 | Medium | 7 dead footer routes, SZNal cards 404, 3 inert buttons | T9, T13, T15 |
| F12 | Medium | `EnrichedRelease` defined 4× | T11 |
| F13 | Medium | `parseCookies`/`decryptToken` copy-pasted ×5 | T5 (deleted) |
| F14 | Medium | 4 duplicated platform-config maps | T12 |
| F15 | Medium | Undefined Tailwind colours | T7 (files deleted), T18 |
| F16 | Medium | `useDocumentHead` re-adds head tags every render | T8 |
| F17 | Medium | One 690 KB chunk; production `console.log` noise | T28 |
| F18 | Medium | `/v1/recommendations` deprecated | T5 (deleted) |
| F19 | Medium | Fabricated data: fake Spotify URLs, 12 Unsplash placeholders, hardcoded stats (5/35/3, 12/6/50K) | T8 |
| F20 | Medium | `.gitignore` ignores `*.md` | T1 |
| F21 | Medium | Serverless singletons with `setInterval` | T3 |
| F22 | High | `api/` type-checked by nothing; `@vercel/node` not installed at root; stray `api/package.json` | T6 |
| F23 | High | Zero tests, no CI | T1 |
| **F24** | Medium | Newsletter form fakes success (1 s timer, "Welcome 🎉") — sends nothing | T14, T15 |
| **F25** | Medium | Footer socials (`instagram.com/cultureszn` etc.) unverified; `SITE_CONFIG.image: '/og-image.jpg'` does not exist in `public/` | T8, T29, ASSETS-NEEDED |
| **F26** | Medium | Dates rendered `en-US` (`SZNalCard`, `utils.formatDate`) | T8 |
| **F27** | Medium | Hero background is an Unsplash stock photo; identity is a generic gradient-on-black template | Phase 3 |
| **F28** | Medium | No `prefers-reduced-motion` handling; `ANIMATION_CONFIG.reducedMotion` hardcoded `false` | T25 |
| **F29** | Low | Google Fonts loaded from third-party origin (2 extra connections, ~100 KB) | T18 |
| **F30** | Low | Header "Join SZN" button has no handler; mobile menu locks `body` scroll via inline style | T19 |

## Information Architecture

| Route | Surface | Mode | Source |
|-------|---------|------|--------|
| `/` | Home | Persuade | latest releases (catalog), artists, playlists, recent SZNals, Join |
| `/artists` | Artist index | Experience | `getAllArtists()` |
| `/artists/:slug` | Artist profile | Experience | artist JSON + catalog |
| `/members/:slug` | redirect → `/artists/:slug` | — | |
| `/releases` | Releases + playlists | Experience | static releases merged with catalog |
| `/releases/:slug` | Release detail | Experience | as above; Spotify embed + YouTube facade |
| `/sznals` | Journal index | Read | `content/sznals/*.mdx` |
| `/sznals/:slug` | Article | Read | MDX |
| `/join` | Join SZN | Persuade | WhatsApp URL + newsletter form |
| `*` | 404 | Operate | |

Header nav: Artists · Releases · SZNals · Join SZN. Footer: the same four plus verified social links only.

## File Structure

### Created

| Path | Responsibility |
|------|----------------|
| `vitest.config.ts`, `src/test/setup.ts` | Test runner |
| `.github/workflows/ci.yml` | lint → test → build → size gate |
| `.github/workflows/sync-spotify.yml` | Daily catalog sync; commits `src/data/generated/spotify-catalog.json` |
| `scripts/check-bundle-size.mjs` | Gzip budget gate |
| `scripts/sync-spotify.mjs` | Client-credentials Spotify catalog fetch (Node, no deps) |
| `scripts/prerender.mjs` + `src/entry-seo.ts` | Per-route `<head>` prerender for share previews |
| `tsconfig.api.json` | Type-checks `api/` and `scripts/*.ts` with Node types |
| `api/newsletter/subscribe.ts` | Resend contact creation |
| `src/config/site.ts` | Site name, URL, verified socials, WhatsApp URL, playlist IDs |
| `src/config/platforms.ts` | Single platform registry (order, label, colour, icon) |
| `src/data/spotify-sources.json` | Which artist IDs / playlist IDs the sync pulls |
| `src/data/generated/spotify-catalog.json` | Sync output (committed) |
| `src/lib/catalog.ts` | Merge static releases with catalog; typed accessors |
| `src/lib/spotify-links.ts` | Pure Spotify URL helpers (relocated) |
| `src/lib/youtube.ts` | YouTube URL → id, thumbnail |
| `src/lib/share.ts` | WhatsApp/Instagram/native share URL builders |
| `src/lib/format.ts` | `formatDate` in `en-KE`, `formatDuration` |
| `src/content/sznals.ts` | MDX glob loader + `meta` typing |
| `content/sznals/*.mdx` | Articles |
| `src/pages/{Artists,Releases,SZNals,SZNal,Join}.tsx` | New surfaces |
| `src/components/media/{SpotifyEmbed,YouTubeFacade,PlayButton}.tsx` | Click-to-load players |
| `src/components/shared/{ArtistCard,CloudinaryImage,ShareRow}.tsx` | |
| `src/styles/tokens.css`, `src/styles/fonts.css`, `public/fonts/*.woff2` | Design tokens and self-hosted fonts (values from the direction contract) |
| `PRODUCT.md`, `DESIGN.md`, `docs/ASSETS-NEEDED.md`, `docs/CONTENT-GUIDE.md` | Impeccable product/design records; content ops |

### Deleted

`api/spotify/**` (all), `api/package.json`, `api/package-lock.json`, `src/lib/spotify/**`, `src/hooks/useSpotify*.ts`, `src/hooks/useLatestReleases.ts`, `src/lib/releases-cache.ts`, `src/components/spotify/**`, `src/components/animation/**`, `src/components/artist/{CollaborationOrbit,CollaborationNetwork,XiiXProfileCard}.tsx`, `src/components/shared/{EnhancedReleaseCard,BottomSheet,ModeSwitch,TrackCard,SpotifyEmbed,StatCounter}.tsx`, `src/pages/{SpotifyTest,Member}.tsx`, `src/data/members.ts`, `src/data/artists/xiix2.json`, `src/types/xiix-profile.ts`, `clear-cache.html`, `test-data-load.html`, `docs/PHASE*.md`, `docs/PHASE4_INTEGRATION_EXAMPLES.tsx`, `docs/XIIX_PROFILE_ROADMAP.md`, `docs/ROADMAP.md`, `roadmaplatest.md` (superseded by this file).

---

# PHASE 0 — Ground Truth

**Ships:** a repo that builds, type-checks, tests, and refuses to regress.

---

### Task 1: Test harness, CI, and repo hygiene

**Files:**
- Create: `vitest.config.ts`, `src/test/setup.ts`, `src/lib/utils.test.ts`, `.github/workflows/ci.yml`
- Modify: `package.json`, `tsconfig.app.json`, `.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test`, `npm run test:watch`, `npm run typecheck`. Every later task uses these.

- [ ] **Step 1: Install test tooling**

```bash
npm i -D vitest@^3 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts', 'scripts/**/*.test.mjs'],
    restoreMocks: true,
  },
})
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())
```

- [ ] **Step 4: Replace the `scripts` block in `package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "typecheck": "tsc -b --force",
  "lint": "eslint .",
  "test": "vitest run",
  "test:watch": "vitest",
  "preview": "vite preview"
}
```

- [ ] **Step 5: Add Vitest globals to `tsconfig.app.json`**

Change the `"types"` entry to:

```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
```

- [ ] **Step 6: Write the harness-proving test `src/lib/utils.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { slugify, truncate, cn } from './utils'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('6 AM')).toBe('6-am')
  })
  it('strips punctuation', () => {
    expect(slugify('ALL DAY (feat. 3 PVNCH)')).toBe('all-day-feat-3-pvnch')
  })
})

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('SIXXTAPE', 20)).toBe('SIXXTAPE')
  })
  it('trims then appends an ellipsis', () => {
    expect(truncate('Nairobi creative ecosystem', 7)).toBe('Nairobi...')
  })
})

describe('cn', () => {
  it('merges tailwind classes with the last one winning', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
```

- [ ] **Step 7: Run it**

Run: `npm test`
Expected: 5 tests PASS.

- [ ] **Step 8: Stop ignoring markdown and env examples**

In `.gitignore`, delete the line `*.md`. Change `*.env.*` to `.env*` and add a following line `!.env.example`.

- [ ] **Step 9: Create `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

`npm run build` is expected to FAIL in CI until Task 4. CI now tells the truth.

- [ ] **Step 10: Commit**

```bash
git add vitest.config.ts src/test/setup.ts src/lib/utils.test.ts .github/workflows/ci.yml \
        package.json package-lock.json tsconfig.app.json .gitignore README.md docs/
git commit -m "test: add vitest + testing-library harness and CI workflow

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Fix the artist-profile type errors

9 of the 24 build errors live in the two hand-written profile adapters (`(X | null)[]` asserted with a failing type predicate; `string | undefined` assigned to required `string` branding fields).

**Files:**
- Modify: `src/data/artists/pipiProfile.ts` (~155–182, 235–236), `src/data/artists/wavyProfile.ts` (~102–144, 262–263)
- Create: `public/images/artists/placeholder.svg`
- Test: `src/data/artists/profiles.test.ts`

**Interfaces:**
- Produces: `wavyProfile`, `pipiProfile` as valid `ArtistProfile` with `branding.image: string` and `branding.cover_image: string` always populated.

- [ ] **Step 1: Write the failing test `src/data/artists/profiles.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import wavyProfile from './wavyProfile'
import pipiProfile from './pipiProfile'

describe.each([
  ['wavy', wavyProfile],
  ['pipi', pipiProfile],
])('%s profile', (slug, profile) => {
  it('has non-empty branding images', () => {
    expect(profile.branding.image.length).toBeGreaterThan(0)
    expect(profile.branding.cover_image.length).toBeGreaterThan(0)
  })
  it('uses the expected primary slug', () => {
    expect(profile.branding.primary_slug).toBe(slug)
  })
  it('contains no null discography highlights', () => {
    expect(profile.discography.highlights.every(Boolean)).toBe(true)
  })
  it('gives every highlight a title and ISO release date', () => {
    for (const h of profile.discography.highlights) {
      expect(h.title).toBeTruthy()
      expect(h.release_date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- profiles`
Expected: FAIL — `branding.image` is `undefined`.

- [ ] **Step 3: Add a fallback constant to both adapters** (after imports)

```ts
const FALLBACK_ARTIST_IMAGE = '/images/artists/placeholder.svg'
```

- [ ] **Step 4: In `wavyProfile.ts`, type the map callback and fix the predicate**

Change the `.map(` opening to `.map((track): DiscographyHighlight | null => {` and the filter to `.filter((item): item is DiscographyHighlight => item !== null)`. Replace the branding lines:

```ts
    image: wavyData.media_assets?.hero_image?.url || FALLBACK_ARTIST_IMAGE,
    cover_image: wavyData.media_assets?.hero_image?.url || FALLBACK_ARTIST_IMAGE,
```

- [ ] **Step 5: Apply the same three fixes in `pipiProfile.ts`**, plus drop the unused `index` parameter from the map callback and change `type: 'single'` to `type: 'single' as const`.

- [ ] **Step 6: Create `public/images/artists/placeholder.svg`** (neutral, no brand colours — Phase 3 replaces it)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="Artist portrait placeholder">
  <rect width="400" height="500" fill="#141414"/>
  <circle cx="200" cy="200" r="70" fill="#ffffff" opacity="0.12"/>
  <path d="M80 460c0-66 54-120 120-120s120 54 120 120z" fill="#ffffff" opacity="0.12"/>
</svg>
```

- [ ] **Step 7: Run the tests**

Run: `npm test -- profiles` → 8 PASS. Run: `npx tsc -b 2>&1 | grep -c "error TS"` → `15`.

- [ ] **Step 8: Commit**

```bash
git add src/data/artists/pipiProfile.ts src/data/artists/wavyProfile.ts src/data/artists/profiles.test.ts public/images/artists/placeholder.svg
git commit -m "fix(data): correct artist profile types and guarantee branding images

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Remove the browser-side Spotify library

Closes F5, F7, F21 and the remaining 15 build errors in `src/`. `client.ts`/`enhanced-client.ts` perform a client-credentials grant **from the browser** — unfixable by design. The pure URL helpers are kept.

**Files:**
- Move: `src/lib/spotify/utils.ts` → `src/lib/spotify-links.ts`
- Delete: `src/lib/spotify/` (everything else), `src/hooks/useSpotify{Track,Tracks,Artist,TopTracks}.ts`, `src/components/shared/{TrackCard,SpotifyEmbed,EnhancedReleaseCard}.tsx`, `src/pages/SpotifyTest.tsx`
- Modify: `src/hooks/index.ts`, `src/components/shared/index.ts`, `src/pages/index.ts`
- Test: `src/lib/spotify-links.test.ts`

**Interfaces:**
- Produces: `src/lib/spotify-links.ts` exporting `extractSpotifyId(url?: string): string | null`, `extractSpotifyType(url?: string): 'track'|'album'|'artist'|null`, `buildSpotifyEmbedUrl(type, id): string`, `isValidSpotifyId(id?: string): boolean`, `formatDuration(ms: number): string`. Tasks 11, 21 import from here.

- [ ] **Step 1: Write `src/lib/spotify-links.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { extractSpotifyId, extractSpotifyType, isValidSpotifyId, buildSpotifyEmbedUrl, formatDuration } from './spotify-links'

describe('extractSpotifyId', () => {
  it('reads an id from a web album URL', () => {
    expect(extractSpotifyId('https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L')).toBe('5EC55CH3Tybf6kNJS0415L')
  })
  it('reads an id from a spotify: URI', () => {
    expect(extractSpotifyId('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp')).toBe('3n3Ppam7vgaVa1iaRUc9Lp')
  })
  it('returns null for undefined', () => {
    expect(extractSpotifyId(undefined)).toBeNull()
  })
})

describe('isValidSpotifyId', () => {
  it('accepts a 22-char base62 id', () => expect(isValidSpotifyId('5EC55CH3Tybf6kNJS0415L')).toBe(true))
  it('rejects fabricated ids', () => {
    expect(isValidSpotifyId('concretedreams')).toBe(false)
    expect(isValidSpotifyId('cultureszn')).toBe(false)
  })
})

describe('extractSpotifyType', () => {
  it('detects album', () => expect(extractSpotifyType('https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L')).toBe('album'))
})

describe('buildSpotifyEmbedUrl', () => {
  it('builds an embed URL', () => expect(buildSpotifyEmbedUrl('album', 'abc')).toContain('/embed/album/abc'))
})

describe('formatDuration', () => {
  it('formats M:SS', () => expect(formatDuration(154000)).toBe('2:34'))
})
```

- [ ] **Step 2: Run → FAIL** (`Failed to resolve import "./spotify-links"`).

- [ ] **Step 3: Relocate the helpers, then delete the library**

```bash
git mv src/lib/spotify/utils.ts src/lib/spotify-links.ts
git rm -r src/lib/spotify
git rm src/hooks/useSpotifyTrack.ts src/hooks/useSpotifyTracks.ts src/hooks/useSpotifyArtist.ts src/hooks/useSpotifyTopTracks.ts
git rm src/components/shared/TrackCard.tsx src/components/shared/SpotifyEmbed.tsx src/components/shared/EnhancedReleaseCard.tsx
git rm src/pages/SpotifyTest.tsx
```

- [ ] **Step 4: Replace `src/hooks/index.ts`**

```ts
export { useDocumentHead } from './useDocumentHead'
export { useScrollParallax, useHeroParallax, useScrollTrigger } from './useScrollParallax'
// The remaining Spotify hooks are deleted in Task 5.
export { useSpotifyAuth } from './useSpotifyAuth'
export { useSpotifyPlayer } from './useSpotifyPlayer'
export { useSpotifyLibrary } from './useSpotifyLibrary'
export { useSpotifyRecommendations } from './useSpotifyRecommendations'
export { useLatestReleases } from './useLatestReleases'
export type { UseLatestReleasesOptions, UseLatestReleasesResult } from './useLatestReleases'
```

- [ ] **Step 5: Replace `src/components/shared/index.ts`**

```ts
export { StatCounter } from './StatCounter'
export { SocialLinks } from './SocialLinks'
export { MemberCard } from './MemberCard'
export { ReleaseCard } from './ReleaseCard'
export { ReleaseCardSkeleton } from './ReleaseCardSkeleton'
export type { ReleaseCardSkeletonProps } from './ReleaseCardSkeleton'
export { SZNalCard } from './SZNalCard'
export { ShareButton, useShare } from './ShareButton'
export { ScrollBehavior, ScrollToTop, ScrollToHash } from './ScrollBehavior'
export { BottomSheet } from './BottomSheet'
export { ModeSwitch } from './ModeSwitch'
```

Remove the `SpotifyTest` export from `src/pages/index.ts`.

- [ ] **Step 6: Fix `@/types` resolution in `src/data/releases.ts`** — the error `Cannot find module '@/types'` on this file comes from `api/spotify/latest-releases.ts` pulling it into a non-aliased compilation; it disappears with Task 5. Confirm now that `src/` is clean:

Run: `grep -rn "lib/spotify" src/ || echo CLEAN` → `CLEAN`. If a surviving hook (`useSpotifyAuth`, `useSpotifyPlayer`, `useSpotifyLibrary`, `useSpotifyRecommendations`, `useLatestReleases`) imports the deleted library, `git rm` that hook now and drop its line from `src/hooks/index.ts` — Task 5 deletes them all regardless.
Run: `npm test -- spotify-links` → 8 PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix(security): remove browser-side Spotify client that would ship the client secret

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Green build gate and bundle budget

**Files:**
- Create: `scripts/check-bundle-size.mjs`
- Modify: `package.json`, `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `npm run check:size` (exit 1 over budget; `BUNDLE_BUDGET_GZIP` env overrides).

- [ ] **Step 1: Create `scripts/check-bundle-size.mjs`**

```js
#!/usr/bin/env node
// Fails when the largest initial JS chunk exceeds the gzip budget (see plan C1).
import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const BUDGET_GZIP = Number(process.env.BUNDLE_BUDGET_GZIP ?? 210_000)
const assetsDir = path.resolve('dist/assets')

let entries
try {
  entries = await readdir(assetsDir)
} catch {
  console.error('✗ dist/assets not found. Run `vite build` first.')
  process.exit(1)
}

const measured = []
for (const file of entries.filter((f) => f.endsWith('.js'))) {
  const buf = await readFile(path.join(assetsDir, file))
  measured.push({ file, raw: buf.length, gzip: gzipSync(buf).length })
}
if (measured.length === 0) {
  console.error('✗ No JS chunks in dist/assets.')
  process.exit(1)
}
measured.sort((a, b) => b.gzip - a.gzip)
const kb = (n) => `${(n / 1024).toFixed(1)} KB`
for (const m of measured) console.log(`  ${m.file.padEnd(40)} ${kb(m.raw).padStart(10)} raw ${kb(m.gzip).padStart(10)} gzip`)
const largest = measured[0]
console.log(`\n  largest: ${largest.file} ${kb(largest.gzip)} gzip / budget ${kb(BUDGET_GZIP)}`)
if (largest.gzip > BUDGET_GZIP) {
  console.error(`✗ Over budget by ${kb(largest.gzip - BUDGET_GZIP)}`)
  process.exit(1)
}
console.log('✓ Within bundle budget')
```

- [ ] **Step 2: Add `"check:size": "node scripts/check-bundle-size.mjs"` to `package.json` scripts.**

- [ ] **Step 3: Temporarily exclude `api/` from the build's reach.** `tsc -b` only compiles `src` (per `tsconfig.app.json`), but `api/spotify/latest-releases.ts` still imports `src/` files by relative path and breaks `@/types`. Until Task 5 deletes it, confirm `npx tsc -b` reports errors **only** in `api/`:

Run: `npx tsc -b 2>&1 | grep "error TS" | grep -v "^api/" || echo "SRC CLEAN"` → `SRC CLEAN`

If errors remain in `src/`, fix them here; do not proceed with a red `src/`.

- [ ] **Step 4: Run `npm run build`.** If it fails solely due to `api/` imports, proceed to Task 5 immediately and treat Tasks 4–5 as one commit. Otherwise:

Run: `npm run build` → PASS. Run: `npm run check:size` → PASS (~200 KB gzip).

- [ ] **Step 5: Append `- run: npm run check:size` after the build step in `ci.yml`.**

- [ ] **Step 6: Commit**

```bash
git add scripts/check-bundle-size.mjs package.json .github/workflows/ci.yml
git commit -m "build: green build gate and gzip bundle budget

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

**Phase 0 exit criteria:** `npm run lint`, `npm test`, `npm run build`, `npm run check:size` exit 0. No secret can reach the browser bundle.

---

# PHASE 1 — Delete What Cannot Work

**Ships:** a site with no Spotify login, no serverless Spotify API, no dead code, no fabricated content, and no dead links. Every security finding closes by deletion.

---

### Task 5: Delete the Spotify auth, player, and serverless layer

Per D3. Closes F2, F3, F4, F6, F8, F13, F18 and the last build errors. `ReleasesSection` and `ReleaseCard` temporarily read static data; Task 11 wires the catalog.

**Files:**
- Delete: `api/spotify/` (all), `api/package.json`, `api/package-lock.json`, `src/hooks/useSpotify{Auth,Player,Library,Recommendations}.ts`, `src/hooks/useLatestReleases.ts`, `src/lib/releases-cache.ts`, `src/components/spotify/` (all), `src/types/spotify-web-api-node.d.ts`
- Modify: `src/components/layout/Layout.tsx`, `src/components/sections/ReleasesSection.tsx`, `src/components/shared/ReleaseCard.tsx`, `src/hooks/index.ts`, `src/types/index.ts`, `package.json`
- Test: `src/components/sections/ReleasesSection.test.tsx`

**Interfaces:**
- Produces: `ReleaseCard({ release: Release; variant?: 'default' | 'compact' })` with no Spotify coupling. `ReleasesSection` renders from `getFeaturedRelease()` + `getRecentReleases(4)`.

- [ ] **Step 1: Write the failing test `src/components/sections/ReleasesSection.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReleasesSection } from './ReleasesSection'
import { getFeaturedRelease } from '@/data'

describe('ReleasesSection', () => {
  it('renders the featured release title from static data without any network', () => {
    const featured = getFeaturedRelease()
    render(<MemoryRouter><ReleasesSection /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /latest releases/i })).toBeInTheDocument()
    expect(screen.getAllByText(featured!.title).length).toBeGreaterThan(0)
  })
  it('shows no sync/offline UI', () => {
    render(<MemoryRouter><ReleasesSection /></MemoryRouter>)
    expect(screen.queryByText(/offline/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /refresh|sync/i })).toBeNull()
  })
})
```

- [ ] **Step 2: Run → FAIL** (imports `useLatestReleases`, which calls `fetch`).

- [ ] **Step 3: Delete**

```bash
git rm -r api/spotify api/package.json api/package-lock.json
git rm src/hooks/useSpotifyAuth.ts src/hooks/useSpotifyPlayer.ts src/hooks/useSpotifyLibrary.ts src/hooks/useSpotifyRecommendations.ts src/hooks/useLatestReleases.ts
git rm src/lib/releases-cache.ts src/types/spotify-web-api-node.d.ts
git rm -r src/components/spotify
npm uninstall spotify-web-api-node dotenv
```

- [ ] **Step 4: Replace `src/hooks/index.ts`**

```ts
export { useDocumentHead } from './useDocumentHead'
export { useScrollParallax, useHeroParallax, useScrollTrigger } from './useScrollParallax'
```

- [ ] **Step 5: In `src/types/index.ts`** delete the `EnrichedRelease`, `LatestReleasesResponse`, and `CachedReleases` interfaces (Task 11 defines the single replacement).

- [ ] **Step 6: Remove the player from `src/components/layout/Layout.tsx`** — delete the `SpotifyPlayer` import and `<SpotifyPlayer />` element and the comment above it.

- [ ] **Step 7: Rewrite `src/components/shared/ReleaseCard.tsx`** — remove the `SpotifyQuickPlay` import, the `EnrichedRelease` union, `isEnrichedRelease`, `hasSpotifyUri`, and the "Quick Play Button" blocks. Props become `{ release: Release; variant?: 'default' | 'compact' }`. Keep the rest of the markup unchanged (Phase 3 replaces it).

- [ ] **Step 8: Rewrite `src/components/sections/ReleasesSection.tsx`**

```tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, SectionHeader } from '@/components/ui'
import { ReleaseCard } from '@/components/shared'
import { getFeaturedRelease, getRecentReleases } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function ReleasesSection() {
  const featured = getFeaturedRelease()
  const recent = getRecentReleases(4).filter((r) => r.id !== featured?.id).slice(0, 3)

  return (
    <section id="releases" className="section-szn" aria-labelledby="releases-heading">
      <div className="container-szn">
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }}>
          <motion.div variants={fadeInUp}>
            <SectionHeader
              id="releases-heading"
              title="Latest Releases"
              subtitle="Projects that define our sonic and visual direction."
            />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {featured && (
              <motion.div variants={fadeInUp}>
                <ReleaseCard release={featured} />
              </motion.div>
            )}
            <motion.div variants={staggerContainer} className="flex flex-col gap-4">
              {recent.map((release) => (
                <motion.div key={release.id} variants={fadeInUp}>
                  <ReleaseCard release={release} variant="compact" />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} className="text-center">
            <Link to="/releases">
              <Button variant="outline" size="lg">All releases <ArrowRight size={18} /></Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

If `SectionHeader` does not accept `id`, add an optional `id?: string` prop in `src/components/ui/Typography.tsx` and spread it onto the `<h2>`.

- [ ] **Step 9: Run everything**

Run: `npm test` → all PASS. Run: `npm run build` → PASS (first green build). Run: `npm run check:size` → PASS.
Run: `grep -rn "spotify" src/ -il` → only `spotify-links.ts`, `artists/`, data files, `PlatformLinks.tsx`, `StreamingBar.tsx`, `Release.tsx` (link maps — Task 12).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "fix(security): delete Spotify OAuth, session encryption, player and serverless API

Closes F2 F3 F4 F6 F8 F13 F18 by deletion. Spotify becomes embed + server-side
catalog sync (plan D3). First green build.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Type-check `api/` and `scripts/`

Closes F22. From here on every serverless function and script is type-checked in CI.

**Files:**
- Create: `tsconfig.api.json`, `api/_lib/http.ts`, `api/_lib/http.test.ts`
- Modify: `tsconfig.json`, `package.json`, `eslint.config.js`

**Interfaces:**
- Produces: `api/_lib/http.ts` exporting `json(res: VercelResponse, status: number, body: unknown): void`, `methodNotAllowed(res, allowed: string[]): void`, `readJsonBody<T>(req: VercelRequest): T | null`. Task 14 uses these.

- [ ] **Step 1: Install Node types for the API**

```bash
npm i -D @vercel/node@^5
```

- [ ] **Step 2: Create `tsconfig.api.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2023"],
    "types": ["node", "vitest/globals"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true,
    "noEmit": true,
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.api.tsbuildinfo"
  },
  "include": ["api/**/*.ts", "scripts/**/*.ts"]
}
```

- [ ] **Step 3: Reference it from `tsconfig.json`** — add `{ "path": "./tsconfig.api.json" }` to the `references` array.

- [ ] **Step 4: Write the failing test `api/_lib/http.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json, methodNotAllowed, readJsonBody } from './http'

function mockRes() {
  const res = { status: vi.fn(), setHeader: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  return res as unknown as VercelResponse & typeof res
}

describe('json', () => {
  it('sets status and body', () => {
    const res = mockRes()
    json(res, 201, { ok: true })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })
})

describe('methodNotAllowed', () => {
  it('sets Allow header and 405', () => {
    const res = mockRes()
    methodNotAllowed(res, ['POST'])
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(res.status).toHaveBeenCalledWith(405)
  })
})

describe('readJsonBody', () => {
  it('returns parsed object bodies', () => {
    expect(readJsonBody<{ a: number }>({ body: { a: 1 } } as unknown as VercelRequest)).toEqual({ a: 1 })
  })
  it('parses string bodies and returns null on garbage', () => {
    expect(readJsonBody({ body: '{"a":1}' } as unknown as VercelRequest)).toEqual({ a: 1 })
    expect(readJsonBody({ body: '{nope' } as unknown as VercelRequest)).toBeNull()
  })
})
```

- [ ] **Step 5: Run → FAIL.** Then create `api/_lib/http.ts`:

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export function json(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).json(body)
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]): void {
  res.setHeader('Allow', allowed.join(', '))
  json(res, 405, { error: 'Method not allowed' })
}

export function readJsonBody<T>(req: VercelRequest): T | null {
  const body: unknown = req.body
  if (body && typeof body === 'object') return body as T
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T
    } catch {
      return null
    }
  }
  return null
}
```

- [ ] **Step 6: Lint config** — in `eslint.config.js` add a second block so API files use Node globals:

```js
  {
    files: ['api/**/*.ts', 'scripts/**/*.{ts,mjs}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.node },
  },
```

- [ ] **Step 7: Verify**

Run: `npm test -- http` → 4 PASS. Run: `npm run typecheck` → exit 0. Run: `npm run lint` → exit 0.

- [ ] **Step 8: Commit**

```bash
git add tsconfig.api.json tsconfig.json api/_lib eslint.config.js package.json package-lock.json
git commit -m "build: type-check api/ and scripts/ with Node types

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Remove dead code

Closes F10, F15. Everything here is unreachable from `App.tsx`. Verify with the import graph before each deletion — if a file is imported by a survivor, stop and note it rather than deleting.

**Files:**
- Delete: `src/components/animation/`, `src/components/artist/{CollaborationOrbit,CollaborationNetwork,XiiXProfileCard}.tsx`, `src/components/shared/{BottomSheet,ModeSwitch}.tsx`, `src/pages/Member.tsx`, `src/data/artists/xiix2.json`, `src/types/xiix-profile.ts`, `clear-cache.html`, `test-data-load.html`, `docs/PHASE*.md`, `docs/PHASE4_INTEGRATION_EXAMPLES.tsx`, `docs/XIIX_PROFILE_ROADMAP.md`, `docs/ROADMAP.md`, `roadmaplatest.md`
- Modify: `src/components/artist/index.ts`, `src/components/shared/index.ts`, `src/pages/index.ts`, `src/types/index.ts`, `src/data/artists/index.ts` (drop the `xiix2` import if present)

- [ ] **Step 1: Prove each target is unreachable**

```bash
for f in CollaborationOrbit CollaborationNetwork XiiXProfileCard BottomSheet ModeSwitch "pages/Member" xiix2 xiix-profile "components/animation"; do
  echo "== $f"; grep -rn "$f" src --include=*.ts --include=*.tsx | grep -v "^src/components/animation/" | grep -v "index.ts"
done
```

Expected: no hits outside barrel files and the deleted directories themselves. Any hit is a survivor to fix first.

- [ ] **Step 2: Delete**

```bash
git rm -r src/components/animation
git rm src/components/artist/CollaborationOrbit.tsx src/components/artist/CollaborationNetwork.tsx src/components/artist/XiiXProfileCard.tsx
git rm src/components/shared/BottomSheet.tsx src/components/shared/ModeSwitch.tsx
git rm src/pages/Member.tsx src/data/artists/xiix2.json src/types/xiix-profile.ts
git rm clear-cache.html test-data-load.html
git rm docs/PHASE1_COMPLETION_REPORT.md docs/PHASE1_IMPLEMENTATION.md docs/PHASE2_3_COMPLETION_REPORT.md docs/PHASE4_5_COMPLETION_REPORT.md docs/PHASE6_7_COMPLETION_REPORT.md docs/PHASE4_INTEGRATION_EXAMPLES.tsx docs/XIIX_PROFILE_ROADMAP.md docs/ROADMAP.md
git rm roadmaplatest.md
```

- [ ] **Step 3: Clean the barrels** — remove the corresponding `export` lines from `src/components/artist/index.ts`, `src/components/shared/index.ts`, `src/pages/index.ts`; remove the `XiiXProfileV2 … SongCredits` re-export block from `src/types/index.ts`.

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm test && npm run build` → all exit 0.
Run: `find src -name '*.tsx' | xargs wc -l | tail -1` → total well under 8,000 lines (was ~20,700).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove ~5,000 lines of unreachable components, pages and docs

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Remove fabricated content; site config; `en-KE` dates; head-tag fix

Closes F19, F25, F26, F16. The site must not lie.

**Files:**
- Create: `src/config/site.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`, `src/config/site.test.ts`
- Delete: `src/data/members.ts`
- Modify: `src/data/index.ts`, `src/lib/constants.ts`, `src/data/releases.ts`, `src/data/sznals.ts`, `src/components/sections/{Hero,MovementSection,MembersSection}.tsx`, `src/components/shared/{MemberCard,SZNalCard}.tsx`, `src/components/layout/Footer.tsx`, `src/hooks/useDocumentHead.ts`, `src/lib/utils.ts`, `src/types/index.ts`

**Interfaces:**
- Produces: `src/config/site.ts` exporting `SITE` (`name`, `tagline`, `description`, `url`, `locale: 'en-KE'`, `timeZone: 'Africa/Nairobi'`, `whatsappCommunityUrl: string` (empty until supplied), `socials: { instagram?: string; youtube?: string; spotify?: string; tiktok?: string }`, `spotifyPlaylistIds: string[]`). `src/lib/format.ts` exporting `formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string` and `formatDuration(ms: number): string` (moved from `spotify-links.ts`; keep a re-export there for Task 3's test). `getAllArtists()` from `@/data` is the only source of people.

- [ ] **Step 1: Write `src/lib/format.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { formatDate, formatDuration } from './format'

describe('formatDate', () => {
  it('renders in en-KE with the Nairobi time zone', () => {
    expect(formatDate('2026-01-31')).toBe('31 January 2026')
  })
  it('accepts overrides', () => {
    expect(formatDate('2026-01-31', { month: 'short' })).toBe('31 Jan 2026')
  })
})

describe('formatDuration', () => {
  it('formats M:SS', () => expect(formatDuration(154000)).toBe('2:34'))
  it('pads seconds', () => expect(formatDuration(61000)).toBe('1:01'))
})
```

- [ ] **Step 2: Write `src/config/site.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { SITE } from './site'

describe('SITE', () => {
  it('uses Kenyan locale settings', () => {
    expect(SITE.locale).toBe('en-KE')
    expect(SITE.timeZone).toBe('Africa/Nairobi')
  })
  it('contains no unsplash or placeholder URLs', () => {
    expect(JSON.stringify(SITE)).not.toMatch(/unsplash|example\.com|placeholder/i)
  })
  it('only lists https social URLs', () => {
    for (const url of Object.values(SITE.socials)) expect(url).toMatch(/^https:\/\//)
  })
})
```

- [ ] **Step 3: Run both → FAIL.** Then create `src/lib/format.ts`:

```ts
import { SITE } from '@/config/site'

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: SITE.timeZone,
    ...opts,
  }).format(new Date(iso))
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
```

- [ ] **Step 4: Create `src/config/site.ts`**

Only values verified by the team go in `socials`. The Instagram handle below is the one recorded for XiiX in `xiix.json`; the collective's own handles are unknown — leave them out and list them in `docs/ASSETS-NEEDED.md` (Task 27).

```ts
export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  locale: string
  timeZone: string
  whatsappCommunityUrl: string
  socials: { instagram?: string; youtube?: string; spotify?: string; tiktok?: string }
  spotifyPlaylistIds: string[]
}

export const SITE: SiteConfig = {
  name: 'Culture SZN',
  tagline: "Nairobi's Creative Ecosystem",
  description:
    "Culture SZN is the multidisciplinary ecosystem amplifying Nairobi's next-generation creatives — where music, design, and cultural expression converge.",
  url: 'https://cultureszn.com',
  locale: 'en-KE',
  timeZone: 'Africa/Nairobi',
  /** WhatsApp community invite. Empty string hides every WhatsApp CTA (no dead ends). */
  whatsappCommunityUrl: '',
  /** Verified public profiles only. Unverified handles stay out. */
  socials: {},
  /** Curated Culture SZN Spotify playlist IDs (22-char). Empty until supplied. */
  spotifyPlaylistIds: [],
}
```

- [ ] **Step 5: Delete fabricated people and stats**

```bash
git rm src/data/members.ts
```

In `src/data/index.ts` remove the `members` export line. In `src/lib/constants.ts` delete `HERO_STATS`, `MOVEMENT_STATS`, `SOCIAL_LINKS`, `SITE_CONFIG`; replace `NAV_LINKS` and `FOOTER_LINKS` with:

```ts
export const NAV_LINKS = [
  { name: 'Artists', href: '/artists' },
  { name: 'Releases', href: '/releases' },
  { name: 'SZNals', href: '/sznals' },
  { name: 'Join SZN', href: '/join' },
] as const
export const FOOTER_LINKS = NAV_LINKS
```

Delete the `Member` interface from `src/types/index.ts`.

- [ ] **Step 6: Purge Unsplash and fake Spotify URLs from data**

In `src/data/releases.ts`: for any release whose `coverArt` contains `unsplash.com`, set `coverArt: ''`; delete any `streamingLinks.spotify` value whose id fails `isValidSpotifyId` (e.g. `/album/concretedreams`, `/album/streetgospel`). In `src/data/sznals.ts` set every `image` to `''`. Add a data test `src/data/data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { releases, sznals } from '@/data'
import { extractSpotifyId, isValidSpotifyId } from '@/lib/spotify-links'

describe('data honesty', () => {
  it('has no stock placeholder images', () => {
    for (const r of releases) expect(r.coverArt).not.toMatch(/unsplash/)
    for (const s of sznals) expect(s.image).not.toMatch(/unsplash/)
  })
  it('has only real Spotify ids', () => {
    for (const r of releases) {
      if (r.streamingLinks.spotify) expect(isValidSpotifyId(extractSpotifyId(r.streamingLinks.spotify) ?? '')).toBe(true)
    }
  })
})
```

- [ ] **Step 7: Rewire the sections**

- `Hero.tsx`: delete the `StatCounter` import, `HERO_STATS` import, the Stats block, and the Unsplash `backgroundImage` div. Keep headline, subhead, CTA.
- `MovementSection.tsx`: delete the stats block and imports.
- `MembersSection.tsx`: replace `getAllMembers().slice(0, 3)` with `getAllArtists()` from `@/data`; render `<ArtistCard artist={a} />` — rename `MemberCard.tsx` to `ArtistCard.tsx` taking `{ artist: NormalizedArtist }` and linking to `/artists/${artist.slug}` (fields: `name`, `role`, `shortBio`, `image`, `tags`). Replace the inert "View All Creatives" button with `<Link to="/artists">`.
- `SZNalCard.tsx`: replace the `toLocaleDateString('en-US', …)` call with `formatDate(sznal.publishedDate, { month: 'short' })`.
- `Footer.tsx`: replace `socialLinks` with entries derived from `SITE.socials` (skip undefined); replace the two link columns with one column from `FOOTER_LINKS`; delete the fake newsletter form and replace with `<Link to="/join">Join SZN</Link>` (Task 15 builds the real form).
- `src/lib/utils.ts`: delete `formatDate` (now in `format.ts`) and `generateId`.
- `src/components/shared/index.ts`: export `ArtistCard` instead of `MemberCard`; remove `StatCounter` export and `git rm src/components/shared/StatCounter.tsx`.

- [ ] **Step 8: Fix `useDocumentHead` dependency churn (F16)**

In `src/hooks/useDocumentHead.ts` replace the dependency array with serialised keys:

```ts
  const metaKey = JSON.stringify(meta)
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    /* existing body unchanged */
  }, [title, description, canonical, metaKey, jsonLdKey]) // eslint-disable-line react-hooks/exhaustive-deps
```

and inside the effect read `meta`/`jsonLd` from the closure as before.

- [ ] **Step 9: Verify**

Run: `npm test` → PASS. Run: `grep -rn "unsplash" src/ || echo CLEAN` → `CLEAN`. Run: `grep -rn "en-US" src/ || echo CLEAN` → `CLEAN`. Run: `npm run build` → PASS.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "fix(content): remove fabricated members, stats, stock images and fake links; en-KE dates

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Route table and link-integrity test

Closes F11 and enforces C6 forever. Adds the routes the IA needs, with minimal page shells that Phase 3 designs. Every internal link anywhere in the app must match a route.

**Files:**
- Create: `src/routes.ts`, `src/routes.test.ts`, `src/pages/{Artists,Releases,SZNals,SZNal,Join}.tsx`, `src/test/render.tsx`
- Modify: `src/App.tsx`, `src/pages/index.ts`

**Interfaces:**
- Produces: `src/routes.ts` exporting `ROUTES` (`{ path: string }[]`) and `matchesRoute(href: string): boolean`. `src/test/render.tsx` exporting `renderAt(path: string)` which renders `<App />` routes at a path with `MemoryRouter`.

- [ ] **Step 1: Create `src/routes.ts`**

```ts
import { matchPath } from 'react-router-dom'

export const ROUTES = [
  { path: '/' },
  { path: '/artists' },
  { path: '/artists/:slug' },
  { path: '/members/:slug' },
  { path: '/releases' },
  { path: '/releases/:slug' },
  { path: '/sznals' },
  { path: '/sznals/:slug' },
  { path: '/join' },
] as const

/** True when an internal href (path + optional #hash) matches a declared route. */
export function matchesRoute(href: string): boolean {
  if (!href.startsWith('/')) return false
  const [pathname] = href.split(/[?#]/)
  return ROUTES.some((r) => matchPath({ path: r.path, end: true }, pathname) !== null)
}
```

- [ ] **Step 2: Create `src/test/render.tsx`**

```tsx
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/App'

export function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}
```

- [ ] **Step 3: Write `src/routes.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { matchesRoute, ROUTES } from './routes'
import { NAV_LINKS, FOOTER_LINKS } from '@/lib/constants'
import { renderAt } from '@/test/render'
import { getAllArtists, releases, sznals } from '@/data'

describe('matchesRoute', () => {
  it('matches declared routes and rejects unknown ones', () => {
    expect(matchesRoute('/artists/xiix')).toBe(true)
    expect(matchesRoute('/events')).toBe(false)
    expect(matchesRoute('/merch')).toBe(false)
  })
})

describe('link integrity', () => {
  it('every nav and footer link resolves', () => {
    for (const l of [...NAV_LINKS, ...FOOTER_LINKS]) expect(matchesRoute(l.href), l.href).toBe(true)
  })

  const pages = [
    '/',
    '/artists',
    '/releases',
    '/sznals',
    '/join',
    ...getAllArtists().map((a) => `/artists/${a.slug}`),
    ...releases.map((r) => `/releases/${r.slug}`),
  ]

  it.each(pages)('every internal <a> on %s resolves to a route', (path) => {
    const { container, unmount } = renderAt(path)
    const hrefs = Array.from(container.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute('href')!)
    for (const href of hrefs) expect(matchesRoute(href), `${path} → ${href}`).toBe(true)
    unmount()
  })

  it('the declared route list covers every content type', () => {
    expect(ROUTES.map((r) => r.path)).toEqual(expect.arrayContaining(['/sznals/:slug', '/join']))
    expect(sznals.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 4: Run → FAIL** (`AppRoutes` not exported; routes missing).

- [ ] **Step 5: Create the page shells** (`src/pages/Artists.tsx`, `Releases.tsx`, `SZNals.tsx`, `SZNal.tsx`, `Join.tsx`). Each is honest, minimal, and semantically correct; Phase 3 replaces the markup.

```tsx
// src/pages/Artists.tsx
import { getAllArtists } from '@/data'
import { ArtistCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Artists() {
  useDocumentHead({ title: `Artists | ${SITE.name}`, description: 'The artists of Culture SZN.' })
  const artists = getAllArtists()
  return (
    <section className="section-szn pt-32" aria-labelledby="artists-heading">
      <div className="container-szn">
        <h1 id="artists-heading" className="text-4xl font-bold mb-10">Artists</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((a) => <ArtistCard key={a.slug} artist={a} />)}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/pages/Releases.tsx
import { getAllReleases } from '@/data'
import { ReleaseCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Releases() {
  useDocumentHead({ title: `Releases | ${SITE.name}`, description: 'Every Culture SZN release.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="releases-heading">
      <div className="container-szn">
        <h1 id="releases-heading" className="text-4xl font-bold mb-10">Releases</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getAllReleases().map((r) => <ReleaseCard key={r.id} release={r} />)}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/pages/SZNals.tsx
import { getAllSZNals } from '@/data'
import { SZNalCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function SZNals() {
  useDocumentHead({ title: `SZNals | ${SITE.name}`, description: 'The Culture SZN journal.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <h1 id="sznals-heading" className="text-4xl font-bold mb-10">SZNals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getAllSZNals().map((s) => <SZNalCard key={s.id} sznal={s} />)}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/pages/SZNal.tsx  (Task 13 replaces the body with the MDX renderer)
import { useParams, Link } from 'react-router-dom'
import { getSZNalBySlug } from '@/data'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { formatDate } from '@/lib/format'

export function SZNal() {
  const { slug } = useParams<{ slug: string }>()
  const sznal = slug ? getSZNalBySlug(slug) : undefined
  useDocumentHead({ title: `${sznal?.title ?? 'SZNal'} | ${SITE.name}`, description: sznal?.excerpt })
  if (!sznal) {
    return (
      <section className="section-szn pt-32"><div className="container-szn">
        <h1 className="text-4xl font-bold mb-4">SZNal not found</h1>
        <Link to="/sznals">Back to SZNals</Link>
      </div></section>
    )
  }
  return (
    <article className="section-szn pt-32"><div className="container-szn max-w-3xl">
      <p className="uppercase tracking-wider text-sm mb-3">{sznal.category}</p>
      <h1 className="text-4xl font-bold mb-4">{sznal.title}</h1>
      <p className="text-sm mb-8">{sznal.author} · {formatDate(sznal.publishedDate)} · {sznal.readTime}</p>
      <p className="text-lg">{sznal.excerpt}</p>
    </div></article>
  )
}
```

```tsx
// src/pages/Join.tsx  (Task 15 adds the real form)
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Join() {
  useDocumentHead({ title: `Join SZN | ${SITE.name}`, description: 'Join the Culture SZN community.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="join-heading">
      <div className="container-szn max-w-2xl">
        <h1 id="join-heading" className="text-4xl font-bold mb-4">Join SZN</h1>
        <p className="text-lg">Community links and newsletter arrive in Task 15.</p>
      </div>
    </section>
  )
}
```

Export all five from `src/pages/index.ts`.

- [ ] **Step 6: Rewrite `src/App.tsx`** to export `AppRoutes` (used by tests and later by the prerenderer) and add the redirect:

```tsx
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home, Artist, Artists, Release, Releases, SZNals, SZNal, Join, NotFound } from '@/pages'
import { ScrollBehavior } from '@/components/shared'

function MemberRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/artists/${slug}`} replace />
}

export function AppRoutes() {
  return (
    <>
      <ScrollBehavior />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:slug" element={<Artist />} />
          <Route path="/members/:slug" element={<MemberRedirect />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/releases/:slug" element={<Release />} />
          <Route path="/sznals" element={<SZNals />} />
          <Route path="/sznals/:slug" element={<SZNal />} />
          <Route path="/join" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

- [ ] **Step 7: Fix every remaining link the test reports** — `Artist.tsx` fallback for legacy members (`getMemberBySlug` no longer exists: delete that branch, render the not-found state instead), `Header.tsx` "Join SZN" button → `<Link to="/join">`, `SZNalsSection` "Explore All SZNals" → `<Link to="/sznals">`. `Release.tsx` back link → `/releases`.

- [ ] **Step 8: Verify**

Run: `npm test` → PASS including every `link integrity` case. Run: `npm run build` → PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(routes): real route table, page shells, member redirect, and link-integrity test

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

**Phase 1 exit criteria:** zero Spotify auth code, zero 404 links, zero fabricated content, `find src -name '*.ts*' | xargs wc -l` under ~8,000, CI green.

---

# PHASE 2 — Honest Data

**Ships:** track lists that refresh themselves, curated playlists, a journal that can publish, a newsletter that sends, one platform registry.

---

### Task 10: Spotify catalog sync (script + scheduled workflow)

Per D3. A Node script with zero dependencies fetches each artist's albums/singles (with tracks) and each curated playlist using the **client-credentials** flow, and writes deterministic JSON. A GitHub Actions cron runs it daily and commits changes, which triggers a Vercel deploy. Nothing runs at request time; nothing Spotify-related touches the browser except the embed iframe.

**Files:**
- Create: `src/data/spotify-sources.json`, `src/data/generated/spotify-catalog.json`, `scripts/lib/spotify-map.mjs`, `scripts/lib/spotify-map.test.mjs`, `scripts/sync-spotify.mjs`, `.github/workflows/sync-spotify.yml`, `.env.example`
- Delete: `scripts/fetch-spotify-xiix.mjs`, `scripts/extract-spotify-ids.ts` (superseded)
- Modify: `package.json`

**Interfaces:**
- Produces: `src/data/generated/spotify-catalog.json` matching the `SpotifyCatalog` shape below (Task 11 types it). `npm run sync:spotify`.

```ts
// Shape written by the script (mirrored as TS in Task 11)
interface SpotifyCatalog {
  syncedAt: string | null
  artists: Record<string /* slug */, { spotifyArtistId: string; albums: CatalogAlbum[] }>
  playlists: CatalogPlaylist[]
}
interface CatalogAlbum {
  id: string; name: string; albumType: 'album' | 'single' | 'compilation'
  releaseDate: string; coverUrl: string; url: string; totalTracks: number
  tracks: { id: string; name: string; durationMs: number; trackNumber: number; url: string; artists: string[] }[]
}
interface CatalogPlaylist {
  id: string; name: string; description: string; coverUrl: string; url: string; trackCount: number
  tracks: { id: string; name: string; artists: string[]; durationMs: number; url: string }[]
}
```

- [ ] **Step 1: Create `src/data/spotify-sources.json`**

XiiX's id comes from `xiix.json → profiles.spotify.artist_id`. Wavy's and Pipí's are not in the repo — they go in `docs/ASSETS-NEEDED.md` (Task 27) and get added here when supplied.

```json
{
  "artists": [
    { "slug": "xiix", "spotifyArtistId": "4JwhMRnhXNf44gaWN2VlDO" }
  ],
  "playlistIds": [],
  "market": "KE"
}
```

- [ ] **Step 2: Write the failing mapping tests `scripts/lib/spotify-map.test.mjs`**

```js
import { describe, it, expect } from 'vitest'
import { mapAlbum, mapPlaylist, stripVolatile } from './spotify-map.mjs'

const rawAlbum = {
  id: '5EC55CH3Tybf6kNJS0415L', name: 'SIXXTAPE', album_type: 'album', release_date: '2025-05-29',
  total_tracks: 2, external_urls: { spotify: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L' },
  images: [{ url: 'big.jpg', width: 640 }, { url: 'small.jpg', width: 64 }],
  tracks: { items: [
    { id: 't1', name: 'INTRO', duration_ms: 1000, track_number: 2, external_urls: { spotify: 'u1' }, artists: [{ name: 'XiiX' }] },
    { id: 't0', name: 'OPEN', duration_ms: 2000, track_number: 1, external_urls: { spotify: 'u0' }, artists: [{ name: 'XiiX' }, { name: 'Pipí' }] },
  ] },
}

describe('mapAlbum', () => {
  it('picks the largest image and sorts tracks by number', () => {
    const a = mapAlbum(rawAlbum)
    expect(a.coverUrl).toBe('big.jpg')
    expect(a.tracks.map((t) => t.name)).toEqual(['OPEN', 'INTRO'])
    expect(a.tracks[0].artists).toEqual(['XiiX', 'Pipí'])
    expect(a.albumType).toBe('album')
  })
})

describe('mapPlaylist', () => {
  it('flattens playlist items and drops null tracks', () => {
    const p = mapPlaylist({
      id: 'p1', name: 'SZN Radio', description: 'x', external_urls: { spotify: 'pu' }, images: [{ url: 'c.jpg', width: 300 }],
      tracks: { total: 2, items: [{ track: null }, { track: { id: 'a', name: 'A', duration_ms: 5, external_urls: { spotify: 'au' }, artists: [{ name: 'W' }] } }] },
    })
    expect(p.trackCount).toBe(2)
    expect(p.tracks).toEqual([{ id: 'a', name: 'A', artists: ['W'], durationMs: 5, url: 'au' }])
  })
})

describe('stripVolatile', () => {
  it('removes syncedAt so unchanged catalogs compare equal', () => {
    expect(stripVolatile({ syncedAt: '2026-01-01', artists: {}, playlists: [] }))
      .toEqual(stripVolatile({ syncedAt: '2026-02-02', artists: {}, playlists: [] }))
  })
})
```

- [ ] **Step 3: Run → FAIL.** Create `scripts/lib/spotify-map.mjs`:

```js
const largestImage = (images = []) => [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? ''

export function mapAlbum(raw) {
  return {
    id: raw.id,
    name: raw.name,
    albumType: raw.album_type,
    releaseDate: raw.release_date,
    coverUrl: largestImage(raw.images),
    url: raw.external_urls?.spotify ?? '',
    totalTracks: raw.total_tracks ?? 0,
    tracks: (raw.tracks?.items ?? [])
      .map((t) => ({
        id: t.id, name: t.name, durationMs: t.duration_ms, trackNumber: t.track_number,
        url: t.external_urls?.spotify ?? '', artists: (t.artists ?? []).map((a) => a.name),
      }))
      .sort((a, b) => a.trackNumber - b.trackNumber),
  }
}

export function mapPlaylist(raw) {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? '',
    coverUrl: largestImage(raw.images),
    url: raw.external_urls?.spotify ?? '',
    trackCount: raw.tracks?.total ?? 0,
    tracks: (raw.tracks?.items ?? [])
      .map((i) => i.track)
      .filter(Boolean)
      .map((t) => ({ id: t.id, name: t.name, artists: (t.artists ?? []).map((a) => a.name), durationMs: t.duration_ms, url: t.external_urls?.spotify ?? '' })),
  }
}

export function stripVolatile(catalog) {
  const { syncedAt: _ignored, ...rest } = catalog
  return rest
}
```

- [ ] **Step 4: Create `scripts/sync-spotify.mjs`**

```js
#!/usr/bin/env node
// Pulls artist discographies + curated playlists into src/data/generated/spotify-catalog.json.
// Client-credentials only. Never runs in the browser. Node 22, no dependencies.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { mapAlbum, mapPlaylist, stripVolatile } from './lib/spotify-map.mjs'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET')
  process.exit(1)
}

const SOURCES = path.resolve('src/data/spotify-sources.json')
const OUT = path.resolve('src/data/generated/spotify-catalog.json')
const API = 'https://api.spotify.com/v1'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`)
  return (await res.json()).access_token
}

async function get(url, token, retries = 3) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 429 && retries > 0) {
    await sleep(Number(res.headers.get('Retry-After') ?? '2') * 1000)
    return get(url, token, retries - 1)
  }
  if (!res.ok) throw new Error(`${url} → ${res.status}: ${await res.text()}`)
  return res.json()
}

async function fetchArtistAlbums(artistId, market, token) {
  const ids = []
  let url = `${API}/artists/${artistId}/albums?include_groups=album,single&market=${market}&limit=50`
  while (url) {
    const page = await get(url, token)
    ids.push(...page.items.map((a) => a.id))
    url = page.next
  }
  const albums = []
  for (let i = 0; i < ids.length; i += 20) {
    const batch = await get(`${API}/albums?ids=${ids.slice(i, i + 20).join(',')}&market=${market}`, token)
    albums.push(...batch.albums.filter(Boolean).map(mapAlbum))
  }
  return albums.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
}

async function fetchPlaylist(id, market, token) {
  const fields = 'id,name,description,external_urls,images,tracks.total,tracks.items(track(id,name,duration_ms,external_urls,artists(name)))'
  return mapPlaylist(await get(`${API}/playlists/${id}?market=${market}&fields=${encodeURIComponent(fields)}`, token))
}

const sources = JSON.parse(await readFile(SOURCES, 'utf8'))
const token = await getToken()
const catalog = { syncedAt: new Date().toISOString(), artists: {}, playlists: [] }
for (const { slug, spotifyArtistId } of sources.artists) {
  catalog.artists[slug] = { spotifyArtistId, albums: await fetchArtistAlbums(spotifyArtistId, sources.market, token) }
  console.log(`✓ ${slug}: ${catalog.artists[slug].albums.length} albums/singles`)
}
for (const id of sources.playlistIds) {
  catalog.playlists.push(await fetchPlaylist(id, sources.market, token))
  console.log(`✓ playlist ${id}`)
}

let previous = null
try { previous = JSON.parse(await readFile(OUT, 'utf8')) } catch { /* first run */ }
if (previous && JSON.stringify(stripVolatile(previous)) === JSON.stringify(stripVolatile(catalog))) {
  console.log('No catalog changes.')
  process.exit(0)
}
await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(catalog, null, 2) + '\n')
console.log(`Wrote ${OUT}`)
```

- [ ] **Step 5: Seed an empty catalog and wire scripts**

Create `src/data/generated/spotify-catalog.json`:

```json
{ "syncedAt": null, "artists": {}, "playlists": [] }
```

Add `"sync:spotify": "node scripts/sync-spotify.mjs"` to `package.json` scripts. Delete the superseded scripts:

```bash
git rm scripts/fetch-spotify-xiix.mjs scripts/extract-spotify-ids.ts
```

Create `.env.example`:

```
# Server-side only. Never prefix with VITE_.
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
```

- [ ] **Step 6: Create `.github/workflows/sync-spotify.yml`**

```yaml
name: Sync Spotify catalog
on:
  schedule:
    - cron: '0 3 * * *'   # 06:00 Nairobi
  workflow_dispatch:
permissions:
  contents: write
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: node scripts/sync-spotify.mjs
        env:
          SPOTIFY_CLIENT_ID: ${{ secrets.SPOTIFY_CLIENT_ID }}
          SPOTIFY_CLIENT_SECRET: ${{ secrets.SPOTIFY_CLIENT_SECRET }}
      - name: Commit if changed
        run: |
          git config user.name "cultureszn-bot"
          git config user.email "bot@cultureszn.com"
          git add src/data/generated/spotify-catalog.json
          git diff --cached --quiet || git commit -m "chore(data): sync Spotify catalog"
          git push
```

- [ ] **Step 7: Run the sync once locally** (the user supplies credentials via `.env` — never commit it):

Run: `set -a; source .env; set +a; npm run sync:spotify`
Expected: `✓ xiix: N albums/singles`, file written. Inspect: `node -e "const c=require('./src/data/generated/spotify-catalog.json');console.log(Object.keys(c.artists), c.artists.xiix.albums.map(a=>a.name))"`.

Run: `npm test -- spotify-map` → 3 PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(data): scheduled Spotify catalog sync (client credentials, committed JSON)

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Catalog merge library and wiring

Closes F12 with one `Release` type. Static releases carry the human-curated fields (YouTube/Audiomack/Boomplay links, `featured`, description); the catalog supplies cover art, dates, and track lists — and **new Spotify drops appear automatically** as synthesized releases.

**Files:**
- Create: `src/lib/catalog.ts`, `src/lib/catalog.test.ts`, `src/test/fixtures/catalog.ts`
- Modify: `src/types/index.ts`, `src/data/releases.ts`, `src/data/index.ts`, `src/components/sections/ReleasesSection.tsx`, `src/pages/{Release,Releases,Artist}.tsx`

**Interfaces:**
- Produces from `src/lib/catalog.ts`:
  - types `SpotifyCatalog`, `CatalogAlbum`, `CatalogTrack`, `CatalogPlaylist`
  - `mergeReleases(staticReleases: Release[], catalog: SpotifyCatalog, artistNames: Record<string, string>): Release[]` (pure)
  - `getCatalog(): SpotifyCatalog`
  - `getAllReleases(): Release[]` (merged, newest first), `getReleaseBySlug(slug): Release | undefined`, `getFeaturedRelease(): Release | undefined`, `getRecentReleases(n): Release[]`, `getReleasesByArtist(slug): Release[]`, `getPlaylists(): CatalogPlaylist[]`
- `Release` gains: `tracks?: { name: string; durationMs?: number; artists?: string[] }[]` (replacing `string[]`), `spotifyAlbumId?: string`, `source: 'static' | 'catalog' | 'merged'`.

- [ ] **Step 1: Update the `Release` type in `src/types/index.ts`**

```ts
export interface ReleaseTrack { name: string; durationMs?: number; artists?: string[] }

export interface Release {
  id: string
  slug: string
  title: string
  artist: string
  artistSlug: string
  type: 'single' | 'ep' | 'album' | 'visual-album' | 'instrumental'
  releaseDate: string
  coverArt: string
  description?: string
  tracks?: ReleaseTrack[]
  streamingLinks: { spotify?: string; appleMusic?: string; youtube?: string; soundcloud?: string; audiomack?: string; boomplay?: string }
  featured?: boolean
  spotifyAlbumId?: string
  source: 'static' | 'catalog' | 'merged'
}
```

In `src/data/releases.ts` convert every `tracks: ['A', 'B']` to `tracks: [{ name: 'A' }, { name: 'B' }]`, add `source: 'static'` to every entry, and delete the accessor functions at the bottom of the file (they move to `catalog.ts`). Export only `releases`.

- [ ] **Step 2: Create the fixture `src/test/fixtures/catalog.ts`**

```ts
import type { SpotifyCatalog } from '@/lib/catalog'

export const fixtureCatalog: SpotifyCatalog = {
  syncedAt: '2026-09-01T03:00:00.000Z',
  artists: {
    xiix: {
      spotifyArtistId: '4JwhMRnhXNf44gaWN2VlDO',
      albums: [
        {
          id: '5EC55CH3Tybf6kNJS0415L', name: 'SIXXTAPE', albumType: 'album', releaseDate: '2025-05-29',
          coverUrl: 'https://i.scdn.co/image/sixx.jpg', url: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L', totalTracks: 2,
          tracks: [
            { id: 't1', name: 'INTRO', durationMs: 90000, trackNumber: 1, url: 'u1', artists: ['XiiX'] },
            { id: 't2', name: 'SABAKI', durationMs: 180000, trackNumber: 2, url: 'u2', artists: ['XiiX', 'Pipí'] },
          ],
        },
        {
          id: 'NEWDROP00000000000000A', name: 'NEW DROP', albumType: 'single', releaseDate: '2026-09-01',
          coverUrl: 'https://i.scdn.co/image/new.jpg', url: 'https://open.spotify.com/album/NEWDROP00000000000000A', totalTracks: 1,
          tracks: [{ id: 't3', name: 'NEW DROP', durationMs: 200000, trackNumber: 1, url: 'u3', artists: ['XiiX'] }],
        },
      ],
    },
  },
  playlists: [],
}
```

- [ ] **Step 3: Write `src/lib/catalog.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mergeReleases } from './catalog'
import { fixtureCatalog } from '@/test/fixtures/catalog'
import type { Release } from '@/types'

const staticReleases: Release[] = [
  {
    id: 'sixxtape', slug: 'sixxtape', title: 'SIXXTAPE', artist: 'XiiX', artistSlug: 'xiix', type: 'album',
    releaseDate: '2025-05-29', coverArt: 'https://res.cloudinary.com/x/sixx.png',
    streamingLinks: { spotify: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L', youtube: 'https://youtu.be/abc' },
    featured: true, source: 'static',
  },
]
const names = { xiix: 'XiiX' }

describe('mergeReleases', () => {
  const merged = mergeReleases(staticReleases, fixtureCatalog, names)

  it('keeps curated fields and fills tracks from the catalog', () => {
    const sixx = merged.find((r) => r.slug === 'sixxtape')!
    expect(sixx.source).toBe('merged')
    expect(sixx.featured).toBe(true)
    expect(sixx.streamingLinks.youtube).toBe('https://youtu.be/abc')
    expect(sixx.coverArt).toBe('https://res.cloudinary.com/x/sixx.png') // curated art wins
    expect(sixx.tracks?.map((t) => t.name)).toEqual(['INTRO', 'SABAKI'])
    expect(sixx.spotifyAlbumId).toBe('5EC55CH3Tybf6kNJS0415L')
  })

  it('synthesizes releases for catalog albums not in static data', () => {
    const drop = merged.find((r) => r.spotifyAlbumId === 'NEWDROP00000000000000A')!
    expect(drop.source).toBe('catalog')
    expect(drop.slug).toBe('new-drop')
    expect(drop.artist).toBe('XiiX')
    expect(drop.type).toBe('single')
    expect(drop.streamingLinks.spotify).toContain('NEWDROP00000000000000A')
    expect(drop.coverArt).toBe('https://i.scdn.co/image/new.jpg')
  })

  it('sorts newest first', () => {
    expect(merged[0].slug).toBe('new-drop')
  })

  it('never produces duplicate slugs', () => {
    const slugs = merged.map((r) => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('returns static data untouched when the catalog is empty', () => {
    const out = mergeReleases(staticReleases, { syncedAt: null, artists: {}, playlists: [] }, names)
    expect(out).toHaveLength(1)
    expect(out[0].source).toBe('static')
  })
})
```

- [ ] **Step 4: Run → FAIL.** Create `src/lib/catalog.ts`:

```ts
import catalogJson from '@/data/generated/spotify-catalog.json'
import { releases as staticReleases } from '@/data/releases'
import { getAllArtists } from '@/data/artists'
import { extractSpotifyId } from '@/lib/spotify-links'
import { slugify } from '@/lib/utils'
import type { Release } from '@/types'

export interface CatalogTrack { id: string; name: string; durationMs: number; trackNumber: number; url: string; artists: string[] }
export interface CatalogAlbum {
  id: string; name: string; albumType: 'album' | 'single' | 'compilation'; releaseDate: string
  coverUrl: string; url: string; totalTracks: number; tracks: CatalogTrack[]
}
export interface CatalogPlaylist {
  id: string; name: string; description: string; coverUrl: string; url: string; trackCount: number
  tracks: { id: string; name: string; artists: string[]; durationMs: number; url: string }[]
}
export interface SpotifyCatalog {
  syncedAt: string | null
  artists: Record<string, { spotifyArtistId: string; albums: CatalogAlbum[] }>
  playlists: CatalogPlaylist[]
}

const toTracks = (album: CatalogAlbum) => album.tracks.map((t) => ({ name: t.name, durationMs: t.durationMs, artists: t.artists }))
const albumType = (a: CatalogAlbum): Release['type'] => (a.albumType === 'single' ? 'single' : 'album')

export function mergeReleases(statics: Release[], catalog: SpotifyCatalog, artistNames: Record<string, string>): Release[] {
  const byAlbumId = new Map<string, CatalogAlbum & { artistSlug: string }>()
  for (const [artistSlug, entry] of Object.entries(catalog.artists)) {
    for (const album of entry.albums) byAlbumId.set(album.id, { ...album, artistSlug })
  }

  const merged: Release[] = statics.map((r) => {
    const id = extractSpotifyId(r.streamingLinks.spotify)
    const album = id ? byAlbumId.get(id) : undefined
    if (!album) return r
    byAlbumId.delete(album.id)
    return {
      ...r,
      spotifyAlbumId: album.id,
      coverArt: r.coverArt || album.coverUrl,
      releaseDate: r.releaseDate || album.releaseDate,
      tracks: r.tracks?.length ? r.tracks : toTracks(album),
      source: 'merged',
    }
  })

  const used = new Set(merged.map((r) => r.slug))
  for (const album of byAlbumId.values()) {
    let slug = slugify(album.name)
    if (used.has(slug)) slug = `${slug}-${album.id.slice(0, 6).toLowerCase()}`
    used.add(slug)
    merged.push({
      id: `sp-${album.id}`, slug, title: album.name,
      artist: artistNames[album.artistSlug] ?? album.artistSlug, artistSlug: album.artistSlug,
      type: albumType(album), releaseDate: album.releaseDate, coverArt: album.coverUrl,
      tracks: toTracks(album), streamingLinks: { spotify: album.url },
      spotifyAlbumId: album.id, source: 'catalog',
    })
  }

  return merged.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
}

export function getCatalog(): SpotifyCatalog {
  return catalogJson as SpotifyCatalog
}

let cache: Release[] | null = null
export function getAllReleases(): Release[] {
  if (!cache) {
    const names = Object.fromEntries(getAllArtists().map((a) => [a.slug, a.name]))
    cache = mergeReleases(staticReleases, getCatalog(), names)
  }
  return cache
}
export const getReleaseBySlug = (slug: string) => getAllReleases().find((r) => r.slug === slug)
export const getFeaturedRelease = () => getAllReleases().find((r) => r.featured) ?? getAllReleases()[0]
export const getRecentReleases = (n: number) => getAllReleases().slice(0, n)
export const getReleasesByArtist = (slug: string) => getAllReleases().filter((r) => r.artistSlug === slug)
export const getPlaylists = (): CatalogPlaylist[] => getCatalog().playlists
```

- [ ] **Step 5: Re-export from `src/data/index.ts`** — replace the `releases` line with:

```ts
export { releases } from './releases'
export { getAllReleases, getReleaseBySlug, getFeaturedRelease, getRecentReleases, getReleasesByArtist, getPlaylists } from '@/lib/catalog'
```

- [ ] **Step 6: Wire consumers** — `Release.tsx` renders `release.tracks` as `{t.name}` with `formatDuration(t.durationMs)` when present; `Artist.tsx` passes `getReleasesByArtist(slug)` to `DiscographySection` (adapt its prop type to `Release[]`; remove its dependence on `artist.releases`/`artist.projects` if simpler — keep whichever renders). `ReleasesSection` needs no change.

- [ ] **Step 7: Verify**

Run: `npm test` → PASS. Run: `npm run build && npm run check:size` → PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(data): single Release type merged from static data and Spotify catalog

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: One platform registry

Closes F14. Kenya-first order: YouTube, Spotify, Audiomack, Boomplay, Apple Music, SoundCloud. Brand glyphs come from `simple-icons` (tree-shaken; ~1.5 KB for six paths) — **runtime dependency line item: `simple-icons`**. No hand-drawn brand paths.

**Files:**
- Create: `src/config/platforms.ts`, `src/config/platforms.test.ts`, `src/components/icons/BrandIcon.tsx`
- Modify: `src/components/artist/{PlatformLinks,StreamingBar,ReleaseCard}.tsx`, `src/pages/Release.tsx`, `src/components/shared/SocialLinks.tsx`, `package.json`

**Interfaces:**
- Produces: `PlatformKey = 'youtube' | 'spotify' | 'audiomack' | 'boomplay' | 'appleMusic' | 'soundcloud'`; `PLATFORMS: Record<PlatformKey, { label: string; color: string; iconSlug: string }>`; `PLATFORM_ORDER: PlatformKey[]`; `platformLinks(links: Partial<Record<PlatformKey, string>>): { key: PlatformKey; label: string; url: string; color: string }[]` (ordered, only present links); `<BrandIcon platform={key} size={n} />`.

- [ ] **Step 1: Install** `npm i simple-icons@^13`

- [ ] **Step 2: Write `src/config/platforms.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { platformLinks, PLATFORM_ORDER } from './platforms'

describe('platformLinks', () => {
  it('orders Kenya-first and drops missing links', () => {
    const out = platformLinks({ spotify: 's', youtube: 'y', soundcloud: 'sc' })
    expect(out.map((p) => p.key)).toEqual(['youtube', 'spotify', 'soundcloud'])
  })
  it('puts YouTube first in the canonical order', () => {
    expect(PLATFORM_ORDER[0]).toBe('youtube')
  })
})
```

- [ ] **Step 3: Run → FAIL.** Create `src/config/platforms.ts`:

```ts
export type PlatformKey = 'youtube' | 'spotify' | 'audiomack' | 'boomplay' | 'appleMusic' | 'soundcloud'

export const PLATFORM_ORDER: PlatformKey[] = ['youtube', 'spotify', 'audiomack', 'boomplay', 'appleMusic', 'soundcloud']

export const PLATFORMS: Record<PlatformKey, { label: string; color: string; iconSlug: string }> = {
  youtube: { label: 'YouTube', color: '#FF0000', iconSlug: 'youtube' },
  spotify: { label: 'Spotify', color: '#1DB954', iconSlug: 'spotify' },
  audiomack: { label: 'Audiomack', color: '#FFA200', iconSlug: 'audiomack' },
  boomplay: { label: 'Boomplay', color: '#00A3FF', iconSlug: 'boomplay' },
  appleMusic: { label: 'Apple Music', color: '#FA243C', iconSlug: 'applemusic' },
  soundcloud: { label: 'SoundCloud', color: '#FF5500', iconSlug: 'soundcloud' },
}

export function platformLinks(links: Partial<Record<PlatformKey, string>>) {
  return PLATFORM_ORDER.flatMap((key) => {
    const url = links[key]
    return url ? [{ key, url, label: PLATFORMS[key].label, color: PLATFORMS[key].color }] : []
  })
}
```

- [ ] **Step 4: Create `src/components/icons/BrandIcon.tsx`**

```tsx
import { siYoutube, siSpotify, siAudiomack, siApplemusic, siSoundcloud } from 'simple-icons'
import type { PlatformKey } from '@/config/platforms'

// simple-icons has no Boomplay glyph at the time of writing; render a lettermark.
const PATHS: Partial<Record<PlatformKey, string>> = {
  youtube: siYoutube.path,
  spotify: siSpotify.path,
  audiomack: siAudiomack.path,
  appleMusic: siApplemusic.path,
  soundcloud: siSoundcloud.path,
}

export function BrandIcon({ platform, size = 20, className }: { platform: PlatformKey; size?: number; className?: string }) {
  const d = PATHS[platform]
  if (!d) {
    return (
      <span aria-hidden className={className} style={{ width: size, height: size, fontSize: size * 0.7, lineHeight: `${size}px`, textAlign: 'center', fontWeight: 700, display: 'inline-block' }}>B</span>
    )
  }
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={d} />
    </svg>
  )
}
```

If `simple-icons` exports `siBoomplay` at install time, add it to `PATHS` and delete the lettermark branch.

- [ ] **Step 5: Replace the four local maps** — in `PlatformLinks.tsx`, `StreamingBar.tsx`, `artist/ReleaseCard.tsx`, `pages/Release.tsx` delete the local `platforms`/`platformConfig`/`streamingPlatforms` constants and render `platformLinks(release.streamingLinks)` (or the artist's links mapped onto `PlatformKey`s) with `<BrandIcon>`. `SocialLinks.tsx`: replace the `Music2` stand-ins with `BrandIcon` for spotify/soundcloud/youtube.

- [ ] **Step 6: Verify**

Run: `grep -rn "platformConfig\|streamingPlatforms" src/ || echo CLEAN` → `CLEAN`. Run: `npm test && npm run build` → PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: single Kenya-first platform registry with brand glyphs

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: SZNals as MDX (journal that can publish)

Per D8. Articles live in `content/sznals/*.mdx`, each exporting `meta`. Drafts are listed as "in the works" with no link (no dead ends); published articles get a page. The six existing entries have excerpts but **no bodies** — they become drafts; writing them is a content task (Task 27).

**Files:**
- Create: `content/sznals/*.mdx` (6), `src/content/sznals.ts`, `src/content/sznals.test.ts`, `src/types/mdx.d.ts`, `docs/CONTENT-GUIDE.md`
- Delete: `src/data/sznals.ts`
- Modify: `vite.config.ts`, `vitest.config.ts`, `src/data/index.ts`, `src/types/index.ts`, `src/pages/{SZNals,SZNal}.tsx`, `src/components/shared/SZNalCard.tsx`, `src/components/sections/SZNalsSection.tsx`, `package.json`

**Interfaces:**
- Produces from `src/content/sznals.ts`: `SZNalMeta { slug; title; excerpt; category; author; publishedDate; readTime; status: 'draft' | 'published'; cover?: string }`; `getAllSZNals(): SZNalMeta[]` (published, newest first); `getDraftSZNals(): SZNalMeta[]`; `getSZNalBySlug(slug): SZNalMeta | undefined`; `loadSZNal(slug): Promise<React.ComponentType>` (lazy MDX component).

- [ ] **Step 1: Install** `npm i -D @mdx-js/rollup@^3`

- [ ] **Step 2: Register the plugin** in both `vite.config.ts` and `vitest.config.ts`:

```ts
import mdx from '@mdx-js/rollup'
// plugins:
plugins: [{ enforce: 'pre', ...mdx({ jsxImportSource: 'react' }) }, react(), tailwindcss()],
```

(omit `tailwindcss()` in vitest). Create `src/types/mdx.d.ts`:

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const meta: import('@/content/sznals').SZNalMeta
  const Component: ComponentType<{ components?: Record<string, ComponentType<unknown>> }>
  export default Component
}
```

- [ ] **Step 3: Write `src/content/sznals.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { getAllSZNals, getDraftSZNals, getSZNalBySlug, loadSZNal } from './sznals'

describe('sznals content', () => {
  it('derives slugs from filenames and sorts published newest first', () => {
    const all = getAllSZNals()
    for (let i = 1; i < all.length; i++) expect(all[i - 1].publishedDate >= all[i].publishedDate).toBe(true)
    for (const s of all) expect(s.slug).toMatch(/^[a-z0-9-]+$/)
  })
  it('separates drafts from published', () => {
    for (const d of getDraftSZNals()) expect(d.status).toBe('draft')
    for (const p of getAllSZNals()) expect(p.status).toBe('published')
  })
  it('loads a component for a known slug', async () => {
    const first = [...getAllSZNals(), ...getDraftSZNals()][0]
    expect(first).toBeDefined()
    expect(getSZNalBySlug(first.slug)?.title).toBe(first.title)
    const Comp = await loadSZNal(first.slug)
    expect(typeof Comp).toBe('function')
  })
})
```

- [ ] **Step 4: Run → FAIL.** Create `src/content/sznals.ts`:

```ts
import type { ComponentType } from 'react'

export interface SZNalMeta {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedDate: string
  readTime: string
  status: 'draft' | 'published'
  cover?: string
}

type Loader = () => Promise<{ default: ComponentType }>
const loaders = import.meta.glob<{ default: ComponentType }>('/content/sznals/*.mdx')
const metas = import.meta.glob<Omit<SZNalMeta, 'slug'>>('/content/sznals/*.mdx', { eager: true, import: 'meta' })

const slugOf = (path: string) => path.split('/').pop()!.replace(/\.mdx$/, '')

const ALL: SZNalMeta[] = Object.entries(metas)
  .map(([path, meta]) => ({ ...meta, slug: slugOf(path) }))
  .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))

export const getAllSZNals = () => ALL.filter((s) => s.status === 'published')
export const getDraftSZNals = () => ALL.filter((s) => s.status === 'draft')
export const getSZNalBySlug = (slug: string) => ALL.find((s) => s.slug === slug)

export async function loadSZNal(slug: string): Promise<ComponentType> {
  const entry = Object.entries(loaders).find(([path]) => slugOf(path) === slug)
  if (!entry) throw new Error(`Unknown SZNal: ${slug}`)
  return ((await (entry[1] as Loader)()).default)
}
```

- [ ] **Step 5: Convert the six entries.** For each object in `src/data/sznals.ts` create `content/sznals/<slug>.mdx`:

```mdx
export const meta = {
  title: "Decoding Nairobi's Sonic Signature",
  excerpt: "How XiiX captures the city's unique frequencies and translates them into immersive soundscapes that define Culture SZN's sonic identity.",
  category: 'Sound & Culture',
  author: 'Culture SZN Editorial',
  publishedDate: '2025-12-15',
  readTime: '8 min read',
  status: 'draft',
}

{/* Body pending — see docs/ASSETS-NEEDED.md. Do not publish without a body. */}
```

(Fix the `Xiix` → `XiiX` spelling while converting.) Then `git rm src/data/sznals.ts`, remove its exports from `src/data/index.ts` and re-export `getAllSZNals, getDraftSZNals, getSZNalBySlug` from `@/content/sznals`; delete the `SZNal` interface from `src/types/index.ts` and replace usages with `SZNalMeta`. Update the two tests that imported `sznals`: in `src/routes.test.ts` replace `sznals` with `getAllSZNals, getDraftSZNals` and the assertion with `expect([...getAllSZNals(), ...getDraftSZNals()].length).toBeGreaterThan(0)`; in `src/data/data.test.ts` iterate `[...getAllSZNals(), ...getDraftSZNals()]` and check `s.cover ?? ''` instead of `s.image`.

- [ ] **Step 6: Pages**

`SZNals.tsx`: published grid of `<SZNalCard>` (links) + a second list "In the works" rendering drafts as non-link cards (title, category, excerpt) — if there are no published articles, the heading reads "First SZNals dropping soon" above the drafts. `SZNalsSection.tsx` on Home: `getAllSZNals().slice(0,3)`, falling back to drafts as non-link teasers. `SZNalCard` gains `asLink?: boolean` (default true) — when false it renders a `<div>` with the same content and a small "In the works" label.

`SZNal.tsx`: for a published slug, `React.lazy`-style load:

```tsx
import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSZNalBySlug, loadSZNal } from '@/content/sznals'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { formatDate } from '@/lib/format'

export function SZNal() {
  const { slug } = useParams<{ slug: string }>()
  const meta = slug ? getSZNalBySlug(slug) : undefined
  const published = meta?.status === 'published'
  const [Body, setBody] = useState<ComponentType | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!slug || !published) return
    let alive = true
    loadSZNal(slug).then((C) => alive && setBody(() => C)).catch(() => alive && setFailed(true))
    return () => { alive = false }
  }, [slug, published])

  useDocumentHead({ title: `${meta?.title ?? 'SZNal'} | ${SITE.name}`, description: meta?.excerpt })

  if (!meta || !published) {
    return (
      <section className="section-szn pt-32"><div className="container-szn">
        <h1 className="text-4xl font-bold mb-4">This SZNal isn't out yet</h1>
        <Link to="/sznals">Back to SZNals</Link>
      </div></section>
    )
  }
  return (
    <article className="section-szn pt-32"><div className="container-szn max-w-3xl">
      <p className="uppercase tracking-wider text-sm mb-3">{meta.category}</p>
      <h1 className="text-4xl font-bold mb-4">{meta.title}</h1>
      <p className="text-sm mb-8">{meta.author} · {formatDate(meta.publishedDate)} · {meta.readTime}</p>
      {failed && <p role="alert">Couldn't load this piece. <Link to="/sznals">Back to SZNals</Link></p>}
      {Body ? <div className="prose-szn"><Body /></div> : !failed && <p aria-busy="true">Loading…</p>}
    </div></article>
  )
}
```

- [ ] **Step 7: Create `docs/CONTENT-GUIDE.md`** — how to add an article (filename = slug, `meta` fields, `status: 'published'` to go live, image guidance via Cloudinary, run `npm test` then commit). Keep it under 60 lines.

- [ ] **Step 8: Verify**

Run: `npm test` → PASS (including link integrity — no draft link is rendered). Run: `npm run build` → PASS; confirm each `.mdx` is its own chunk in `dist/assets`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(journal): SZNals as MDX with draft/published states and per-article code splitting

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 14: Newsletter endpoint (Resend)

Closes F24 server-side. Plain `fetch` to Resend's Contacts API; no SDK. Honeypot + server-side validation. Confirm D7 with the user before starting.

**Files:**
- Create: `api/_lib/newsletter.ts`, `api/_lib/newsletter.test.ts`, `api/newsletter/subscribe.ts`

**Interfaces:**
- Produces: `POST /api/newsletter/subscribe` with JSON `{ email: string; website?: string }` → `200 { ok: true }` | `400 { error: 'invalid_email' }` | `502 { error: 'upstream' }`. `api/_lib/newsletter.ts` exports `isValidEmail(s: string): boolean` and `subscribeContact(email: string, env: { apiKey: string; audienceId: string }, fetchImpl?: typeof fetch): Promise<'ok' | 'upstream_error'>`.

- [ ] **Step 1: Write `api/_lib/newsletter.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { isValidEmail, subscribeContact } from './newsletter'

describe('isValidEmail', () => {
  it('accepts normal addresses and rejects junk', () => {
    expect(isValidEmail('fan@example.co.ke')).toBe(true)
    expect(isValidEmail('nope')).toBe(false)
    expect(isValidEmail('a@b')).toBe(false)
  })
})

describe('subscribeContact', () => {
  const env = { apiKey: 'k', audienceId: 'aud' }
  it('posts to the audience contacts endpoint', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true })
    expect(await subscribeContact('fan@example.co.ke', env, f as unknown as typeof fetch)).toBe('ok')
    const [url, init] = f.mock.calls[0]
    expect(url).toBe('https://api.resend.com/audiences/aud/contacts')
    expect(init.headers.Authorization).toBe('Bearer k')
    expect(JSON.parse(init.body)).toEqual({ email: 'fan@example.co.ke', unsubscribed: false })
  })
  it('treats a 409 duplicate as ok', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 409 })
    expect(await subscribeContact('fan@example.co.ke', env, f as unknown as typeof fetch)).toBe('ok')
  })
  it('reports upstream failure', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    expect(await subscribeContact('fan@example.co.ke', env, f as unknown as typeof fetch)).toBe('upstream_error')
  })
})
```

- [ ] **Step 2: Run → FAIL.** Create `api/_lib/newsletter.ts`:

```ts
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(s: string): boolean {
  return EMAIL.test(s) && s.length <= 254
}

export async function subscribeContact(
  email: string,
  env: { apiKey: string; audienceId: string },
  fetchImpl: typeof fetch = fetch,
): Promise<'ok' | 'upstream_error'> {
  const res = await fetchImpl(`https://api.resend.com/audiences/${env.audienceId}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  })
  if (res.ok || res.status === 409) return 'ok'
  return 'upstream_error'
}
```

- [ ] **Step 3: Create `api/newsletter/subscribe.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json, methodNotAllowed, readJsonBody } from '../_lib/http'
import { isValidEmail, subscribeContact } from '../_lib/newsletter'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  const body = readJsonBody<{ email?: string; website?: string }>(req)
  if (body?.website) return json(res, 200, { ok: true }) // honeypot: pretend success
  const email = (body?.email ?? '').trim().toLowerCase()
  if (!isValidEmail(email)) return json(res, 400, { error: 'invalid_email' })

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) return json(res, 502, { error: 'upstream' })

  const result = await subscribeContact(email, { apiKey, audienceId })
  return result === 'ok' ? json(res, 200, { ok: true }) : json(res, 502, { error: 'upstream' })
}
```

- [ ] **Step 4: Verify**

Run: `npm test -- newsletter` → 5 PASS. Run: `npm run typecheck && npm run lint` → exit 0.
Manual (once Vercel env vars are set): `vercel dev` then `curl -X POST localhost:3000/api/newsletter/subscribe -H 'content-type: application/json' -d '{"email":"you@example.com"}'` → `{"ok":true}`.

- [ ] **Step 5: Commit**

```bash
git add api
git commit -m "feat(newsletter): Resend-backed subscribe endpoint with validation and honeypot

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 15: Join SZN page (WhatsApp + newsletter form)

Per D2. Closes F24 client-side and the last inert CTA.

**Files:**
- Create: `src/lib/newsletter-client.ts`, `src/components/join/NewsletterForm.tsx`, `src/components/join/NewsletterForm.test.tsx`, `src/pages/Join.test.tsx`
- Modify: `src/pages/Join.tsx`, `src/components/layout/Footer.tsx`

**Interfaces:**
- Produces: `subscribe(email: string): Promise<'ok' | 'invalid' | 'error'>`; `<NewsletterForm />` (states: idle → submitting → success | error, honeypot field `website` visually hidden, `aria-live` status); `<Join />` renders the WhatsApp CTA only when `SITE.whatsappCommunityUrl` is non-empty.

- [ ] **Step 1: Write `src/components/join/NewsletterForm.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { NewsletterForm } from './NewsletterForm'

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }))
}

describe('NewsletterForm', () => {
  it('shows success after a 200', async () => {
    mockFetch(200, { ok: true })
    render(<NewsletterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'fan@example.co.ke')
    await userEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByRole('status')).toHaveTextContent(/you're in/i)
  })
  it('shows an inline error on a 400', async () => {
    mockFetch(400, { error: 'invalid_email' })
    render(<NewsletterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'bad')
    await userEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/valid email/i)
  })
  it('shows a retryable error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<NewsletterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'fan@example.co.ke')
    await userEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/try again/i)
  })
})
```

- [ ] **Step 2: Write `src/pages/Join.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderAt } from '@/test/render'

describe('Join page', () => {
  it('hides the WhatsApp CTA when no community URL is configured', async () => {
    vi.doMock('@/config/site', async (orig) => {
      const m = await orig<typeof import('@/config/site')>()
      return { SITE: { ...m.SITE, whatsappCommunityUrl: '' } }
    })
    renderAt('/join')
    expect(screen.queryByRole('link', { name: /whatsapp/i })).toBeNull()
    expect(screen.getByRole('heading', { name: /join szn/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run → FAIL.** Create `src/lib/newsletter-client.ts`:

```ts
export async function subscribe(email: string): Promise<'ok' | 'invalid' | 'error'> {
  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) return 'ok'
    if (res.status === 400) return 'invalid'
    return 'error'
  } catch {
    return 'error'
  }
}
```

- [ ] **Step 4: Create `src/components/join/NewsletterForm.tsx`**

```tsx
import { useId, useState, type FormEvent } from 'react'
import { Button, Input } from '@/components/ui'
import { subscribe } from '@/lib/newsletter-client'

type State = 'idle' | 'submitting' | 'success' | 'invalid' | 'error'

export function NewsletterForm() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState<State>('idle')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (website) { setState('success'); return }
    setState('submitting')
    const result = await subscribe(email.trim())
    setState(result === 'ok' ? 'success' : result)
  }

  if (state === 'success') {
    return <p role="status">You're in. Watch your inbox for the next SZN.</p>
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <label htmlFor={`${id}-email`} className="block">Email</label>
      <Input id={`${id}-email`} type="email" autoComplete="email" inputMode="email" required
             value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="sr-only" aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {state === 'invalid' && <p role="alert">Enter a valid email address.</p>}
      {state === 'error' && <p role="alert">Couldn't subscribe right now — please try again.</p>}
      <Button type="submit" variant="primary" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </Button>
      <p className="text-sm">One email when something drops. Unsubscribe any time.</p>
    </form>
  )
}
```

- [ ] **Step 5: Rewrite `src/pages/Join.tsx`**

```tsx
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { NewsletterForm } from '@/components/join/NewsletterForm'
import { Button } from '@/components/ui'

export function Join() {
  useDocumentHead({ title: `Join SZN | ${SITE.name}`, description: 'Join the Culture SZN community on WhatsApp and get releases first by email.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="join-heading">
      <div className="container-szn max-w-2xl">
        <h1 id="join-heading" className="text-4xl font-bold mb-4">Join SZN</h1>
        <p className="text-lg mb-10">Be first to every drop, show, and SZNal.</p>
        {SITE.whatsappCommunityUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-3">WhatsApp community</h2>
            <a href={SITE.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">Join on WhatsApp</Button>
            </a>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold mb-3">Newsletter</h2>
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
```

In `Footer.tsx`, the "Join The SZN" column becomes a short line plus `<Link to="/join">` (no form in the footer).

- [ ] **Step 6: Verify**

Run: `npm test` → PASS. Run: `npm run build` → PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(join): Join SZN page with WhatsApp community CTA and working newsletter form

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

**Phase 2 exit criteria:** catalog JSON committed and syncing on schedule; `/releases/:slug` shows catalog track lists; six MDX drafts; newsletter round-trips to Resend; one platform registry; CI green.

---

# PHASE 3 — The Impeccable Revamp

**Ships:** a new visual world — authentically African, world-class — chosen with the user through impeccable's seeded direction round, built with full commitment on every surface, reviewed by the finish reviewer, and recorded in `DESIGN.md`.

**How this phase differs from the others.** The plan locks *structure, content, states, accessibility, tests and process*. It deliberately does **not** lock palette, type, composition or motion — impeccable forbids choosing those before the seeded direction round with the user, and doing so here would collapse the revamp back into the template it replaces. Each build task therefore says "in the contract's vocabulary": the executor reads the direction contract (Task 17) and `src/styles/tokens.css` (Task 18) and builds from those. Every Phase 3 task starts with `node <impeccable-base>/scripts/context.mjs` **once per session** (base: `/home/kkk/.claude/plugins/cache/impeccable/impeccable/4.1.2/skills/impeccable` — if that path no longer exists, invoke the `impeccable:impeccable` skill and use the base directory it reports). Before editing any UI file, the executor loads `reference/craft-floor.md`.

**The rut to refuse (from today's audit):** near-black ground, orange→purple→blue 135° gradient text, glass cards, Space Grotesk/Inter, everything `fadeInUp`. Its predictable opposite — cream paper, serif display, terracotta accent — is equally the rut. Neither is allowed to be the assigned direction.

**Surface modes:** `/` Persuade · `/artists`, `/artists/:slug`, `/releases`, `/releases/:slug` Experience · `/sznals`, `/sznals/:slug` Read · `/join` Persuade · `404` Operate.

---

### Task 16: PRODUCT.md (impeccable `init`)

Captures product truth confirmed in the 2026-09-18 interview. `init`'s interview requirement is satisfied by that session; write the file verbatim, then confirm with the user in one message before proceeding to Task 17. Do not add visual decisions here.

**Files:**
- Create: `PRODUCT.md`

- [ ] **Step 1: Run** `node <impeccable-base>/scripts/context.mjs` (expect `NO_PRODUCT_MD`).

- [ ] **Step 2: Create `PRODUCT.md`**

```markdown
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: music fans in Nairobi and the Kenyan diaspora, 16–30, discovering and following the collective's artists — on mid-range Android phones over metered mobile data, often on the move (matatu, campus, work breaks), frequently arriving from a WhatsApp or Instagram link. Their job: hear the latest drop *now* on a platform they already use (YouTube first; Spotify, Audiomack, Boomplay), learn who the artist is, and share it.

Secondary: the artists and the Culture SZN team, who need the site to be the canonical link-in-bio for every release; and industry/press looking for credits, bios and streaming links.

## Product Purpose

Culture SZN is the home of a Nairobi music-and-design collective. The site exists to make every release findable and playable in one tap, to present each artist as a serious body of work rather than a social feed, and to grow a community (WhatsApp + email) that hears about drops first. Success: a visitor from a shared link can play a release within seconds on their own platform, and chooses to join.

## Positioning

A collective's own canonical catalogue, kept current automatically from Spotify and enriched with the Kenyan platforms (YouTube, Audiomack, Boomplay) that aggregators ignore — built for Nairobi's data reality rather than a desktop-first label template.

## Operating Context

- Content sources: JSON artist profiles in `src/data/artists/`, curated releases in `src/data/releases.ts`, a Spotify catalog synced daily to `src/data/generated/spotify-catalog.json`, MDX journal entries in `content/sznals/`.
- Distribution: links shared in WhatsApp groups and Instagram bios/stories; link previews must render correctly there.
- Hosting: Vercel; static-first; serverless only for the newsletter.
- Locale: English (Kenya), Africa/Nairobi time; Sheng and Swahili appear in titles, names and copy and must render correctly (e.g. "Pipí Ciagi", "SI UONGO").

## Capabilities and Constraints

- Surfaces: Home, Artists index, Artist profile, Releases (with curated playlists), Release detail, SZNals index, SZNal article, Join SZN, 404.
- Playback: Spotify Embed (click-to-load) and YouTube (click-to-play). No user login. No in-page custom player.
- Join SZN = WhatsApp community link + email newsletter (Resend). No accounts.
- Out of scope: events, merch, live sessions, archives, community forum.
- Hard constraints: bundle budget enforced in CI; no third-party embed loads before a tap; no stock photography presented as members; no fabricated stats.
- Terminology: `Culture SZN`, `XiiX`, `SZNals` (journal), `Join SZN`.

## Brand Commitments

Name: Culture SZN. Voice: confident, direct, Nairobi-rooted, not hype. Binding constraint from the user: the identity must read as **authentically African and world-class** — rooted in Nairobi's real visual culture, not a generic "Afro" gradient treatment and not a Western template with Kenyan copy. No logo, palette or typeface exists yet; the direction round decides them.

## Evidence on Hand

- Real: artist JSON for XiiX, Wavy SRF, Pipí Ciagi (bios, credits, links, some Cloudinary cover art); 8 curated releases with real cover art and Spotify/Apple/SoundCloud links; XiiX Spotify artist id.
- Absent (do not fabricate): collective logo; member photography; show/studio photography; Wavy and Pipí Spotify ids; Culture SZN playlist ids; WhatsApp community URL; verified collective social handles; bodies for the six journal drafts. Tracked in `docs/ASSETS-NEEDED.md`.

## Product Principles

1. Playable in one tap, on the visitor's platform — YouTube is never more than one tap away.
2. Every kilobyte is paid for by the visitor; earn it.
3. Never lie: no invented numbers, people, or images.
4. The artist is a body of work, not a feed.
5. Every page is a share-ready front door.

## Accessibility & Inclusion

Touch targets ≥ 44 px; WCAG AA contrast; full keyboard operability; `prefers-reduced-motion` honoured; content readable without JavaScript-dependent embeds; diacritics in names rendered correctly.
```

- [ ] **Step 3: Confirm** the record with the user in one message (captured vs. deliberately undecided). Apply any corrections.

- [ ] **Step 4: Commit**

```bash
git add PRODUCT.md
git commit -m "docs: PRODUCT.md — confirmed product truth for the revamp

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 17: Direction round — choose the visual world with the user

Follows `reference/new-work.md` §3 "Create or replace the visual world" and §5 "Record the decision". This is a **redesign**: product truth, content and function are preserved; the old look is anti-reference. The output is a locked direction and a written contract — no UI code is written in this task.

**Files:**
- Modify: `index.html` (contract comment as first child of `<body>`)
- Create: `.impeccable/` artifacts written by the scripts; surface brief for `/`
- Create: `docs/design/direction-round.md` (the seven candidates, the hand, verdicts, the user's choice)

- [ ] **Step 1: Run context and load the playbook**

Run: `node <impeccable-base>/scripts/context.mjs` → expect `EXISTING_VISUAL_SYSTEM` + `BUILD_INIT_REQUIRED` satisfied by `PRODUCT.md`. Read `reference/new-work.md` in full. Note whether `IMAGE_GEN_AVAILABLE` is reported: with image generation the round is **comp-led** by default (each card gets a comp; the chosen comp becomes the measured contract); without it the round is **code-led** and the ambition lives in the contract's FIRST VIEWPORT block. State which applies in the first message to the user.

- [ ] **Step 2: Ask the one round of questions new-work permits** (structured question tool, 2–3 questions), only for what PRODUCT.md does not settle: e.g. which real thing the first viewport should *prove* (the newest drop playing? the roster? the city?), what must remain untouched (artist JSON content, copy rules), and what would make a polished result feel wrong (anything that reads as a tourist's idea of "African"; anything that reads as a Western label template).

- [ ] **Step 3: Derive seven grounded candidates** (new-work §3 steps 1–3). Name the mechanism (a self-updating canonical catalogue for a Nairobi collective), the scene (a phone in a matatu, a WhatsApp link, 4G that drops), the cultural home (Nairobi's *actual* graphic and screen traditions). List seven concrete visual systems the audience knows by heart, each with why it resonates and can carry the mechanism, spanning **at least three material families** — for instance from the worlds of matatu/nganya art and route boards, kanga/leso cloth with its printed *jina* proverbs, hand-painted duka and barbershop signage, Kenyan concert/gengetone poster and cover-art traditions, benga-era record sleeves, Kenyan broadsheet and magazine layout, USSD/M-Pesa and feature-phone screen grammar, coast Swahili carved-door and dhow ornament. These are research starting points, not the list: the executor must look, verify, and write their own seven with the audience's real artefacts, and keep both ruts out.

- [ ] **Step 4: Roll and present**

Run: `node <impeccable-base>/scripts/concept-seed.mjs --scope direction --mode persuade` and follow what it prints exactly: fuse each dealt challenger with the product, judge on audience identification and product clarity, raise the assigned direction by each declined challenger's one discipline, write the options payload (`serve-question.mjs --schema` first), then `node <impeccable-base>/scripts/serve-question.mjs --start --payload <file>`, open the URL for the user, and `--wait --key <key>` until they lock a card. Handle `reroll`, `safer`, `bolder`, and the canon exit per new-work. Exit code 2 on start → present the same options via the structured question tool.

- [ ] **Step 5: Record the contract** as an HTML comment, first child of `<body>` in `index.html`, ≤ 150 words, five blocks + FINISH line:

```html
<body>
  <!--
  THESIS: …one idea this site owns, and the category-default arrangement it refuses…
  OWN-WORLD: …palette and component language, recognizable with all content removed…
  STORY: …what the visitor understands, believes, and does…
  FIRST VIEWPORT: …exact composition, what is where at what scale, where the primary action sits…
  FORM: …chosen form, its rank on the ordered list, seed key <key>…
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
  -->
  <div id="root"></div>
```

Write the `/` surface brief: `node <impeccable-base>/scripts/surface-brief.mjs write src/pages/Home.tsx <body-file>` (scope + mode, audience, action, proof, constraints, chosen direction, memorable moment, unresolved decisions). Save the round's record to `docs/design/direction-round.md`.

- [ ] **Step 6: Verify the contract survives the build**

Run: `npm run build && grep -c "<seed key>" dist/index.html` → `1`.

- [ ] **Step 7: Commit**

```bash
git add index.html .impeccable docs/design
git commit -m "design: lock visual direction <form name> (seed <key>) and record the contract

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 18: Tokens, self-hosted type, and primitives in the new world

Replaces the template's design system with the contract's. Closes F15, F29.

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/fonts.css`, `public/fonts/*.woff2`, `src/styles/tokens.test.ts`
- Modify: `src/index.css`, `index.html` (remove Google Fonts links, add preloads), `src/components/ui/{Button,Card,Input,Badge,Typography,LoadingStates}.tsx`, `src/lib/motion.ts`

**Interfaces:**
- Produces: CSS custom properties on `:root` named by role, not hue: `--bg`, `--bg-raised`, `--fg`, `--fg-muted`, `--accent`, `--accent-fg`, `--line`, `--font-display`, `--font-body`, `--radius`, `--space-{1..8}`, `--measure`; the same exposed to Tailwind via `@theme` as `--color-bg`, `--color-fg`, … so utilities are `bg-bg`, `text-fg`, `text-fg-muted`, `bg-accent`, `border-line`, `font-display`, `font-body`. Every later task styles with these and nothing else.

- [ ] **Step 1: Load `reference/craft-floor.md`** (first UI edit of the phase).

- [ ] **Step 2: Write `src/styles/tokens.test.ts`** — the test reads the CSS as text and guards against the rut and against untokenised colour:

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const tokens = readFileSync('src/styles/tokens.css', 'utf8')
const index = readFileSync('src/index.css', 'utf8')

describe('design tokens', () => {
  it('defines every role token', () => {
    for (const t of ['--bg', '--bg-raised', '--fg', '--fg-muted', '--accent', '--accent-fg', '--line', '--font-display', '--font-body', '--radius', '--measure'])
      expect(tokens, t).toContain(`${t}:`)
  })
  it('does not carry the old template palette or faces', () => {
    for (const bad of ['#FF6B35', '#6A11CB', '#2575FC', 'Space Grotesk', 'Inter', 'gradient-sunset'])
      expect(tokens + index, bad).not.toContain(bad)
  })
  it('keeps a visible focus style', () => {
    expect(index).toMatch(/:focus-visible/)
  })
})
```

- [ ] **Step 3: Create `src/styles/tokens.css`** with the contract's values (the executor fills the literal values from the OWN-WORLD block; the structure is fixed):

```css
:root {
  --bg: <contract>;
  --bg-raised: <contract>;
  --fg: <contract>;
  --fg-muted: <contract>;
  --accent: <contract>;
  --accent-fg: <contract>;
  --line: <contract>;
  --font-display: '<contract display face>', system-ui, sans-serif;
  --font-body: '<contract body face>', system-ui, sans-serif;
  --radius: <contract>;
  --measure: 64ch;
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem; --space-6: 2rem; --space-7: 3rem; --space-8: 5rem;
  color-scheme: <light|dark per the contract's physical scene>;
}
@theme {
  --color-bg: var(--bg);
  --color-bg-raised: var(--bg-raised);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-accent: var(--accent);
  --color-accent-fg: var(--accent-fg);
  --color-line: var(--line);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --radius-szn: var(--radius);
}
```

`<contract>` markers are filled in this task from the FORM/OWN-WORLD blocks — a token left as a marker fails the build (invalid CSS) by design.

- [ ] **Step 4: Self-host the faces.** Obtain the licensed WOFF2 files for the contract's display and body faces (Google Fonts → download, or the foundry), subset to Latin + Latin Extended (for `í`, `è`) with `pyftsubset` if available, and place them in `public/fonts/`. Create `src/styles/fonts.css`:

```css
@font-face {
  font-family: '<display face>';
  src: url('/fonts/<display>.woff2') format('woff2');
  font-weight: <range>;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: '<body face>';
  src: url('/fonts/<body>.woff2') format('woff2');
  font-weight: <range>;
  font-display: swap;
}
```

In `index.html`, delete the three Google Fonts `<link>`s and add `<link rel="preload" href="/fonts/<display>.woff2" as="font" type="font/woff2" crossorigin>`. Record each file's licence and source in `public/fonts/LICENSES.md`.

- [ ] **Step 5: Rewrite `src/index.css`** — `@import "tailwindcss"; @import "./styles/fonts.css"; @import "./styles/tokens.css";` then base styles in the contract's vocabulary: `body { background: var(--bg); color: var(--fg); font-family: var(--font-body); }`, headings in `--font-display`, a global `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`, `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`, `.container-szn` and `.section-szn` kept as names but re-spaced from `--space-*`. Delete the old `:root` palette, gradient/glow/glass utilities, and scrollbar theming.

- [ ] **Step 6: Rebuild the primitives** in `src/components/ui/` — `Button` (variants `primary | secondary | ghost`, sizes `md | lg`, min-height 44 px, uses `bg-accent text-accent-fg`), `Card`, `Input` (44 px, `border-line`, focus ring), `Badge`, `Heading/Text/SectionHeader` (type scale from the contract), `LoadingStates`. Every atom in the form's vocabulary — "a stock component inside a committed form is a lapse". Keep the exported names so call sites compile.

- [ ] **Step 7: Reduce `src/lib/motion.ts`** to the grammar the contract names (Task 25 orchestrates it). Keep `staggerContainer` and one entrance variant so existing sections still compile; delete `pulseGlow`, `float`, and unused variants.

- [ ] **Step 8: Verify**

Run: `npm test -- tokens` → PASS. Run: `npm run build && npm run check:size` → PASS. Run: `node <impeccable-base>/scripts/detect.mjs --json src/index.css src/styles src/components/ui` → fix mechanical findings.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "design: role-based tokens, self-hosted subset fonts, and primitives in the new world

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 19: Layout shell — header, footer, 404, skip link

Closes F30. The shell is rebuilt in the world; it must not be a generic sticky bar with a gradient wordmark.

**Files:**
- Modify: `src/components/layout/{Header,Footer,Layout}.tsx`, `src/pages/NotFound.tsx`
- Test: `src/components/layout/Layout.test.tsx`

**Interfaces:**
- Produces: `Layout` renders `<a href="#main" class="skip-link">Skip to content</a>`, `<header>`, `<main id="main">`, `<footer>`; `Header` nav from `NAV_LINKS` with `aria-current="page"`; mobile menu is a `<dialog>`-free disclosure using `aria-expanded` and `inert` on the page content, scroll-locked via a `body` class not inline style.

- [ ] **Step 1: Write `src/components/layout/Layout.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from '@/test/render'

describe('Layout shell', () => {
  it('has landmarks and a skip link', () => {
    renderAt('/join')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })
  it('marks the current nav item', () => {
    renderAt('/join')
    expect(screen.getAllByRole('link', { name: /join szn/i })[0]).toHaveAttribute('aria-current', 'page')
  })
  it('toggles the mobile menu accessibly', async () => {
    renderAt('/')
    const btn = screen.getByRole('button', { name: /menu/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })
  it('404 offers a way back', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home|back/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run → FAIL.** Rebuild `Header.tsx` (wordmark as text in `--font-display` until a logo exists — no gradient; nav; "Join SZN" as a `<Link to="/join">` styled as the primary button; menu button with `aria-expanded` + `aria-controls`; `Escape` closes; scroll lock via `document.body.classList.toggle('menu-open')` and `.menu-open { overflow: hidden }` in `index.css`), `Footer.tsx` (wordmark, `FOOTER_LINKS`, `SITE.socials` with `BrandIcon`, "Crafted by VOYANI" credit, `© {year} Culture SZN`), `Layout.tsx` (skip link, `<main id="main">`), `NotFound.tsx` (h1, one line of copy in the voice, link home, link to `/releases`). Compose in the contract's vocabulary.

- [ ] **Step 3: Verify**

Run: `npm test` → PASS. Run: `npm run build` → PASS. Detector over the four files → clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "design(shell): header, footer, 404 and skip link rebuilt in the new world

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 20: Media components — click-to-load players, images, share

C1 and C3 made concrete. No third-party iframe loads before a tap. Cover art goes through Cloudinary transforms. WhatsApp is the primary share.

**Files:**
- Create: `src/lib/youtube.ts`, `src/lib/youtube.test.ts`, `src/lib/share.ts`, `src/lib/share.test.ts`, `src/lib/cloudinary.ts`, `src/lib/cloudinary.test.ts`, `src/components/media/{YouTubeFacade,SpotifyEmbed,PlayButton}.tsx`, `src/components/media/YouTubeFacade.test.tsx`, `src/components/shared/{CloudinaryImage,ShareRow}.tsx`
- Delete: `src/components/shared/ShareButton.tsx` (replaced by `ShareRow`)

**Interfaces:**
- `youtubeId(url?: string): string | null` (handles `youtu.be/ID`, `watch?v=ID`, `/shorts/ID`, `/embed/ID`); `youtubeThumb(id: string): string` → `https://i.ytimg.com/vi/${id}/hqdefault.jpg`.
- `shareLinks({ title, text, url }): { whatsapp: string; twitter: string; copy: string }`; `whatsapp` = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`.
- `cloudinary(url: string, opts: { w: number; ar?: string }): string` inserts `f_auto,q_auto,w_${w}[,ar_${ar},c_fill]` after `/upload/` for `res.cloudinary.com` URLs and returns other URLs unchanged; `cloudinarySrcSet(url, widths: number[]): string`.
- `<YouTubeFacade url title />` renders a poster `<img>` + a 44 px `PlayButton`; on click swaps in `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title=… allow="autoplay; encrypted-media" />`. Renders nothing when `youtubeId` is null.
- `<SpotifyEmbed type id title />` same facade pattern with `https://open.spotify.com/embed/${type}/${id}` (height 152 for track, 352 for album/playlist).
- `<CloudinaryImage src alt width sizes className priority? />` → `<img loading="lazy" decoding="async" srcset sizes>` (`loading="eager" fetchpriority="high"` when `priority`).
- `<ShareRow data />` → WhatsApp (primary), native share when `navigator.share` exists, copy link (with `role="status"` confirmation).

- [ ] **Step 1: Write the lib tests**

```ts
// src/lib/youtube.test.ts
import { describe, it, expect } from 'vitest'
import { youtubeId, youtubeThumb } from './youtube'
describe('youtubeId', () => {
  it.each([
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s', 'dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://open.spotify.com/album/x', null],
    [undefined, null],
  ])('%s → %s', (url, id) => expect(youtubeId(url)).toBe(id))
  it('builds the thumbnail URL', () => expect(youtubeThumb('abc')).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg'))
})
```

```ts
// src/lib/share.test.ts
import { describe, it, expect } from 'vitest'
import { shareLinks } from './share'
describe('shareLinks', () => {
  it('puts text and url in the WhatsApp payload', () => {
    const l = shareLinks({ title: '6 AM', text: 'XiiX — 6 AM', url: 'https://cultureszn.com/releases/6-am' })
    expect(l.whatsapp).toBe('https://wa.me/?text=' + encodeURIComponent('XiiX — 6 AM https://cultureszn.com/releases/6-am'))
    expect(l.copy).toBe('https://cultureszn.com/releases/6-am')
  })
})
```

```ts
// src/lib/cloudinary.test.ts
import { describe, it, expect } from 'vitest'
import { cloudinary, cloudinarySrcSet } from './cloudinary'
const src = 'https://res.cloudinary.com/dph79ptoz/image/upload/v1770302177/cover.png'
describe('cloudinary', () => {
  it('inserts transforms after /upload/', () => {
    expect(cloudinary(src, { w: 640 })).toBe('https://res.cloudinary.com/dph79ptoz/image/upload/f_auto,q_auto,w_640/v1770302177/cover.png')
    expect(cloudinary(src, { w: 640, ar: '1:1' })).toContain('f_auto,q_auto,w_640,ar_1:1,c_fill/')
  })
  it('leaves non-cloudinary URLs alone', () => expect(cloudinary('https://i.scdn.co/x.jpg', { w: 640 })).toBe('https://i.scdn.co/x.jpg'))
  it('builds a srcset', () => expect(cloudinarySrcSet(src, [320, 640])).toBe(`${cloudinary(src, { w: 320 })} 320w, ${cloudinary(src, { w: 640 })} 640w`))
})
```

- [ ] **Step 2: Run → FAIL.** Implement the three libs:

```ts
// src/lib/youtube.ts
const PATTERNS = [/youtu\.be\/([\w-]{11})/, /[?&]v=([\w-]{11})/, /\/shorts\/([\w-]{11})/, /\/embed\/([\w-]{11})/]
export function youtubeId(url?: string): string | null {
  if (!url) return null
  for (const p of PATTERNS) { const m = url.match(p); if (m) return m[1] }
  return null
}
export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
```

```ts
// src/lib/share.ts
export interface ShareData { title: string; text: string; url: string }
export function shareLinks({ text, url }: ShareData) {
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    copy: url,
  }
}
```

```ts
// src/lib/cloudinary.ts
const UPLOAD = '/image/upload/'
export function cloudinary(url: string, { w, ar }: { w: number; ar?: string }): string {
  if (!url.includes('res.cloudinary.com') || !url.includes(UPLOAD)) return url
  const t = ['f_auto', 'q_auto', `w_${w}`, ...(ar ? [`ar_${ar}`, 'c_fill'] : [])].join(',')
  return url.replace(UPLOAD, `${UPLOAD}${t}/`)
}
export const cloudinarySrcSet = (url: string, widths: number[]) => widths.map((w) => `${cloudinary(url, { w })} ${w}w`).join(', ')
```

- [ ] **Step 3: Write `src/components/media/YouTubeFacade.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YouTubeFacade } from './YouTubeFacade'

describe('YouTubeFacade', () => {
  it('renders no iframe until tapped', async () => {
    const { container } = render(<YouTubeFacade url="https://youtu.be/dQw4w9WgXcQ" title="6 AM" />)
    expect(container.querySelector('iframe')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /play 6 am/i }))
    expect(container.querySelector('iframe')).toHaveAttribute('src', expect.stringContaining('youtube-nocookie.com/embed/dQw4w9WgXcQ'))
  })
  it('renders nothing for a non-YouTube URL', () => {
    const { container } = render(<YouTubeFacade url="https://open.spotify.com/x" title="x" />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 4: Run → FAIL.** Build the components (visual treatment in the contract's vocabulary; behaviour exactly as specified):

```tsx
// src/components/media/YouTubeFacade.tsx
import { useState } from 'react'
import { youtubeId, youtubeThumb } from '@/lib/youtube'
import { PlayButton } from './PlayButton'

export function YouTubeFacade({ url, title, className }: { url?: string; title: string; className?: string }) {
  const id = youtubeId(url)
  const [active, setActive] = useState(false)
  if (!id) return null
  if (active) {
    return (
      <div className={className} style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    )
  }
  return (
    <div className={className} style={{ position: 'relative', aspectRatio: '16 / 9' }}>
      <img src={youtubeThumb(id)} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <PlayButton label={`Play ${title} on YouTube`} onClick={() => setActive(true)} />
    </div>
  )
}
```

```tsx
// src/components/media/PlayButton.tsx
export function PlayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick}
      className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-fg">
      <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    </button>
  )
}
```

```tsx
// src/components/media/SpotifyEmbed.tsx
import { useState } from 'react'
import { PlayButton } from './PlayButton'

export function SpotifyEmbed({ type, id, title, poster, className }: { type: 'album' | 'track' | 'playlist'; id: string; title: string; poster?: string; className?: string }) {
  const [active, setActive] = useState(false)
  const height = type === 'track' ? 152 : 352
  if (active) {
    return (
      <iframe className={className} src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator`} title={title}
        width="100%" height={height} loading="lazy" allow="encrypted-media" style={{ border: 0, borderRadius: 'var(--radius)' }} />
    )
  }
  return (
    <div className={className} style={{ position: 'relative', height }}>
      {poster && <img src={poster} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <PlayButton label={`Play ${title} on Spotify`} onClick={() => setActive(true)} />
    </div>
  )
}
```

```tsx
// src/components/shared/CloudinaryImage.tsx
import { cloudinary, cloudinarySrcSet } from '@/lib/cloudinary'

const WIDTHS = [320, 480, 640, 960, 1280]
export function CloudinaryImage({ src, alt, width, sizes, className, priority = false, ar }:
  { src: string; alt: string; width: number; sizes: string; className?: string; priority?: boolean; ar?: string }) {
  return (
    <img
      src={cloudinary(src, { w: width, ar })}
      srcSet={src.includes('res.cloudinary.com') ? cloudinarySrcSet(src, WIDTHS) : undefined}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
```

```tsx
// src/components/shared/ShareRow.tsx
import { useState } from 'react'
import { shareLinks, type ShareData } from '@/lib/share'
import { Button } from '@/components/ui'

export function ShareRow({ data }: { data: ShareData }) {
  const links = shareLinks(data)
  const [copied, setCopied] = useState(false)
  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Share">
      <a href={links.whatsapp} target="_blank" rel="noopener noreferrer"><Button variant="primary">Share on WhatsApp</Button></a>
      {canNative && <Button variant="secondary" onClick={() => navigator.share(data).catch(() => {})}>Share…</Button>}
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(links.copy); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>Copy link</Button>
      <span role="status" className="text-sm">{copied ? 'Link copied' : ''}</span>
    </div>
  )
}
```

Delete `ShareButton.tsx`, update `src/components/shared/index.ts` (export `CloudinaryImage`, `ShareRow`) and replace `ShareButton` usage in `Artist.tsx` with `<ShareRow data={shareData} />`.

- [ ] **Step 5: Verify**

Run: `npm test` → PASS. Run: `npm run build && npm run check:size` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(media): click-to-load YouTube/Spotify facades, Cloudinary images, WhatsApp-first share

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 21: Home (Persuade) — the first surface, built to the contract

The first viewport is a thesis, not a header: it must demonstrate the mechanism (the newest drop, playable now) at the scale the chosen form has in life, with the primary action where the FIRST VIEWPORT block puts it. Comp-led if the round was comp-led (run `build-phase.mjs start` and its gates exactly as new-work §6 describes); code-led otherwise.

**Files:**
- Modify: `src/pages/Home.tsx`, `src/components/sections/{Hero,ReleasesSection,MembersSection,SZNalsSection,MovementSection}.tsx` (rename `MembersSection` → `ArtistsSection`; `MovementSection` → `ManifestoSection` or delete if the contract's STORY has no place for it)
- Create: `src/components/sections/PlaylistsSection.tsx`, `src/components/sections/JoinSection.tsx`
- Test: `src/pages/Home.test.tsx`

**Interfaces:**
- Home renders, in the order the contract's STORY dictates: the thesis viewport (latest release with `YouTubeFacade` when a YouTube link exists, else `SpotifyEmbed`, else platform buttons); Latest releases (`getRecentReleases(4)`); Artists (`getAllArtists()`); Playlists (`getPlaylists()`, section omitted when empty); SZNals (published, else drafts as teasers); Join (WhatsApp CTA when configured + `<Link to="/join">`).

- [ ] **Step 1: Write `src/pages/Home.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getRecentReleases, getAllArtists } from '@/data'

describe('Home', () => {
  it('leads with the newest release and a play action', () => {
    renderAt('/')
    const newest = getRecentReleases(1)[0]
    expect(screen.getAllByText(newest.title)[0]).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /play/i }).length + screen.getAllByRole('link', { name: /youtube|spotify|audiomack|boomplay/i }).length).toBeGreaterThan(0)
  })
  it('lists every artist and links to their page', () => {
    renderAt('/')
    for (const a of getAllArtists()) expect(screen.getAllByRole('link', { name: new RegExp(a.name, 'i') })[0]).toHaveAttribute('href', `/artists/${a.slug}`)
  })
  it('has exactly one h1', () => {
    renderAt('/')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
  it('loads no third-party iframe on first render', () => {
    const { container } = renderAt('/')
    expect(container.querySelector('iframe')).toBeNull()
  })
  it('invites the visitor to join', () => {
    renderAt('/')
    expect(screen.getAllByRole('link', { name: /join szn/i }).length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run → FAIL.** Build the surface with full commitment to the contract: every atom in the form's vocabulary, the scroll paced (dense → quiet → close), one spacing rhythm, real content (release titles, cover art via `CloudinaryImage`, artist names), no invented claims. Where an asset is missing (member photo), render the typographic treatment the contract prescribes and label nothing as a photo. `console.log` is forbidden.

- [ ] **Step 3: Batched inspection round** (new-work §7): `npm run build && npm run preview &`; capture `.impeccable/review/desktop.png` (1440 wide, full page) and `.impeccable/review/mobile.png` (390 wide) — with `npx playwright screenshot --full-page --viewport-size=1440,900 http://localhost:4173/ .impeccable/review/desktop.png` (install `playwright` as a devDependency in this step and run `npx playwright install chromium`), settle entrance motion first (`?motion=off` query handled by Task 25, or set `prefers-reduced-motion` via `--color-scheme`/emulation). Open both files, confirm they show what they claim, critique against the contract, fix in one batch, confirm with one more round. Two rounds is the ceiling.

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Run: `npm run build && npm run check:size` → PASS. Detector over `src/pages/Home.tsx src/components/sections` → fix mechanical findings.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "design(home): first surface built to the direction contract

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 22: Artists index and Artist profile (Experience)

The artist is a body of work. The profile leads with the work at the scale the form gives it; the interface recedes. Run the **surface** roll for the profile (new-work "Create a whole surface inside an established world"): derive 5–7 structures from the content (hero/discography/credits/links/collaborations), `concept-seed.mjs --scope surface --mode experience`, decision page, user locks. The index is shaped directly.

**Files:**
- Modify: `src/pages/{Artists,Artist}.tsx`, `src/components/artist/{ArtistHero,StreamingBar,DiscographySection,PlatformLinks,ArtistSEO}.tsx`, `src/components/shared/ArtistCard.tsx`
- Test: `src/pages/Artist.test.tsx`

**Interfaces:**
- Artist page consumes `getArtistProfile(slug)` (bio, genres, tags, social, affiliations, collaborations) and `getReleasesByArtist(slug)` (merged releases with tracks). Renders: hero (name with correct diacritics, role, location), platform row via `platformLinks`, about (paragraphs from `longBio`), discography (each release → `Link` to `/releases/:slug`; the newest with an inline `SpotifyEmbed`/`YouTubeFacade`), collaborations (names only; link when the collaborator is an artist on the site), `ShareRow`. Unknown slug → not-found state with links to `/artists`.

- [ ] **Step 1: Write `src/pages/Artist.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getAllArtists, getReleasesByArtist } from '@/data'

describe('Artist profile', () => {
  const artists = getAllArtists()
  it.each(artists.map((a) => [a.slug, a.name]))('%s renders name, role, links and discography', (slug, name) => {
    renderAt(`/artists/${slug}`)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(name)
    for (const r of getReleasesByArtist(slug).slice(0, 3)) expect(screen.getAllByText(r.title)[0]).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
  })
  it('renders the diacritics in Pipí Ciagi correctly', () => {
    renderAt('/artists/pipi')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Pipí')
  })
  it('handles an unknown artist without a dead end', () => {
    renderAt('/artists/nobody')
    expect(screen.getByRole('link', { name: /artists/i })).toHaveAttribute('href', '/artists')
  })
  it('old member URLs redirect', () => {
    renderAt('/members/xiix')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('XiiX')
  })
})
```

- [ ] **Step 2: Run → FAIL.** Run the surface roll, lock the structure with the user, then build the profile and index to the locked structure in the contract's vocabulary. `ArtistSEO` keeps `useDocumentHead` + `MusicGroup` JSON-LD with `sameAs` from `artist.social`. Delete `Artist.tsx`'s legacy-member branch entirely.

- [ ] **Step 3: Inspection round** (desktop + mobile captures of `/artists/xiix`), one fix batch, one confirm.

- [ ] **Step 4: Verify** — `npm test`, `npm run build`, `npm run check:size`, detector.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "design(artists): artist index and profile as a body of work

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 23: Releases index (with playlists) and Release detail (Experience)

The artefact leads: cover art and a one-tap play. Surface roll for the detail page (`--scope surface --mode experience`); index shaped directly.

**Files:**
- Modify: `src/pages/{Releases,Release}.tsx`, `src/components/shared/{ReleaseCard,ReleaseCardSkeleton}.tsx` (delete the skeleton if no async path remains)
- Create: `src/components/releases/{TrackList,PlaylistCard}.tsx`
- Test: `src/pages/Release.test.tsx`

**Interfaces:**
- Release detail consumes `getReleaseBySlug(slug)`: cover (`CloudinaryImage`, priority), title, artist (`Link` to `/artists/:artistSlug`), type + `formatDate(releaseDate)`, primary play (`YouTubeFacade` if YouTube, else `SpotifyEmbed` if `spotifyAlbumId`), `platformLinks(streamingLinks)` as buttons with `BrandIcon`, `TrackList` (`tracks` with `formatDuration`), description, `ShareRow`, "More from {artist}" (`getReleasesByArtist` minus self). JSON-LD `MusicAlbum`/`MusicRecording`. Unknown slug → not-found with `/releases` link.
- Releases index: all releases newest first, grouped by year; `PlaylistCard` for each `getPlaylists()` item with a `SpotifyEmbed type="playlist"` facade; the playlists block is omitted when empty (no "coming soon" filler).

- [ ] **Step 1: Write `src/pages/Release.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getAllReleases } from '@/data'
import { PLATFORMS } from '@/config/platforms'

describe('Release detail', () => {
  const withTracks = getAllReleases().find((r) => r.tracks && r.tracks.length > 0)!
  it('shows title, artist link, platform buttons and the track list', () => {
    renderAt(`/releases/${withTracks.slug}`)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(withTracks.title)
    expect(screen.getByRole('link', { name: withTracks.artist })).toHaveAttribute('href', `/artists/${withTracks.artistSlug}`)
    for (const key of Object.keys(withTracks.streamingLinks) as (keyof typeof PLATFORMS)[])
      if (withTracks.streamingLinks[key]) expect(screen.getByRole('link', { name: new RegExp(PLATFORMS[key].label, 'i') })).toBeInTheDocument()
    for (const t of withTracks.tracks!) expect(screen.getByText(t.name)).toBeInTheDocument()
  })
  it('loads no iframe before a tap', () => {
    const { container } = renderAt(`/releases/${withTracks.slug}`)
    expect(container.querySelector('iframe')).toBeNull()
  })
  it('unknown release is not a dead end', () => {
    renderAt('/releases/nope')
    expect(screen.getByRole('link', { name: /releases/i })).toHaveAttribute('href', '/releases')
  })
})
```

- [ ] **Step 2: Run → FAIL.** Surface roll for the detail page; build both pages to the locked structure in the contract's vocabulary. `TrackList` is an `<ol>`; durations right-aligned in tabular numerals; featured artists shown when `t.artists` has more than the primary.

- [ ] **Step 3: Inspection round** (`/releases`, `/releases/<featured>`), fix, confirm.

- [ ] **Step 4: Verify** — `npm test`, `npm run build`, `npm run check:size`, detector.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "design(releases): release index with playlists and artefact-led release detail

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 24: SZNals index and article (Read)

Structure for comprehension; then make the reading worth staying in. Shaped directly from `reference/operate.md`'s Read guidance — no roll.

**Files:**
- Modify: `src/pages/{SZNals,SZNal}.tsx`, `src/components/shared/SZNalCard.tsx`
- Create: `src/components/journal/{Prose,ArticleHeader}.tsx`, `src/components/journal/mdx-components.tsx`
- Test: `src/pages/SZNal.test.tsx`, `content/sznals/_fixture-published.mdx` (test-only, `status: 'published'`, deleted before commit or excluded via glob — prefer: put the fixture under `src/test/fixtures/sznals/` and point a test-only glob at it)

**Interfaces:**
- `Prose` sets `max-width: var(--measure)`, the contract's reading type scale, and passes `mdx-components.tsx` (`h2`, `h3`, `p`, `a`, `blockquote`, `img` → `CloudinaryImage`, `ul/ol`) to the MDX body. `ArticleHeader` shows category, title, author, `formatDate`, read time. Index: published grid + "In the works" drafts (non-link). Article page: `Prose` body, `ShareRow`, "More SZNals" (up to 3 others, published only).

- [ ] **Step 1: Write `src/pages/SZNal.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getAllSZNals, getDraftSZNals } from '@/content/sznals'

describe('SZNals', () => {
  it('index lists drafts as non-links and published as links', () => {
    renderAt('/sznals')
    for (const d of getDraftSZNals()) expect(screen.queryByRole('link', { name: new RegExp(d.title, 'i') })).toBeNull()
    for (const p of getAllSZNals()) expect(screen.getByRole('link', { name: new RegExp(p.title, 'i') })).toHaveAttribute('href', `/sznals/${p.slug}`)
  })
  it('a draft slug is not a dead end', () => {
    const d = getDraftSZNals()[0]
    renderAt(`/sznals/${d.slug}`)
    expect(screen.getByRole('link', { name: /back to sznals/i })).toHaveAttribute('href', '/sznals')
  })
  it('article page has one h1 and a prose region when published', async () => {
    const p = getAllSZNals()[0]
    if (!p) return // nothing published yet — see ASSETS-NEEDED
    renderAt(`/sznals/${p.slug}`)
    expect(await screen.findByRole('article')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run → FAIL.** Build index, article, `Prose`, `ArticleHeader`, `mdx-components` in the contract's vocabulary with a reading measure, generous line-height, and a real close (share + more SZNals).

- [ ] **Step 3: Inspection round**, fix, confirm. **Step 4: Verify** — `npm test`, `npm run build`, detector.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "design(sznals): journal index and reading experience

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 25: Join page, motion grammar, and reduced motion

Closes F28. Join is shaped directly (Persuade, narrow). Motion is authored once as material — the form's native motion, orchestrated — and every animated element respects `prefers-reduced-motion`.

**Files:**
- Modify: `src/pages/Join.tsx`, `src/components/join/NewsletterForm.tsx`, `src/lib/motion.ts`, `src/components/layout/Layout.tsx`, every section using `staggerContainer`
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useReducedMotion.test.tsx`, `src/components/shared/Reveal.tsx`

**Interfaces:**
- `useReducedMotion(): boolean` (matchMedia, updates on change; also `true` when `location.search` contains `motion=off` — used by the screenshot rounds).
- `<Reveal>`: the single entrance primitive; renders children with the contract's named entrance when motion is allowed, static otherwise. `pageTransition` in `Layout` is disabled under reduced motion. The contract's **signature interaction** (named in FIRST VIEWPORT/FORM) is implemented here if it was not already in Task 21.

- [ ] **Step 1: Write `src/hooks/useReducedMotion.test.tsx`**

```tsx
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
}

describe('useReducedMotion', () => {
  it('reflects the media query', () => {
    mockMatchMedia(true)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
    mockMatchMedia(false)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
  })
  it('honours ?motion=off', () => {
    mockMatchMedia(false)
    window.history.pushState({}, '', '/?motion=off')
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
    window.history.pushState({}, '', '/')
  })
})
```

- [ ] **Step 2: Run → FAIL.** Implement:

```ts
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react'
const QUERY = '(prefers-reduced-motion: reduce)'
const forced = () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('motion') === 'off'
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => forced() || (typeof window !== 'undefined' && window.matchMedia(QUERY).matches))
  useEffect(() => {
    if (forced()) return
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
```

`Reveal.tsx` wraps `motion.div` with the contract's entrance variant and renders a plain `div` when reduced. Replace every `motion.div variants={fadeInUp}` in sections with `<Reveal>`; delete `fadeInUp` if unused. Finish `Join.tsx` in the contract's vocabulary (WhatsApp CTA primary when configured; newsletter second; one line on what the visitor gets and how often). Delete `ANIMATION_CONFIG` from `constants.ts`.

- [ ] **Step 3: Inspection round** (`/join` and `/` with and without `?motion=off`), fix, confirm.

- [ ] **Step 4: Verify** — `npm test`, `npm run build`, `npm run check:size`, detector.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "design(motion): orchestrated motion grammar, reduced-motion support, Join page

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 26: Finish review, verdict, and DESIGN.md

new-work §7. The build thread's polishing is over; a fresh reviewer judges. "Unreviewed and undocumented is unfinished."

**Files:**
- Create: `.impeccable/review/{desktop,mobile}.png` per surface (`home-desktop.png`, `home-mobile.png`, `artist-…`, `release-…`, `sznals-…`, `join-…`), `DESIGN.md` (+ sidecar written by the documenter), `docs/design/finish-review.md`

- [ ] **Step 1: Capture** every surface at 1440 (full page) and 390 with `?motion=off`, from the document top, into `.impeccable/review/`. Open each file once and confirm it shows what its name claims.

- [ ] **Step 2: Detector** once over all changed targets: `node <impeccable-base>/scripts/detect.mjs --json src index.html` → fix what is mechanical; carry the rest into the packet.

- [ ] **Step 3: Spawn `impeccable:impeccable-finish-reviewer`** (fresh, no inherited context) with: the original request ("authentic African, world-class, mobile-first for metered-data Android"), the confirmed answers (D1–D8), artifact paths (`src/`, `index.html`), all screenshot paths (each named required), the direction contract (from `index.html`), remaining detector findings, the QUALITY BAR card and the chosen decision comp (or the comp-led approved comp + `.impeccable/build/state.json`, spec and diff dirs), and the `reference/craft-floor.md` path. Wait with one long timeout.

- [ ] **Step 4: Act on the disposition word** — `recapture` → recapture and re-review; `rebuild` → execute immediately and re-review; `fix` → one batch, recapture, send back for a verdict pass; `ship` → proceed. Two fix rounds is the budget; if the second verdict still lists open items, put the table in front of the user. Record the disposition and verdicts in `docs/design/finish-review.md` at their actual scope — never "no material issues remain" unless the reviewer said `ship`.

- [ ] **Step 5: Spawn `impeccable:impeccable-documenter`** with the project root, artifact paths, the contract, `PRODUCT.md`, and `reference/document.md`; it writes `DESIGN.md` and its sidecar from the built world. Re-run it if any later fix round changes a surface.

- [ ] **Step 6: Provenance** — `node <impeccable-base>/scripts/embed-prompt.mjs --scan public/images .impeccable/mocks` and clear every reported raster (generation prompt or origin).

- [ ] **Step 7: Verify & commit**

Run: `npm test && npm run build && npm run check:size` → PASS.

```bash
git add -A
git commit -m "design: finish review verdict, DESIGN.md, and asset provenance

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 27: `docs/ASSETS-NEEDED.md` and the placeholder policy

Per D5. Can be written any time after Task 16; must exist before Task 26's review. This is the team's shopping list, with exact specs so nothing arrives unusable.

**Files:**
- Create: `docs/ASSETS-NEEDED.md`
- Modify: `README.md` (link to it and to `docs/CONTENT-GUIDE.md`)

- [ ] **Step 1: Write `docs/ASSETS-NEEDED.md`** with these sections, each item as a checkbox with owner, spec, and where it lands:

```markdown
# Assets & Facts Needed

Placeholders ship today; each item below replaces one. Nothing here is fabricated in the meantime.

## Identity
- [ ] Logo / wordmark (SVG, monochrome + colour) → `public/brand/`. Until then the wordmark is set in the display face.
- [ ] Verified collective social handles (Instagram, YouTube, TikTok, Spotify) → `src/config/site.ts` `socials`.
- [ ] WhatsApp community invite URL → `src/config/site.ts` `whatsappCommunityUrl`.

## People
- [ ] Portrait of XiiX, Wavy SRF, Pipí Ciagi — 3:4, ≥ 1600 px on the long side, JPEG/WebP, uploaded to Cloudinary → `image` in each `src/data/artists/*.json`.
- [ ] Wide/cover image per artist — 16:9, ≥ 2400 px → `coverImage`.
- [ ] Spotify artist ids for Wavy SRF and Pipí Ciagi → `src/data/spotify-sources.json`.

## Music
- [ ] Culture SZN curated playlist ids (public, user-created) → `src/config/site.ts` `spotifyPlaylistIds` and `src/data/spotify-sources.json` `playlistIds`.
- [ ] YouTube links for every release in `src/data/releases.ts` (currently 2 of 8). Audiomack and Boomplay links where they exist.
- [ ] Cover art for releases whose `coverArt` is empty.

## Journal
- [ ] Bodies for the six drafts in `content/sznals/` (600–1500 words each; see `docs/CONTENT-GUIDE.md`). Set `status: 'published'` when ready.
- [ ] A cover image per article (16:9, ≥ 1600 px) → `meta.cover`.

## Share previews
- [ ] Default OG image 1200×630 → `public/og-default.jpg` (Task 29 generates per-route images from cover art where available).

## Placeholder policy (in force until items land)
- People without a portrait: typographic treatment from DESIGN.md — never a stock photo.
- Releases without cover art: title-set tile in the display face.
- Missing links: the platform button is simply absent; never a disabled button.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ASSETS-NEEDED.md README.md
git commit -m "docs: assets and facts needed, with placeholder policy

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

**Phase 3 exit criteria:** direction contract in `dist/index.html`; every surface built in the world; finish reviewer's last disposition recorded; `DESIGN.md` present and describing the shipped world; detector clean; CI green.

---

# PHASE 4 — Payload, Sharing, Launch

**Ships:** a site that costs the visitor as little data as possible, previews correctly in WhatsApp, and is hardened for production.

---

### Task 28: Lazy routes, chunking, and production log stripping

Closes F17. Lowers the budget to 120 KB.

**Files:**
- Modify: `src/App.tsx`, `vite.config.ts`, `scripts/check-bundle-size.mjs` (default budget), `src/data/artists/index.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Every page except `Home` is `React.lazy`; `Suspense` fallback is the contract's loading state from `LoadingStates`. Artist JSON is loaded per-artist via dynamic `import()` in `getArtistProfileAsync(slug)`; `getAllArtists()` keeps returning the lightweight index (name, slug, role, shortBio, image, tags) from a new `src/data/artists/summaries.ts`.

- [ ] **Step 1: Write `src/App.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'

describe('lazy routes', () => {
  it('renders the artist page after the chunk resolves', async () => {
    renderAt('/artists/xiix')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XiiX')
  })
  it('renders the join page after the chunk resolves', async () => {
    renderAt('/join')
    expect(await screen.findByRole('heading', { name: /join szn/i })).toBeInTheDocument()
  })
})
```

Existing page tests that use `getByRole` synchronously must switch to `findByRole` for lazy pages — update them in this task.

- [ ] **Step 2: Lazy routes in `src/App.tsx`**

```tsx
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui'
const Artists = lazy(() => import('@/pages/Artists').then((m) => ({ default: m.Artists })))
const Artist = lazy(() => import('@/pages/Artist').then((m) => ({ default: m.Artist })))
const Releases = lazy(() => import('@/pages/Releases').then((m) => ({ default: m.Releases })))
const Release = lazy(() => import('@/pages/Release').then((m) => ({ default: m.Release })))
const SZNals = lazy(() => import('@/pages/SZNals').then((m) => ({ default: m.SZNals })))
const SZNal = lazy(() => import('@/pages/SZNal').then((m) => ({ default: m.SZNal })))
const Join = lazy(() => import('@/pages/Join').then((m) => ({ default: m.Join })))
// … wrap <Routes> in <Suspense fallback={<LoadingSpinner label="Loading" />}>
```

- [ ] **Step 3: Split artist JSON.** Create `src/data/artists/summaries.ts` exporting `ARTIST_SUMMARIES: ArtistSummary[]` (hand-maintained: slug, name, role, shortBio, image, coverImage, tags, genres, social — everything `Home`, `Artists`, `ArtistCard` and `entry-seo.ts` read) and a test asserting each summary matches the full profile's fields (loaded via dynamic import in the test). `getAllArtists()` returns summaries; `getArtistProfileAsync(slug)` does `import(\`./${slug}.json\`)` / the adapters. `Artist.tsx` uses the async loader with a loading state. `Home` and `Artists` use summaries only.

- [ ] **Step 4: `vite.config.ts`**

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom', 'react-router-dom'],
        motion: ['framer-motion'],
      },
    },
  },
},
esbuild: { drop: ['console', 'debugger'] },
```

- [ ] **Step 5: Lower the budget** — `BUNDLE_BUDGET_GZIP ?? 120_000` in `scripts/check-bundle-size.mjs`.

- [ ] **Step 6: Verify**

Run: `npm test` → PASS. Run: `npm run build && npm run check:size` → PASS with largest chunk ≤ 120 KB gzip. Run: `ls dist/assets | wc -l` → per-page and per-artist chunks present. Run: `grep -l "console.log" dist/assets/*.js || echo CLEAN` → `CLEAN`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "perf: lazy routes, vendor chunks, per-artist data loading, prod log stripping; budget 120 KB

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 29: Per-route prerendered `<head>` for WhatsApp/Instagram previews

C4 made real. An SPA serves one `<head>` for every URL, so a shared `/releases/6-am` previews as the homepage. A build step renders a static HTML file per route with the right title, description, `og:*`, `twitter:*`, canonical and JSON-LD; Vercel's `cleanUrls` serves them; the SPA hydrates on top. Content is still static-first, so the whole page text is *not* prerendered — only the head, which is what crawlers and chat apps read.

**Files:**
- Create: `src/entry-seo.ts`, `src/entry-seo.test.ts`, `scripts/prerender.mjs`
- Modify: `package.json`, `vercel.json`, `index.html` (fix the leading-space `og:image` and `/og-image.jpg` references)

**Interfaces:**
- `src/entry-seo.ts` exports `getRouteMeta(): RouteMeta[]` where `RouteMeta = { path: string; title: string; description: string; image: string; canonical: string; jsonLd?: object }`, covering `/`, `/artists`, `/artists/:slug` (each), `/releases`, `/releases/:slug` (each), `/sznals`, `/sznals/:slug` (published only), `/join`.
- `npm run build` = `tsc -b && vite build && vite build --ssr src/entry-seo.ts --outDir dist-seo && node scripts/prerender.mjs`.

- [ ] **Step 1: Write `src/entry-seo.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { getRouteMeta } from './entry-seo'
import { getAllReleases, getAllArtists } from '@/data'

describe('getRouteMeta', () => {
  const metas = getRouteMeta()
  it('covers every artist and release', () => {
    for (const a of getAllArtists()) expect(metas.find((m) => m.path === `/artists/${a.slug}`)).toBeDefined()
    for (const r of getAllReleases()) expect(metas.find((m) => m.path === `/releases/${r.slug}`)).toBeDefined()
  })
  it('gives every route a title, description, absolute image and canonical', () => {
    for (const m of metas) {
      expect(m.title.length).toBeGreaterThan(3)
      expect(m.description.length).toBeGreaterThan(20)
      expect(m.image).toMatch(/^https:\/\//)
      expect(m.canonical).toBe(`https://cultureszn.com${m.path === '/' ? '' : m.path}`)
    }
  })
  it('uses 1200x630 cloudinary transforms for release images', () => {
    const r = getAllReleases().find((x) => x.coverArt.includes('res.cloudinary.com'))!
    const m = metas.find((x) => x.path === `/releases/${r.slug}`)!
    expect(m.image).toContain('w_1200,ar_1.91,c_fill')
  })
})
```

- [ ] **Step 2: Run → FAIL.** Create `src/entry-seo.ts`:

```ts
import { SITE } from '@/config/site'
import { getAllArtists, getAllReleases, getAllSZNals } from '@/data'
import { cloudinary } from '@/lib/cloudinary'

export interface RouteMeta { path: string; title: string; description: string; image: string; canonical: string; jsonLd?: object }

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dph79ptoz/image/upload/f_auto,q_auto,w_1200,ar_1.91,c_fill/v1770308654/ChatGPT_Image_Feb_5_2026_07_23_10_PM_hr3z6w.png' // replaced by public/og-default.jpg when supplied (ASSETS-NEEDED)
const og = (url: string) => (url && url.includes('res.cloudinary.com') ? cloudinary(url, { w: 1200, ar: '1.91' }) : url || DEFAULT_IMAGE)
const canonical = (path: string) => `${SITE.url}${path === '/' ? '' : path}`
const t = (s: string) => `${s} | ${SITE.name}`

export function getRouteMeta(): RouteMeta[] {
  const out: RouteMeta[] = [
    { path: '/', title: `${SITE.name} | ${SITE.tagline}`, description: SITE.description, image: DEFAULT_IMAGE, canonical: canonical('/') },
    { path: '/artists', title: t('Artists'), description: 'The artists of Culture SZN — Nairobi\'s next-generation creatives.', image: DEFAULT_IMAGE, canonical: canonical('/artists') },
    { path: '/releases', title: t('Releases'), description: 'Every Culture SZN release, plus curated playlists.', image: DEFAULT_IMAGE, canonical: canonical('/releases') },
    { path: '/sznals', title: t('SZNals'), description: 'The Culture SZN journal — culture, process, and creative philosophy from Nairobi.', image: DEFAULT_IMAGE, canonical: canonical('/sznals') },
    { path: '/join', title: t('Join SZN'), description: 'Join the Culture SZN community on WhatsApp and hear about every drop first by email.', image: DEFAULT_IMAGE, canonical: canonical('/join') },
  ]
  for (const a of getAllArtists()) {
    const path = `/artists/${a.slug}`
    out.push({ path, title: t(a.name), description: a.shortBio, image: og(a.coverImage ?? a.image), canonical: canonical(path),
      jsonLd: { '@context': 'https://schema.org', '@type': 'MusicGroup', name: a.name, url: canonical(path), sameAs: Object.values(a.social).filter(Boolean) } })
  }
  for (const r of getAllReleases()) {
    const path = `/releases/${r.slug}`
    out.push({ path, title: t(`${r.title} — ${r.artist}`), description: r.description ?? `${r.title} by ${r.artist}. Listen on YouTube, Spotify, Audiomack and more.`, image: og(r.coverArt), canonical: canonical(path),
      jsonLd: { '@context': 'https://schema.org', '@type': 'MusicAlbum', name: r.title, byArtist: { '@type': 'MusicGroup', name: r.artist }, datePublished: r.releaseDate, image: og(r.coverArt), url: canonical(path) } })
  }
  for (const s of getAllSZNals()) {
    const path = `/sznals/${s.slug}`
    out.push({ path, title: t(s.title), description: s.excerpt, image: og(s.cover ?? ''), canonical: canonical(path),
      jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, datePublished: s.publishedDate, author: { '@type': 'Organization', name: s.author } } })
  }
  return out
}
```

- [ ] **Step 3: Create `scripts/prerender.mjs`**

```js
#!/usr/bin/env node
// Writes dist/<route>.html with route-specific <head> for share previews. SPA hydrates on top.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { getRouteMeta } = await import(pathToFileURL(path.resolve('dist-seo/entry-seo.js')).href)
const template = await readFile('dist/index.html', 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function apply(html, m) {
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${m.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${m.image}" />`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].join('\n    ')
  return html.replace(/<!-- seo:start -->[\s\S]*<!-- seo:end -->/, `<!-- seo:start -->\n    ${head}\n    <!-- seo:end -->`)
}

let count = 0
for (const m of getRouteMeta()) {
  const file = m.path === '/' ? 'dist/index.html' : `dist${m.path}.html`
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, apply(template, m))
  count++
}
console.log(`✓ prerendered <head> for ${count} routes`)
```

- [ ] **Step 4: Wrap the head block in `index.html`** — replace everything from `<!-- Primary Meta Tags -->` through the last `twitter:` meta with `<!-- seo:start -->` … default tags … `<!-- seo:end -->`. Fix the leading-space bug in `og:image` and drop `/og-image.jpg`.

- [ ] **Step 5: Scripts and Vercel**

`package.json`: `"build": "tsc -b && vite build && vite build --ssr src/entry-seo.ts --outDir dist-seo && node scripts/prerender.mjs"`. Add `dist-seo` to `.gitignore`. `vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Static files win over rewrites, so `/releases/6-am` serves `dist/releases/6-am.html`; unknown paths fall back to the SPA.

- [ ] **Step 6: Verify**

Run: `npm test -- entry-seo` → PASS. Run: `npm run build` → `✓ prerendered <head> for N routes`. Run: `grep -o '<meta property="og:title" content="[^"]*"' dist/releases/6-am.html` → contains `6 AM — XiiX`. Run: `npm run check:size` → PASS. After deploy: paste a release URL into WhatsApp → correct title and cover art.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(seo): prerender per-route head for share previews; cleanUrls on Vercel

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 30: Security headers, caching, and the final budget

**Files:**
- Modify: `vercel.json`, `scripts/check-bundle-size.mjs`

- [ ] **Step 1: Add headers to `vercel.json`**

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
      { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://i.scdn.co https://i.ytimg.com https://mosaic.scdn.co https://image-cdn-ak.spotifycdn.com https://image-cdn-fa.spotifycdn.com; font-src 'self'; frame-src https://open.spotify.com https://www.youtube-nocookie.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" }
    ]
  },
  { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
  { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
]
```

- [ ] **Step 2: Lower the default budget** to `100_000` in `scripts/check-bundle-size.mjs`. If the build exceeds it, the executor reports the number and the largest contributors rather than raising the budget.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run check:size` → PASS. After deploy: `curl -sI https://cultureszn.com | grep -i "content-security-policy"` → present; open a release page, tap play on YouTube and Spotify → both play (CSP `frame-src` correct); no CSP errors in the console.

- [ ] **Step 4: Commit**

```bash
git add vercel.json scripts/check-bundle-size.mjs
git commit -m "chore(security): CSP, HSTS and immutable asset caching; budget 100 KB

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 31: Launch checklist

**Files:**
- Modify: `README.md`; Delete: `docs/PRD.md` (superseded by `PRODUCT.md`)
- Create: `docs/LAUNCH.md`

- [ ] **Step 1: Impeccable `audit`** — load `reference/audit.md` and run it over the built site (a11y, performance, responsive). Fix material findings; record the rest in `docs/LAUNCH.md`.

- [ ] **Step 2: Lighthouse, mobile, throttled** — `npx lighthouse https://<preview-url>/ --preset=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.impeccable/review/lh-home.json` for `/`, an artist and a release. Targets: Performance ≥ 90, Accessibility 100, SEO ≥ 95. Report actual numbers; do not claim targets that were not hit.

- [ ] **Step 3: Environment** — Vercel project env: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`. GitHub repo secrets: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`. Trigger `sync-spotify.yml` via `workflow_dispatch` once and confirm it commits or reports "No catalog changes".

- [ ] **Step 4: README** — rewrite to describe the actual stack, the three commands (`dev`, `test`, `build`), the sync workflow, the content guide, ASSETS-NEEDED, and `PRODUCT.md`/`DESIGN.md`. Delete `docs/PRD.md`.

- [ ] **Step 5: Verify & commit**

Run: `npm run lint && npm test && npm run build && npm run check:size` → PASS.

```bash
git add -A
git commit -m "docs: launch checklist, README rewrite; remove superseded PRD

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

**Phase 4 exit criteria:** largest chunk ≤ 100 KB gzip; WhatsApp previews correct per route; CSP live with both players working; Lighthouse numbers recorded in `docs/LAUNCH.md`.

---

## Coverage Matrix

| Requirement | Task(s) |
|-------------|---------|
| D1 scope (core + Join) | 9, 13, 15, 21–25 |
| D2 Join = WhatsApp + newsletter | 14, 15, 25 |
| D3 Spotify embed + server sync, no login | 3, 5, 10, 11, 20, 23 |
| D4 authentic African, world-class, chosen with the user | 16, 17, 18–26 |
| D5 placeholders now, needs documented | 8, 27 |
| D6 foundations first | Phase ordering |
| D7 Resend | 14 |
| D8 MDX journal | 13, 24 |
| C1 metered data | 4, 18, 20, 28, 30 |
| C2 Spotify not primary | 5, 12, 20, 21 |
| C3 YouTube default, facade | 12, 20, 21, 23 |
| C4 WhatsApp share + previews | 20, 29 |
| C5 static-first resilience | 5, 10, 11 |
| C6 no dead ends | 9, 13, 15, 19, 22, 23, 24 |
| F1–F30 | see the Findings Baseline "Closed by" column |

---

## Execution Notes

- **Order is binding within a phase; phases are sequential.** Task 27 may run any time after Task 16.
- **Confirm D7 and D8** with the user before Task 13/14.
- **Phase 3 needs the user present** for Task 16's confirmation, Task 17's direction round, and the surface rolls in Tasks 22–23. Schedule those sessions; everything else can run unattended.
- **Never "improve" the direction contract mid-build.** If a build task cannot honour it, stop and re-open the round with the user.
- **Reporting:** every task's final message states which verification commands ran and their real output. A failing test is reported as failing.
