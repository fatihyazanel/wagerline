# WAGERline --- Frontend UI & Pixel-Accurate Implementation Specification

**Document Type:** Master UI / Frontend Implementation Specification\
**Product:** WAGERline --- Sports Intelligence Platform\
**Primary Reference:** Supplied WAGERline Figma/PNG screens\
**Implementation:** Next.js + Tailwind CSS + Lucide Icons\
**Languages:** EN / ES / AR\
**Primary UI Theme:** Dark Sports Intelligence Dashboard\
**Status:** Implementation-ready specification

------------------------------------------------------------------------

# 1. PURPOSE

This document is the single source of truth for implementing the
WAGERline frontend.

The supplied Figma/PNG designs are the **visual source of truth**. The
implementation must reproduce the supplied visual composition rather
than creating a generic sports dashboard.

The developer must not reinterpret, simplify, redesign, rearrange, or
replace the supplied interface with a generic SaaS/admin template.

The application must preserve:

-   overall page composition
-   header structure
-   navigation order
-   dark visual identity
-   yellow WAGERline accent
-   card density
-   card hierarchy
-   spacing
-   borders
-   rounded corners
-   typography hierarchy
-   charts
-   progress bars
-   badges
-   league/team/player imagery
-   news imagery
-   statistics
-   tables
-   live indicators
-   reward components
-   language selector
-   footer
-   responsive behavior

If a visual element exists in the reference design, it must be
represented in the implementation.

------------------------------------------------------------------------

# 2. NON-NEGOTIABLE IMPLEMENTATION RULES

## 2.1 Visual Source of Truth

The supplied reference image has priority over assumptions.

When the written specification and the image appear to differ:

1.  Preserve the reference image's visual composition.
2.  Preserve the visible information hierarchy.
3.  Do not invent a different layout.
4.  Do not convert the page into a conventional landing page.
5.  Do not remove dense dashboard widgets merely because they are
    secondary.
6.  Do not replace cards with large empty sections.
7.  Do not introduce a new color system.

## 2.2 Do Not Build a Generic Dashboard

Do NOT produce:

-   generic Bootstrap dashboard
-   generic Tailwind dashboard
-   generic SaaS landing page
-   large white/light cards
-   excessive whitespace
-   oversized typography
-   unrelated sidebar navigation
-   arbitrary gradients
-   unrelated illustrations
-   random charts
-   random widgets
-   placeholder blocks that materially change the composition

The target is a **premium sports intelligence platform**.

## 2.3 Pixel-Accurate Principle

"Pixel accurate" means:

-   same component hierarchy
-   same relative component sizes
-   same major alignment
-   same column proportions
-   same visual density
-   same content placement
-   same visual rhythm
-   same dark/light contrast
-   same yellow accent behavior

Exact pixel values may be adjusted slightly for browser rendering, but
the visual result must remain materially identical to the reference.

------------------------------------------------------------------------

# 3. APPLICATION STRUCTURE

The main navigation is:

``` text
Home
Live
Sports
Leagues
Predictions
Stats
News
Rewards
```

Admin is a separate administrative area.

Recommended routes:

``` text
/
 /live
 /sports
 /leagues
 /predictions
 /stats
 /news
 /rewards
 /admin
```

The supplied Home reference is the primary implementation target for
`/`.

------------------------------------------------------------------------

# 4. GLOBAL DESIGN SYSTEM

## 4.1 Theme

WAGERline uses a dark sports-data interface.

Primary visual characteristics:

-   almost-black navy page background
-   slightly lighter navy cards
-   subtle blue/navy borders
-   white primary text
-   muted gray secondary text
-   WAGERline yellow as primary accent
-   sport-specific accent colors only where useful
-   red for LIVE / danger / negative status
-   green for positive status
-   purple for selected reward/achievement elements
-   blue/cyan for selected analytics elements

The interface must feel:

``` text
Premium
Fast
Sports-focused
Data-rich
Modern
Competitive
Intelligent
```

## 4.2 Color Tokens

Use CSS variables/Tailwind tokens rather than scattering raw values
throughout components.

Suggested semantic tokens:

``` text
--background: #050816
--surface: #0A1020
--surface-2: #0D1426
--surface-3: #111A2D
--border: #263149
--border-soft: #1B263D

--text-primary: #F7F8FC
--text-secondary: #A8B0C0
--text-muted: #737C8F

--brand-yellow: #FFD400
--brand-yellow-strong: #FFC400

--live-red: #EF233C
--success: #22C55E
--warning: #FACC15
--info: #38BDF8
--purple: #8B5CF6
```

These values are implementation guidance. The reference visual
appearance has priority.

## 4.3 Typography

Use a modern sans-serif font.

Hierarchy:

``` text
Page title: 24–32px / semibold-bold
Section title: 16–18px / semibold
Card title: 14–16px / semibold
Body: 12–14px
Metadata: 10–12px
Table data: 11–13px
Hero title: 28–34px / bold
```

