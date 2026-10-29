# WAGERline — Rewards Page UX/UI Master Specification

**Document:** Rewards Page — Premium Engagement / Gamification UI Specification  
**Route:** `/rewards`  
**Product:** WAGERline — Sports Intelligence Platform  
**Primary stack:** Next.js + React + TypeScript + Tailwind CSS + Lucide React  
**Supported languages:** EN / ES / AR  
**Theme:** Dark Sports Intelligence / Premium Gamification  
**Status:** Implementation-ready  
**Design objective:** Make Rewards the highest-retention, highest-interaction page in WAGERline.

---

# 1. PURPOSE

The Rewards page is not a secondary profile page.

It is the **engagement hub** of WAGERline.

Its job is to make the user answer “what should I do next?” immediately after entering the page.

The page must create a continuous loop:

**SEE PROGRESS → WANT NEXT LEVEL → COMPLETE TASK → EARN XP/POINTS → UNLOCK ACHIEVEMENT → CLIMB RANK → SPEND/SHOW REWARDS → RETURN TOMORROW**

The page must therefore prioritize:

1. Immediate progress visibility.
2. Clear next action.
3. Daily habit formation.
4. Competitive motivation.
5. Achievement collection.
6. Leaderboard competition.
7. Meaningful rewards.
8. Recent feedback after every action.
9. Discovery of locked content.
10. Strong visual identity.

The page must feel like a premium sports-product gamification center, **not** an admin dashboard and **not** a simple profile page.

---

# 2. RELATIONSHIP TO THE EXISTING WAGERline MASTER SPEC

The existing WAGERline Master UI specification remains the global design authority.

It establishes:

- dark navy background
- WAGERline yellow brand accent
- premium sports intelligence visual language
- compact but rich dashboard density
- Lucide React icons
- Next.js / React / TypeScript / Tailwind CSS
- EN / ES / AR
- Arabic RTL support
- reusable components
- realistic mock data
- responsive behavior
- no generic SaaS redesign

The Rewards page is a **page-specific expansion** of that system.

Do not change the global Header, Footer, navigation, typography family, or core brand tokens.

The Rewards page may introduce a stronger **purple + yellow reward accent language**, because the Master specification explicitly allows purple and yellow for reward components.

---

# 3. CRITICAL DESIGN DIRECTIVE

## DO NOT BUILD THE CURRENT SIMPLE REWARDS PAGE AGAIN

The current implementation has useful building blocks:

- Profile card
- XP ring
- Statistics cards
- Daily Tasks
- Achievements
- Leaderboard
- Reward history

However, the page must be elevated from a collection of cards into a **retention-oriented rewards experience**.

The biggest problem to avoid is:

> “A dashboard showing reward statistics.”

The target is:

> “A game-like progression system embedded inside a premium sports intelligence product.”

Every major component must answer at least one of these questions:

- What level am I?
- How close am I to the next level?
- What can I do right now?
- What will I earn?
- What am I close to unlocking?
- Who am I competing with?
- What have I already achieved?
- What can I spend my points on?
- Why should I come back tomorrow?

---

# 4. PRIMARY USER PSYCHOLOGY

The page should intentionally use:

### Progress
Show how close the user is to meaningful milestones.

### Scarcity
Locked achievements and future rewards create curiosity.

### Competition
Leaderboard position should feel personal, not informational only.

### Immediate gratification
Completed tasks should produce visible feedback.

### Collection
Badges should feel collectible.

### Streak
Daily activity should become a habit.

### Discovery
Users should continuously find another achievable objective.

---

# 5. VISUAL DIRECTION

The visual target is:

**Premium Sports Intelligence + Competitive Gaming + Modern Fintech Dashboard**

Avoid childish game UI.

Do not use:

- cartoon graphics
- excessive emojis
- oversized mascot illustrations
- childish gradients
- casino-style flashing effects
- excessive neon
- glassmorphism everywhere
- giant empty cards
- excessive rounded containers

Use:

- deep navy surfaces
- sharp information hierarchy
- restrained gradients
- thin borders
- luminous but controlled reward accents
- trophy / shield / star / target / flame icons
- high-quality reward artwork
- compact statistics
- progress bars
- ring progress
- achievement states
- subtle motion

---

# 6. PAGE EXPERIENCE AT A GLANCE

Desktop target:

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│ WAGERline | Home Live Sports Leagues Predictions Stats News REWARDS | Search │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ PROFILE              REWARDS HERO / LEVEL PROGRESSION             XP RING     │
│ User + identity      Rewards Hub + next level + progress          LVL 24     │
│                                                                               │
├───────────────────────────────────────────────────────────────────────────────┤
│ WAGER POINTS │ XP EARNED │ TASKS COMPLETED │ CURRENT STREAK                  │
├──────────────────────────────────────┬────────────────────────────────────────┤
│ DAILY TASKS                          │ ACHIEVEMENTS                           │
│                                      │                                        │
│ action → reward → progress           │ earned / progress / locked            │
│ action → reward → progress           │                                        │
│ action → reward → progress           │                                        │
│ action → reward → progress           │                                        │
├──────────────────────────────────────┼────────────────────────────────────────┤
│ WEEKLY CHALLENGE                     │ REWARD STORE                           │
│                                      │                                        │
│ progress / deadline / reward         │ spend points / discover rewards        │
├──────────────────────────────────────┴────────────────────────────────────────┤
│ LEADERBOARD                                                                  │
│ #1 / #2 / #3 / ... / YOUR POSITION                                           │
├───────────────────────────────────────────────────────────────────────────────┤
│ RECENT ACTIVITY                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

The visual flow must feel intentional.

---

# 7. DESKTOP GRID

Use a centered content container.

