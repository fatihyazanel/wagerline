# WAGERline
## Exact Visual UI / UX Implementation Specification

**Document Type:** AI Coder Implementation Specification  
**Version:** 3.0  
**Status:** REQUIRED  
**Target:** AI Coder  
**Application:** WAGERline Multi-Sport Intelligence Platform  
**Frontend:** Next.js + TypeScript  
**Backend:** Node.js + Fastify  
**Database:** SQLite  
**Languages:** EN / ES / AR  
**Design Mode:** Dark / Sports Intelligence  
**Primary Target:** Desktop 1440px–1536px  
**Responsive:** Desktop / Tablet / Mobile  

---

# 1. CRITICAL IMPLEMENTATION RULE

## THIS IS NOT A DESIGN SUGGESTION

The supplied WAGERline reference mockup is the **visual source of truth**.

AI Coder MUST reproduce:

- page structure
- component order
- card hierarchy
- relative widths
- relative heights
- spacing
- typography hierarchy
- dark background
- yellow brand accent
- live indicators
- probability bars
- statistics cards
- navigation structure
- visual density
- border radius
- borders
- shadows
- icon positioning
- image positioning
- footer structure
- language selector

The AI Coder MUST NOT redesign the page.

The AI Coder MUST NOT:

- replace the dashboard with a generic sports template
- create a different hero
- change the card ordering
- remove major sections
- use a completely different color scheme
- simplify the homepage into a few cards
- create excessive whitespace
- use a standard SaaS dashboard template
- replace the dark sports interface with a light interface
- change the desktop grid without a technical reason
- invent a different navigation structure

The implementation objective is:

> **BUILD THE WEB PAGE TO LOOK LIKE THE PROVIDED WAGERline REFERENCE DESIGN.**

---

# 2. VISUAL SOURCE OF TRUTH

The reference design represents the following visual language:

- premium sports intelligence platform
- dark navy / black background
- high information density
- yellow WAGERline brand accent
- blue / purple analytical accents
- red LIVE indicators
- rounded dark cards
- thin borders
- subtle shadows
- sports photography
- team logos
- compact statistics
- charts
- probability bars
- gamification
- multilingual interface

The interface must feel like:

> Sports Intelligence Platform

NOT:

> Betting Website

NOT:

> Generic Sports News Website

NOT:

> Generic Admin Dashboard

NOT:

> Generic SaaS Dashboard

---

# 3. DESIGN OBJECTIVE

The homepage must immediately communicate:

1. Sports
2. Live data
3. Intelligence
4. Predictions
5. Statistics
6. News
7. Rankings
8. Rewards

The user should understand the product within approximately 3 seconds.

Primary visual message:

> ALL SPORTS.  
> ALL INTELLIGENCE.  
> ONE PLATFORM.

Secondary message:

> Live scores, stats, AI predictions and everything you need to stay ahead.

---

# 4. DESKTOP CANVAS

Primary design reference:

```text
1536px × 1024px
```

Supported desktop range:

```text
1280px – 1920px
```

Recommended content width:

```text
100%
```

with horizontal page padding:

```text
16px
```

Maximum content width:

```text
1536px
```

The UI must visually fill the viewport.

Do not create a narrow centered SaaS layout.

---

# 5. GLOBAL PAGE STRUCTURE

The homepage MUST follow this exact hierarchy:

```text
┌───────────────────────────────────────────────────────────────┐
│ HEADER / NAVIGATION                                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│ HERO SECTION                          LIVE MATCH               │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ TOP LEAGUES                                                   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│ LIVE NOW       │ AI PREDICTIONS │ LEAGUE TABLE │ PLAYER       │
│                │                │              │ PROFILE       │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ TOP NEWS       │ YOUR REWARDS    │ NEWS        │ REWARDS       │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ FOOTER                                                        │
└───────────────────────────────────────────────────────────────┘
```

The actual implementation may use nested grids, but the visual relationship MUST remain the same.

---

# 6. HEADER

Header is fixed at the top of the page.

Height:

```text
60px
```

Background:

```text
#050914
```

Border:

```text
1px solid rgba(255,255,255,0.08)
```

Structure:

```text
LOGO
│
Home
Live
Sports
Leagues
Predictions
Stats
News
Rewards
│
Search
│
Language
│
Login
Sign Up
```

---

# 7. LOGO

WAGERline logo appears on the left.

Brand:

```text
WAGERline
```

The:

```text
WAGER
```

portion is white.

The:

```text
line
```

portion uses the brand yellow.

Brand yellow:

```text
#FFD400
```

Logo must have enough visual weight.

Do not use a tiny logo.

---

# 8. MAIN NAVIGATION

Navigation items:

```text
Home
Live
Sports
Leagues
Predictions
Stats
News
Rewards
```

Active page:

- yellow text
- yellow underline
- optional yellow icon

Inactive:

```text
#D0D4DD
```

Hover:

```text
#FFFFFF
```

---

# 9. SEARCH

Header search component:

```text
Search teams, players...
```

Width:

```text
220px – 280px
```

Height:

```text
36px
```

Style:

- dark translucent background
- subtle border
- rounded pill
- search icon

---

# 10. LANGUAGE SELECTOR

Languages:

```text
EN
ES
AR
```

Display flags where possible.

Dropdown:

```text
🇬🇧 EN
🇪🇸 ES
🇸🇦 AR
```

Arabic must activate:

```html
dir="rtl"
```

The same UI components must be reused.

Do NOT create a separate Arabic application.

---

# 11. LOGIN / SIGN UP

Login:

Dark outlined button.

Sign Up:

Yellow filled button.

Example:

```text
[ Login ] [ Sign Up ]
```

Primary button:

```text
background: #FFD400
color: #050914
```

---

# 12. HERO + LIVE MATCH GRID

This is one of the most important visual areas.

The hero and live match MUST appear side-by-side on desktop.

```text
┌──────────────────────────────────────┬──────────────────────┐
│                                      │                      │
│              HERO                    │      LIVE MATCH      │
│                                      │                      │
│                                      │                      │
└──────────────────────────────────────┴──────────────────────┘
```

Recommended:

```text
Hero: 68%
Live Match: 32%
```

Gap:

```text
12px
```

---

# 13. HERO CARD

Hero must be visually dominant.

Minimum height:

```text
245px
```

Recommended:

```text
250px – 270px
```

Background:

- stadium
- football player
- basketball player
- American football player
- hockey player
- Formula 1 car

The sports images must visually overlap / blend into the stadium background.

Do not use generic stock-office imagery.

---

# 14. HERO CONTENT

Left aligned.

Headline:

```text
All Sports.
All Intelligence.
One Platform.
```

The third line:

```text
One Platform.
```

must use WAGERline yellow.

Typography:

```text
font-weight: 800
```

Approximate desktop size:

```text
32px
```

Line height:

```text
1.05
```

---

# 15. HERO DESCRIPTION

Text:

```text
Live scores, stats, AI predictions
and everything you need to stay ahead.
```

Color:

```text
#D5D8E0
```

Maximum width:

```text
420px
```

---

# 16. HERO CTA

Primary:

```text
Explore Live
```

Secondary:

```text
View Predictions
```

Primary:

```text
yellow filled
```

Secondary:

```text
dark transparent / outlined
```

---

# 17. LIVE MATCH CARD

Live Match is positioned to the right of Hero.

It must look like a premium live-score widget.

Header:

```text
Live Match
● LIVE
```

Competition:

```text
Premier League – Round 36
```

Center score:

```text
2 - 1
```

Time:

```text
75:35
```

Teams:

```text
Man City
Liverpool
```

Team logos must be prominent.

---

# 18. LIVE MATCH EVENTS

Show compact events:

```text
23'  Haaland
45+2' De Bruyne
37'  Salah
```

Use icons for:

- goal
- yellow card
- red card
- substitution

---

# 19. LIVE MATCH TABS

Tabs:

```text
Overview
Timeline
Stats
Lineups
H2H
```

Active tab:

Yellow underline.

---

# 20. TOP LEAGUES

Immediately below Hero/Live Match.

Full width.

Height:

```text
80px – 90px
```

Title:

```text
Top Leagues
```

League items:

```text
Premier League
La Liga
Serie A
Bundesliga
Ligue 1
Süper Lig
NBA
NFL
NHL
F1
```