Do not use extremely large headings that destroy dashboard density.

## 4.4 Borders

Cards use subtle borders.

Characteristics:

-   1px border
-   low contrast
-   dark blue/navy tone
-   rounded corners
-   no heavy shadows

## 4.5 Border Radius

Recommended:

``` text
Cards: 10–14px
Buttons: 8–10px
Pills: 999px
Inputs: 8–10px
```

## 4.6 Spacing

Use a consistent spacing scale.

Primary spacing:

``` text
4px
8px
12px
16px
20px
24px
32px
```

Avoid arbitrary spacing values unless necessary for matching the
reference.

------------------------------------------------------------------------

# 5. GLOBAL HEADER

The header is visible on the Home screen and should be implemented as a
reusable component.

Approximate structure:

``` text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO │ Home │ Live │ Sports │ Leagues │ Predictions │ Stats │ News │ Rewards │
│                                      Search │ Language │ Login │ Sign Up     │
└────────────────────────────────────────────────────────────────────────────┘
```

## 5.1 Left

WAGERline logo:

``` text
[Yellow W icon] WAGERline
```

The wordmark uses:

-   WAGER in white
-   line in yellow

The logo must be visually prominent but not oversized.

## 5.2 Navigation

Order:

``` text
Home
Live
Sports
Leagues
Predictions
Stats
News
Rewards
```

Active state for Home:

-   yellow text/icon
-   yellow underline
-   visually stronger than inactive links

Inactive links:

-   white/light gray
-   no underline

## 5.3 Search

Right-side search field:

``` text
Search teams, players...
```

Include Lucide:

``` text
Search
```

Search field is dark, rounded and bordered.

## 5.4 Language Selector

Global language selector:

``` text
🌐 EN
```

Dropdown:

``` text
🇬🇧 EN
🇪🇸 ES
🇸🇦 AR
```

The supplied design shows the dropdown as a dark floating panel below
the language control.

Use:

``` text
Globe2
ChevronDown
```

Do not use emoji as the only icon implementation. Country/language flags
may be represented using assets or appropriate flag icons.

## 5.5 Login

Dark outlined button:

``` text
Login
```

## 5.6 Sign Up

Primary yellow button:

``` text
Sign Up
```

The Sign Up button is visually dominant.

------------------------------------------------------------------------

# 6. HOME PAGE --- PRIMARY REFERENCE

The Home page is NOT a simple hero landing page.

It is a **dense sports intelligence dashboard**.

The complete page is composed of:

``` text
1. Header
2. Hero + Live Match
3. Top Leagues
4. Live Now
5. AI Predictions
6. League Table
7. Player Spotlight
8. Top News
9. Your Rewards
10. News
11. Rewards
12. Footer
```

------------------------------------------------------------------------

# 7. HOME PAGE GLOBAL GRID

The page should use a centered content container.

Recommended:

``` text
max-width: approximately 1500px
margin: 0 auto
padding: 16px
```

The reference image is approximately 1536×1024 and shows a dense desktop
dashboard.

Do not create a narrow website.

The desktop layout should use the full available horizontal space.

------------------------------------------------------------------------

# 8. HERO SECTION

The Hero is the first major content area below the header.

Layout:

``` text
┌──────────────────────────────────────────────┬──────────────────────┐
│                                              │                      │
│              HERO VISUAL                     │     LIVE MATCH       │
│                                              │                      │
│  All Sports.                                 │                      │
│  All Intelligence.                           │       2 - 1          │
│  One Platform.                               │                      │
│                                              │                      │
└──────────────────────────────────────────────┴──────────────────────┘
```

Approximate ratio:

``` text
Hero: 66–68%
Live Match: 32–34%
```

## 8.1 Hero Background

The hero must contain a high-impact multi-sport stadium composition.

Visible sports represented in the reference:

-   football
-   basketball
-   American football
-   hockey
-   Formula 1

The image should fill the hero area.

Do not replace the composition with a plain gradient.

Use:

``` text
background-size: cover
background-position: center
```

Add a subtle dark overlay only when necessary for text readability.

## 8.2 Hero Text

Position: left side.

Headline:

``` text
All Sports.
All Intelligence.
One Platform.
```

The first two lines are white.

The final line:

``` text
One Platform.
```

is yellow.

## 8.3 Hero Description

``` text
Live scores, stats, AI predictions
and everything you need to stay ahead.
```

## 8.4 Hero Buttons

Primary:

``` text
Explore Live
```

Yellow filled button.

Secondary:

``` text
View Predictions
```

Dark/transparent outlined button.

## 8.5 Hero Play Icon

The reference contains a circular play affordance near the upper/right
side of the visual composition.

Use Lucide:

``` text
Play
```

inside a circular button.