Recommended:

```text
max-width: 1440px
margin: 0 auto
padding: 24px
```

Desktop ≥ 1280px:

```text
12-column CSS grid
gap: 16px
```

Recommended structure:

```text
Profile:              3 columns
Main progression:     7 columns
XP ring:              2 columns

Stats:                3 + 3 + 3 + 3

Daily Tasks:          8 columns
Achievements:         4 columns

Weekly Challenge:     4 columns
Reward Store:         8 columns

Leaderboard:          12 columns

Recent Activity:      12 columns
```

Do not allow the page to become a narrow centered column.

---

# 8. GLOBAL HEADER

Reuse the existing WAGERline Header component.

Navigation:

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

Rewards must be active.

Active state:

- WAGERline yellow
- yellow underline
- stronger font weight
- optional subtle bottom glow

Do not create a second navigation system.

---

# 9. HERO / PROFILE PROGRESSION

This is the most important visual area.

It should communicate:

**WHO AM I + WHAT LEVEL AM I + HOW CLOSE AM I + WHAT DO I GET NEXT**

## 9.1 Left — Profile Identity Card

Width: approximately 3/12.

Content:

```text
Avatar
LVL 24
Alex Thompson
Elite Predictor

Member Since      Jan 2024
Predictions       1,248
Accuracy          67.8%
Country           UK
```

Use a premium avatar treatment.

Avatar:

- 88–96px desktop
- circular
- 2px yellow/purple ring
- small edit/profile icon overlay

Level badge:

```text
LVL 24
```

Use a purple/yellow reward badge.

Do not use emoji.

Lucide icons:

- UserRound
- Trophy
- Target
- Shield
- Pencil

---

# 10. MAIN REWARDS HERO

Center area.

Title:

```text
Rewards Hub
```

Subtitle:

```text
Complete tasks, earn points, climb the leaderboard and unlock exclusive rewards.
```

This text should be immediately understandable.

## 10.1 Next Level

Prominent:

```text
Next Level: 25
7,550 XP to go
```

Large horizontal XP bar.

Example:

```text
12,450 XP ━━━━━━━━━━━━━━━━━━━░░░░░ 20,000 XP
```

Below:

```text
↗ Keep going! You're in the top 8% of all predictors.
```

This motivational microcopy is important.

Use a small purple accent bar on the left edge of the hero progression card.

---

# 11. XP RING

Right side.

Large circular progress indicator.

Target:

```text
160–180px
```

Center:

```text
LVL
24
12,450 XP
```

Ring:

- background ring: muted navy
- progress: purple
- secondary highlight: yellow
- no excessive glow

Use SVG/CSS rather than a static image.

The ring must animate subtly on initial render.

Animation:

```text
800ms
ease-out
```

Respect `prefers-reduced-motion`.

---

# 12. STATS ROW

Four cards.

Each card:

- height: ~100px
- border: 1px
- radius: 10–12px
- compact internal spacing
- left accent line
- icon container
- main number
- delta / context

## Card 1 — Wager Points

```text
12,450
+850 this week
```

Icon:

Coins

Accent:

Yellow

## Card 2 — XP Earned

```text
8,920
+1,250 this week
```

Icon:

Badge / Sparkles

Accent:

Cyan

## Card 3 — Tasks Completed

```text
28
+6 this week
```

Icon:

CircleCheck

Accent:

Green

## Card 4 — Current Streak

```text
12 Days
Best: 24 Days
```

Icon:

Flame

Accent:

Orange

The values must be typed data, not hard-coded inside JSX.

---

# 13. DAILY TASKS — CORE RETENTION COMPONENT

This is one of the most important components on the page.

The user should immediately see:

**WHAT CAN I DO RIGHT NOW?**

Header:

```text
Daily Tasks
Resets in 08:14:32
```

Use a live countdown.

Countdown must update every second.

When timer reaches zero:

- reset tasks
- update state
- show new task set
- do not require page reload

---

# 14. DAILY TASK ROW DESIGN

Each row:

```text
[ICON]  TASK TITLE
        TASK DESCRIPTION

                         +50     +30 XP     [ACTION]
```

Example:

```text
Make a Prediction
Make any match prediction

+50 Points    +30 XP    Make a Prediction
```

Row height:

```text
56–64px
```

Desktop.

Mobile:

```text
80–96px
```

---

# 15. DAILY TASK STATES

Every task must support:

### Available

```text
Task
Reward
CTA
Progress
```

### In Progress

```text
Task
Progress 1 / 2
Progress bar
CTA
```

### Completed

```text
Task
✓ Completed
```

Completed tasks should become visually quieter.

Do not hide completed tasks.

Showing completion creates progress satisfaction.

---

# 16. TASK EXAMPLES

Use realistic sports actions:

```text
Make a Prediction
Make any match prediction
+50 Points
+30 XP

Watch 2 Live Matches
Watch live matches for 10+ minutes
+40 Points
+25 XP

Correct Prediction
Make 1 correct prediction
+60 Points
+35 XP

Check Match Stats
View match statistics
+30 Points
+15 XP

Invite a Friend
Invite a friend to join WAGERline
+100 Points
+50 XP
```

The exact task data should be configurable.

---

# 17. TASK CTA RULES

The CTA must describe the destination/action.

Examples:

```text
Make a Prediction
Watch Match
View Stats
Invite Friend
```

Do not use generic:

```text
Start
Go
Open
```

unless there is no more specific action.

---

# 18. TASK INTERACTION

Clicking a task should execute the actual action or open the correct modal.

Examples:

### Make a Prediction

Open prediction modal.

Modal:

```text
Manchester City
vs
Liverpool

AI Probability

58%      22%      20%

[Manchester City]
[Draw]
[Liverpool]

Cancel             Submit Prediction
```

