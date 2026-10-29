# Gamify — Türkiye Özeti Dashboard

A React + TypeScript + Vite implementation of the **Gamify** "Türkiye Özeti"
(Turkey Summary) sales-analytics dashboard from Figma.

## Stack

- **React 18** + **TypeScript**
- **Vite 5** (build/dev)
- **lucide-react** (icons)
- **react-simple-maps** (interactive Turkey choropleth)
- Google Fonts: **Inter** + **Plus Jakarta Sans**
- Plain CSS with design tokens (no UI framework) — see `src/index.css`

## Getting started

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Project structure

```
src/
  App.tsx                 # page composition
  index.css               # design tokens + all component styles
  data.ts                 # all copy/values transcribed from the design
  turkeyRegions.ts          # 81 provinces -> 7 geographic regions mapping
  components/
    TopNav.tsx            # red logo + indigo nav + profile
    PageHeader.tsx        # "Türkiye Özeti" title + badge + subtitle
    FilterBar.tsx         # date tabs + filter selects
    KpiCards.tsx          # 3 ecosystem KPI cards
    LeagueDistribution.tsx# league cards (Elmas…Bronz) + breakdown table
    ChallengeSummary.tsx  # "Meydan Okuma Özeti" card
    AiAnalysis.tsx        # "AI Analizi" card
    RegionalSummary.tsx   # regional table + interactive map
    TurkeyMap.tsx         # interactive choropleth (react-simple-maps)
public/
  turkey.geojson          # Turkey 81-province boundaries (GeoJSON)
```

## The interactive map

`TurkeyMap.tsx` renders an interactive choropleth with **react-simple-maps**
(SVG + d3-geo). It loads `public/turkey.geojson` (81 provinces), colors each
province by its **region's** score on a light-lavender → indigo scale, and on
hover highlights the whole region and shows a tooltip (province, region, score).

- Province → 7-region mapping lives in `src/turkeyRegions.ts`.
- Region scores come from `regionRows` in `src/data.ts`.
- GeoJSON source: `github.com/cihadturhan/tr-geojson` (ODbL, open source);
  bundled locally so there's no external CDN dependency.

> Note: `react-simple-maps@3` supports React up to 18 (this project is on 18).
> If you upgrade to React 19, switch to `react-simple-maps@4.0.0-beta` or a
> maintained fork.

## Notes

- All data is static mock content matching the design. Wire `src/data.ts` to
  a real API to make it live.
- The layout targets the 1920px desktop design; the content sits in a centered
  1400px well while the page header aligns to the app chrome, as in Figma.