------------------------------------------------------------------------

# 9. LIVE MATCH HERO CARD

Right of the Hero.

Header:

``` text
Live Match
● LIVE
```

LIVE must be red.

Competition:

``` text
Premier League – Round 36
```

Match:

``` text
Manchester City       2 - 1       Liverpool
```

Display team logos prominently.

Score:

``` text
2 - 1
```

Large white text.

Time:

``` text
75:35
```

Use red time badge.

Events:

``` text
23' Haaland
45+2' De Bruyne
37' Salah
```

The visual hierarchy must match the supplied design.

## 9.1 Tabs

Bottom:

``` text
Overview
Timeline
Stats
Lineups
H2H
```

Active:

``` text
Overview
```

Active underline is WAGERline yellow.

------------------------------------------------------------------------

# 10. TOP LEAGUES

Full-width horizontal card immediately below Hero.

Header:

``` text
Top Leagues
```

League items:

``` text
Premier League
England

La Liga
Spain

Serie A
Italy

Bundesliga
Germany

Ligue 1
France

Süper Lig
Türkiye

NBA
USA

NFL
USA

NHL
USA

F1
World
```

Each item contains:

-   league logo
-   league name
-   country/region
-   consistent spacing

The strip should be horizontal and dense.

Do not turn it into large cards.

------------------------------------------------------------------------

# 11. MAIN DASHBOARD GRID

After Top Leagues, use the multi-column dashboard.

Desktop structure:

``` text
┌───────────────┬───────────────┬───────────────┬───────────────┐
│               │               │               │               │
│   LIVE NOW    │ AI PREDICTIONS│ LEAGUE TABLE  │ PLAYER        │
│               │               │               │ SPOTLIGHT     │
│               │               │               │               │
├───────────────┼───────────────┼───────────────┼───────────────┤
│               │               │               │               │
│   TOP NEWS    │ YOUR REWARDS  │ NEWS          │ REWARDS        │
│               │               │               │               │
└───────────────┴───────────────┴───────────────┴───────────────┘
```

The exact widths may be tuned against the reference, but the visual
concept must remain four primary vertical content zones.

------------------------------------------------------------------------

# 12. LIVE NOW CARD

Title:

``` text
Live Now
● LIVE
```

List live events.

Reference content:

``` text
Premier League
Man City        2 - 1        Liverpool        LIVE 75'

La Liga
Barcelona       1 - 0        Real Madrid      LIVE 62'

NBA
Lakers          83 - 78      Warriors          LIVE Q4

NHL
Toronto         3 - 2        Montreal          LIVE Q3

Formula 1
Max Verstappen                 P1  46/58
```

Each row contains:

-   sport/league icon
-   competition
-   teams/driver
-   score/status
-   LIVE badge where applicable
-   time/period

Bottom-right:

``` text
View All Live →
```

Use Lucide:

``` text
ArrowRight
Radio
```

Rows must remain compact.

------------------------------------------------------------------------

# 13. AI PREDICTIONS CARD

Header:

``` text
AI Predictions
See All →
```

Use three prediction cards.

## Prediction 1

``` text
Man City vs Liverpool
Premier League

Man City     58%
Draw         22%
Liverpool    20%
```

Display a three-segment probability bar.

Color logic:

``` text
Home = blue/cyan
Draw = muted gray
Away = red
```

## Prediction 2

``` text
Real Madrid vs Barcelona
La Liga

Real Madrid  48%
Draw         27%
Barcelona    25%
```

## Prediction 3

``` text
Lakers vs Warriors
NBA

Lakers       60%
Warriors     40%
```

The prediction component should visually communicate probability rather
than only displaying numbers.

------------------------------------------------------------------------

# 14. LEAGUE TABLE CARD

Header:

``` text
League Table
```

Selectors:

``` text
Premier League ▼
2025/2026 ▼
```

Table:

``` text
# | Team | P | W | D | L | GF | GA | GD | Pts | Form
```

Reference rows:

``` text
1  Man City       34 24 7 3 82 32 +50 79
2  Arsenal        34 22 7 5 76 26 +47 73
3  Liverpool      34 22 6 6 78 30 +48 72
4  Aston Villa    34 18 7 9 54 42 +12 61
5  Tottenham      34 17 6 11 62 47 +15 57
```

Form is represented with small colored squares.

Bottom:

``` text
View Full Table →
```

The table must remain compact and readable.

------------------------------------------------------------------------

# 15. PLAYER SPOTLIGHT

Reference player:

``` text
Erling Haaland
Manchester City
Forward
```

Show:

-   large player image
-   club logo
-   country flag
-   position

Stats:

``` text
24       194cm       94kg
Age      Height      Weight

Right
Foot
```

Tabs:

``` text
Overview
Stats
Matches
Career
News
```

Active tab:

``` text
Overview
```

Season section:

``` text
Season Stats (2025/2026)

Matches       28
Goals         27
Assists        5
Avg Rating    7.91
```

This is a compact player intelligence card, not a full player profile
page.

------------------------------------------------------------------------

# 16. TOP NEWS

Header:

``` text
Top News
View All News →
```

Three cards.

Reference headlines:

``` text
Haaland double helps Man City to win against Liverpool

Lakers secure important win at home

Verstappen takes pole in dramatic qualifying
```

Each card:

-   large image
-   category
-   headline
-   relative time

Examples:

``` text
PREMIER LEAGUE
2h ago

NBA
4h ago

FORMULA 1
6h ago
```

Images should be visually prominent.

------------------------------------------------------------------------

# 17. YOUR REWARDS

Header:

``` text
Your Rewards
View All →
```

Primary level card:

``` text
Level 7
Elite Fan

2,450 / 3,000 XP

Next Level
```

Show a horizontal XP progress bar.

Below:

``` text
Badges     12
Points     2,450
Rank       #3,210
```

The card should use purple/yellow reward styling consistent with the
supplied reference.

------------------------------------------------------------------------

# 18. NEWS CARD

This is separate from Top News.

It is a larger editorial widget.

Main featured article:

``` text
Mbappé returns as Real Madrid
win big in La Liga
```

Use a large image.

Right-side compact news list:

``` text
NBA Playoffs: Celtics take control of the series

NFL Draft 2026: Top prospects to watch
```

Below, include smaller article cards covering different sports.

The layout must preserve the reference's mixed-size editorial grid.

------------------------------------------------------------------------

# 19. REWARDS CARD

Right-side reward widget.

Top:

``` text
Your Balance

2,450 Points

How to Earn →
```

Daily Tasks:

``` text
Login to the platform       +10 ✓
View 3 live matches         +20 ✓
Make a prediction           +50 ✓
Read a news article         +10 ✓
```

Use compact rows.

Below:

``` text
Badges
View All →
```

Badges:

``` text
Early Bird
Predictor
Stat Hunter
Champion
```

Badge icons should be visually prominent.

------------------------------------------------------------------------

# 20. FOOTER

Bottom of Home.

Left:

``` text
WAGERline
© 2026 All rights reserved.
```

Center/right links:

``` text
About Us
Contact
Privacy Policy
Terms of Use
```

Language shortcuts may appear at the bottom:

``` text
🇬🇧 English
🇪🇸 Español
🇸🇦 العربية
```

The footer must remain compact.

------------------------------------------------------------------------

# 21. HOME PAGE CONTENT HIERARCHY

The vertical priority must be:

``` text
HEADER
↓
HERO + LIVE MATCH
↓
TOP LEAGUES
↓
LIVE NOW / AI PREDICTIONS / LEAGUE TABLE / PLAYER
↓
TOP NEWS / YOUR REWARDS / NEWS / REWARDS
↓
FOOTER
```

Do not reorder these major sections without explicit approval.

------------------------------------------------------------------------

# 22. COMPONENT ARCHITECTURE

Recommended component structure:

``` text
components/
  layout/
    Header.tsx
    Footer.tsx
    LanguageSelector.tsx
    SearchBar.tsx

  home/
    HeroSection.tsx
    LiveMatchHero.tsx
    TopLeagues.tsx
    LiveNowCard.tsx
    AIPredictionsCard.tsx
    LeagueTableCard.tsx
    PlayerSpotlightCard.tsx
    TopNewsCard.tsx
    YourRewardsCard.tsx
    NewsWidget.tsx
    RewardsWidget.tsx

  shared/
    TeamLogo.tsx
    LeagueLogo.tsx
    LiveBadge.tsx
    StatCard.tsx
    ProgressBar.tsx
    ProbabilityBar.tsx
    SportIcon.tsx
    NewsImage.tsx
```

Do not create one enormous Home component.

------------------------------------------------------------------------

# 23. ICON SYSTEM

Use **Lucide React**.

Examples:

``` text
Home
Search
Globe2
ChevronDown
ChevronRight
ArrowRight
Play
Radio
CalendarDays
Clock3
Trophy
Star
Award
User
Users
BarChart3
TrendingUp
CircleCheck
CircleAlert
Settings
Menu
X
```

Do not use arbitrary icon libraries if Lucide can represent the icon.

Sport logos and team logos are not Lucide icons. They must use image/SVG
assets.

------------------------------------------------------------------------

# 24. DATA MODEL

The UI must not depend on hard-coded JSX text.

Create typed data objects.

Example:

``` ts
type LiveMatch = {
  league: string
  sport: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: string
  minute?: string
  isLive: boolean
}
```

Prediction:

``` ts
type Prediction = {
  homeTeam: string
  awayTeam: string
  league: string
  homeProbability: number
  drawProbability?: number
  awayProbability: number
}
```

