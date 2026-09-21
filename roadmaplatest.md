# Culture SZN — World-Class Rebuild Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix every defect found in the 2026-08-31 audit and re-point the product at how Kenyan audiences actually consume music — mobile, data-conscious, YouTube/Audiomack/Boomplay-first — producing a site that is fast, secure, correct, and deployable.

**Architecture:** Six independently shippable phases. Phase 0 makes the repo buildable and testable (nothing else can be trusted until `npm run build` is green). Phase 1 rewrites all server-side auth on one correct, tested crypto/session module. Phase 2 collapses the client Spotify layer into a single provider and moves all credentialed calls server-side. Phase 3 re-orders the product around Kenyan streaming reality and repairs every dead route. Phase 4 attacks payload size for mid-range Android on metered data. Phase 5 removes dead code and closes accessibility/observability gaps.

**Tech Stack:** React 19, TypeScript 5.9 (strict), Vite 7, Tailwind CSS 4, Framer Motion 12, React Router 7, Vercel Serverless Functions (Node 22), Vitest + Testing Library (added in Task 1).

**Spec:** This document. The [Market Context](#market-context-kenya-first-design-constraints) and [Findings Baseline](#findings-baseline-the-spec) sections below are the specification the tasks argue from; the [Coverage Matrix](#coverage-matrix) proves every finding maps to a task.

---

## Global Constraints

These apply to **every** task. A task's requirements implicitly include this section.

- **Node 22.x** — the local toolchain and Vercel runtime. Do not use APIs newer than Node 22 LTS.
- **TypeScript strict mode stays on.** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly` remain enabled. Never widen to `any` to silence an error; fix the type.
- **`npm run build` must exit 0 after every task.** It runs `tsc -b && vite build`. A task that leaves the build red is not done.
- **No new runtime dependencies** without an explicit line-item in the task. Test/build tooling may be added as `devDependencies`. Every dependency added on a metered-data audience must earn its bytes.
- **Path alias:** import from `@/...` inside `src/`. Serverless functions in `api/` must **never** import from `src/` (see F6) — they import from `api/_lib/` only.
- **Secrets:** no value read via `import.meta.env.VITE_*` may ever be a secret. `VITE_`-prefixed variables are inlined into the browser bundle.
- **Commit after every task**, using Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `test:`, `chore:`).
- **Currency/locale:** any money is **KES**; any date rendered to users uses `en-KE` with `Africa/Nairobi` (EAT). Do not hardcode `en-US` in new code.
- **Copy rules:** the collective is written `Culture SZN` (two words, SZN capitalised). The artist is `XiiX`. Do not "correct" these.

---

## Market Context: Kenya-First Design Constraints

These are the product constraints that drive the non-bug-fix work. They are design decisions, not statistics — implement them as stated.

**C1 — The audience is on mid-range Android over metered mobile data.** Payload size is a user-cost problem, not a benchmark score. Every kilobyte in the initial bundle is money out of a visitor's pocket. This justifies Phase 4 in its entirety and the bundle budget gate in Task 4.

**C2 — Spotify is not the primary listening surface, and the Web Playback SDK requires Spotify Premium.** The entire current app is architected around a Premium-only in-browser player that most of the target audience cannot use. **The core experience must never depend on a Spotify login.** Spotify stays as one link among several and as an optional enhancement for signed-in Premium users; it stops being the spine. YouTube, Audiomack, Boomplay and SoundCloud move to the front (Task 14, Task 15).

**C3 — YouTube is the default music surface.** A release without a YouTube link is a release most of the audience cannot play. YouTube embeds are also the single heaviest third-party payload on the page, so they must be loaded behind a click-to-play facade (Task 15).

**C4 — WhatsApp and Instagram are the sharing channels.** WhatsApp share is promoted to the primary share action; the OG image must render correctly in a WhatsApp link preview (Task 18).

**C5 — Offline resilience is a feature, not a nicety.** Connections drop mid-session. The existing static-data fallback is the right instinct; Phase 2 keeps it and makes it honest rather than a permanent state caused by a crashed endpoint.

**C6 — Nothing may be a dead end.** A visitor on expensive data who taps a link and gets a 404 does not come back. Every rendered link must resolve (Task 16).

---

## Findings Baseline (The Spec)

Verified against the codebase and an actual build on 2026-08-31.

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| **F1** | Critical | `npm run build` fails with 24 TypeScript errors, so the app cannot deploy. | `npx tsc -b` → 24 errors across `pipiProfile.ts` (5), `enhanced-client.ts` (5), `wavyProfile.ts` (4), `sync.ts` (3), `performance.ts` (3), `client.ts` (2), `latest-releases.ts` (1), `releases.ts` (1) |
| **F2** | Critical | Token encryption is structurally impossible to decrypt. `callback.ts:27` encrypts with a random IV that is **discarded**, emitting `ciphertext:tag`; four consumers split on three parts and call `Buffer.from(undefined,'hex')`; `refresh.ts:31` decrypts with a *fresh random IV*. No authenticated Spotify feature can ever succeed. `SPOTIFY_ENCRYPTION_KEY` silently defaults to a hardcoded literal. | `api/spotify/auth/callback.ts:27-40`, `auth/token.ts:27-47`, `auth/refresh.ts:27-43`, `me/library.ts:29-49`, `me/recommendations.ts:27-47`, `player/control.ts:27-47` |
| **F3** | Critical | OAuth `state` is generated and cookied but never compared → login-CSRF. | `auth/login.ts:61` sets it; `auth/callback.ts:47` destructures and ignores it |
| **F4** | Critical | XSS: `userData.display_name` and `userData.id` are interpolated raw into an inline `<script>` that `postMessage`s to the opener. | `auth/callback.ts:178-184` |
| **F5** | Critical | Spotify **client secret** is read via `import.meta.env.VITE_SPOTIFY_CLIENT_SECRET` in code that reaches the browser bundle. Verified in `dist`: `clientId:void 0,clientSecret:void 0` plus a `clientCredentialsGrant` call. Currently undefined (feature dead); setting the var to "fix" it ships the secret to every visitor. | `src/lib/spotify/client.ts:15-16`, `enhanced-client.ts:46-47`, reached via `useSpotifyTrack` → `shared/index.ts` → `App` |
| **F6** | High | `/api/spotify/latest-releases` imports `src/lib/spotify/client.ts`, whose module-level `new SpotifyClient()` reads `import.meta.env` — undefined in the Vercel Node runtime → throws at import → endpoint 500s → UI is permanently "Offline". Env names also mismatch (`SPOTIFY_CLIENT_ID` vs `VITE_SPOTIFY_CLIENT_ID`). | `api/spotify/latest-releases.ts:40`, `src/lib/spotify/client.ts:15` |
| **F7** | High | Node builtins bundled for the browser: `src/lib/spotify/index.ts:10` re-exports `sync.ts`, which imports `fs`/`path`. Build warns `"readFileSync" is not exported by "__vite-browser-external"`. | `vite build` output; `src/lib/spotify/sync.ts:9-10` |
| **F8** | High | No player context. `useSpotifyPlayer` is called independently by `SpotifyPlayer` (mounted in `Layout`, every page) and by *every* `SpotifyQuickPlay`; each instantiates and `connect()`s its own `Spotify.Player`, registering duplicate devices and duplicating token fetches. | `src/hooks/useSpotifyPlayer.ts:168`, `components/spotify/SpotifyPlayer.tsx:48`, `SpotifyQuickPlay.tsx:48` |
| **F9** | High | No way to connect Spotify: `SpotifyAuthButton` is never imported, exported, or rendered. | `src/components/spotify/index.ts` |
| **F10** | Medium | ~4,500 lines never rendered: `CollaborationOrbit` (761), `XiiXProfileCard` (667), `CollaborationNetwork` (354), all of `components/animation/*` (1,534), `EnhancedReleaseCard`, `BottomSheet`, `ModeSwitch`, `SpotifyHealthDashboard`, `RecommendationsSection`, `pages/SpotifyTest`, `pages/Member`. `SpotifyErrorBoundary` exists but wraps nothing. | Import-graph sweep |
| **F11** | Medium | Dead links shipped to users: `SZNalCard` → `/sznals/:slug` (no route), footer → `/events`, `/collaborate`, `/hub`, `/community`, `/merch`, `/sessions`, `/archives` (all 404). "Join SZN", "View All Creatives", "Explore All SZNals" are inert buttons. | `SZNalCard.tsx:12`, `lib/constants.ts:41-56`, `Header.tsx:74`, `MembersSection.tsx:39`, `SZNalsSection.tsx:39` |
| **F12** | Medium | `EnrichedRelease` defined 3× and already drifting (the API copy lacks `audiomack`/`boomplay`); enrich/merge logic duplicated alongside it; `useLatestReleases` adds a 4th incompatible variant. | `api/spotify/latest-releases.ts:62`, `src/lib/spotify/latest-releases.ts:16`, `src/types/index.ts:75`, `src/hooks/useLatestReleases.ts:55` |
| **F13** | Medium | `parseCookies` + `decryptToken` copy-pasted verbatim across 5 API handlers — the mechanism by which F2 acquired three divergent implementations. | All files under `api/spotify/` |
| **F14** | Medium | Four duplicated platform-config maps with divergent icons/colors. | `StreamingBar.tsx:27`, `artist/ReleaseCard.tsx:29`, `PlatformLinks.tsx:30`, `pages/Release.tsx:8` |
| **F15** | Medium | Undefined Tailwind colors render as nothing: `accent-primary`, `accent-secondary`, `golden-hour`. | `XiiXProfileCard.tsx:424`, `DiscographySection.tsx:51` |
| **F16** | Medium | `useDocumentHead` takes a freshly-allocated `meta` array and `jsonLd` object in its dep list → tears down and re-adds every head tag on every render. | `src/hooks/useDocumentHead.ts:108` |
| **F17** | Medium | Single 690 KB JS chunk (202 KB gzip), zero code splitting, ~185 KB of artist JSON statically imported. Heavy production `console.log` noise (`ReleasesSection` logs full render state every render; cache logs every hit/miss). | `vite build` output; `ReleasesSection.tsx:43,56` |
| **F18** | Medium | `api/spotify/me/recommendations.ts` targets `/v1/recommendations`, deprecated by Spotify for new apps (Nov 2024) — dead even once auth works. | `api/spotify/me/recommendations.ts:99` |
| **F19** | Medium | Fabricated data shipped to users: fake Spotify URLs (`/album/concretedreams`, `/album/streetgospel`, `/artist/kevo`, `/artist/cultureszn`), 12 Unsplash stock placeholders standing in as member/release/article art, hardcoded stats (`5 members / 35 tracks / 50K community`) contradicting the actual data. | `src/data/releases.ts:105`, `members.ts:48`, `sznals.ts`, `lib/constants.ts:63-77` |
| **F20** | Medium | `.gitignore` contains `*.md`, so the README and all nine docs are untracked. | `.gitignore:24` |
| **F21** | Medium | Serverless singletons hold state in module memory with `setInterval` timers — near-useless across cold starts, and the intervals hold the sandbox open. | `src/lib/spotify/cache.ts:35`, `rate-limiter.ts:36` |
| **F22** | High | **`api/` is type-checked by no tsconfig.** `tsconfig.app.json` includes only `src`; `tsconfig.node.json` only `vite.config.ts` + `scripts`. `@vercel/node` is not installed at the repo root. This is how F2's three divergent crypto implementations shipped undetected. | `tsconfig.app.json:33`, `tsconfig.node.json:26`, `ls node_modules/@vercel` → absent |
| **F23** | High | Zero test infrastructure. No test runner, no tests, no CI. | `package.json` scripts |

---

## File Structure

Files created or modified, and what each owns.

### Created

| Path | Responsibility |
|------|----------------|
| `vitest.config.ts` | Test runner config (jsdom default, node override per-file) |
| `src/test/setup.ts` | Testing Library matchers + global test hygiene |
| `.github/workflows/ci.yml` | typecheck → lint → test → build → bundle budget |
| `scripts/check-bundle-size.mjs` | Fails the build if the initial JS chunk exceeds the gzip budget |
| `tsconfig.api.json` | Type-checks `api/` with Node types (closes F22) |
| `api/_lib/cookies.ts` | Cookie parse/serialize. Single implementation (closes F13) |
| `api/_lib/session.ts` | AES-256-GCM encrypt/decrypt with the IV actually stored (closes F2) |
| `api/_lib/spotify-session.ts` | Read/write/clear the Spotify session cookie set |
| `api/_lib/spotify-client.ts` | Node-safe client-credentials Spotify client for serverless use (closes F6) |
| `api/_lib/releases.ts` | Server-side static release data + enrichment (breaks `api/`→`src/` coupling) |
| `src/config/platforms.ts` | **Single** platform registry: order, labels, brand colors, icons (closes F14) |
| `src/context/SpotifyProvider.tsx` | One Web Playback SDK player for the whole app (closes F8) |
| `src/components/shared/YouTubeFacade.tsx` | Click-to-load YouTube embed (C3) |
| `src/components/shared/CloudinaryImage.tsx` | Responsive `srcset` + `f_auto,q_auto` images (C1) |
| `src/pages/SZNal.tsx` | Article detail page (closes half of F11) |
| `src/pages/Artists.tsx` | Artist index page (closes half of F11) |
| `src/data/artists/summaries.ts` | Tiny static artist index; keeps 185 KB of JSON out of the main bundle |
| `src/lib/youtube.ts` | YouTube URL → video ID |

### Modified

| Path | Change |
|------|--------|
| `package.json` | Test/build scripts, devDependencies |
| `tsconfig.app.json` / `tsconfig.json` | Vitest globals; reference `tsconfig.api.json` |
| `vite.config.ts` | `manualChunks`, `esbuild.drop` for prod logs |
| `vercel.json` | Security headers, asset caching |
| `.gitignore` | Stop ignoring `*.md` (F20) |
| `src/data/artists/pipiProfile.ts`, `wavyProfile.ts` | Type errors (F1) |
| `src/data/artists/index.ts` | Async profile loading |
| `src/data/releases.ts`, `sznals.ts` | Remove fabricated links/placeholders (F19) |
| `src/lib/constants.ts` | Derived stats; real nav/footer links (F19, F11) |
| `src/hooks/useDocumentHead.ts` | Stable dependencies (F16) |
| `src/hooks/useLatestReleases.ts` | Single `EnrichedRelease` (F12) |
| `src/App.tsx` | Lazy routes, new routes, `SpotifyProvider` |
| `src/components/layout/Header.tsx` | Connect-Spotify entry point (F9) |
| `api/spotify/**` | Rewritten on `api/_lib/` |

### Deleted

`src/lib/spotify/{client,enhanced-client,sync,analytics,performance,rate-limiter,retry,latest-releases,latest-releases-errors,index}.ts` (F5, F7, F21), `src/hooks/useSpotify{Track,Tracks,Artist,TopTracks,Recommendations}.ts` (F5), `src/components/animation/**` (F10), `src/components/artist/{CollaborationOrbit,CollaborationNetwork,XiiXProfileCard}.tsx` (F10, F15), `src/components/shared/{EnhancedReleaseCard,BottomSheet,ModeSwitch}.tsx` (F10), `src/components/spotify/{SpotifyHealthDashboard,RecommendationsSection}.tsx` (F10), `src/pages/{SpotifyTest,Member}.tsx` (F10), `src/data/members.ts` (F19), `src/data/artists/xiix2.json` (57 KB, only consumer deleted), `api/spotify/me/recommendations.ts` (F18), `clear-cache.html`, `test-data-load.html`, `src/App.css`, `src/assets/react.svg` (Vite scaffolding cruft).

---

# PHASE 0 — Ground Truth

**Ships:** a repo that builds, type-checks, tests, and refuses to regress.

---

### Task 1: Test harness, CI, and repo hygiene

Nothing in this plan is verifiable until a test can be run. This task also unignores the docs (F20) so the roadmap itself is trackable.

**Files:**
- Create: `vitest.config.ts`, `src/test/setup.ts`, `src/lib/utils.test.ts`, `.github/workflows/ci.yml`
- Modify: `package.json`, `tsconfig.app.json`, `.gitignore`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `npm test` (single run), `npm run test:watch`, `npm run typecheck`. All later tasks depend on these three commands existing.

- [ ] **Step 1: Install test tooling**

```bash
npm i -D vitest@^3 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts'],
    restoreMocks: true,
  },
})
```

Note: Tailwind's Vite plugin is deliberately omitted — tests do not need CSS processing, and excluding it keeps the test run fast.

- [ ] **Step 3: Create the test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 4: Add scripts to `package.json`**

Replace the `"scripts"` block with:

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

- [ ] **Step 5: Add Vitest globals to the TS config**

In `tsconfig.app.json`, change the `"types"` line to:

```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
```

- [ ] **Step 6: Write the failing test**

Create `src/lib/utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { slugify, truncate, formatDate } from './utils'

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

  it('appends an ellipsis when cutting', () => {
    expect(truncate('Nairobi creative ecosystem', 7)).toBe('Nairobi...')
  })
})

describe('formatDate', () => {
  it('formats an ISO date in en-KE', () => {
    expect(formatDate('2026-01-31')).toContain('2026')
  })
})
```

- [ ] **Step 7: Run the tests to verify the harness works**

Run: `npm test`
Expected: 5 tests PASS. (These assert existing correct behaviour — this step proves the *harness* works. If `truncate` fails, note that `truncate` trims before appending; adjust the expectation to the actual contract, do not change `utils.ts`.)

- [ ] **Step 8: Stop ignoring markdown**

In `.gitignore`, delete the line `*.md`. Leave every other line untouched.

- [ ] **Step 9: Add the CI workflow**

Create `.github/workflows/ci.yml`:

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

`npm run build` is expected to FAIL in CI until Task 4. That is intentional and correct — CI now tells the truth about the repo.

- [ ] **Step 10: Commit**

```bash
git add vitest.config.ts src/test/setup.ts src/lib/utils.test.ts \
        .github/workflows/ci.yml package.json package-lock.json \
        tsconfig.app.json .gitignore roadmaplatest.md
git commit -m "test: add vitest + testing-library harness and CI workflow"
```

---

### Task 2: Fix the artist-profile type errors

9 of the 24 build errors (F1) live in the two hand-written profile adapters. Both build arrays containing `null`, then assert the nulls away with a type predicate that doesn't type-check, and both assign `string | undefined` to required `string` branding fields.

**Files:**
- Modify: `src/data/artists/pipiProfile.ts:155-182,235-236`, `src/data/artists/wavyProfile.ts:102-144,262-263`
- Test: `src/data/artists/profiles.test.ts` (create)

**Interfaces:**
- Consumes: `npm test` and `npm run typecheck` from Task 1.
- Produces: `wavyProfile` and `pipiProfile` as valid `ArtistProfile` objects with `branding.image: string` and `branding.cover_image: string` always populated. Task 20 relies on these being loadable.

- [ ] **Step 1: Write the failing test**

Create `src/data/artists/profiles.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import wavyProfile from './wavyProfile'
import pipiProfile from './pipiProfile'

describe.each([
  ['wavy', wavyProfile],
  ['pipi', pipiProfile],
])('%s profile', (slug, profile) => {
  it('has a non-empty branding image and cover image', () => {
    expect(typeof profile.branding.image).toBe('string')
    expect(profile.branding.image.length).toBeGreaterThan(0)
    expect(typeof profile.branding.cover_image).toBe('string')
    expect(profile.branding.cover_image.length).toBeGreaterThan(0)
  })

  it('uses the expected primary slug', () => {
    expect(profile.branding.primary_slug).toBe(slug)
  })

  it('contains no null discography highlights', () => {
    expect(profile.discography.highlights.every(Boolean)).toBe(true)
  })

  it('gives every highlight a title and release date', () => {
    for (const h of profile.discography.highlights) {
      expect(h.title).toBeTruthy()
      expect(h.release_date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- profiles`
Expected: FAIL — `branding.image` is `undefined` for both profiles (the `|| undefined` fallback in each file).

- [ ] **Step 3: Add a shared fallback image constant**

At the top of `src/data/artists/pipiProfile.ts`, after the imports, add:

```ts
const FALLBACK_ARTIST_IMAGE = '/images/artists/placeholder.svg'
```

Add the identical constant to `src/data/artists/wavyProfile.ts`.

- [ ] **Step 4: Fix the `wavyProfile` highlight array typing**

In `src/data/artists/wavyProfile.ts`, replace the `buildHighlights` return chain (lines ~102-145). Change the `.map()` callback's `return` object so the whole expression is typed as `(DiscographyHighlight | null)[]`, then narrow with a plain predicate. Replace:

```ts
    .filter((item): item is DiscographyHighlight => Boolean(item))
```

with:

```ts
    .filter((item): item is DiscographyHighlight => item !== null)
```

and change the `.map(` opening so the callback has an explicit return type:

```ts
    .map((track): DiscographyHighlight | null => {
```

- [ ] **Step 5: Fix the `wavyProfile` branding fields**

In `src/data/artists/wavyProfile.ts`, replace lines 262-263:

```ts
    image: wavyData.media_assets?.hero_image?.url || FALLBACK_ARTIST_IMAGE,
    cover_image: wavyData.media_assets?.hero_image?.url || FALLBACK_ARTIST_IMAGE,
```

- [ ] **Step 6: Apply the same three fixes to `pipiProfile`**

In `src/data/artists/pipiProfile.ts`:

Change the map opening (line ~156) — and drop the unused `index` parameter, which is its own error (`TS6133`):

```ts
  .map((track): DiscographyHighlight | null => {
```

Change the filter (line ~182):

```ts
  .filter((item): item is DiscographyHighlight => item !== null)
```

Change the branding fields (lines 235-236):

```ts
    image: pipiData.media_assets?.hero_image?.url || FALLBACK_ARTIST_IMAGE,
    cover_image: pipiData.media_assets?.hero_image?.url || FALLBACK_ARTIST_IMAGE,
```

- [ ] **Step 7: Fix the `type` widening in `pipiProfile`**

Still in `pipiProfile.ts`, the returned object's `type: 'single'` infers as `string`, not `ReleaseType`. Inside the map callback, change:

```ts
      type: 'single',
```

to:

```ts
      type: 'single' as const,
```

- [ ] **Step 8: Create the placeholder asset**

Create `public/images/artists/placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="Artist portrait placeholder">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF6B35"/>
      <stop offset="50%" stop-color="#6A11CB"/>
      <stop offset="100%" stop-color="#2575FC"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="#1A1A1A"/>
  <rect width="400" height="500" fill="url(#g)" opacity="0.25"/>
  <circle cx="200" cy="200" r="70" fill="#ffffff" opacity="0.15"/>
  <path d="M80 460c0-66 54-120 120-120s120 54 120 120z" fill="#ffffff" opacity="0.15"/>
</svg>
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npm test -- profiles`
Expected: 8 tests PASS.

- [ ] **Step 10: Verify the error count dropped**

Run: `npx tsc -b 2>&1 | grep -c "error TS"`
Expected: `15` (down from 24 — the 9 profile errors are gone).

- [ ] **Step 11: Commit**

```bash
git add src/data/artists/pipiProfile.ts src/data/artists/wavyProfile.ts \
        src/data/artists/profiles.test.ts public/images/artists/placeholder.svg
git commit -m "fix(data): correct artist profile types and guarantee branding images"
```

---

### Task 3: Remove the browser-unsafe Spotify layer

This single deletion closes F5 (secret in bundle), F7 (node builtins in the browser), F21 (useless serverless singletons), and the remaining 15 build errors from F1. The credentialed work moves server-side in Task 12.

Deleting is correct rather than fixing: `client.ts`/`enhanced-client.ts` perform a **client-credentials grant from the browser**, which is unfixable by design — the flow requires a secret. Their consumers (`useSpotifyTrack` and friends) only ever fetched metadata already present in the static data.

**Files:**
- Delete: `src/lib/spotify/{client,enhanced-client,sync,performance,rate-limiter,retry,analytics,latest-releases,latest-releases-errors,index}.ts`
- Delete: `src/hooks/useSpotify{Track,Tracks,Artist,TopTracks}.ts`
- Delete: `src/components/shared/{TrackCard,SpotifyEmbed,EnhancedReleaseCard}.tsx`, `src/pages/SpotifyTest.tsx`
- Modify: `src/hooks/index.ts`, `src/components/shared/index.ts`, `src/lib/spotify/utils.ts` (relocate)
- Create: `src/lib/spotify-links.ts`
- Test: `src/lib/spotify-links.test.ts`

**Interfaces:**
- Consumes: Task 1's test commands.
- Produces: `src/lib/spotify-links.ts` exporting `extractSpotifyId(url?: string): string | null`, `extractSpotifyType(url?: string): 'track'|'album'|'artist'|null`, `buildSpotifyEmbedUrl(type, id): string`, `isValidSpotifyId(id?: string): boolean`, `formatDuration(ms: number): string`. Tasks 12, 14 and 15 import from here.

- [ ] **Step 1: Write the failing test for the relocated helpers**

Create `src/lib/spotify-links.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  extractSpotifyId,
  extractSpotifyType,
  isValidSpotifyId,
  buildSpotifyEmbedUrl,
  formatDuration,
} from './spotify-links'

describe('extractSpotifyId', () => {
  it('reads an id from a web album URL', () => {
    expect(extractSpotifyId('https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L'))
      .toBe('5EC55CH3Tybf6kNJS0415L')
  })

  it('reads an id from a spotify: URI', () => {
    expect(extractSpotifyId('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp'))
      .toBe('3n3Ppam7vgaVa1iaRUc9Lp')
  })

  it('returns null for undefined', () => {
    expect(extractSpotifyId(undefined)).toBeNull()
  })
})

describe('isValidSpotifyId', () => {
  it('accepts a real 22-character id', () => {
    expect(isValidSpotifyId('5EC55CH3Tybf6kNJS0415L')).toBe(true)
  })

  it('rejects the fabricated placeholder ids in our data', () => {
    expect(isValidSpotifyId('concretedreams')).toBe(false)
    expect(isValidSpotifyId('streetgospel')).toBe(false)
  })
})

describe('extractSpotifyType', () => {
  it('detects an album URL', () => {
    expect(extractSpotifyType('https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L'))
      .toBe('album')
  })
})

describe('buildSpotifyEmbedUrl', () => {
  it('builds a themed embed URL', () => {
    expect(buildSpotifyEmbedUrl('track', 'abc')).toContain('/embed/track/abc')
  })
})

describe('formatDuration', () => {
  it('formats under an hour as M:SS', () => {
    expect(formatDuration(154000)).toBe('2:34')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- spotify-links`
Expected: FAIL — `Failed to resolve import "./spotify-links"`.

- [ ] **Step 3: Relocate the helpers**

Move the file, keeping its contents byte-for-byte (it is already correct and has no imports):

```bash
git mv src/lib/spotify/utils.ts src/lib/spotify-links.ts
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- spotify-links`
Expected: 8 tests PASS.

- [ ] **Step 5: Delete the browser-unsafe library and its consumers**

```bash
git rm -r src/lib/spotify
git rm src/hooks/useSpotifyTrack.ts src/hooks/useSpotifyTracks.ts \
       src/hooks/useSpotifyArtist.ts src/hooks/useSpotifyTopTracks.ts
git rm src/components/shared/TrackCard.tsx \
       src/components/shared/SpotifyEmbed.tsx \
       src/components/shared/EnhancedReleaseCard.tsx
git rm src/pages/SpotifyTest.tsx
```

- [ ] **Step 6: Update the hooks barrel**

Replace `src/hooks/index.ts` entirely:

```ts
/**
 * Hooks Index
 */

export { useDocumentHead } from './useDocumentHead'
export { useScrollParallax, useHeroParallax, useScrollTrigger } from './useScrollParallax'

// Spotify (session-scoped only — no credentialed calls from the browser)
export { useSpotifyAuth } from './useSpotifyAuth'
export { useSpotifyLibrary } from './useSpotifyLibrary'

// Latest Releases
export { useLatestReleases } from './useLatestReleases'
export type { UseLatestReleasesOptions, UseLatestReleasesResult } from './useLatestReleases'
```

- [ ] **Step 7: Update the shared-components barrel**

Replace `src/components/shared/index.ts` entirely:

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
```

- [ ] **Step 8: Repoint the one surviving import**

`src/hooks/useSpotifyRecommendations.ts` is deleted in Task 8; leave it for now. The only other importer of the deleted library is the API handler, fixed in Task 12. Verify nothing in `src/` still references the deleted paths:

Run: `grep -rn "lib/spotify/" src/ || echo "CLEAN"`
Expected: `CLEAN`

- [ ] **Step 9: Verify the type errors are gone**

Run: `npx tsc -b 2>&1 | grep "error TS" | grep -v "^api/"`
Expected: no output from `src/` — the remaining errors, if any, are in `api/spotify/latest-releases.ts`, which Task 12 rewrites.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "fix(security): remove browser-side Spotify client that would ship the client secret

Deletes src/lib/spotify/* (client-credentials grant from the browser,
node fs/path in the bundle, per-invocation serverless singletons) and the
four hooks that consumed it. Relocates the pure URL helpers to
src/lib/spotify-links.ts. Closes F5, F7, F21."
```

---

### Task 4: Green build gate and bundle budget

Locks in Phase 0 so nothing regresses (F1), and installs the guard that protects Kenyan visitors' data (C1, F17).

**Files:**
- Create: `scripts/check-bundle-size.mjs`
- Modify: `package.json`, `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: a `dist/` produced by `vite build`.
- Produces: `npm run check:size`, which exits 1 when the largest initial JS chunk exceeds its gzip budget. Task 19 and Task 20 lower the budget as they land.

- [ ] **Step 1: Write the budget checker**

Create `scripts/check-bundle-size.mjs`:

```js
#!/usr/bin/env node
/**
 * Fails the build when the initial JS payload exceeds our budget.
 *
 * Rationale: the audience is on metered mobile data (see roadmaplatest.md C1).
 * Bundle size is a user-cost problem, so it gets a hard gate, not a warning.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

// Budget in bytes (gzipped) for the single largest JS chunk.
// Lower this as code-splitting lands. Current baseline: ~202 KB.
const BUDGET_GZIP = Number(process.env.BUNDLE_BUDGET_GZIP ?? 210_000)

const assetsDir = path.resolve('dist/assets')

let entries
try {
  entries = await readdir(assetsDir)
} catch {
  console.error('✗ dist/assets not found. Run `vite build` first.')
  process.exit(1)
}

const jsFiles = entries.filter((f) => f.endsWith('.js'))
if (jsFiles.length === 0) {
  console.error('✗ No JS chunks found in dist/assets.')
  process.exit(1)
}

const measured = []
for (const file of jsFiles) {
  const full = path.join(assetsDir, file)
  const buf = await readFile(full)
  const raw = (await stat(full)).size
  measured.push({ file, raw, gzip: gzipSync(buf).length })
}

measured.sort((a, b) => b.gzip - a.gzip)

const kb = (n) => `${(n / 1024).toFixed(1)} KB`

console.log(`\nJS chunks (${measured.length}):`)
for (const m of measured) {
  console.log(`  ${m.file.padEnd(34)} ${kb(m.raw).padStart(10)} raw  ${kb(m.gzip).padStart(10)} gzip`)
}

const largest = measured[0]
const totalGzip = measured.reduce((sum, m) => sum + m.gzip, 0)
console.log(`\n  total: ${kb(totalGzip)} gzip`)
console.log(`  largest chunk: ${largest.file} at ${kb(largest.gzip)} gzip`)
console.log(`  budget: ${kb(BUDGET_GZIP)} gzip\n`)

if (largest.gzip > BUDGET_GZIP) {
  console.error(`✗ Bundle budget exceeded by ${kb(largest.gzip - BUDGET_GZIP)}.`)
  process.exit(1)
}

console.log('✓ Within bundle budget.\n')
```

- [ ] **Step 2: Add the script**

In `package.json`, add to `"scripts"`:

```json
"check:size": "node scripts/check-bundle-size.mjs",
```

- [ ] **Step 3: Run the full build**

Run: `npm run build`
Expected: PASS — `tsc -b` exits 0 and Vite emits `dist/`. This is the first green build in the project's history.

- [ ] **Step 4: Run the budget check**

Run: `npm run check:size`
Expected: PASS, reporting a largest chunk near 200 KB gzip.

- [ ] **Step 5: Wire it into CI**

In `.github/workflows/ci.yml`, append after the `npm run build` step:

```yaml
      - run: npm run check:size
```

- [ ] **Step 6: Commit**

```bash
git add scripts/check-bundle-size.mjs package.json .github/workflows/ci.yml
git commit -m "build: green build gate and gzip bundle budget

npm run build now passes for the first time. check:size fails CI when the
largest initial chunk exceeds its gzip budget, protecting visitors on
metered mobile data."
```

---

**Phase 0 exit criteria:** `npm run lint`, `npm test`, `npm run build`, `npm run check:size` all exit 0. The site deploys. No secret can reach the browser bundle.

---
