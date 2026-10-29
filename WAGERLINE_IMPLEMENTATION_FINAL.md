# WAGERline — AI CODER MASTER SPECIFICATION

![WAGERline Visual Reference](./assets/wagerline-reference.png)

> **CRITICAL:** The image above is the primary visual source of truth.  
> Do NOT treat it as optional inspiration. Before writing UI code, inspect the image and reproduce its layout, density, spacing, colors, typography, cards, navigation, charts, and visual hierarchy.

---

## 1. MISSION

Build a real, responsive, interactive web application called **WAGERline** based on the attached visual reference.

The result must look like the same product shown in the reference image, not like a generic sports dashboard.

The reference contains these product areas:

1. Live
2. Sports
3. Leagues
4. Predictions
5. Stats
6. News
7. Rewards
8. Admin

The implementation must preserve the same overall visual language across all pages.

### Non-negotiable goals

- Dark premium interface
- Near-black background
- Yellow WAGERline brand accent
- Compact dashboard density
- Thin borders
- Small, strong typography
- Information-rich cards
- Sports data visualizations
- Responsive layout
- Functional navigation and interactions
- Reusable components
- Realistic mock data
- No generic SaaS styling

---

# 2. FIRST ACTION — INSPECT THE REFERENCE

Before creating components:

1. Open `./assets/wagerline-reference.png`.
2. Analyze the entire image.
3. Identify every visible screen.
4. Identify shared components.
5. Identify colors and typography hierarchy.
6. Identify card sizes and spacing.
7. Identify column proportions.
8. Identify navigation structure.
9. Identify charts and data visualization patterns.
10. Only then start implementation.

### IMPORTANT

If the written specification and the image appear to conflict:

**Prefer the visual reference for visual decisions.**

Do not replace the reference with your own design system.

---

# 3. PROJECT INSPECTION

Before changing code:

- inspect the existing repository
- identify framework
- identify routing
- identify styling system
- identify component library
- identify existing assets
- identify existing API/data layer

If a working stack already exists, **reuse it**.

Do not migrate frameworks without a strong reason.

Preferred stack if starting from scratch:

- Next.js
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- shadcn/ui where useful

---

# 4. REQUIRED ROUTES

Implement:

```text
/
/live
/sports
/leagues
/predictions
/stats
/news
/rewards

/admin
/admin/users
/admin/content
/admin/events
/admin/leagues
/admin/news
/admin/predictions
/admin/rewards
/admin/analytics
/admin/settings
/admin/system
```

Every route must render a real page.

No dead navigation links.

---

# 5. GLOBAL VISUAL SYSTEM

## Background

```text
#05080D
#080C12
```

## Surface

```text
#0B1119
#0E151E
#101822
```

## Borders

```text
rgba(255,255,255,0.06)
rgba(255,255,255,0.08)
rgba(255,255,255,0.12)
```

## Brand yellow

```text
#F4D900
```

Use yellow for:

- active navigation
- primary CTA
- selected states
- important metrics
- progress indicators
- logo accent

Do not make the entire interface yellow.

## Semantic colors

```text
Success: #32D583
Danger:  #FF4D5A
Warning: #FFB547
Info:    #4DA3FF
Purple:  #9B7BFF
```

---

# 6. TYPOGRAPHY

Use one modern sans-serif font.

Preferred:

```text
Inter
Geist
Manrope
```

Suggested hierarchy:

```text
Page title:       24–30px / 700
Section title:    14–18px / 600–700
Card title:       13–15px / 600
Body:             12–14px
Metadata:         10–12px
Micro labels:     9–11px
KPI:              20–28px / 700–800
```

The UI must feel compact.

Avoid oversized marketing typography except in the Sports hero.

---

# 7. SPACING AND CARDS

Use a compact spacing system:

```text
4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 32
```

Default dashboard gap:

```text
12–16px
```

Card padding:

```text
12–16px
```

Card radius:

```text
6–10px
```

Do not use giant rounded cards.

Do not create large empty areas.

The reference is a **high-density dashboard**.

---

# 8. GLOBAL HEADER

Create one reusable header.

Desktop structure:

```text
WAGERline
Home
Live
Sports
Leagues
Predictions
Stats
News
Rewards
                         Search
                         Notification
                         Avatar
```

Header:

- 56–64px high
- dark background
- thin bottom border
- compact navigation
- yellow active indicator

Active navigation must be derived from the current route.

Mobile:

```text
Menu | WAGERline | Search | Avatar
```

Menu opens a drawer.

---

# 9. REQUIRED SHARED COMPONENTS

Create reusable components:

```text
AppShell
TopNavbar
MobileMenu
AdminSidebar

PageHeader
SectionHeader
SportTabs
FilterTabs
SearchInput
FilterDropdown

StatCard
KpiCard
MatchCard
LiveMatchCard
MatchDetails
TeamLogo
LeagueBadge
StatusBadge

PlayerCard
PlayerRow

PredictionCard
PredictionBar
ConfidenceBadge

ChartCard
LineChart
AreaChart
BarChart
DonutChart

NewsCard
NewsHeroCard
NewsListItem

BadgeCard
ChallengeCard
Leaderboard

DataTable
ProgressBar

LoadingState
EmptyState
ErrorState
Modal
Drawer
Toast
```

Do not duplicate the same UI in multiple pages.

---

# 10. DATA MODELS

Use TypeScript.

```ts
type Sport =
  | "football"
  | "basketball"
  | "american-football"
  | "ice-hockey"
  | "formula-1";

type MatchStatus =
  | "live"
  | "upcoming"
  | "finished";

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  sport: Sport;
}

interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  sport: Sport;
  teams: number;
  matches: number;
  status: "active" | "upcoming" | "finished";
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  startTime: string;
  league: League;
}

interface Prediction {
  id: string;
  matchId: string;
  homeProbability: number;
  drawProbability?: number;
  awayProbability: number;
  confidence: number;
  recommendation: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  team: Team;
  goals: number;
  assists: number;
  rating: number;
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  publishedAt: string;
  featured?: boolean;
}
```

Create a mock data layer rather than scattering arrays throughout components.

Recommended:

```text
/data
  teams
  players
  leagues
  matches
  predictions
  news
  rewards
```

---

# 11. PAGE — LIVE

The Live page must closely reproduce the leftmost/top reference screen.

## Header

```text
Live [LIVE]
```

Sport filters:

```text
All
Football
Basketball
American Football
Ice Hockey
Formula 1
```

## Main layout

Desktop:

```text
60% Live Matches
40% Match Details
```

## Live Now

Display compact match rows.

Example:

```text
Manchester City     2 - 1     Liverpool
Premier League                 75'
```

Also include believable examples:

```text
Barcelona 1 - 0 Real Madrid
Lakers 83 - 78 Warriors
Maple Leafs 3 - 2 Canadiens
AC Milan 2 - 1 Juventus
Dortmund 1 - 0 Bayern
```

Every row includes:

- league
- team logos
- team names
- score
- minute/status
- selected state

Clicking a match must update Match Details.

## Match Details

Show:

- teams
- score
- live minute
- possession
- shots
- shots on target
- corners
- fouls
- cards
- timeline

Use compact comparison bars.

## Below

Create:

### Upcoming

```text
Dortmund vs Leipzig       18:30
Inter vs Atalanta         20:45
PSG vs Marseille           21:00
```

### Top Scorers

```text
Erling Haaland    Man City     27
Mohamed Salah     Liverpool    22
Harry Kane        Bayern       21
```

---

# 12. PAGE — SPORTS

## Hero

The Sports page must reproduce the large central hero composition from the reference.

Text:

```text
ALL SPORTS.
ALL INTELLIGENCE.
ONE PLATFORM.
```

Subtitle:

```text
Live scores, stats, AI predictions and everything you need to stay ahead.
```

Button:

```text
Explore All Sports
```

Use a high-quality sports composition containing:

- football
- basketball
- American football
- ice hockey
- Formula 1

The hero should blend into the dark background.

Do not use a generic white/bright stock-photo rectangle.

## Sport cards

Create:

```text
Football
Basketball
American Football
Ice Hockey
Formula 1
```

Each card contains:

- icon
- sport name
- competition count
- arrow

## Popular Competitions

Include:

```text
Premier League
La Liga
Serie A
Bundesliga
Ligue 1
NBA
NFL
NHL
Champions League
World Cup
F1
```

## Trending Teams

Create compact rows/cards for:

```text
Man City
Real Madrid
Boston Celtics
Dallas Cowboys
Toronto Maple Leafs
```

## Top Players

Create compact player cards.

---

# 13. PAGE — LEAGUES

Create a league table matching the reference.

Columns:

```text
League
Country
Teams
Matches
Status
Form
```

Example rows:

```text
Premier League   England   20   380   Active
La Liga          Spain     20   380   Active
Serie A          Italy     20   380   Active
Bundesliga       Germany   18   306   Active
Ligue 1          France    18   306   Active
Super Lig        Türkiye   20   380   Active
NBA              USA       30   1230  Active
NFL              USA       32   1320  Active
NHL              USA       32   1312  Active
Formula 1        World     10   24    Active
```

Right-side League Overview:

```text
Premier League
England
Season 2025/26

20 Teams
380 Matches
```

Button:

```text
View League
```

Below:

- Points Progress chart
- Top Scorers

---

# 14. PAGE — PREDICTIONS

This is a core product page.

## Header tabs

```text
All Predictions
My Predictions
```

Add Filters.

## KPI row

```text
Accuracy
86%
+7.2%

Total Predictions
1,248

Win Rate
68%

ROI
+24.5%
```

## Top Predictions

Example:

```text
Man City vs Liverpool
Tomorrow 18:30

Man City      56%
Draw          24%
Liverpool     20%
```

Use three probability bars.

Show:

```text
AI Confidence 86%
```

Second example:

```text
Real Madrid vs Barcelona

Real Madrid   48%
Draw          28%
Barcelona     24%
```

## Prediction Distribution

Use a donut chart.

## How It Works

Three cards:

```text
Data Analysis
AI Prediction
Smart Insights
```

## Upcoming Predictions

Use compact rows with:

- match
- time
- probability
- confidence

Important: demo prediction values are mock values. Do not imply that a real AI model exists unless connected to one.

---

# 15. PAGE — STATS

Top KPI cards:

```text
Matches          128
Goals Today      356
Avg Goals        2.78
Biggest Win      6 - 0
Clean Sheets     42
```

## Top Players

Columns:

```text
#
Player
Team
Goals
Assists
Rating
```

Example:

```text
1  Erling Haaland   Man City      27   7   7.91
2  Mohamed Salah    Liverpool     22   6   7.89
3  Harry Kane       Bayern        21   6   7.72
4  Kylian Mbappe    PSG            7   7   7.68
5  Vinicius Junior  Real Madrid   16   8   7.60
```

## Charts

Create:

1. Goals Trend
2. Shots on Target / Match
3. Possession %

Use compact chart cards.

---

# 16. PAGE — NEWS

## Featured story

Large featured card:

```text
Mbappé returns as Real Madrid win big in La Liga
```

Metadata:

```text
La Liga · 2h ago
```

## Headlines

Compact list:

```text
NBA Playoffs: Celtics take control of the series
NFL Draft 2026: Top prospects to watch
Verstappen takes pole in dramatic qualifying
```

## News grid

Use sports news cards for:

- Manchester City
- Bayern Munich
- Arsenal
- Miami Heat
- Formula 1
- NHL

Each card:

- image
- category
- title
- timestamp

---

# 17. PAGE — REWARDS

## Level card

```text
Level 7
Elite Fan

2,450 XP

Next Level
```

Stats:

```text
Badges 12
Points 2,450
Rank #3,210
```

## Daily Tasks

```text
Login to the platform       +10
View 3 live matches         +20
Make a prediction           +50
Read a news article         +10
```

Completed tasks must have a check state.

## Badges

```text
Early Bird
Predictor
Stat Hunter
Streak Master
News Reader
```

## Leaderboard

```text
1 AlexFanatic   8,900 XP
2 SportsGuru    7,620 XP
3 GameMaster    6,430 XP
4 DataKing      5,210 XP
5 You           2,450 XP
```

Highlight "You".

## Challenges

```text
Weekly Prediction Master   12 / 15
Monthly Streak             12 / 20
Accuracy Expert             68 / 70
```

---

# 18. PAGE — ADMIN

Admin has a sidebar.

```text
Dashboard
Users
Content
Events
Leagues
News
Predictions
Rewards
Analytics
Settings
System
```

Dashboard KPI:

```text
Total Users       12,458
Active Users       3,245
Total Events       5,432
Predictions        1,245
```

## Charts

### Users Overview

Line chart:

- New Users
- Active Users

### Events by Sport

Donut:

- Football
- Basketball
- NFL
- NHL
- F1

## Recent Activity

```text
New user registered       2m ago
Match updated             5m ago
News published           12m ago
Prediction generated     15m ago
League table updated      20m ago
```

## System Health

```text
API             Operational
Database        Operational
Cache           Operational
Queue           Operational
```

Use green status indicators.

Admin tables must support:

- search
- filtering
- sorting
- pagination
- row hover
- status badges

Mock state is acceptable if no backend exists.

---

# 19. RESPONSIVE BEHAVIOR

## Desktop

At 1280px+ reproduce the reference most closely.

Use multi-column dashboards.

## Tablet

Reduce columns while preserving hierarchy.

## Mobile

Use one-column layout.

Do not simply shrink desktop.

Live order:

```text
Header
Sport filters
Live matches
Match details
Upcoming
Top scorers
```

Predictions:

```text
Header
KPIs
Top predictions
Distribution
How it works
Upcoming
```