League table:

``` ts
type LeagueStanding = {
  position: number
  team: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string[]
}
```

News:

``` ts
type NewsItem = {
  title: string
  category: string
  image: string
  publishedAt: string
  sport: string
}
```

Player:

``` ts
type PlayerSpotlight = {
  name: string
  club: string
  position: string
  nationality: string
  age: number
  height: string
  weight: string
  foot: string
  matches: number
  goals: number
  assists: number
  rating: number
}
```

Rewards:

``` ts
type RewardProfile = {
  level: number
  title: string
  xp: number
  nextLevelXp: number
  points: number
  rank: number
  badges: string[]
}
```

------------------------------------------------------------------------

# 25. IMAGE / ASSET RULES

Images are a critical part of the reference design.

Do not replace major visual imagery with gray placeholders in the final
UI.

Required asset groups:

``` text
/logo
/sports
/leagues
/teams
/players
/news
/rewards
```

Examples:

``` text
Manchester City logo
Liverpool logo
Premier League logo
La Liga logo
Serie A logo
Bundesliga logo
Ligue 1 logo
NBA logo
NFL logo
NHL logo
F1 logo
Player portraits
News images
Reward badge artwork
```

Use `next/image` where appropriate.

Use proper aspect ratios and object-fit.

------------------------------------------------------------------------

# 26. RESPONSIVE DESIGN

The supplied reference is desktop-first.

Desktop must be pixel-accurate first.

Suggested behavior:

## Desktop ≥ 1280px

Use full four-column dashboard composition.

## Tablet 768--1279px

Collapse from four columns to two columns.

Suggested order:

``` text
Hero
Live Match
Top Leagues
Live Now
AI Predictions
League Table
Player
Top News
Your Rewards
News
Rewards
```

## Mobile \< 768px

Use one-column stacked cards.

Header becomes:

``` text
Logo
Menu
Search
Language
```

Navigation moves into mobile menu.

Hero becomes vertically structured.

Do not simply shrink the desktop layout until it becomes unusable.

------------------------------------------------------------------------

# 27. RESPONSIVE PRIORITY

On mobile preserve this order:

``` text
1 Header
2 Hero
3 Live Match
4 Top Leagues
5 Live Now
6 AI Predictions
7 League Table
8 Player Spotlight
9 Top News
10 Your Rewards
11 News
12 Rewards
13 Footer
```

------------------------------------------------------------------------

# 28. ACCESSIBILITY

All interactive elements must have:

-   keyboard focus
-   accessible labels
-   visible focus state
-   semantic buttons/links
-   appropriate ARIA only where needed

Images require meaningful alt text where informative.

Decorative images may use empty alt.

Color must not be the only way to communicate status.

Example:

LIVE should use:

``` text
red badge + LIVE text
```

not color alone.

------------------------------------------------------------------------

# 29. PERFORMANCE

Use:

-   Next.js Image
-   lazy loading for below-the-fold images
-   reusable components
-   static/mock data during UI implementation
-   minimal client components
-   server components where possible

Do not load the entire application as one client component.

------------------------------------------------------------------------

# 30. INTERNATIONALIZATION

Supported languages:

``` text
EN
ES
AR
```

All user-facing text must be translation-ready.

Do not hard-code language-specific strings directly into components.

Recommended structure:

``` text
/locales
  en.json
  es.json
  ar.json
```

Arabic requires RTL support.

When AR is active:

``` css
direction: rtl;
```

The visual structure should remain equivalent while respecting RTL
reading direction.

------------------------------------------------------------------------

# 31. HOME PAGE TRANSLATION EXAMPLES

EN:

``` text
Home
Live
Sports
Leagues
Predictions
Stats
News
Rewards

All Sports.
All Intelligence.
One Platform.

Explore Live
View Predictions

Top Leagues
Live Now
AI Predictions
League Table
Your Rewards
Top News
News
Rewards
```

ES:

``` text
Inicio
En Vivo
Deportes
Ligas
Predicciones
Estadísticas
Noticias
Recompensas

Todos los deportes.
Toda la inteligencia.
Una plataforma.

Explorar en vivo
Ver predicciones
```

AR:

``` text
الرئيسية
مباشر
الرياضات
الدوريات
التوقعات
الإحصائيات
الأخبار
المكافآت
```

All content must be stored in translation resources.

------------------------------------------------------------------------

# 32. INTERACTION BEHAVIOR

The Home page must feel alive.

Interactions:

## Navigation

Active menu changes based on current route.

## Live Cards

Clicking a live match navigates to its match detail.

## Prediction

Clicking a prediction opens prediction/match details.

## League Table

Clicking league/team navigates to relevant page.

## Player

Clicking player opens player detail.

## News

Clicking article opens article detail.

## Rewards

Clicking reward card opens Rewards page.

## Top Leagues

