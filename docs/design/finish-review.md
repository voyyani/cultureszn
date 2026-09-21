# Finish review — 2026-09-21

Code-led build of the Nganya Livery world (seed `53cae379`). Reviewed by the shipped `impeccable-finish-reviewer` in a fresh context with the 22 captures under `.impeccable/review/` (desktop 1440 full page, mobile 390 full page, first-viewport pairs; all with `?motion=off`, scrolled through for lazy images). The mechanical detector ran **degraded** (regex-only; HTML parser modules unavailable) and reported nothing — treated as an undercount, disclosed to the reviewer, who ran a manual floor check instead.

## Round 0 — `recapture`

Two captures were invalid: `artists-mobile.png` (a lazy panel image had not resolved) and `join-desktop.png` (the active "Join SZN" control rendered white-on-white). The second was a real defect: unlayered base rules in `src/index.css` (`a { color: inherit }`) beat Tailwind's layered utilities. Fixed by moving base rules into `@layer base` and the vocabulary into `@layer components` (`0b89cb0`). Capture script now scrolls the page before shooting.

## Round 1 — full review → `fix`

Persistence: pass. Fidelity: TYPE match; GROUND match; MATERIAL contradicted on two named materials (chevron tape, luminous LED); route board read as a standard nav bar (the round's stated risk); journal rendered as the card grid the THESIS refuses. Seven material findings:

| # | Finding | Fix | Verdict |
|---|---|---|---|
| 1 | Kicker/eyebrow lines above headings on Artist, Release, 404, draft SZNal, journal cards (floor ban) | Removed; role/location, type/date, status and category now sit BELOW the heading as caption plates | resolved |
| 2 | NEW mark was a 10 px CSS barber stripe, not a chevron tape | `Tape.tsx`: authored SVG chevron pattern; 16 px vertical strip on the NOW PLAYING strip's leading edge; band with "New" plate on the newest release card | resolved |
| 3 | Journal as a same-size card grid (THESIS refuses card grids) | `SZNalRow`/`SZNalList`: numbered route stops in the discography's grammar, on Home, the index and "More SZNals" | resolved |
| 4 | `▸`/`↗` unicode glyphs standing in for icons | `Glyphs.tsx` (ArrowRight, ArrowOut, PlayGlyph, LedDot) in one 2.5 stroke | resolved |
| 5 | LED rules flat; purple band a hairline | Rule 4 px, band 8 px, both with a core halo and an offset bleed | partial → resolved in round 2 |
| 6 | Header reads as the default nav bar | Destinations inside a chrome-edged inset `.board`; current stop lit with an LED dot and LED-green label | resolved |
| 7 | Draft SZNals showed invented publish dates and read times | Drafts show category + "In the works" only; dates/read time render only when `status: 'published'` | resolved |

Commit: `97c3d13`.

## Round 2 — verdict pass → `fix` (one partial + one regression)

- Finding 5 partial: the `-4px` negative spread on a 4 px element collapsed the bleed layer; the rule was lit but not luminous. Fixed by dropping the spread (`--led-glow`, `.led--band`).
- Regression: the 36 px tape band across the top of the newest release card hid the cover's own "6 AM" lettering. Fixed by moving the tape to straddle the card's bottom edge, half outside the frame, with the caption line clearing it.

Commit: `0ce4ec0`.

## Round 3 — verdict pass → `ship`

Both items scored resolved with pixel evidence (green LED light falls ~35 px onto the panel below; cover title fully visible on Home and the Releases index at both viewports). Remaining: clear.

**Scope of this ship:** the seven findings and the one regression across two fix rounds. It is not a fresh review of the whole surface; the reviewer's round-1 "ceiling" notes (route board as a physical board with more chrome character; ornament density below the first viewport still template-minimal) remain open opportunities, not defects.

## Verification at ship

`npm run lint` clean · `npm run typecheck` clean · `npm test` 133/133 · `npm run build` green with 16 prerendered routes · `npm run check:size` largest chunk **70.9 KB gzip** (budget 100 KB); initial route payload ≈ react 70.9 + motion 37.0 + index 25.8 KB gzip in parallel chunks · no `console.log` in `dist/assets` · contract seed present in `dist/index.html` · provenance scan: 0 rasters shipped from `public/` (all imagery is the artists' own Cloudinary uploads referenced by URL).

Playwright captures were made with `playwright-core@1.62.0` against the cached Chromium 1234 build (`node_modules` devDependency; `.impeccable/review/` is gitignored).
