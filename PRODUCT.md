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