Clicking league opens League detail.

------------------------------------------------------------------------

# 33. HOVER STATES

Cards should have subtle hover behavior.

Recommended:

``` text
border becomes slightly brighter
background becomes slightly lighter
```

Do not use exaggerated animations.

Use:

``` css
transition: all 150ms ease;
```

Avoid:

-   large scaling
-   bouncing
-   neon glow
-   excessive shadows

------------------------------------------------------------------------

# 34. LIVE STATUS

LIVE badges are consistently red.

Example:

``` text
● LIVE
```

Use compact rounded badges.

Live scores should be visually stronger than secondary metadata.

------------------------------------------------------------------------

# 35. PROGRESS / ANALYTICS VISUALS

Progress bars:

-   rounded
-   thin
-   high contrast
-   yellow/purple/blue depending on context

Prediction bars:

``` text
Home | Draw | Away
```

Use percentages.

Reward XP bar:

``` text
Current XP ━━━━━━━━━━━░░
```

League form:

``` text
● ● ● ● ●
```

Do not replace these with plain text.

------------------------------------------------------------------------

# 36. TABLE DENSITY

The League Table must remain dense.

Do not increase row height unnecessarily.

Target:

``` text
compact rows
small logos
small typography
clear numeric alignment
```

Numbers should be aligned for scanning.

------------------------------------------------------------------------

# 37. NEWS DENSITY

News should combine:

``` text
large featured article
+
small articles
+
small sport cards
```

Do not make every news card equal width.

The reference deliberately uses a mixed editorial hierarchy.

------------------------------------------------------------------------

# 38. REWARDS VISUAL LANGUAGE

Rewards should visually differ from ordinary statistics.

Use:

-   trophy
-   badge
-   shield
-   XP
-   rank
-   points
-   achievement icons

Purple and yellow may be used as secondary reward accents.

The Rewards area should feel gamified but still premium.

------------------------------------------------------------------------

# 39. HOME PAGE FINAL VISUAL BLUEPRINT

The implementation must visually approximate this structure:

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ WAGERline │ Home │ Live │ Sports │ Leagues │ Predictions │ Stats │ News │ ...│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌──────────────────────────────────────────────┐ ┌─────────────────────────┐ │
│ │                                              │ │                         │ │
│ │              HERO                            │ │      LIVE MATCH          │ │
│ │                                              │ │                         │ │
│ │ All Sports.                                 │ │ Manchester City 2 - 1  │ │
│ │ All Intelligence.                           │ │ Liverpool               │ │
│ │ One Platform.                               │ │                         │ │
│ │                                              │ │ Overview Timeline ...  │ │
│ └──────────────────────────────────────────────┘ └─────────────────────────┘ │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Top Leagues | PL | La Liga | Serie A | Bundesliga | Ligue 1 | ...       │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │                │ │                │ │                │ │                │ │
│ │    LIVE NOW    │ │ AI PREDICTIONS │ │  LEAGUE TABLE  │ │    PLAYER      │ │
│ │                │ │                │ │                │ │   SPOTLIGHT    │ │
│ │                │ │                │ │                │ │                │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
│                                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │                │ │                │ │                │ │                │ │
│ │    TOP NEWS    │ │ YOUR REWARDS   │ │      NEWS      │ │    REWARDS     │ │
│ │                │ │                │ │                │ │                │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ WAGERline © 2026      About Us   Contact   Privacy Policy   Terms of Use    │
└──────────────────────────────────────────────────────────────────────────────┘
```

This blueprint is a structural guide only. The supplied reference image
remains the visual authority.

------------------------------------------------------------------------

# 40. OTHER APPLICATION PAGES

The same design language must be reused across:

``` text
Live
Sports
Leagues
Predictions
Stats
News
Rewards
Admin
```

However, each page has its own information architecture.

Do not copy the Home layout blindly to every page.

Reusable:

``` text
Header
Footer
Cards
Tables
Tabs
Badges
Buttons
Filters
Typography
Colors
Spacing
Icons
```

Page-specific layouts must follow their corresponding Figma/reference
screen.

------------------------------------------------------------------------

# 41. LIVE PAGE

Purpose:

Real-time multi-sport match tracking.

Required areas:

``` text
Live header
Date/time filters
Sport filters
League filters
Live match list
Selected match detail
Timeline
Score
Events
Statistics
Lineups
H2H
Upcoming matches
```

The page must prioritize active matches.

Use red LIVE indicators.

The selected match should have stronger visual emphasis.

------------------------------------------------------------------------

# 42. SPORTS PAGE

Purpose:

Multi-sport discovery.

Sports should include at minimum the sports represented by the supplied
reference:

``` text
Football
Basketball
American Football
Hockey
Formula 1
```

Structure:

``` text
Sports selector
Popular competitions
Today's matches
Upcoming matches
Top teams
Top players
Sport statistics
```

Do not make the page football-only.

------------------------------------------------------------------------

# 43. LEAGUES PAGE

Purpose:

League discovery and league intelligence.

Include:

``` text
League search
Sport filter
Country/region filter
Popular leagues
League cards
Standings preview
Recent results
Upcoming fixtures
League statistics
```

The reference uses strong league branding.

League logos must be visually prominent.

------------------------------------------------------------------------

# 44. PREDICTIONS PAGE

Purpose:

AI-assisted sports prediction and analysis.

Include:

``` text
Prediction overview
Featured predictions
Probability
Confidence
Recent model performance
Match predictions
Sport filters
League filters
Prediction history
```

The Home AI Predictions widget should link into this full page.

------------------------------------------------------------------------

# 45. STATS PAGE

Purpose:

Historical and current sports analytics.

Include:

``` text
Statistics overview
Sport filter
League filter
Player stats
Team stats
Historical trends
Top performers
Charts
Comparison
```

The design should prioritize information density.

------------------------------------------------------------------------

# 46. NEWS PAGE

Purpose:

Multi-sport editorial hub.

Include:

``` text
Featured story
Latest news
Trending news
Sport categories
League categories
Article cards
Search
```

The Home News widgets link to this page.

------------------------------------------------------------------------

# 47. REWARDS PAGE

Purpose:

Gamification and user engagement.

Include:

``` text
User level
XP progress
Points
Rank
Daily tasks
Achievements
Badges
Leaderboard
Reward history
```

The Home Rewards widgets are previews of this page.

------------------------------------------------------------------------

# 48. ADMIN PAGE

Admin is an operational dashboard and may use a sidebar.

Sidebar:

``` text
Dashboard
Users
Sports
Leagues
Matches
Predictions
News
Rewards
Data Sources
API Health
System
Settings
```

Admin should retain the WAGERline dark visual language.

Do not make Admin look like a completely unrelated application.

------------------------------------------------------------------------

# 49. FRONTEND TECHNOLOGY

Required:

``` text
Next.js
React
TypeScript
Tailwind CSS
Lucide React
```

Recommended:

``` text
next/image
next/font
CSS variables
typed data models
component composition
```

Avoid unnecessary UI libraries that introduce a conflicting visual
system.

------------------------------------------------------------------------

# 50. FOLDER STRUCTURE

Recommended:

``` text
app/
  page.tsx
  live/
    page.tsx
  sports/
    page.tsx
  leagues/
    page.tsx
  predictions/
    page.tsx
  stats/
    page.tsx
  news/
    page.tsx
  rewards/
    page.tsx
  admin/
    page.tsx

