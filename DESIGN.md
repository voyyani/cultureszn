---
name: Culture SZN
description: A Nairobi music and design collective's catalogue, built as a nganya — route board, painted panels, sound system.
colors:
  gloss-black: "#0b0b0d"
  panel-black: "#17171c"
  white-vinyl: "#f4f4f6"
  chrome-tint: "#b4b4c0"
  led-green: "#39ff14"
  led-green-ink: "#05100a"
  led-purple: "#7b2cff"
  board-yellow: "#ffd400"
  reflective-red: "#e8232a"
  brushed-chrome: "#9a9aa6"
  hairline: "#2c2c34"
typography:
  display:
    fontFamily: "Bungee, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  headline:
    fontFamily: "Bungee, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  title:
    fontFamily: "Bungee, Arial Black, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  szn: "4px"
  led: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "5rem"
components:
  button-primary:
    backgroundColor: "{colors.led-green}"
    textColor: "{colors.led-green-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.white-vinyl}"
    textColor: "{colors.led-green-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.white-vinyl}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.white-vinyl}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.chrome-tint}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-ghost-hover:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.white-vinyl}"
  button-lg:
    padding: "0 1.75rem"
    height: "3.5rem"
  plate:
    backgroundColor: "{colors.board-yellow}"
    textColor: "{colors.gloss-black}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0.35em 0.6em 0.3em"
  plate-dark:
    backgroundColor: "{colors.gloss-black}"
    textColor: "{colors.white-vinyl}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0.35em 0.6em 0.3em"
  badge-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white-vinyl}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0.375rem 0.5rem"
  badge-mark:
    backgroundColor: "{colors.reflective-red}"
    textColor: "{colors.white-vinyl}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
    padding: "0.375rem 0.5rem"
  card-panel:
    backgroundColor: "{colors.panel-black}"
    rounded: "{rounded.szn}"
    padding: "1rem"
  card-outline:
    backgroundColor: "transparent"
    rounded: "{rounded.szn}"
    padding: "1rem"
  input:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.white-vinyl}"
    rounded: "{rounded.szn}"
    padding: "0 1rem"
    height: "2.75rem"
  board:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.board-yellow}"
    typography: "{typography.label}"
    rounded: "{rounded.szn}"
  nav-destination:
    backgroundColor: "transparent"
    textColor: "{colors.board-yellow}"
    typography: "{typography.label}"
    padding: "0 1rem"
    height: "2.75rem"
  nav-destination-hover:
    textColor: "{colors.white-vinyl}"
  nav-destination-active:
    textColor: "{colors.led-green}"
  play-button:
    backgroundColor: "{colors.led-green}"
    textColor: "{colors.led-green-ink}"
    rounded: "{rounded.szn}"
    size: "3.5rem"
---

# Design System: Culture SZN

## Overview

**Creative North Star: "The Nganya"**

Culture SZN is a Nairobi matatu at night. The site is the vehicle: a chrome-edged route board across the top for wayfinding, painted panels down the side for the artists, and a sound system pinned along the bottom carrying the newest drop. The ground is gloss black because the bus is black and the phone is the light source; every colour on it is either paint (route-board yellow, reflective red) or light (LED green, LED purple). Nothing is tinted, blended or blurred: a fixed palette with hard edges, depth by overlap and light, state as a mark.

The world is dense and direct. Names are painted at sign scale in Bungee; everything that tells you where you are (destinations, categories, dates, stop numbers) is set as condensed caps on the board; body copy is the phone's own system sans so the bundle stays small on metered data. Motion is three authored moves: panels pull in from the right like the bus arriving, LED elements switch on left to right, routes cut with a short fade. Under `prefers-reduced-motion` all three collapse to a plain render.

The direction round rejected the label-site default in both its forms: the incumbent (near-black ground, orange-purple-blue gradient wordmark, glass cards) and its opposite (cream paper, serif display, terracotta). The rendition guard the build had to clear: it must read as a bus, not "near-black plus one neon accent plus glow".

**Key Characteristics:**
- Gloss-black ground with a fixed eleven-colour role palette; every surface styles with role tokens and nothing else.
- LED green is the only action colour. If it is green, it is the thing to tap.
- Bungee signage for names and headings; Barlow Condensed 600 caps for every label; system sans for reading.
- The LED rule is a real light: a single luminous 4px bar whose bleed falls onto the panel below.
- Vinyl-cut caption plates (4px radius) carry roles, types, categories and dates.
- Red/white chevron tape, authored as SVG, is the NEW mark.
- Honest states: no stand-in photos, no invented facts, no CTA for a link that does not exist.