Each item includes:

- logo
- league name
- country

---

# 21. MAIN CONTENT GRID

After Top Leagues use:

```text
12-column grid
```

Desktop structure:

```text
┌───────────────┬───────────────┬─────────────────────────────┐
│               │               │                             │
│ LIVE NOW      │ AI            │ LEAGUE TABLE               │
│               │ PREDICTIONS   ├─────────────────────────────┤
│               │               │ PLAYER PROFILE              │
│               ├───────────────┤                             │
│               │ YOUR REWARDS  │                             │
│               │               │                             │
└───────────────┴───────────────┴─────────────────────────────┘
```

Recommended proportions:

```text
Left:   29%
Center: 25%
Right:  46%
```

Do not convert everything into equal-width cards.

---

# 22. LIVE NOW

Title:

```text
Live Now
```

Badge:

```text
● LIVE
```

Sports tabs:

```text
Football
Basketball
American Football
Ice Hockey
Formula 1
```

Each event row:

```text
Competition
Team
Score
Team
LIVE
Time
```

Example:

```text
Premier League
Man City      2 - 1      Liverpool      LIVE 75'
```

Rows must be compact.

---

# 23. LIVE NOW EVENT COLORS

LIVE:

```text
#FF3333
```

Completed:

```text
#7B8190
```

Upcoming:

```text
#A7ACB8
```

---

# 24. AI PREDICTIONS

Title:

```text
AI Predictions
```

Right side:

```text
See All →
```

Each prediction card contains:

```text
Team A vs Team B
Competition

Team A      Draw      Team B

58%         22%       20%

████████
```

Probability bars must be visually obvious.

Use different accent colors for:

- home
- draw
- away

---

# 25. PREDICTION CARD EXAMPLES

Use realistic mock data.

```text
Man City vs Liverpool
Man City 58%
Draw 22%
Liverpool 20%
```

```text
Real Madrid vs Barcelona
Real Madrid 48%
Draw 27%
Barcelona 25%
```

```text
Lakers vs Warriors
Lakers 60%
Warriors 40%
```

Prediction cards MUST NOT look like betting slips.

Never show:

- betting odds
- bookmakers
- stake
- payout
- money

The product is a sports intelligence platform.

---

# 26. LEAGUE TABLE

Right-side upper card.

Title:

```text
League Table
```

Filters:

```text
Premier League
2025/2026
```

Table columns:

```text
#
Team
P
W
D
L
GF
GA
GD
Pts
Form
```

Example:

```text
1  Man City
2  Arsenal
3  Liverpool
4  Aston Villa
5  Tottenham
```

Form indicators:

```text
● ● ●
● ● ●
```

Use:

- green = win
- yellow = draw
- red = loss

---

# 27. PLAYER PROFILE CARD

Positioned beside/below League Table according to the reference grid.

Featured player:

```text
Erling Haaland
Manchester City
Forward
```

Include:

```text
Age
Height
Weight
Foot
Nationality
```

Season statistics:

```text
Matches
Goals
Assists
Avg Rating
```

Example:

```text
28
27
5
7.91
```

---

# 28. PLAYER IMAGE

Player image must be large enough to create a visual focal point.

Use:

```text
transparent/cutout player image
```

where possible.

Do not use a tiny thumbnail.

---

# 29. TOP NEWS

Left lower section.

Title:

```text
Top News
```

Right:

```text
View All News →
```

Use a 3-card layout.

Each card:

- image
- headline
- category
- timestamp

Example:

```text
Haaland double helps Man City to win against Liverpool
PREMIER LEAGUE
2h ago
```

---

# 30. NEWS CARD DESIGN

Image ratio:

```text
16:9
```

Headline:

```text
14px – 16px
font-weight: 600
```

Metadata:

```text
11px – 12px
```

Cards must be compact.

---

# 31. YOUR REWARDS

Center lower section.

Title:

```text
Your Rewards
```

Right:

```text
View All →
```

Main reward card:

```text
Level 7
Elite Fan

2,450 / 3,000 XP

Next Level
```

Stats:

```text
Badges     12
Points     2,450
Rank       #3,210
```

Progress bar:

```text
purple / blue gradient
```