components/
  layout/
  home/
  live/
  sports/
  leagues/
  predictions/
  stats/
  news/
  rewards/
  admin/
  shared/

lib/
  data/
  i18n/
  utils/

public/
  images/
    logo/
    sports/
    leagues/
    teams/
    players/
    news/
    rewards/
```

------------------------------------------------------------------------

# 51. MOCK DATA POLICY

During initial implementation, use realistic mock data.

Do not use:

``` text
Lorem ipsum
Team A
Team B
Player 1
News title
Image placeholder
```

Use the visible reference data as initial seed data.

The interface must look like a functioning sports platform even before
API integration.

------------------------------------------------------------------------

# 52. DATA/API SEPARATION

Frontend components must not directly depend on a specific external
sports API.

Use a service/data abstraction:

``` text
UI
 ↓
Domain data model
 ↓
Service layer
 ↓
API / database
```

This allows future replacement of data sources without rebuilding UI
components.

------------------------------------------------------------------------

# 53. VALIDATION CHECKLIST

Before considering implementation complete, compare the browser result
against the supplied reference image.

Check:

### Header

-   [ ] WAGERline logo position
-   [ ] navigation order
-   [ ] active Home state
-   [ ] search
-   [ ] language selector
-   [ ] Login
-   [ ] Sign Up

### Hero

-   [ ] correct two-column split
-   [ ] correct background image
-   [ ] headline position
-   [ ] yellow third line
-   [ ] description
-   [ ] Explore Live
-   [ ] View Predictions
-   [ ] play button

### Live Match

-   [ ] Live badge
-   [ ] league title
-   [ ] team logos
-   [ ] score
-   [ ] time
-   [ ] events
-   [ ] tabs

### Top Leagues

-   [ ] full-width strip
-   [ ] league logos
-   [ ] country labels
-   [ ] horizontal density

### Dashboard

-   [ ] Live Now
-   [ ] AI Predictions
-   [ ] League Table
-   [ ] Player Spotlight
-   [ ] Top News
-   [ ] Your Rewards
-   [ ] News
-   [ ] Rewards

### Footer

-   [ ] copyright
-   [ ] links
-   [ ] languages

------------------------------------------------------------------------

# 54. VISUAL QA PROCESS

After implementation:

1.  Run the application.
2.  Open `/`.
3.  Capture a screenshot at the reference viewport size.
4.  Compare side-by-side with the supplied reference.
5.  Fix structural differences first.
6.  Fix component dimensions second.
7.  Fix spacing third.
8.  Fix typography fourth.
9.  Fix colors/borders fifth.
10. Fix image cropping last.

Do not start by polishing tiny details while the grid is wrong.

------------------------------------------------------------------------

# 55. PRIORITY ORDER FOR PIXEL ACCURACY

If implementation time is limited, prioritize:

``` text
P0
Overall page grid
Header
Hero
Live Match
Top Leagues