After submission:

1. validate selection
2. mark task complete
3. add points
4. add XP
5. update profile progress
6. update stats
7. create recent activity item
8. trigger success feedback
9. check achievement progress
10. check level-up condition

Do not reload the page.

---

# 19. TASK SUCCESS FEEDBACK

When a task is completed, show a compact reward feedback animation.

Example:

```text
✓ Task Complete

+50 Points
+30 XP
```

Use:

- subtle scale
- opacity transition
- number count-up if appropriate
- small spark/star particles only if restrained

Duration:

```text
800–1200ms
```

Do not use a giant celebratory animation for every task.

---

# 20. ACHIEVEMENTS

Achievements are the second major retention mechanic.

Header:

```text
Achievements                       View All →
```

Use a dense 2-column grid inside the desktop 4-column area.

Each achievement card:

```text
[ICON]

Prediction Master
Make 100 correct predictions

78 / 100
━━━━━━━━━━░░

```

---

# 21. ACHIEVEMENT STATES

### Earned

- strong icon
- full opacity
- completed progress
- optional earned date

### In Progress

- strong icon
- visible progress
- clear next milestone

### Locked

- grayscale
- lower opacity
- lock icon
- requirement visible

Example:

```text
Elite Predictor
Reach 80% accuracy

🔒 Locked
```

Never completely hide locked achievements.

Locked content creates curiosity.

---

# 22. ACHIEVEMENT EXAMPLES

Use:

```text
Prediction Master
Make 100 correct predictions

Streak King
Maintain 30 day streak

Stats Explorer
View 500 match statistics

Social Butterfly
Invite 10 friends

Elite Predictor
Reach 80% accuracy

Legend
Reach Level 50
```

Icons:

- Target
- Flame
- BarChart3
- Users
- Shield
- Crown

Use Lucide icons for UI representation.

If final production design uses custom badge artwork, place it under `/public/images/rewards/`.

---

# 23. WEEKLY CHALLENGE

This section must create a medium-term objective.

Example:

```text
Weekly Challenge
03d 08h 14m

Make 25 correct predictions

18 / 25
━━━━━━━━━━━━━━━━░░

500 Points
250 XP

View All Challenges
```

Requirements:

- visible deadline
- visible progress
- visible reward
- clear CTA
- progress bar
- no excessive vertical height

The challenge should feel more valuable than an ordinary daily task.

---

# 24. REWARD STORE

This is the long-term points sink.

Header:

```text
Reward Store
```

Subtitle:

```text
Spend your points on amazing rewards
```

Primary store banner:

```text
Reward Store

Turn your WAGER Points into exclusive rewards.

[Visit Store]
```

Visual:

- WAGERline merchandise/reward imagery
- subtle yellow accent
- premium dark card
- no generic e-commerce styling

---

# 25. STORE ITEMS

Example:

```text
Premium
3 Days
2,000 Points

Jersey Mystery Box
5,000 Points

Amazon Gift Card
10,000 Points

VIP Access
25,000 Points
```

Each item:

- image/icon
- title
- short description
- point cost
- availability
- redeem button on hover/focus

Do not show raw currency unless the business model requires it.

The primary currency is:

```text
WAGER Points
```

---

# 26. REWARD STORE INTERACTION

Clicking a reward opens:

```text
Reward Details

Jersey Mystery Box

5,000 Points

Your Balance
12,450 Points

You will have
7,450 Points remaining

[Cancel]
[Redeem Reward]
```

If insufficient points:

```text
Not enough points

You need 1,250 more points.

[Earn Points]
```

The Earn Points CTA should return users to Daily Tasks / Challenges.

This creates a retention loop.

---

# 27. LEADERBOARD

The leaderboard should be a major competitive component.

Header:

```text
Leaderboard
```

Filter:

```text
This Week ▼
```

Support:

```text
This Week
This Month
All Time
```

Columns:

```text
#
User
Level
Points
XP
```

Example:

```text
1   Marcus_Pro       Level 28    18,750   12,300
2   BettingWizard    Level 26    16,420   10,850
3   GoalGetter       Level 25    14,980    9,720
4   StatKing         Level 24    13,250    8,900
8   You (Alex)       Level 24    12,450    8,920
```

---

# 28. LEADERBOARD PSYCHOLOGY

The user's row must always be easy to find.

Use:

- cyan border
- slightly brighter background
- left accent
- `You` indicator

Top 3:

### #1
Gold accent.

### #2
Silver/neutral accent.

### #3
Bronze/orange accent.

Do not make all rows visually equal.

The user must instantly understand:

```text
Where am I?
Who is immediately above me?
How many points do I need?
```

Recommended microcopy:

```text
You're 800 points away from #7
```

This is more actionable than simply showing rank.

---

# 29. LEADERBOARD “CLIMB” ACTION

Add an optional compact CTA beneath the user's row:

```text
Earn 800 more points to reach #7 →
```

This should navigate toward the most valuable point-earning activities.

Priority:

1. Daily task
2. Weekly challenge
3. Prediction
4. Other earning method

---

# 30. RECENT ACTIVITY

The user needs immediate proof that their actions matter.

Header:

```text
Recent Activity
```

Use a horizontal activity feed on desktop.

Examples:

```text
Correct prediction
Man City vs Arsenal
+60
2m ago

Daily task completed
Make a Prediction
+50
15m ago

Achievement unlocked
Prediction Master
+200
1h ago

Weekly challenge progress
18 / 25 predictions
+100
2h ago

Friend invited
johndoe@gmail.com
+100
3h ago
```

Each item:

- icon
- event title
- contextual metadata
- reward amount
- timestamp

---

