# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:4321)
npm run build     # Build for production (outputs to dist/)
npm run preview   # Preview production build locally
```

No lint or test commands are configured.

## Architecture

Single-page Astro application — all content lives in `src/pages/index.astro`, which imports and composes all section components. Navigation uses hash anchors (`#hero`, `#planetas`, `#cartas`, etc.).

### Component Strategy

Two types of components coexist:

- **Astro components** (`src/components/*.astro`): Static, build-time rendered. Use inline `<script>` tags with vanilla JS for tab switching, accordion toggling, and other UI interactions.
- **React component** (`src/components/PlanetaryToday.tsx`): The only interactive/hydrated component. Loaded with `client:load`. Performs real-time planetary position calculations (Julian Day, VSOP87 approximations, moon phases, retrograde detection) entirely in the browser.

### Data Layer

All astrological data is hardcoded in TypeScript files under `src/data/`:

- `edward.ts` / `martina.ts` — Natal chart data (planets, houses, aspects, elements, modalities)
- `events2026.ts` — Array of 2026 astrological events
- `synastry.ts` — Relationship compatibility connections and tensions
- `analysis.ts` — Monthly analysis and the "three questions" section

Components import these directly — there are no API calls or dynamic data fetching.

### Styling

Tailwind CSS with custom theme tokens defined in `tailwind.config.mjs`:
- Color palette: `space-950/800/700`, `gold-300/400`, `silver-300`, `star-white`, `nebula-purple`
- Fonts: Cormorant Garamond (serif headings), Inter (sans body), Space Mono (mono)
- Custom utilities in `src/styles/global.css`: `.text-gradient-gold`, `.glow-gold`, `.glow-purple`, `.card`, `.badge`, `.section-title`

Tailwind is initialized with `applyBaseStyles: false` — base styles come from `global.css`.

### Project Domain

Personal astrological 2026 forecast site for Edward (born 1993, Bogotá) and Martina (born 1998, Chivilcoy). All content is written in Spanish. The reference document `edward_martina_astrologia_2026.md` contains the full analysis that the site is based on.
