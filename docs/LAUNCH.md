# Launch checklist

Status as of 2026-09-21. Items are ticked only when verified; numbers are recorded, never claimed.

## Before the first deploy

- [ ] Vercel project env: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`.
- [ ] GitHub repo secrets: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`. Run **Sync Spotify catalog** once via *workflow_dispatch* and confirm it commits `src/data/generated/spotify-catalog.json` or reports no changes.
- [ ] `src/config/site.ts`: WhatsApp community URL, verified socials, playlist ids (see `docs/ASSETS-NEEDED.md`). The UI hides each of these until it exists.
- [ ] Custom domain `cultureszn.com` on Vercel; `SITE.url` matches.

## After deploy — verify on the live URL

- [ ] `curl -sI https://cultureszn.com | grep -i content-security-policy` → present.
- [ ] Open a release page, tap Play on YouTube and on Spotify → both play, no CSP errors in the console.
- [ ] Paste `https://cultureszn.com/releases/6-am` into WhatsApp → preview shows the title "6 AM — XiiX | Culture SZN" and the cover art (per-route prerendered `<head>`; `cleanUrls` serves `dist/releases/6-am.html`).
- [ ] Paste an artist URL and the home URL → correct title and image.
- [ ] `/members/xiix` redirects to `/artists/xiix`.
- [ ] Newsletter: subscribe with a real address → contact appears in the Resend audience; invalid address → inline error.

## Lighthouse (mobile, throttled) — record real numbers

Run for `/`, `/artists/xiix`, `/releases/6-am`:

```bash
npx lighthouse https://cultureszn.com/ --preset=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.impeccable/review/lh-home.json
```

| Route | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | — | — | — | — |
| `/artists/xiix` | — | — | — | — |
| `/releases/6-am` | — | — | — | — |

Targets: Performance ≥ 90, Accessibility 100, SEO ≥ 95. Not yet measured — no preview URL existed when this checklist was written.

## Bundle

`npm run check:size` gates the largest initial JS chunk at 100 KB gzip in CI. The measured numbers from the last local build are recorded in `docs/design/finish-review.md`.

## Known gaps (tracked, not hidden)

- No collective logo, no member photography beyond the artists' own Cloudinary images, no Wavy SRF / Pipí Ciagi Spotify ids, no playlist ids, no WhatsApp URL, no published SZNals — all in `docs/ASSETS-NEEDED.md`.
- `Street Gospel` (Kevo) and `Concrete Dreams` (Wavy) have no cover art; they render as title tiles.
- Only 2 of 8 releases have YouTube links; the rest fall back to the Spotify embed or platform buttons.