---

# 32. NEWS SECTION

Right lower area.

News header includes filters:

```text
All
Football
Basketball
NFL
NHL
F1
```

Main story should be larger.

Secondary stories appear beside it.

Below:

3 compact news cards.

---

# 33. REWARDS PANEL

Rightmost lower card.

Header:

```text
Rewards
```

Balance:

```text
2,450 Points
```

CTA:

```text
How to Earn →
```

---

# 34. DAILY TASKS

Display:

```text
Daily Tasks
```

Tasks:

```text
Login to the platform        +10 ✓
View 3 live matches          +20 ✓
Make a prediction            +50 ✓
Read a news article          +10 ✓
```

Completed tasks:

Green check icon.

---

# 35. BADGES

Display four badges:

```text
Early Bird
Predictor
Stat Hunter
Champion
```

Badges must be visually gamified.

Use:

- shield
- trophy
- medal
- star

---

# 36. FOOTER

Footer must remain compact.

Left:

```text
WAGERline © 2026 All rights reserved.
```

Links:

```text
About Us
Contact
Privacy Policy
Terms of Use
```

Language selector:

```text
English
Español
العربية
```

Arabic language must visually use RTL.

---

# 37. COLOR SYSTEM

Use the following design tokens.

```css
--bg-primary: #050914;
--bg-secondary: #080D18;
--bg-tertiary: #0D1422;

--card: #101827;
--card-hover: #141D2D;

--border: rgba(255,255,255,0.08);

--text-primary: #F5F7FA;
--text-secondary: #B5BBC7;
--text-muted: #777F8F;

--yellow: #FFD400;
--yellow-hover: #FFE14A;

--red: #FF3333;
--green: #22C55E;
--blue: #3B82F6;
--purple: #8B5CF6;
--cyan: #22D3EE;
--orange: #F97316;
```

---

# 38. BACKGROUND

Global:

```css
background: #050914;
```

Do not use pure:

```text
#000000
```

The background should have subtle navy depth.

---

# 39. CARD STYLE

All major cards:

```css
background: #101827;
border: 1px solid rgba(255,255,255,.08);
border-radius: 10px;
```

Hover:

```css
background: #141D2D;
```

Do not use excessive glassmorphism.

---

# 40. CARD BORDER RADIUS

```text
Small: 8px
Medium: 10px
Large: 14px
Hero: 14px
```

---

# 41. SPACING SYSTEM

Use:

```text
4px
8px
12px
16px
20px
24px
32px
```

Primary grid gap:

```text
12px
```

Section gap:

```text
12px – 16px
```

Do not use 40–80px whitespace between dashboard sections.

The design is intentionally information dense.

---

# 42. TYPOGRAPHY

Recommended font:

```text
Inter
```

Fallback:

```text
system-ui
```

Weights:

```text
400
500
600
700
800
```

Headings:

```text
H1: 32px
H2: 20px
H3: 16px
Body: 13px
Small: 11px
```

Dashboard information may use:

```text
12px – 13px
```

---

# 43. ICON SYSTEM

Use one consistent icon library.

Recommended:

```text
Lucide React
```

Do NOT mix:

- Font Awesome
- Material Icons
- random SVG icons
- emoji

unless a specific sports logo requires it.

---

# 44. SPORTS ICONS / LOGOS

Use real or locally mocked assets.

Required:

```text
Premier League
La Liga
Serie A
Bundesliga
Ligue 1
Süper Lig
NBA
NFL
NHL
Formula 1
```

Team logos must maintain consistent dimensions.

---

# 45. IMAGE SYSTEM

Recommended directories:

```text
/public/assets/
```

Structure:

```text
/public/assets/
  /logo
  /sports
  /leagues
  /teams
  /players
  /news
  /hero
  /badges
```

---

# 46. HERO IMAGE

Recommended:

```text
/public/assets/hero/wagerline-hero.webp
```

Image must support:

```text
object-fit: cover
```

Use a dark gradient overlay so text remains readable.

---

# 47. COMPONENT ARCHITECTURE

Create reusable components.