## Colors

A fixed livery: two blacks, one white, two chromes, and four colours that are either paint or light.

### Primary
- **LED Green** (`--accent`): the only action colour. Primary buttons, the Play control, focus rings, the input caret, the lit destination dot on the route board, the "Link copied" status, and the `.led` rule itself. It never colours a heading or body text.
- **LED Green Ink** (`--accent-fg`): the near-black ink on top of LED green, so a lit control reads as a lit control and not as green text.

### Secondary
- **Route-Board Yellow** (`--board`): paint, not light. Wayfinding and captioning: destination lettering in the header and footer, stop numbers in every numbered list, the `.plate`, the "Nairobi" in the hero line, the "SZN" in the wordmark, hover colour on titles and artist links, empty-state titles, and `::selection`.
- **LED Purple** (`--band`): the ambient band. Only two uses, both as the taller `.led--band` rule above the join section and the footer, and as one of the three panel fills when an artist has no cover art.

### Tertiary
- **Reflective Red** (`--mark`): the hazard-tape red inside the chevron `Tape`, the `mark` badge, and the 2px border of `ErrorMessage`. It is never a button and never a fill behind text longer than one word.

### Neutral
- **Gloss Black** (`--bg`): the page ground, the header, the sound-system strip, and dark plates laid on top of colour panels.
- **Panel Black** (`--bg-raised`): raised panels: the route board, cards, inputs, cover-art frames, the join section, the skeleton block, the hover fill on secondary and ghost buttons.
- **White Vinyl** (`--fg`): all default text, the white in the chevron tape, the fill of the wordmark, and the hover state of a primary button (green control goes white on hover).
- **Chrome Tint** (`--fg-muted`): secondary text: sublines, excerpts, bios, dates, durations, "feat." lines. A blue-tinted grey, never a plain grey.
- **Brushed Chrome** (`--chrome`): the border of secondary buttons and platform switches, the arrow glyphs at rest, small column headings ("With", "Part of", "Share", "Destinations"), title-tile text on a missing cover, and the scrollbar thumb.
- **Hairline** (`--line`): 1px borders and dividers: card and panel edges, list rules, the route board's frame, the `.chrome-rule`, input borders at rest.

### Named Rules
**The One Light Rule.** LED green is the only action colour and appears only on things that respond to a tap (or on the LED rule that separates zones). Yellow is paint for reading the route; it is never a button.

**The Paint or Light Rule.** Every colour on the bus is either paint (yellow, red, the blacks, the whites) or light (green, purple). Light glows; paint never does. No colour is tinted with another and nothing is blended.

**The No Grey-on-Grey Rule.** Muted text is chrome-tinted (`--fg-muted`), always on a black, and the two blacks are the only surfaces text sits on besides a plate.

## Typography

**Display Font:** Bungee 400 (with Arial Black, then system-ui). Self-hosted Latin subset, `font-display: swap`.
**Body Font:** system-ui stack (-apple-system, Segoe UI, Roboto, Helvetica Neue, Arial). Not loaded; the phone's own face.
**Label Font:** Barlow Condensed 600 (with Arial Narrow, then system-ui). Self-hosted Latin subset.

**Character:** Signage lettering over route-board caps. Bungee is the painted name on the side of the bus: one weight, uppercase by class where it is a heading, never tracked, set tight at 0.95 line-height. Barlow Condensed is the destination board: condensed, 600, caps, 0.08em tracking, line-height 1. The body face is deliberately anonymous so the two loaded faces stay the only voices.