# 31. INFORMATION HIERARCHY

The page priority must be:

```text
1. Current level / XP progress
2. Immediate available tasks
3. Achievements close to completion
4. Weekly challenge
5. Leaderboard position
6. Reward Store
7. Recent activity
8. Historical information
```

Do not allow secondary statistics to dominate the first viewport.

---

# 32. ABOVE-THE-FOLD RULE

At a desktop viewport of approximately 1440×900, the user should see:

- Header
- Profile / Rewards Hub
- Level progress
- XP ring
- Stats row
- Beginning of Daily Tasks
- Beginning of Achievements

The user should **not** need to scroll just to understand their reward status.

---

# 33. COLOR SYSTEM

Use existing WAGERline tokens.

```css
--background: #050816;
--surface: #0A1020;
--surface-2: #0D1426;
--surface-3: #111A2D;
--border: #263149;
--border-soft: #1B263D;

--text-primary: #F7F8FC;
--text-secondary: #A8B0C0;
--text-muted: #737C8F;

--brand-yellow: #FFD400;
--brand-yellow-strong: #FFC400;

--live-red: #EF233C;
--success: #22C55E;
--warning: #FACC15;
--info: #38BDF8;
--purple: #8B5CF6;
```

Reward-specific accents:

```text
Primary reward: #8B5CF6
Premium reward: #FFD400
Success: #22C55E
XP / information: #38BDF8
Streak: #F97316
Locked: muted gray
```

Do not introduce another brand color family.

---

# 34. TYPOGRAPHY

Use the existing WAGERline typography system.

```text
Page title: 28–32px / 700
Hero title: 28–34px / 700
Section title: 16–18px / 600
Card title: 14–16px / 600
Body: 12–14px / 400
Metadata: 10–12px / 400
Large stat: 22–28px / 700
Leaderboard: 11–13px
```

The page must remain dense.

---

# 35. CARD SYSTEM

Default:

```text
background: var(--surface)
border: 1px solid var(--border)
border-radius: 12px
```

Hover:

```text
background: var(--surface-2)
border-color: slightly brighter border
```

Transition:

```text
150–200ms ease
```

Do not use:

- huge shadows
- excessive glow
- giant 24–32px rounded corners
- glass panels everywhere

---

# 36. ACCENT BAR SYSTEM

The existing WAGERline design uses accent bars.

Rewards page should use them intentionally.

Examples:

```text
Daily Tasks      purple
Achievements     yellow
Weekly Challenge cyan
Leaderboard      yellow
Reward Store     yellow
Recent Activity  green
```

Use:

```css
border-left: 3px solid <accent>;
```

Do not put accent bars on every tiny nested element.

---

# 37. ICON SYSTEM

Use Lucide React.

Preferred icons:

```text
Trophy
Award
Badge
Shield
Crown
Star
Target
Flame
Coins
CircleCheck
Lock
TrendingUp
Users
UserRound
Sparkles
Gift
ShoppingBag
Clock3
Timer
ChevronRight
ArrowRight
BarChart3
Eye
Zap
CalendarDays
```

No emoji as primary UI icons.

Custom reward artwork is allowed only for actual badge/reward artwork.

---

# 38. MOTION DESIGN

The page should feel alive but premium.

Allowed:

- XP progress animation
- number count-up
- subtle card hover
- achievement unlock animation
- task completion feedback
- leaderboard rank transition
- reward redemption confirmation
- countdown timer

Avoid:

- bouncing cards
- continuous pulsing
- flashing
- aggressive particles
- casino-like effects

Default transition:

```text
150–200ms
```

Progress animation:

```text
600–900ms
```

Achievement unlock:

```text
500–900ms
```

Always support:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 39. GAMIFICATION FEEDBACK

Every meaningful user action should produce feedback.

Examples:

### Complete Task

```text
+50 Points
+30 XP
```

### Unlock Achievement

```text
Achievement Unlocked
Prediction Master
+200 Points
```

### Level Up

```text
LEVEL UP

Level 25

New rewards unlocked.
```

### Move Up Leaderboard

```text
You're now #7
+1 position
```

Feedback should never block the user unnecessarily.

Use toast / compact modal depending on importance.

---

# 40. LEVEL-UP EXPERIENCE

Level-up is a high-value moment.

When XP crosses the next-level threshold:

1. calculate new level
2. update XP ring
3. show level-up dialog
4. show new level
5. list unlocked benefits
6. update leaderboard if applicable
7. add recent activity
8. persist state

Example:

```text
LEVEL UP

25

You've reached Elite Predictor Level 25.

Unlocked:
✓ New achievement tier
✓ 500 bonus points
✓ Reward Store access

[Continue]
```

Keep it premium.

---

# 41. ACHIEVEMENT UNLOCK EXPERIENCE

When achievement progress reaches target:

```text
Achievement Unlocked

Prediction Master

100 correct predictions

+200 Points
+100 XP

[View Achievement]
```

The achievement card should update immediately.

---

# 42. DATA MODEL

Use typed domain models.

```ts
type RewardProfile = {
  id: string
  name: string
  avatar: string
  title: string
  level: number
  xp: number
  nextLevelXp: number
  points: number
  rank: number
  accuracy: number
  predictions: number
  memberSince: string
  country: string
  streakDays: number
  bestStreakDays: number
}
```

```ts
type DailyTask = {
  id: string
  title: string
  description: string
  points: number
  xp: number
  status: "available" | "in_progress" | "completed"
  progress?: number
  target?: number
  actionLabel: string
  actionType: string
}
```

```ts
type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  status: "earned" | "in_progress" | "locked"
  progress: number
  target: number
  rewardPoints?: number
  rewardXp?: number
  unlockedAt?: string
}
```