```text
/components
  /layout
    Header
    Footer

  /hero
    HomeHero
    LiveMatch

  /sports
    SportSelector
    LeagueStrip
    SportIcon

  /live
    LiveNow
    LiveEventRow
    LiveBadge

  /predictions
    PredictionCard
    ProbabilityBar
    PredictionHighlights

  /league
    LeagueTable
    LeagueSelector

  /player
    PlayerCard
    PlayerStats

  /news
    NewsCard
    NewsGrid
    NewsFilters

  /rewards
    RewardsCard
    DailyTasks
    BadgeGrid

  /common
    Card
    Tabs
    Button
    Badge
    Search
    Dropdown
    Skeleton
```

---

# 48. HOMEPAGE COMPONENT TREE

The page MUST approximately use:

```tsx
<HomePage>

  <Header />

  <main>

    <HeroLiveGrid>
      <HomeHero />
      <LiveMatch />
    </HeroLiveGrid>

    <LeagueStrip />

    <DashboardGrid>

      <LeftColumn>
        <LiveNow />
        <TopNews />
      </LeftColumn>

      <CenterColumn>
        <PredictionHighlights />
        <YourRewards />
      </CenterColumn>

      <RightColumn>

        <RightTopGrid>
          <LeagueTable />
          <PlayerCard />
        </RightTopGrid>

        <RightBottomGrid>
          <NewsGrid />
          <RewardsPanel />
        </RightBottomGrid>

      </RightColumn>

    </DashboardGrid>

  </main>

  <Footer />

</HomePage>
```

---

# 49. IMPORTANT GRID RULE

The component hierarchy above is not optional.

Do not implement:

```text
Hero
3 equal cards
News
Footer
```

as a simplified alternative.

The dashboard must retain:

```text
Hero + Live Match
↓
Top Leagues
↓
Live Now + AI Predictions + League/Player
↓
Top News + Rewards
↓
News + Rewards
↓
Footer
```

---

# 50. RESPONSIVE DESIGN

Desktop:

```text
>= 1280px
```

Use full dashboard grid.

Tablet:

```text
768px – 1279px
```

Rearrange into:

```text
Hero
Live Match
Top Leagues

Live Now
AI Predictions

League Table
Player

News
Rewards
```

Mobile:

```text
< 768px
```

Single-column.

Order:

```text
Header
Hero
Live Match
Top Leagues
Live Now
AI Predictions
League Table
Player
Top News
Rewards
News
Footer
```

---

# 51. MOBILE HEADER

Mobile header:

```text
Logo
Search
Language
Menu
```

Navigation becomes drawer.

Do not display all desktop navigation items simultaneously.

---

# 52. MOBILE CARDS

Cards become:

```text
width: 100%
```

Horizontal scrolling may be used for:

```text
Top Leagues
Sports tabs
News filters
```

---

# 53. MOBILE HERO

Hero image remains visible.

Minimum height:

```text
280px
```

Text size:

```text
26px
```

Buttons stack or remain side-by-side depending on width.

---

# 54. RTL

When:

```text
locale === "ar"
```

apply:

```html
<html dir="rtl">
```

The complete dashboard must mirror naturally.

Do not simply translate text while leaving layout incorrectly aligned.

Check:

- navigation
- hero
- cards
- tables
- player card
- news
- rewards
- footer
- charts
- tabs

---

# 55. LANGUAGES

Required:

```text
/en
/es
/ar
```

Examples:

```text
/en
/es
/ar
```

Homepage:

```text
/en
/es
/ar
```

Football:

```text
/en/football
/es/football
/ar/football
```

Premier League:

```text
/en/football/premier-league
/es/football/premier-league
/ar/football/premier-league
```

---

# 56. MOCK DATA

The first implementation MUST work without external APIs.

Use:

```text
MOCK_DATA=true
```

No section may appear empty.

Required mock data:

```text
10 leagues
10+ live events
10+ upcoming events
5+ predictions
10+ news items
league table
player statistics
rewards
badges
daily tasks
```

The mock data must look realistic.

---

# 57. MOCK DATA EXAMPLES

Football:

```json
{
  "home": "Man City",
  "away": "Liverpool",
  "score": "2-1",
  "status": "LIVE",
  "minute": "75"
}
```

Prediction:

```json
{
  "home": 58,
  "draw": 22,
  "away": 20
}
```