### Hierarchy
- **Display** (Bungee 400, `clamp(2.5rem, 8vw, 5.5rem)`, 0.95): the page name on list and utility pages (Artists, Releases, SZNals, Join, 404). Profile and release names go larger: artist name `clamp(3rem, 11vw, 8rem)`, release title `clamp(2.5rem, 9vw, 6.5rem)`, the home line `clamp(2rem, 5.5vw, 4.25rem)`, the join close `clamp(2rem, 6vw, 4.5rem)`. One name per page at hero scale.
- **Headline** (Bungee 400, `clamp(1.75rem, 4vw, 3rem)` via `Heading size="h2"`, or a fixed 1.875rem / 1.5rem on profile and release sections, 0.95): section names. `SectionHeader` sets the headline, then an LED rule 1rem beneath, then an optional muted subtitle.
- **Title** (Bungee 400, 1.125rem to 1.5rem, line-height 1.25): the name of an item in a list or card: release title on a card, stop title, journal title, track name, wordmark (1.35rem / 1.5rem). Bungee at 1rem is the floor; below that, switch to a label.
- **Body** (system sans 400, 1rem, 1.55; 1.125rem for bios and descriptions): reading copy, capped at 64ch by `.measure`.
- **Label** (Barlow Condensed 600, 0.75rem to 1.125rem, 0.08em, uppercase): everything that is board lettering: destinations (1.05rem, 0.1em), buttons (0.95rem / 1.1rem), plates, stop numbers (1.125rem, tabular), meta lines (0.875rem), section-side headings (0.875rem chrome). Numbers in labels use `.tabular`.

### Named Rules
**The Scale Is the Hierarchy Rule.** Headings are one face at one weight; hierarchy comes from size alone. No eyebrow or kicker sits above a heading. A label beneath a heading (the hero subline, a plate row under a name) is caption, not kicker.

**The Painted Name Rule.** A missing cover art or photo is never a stand-in image. The name itself is painted at sign scale (Bungee, `clamp(3rem, 14vw, 7rem)`, 0.85, 90% opacity) on a solid colour panel, or a release title is set in chrome Bungee centred in its square.

## Layout

The container is `.container-szn`: full width, max 1400px, centred, 1rem side padding rising to 2rem at 640px. Section rhythm is `.section-szn`: 3rem block padding, 5rem at 1024px; bespoke sections use `py-8/10`, `py-12/16` or `py-14/20` from the same `--space-*` steps. Vertical spacing inside components steps through the space scale (0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 5rem) and Tailwind's 4px grid.

Breakpoints in use: 640px (padding and card columns), 768px (route board appears in the header, panel row unrolls), 1024px (section padding, four-up release grid). Tailwind's default `sm` / `md` / `lg`.

**First viewport (home).** A flex column of `min-height: calc(100svh - 4rem - 3px)` (the header is 4rem plus the LED rule): the name line and subline at the top, the `.panel-row` of artist panels filling the middle, and the `NowPlayingStrip` at the bottom. On phones the panel row scrolls horizontally with mandatory snap and each panel is 86% wide; from 768px it becomes a flex row of equal panels with no scroll. Panels are 4:5.

**Header.** Sticky, gloss black, 4rem tall, an LED rule as its bottom edge. Wordmark left; on 768px+ the `.board` holds destinations separated by hairlines, with Join SZN as a green control outside the board. Below 768px a chrome-bordered menu button opens a full-screen list (3xl labels, 4rem rows) with `inert` applied to main and footer.

**Route-board profile (artist).** Name at hero scale with plates beneath and platform switches; portrait (4:5, max 320px) right-aligned at the end of the row on 768px+; an LED rule closes the header. Discography is a numbered list of stops (2-digit yellow number, 56px cover tile, title, meta, arrow); the first stop carries its player inline. Bio and side plates (With, Part of, Share) split 2:1.

**Sound-system stack (release).** Square cover (max 420px) beside the title on 640px+; an LED rule; the control row (Play plus platform switches); then tracks and story 3:2 with share; then "More from" as a 2-up / 4-up grid of release cards.

**Lists.** Every list (stops, tracks, journal entries) is an `<ol>` with hairline top and bottom borders and hairline dividers, rows at least 3rem to 4rem tall, and a tabular two-digit number in yellow on the left. Release grids are 2 columns from the phone up and 4 at 1024px, all squares.

## Elevation & Depth

Depth is overlap and light, never tonal shadow. Surfaces sit flat on gloss black; a raised surface is panel black with a hairline border. The only shadows in the system are light emitted by LEDs: the green `.led` rule, the purple `.led--band`, the Play button's glow, and the lit destination dot. The route board is inset, not lifted: a 1px chrome-tinted inner highlight at the top edge and a black inner shade at the bottom.