```ts
type WeeklyChallenge = {
  id: string
  title: string
  description: string
  progress: number
  target: number
  points: number
  xp: number
  expiresAt: string
}
```

```ts
type LeaderboardEntry = {
  rank: number
  userId: string
  name: string
  avatar: string
  level: number
  points: number
  xp: number
  isCurrentUser: boolean
}
```

```ts
type RewardStoreItem = {
  id: string
  title: string
  description: string
  image: string
  pointsCost: number
  available: boolean
  category: "digital" | "physical" | "access"
}
```

```ts
type RewardActivity = {
  id: string
  type: string
  title: string
  description: string
  points?: number
  xp?: number
  timestamp: string
}
```

---

# 43. STATE ARCHITECTURE

Rewards should behave like an interactive application.

Minimum state:

```text
rewardProfile
dailyTasks
achievements
weeklyChallenge
leaderboard
rewardStore
recentActivity
selectedLeaderboardPeriod
activeModal
countdown
```

Do not scatter state across unrelated components.

Prefer a page-level rewards state abstraction or dedicated hooks.

Example:

```text
useRewards()
useDailyTasks()
useAchievements()
useLeaderboard()
useRewardStore()
```

---

# 44. COMPONENT ARCHITECTURE

Recommended:

```text
components/
  rewards/
    RewardsPage.tsx
    RewardsHero.tsx
    RewardsProfileCard.tsx
    LevelProgress.tsx
    XPProgressRing.tsx
    RewardStats.tsx
    RewardStatCard.tsx
    DailyTasks.tsx
    DailyTaskRow.tsx
    TaskActionModal.tsx
    AchievementGrid.tsx
    AchievementCard.tsx
    WeeklyChallenge.tsx
    RewardStore.tsx
    RewardStoreBanner.tsx
    RewardStoreItem.tsx
    RewardRedeemModal.tsx
    Leaderboard.tsx
    LeaderboardRow.tsx
    RecentActivity.tsx
    ActivityItem.tsx
    LevelUpModal.tsx
    AchievementUnlockModal.tsx
```

Shared:

```text
components/shared/
  ProgressBar.tsx
  LiveBadge.tsx
  IconContainer.tsx
  Modal.tsx
  Button.tsx
  Tabs.tsx
```

Do not create one 1000-line `RewardsPage.tsx`.

---

# 45. RESPONSIVE DESIGN

## Desktop ≥ 1280px

Use full 12-column composition.

## Tablet 768–1279px

Use two-column layout.

Recommended:

```text
Profile
Rewards Hero
XP Ring

Stats: 2x2

Daily Tasks: full width
Achievements: full width

Weekly Challenge
Reward Store

Leaderboard
Recent Activity
```

## Mobile < 768px

One column.

Order:

```text
Header
Profile
Rewards Hero
XP Ring
Stats
Daily Tasks
Achievements
Weekly Challenge
Reward Store
Leaderboard
Recent Activity
Footer
```

---

# 46. MOBILE DAILY TASKS

The mobile task row must not become cramped.

Use:

```text
[icon] Task title
       description

       +50 Points   +30 XP

       [Make a Prediction]
```

CTA should be full-width where needed.

---

# 47. MOBILE LEADERBOARD

Use:

```text
Rank
Avatar + User
Level
Points
```

Hide low-priority XP column if necessary.

Always keep the current user's row visible.

If the current user is outside the visible top list:

```text
...
#8 You
```

Pin the user's row after the top entries.

---

# 48. AR / RTL

Supported languages:

```text
EN
ES
AR
```

Arabic must use:

```css
direction: rtl;
```

Do not simply mirror icons blindly.

Directional icons such as:

```text
ArrowRight
ChevronRight
```

may need RTL-aware rendering.

Progress bars must remain semantically correct.

Leaderboard numeric columns should remain readable.

---

# 49. ACCESSIBILITY

Every interactive element requires:

- keyboard access
- visible focus
- accessible label
- semantic button/link
- sufficient contrast

Do not use color alone.

Examples:

Completed task:

```text
green + check icon + "Completed"
```

Locked achievement:

```text
gray + lock icon + "Locked"
```

---

# 50. PERFORMANCE

Use:

- Next.js Image
- lazy loading for below-the-fold artwork
- server components where possible
- client components only for interactive reward modules
- typed mock data
- CSS/SVG progress indicators

Do not make the entire route one unnecessary client component.

---

# 51. IMAGE / ASSET REQUIREMENTS

Required directories:

```text
/public/images/rewards/
  badges/
  store/
  avatars/
```

Potential assets:

```text
prediction-master.png
streak-king.png
stats-explorer.png
social-butterfly.png
premium-access.png
jersey-mystery-box.png
gift-card.png
vip-access.png
```

Use high-quality artwork.

Do not use gray placeholders in the final UI.

If artwork is unavailable during initial implementation, use clean Lucide-based visual placeholders that preserve layout dimensions — but replace them before final QA.

---

# 52. NO EMOJI RULE

Do not use emoji as UI icons.

Bad:

```text
🔥 12 Days
🏆 Achievement
🎯 Prediction
```

Good:

```text
[Flame] 12 Days
[Trophy] Achievement
[Target] Prediction
```

Use Lucide React.

---

# 53. MICROCOPY

Microcopy should create motivation without sounding childish.

Good:

```text
Keep going — you're close to Level 25.
You're 800 points away from #7.
One more correct prediction to unlock this badge.
Come back tomorrow to protect your streak.
You're in the top 8% of predictors.
```

Avoid:

```text
Awesome!!!
You're a superstar!!!
OMG!
You rock!!!
```

---

# 54. EMPTY STATES

If a user has no achievements:

```text
Your journey starts here.

Complete your first task to unlock your first achievement.

[View Daily Tasks]
```

If no activity:

```text
No activity yet.

Your completed tasks, achievements and rewards will appear here.
```

Do not show empty gray blocks.

---

# 55. LOADING STATES

Use skeletons that match the actual component geometry.

Do not use:

```text
Loading...
```

for the whole page.

Skeleton:

- dark surface
- subtle shimmer
- same dimensions as content
- no layout shift

---

# 56. ERROR STATES

Example:

```text
We couldn't load your rewards.

Your progress is safe.

[Try Again]
```

Do not expose raw API errors.

---

# 57. REWARD BALANCE VISIBILITY

The user's point balance must remain easy to discover.

Recommended:

Header/profile:

```text
12,450 Points
```

Store:

```text
Balance: 12,450
```

Do not force users to navigate away to understand whether they can redeem an item.

---

# 58. RETENTION MECHANICS

The page should contain four retention horizons.

## Immediate — Today

Daily Tasks

## Short Term — This Week

Weekly Challenge

## Medium Term

Achievements

## Long Term

Level + Leaderboard + Reward Store

This hierarchy is intentional.

---

# 59. FIRST-VISIT EXPERIENCE

A new user should not see a page designed only for advanced users.

If level 1:

```text
Level 1
New Fan

0 / 500 XP
```

Daily tasks should explain how to earn.

Example:

```text
Complete your first prediction
+50 Points
+30 XP
```

Achievements should include beginner milestones.

---

# 60. ADVANCED USER EXPERIENCE

For experienced users:

- show more difficult achievements
- show higher leaderboard competition
- show larger reward goals
- show streak milestones
- show exclusive rewards

Do not make the interface look different.

Change the content and progression.

---

# 61. REWARD ECONOMY DISPLAY

Points and XP are different currencies.

Clearly distinguish:

### Points

Spendable.

```text
12,450 Points
```

### XP

Progression.

```text
12,450 / 20,000 XP
```

Never visually imply that XP can be spent.

Use different icons:

```text
Coins = Points
Sparkles/Badge = XP
```

---

# 62. POINT / XP REWARD VISUAL LANGUAGE

When displaying rewards:

```text
+50 Points
+30 XP
```

Points should use yellow/coin styling.

XP should use purple/cyan styling.

This distinction must be consistent everywhere.

---

# 63. DAILY RESET

The countdown should use the user's local timezone.

Example:

```text
Resets in 08:14:32
```

When expired:

- regenerate daily tasks
- reset task progress
- preserve historical activity
- preserve streak if daily criteria were satisfied
- update UI immediately

---

# 64. STREAK LOGIC

Streak should be visually important.

Display:

```text
Current Streak
12 Days

Best
24 Days
```

When streak is at risk:

```text
Protect your 12-day streak.
Complete one task today.
```

This should be contextual, not permanently alarming.

---

# 65. LEADERBOARD UPDATE

Leaderboard changes should be reflected without full page refresh where practical.

When user moves up:

```text
Rank ↑
```

Use subtle transition.

Do not animate the entire leaderboard aggressively.

---

# 66. REWARD STORE PRIORITY

The store should not overpower Daily Tasks.

The correct emotional hierarchy is:

```text
Earn → Progress → Compete → Redeem
```

not:

```text
Shop → Shop → Shop
```

The store is a destination for earned value.

---

# 67. VISUAL DENSITY

The page must feel rich.

Target:

```text
high information density
medium whitespace
strong grouping
clear scan paths
```

Avoid:

```text
huge cards
huge empty margins
large decorative sections
```

The page should look premium because of **precision**, not emptiness.

---

# 68. HOVER BEHAVIOR

Cards:

```text
background + slight border emphasis
```

Task:

```text
row highlight
CTA becomes more prominent
```

Achievement:

```text
slight lift
```

Reward store item:

```text
image slightly enlarges
redeem action becomes visible
```

Leaderboard:

```text
row background change
```

Do not use exaggerated scale transforms.

---

# 69. BUTTON SYSTEM

Primary:

```text
yellow background
dark text
```

Secondary:

```text
dark background
light border
white text
```

Reward CTA:

```text
yellow
```

Completed:

```text
muted + green check
```

Locked:

```text
disabled/neutral
```

---

# 70. MODAL RULES

Modals should be compact and focused.

Never open a huge full-screen modal for a simple task.

Task modal:

```text
max-width: 520px
```

Redeem modal:

```text
max-width: 480px
```

Level-up:

```text
max-width: 560px
```

Use accessible focus trapping and Escape handling.

---

# 71. ROUTING

The page lives at:

```text
/rewards
```

Expected navigation:

```text
Home Rewards widget → /rewards
Header Rewards → /rewards
Achievement View All → /rewards?tab=achievements
Leaderboard View All → /rewards?tab=leaderboard
Store View → /rewards?tab=store
```

Query/tab behavior is optional but recommended.

---

# 72. TAB MODEL

If tabs are used, support:

```text
Overview
Achievements
Leaderboard
Rewards
```

However, the default `/rewards` route should show the complete overview.

Do not hide core content behind tabs on desktop.

Tabs can be used for deeper exploration.

---

# 73. REWARDS PAGE URL STATE

Optional:

```text
/rewards?tab=overview
/rewards?tab=achievements
/rewards?tab=leaderboard
/rewards?tab=store
```

Ensure direct navigation works.

---

# 74. MOCK DATA

Use realistic data.

Do not use:

```text
User 1
User 2
Task A
Badge 1
Lorem ipsum
```

Seed:

```text
Alex Thompson
Marcus_Pro
BettingWizard
GoalGetter
StatKing
```