Player:

```json
{
  "name": "Erling Haaland",
  "team": "Manchester City",
  "position": "Forward",
  "age": 24,
  "height": "194 cm",
  "weight": "94 kg",
  "goals": 27,
  "assists": 5,
  "rating": 7.91
}
```

---

# 58. ROUTES

The homepage is only the first page.

Create the application shell so the following pages can use the same design system.

```text
/[locale]

/[locale]/live

/[locale]/sports

/[locale]/sports/[sport]

/[locale]/leagues

/[locale]/football/[league]

/[locale]/predictions

/[locale]/statistics

/[locale]/news

/[locale]/rewards

/[locale]/event/[id]

/[locale]/team/[slug]

/[locale]/player/[slug]

/[locale]/profile
```

---

# 59. LIVE PAGE

The Live page must preserve the homepage visual language.

Structure:

```text
Header

Live Center

Sport Filters

Live Events

Upcoming

Finished

Right-side / bottom
Live Statistics

Footer
```

---

# 60. LEAGUE PAGE

Structure:

```text
League Header

League Logo
League Name
Country
Season

Tabs:
Overview
Matches
Table
Statistics
Teams
Players
News

League Table

Upcoming Matches

Recent Results

Top Players

News
```

---

# 61. EVENT PAGE

Structure:

```text
Breadcrumb

Competition

Home Team
Score
Away Team

Status

Tabs:
Overview
Timeline
Stats
Lineups
H2H
Tables

Match Statistics

Momentum

Timeline

Prediction

Related News
```

The Event page must reuse:

```text
EventHeader
EventScore
EventTimeline
EventStatistics
EventPrediction
```

---

# 62. PREDICTIONS PAGE

Structure:

```text
Prediction Center

Sport Filters

Today's Predictions

High Confidence

Upcoming Events

Prediction Factors

Prediction Accuracy

Model Performance
```

Do not present predictions as gambling odds.

Use:

```text
Probability
Confidence
Model Estimate
```

---

# 63. STATISTICS PAGE

Use:

```text
Stat Cards
Charts
Tables
Filters
Sport Selector
Competition Selector
Season Selector
```

Visual style must remain consistent with homepage.

---

# 64. REWARDS PAGE

Structure:

```text
Profile Level

XP Progress

Points

Rank

Badges

Challenges

Daily Tasks

Weekly Challenges

Achievements
```

---

# 65. NEWS PAGE

Structure:

```text
Featured Story

Latest News

Sport Filters

Competition Filters

Team Filters

News Grid
```

---

# 66. PROFILE PAGE

Structure:

```text
Avatar
Username
Level
XP
Rank

Prediction Accuracy

Prediction History

Badges

Favorite Sports

Favorite Teams

Activity
```

---

# 67. DATA ARCHITECTURE COMPATIBILITY

The UI must consume the existing backend architecture.

Frontend:

```text
Next.js
```

Backend:

```text
Node.js
Fastify
```

Database:

```text
SQLite
```

The backend is responsible for:

```text
Provider APIs
Normalization
Caching
Persistence
Predictions
Authentication
```

The frontend MUST NOT directly call external sports providers.

---

# 68. API

Frontend calls:

```text
/api/v1
```

Examples:

```text
GET /api/v1/sports
GET /api/v1/competitions
GET /api/v1/events/today
GET /api/v1/events/live
GET /api/v1/events/:id
GET /api/v1/events/:id/statistics
GET /api/v1/events/:id/prediction
GET /api/v1/news
GET /api/v1/rankings
```

---

# 69. LOADING STATES

Every data-driven component must support:

```text
loading
success
empty
error
```

Use skeleton cards.

Do not display a blank page.

---

# 70. ERROR STATES

User-facing error:

```text
Live data temporarily unavailable.
```

Never display provider technical errors such as:

```text
API-Sports failed
HTTP 429
Provider timeout
```

---

# 71. LIVE DATA

Live events should visually update.

LIVE badge:

```text
red
```

Example:

```text
● LIVE 75'
```

Do not refresh the entire page.

Use component-level updates.

---

# 72. ANIMATION

Animations must be subtle.

Allowed:

```text
hover
fade
slide
progress animation
live pulse
tab transition
```

Do NOT use:

- excessive bouncing
- large page transitions
- distracting particle effects
- excessive neon animation

---

# 73. LIVE PULSE

LIVE indicator may use:

```css
animation: pulse
```

Duration:

```text
1.5s – 2s
```

Subtle only.

---

# 74. HOVER BEHAVIOR

Cards:

```text
translateY(-1px)
border-color: rgba(...)
```

Buttons:

```text
brightness
```

News images:

```text
subtle scale 1.02
```

No aggressive animations.

---

# 75. ACCESSIBILITY

Must support:

```text
keyboard navigation
focus states
ARIA labels
semantic HTML
sufficient contrast
screen reader labels
```

Minimum target:

```text
WCAG AA
```

---

# 76. PERFORMANCE

Target:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Use:

```text
Next.js Image
lazy loading
code splitting
server components
client components only when necessary
```

---

# 77. SEO

All major pages must generate:

```text
title
description
canonical
hreflang
Open Graph
Twitter metadata
JSON-LD
```

Languages:

```text
en
es
ar
```

---

# 78. NO HARDCODED UI TEXT

BAD:

```tsx
<button>View Match</button>
```

GOOD:

```tsx
<button>
  {t("event.view_match")}
</button>
```

All UI text must come from i18n.

---

# 79. I18N STRUCTURE

```text
/i18n

/en
  common.json
  sports.json
  competitions.json
  predictions.json
  rewards.json

/es
  common.json
  sports.json
  competitions.json
  predictions.json
  rewards.json

/ar
  common.json
  sports.json
  competitions.json
  predictions.json
  rewards.json
```

---

# 80. COMPONENT REUSE

Do not create:

```text
PremierLeagueCard
NBACard
NFLCard
NHLCard
F1Card
```

unless the visual structure is genuinely different.

Prefer:

```text
<EventCard sport="football" />
<EventCard sport="basketball" />
<EventCard sport="nfl" />
<EventCard sport="nhl" />
<EventCard sport="f1" />
```

---

# 81. DESIGN SYSTEM

Create reusable:

```text
Button
Card
Badge
Tabs
Dropdown
Search
ProgressBar
ProbabilityBar
StatCard
Table
Avatar
Tooltip
Skeleton
Toast
Modal
SportIcon
LeagueIcon
TeamLogo
PlayerAvatar
```

---

# 82. NO PAGE-SPECIFIC DESIGN

Do not create separate design systems for each page.

All pages must inherit:

```text
WAGERline Design System
```

---

# 83. VISUAL DENSITY

The reference UI is intentionally dense.

The screen should contain substantial information without feeling chaotic.

Target:

```text
high information density
medium spacing
strong visual hierarchy
compact cards
```

Avoid:

```text
huge empty sections
large whitespace
oversized typography
giant cards
```

---

# 84. IMPORTANT: DO NOT CHANGE THE GRID

The following relationships are mandatory:

```text
Hero
  +
Live Match
      ↓
Top Leagues
      ↓
Live Now
  + AI Predictions
  + League Table
  + Player
      ↓
Top News
  + Rewards
  + News
  + Rewards
      ↓
Footer
```

If the AI Coder believes another grid would look better:

> DO NOT CHANGE IT.

Implement the reference design.

---

# 85. IMPORTANT: DO NOT REDUCE CONTENT

The homepage MUST NOT become:

```text
Hero
Live Scores
News
Footer
```

All major sections are required.

Required:

```text
Header
Hero
Live Match
Top Leagues
Live Now
AI Predictions
League Table
Player Profile
Top News
Your Rewards
News
Rewards
Daily Tasks
Badges
Footer
```

---

# 86. DESKTOP ACCEPTANCE TEST

At:

```text
1536 × 1024
```

the application must visually resemble the supplied reference.

Check:

- header height
- hero height
- hero/live ratio
- top leagues height
- left/center/right widths
- card spacing
- typography
- color
- image positioning
- card radius
- footer height

---

# 87. 1440PX ACCEPTANCE TEST

At:

```text
1440 × 900
```

the design must remain visually consistent.

No:

```text
horizontal scrollbar
```

No:

```text
overlapping cards
```

No:

```text
broken images
```

No:

```text
empty data sections
```

---

# 88. MOBILE ACCEPTANCE TEST

Test:

```text
390 × 844
```

and:

```text
430 × 932
```

Must have:

- no horizontal scrolling
- readable text
- functional navigation
- usable buttons
- usable cards
- usable tables
- horizontally scrollable league selector where necessary

---

# 89. AR ACCEPTANCE TEST

Test:

```text
/ar
```

Verify:

```text
RTL
navigation
cards
tables
statistics
tabs
footer
```

Nothing may overlap.

---

# 90. FINAL UI QUALITY RULE

Before declaring the task complete, AI Coder MUST compare the implementation against the supplied WAGERline reference.

Review:

```text
1. Header
2. Hero
3. Live Match
4. Top Leagues
5. Live Now
6. AI Predictions
7. League Table
8. Player Profile
9. Top News
10. Your Rewards
11. News
12. Rewards
13. Footer
```

For each section verify:

```text
Position
Width
Height
Spacing
Color
Typography
Images
Icons
Borders
Radius
Alignment
```

---

# 91. DEFINITION OF DONE

The task is complete only when:

- [ ] Homepage matches reference composition
- [ ] Dark WAGERline visual identity implemented
- [ ] Header matches reference
- [ ] Hero matches reference
- [ ] Live Match matches reference
- [ ] Top Leagues matches reference
- [ ] Live Now implemented
- [ ] AI Predictions implemented
- [ ] League Table implemented
- [ ] Player Profile implemented
- [ ] Top News implemented
- [ ] Your Rewards implemented
- [ ] News implemented
- [ ] Rewards implemented
- [ ] Daily Tasks implemented
- [ ] Badges implemented
- [ ] Footer implemented
- [ ] Mock data works
- [ ] EN works
- [ ] ES works
- [ ] AR works
- [ ] RTL works
- [ ] Responsive layout works
- [ ] Loading states work
- [ ] Error states work
- [ ] No empty dashboard sections
- [ ] No horizontal overflow
- [ ] No provider API calls from frontend
- [ ] Components are reusable
- [ ] SEO metadata exists
- [ ] Accessibility requirements implemented

---

# 92. IMPLEMENTATION ORDER

AI Coder MUST implement in this order.

## STEP 1

Create:

```text
WAGERline Design System
```

## STEP 2

Create:

```text
Header
Footer
Card
Button
Tabs
Badge
```

## STEP 3

Create:

```text
Hero
Live Match
```

## STEP 4

Create:

```text
Top Leagues
```

## STEP 5

Create:

```text
Live Now
AI Predictions
```

## STEP 6

Create:

```text
League Table
Player Profile
```

## STEP 7

Create:

```text
Top News
Your Rewards
News
Rewards
```

## STEP 8

Implement:

```text
EN / ES / AR
```

## STEP 9

Implement:

```text
Responsive
RTL
```

## STEP 10

Connect:

```text
WAGERline Backend API
```

## STEP 11

Implement:

```text
Live updates
```

## STEP 12

Implement:

```text
SEO
Accessibility
Performance
```

---

# 93. FINAL COMMAND TO AI CODER

Build the WAGERline website using this specification.

The supplied reference mockup is the **visual source of truth**.

Do not redesign it.

Do not simplify it.

Do not replace the layout with a generic dashboard.

Do not remove sections.

Do not change the primary visual hierarchy.

First reproduce the homepage visually.

Then implement reusable components.

Then connect the backend.

Then implement the remaining pages using the same design system.

The final product must look and feel like:

> **WAGERline – Multi-Sport Intelligence Platform**

Core experience:

```text
SEE THE GAME.
UNDERSTAND THE DATA.
MAKE YOUR PREDICTION.
BUILD YOUR RANK.
```

The implementation must be:

```text
Responsive
Multilingual
RTL compatible
SEO ready
Accessible
Component based
API ready
SQLite compatible
Mock-data compatible
Production structured
```

**Most important requirement:**

> **The resulting homepage must visually reproduce the supplied WAGERline reference design, including its layout, section ordering, proportions, card hierarchy, colors, typography, spacing, imagery and overall information density.**