### Shadow Vocabulary
- **LED glow** (`box-shadow: 0 1px 6px color-mix(in srgb, var(--accent) 90%, transparent), 0 10px 28px color-mix(in srgb, var(--accent) 55%, transparent)`; token `--led-glow`): the `.led` rule and the Play button. A tight halo at the core, then the bleed falling downward onto the panel below.
- **Band glow** (`box-shadow: 0 2px 10px color-mix(in srgb, var(--band) 90%, transparent), 0 14px 40px color-mix(in srgb, var(--band) 60%, transparent)`): the 8px purple `.led--band` above the join section and the footer; taller, so its light falls further.
- **Board inset** (`box-shadow: inset 0 1px 0 color-mix(in srgb, var(--chrome) 45%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--bg) 80%, transparent)`): the `.board` only.
- **Lit dot** (`filter: drop-shadow(0 0 6px var(--accent))`): the active `LedDot` on the desktop route board.

### Named Rules
**The Light Source Rule.** A shadow exists only where there is a light. No card, panel, image or button carries a shadow at rest; a glow belongs to a green or purple element and falls downward.

**The No Glass Rule.** No backdrop blur, no translucent white, no frosted panel. Layering is opaque black on black, plate on panel, tape half over an edge.

## Shapes

Cut vinyl. One radius, 4px (`--radius`, Tailwind `rounded-szn`), on every panel, plate, button, input, cover frame and tile. The LED rule alone is a pill (999px). Chrome hairlines are 1px `--line`; controls that must read as switches carry a 2px border (buttons, inputs, platform links, the error plate). Images are clipped square (1:1) for covers and 4:5 for artist panels and portraits, always inside a hairline frame. The chevron tape is a 16px repeating pattern, drawn as SVG so it scales without blur; it runs horizontally (2rem tall) across a card's bottom edge or vertically (1rem wide) down the leading edge of the sound-system strip. Glyphs are authored in one stroke weight: 2.5px, square caps, 24-unit grid.

## Components

Controls of a bus: LED green for the one action, chrome-edged for the rest. All sizes are tap targets first (2.75rem minimum height, 3.5rem for the large control).

### Buttons
- **Where:** `src/lib/button-variants.ts` (cva), rendered by `Button`, `LinkButton` (internal route) and `AnchorButton` (external, opens new tab) in `src/components/ui/Button.tsx`. Internal navigation is always a real `<a>`; never a button inside a link.
- **Shape:** cut vinyl (4px), 2px border, label type at 0.95rem (1.1rem large), inline-flex with 0.5rem gap for a glyph.
- **Primary:** LED green fill, green-ink text, green border; padding 0 1.25rem at 2.75rem, 0 1.75rem at 3.5rem. One per view: Play, Join SZN, Share on WhatsApp.
- **Secondary:** transparent, white text, chrome border. The second door (Join SZN beside a WhatsApp primary; "Artist page").
- **Ghost:** transparent, chrome-tint text, no visible border. Tertiary actions ("Copy link").
- **Hover:** primary turns white (fill and border) keeping the dark ink; secondary and ghost gain a panel-black fill and white text or border. Transition 200ms ease-out on background, colour, border and transform.
- **Active:** translate down 1px. **Focus:** the global ring, 2px LED green, 3px offset. **Disabled:** 50% opacity, pointer-events off.

### Plates and Badges
- **Where:** `.plate` in `src/index.css`; `Badge` in `src/components/ui/Badge.tsx`.
- **Plate:** yellow vinyl, black label type, padding 0.35em 0.6em 0.3em, 4px radius. Roles, categories, release type and date, tags, "Not on this route". Inverted (`bg-bg text-fg`) when laid on a colour panel or as the second plate in a pair.
- **Badge `outline`:** transparent with a 1px chrome border. **Badge `mark`:** reflective red with white text. Sizes: 0.7rem and 0.8rem label.

### Cards / Containers
- **Where:** `Card`, `CardImage`, `CardContent` in `src/components/ui/Card.tsx`.
- **Corner Style:** 4px, overflow hidden.
- **Background:** `panel` is panel black with a hairline border; `outline` is transparent with a chrome border.
- **Shadow Strategy:** none. See Elevation.
- **Internal Padding:** 1rem, 1.25rem from 640px.

### Inputs / Fields
- **Where:** `src/components/ui/Input.tsx`; the newsletter form on Join.
- **Style:** panel-black fill, 2px hairline border, white text, chrome-tint placeholder, 4px radius, 2.75rem tall, 1rem side padding. Caret is LED green.
- **Focus:** border turns LED green (200ms colour transition); outline suppressed in favour of the border shift.
- **Error / Disabled:** errors are announced by `ErrorMessage` (2px reflective-red border, 4px radius, message left and action right); disabled is 50% opacity with a not-allowed cursor.