P1
Live Now
AI Predictions
League Table
Player Spotlight

P2
Top News
Your Rewards
News
Rewards

P3
Footer
Hover states
Micro animations
Minor typography adjustments
```

------------------------------------------------------------------------

# 56. PROHIBITED DESIGN CHANGES

Without explicit approval, do NOT:

-   change yellow to another brand color
-   switch to light theme
-   remove dashboard cards
-   convert the Home page into a marketing landing page
-   make Hero full-screen
-   remove Top Leagues
-   move Live Match below the Hero
-   replace League Table with a generic chart
-   remove Player Spotlight
-   remove Rewards
-   reduce the number of news modules
-   introduce a left sidebar on Home
-   introduce a right sidebar on Home
-   use excessive glassmorphism
-   add excessive gradients
-   use huge rounded cards
-   use huge empty whitespace
-   replace sports imagery with abstract illustrations

------------------------------------------------------------------------

# 57. CLAUDE CODER IMPLEMENTATION COMMAND

Use the following instruction together with this document and the
supplied Figma/PNG reference:

``` text
IMPLEMENTATION START

You are implementing the WAGERline frontend.

The supplied Figma/PNG reference is the visual source of truth.

Read the complete WAGERLINE UI IMPLEMENTATION SPECIFICATION before writing code.

Do NOT design a new interface.

Do NOT simplify the Home page.

Do NOT create a generic SaaS dashboard.

Do NOT reinterpret the layout.

The Home page at `/` must reproduce the supplied reference as closely as possible.

Required stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

The Home page must contain, in this exact major order:

1. Global Header
2. Hero + Live Match
3. Top Leagues
4. Live Now
5. AI Predictions
6. League Table
7. Player Spotlight
8. Top News
9. Your Rewards
10. News
11. Rewards
12. Footer

The desktop Home layout must preserve the four-zone dashboard composition visible in the reference.

Use realistic sports data.

Use actual image assets or appropriate high-quality local/remote image assets instead of gray placeholders for major visual elements.

Create reusable components.

Create typed mock data.

Make all user-facing text translation-ready for EN / ES / AR.

Support RTL for Arabic.

Use Lucide icons for UI icons.

After implementation, visually inspect `/` at the reference desktop viewport and correct:

1. grid
2. dimensions
3. spacing
4. typography
5. colors
6. borders
7. image cropping
8. component density

Do not stop after creating a functional page.

The requirement is visual fidelity.

IMPLEMENTATION END
```

------------------------------------------------------------------------

# 58. DEFINITION OF DONE

The implementation is complete only when:

``` text
[✓] Home visually matches the supplied reference
[✓] Header matches
[✓] Hero matches
[✓] Live Match matches
[✓] Top Leagues matches
[✓] Four-zone dashboard grid matches
[✓] Live Now matches
[✓] AI Predictions matches
[✓] League Table matches
[✓] Player Spotlight matches
[✓] Top News matches
[✓] Your Rewards matches
[✓] News matches
[✓] Rewards matches
[✓] Footer matches
[✓] Dark theme matches
[✓] Yellow WAGERline identity matches
[✓] Images are present
[✓] No generic placeholders remain
[✓] Responsive behavior works
[✓] EN / ES / AR structure exists
[✓] Arabic RTL works
[✓] Components are reusable
[✓] TypeScript is used
[✓] Lucide icons are used
[✓] No unrelated UI has been introduced
```

------------------------------------------------------------------------

# 59. FINAL DIRECTIVE

**The supplied Figma/PNG design is not an inspiration. It is the
implementation reference.**

The developer's responsibility is to translate the supplied visual
design into:

``` text
Next.js
+
Tailwind CSS
+
Lucide React
+
Reusable React Components
+
Typed Data
+
EN / ES / AR i18n
```

without changing the visual concept.

The Home page must feel like the supplied WAGERline product:

``` text
SPORTS
+
LIVE DATA
+
AI PREDICTIONS
+
LEAGUE INTELLIGENCE
+
PLAYER INTELLIGENCE
+
NEWS
+
REWARDS
```

all presented within one dense, premium, dark sports intelligence
dashboard.

**Do not redesign. Implement the reference.**