Use real sports context in tasks and activities.

---

# 75. MOCK USER

Recommended initial user:

```text
Name: Alex Thompson
Title: Elite Predictor
Level: 24
XP: 12,450
Next Level XP: 20,000
Points: 12,450
Rank: 8
Predictions: 1,248
Accuracy: 67.8%
Current Streak: 12
Best Streak: 24
Member Since: Jan 2024
Country: UK
```

The exact values are seed data and must be configurable.

---

# 76. INITIAL ACHIEVEMENTS

```text
Prediction Master
Progress: 78 / 100
Reward: 200 Points

Streak King
Progress: 12 / 30
Reward: 500 Points

Stats Explorer
Progress: 312 / 500
Reward: 300 Points

Social Butterfly
Progress: 4 / 10
Reward: 400 Points

Elite Predictor
Locked
Requirement: 80% accuracy

Legend
Locked
Requirement: Level 50
```

---

# 77. INITIAL LEADERBOARD

```text
1  Marcus_Pro        Level 28    18,750   12,300
2  BettingWizard     Level 26    16,420   10,850
3  GoalGetter        Level 25    14,980    9,720
4  StatKing          Level 24    13,250    8,900
8  You (Alex)        Level 24    12,450    8,920
```

If showing ranks 5–7, use realistic intermediate users.

---

# 78. INITIAL REWARD STORE

```text
Premium Access
3 Days
2,000 Points

Jersey Mystery Box
5,000 Points

Amazon Gift Card
10,000 Points

VIP Access
1 Month
25,000 Points
```

Store items should be configurable and should not assume a real external fulfillment integration.

---

# 79. RECENT ACTIVITY SEED

```text
Correct prediction
Man City vs Arsenal
+60
2m ago

Daily task completed
Make a Prediction
+50
15m ago

Achievement unlocked
Prediction Master
+200
1h ago

Weekly challenge progress
18 / 25 predictions
+100
2h ago

Friend invited
johndoe@email.com
+100
3h ago
```

---

# 80. FILE STRUCTURE

Recommended:

```text
app/
  rewards/
    page.tsx

components/
  rewards/
    RewardsPage.tsx
    RewardsHero.tsx
    RewardsProfileCard.tsx
    LevelProgress.tsx
    XPProgressRing.tsx
    RewardStats.tsx
    RewardStatCard.tsx
    DailyTasks.tsx
    DailyTaskRow.tsx
    TaskActionModal.tsx
    AchievementGrid.tsx
    AchievementCard.tsx
    WeeklyChallenge.tsx
    RewardStore.tsx
    RewardStoreBanner.tsx
    RewardStoreItem.tsx
    RewardRedeemModal.tsx
    Leaderboard.tsx
    LeaderboardRow.tsx
    RecentActivity.tsx
    ActivityItem.tsx
    LevelUpModal.tsx
    AchievementUnlockModal.tsx

lib/
  data/
    rewards.ts
  rewards/
    calculations.ts
    actions.ts

public/
  images/
    rewards/
      badges/
      store/
      avatars/
```

---

# 81. CALCULATION RULES

Create reusable utilities:

```ts
getXpProgress(currentXp, nextLevelXp)
getXpRemaining(currentXp, nextLevelXp)
getAchievementProgress(progress, target)
getLeaderboardDelta(currentRank, previousRank)
canRedeemReward(balance, cost)
getTaskCompletionRate(tasks)
```

Do not duplicate calculations inside JSX.

---

# 82. XP PROGRESS FORMULA

```text
progress = currentXp / nextLevelXp
```

Clamp:

```text
0 ≤ progress ≤ 1
```

For visual width:

```css
width: `${Math.min(100, progress * 100)}%`
```

---

# 83. ACHIEVEMENT PROGRESS

```text
percentage = progress / target * 100
```

Clamp to 100%.

Show both:

```text
78 / 100
```

and a visual bar.

Never rely on the percentage alone.

---

# 84. REWARD REDEMPTION VALIDATION

Before redeeming:

```text
balance >= reward.pointsCost
```

If false:

```text
disable redemption
show remaining required points
```

If true:

```text
subtract points
create activity
show confirmation
update balance
```

---

# 85. NO FAKE PERSISTENCE

During mock implementation, use local state or a clearly isolated mock service.

Do not pretend an external transaction occurred.

Structure the code so the service can later be replaced with an API.

---

# 86. API ABSTRACTION

Architecture:

```text
Rewards UI
    ↓
Rewards domain hooks
    ↓
Rewards service
    ↓
API / database
```

Do not bind components directly to a future external API.

---

# 87. RESPONSIVE VALIDATION

Test at:

```text
1440 × 900
1536 × 1024
1280 × 800
1024 × 768
768 × 1024
390 × 844
375 × 812
```

Desktop is the primary visual target.

---

# 88. VISUAL QA

After implementation:

1. Start application.
2. Open `/rewards`.
3. Capture desktop screenshot.
4. Compare against the provided Rewards design reference.
5. Fix page grid first.
6. Fix hero dimensions.
7. Fix Daily Tasks / Achievements balance.
8. Fix typography.
9. Fix spacing.
10. Fix borders.
11. Fix colors.
12. Fix icon sizing.
13. Fix image cropping.
14. Test interactions.
15. Test mobile.
16. Test Arabic RTL.

Do not begin by polishing shadows while the layout is wrong.

---

# 89. PIXEL-ACCURACY PRIORITY

If time is limited:

## P0

```text
Header
Hero
Level progress
XP ring
Stats
Daily Tasks
Achievements
```

## P1

```text
Weekly Challenge
Leaderboard
Reward Store
```

## P2

```text
Recent Activity
Micro animations
Empty states
```