### Navigation
- **Where:** `src/components/layout/Header.tsx`, `Footer.tsx`; `.board` in `src/index.css`.
- **Route board (768px+):** a `.board` strip (panel black, hairline, inset chrome highlight) holding destinations as yellow label type at 1.05rem with 0.1em tracking, 2.75rem tall, separated by hairlines. Hover turns a destination white; the current stop turns LED green and its `LedDot` lights (opacity 0 to 1 with a green drop-shadow). Join SZN sits outside the board as a primary control; on its own route it inverts to white.
- **Phone:** a chrome-bordered 2.75rem menu button with an authored three-bar / cross glyph; the menu is a fixed gloss-black sheet under the header with 4rem rows at 1.875rem label size, a lit dot on the current stop, and a full-width green Join SZN at the bottom. Body scroll locks; Escape closes.
- **Footer:** a purple band, the wordmark, a "Destinations" column of yellow labels at 1.25rem, a "Base" column, social tiles (2.75rem square, hairline border, chrome-tint icon, white on hover), a chrome rule, then the credit line.

### LED Rule
- **Where:** `.led`, `.led--band`, `.led--loading` in `src/index.css`.
- 4px green pill with `--led-glow`, full width. Closes the header, sits beneath every `SectionHeader`, tops the sound-system strip, and separates a profile or release header from its body. The purple 8px band appears exactly twice per page at most (join, footer). `.led--loading` pulses opacity 0.25 to 1 over 1.2s as the loading state.

### Artist Panel (signature)
- **Where:** `src/components/shared/ArtistPanel.tsx`; laid out by `.panel-row`.
- A 4:5 link panel with a hairline border. With cover art: the image fills the panel and scales 1.03 over 500ms on hover. Without: the panel is painted (purple, yellow, or panel black, cycling by index) and the name is set at sign scale in the bottom-left. Captions sit bottom-left as two plates: the name in Bungee (1.35rem / 1.5rem) on yellow (black plate on a painted panel) and the role and location as a label on a black plate.

### Release Card (signature)
- **Where:** `src/components/shared/ReleaseCard.tsx`.
- A square cover in a hairline frame (image scales 1.02 on hover; missing cover shows the title in chrome Bungee), the title beneath in Bungee 1.125rem / 1.25rem turning yellow on hover, then a label meta line "artist · type · month year". When `isNew`, a 2rem chevron tape straddles the bottom edge (inset 0.75rem each side, half outside the frame) carrying a small "New" plate on the right, and the title drops to 1.75rem margin to clear it.

### Sound-System Strip (signature)
- **Where:** `src/components/sections/NowPlayingStrip.tsx`.
- Pinned to the bottom of the first viewport: an LED rule, then a row with a vertical tape strip (3.5rem by 1rem), the 56px cover tile, "Now playing · date" as a yellow label, the title in Bungee, the artist and type as a muted label, and the large primary Play with a `PlayGlyph`. Tapping Play swaps the label to "Playing", opens the player above the row, and replaces the button with platform switches. No iframe exists until that tap.

### Platform Switch
- **Where:** inline in `NowPlayingStrip`, `Release`, `Artist`.
- A 2.75rem label link with a 2px chrome border, 1rem side padding, the platform's `BrandIcon` at 16px in the platform's own colour, and the platform name. Hover turns the border white. Rendered only for platforms with a real URL.

### Play Button
- **Where:** `src/components/media/PlayButton.tsx`, used by `YouTubeFacade` and `SpotifyEmbed`.
- A 3.5rem green plate, 4px radius, centred over the poster, carrying `--led-glow` and a 26px cut-vinyl triangle. Scales 1.05 on hover, 0.95 on press, 200ms.

### Tape (signature)
- **Where:** `src/components/shared/Tape.tsx`.
- Authored SVG chevron pattern: reflective red chevrons on white vinyl, 16-unit repeat, `direction="right"` for a horizontal band and `"down"` for a vertical strip. It is the NEW mark and the strip's leading edge; it is never decoration elsewhere.

### Glyphs
- **Where:** `src/components/icons/Glyphs.tsx` (`ArrowRight`, `ArrowOut`, `PlayGlyph`, `LedDot`); `BrandIcon.tsx` for platform marks from simple-icons.
- One stroke weight (2.5, square caps). Arrows are chrome at rest and white on row hover; `ArrowOut` marks an external stop. `LedDot` is a 12px core-plus-bleed circle that draws in `currentColor`.

