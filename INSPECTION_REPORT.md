# PRE-CODING INSPECTION REPORT
**Date:** 2026-08-29  
**Task:** Implement WAGERline HOME page per FLOW_FINAL.md  
**Status:** Inspection Complete ✓

---

## STEP 1-3: PROJECT STRUCTURE ✓

**Current State:**
- Next.js 16.3.2 with App Router active
- `src/app/` routing confirmed with 7 stub pages:
  - live/page.tsx, sports/page.tsx, leagues/page.tsx, predictions/page.tsx, stats/page.tsx, news/page.tsx, rewards/page.tsx
- `src/components/` exists with basic components (Header.tsx, Dashboard.tsx, etc.)
- `src/app/layout.tsx` configured correctly
- `src/app/page.tsx` exists with ~1000 lines (currently using inline styles)

**Assessment:**
- ✓ Structure is ready for implementation
- ✓ No conflicts detected
- ✓ Routing infrastructure in place

---

## STEP 4-5: TAILWIND & CSS CONFIGURATION ✓

**Tailwind Config (tailwind.config.ts):**
- Content paths: `'./src/**/*.{js,ts,jsx,tsx,mdx}'` ✓
- Custom colors defined, but colors are RGBA-based, not exact hex
- Problem: Tailwind colors don't match FLOW_FINAL.md spec exactly

**Global CSS (globals.css):**
- Tailwind directives present (@tailwind base, components, utilities)
- CSS reset in place
- Dark theme baseline: #05080D