Stats:

```text
KPIs
Top players
Goals trend
Shots
Possession
```

Tables must either:

- horizontally scroll, or
- transform into mobile cards

Never create clipped columns.

---

# 20. INTERACTIONS

The application must not be a static screenshot.

Implement:

- navigation
- active nav states
- sport filters
- league filters
- prediction filters
- search
- match selection
- tabs
- dropdowns
- mobile drawer
- user menu
- reward task completion
- responsive layout

## Match selection

Clicking a match updates Match Details.

## Filters

Filters must actually change visible content.

## Search

Search across mock:

- teams
- players
- leagues
- matches
- news

---

# 21. LOADING / EMPTY / ERROR STATES

Every data-heavy component needs appropriate states.

Loading:

- use skeletons matching the component shape

Empty:

```text
No predictions found
Try changing your filters.
```

Error:

```text
Unable to load live matches
[Retry]
```

Never show raw errors to the user.

---

# 22. ACCESSIBILITY

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible button labels
- alt text
- table headers
- dialog focus management
- sufficient contrast
- non-color-only status indicators

---

# 23. PERFORMANCE

Avoid:

- unnecessary global state
- duplicated data
- huge images
- unnecessary dependencies
- excessive re-renders

Use optimized images and lazy loading where appropriate.

---

# 24. CODE QUALITY

Rules:

- TypeScript
- reusable components
- no giant page component
- no duplicated card markup
- no hard-coded active navigation
- no broken links
- no console errors
- no placeholder lorem ipsum
- no fake buttons
- no unexplained magic numbers where tokens/components can be used

---

# 25. VISUAL QA

After implementation, compare the app against:

`./assets/wagerline-reference.png`

Check all of these:

- [ ] background darkness
- [ ] yellow accent
- [ ] header height
- [ ] navigation spacing
- [ ] card density
- [ ] border opacity
- [ ] typography
- [ ] KPI size
- [ ] chart proportions
- [ ] tab styling
- [ ] button sizing
- [ ] icon sizing
- [ ] spacing
- [ ] page hierarchy
- [ ] responsive behavior

If the result looks like a generic dashboard, **do another visual refinement pass**.

---

# 26. IMPLEMENTATION ORDER

Follow this order.

### Phase 1

1. Inspect repository
2. Inspect reference image
3. Establish theme tokens
4. Establish typography
5. Build AppShell
6. Build Navbar
7. Build reusable primitives

### Phase 2

8. Live
9. Sports
10. Leagues
11. Predictions

### Phase 3

12. Stats
13. News
14. Rewards

### Phase 4

15. Admin shell
16. Admin dashboard
17. Admin tables
18. Admin analytics
19. Admin system

### Phase 5

20. Responsive pass
21. Interaction pass
22. Loading/empty/error states
23. Accessibility pass
24. Visual comparison
25. Bug fixing
26. Final polish

---

# 27. FINAL ACCEPTANCE CRITERIA

The task is complete only when all statements below are true.

## Visual

- [ ] The application clearly resembles the supplied WAGERline reference.
- [ ] Dark theme is consistent.
- [ ] Yellow brand accent is consistent.
- [ ] Cards are compact.
- [ ] Dashboard density matches the reference.
- [ ] Charts are compact and integrated.
- [ ] Typography is appropriately small and strong.
- [ ] All pages share the same design language.

## Functional

- [ ] All primary routes work.
- [ ] Navigation works.
- [ ] Filters work.
- [ ] Search works.
- [ ] Match selection works.
- [ ] Tabs work.
- [ ] Mobile menu works.
- [ ] Admin navigation works.

## Responsive

- [ ] 1440px works
- [ ] 1280px works
- [ ] 1024px works
- [ ] 768px works
- [ ] 390px works
- [ ] 375px works

## Engineering

- [ ] No runtime errors.
- [ ] No broken images.
- [ ] No dead buttons.
- [ ] No dead links.
- [ ] No obvious duplicated components.
- [ ] No unnecessary framework migration.
- [ ] TypeScript is valid.
- [ ] Build succeeds.

---

# 28. FINAL COMMAND TO THE AI CODER

**Start now.**

First inspect:

```text
./assets/wagerline-reference.png
```

Then inspect the existing project.

Do not start by inventing a new visual design.

Do not create a generic dashboard.

Do not ignore the reference image.

Do not stop at a static mockup.

Build the actual WAGERline frontend.

The attached image is the **visual source of truth**.

The application must reproduce its:

- composition
- density
- colors
- cards
- navigation
- typography
- charts
- information hierarchy

while making the UI responsive, reusable, accessible, and interactive.

**Reference image first. Code second.**

