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