**Styling Approach Decision:**
- Historical issue: Tailwind CSS was configured but colors weren't rendering properly in previous attempts
- Current page.tsx uses **inline styles exclusively** (CSS-in-JS via React `style` prop)
- **Recommendation: CONTINUE with inline styles** for this implementation
- Reason: Ensures pixel-perfect color accuracy (#050816, #0A1020, #FFD400, etc.)
- Can switch to Tailwind later if CSS generation is verified

---

## STEP 6: CURRENT HOME PAGE STATE

**File:** `src/app/page.tsx` (24KB, ~600 lines)

**Current Implementation:**
- Header: Sticky, logo, 8-item navigation, search, language selector, auth buttons ✓
- Hero Section: Exists but needs image asset and proper layout ⚠️
- Live Match Card: Partial implementation ⚠️
- Dashboard: Started, but needs complete implementation ⚠️
- Footer: Not yet implemented ✗

**Code Quality:**
- Using `'use client'` (React client component) ✓
- Lucide icons imported ✓
- Inline styles for all styling ✓
- No Tailwind class mixing ✓

**Issues Found:**
1. Hero section styling needs refinement
2. Dashboard grid layout incomplete
3. Some mock data present but not comprehensive
4. Footer missing

---

## STEP 7: REFERENCE IMAGE ANALYSIS

**Untitled.png contains:**
- Multiple page views (Home, Live, Sports, Leagues, etc.)
- Dark theme (#050816 background) ✓
- Yellow accents (#FFD400) ✓
- Dense dashboard layout with cards ✓
- Live indicators (red badges) ✓
- Player images and league logos ✓
- Complex multi-row grid layouts ✓

**Specific HOME Page (top-left view) shows:**
1. Fixed header with logo + 8-item nav ✓
2. Hero section with sports stadium background image
3. Live match card (right side)
4. Top leagues horizontal strip
5. 8-widget dashboard grid (2 rows)
6. Footer

---

## STEP 8: REUSABLE COMPONENT OPPORTUNITIES

**Components to extract/create:**
1. Header (already exists, needs enhancement)
2. Footer (missing, needs creation)
3. Hero Section (partial, needs refinement)
4. Live Match Card (partial, needs completion)
5. Top Leagues Strip (missing, needs creation)
6. Dashboard Grid Container (missing)
7. Individual Widget Components:
   - LiveNowCard
   - AIPredictionsCard
   - LeagueTableCard
   - PlayerSpotlightCard
   - TopNewsCard
   - YourRewardsCard
   - NewsWidget (2-column)
   - RewardsWidget (4-section)

**Recommended Structure:**
```
src/components/
  layout/
    Header.tsx (enhance)
    Footer.tsx (create)
  home/
    HeroSection.tsx
    LiveMatchCard.tsx
    TopLeaguesSection.tsx
    DashboardGrid.tsx
    LiveNowCard.tsx
    AIPredictionsCard.tsx
    LeagueTableCard.tsx
    PlayerSpotlightCard.tsx
    TopNewsCard.tsx
    YourRewardsCard.tsx
    NewsWidget.tsx
    RewardsWidget.tsx
```

---

## STEP 9: GAP ANALYSIS (Current vs Reference)

| Section | Status | Gap |
|---------|--------|-----|
| Header | Partial | Logo styling, nav underline, auth button styling |
| Hero | Partial | Background image asset, button styling |
| Live Match Card | Partial | Score display, events list, tabs |
| Top Leagues | Missing | Entire section needs creation |
| Dashboard Grid | Partial | Row 2 asymmetry not implemented |
| LiveNow Card | Missing | Complete widget |
| AI Predictions | Missing | Complete widget with probability bars |
| League Table | Missing | Complete widget with standings |
| Player Spotlight | Missing | Complete widget with player image/stats |
| Top News | Missing | Complete widget with news items |
| Your Rewards | Missing | Complete widget with profile/XP |
| News Widget | Missing | Complete 2-column widget |
| Rewards Widget | Missing | Complete 4-section widget |
| Footer | Missing | Complete footer with 3-column layout |

**Completeness: ~25% (Header + Hero partial, most widgets missing)**

---

## STEP 10: IMPLEMENTATION PLAN

### Phase 1: Foundation (Complete inline styles approach)
1. Update globals.css with proper color CSS variables
2. Verify inline styles render without errors
3. Set up page composition structure

### Phase 2: Header Enhancement
1. Refine logo styling (#FFD400 color)
2. Implement nav active state (yellow underline)
3. Ensure search, language, auth buttons match spec
4. Test all navigation links work

### Phase 3: Hero Section
1. Set up 66/34 column layout (hero/live-match)
2. Add hero background image (multi-sport stadium)
3. Implement headline (All Sports / All Intelligence / One Platform)
4. Create buttons (Explore Live, View Predictions)
5. Add play button (64px, bottom-right)

### Phase 4: Live Match Card
1. Create card container (background, border, padding)
2. Implement header with LIVE badge (red)
3. Display match (Manchester City 2-1 Liverpool)
4. Add events list
5. Implement tabs (Overview, Timeline, Stats, Lineups)

### Phase 5: Top Leagues Section
1. Create section container
2. Build 10-league grid
3. Use trophy/league icons (Lucide)
4. Add league names and countries
5. Ensure dense layout

### Phase 6: Dashboard Grid Setup
1. Create grid container (16px gap)
2. Implement Row 1: 4 equal columns
3. Implement Row 2: 1fr + 1fr + 2fr + 1fr (asymmetric)

### Phase 7: Dashboard Widgets (Row 1)
1. LiveNowCard: 4-5 matches, View All link
2. AIPredictionsCard: 3 predictions, probability bars
3. LeagueTableCard: 5 teams, standings table
4. PlayerSpotlightCard: Player image, stats, tabs

### Phase 8: Dashboard Widgets (Row 2)
1. TopNewsCard: 3 news items
2. YourRewardsCard: Profile, XP, stats
3. NewsWidget: Featured article + sidebar (2-column)
4. RewardsWidget: Balance, tasks, badges, buttons

### Phase 9: Footer
1. Create 3-column layout
2. Logo + copyright (left)
3. Links: About, Contact, Privacy, Terms (center)
4. Languages: EN, ES, AR (right)

### Phase 10: Polish & QA
1. Verify all colors match (#050816, #0A1020, #FFD400, #EF233C, etc.)
2. Verify spacing (16px/24px/32px gaps)
3. Verify border-radius (12px)
4. Test all links and interactions
5. Visual comparison with Untitled.png reference

---

## CRITICAL DECISIONS

**1. Styling Approach: INLINE STYLES**
- ✓ Ensures exact color matching
- ✓ No Tailwind rendering issues
- ✓ All styles co-located with JSX
- ✓ Easy to verify against spec

**2. Component Architecture: MONOLITHIC PAGE.TSX (for now)**
- Can use single ~1000-line page.tsx with all inline styles
- OR extract to component files in src/components/
- Recommendation: Extract to components for maintainability

**3. Image Assets**
- Use real images (Lucide icons for logos/badges)
- Hero background: multi-sport stadium image
- Player portraits: Real player images
- League logos: Lucide Trophy or real SVG assets
- News images: Placeholder backgrounds (#111A2D) for now

**4. Grid Layout (ROW 2 - CRITICAL)**
- Do NOT force 4 equal columns
- Correct layout: 1fr + 1fr + 2fr + 1fr
- News widget spans 2 columns intentionally
- Grid system must support this asymmetry

---

## SUCCESS CHECKLIST (Before Coding Starts)

- [x] Project structure verified
- [x] Routing confirmed
- [x] Styling approach chosen (inline styles)
- [x] Reference image reviewed
- [x] Gap analysis completed
- [x] Component opportunities identified
- [x] Implementation plan created
- [x] No conflicts detected
- [x] Ready to begin Phase 1

---

## NEXT IMMEDIATE ACTIONS

1. ✓ **Pre-coding inspection complete**
2. → **Begin Phase 1: Foundation** (update globals.css, verify styling)
3. → **Continue with Header Enhancement (Phase 2)**
4. → **Implement Hero Section (Phase 3)**
5. → Continue through Phase 10

**Estimated Timeline:**
- Phases 1-2: 30 minutes (header, foundation)
- Phases 3-4: 1 hour (hero, live match)
- Phases 5-6: 30 minutes (leagues, grid setup)
- Phases 7-8: 1.5 hours (8 widgets)
- Phase 9: 20 minutes (footer)
- Phase 10: 30 minutes (QA, polish)

**Total: ~4 hours for complete implementation**

---

## CRITICAL REMINDERS

🔴 **SCREENSHOT IS SOURCE OF TRUTH**
- If Untitled.png and this spec differ visually: follow the screenshot
- Do NOT redesign the interface
- Do NOT simplify
- Do NOT add sections not in reference

✅ **REQUIRED DELIVERABLES**
- Pixel-accurate HOME page at desktop viewport
- All 8 widgets in dashboard (not placeholders)
- Real image assets (not emoji)
- All links functional
- Colors exact (#050816, #0A1020, #FFD400, #EF233C)
- Spacing: 16px/24px/32px gaps
- Border-radius: 12px on all cards

---

**INSPECTION COMPLETED BY:** Claude Code Agent  
**AUTHORIZATION:** Proceed to Phase 1 implementation