## P3

```text
Minor hover details
Micro typography adjustments
```

---

# 90. PROHIBITED DESIGN CHANGES

Without explicit approval, do NOT:

- switch to light theme
- remove Rewards sections
- replace Rewards with a simple profile
- remove Daily Tasks
- remove Achievements
- remove Leaderboard
- remove Reward Store
- remove XP progression
- use emoji as primary icons
- use a generic SaaS dashboard template
- introduce a sidebar
- introduce excessive glassmorphism
- introduce excessive gradients
- use huge empty cards
- use childish game graphics
- use giant full-screen hero art
- hide core progression behind multiple tabs
- make every component identical in size
- reduce the page to only four statistic cards

---

# 91. DEFINITION OF DONE

The Rewards page is complete only when:

```text
[ ] Header matches WAGERline
[ ] Rewards navigation is active
[ ] Profile identity is visible
[ ] Current level is obvious
[ ] XP progress is obvious
[ ] XP ring is functional
[ ] Next-level target is visible
[ ] Four reward stats are visible
[ ] Daily Tasks are interactive
[ ] Daily countdown works
[ ] Task completion updates points
[ ] Task completion updates XP
[ ] Task completion updates recent activity
[ ] Achievements show earned/in-progress/locked states
[ ] Achievement progress is visual
[ ] Weekly Challenge is visible
[ ] Reward Store is visible
[ ] Reward redemption validates points
[ ] Leaderboard is interactive
[ ] Current user is visually highlighted
[ ] User rank is obvious
[ ] Recent Activity updates
[ ] Level-up state exists
[ ] Achievement unlock state exists
[ ] EN exists
[ ] ES structure exists
[ ] AR exists
[ ] Arabic RTL works
[ ] Desktop is dense and premium
[ ] Mobile is usable
[ ] No emoji UI icons remain
[ ] Lucide React is used
[ ] No generic placeholders remain
[ ] No unnecessary client-side rendering
[ ] Components are reusable
[ ] Data is typed
[ ] Rewards service abstraction exists
```

---

# 92. FINAL IMPLEMENTATION COMMAND FOR AI CODER

Copy the following command into the AI coding agent together with this MD and the supplied visual reference.

```text
IMPLEMENTATION START

You are implementing the WAGERline Rewards page at /rewards.

Read this entire specification before changing code.

IMPORTANT:
The Rewards page is the primary user-retention page of WAGERline.

Do NOT treat it as a simple profile page.

Do NOT build a generic SaaS dashboard.

Do NOT simplify the page to statistics.

The goal is a premium sports gamification experience where the user immediately understands:

1. Who they are
2. What level they are
3. How close they are to the next level
4. What they can do right now
5. What they will earn
6. What achievements they are close to
7. Where they rank
8. What rewards they can redeem
9. Why they should return tomorrow

Reuse the existing WAGERline Header/Footer and global design system.

Required stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

Required major page order:

1. Header
2. Profile + Rewards Hero + XP Ring
3. Reward Stats
4. Daily Tasks + Achievements
5. Weekly Challenge + Reward Store
6. Leaderboard
7. Recent Activity
8. Footer

Desktop must use a dense 12-column layout.

The first viewport must clearly show:

- profile
- level
- XP progress
- XP ring
- reward stats
- Daily Tasks
- Achievements

Daily Tasks MUST be interactive.

Clicking a task must execute the relevant action or open a modal.

Completing a task must update:

- task status
- points
- XP
- profile progress
- recent activity
- achievement progress
- level if threshold is crossed

Do not reload the page.

Implement reward feedback.

Implement achievement unlock feedback.

Implement level-up feedback.

Implement Reward Store redemption flow with balance validation.

Implement Leaderboard with:

- weekly/monthly/all-time selector
- top 3 visual hierarchy
- current user highlighted
- rank-climb motivation

Use realistic mock sports data.

Use typed data models.

Do not hard-code data inside JSX.

Use reusable components.

Use Lucide icons instead of emoji.

Use custom reward artwork only where appropriate.

Maintain:

- #050816 background
- #0A1020 / #0D1426 surfaces
- #263149 borders
- #F7F8FC primary text
- #A8B0C0 secondary text
- #FFD400 WAGERline yellow
- #8B5CF6 reward purple
- #22C55E success
- #38BDF8 info
- #F97316 streak

Do not introduce a new brand color system.

The visual tone must be:

PREMIUM
SPORTS
INTELLIGENT
COMPETITIVE
GAMIFIED
NOT CHILDISH

Use subtle motion only.

Support prefers-reduced-motion.

Support EN / ES / AR.

Support RTL for Arabic.

Test desktop and mobile.

Before declaring the task complete:

1. Run the application.
2. Open /rewards.
3. Inspect the page visually.
4. Correct layout differences.
5. Correct spacing.
6. Correct typography.
7. Correct borders.
8. Correct colors.
9. Correct component density.
10. Test task interaction.
11. Test achievement interaction.
12. Test leaderboard interaction.
13. Test reward redemption.
14. Test level-up.
15. Test mobile.
16. Test Arabic RTL.

DO NOT STOP when the page merely works.

The requirement is a visually polished, retention-oriented Rewards experience.

IMPLEMENTATION END
```

---

# 93. FINAL DESIGN PRINCIPLE

The Rewards page should make the user feel:

```text
“I am progressing.”
        ↓
“I am close to something.”
        ↓
“I can do something right now.”
        ↓
“I will earn something.”
        ↓
“I am competing with others.”
        ↓
“I want that reward.”
        ↓
“I should come back tomorrow.”
```

That loop is the actual product requirement.

The page is successful when the user does not simply **view** their rewards.

The user should immediately want to **earn the next one**.
