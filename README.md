# LOOMA — digital portfolio

A bilingual (Arabic / English) portfolio site for LOOMA, built from the *LOOMA Website Visual Identity System v1.0*.

Stack: Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000 — it redirects to `/ar`. English is at `/en`.

Production build:

```bash
npm run build
```

```bash
npm run start
```

## What still needs LOOMA's own material

The site is complete in structure and behaviour, but three things were not available when it was built. Each has one clear place to add it.

### 1. The official logo

The header, hero, loader and footer currently set the name "LOOMA" in the display typeface as a stand-in.

1. Copy the official files into `public/images/looma/logo/`:
   - `looma-wordmark.png` (the identity masks the wordmark from this file, ratio 826 × 196)
   - `looma-symbol.png`
2. In `content/site.ts` set `logo.available` to `true`.

The wordmark is then masked from the artwork and takes the colour of each room. It is never redrawn.

### 2. The official typefaces

Lucentra, TheSans and TheSansArabic are licensed fonts. Every font stack already names them first. Until the files are present the site uses the stand-ins the identity document itself uses: Cormorant Garamond, IBM Plex Sans and IBM Plex Sans Arabic (self-hosted, no external requests).

1. Copy the WOFF2 files into `public/fonts/`.
2. In `app/globals.css`, uncomment the `@font-face` block at the top and check the file names match.

### 3. Artwork photography

Every picture on the site is currently a placeholder drawn in code by the thread engine (`lib/thread.ts`), and labelled as such in the gallery. Nothing is a stock photo.

| Where | Folder | How to switch it on |
|---|---|---|
| Gallery, Colour and Black & White chapters | `public/images/looma/artworks/color/` and `.../black-white/` | In `content/artworks.ts`, set `image` on the artwork (and its real title, category and alt text) |
| Hero | `public/images/looma/hero/` | Replace the SVG in `components/sections/Hero.tsx` with `next/image` |
| Process steps | `public/images/looma/process/` | Replace the `processVisuals` list in `app/[locale]/page.tsx` |
| Craft close-ups, About | `public/images/looma/artists/` | Replace `MacroPlaceholder` in `components/sections/Chapters.tsx` |
| Before / After pairs | `public/images/looma/process/` | Replace the `pairs` list in `app/[locale]/page.tsx`; photograph each pair to the same crop |
| DIY | `public/images/looma/diy/` | Kept as line drawings on purpose until the kit exists |

Use descriptive file names (`portrait-father-black-white.jpg`, not `IMG_0042.jpg`). `next/image` serves AVIF/WebP and the right size automatically.

Also set `NEXT_PUBLIC_SITE_URL` to the real domain before launch; it feeds canonical URLs, the sitemap and Open Graph tags.

## Where things live

```
app/
  [locale]/layout.tsx   html lang/dir, fonts, metadata, JSON-LD, loader, header
  [locale]/page.tsx     the eleven chapters, in order
  globals.css           design tokens (colour, type, spacing, motion) and shared classes
  sitemap.ts, robots.ts
content/
  site.ts               contact details, logo switch, locales
  ar.ts, en.ts          all copy — nothing is hard-coded in components
  artworks.ts           the gallery's pieces
  types.ts              the shape both languages must satisfy
lib/
  thread.ts             the thread engine: nails, passes, hand-pulled lines
  i18n.ts               dictionary lookup, Arabic-Indic numerals
  lenis.ts              shared smooth-scroll handle, scroll lock for overlays
components/
  layout/               Header, LanguageSwitcher, Loader
  sections/             Hero, BeforeAfter, ProcessTimeline, Chapters, DiySequence, Closing
  gallery/              ArtworkGallery, ArtworkLightbox
  art/                  ThreadArt, ArtPiece, Placeholders
  motion/               SmoothScroll (Lenis + GSAP + reveals), CustomCursor
  ui/                   Logo, ChapterHead, ThreadDivider
```

## Editing content

- **Text:** `content/ar.ts` and `content/en.ts`. TypeScript reports any key missing from one language.
- **Phone / Instagram:** `content/site.ts`.
- **A new artwork:** add an entry to `content/artworks.ts` with a title in both languages, `tone` (`color` or `bw`), `category`, alt text and `image`.

## How the identity is applied

- **Colour:** only the six official colours. Rooms alternate Linen and Rich Black, with one Graphite room (craft) and one Taupe room (DIY). No gradients.
- **Type:** light weights, display for statements, sans for labels and body. Arabic is set in the Arabic face throughout, at its own sizes and line heights, with Arabic-Indic numerals.
- **One thread:** a hairline and a 6px nail are the only ornaments — chapter headings, dividers, the before/after seam, the process timeline, the DIY map and the closing ring.
- **Motion:** things are drawn or revealed, never bounced. Durations 240 / 560 / 960 / 1600 ms.
- **Arabic:** right-to-left with its own composition; in the before/after slider the original sits on the right.

## Motion and smooth scrolling

- Lenis drives the scroll and runs on GSAP's ticker, so ScrollTrigger and Lenis share one clock (`components/motion/SmoothScroll.tsx`).
- The process chapter pins and scrubs on desktop only. On phones, tablets and short windows it is a swipeable row.
- `prefers-reduced-motion` switches off the loader, the hero drawing, parallax, pinning and auto-play. All content and controls remain.

## Decisions worth knowing

- **React Bits is not used.** Its components (shader backgrounds, cursor effects, glitch text) conflict with the identity's rule that technology stays invisible, and the thread engine covers what the site needs with far less JavaScript.
- **No waitlist form for DIY.** There is no backend yet, and a form that sends nowhere would be dishonest. The chapter says "Coming soon" and nothing is offered for sale.
- **Single page per language.** Page-to-page transitions are not needed yet; the route structure (`/[locale]/...`) is ready for artwork detail pages later.