### Loading, Empty, Error, Honest States
- **Loading** (`LoadingSpinner`): a muted label ("Loading…") over a 10rem `.led--loading` strip warming up. Never a spinner. `LoadingSkeleton` is a panel-black 4px block.
- **Empty** (`EmptyState`): a hairline box, 2.5rem block padding, a yellow label title at 1.125rem, muted description, optional action.
- **Error** (`ErrorMessage`): `role="alert"`, 2px reflective-red border, message plus an action.
- **Not on this route** (404 and missing slugs): display heading ("No artist here."), a yellow plate "Not on this route", a muted line, one primary control back to the list.
- **Missing image:** painted panel with the name at sign scale (artist) or the title in chrome Bungee in the square (release). No placeholder photo, ever.
- **Missing config:** the WhatsApp control renders only when `SITE.whatsappCommunityUrl` exists (Join SZN takes primary otherwise); social tiles render only for configured handles; platform switches only for real links; Play only when a YouTube or Spotify playback exists, else the muted line "Streaming links coming — see the artist's page." Journal drafts carry an "In the works" plate on panel black and no date, read time or link.

### Motion
- **Where:** `src/lib/motion.ts`, `src/components/shared/Reveal.tsx`, `src/hooks/useReducedMotion.ts`, `.switch-on` in `src/index.css`.
- Three moves and nothing else. **Pull-in:** opacity 0 to 1 and x 32px to 0 over 600ms on `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 70ms per child with a 50ms lead, triggered once at 15% in view; used for panel rows and lists. **Switch-on:** a left-to-right `clip-path` reveal over 700ms on the same ease; used for LED elements. **Page transition:** fade in 250ms ease-out, fade out 150ms ease-in. Hover transitions are 200ms ease-out on colour and transform; image zoom is 500ms.
- **Reduced motion:** `useReducedMotion` (media query, or `?motion=off`) makes `Reveal` render a plain element with no variants; the global media rule forces every animation and transition to 0.01ms and disables smooth scroll. The loading LED still reads as static at 0.25 opacity.

## Do's and Don'ts

### Do:
- **Do** style every surface with the role tokens in `src/styles/tokens.css` and their Tailwind names (`bg-bg-raised`, `text-board`, `border-line`); never introduce a hue by hex in a component.
- **Do** keep LED green for actions only: one primary control per view, the focus ring, the caret, the lit dot, the LED rule.
- **Do** set wayfinding (destinations, stop numbers, categories, types, dates) as `.label` in board yellow or chrome-tint on black, with `.tabular` on numbers.
- **Do** separate a header from its body with a single `.led` rule, and end a page with the purple `.led--band` before the footer.
- **Do** frame every image in a hairline at 4px radius, square for covers and 4:5 for people, and paint the name when the image is missing.
- **Do** number lists as `<ol>` with hairline rules, 2-digit yellow numbers and 3rem-plus rows.
- **Do** mark NEW with the chevron `Tape` straddling an edge, never covering the artwork's title.
- **Do** use `Reveal` for every entrance and let it fall back to a plain element under reduced motion.
- **Do** keep 2.75rem minimum tap targets and a 2px green focus ring at 3px offset on everything focusable.
- **Do** load an iframe only after a tap; put a `PlayButton` over a poster until then.

### Don't:
- **Don't** use gradient text, gradient fills, or any blended colour; the palette is flat paint and flat light.
- **Don't** use glass: no backdrop blur, no translucent white or black panels.
- **Don't** put a kicker or eyebrow above a heading; the size of the Bungee is the hierarchy.
- **Don't** add a tonal or offset shadow to a card, panel, button or image; glow belongs only to green and purple LEDs and falls downward.
- **Don't** lay out same-size card grids as the page's structure; the first viewport is a route board, a panel row and a strip, and lists are numbered stops.
- **Don't** use unicode characters, emoji or text abbreviations as icons; use the authored glyphs or `BrandIcon`.
- **Don't** use a placeholder photo, an invented number, a date in a non-en-KE format, or a control for a link that is not configured.
- **Don't** set Bungee below 1rem or track it; drop to a `.label` instead.
- **Don't** make LED green a heading, body or plate colour, and don't make yellow a button.
- **Don't** add a fourth motion move or animate on scroll for its own sake; pull-in, switch-on and the page cut are the whole grammar.
