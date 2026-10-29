
Aşağıdaki sürüm, önceki dokümanın **teknik mimariyle birleştirilmiş hali**. Özellikle **EN / ES / AR tüm sistemin temel gereksinimi** olarak ele alındı.

# `WAGERLINE-MVP-FULL-SPEC.md`

```md
# WAGERline
## Multi-Sport Intelligence, Live Scores & Prediction Platform
### Full MVP Product + UI/UX + Backend + Data Architecture Specification

Version: 2.0
Status: MVP
Target: AI Coder
Platforms: Responsive Web
Languages: EN / ES / AR
Database: SQLite
Architecture: Modular Monolith
Data Model: Multi-Sport / Multi-Competition / Multi-Language

---

# 1. PRODUCT DEFINITION

WAGERline is a multi-sport intelligence platform combining:

- Live scores
- Sports events
- Historical results
- Team statistics
- Player statistics
- Driver statistics
- League standings
- Head-to-head data
- Form analysis
- AI/model predictions
- Sports news
- Rankings
- Gamification
- Rewards
- Personalized user profiles

WAGERline is NOT a betting operator.

The MVP does not provide:

- betting account
- betting wallet
- money deposit
- money withdrawal
- bet placement

The primary product is:

> Sports Data + Sports Intelligence + Predictions + Gamification

---

# 2. MVP SPORTS

The MVP supports exactly five sports.

## Sports

1. Football
2. Basketball
3. American Football
4. Ice Hockey
5. Formula 1

---

# 3. FOOTBALL COMPETITIONS

Football MVP:

1. Premier League
2. La Liga
3. Serie A
4. Bundesliga
5. Ligue 1
6. Süper Lig

---

# 4. OTHER SPORTS

## Basketball

NBA

## American Football

NFL

## Ice Hockey

NHL

## Formula 1

Formula 1 World Championship

---

# 5. LANGUAGE ARCHITECTURE

The entire platform MUST support:

- English (EN)
- Spanish (ES)
- Arabic (AR)

This requirement applies to:

- UI
- Navigation
- Buttons
- Labels
- Error messages
- Empty states
- Notifications
- News metadata
- SEO metadata
- Page titles
- Meta descriptions
- Structured data
- Sport names
- Competition names
- Team display names
- Player display names where localized data exists
- Prediction descriptions
- Gamification
- Email templates
- API response localization where required

---

# 6. LANGUAGE DEFAULT

Default:

EN

Users can switch:

EN
ES
AR

Language preference must be stored in the user profile.

Anonymous users:

Language stored in:

- cookie
- local storage

Authenticated users:

Language stored in:

user.preferences.language

---

# 7. RTL SUPPORT

Arabic must use RTL.

When language = AR:

<html dir="rtl">

All components must support:

- RTL navigation
- RTL cards
- RTL tables
- RTL charts
- RTL forms
- RTL modal dialogs
- RTL pagination

Do NOT create a separate Arabic frontend.

Use the same component system.

---

# 8. INTERNATIONALIZATION ARCHITECTURE

Recommended:

/i18n

  /en
    common.json
    sports.json
    competitions.json
    predictions.json
    rewards.json
    errors.json

  /es
    common.json
    sports.json
    competitions.json
    predictions.json
    rewards.json
    errors.json

  /ar
    common.json
    sports.json
    competitions.json
    predictions.json
    rewards.json
    errors.json

---

# 9. TRANSLATION RULE

No hardcoded UI strings.

BAD:

<button>View Match</button>

GOOD:

<button>
  {t("event.view_match")}
</button>

---

# 10. DATA LANGUAGE STRATEGY

External APIs may return:

- English
- provider-specific names
- IDs
- localized names where available

The internal database must separate:

IDENTITY

from

DISPLAY NAME.

Example:

Team:

team_id:
123

Team names:

EN:
Arsenal FC

ES:
Arsenal FC

AR:
أرسنال

---

# 11. DATABASE

Primary database:

SQLite

SQLite is the MVP persistence layer.

The application must NOT store provider data only in memory.

Data flow:

External APIs
        ↓
Ingestion
        ↓
Normalization
        ↓
SQLite
        ↓
Backend API
        ↓
Frontend

---

# 12. WHY SQLITE

SQLite is selected for MVP because:

- zero infrastructure
- low operational complexity
- fast reads
- easy local development
- easy backup
- suitable for MVP
- simple deployment
- supports relational data
- works well with cached sports data

SQLite must be treated as persistent application storage.

Do NOT use temporary container filesystem as the only persistence layer in production.

The SQLite file must be placed on persistent storage.

---

# 13. DATABASE ARCHITECTURE

Logical layers:

RAW
NORMALIZED
APPLICATION

Example:

raw_provider_data
        ↓
normalized_sports_data
        ↓
application_tables

---

# 14. DATABASE TABLE GROUPS

## Core

sports
competitions
seasons
venues
countries

## Participants

teams
players
drivers
coaches

## Events

events
event_status
event_participants
event_scores
event_periods

## Statistics

event_statistics
team_statistics
player_statistics
driver_statistics

## Standings

standings
standing_entries

## Historical

event_history
team_form
head_to_head

## Predictions

predictions
prediction_factors
prediction_results

## News

news
news_sources
news_entities

## Users

users
user_preferences
user_predictions
user_activity

## Gamification

user_xp
levels
badges
user_badges
challenges
rewards
user_rewards
streaks

## System

data_sources
api_requests
sync_jobs
sync_logs
system_settings

---

# 15. CORE DATABASE MODEL

sports

id
slug
name_key
icon
status

Example:

football
basketball
american-football
ice-hockey
formula-1

---

# 16. COMPETITIONS

competitions

id
sport_id
external_provider
external_id
slug
name_key
country_id
active

Example:

premier-league
la-liga
serie-a
bundesliga
ligue-1
super-lig
nba
nfl
nhl
formula-1

---

# 17. SEASONS

seasons

id
competition_id
external_id
name
start_date
end_date
is_current

---

# 18. TEAMS

teams

id
sport_id
external_id
slug
logo_url
country_id
active

Team display names must be localized.

---

# 19. TEAM TRANSLATIONS

team_translations

team_id
language
name

Example:

123
en
Arsenal FC

123
es
Arsenal FC

123
ar
أرسنال

---

# 20. PLAYERS

players

id
sport_id
external_id
slug
image_url
country_id
position
active

Player translations can be added when required.

---

# 21. EVENTS

events

id
sport_id
competition_id
season_id
external_id
event_type
start_time
status
venue_id
round
created_at
updated_at

event_type examples:

match
race
qualifying
sprint
practice

---

# 22. EVENT PARTICIPANTS

event_participants

id
event_id
participant_type
participant_id
role

Football:

HOME
AWAY

F1:

DRIVER
CONSTRUCTOR

---

# 23. EVENT SCORES

event_scores

event_id
participant_id
score
period
updated_at

---

# 24. EVENT STATUS

Possible values:

scheduled
live
halftime
period_break
finished
postponed
cancelled
suspended

---

# 25. EVENT STATISTICS

event_statistics

id
event_id
participant_id
metric
value
period
source

Examples:

possession
shots
shots_on_target
corners
fouls
cards

---

# 26. SPORT-SPECIFIC STATISTICS

Generic statistics must NOT force all sports into the same schema.

Use:

metric
metric_type
sport_id

Examples:

Football:

possession
shots
corners
goals

NBA:

points
rebounds
assists
fg_percentage
three_point_percentage

NFL:

passing_yards
rushing_yards
touchdowns
interceptions

NHL:

shots
goals
saves
power_play

F1:

lap_time
position
pit_stops
fastest_lap
points

---

# 27. DATA SOURCE ARCHITECTURE

The MVP uses multiple providers.

Primary configured providers:

1. TheSportsDB
2. SportScore
3. SportDB
4. API-Sports

The system must NOT be tightly coupled to one provider.

Architecture:

             DATA SOURCES

       ┌──────────────┐
       │ TheSportsDB  │
       └──────┬───────┘
              │
       ┌──────▼───────┐
       │  SportScore  │
       └──────┬───────┘
              │
       ┌──────▼───────┐
       │   SportDB    │
       └──────┬───────┘
              │
       ┌──────▼───────┐
       │  API-Sports  │
       └──────┬───────┘
              │
              ▼
       DATA INGESTION
              │
              ▼
       NORMALIZATION
              │
              ▼
            SQLite
              │
              ▼
         BACKEND API
              │
              ▼
          FRONTEND

---

# 28. DATA PROVIDER ABSTRACTION

Each provider MUST have its own adapter.

Example:

/providers

  /thesportsdb
    client
    mapper
    endpoints

  /sportscore
    client
    mapper
    endpoints

  /sportdb
    client
    mapper
    endpoints

  /api-sports
    client
    mapper
    endpoints

---

# 29. PROVIDER INTERFACE

All providers must implement a common interface.

Example:

SportsProvider

Methods:

getSports()

getCompetitions()

getSeasons()

getTeams()

getPlayers()

getEvents()

getEvent()

getLiveEvents()

getStandings()

getStatistics()

getNews()

getDrivers()

getRaces()

Provider-specific unsupported methods may return:

NOT_SUPPORTED

---

# 30. PROVIDER PRIORITY

Provider priority must be configurable.

Example:

Football:

1. SportScore
2. API-Sports
3. TheSportsDB
4. SportDB

The order must NOT be hardcoded in business logic.

Use configuration.

---

# 31. FALLBACK SYSTEM

If primary provider fails:

Provider A
    ↓
FAILED
    ↓
Provider B
    ↓
FAILED
    ↓
Provider C

The user should not see:

"API-Football failed."

Instead:

"Live data temporarily unavailable."

---

# 32. DATA NORMALIZATION

Different providers use different:

- IDs
- team names
- player names
- competition names
- status values
- date formats
- statistics

Therefore:

Provider Data
      ↓
Provider Mapper
      ↓
Canonical WAGERline Model
      ↓
SQLite

---

# 33. CANONICAL DATA MODEL

WAGERline must have its own internal IDs.

Never expose provider IDs as the primary internal ID.

Example:

Provider:

API-Sports team_id = 42

Internal:

WAGERline team_id = 10027

Mapping:

external_entity_mapping

internal_id
provider
external_id
entity_type

---

# 34. DATA SOURCE TABLE

data_sources

id
name
type
base_url
enabled
priority
rate_limit
last_sync
status

---

# 35. API REQUEST LOG

api_requests

id
provider
endpoint
request_time
response_time
status_code
success
error
cache_hit

Purpose:

- monitoring
- debugging
- rate-limit control

---

# 36. SYNC JOBS

sync_jobs

id
job_type
provider
sport
competition
started_at
finished_at
status
records_processed
records_created
records_updated
errors

---

# 37. DATA INGESTION

Do NOT fetch external APIs on every page request.

Correct:

External API
      ↓
Scheduled ingestion
      ↓
SQLite
      ↓
Backend
      ↓
Users

---

# 38. INGESTION TYPES

## Daily sync

- competitions
- seasons
- teams
- players
- standings
- historical data

## Hourly sync

- upcoming events
- results
- statistics
- news metadata

## Near-live sync

Only active events.

Example:

event starts
      ↓
live sync enabled
      ↓
poll provider
      ↓
update SQLite
      ↓
frontend refresh

After event ends:

live sync disabled

---

# 39. API RATE LIMIT PROTECTION

Every provider must have:

- request limiter
- retry
- exponential backoff
- cache
- request deduplication

Never repeatedly call an API for the same data.

---

# 40. CACHE STRATEGY

Cache layers:

L1:
In-memory cache

L2:
SQLite

External API

Example:

GET /events/today

↓

Cache

↓

If fresh:
return

Else:

SQLite

↓

If stale:

provider API

---

# 41. CACHE TTL

Suggested:

Sports:
7 days

Competitions:
24 hours

Teams:
24 hours

Players:
24 hours

Finished events:
30 days+

Upcoming events:
5-30 minutes

Live events:
5-15 seconds depending on provider limits

Standings:
15-60 minutes

News:
5-30 minutes

---

# 42. BACKEND

Recommended architecture:

Modular Monolith

Technology:

Node.js
TypeScript

Framework:

NestJS or Fastify

Preferred:

Fastify-based TypeScript backend

Reason:

- fast
- simple
- low overhead
- good for API
- easy AI Coder implementation

---

# 43. BACKEND MODULES

/backend

  /modules

    /sports
    /competitions
    /seasons
    /teams
    /players
    /events
    /live
    /statistics
    /standings
    /predictions
    /news
    /users
    /rankings
    /rewards
    /search

---

# 44. API ARCHITECTURE

REST API.

Base:

/api/v1

Examples:

GET /api/v1/sports

GET /api/v1/sports/football

GET /api/v1/competitions

GET /api/v1/competitions/premier-league

GET /api/v1/events/today

GET /api/v1/events/live

GET /api/v1/events/:id

GET /api/v1/events/:id/statistics

GET /api/v1/events/:id/prediction

GET /api/v1/teams/:slug

GET /api/v1/players/:slug

GET /api/v1/news

GET /api/v1/statistics

GET /api/v1/rankings

---

# 45. LANGUAGE API

All API requests may specify:

Accept-Language

Example:

Accept-Language: en

Accept-Language: es

Accept-Language: ar

Alternatively:

?lang=en

Default:

en

---

# 46. API RESPONSE

Example:

{
  "data": {
    "id": "event_123",
    "sport": "football",
    "competition": {
      "slug": "premier-league",
      "name": "Premier League"
    },
    "status": "scheduled"
  },
  "meta": {
    "language": "en",
    "updatedAt": "..."
  }
}

---

# 47. API ERROR FORMAT

Standard:

{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found",
    "localizedMessage": "..."
  }
}

---

# 48. FRONTEND

Recommended:

Next.js
TypeScript

Use:

- App Router
- Server Components where appropriate
- Client Components only where interactive
- SEO metadata
- responsive design

---

# 49. FRONTEND STRUCTURE

/app

  /[locale]

    /page.tsx

    /live
    /predictions
    /sports
    /news
    /statistics
    /rankings
    /rewards

    /football
      /premier-league
      /la-liga
      /serie-a
      /bundesliga
      /ligue-1
      /super-lig

    /nba
    /nfl
    /nhl
    /formula-1

    /event/[id]
    /team/[slug]
    /player/[slug]
    /driver/[slug]

---

# 50. LOCALE ROUTING

Recommended:

/en
/es
/ar

Examples:

/en
/es
/ar

Football:

/en/football/premier-league

/es/football/premier-league

/ar/football/premier-league

---

# 51. SEO

Each language requires unique SEO metadata.

Example:

/en/football/premier-league

Title:

Premier League 2026/27 | WAGERline

Spanish:

La Liga 2026/27 | WAGERline

Arabic:

الدوري الإنجليزي 2026/27 | WAGERline

---

# 52. SEO URL RULES

URLs should be:

- lowercase
- stable
- readable
- language aware
- slug based

Avoid:

/event?id=123

Prefer:

/en/event/arsenal-vs-liverpool-2026-08-22

---

# 53. STRUCTURED DATA

Use JSON-LD where appropriate.

Possible types:

SportsEvent
NewsArticle
BreadcrumbList
Organization

Do NOT generate invalid structured data.

---

# 54. HOME PAGE ARCHITECTURE

Home:

Header
↓
Hero
↓
Sport selector
↓
Live now
↓
Featured event
↓
Top events
↓
AI insights
↓
Trending
↓
Explore sports
↓
Latest news
↓
Statistics
↓
Ranking
↓
Rewards
↓
Footer

---

# 55. HOME HERO

Main message:

TODAY'S SPORTS INTELLIGENCE

Subtext:

Live scores, statistics, predictions and stories
from the sports world.

Primary CTA:

EXPLORE TODAY

Secondary:

LIVE EVENTS

---

# 56. FEATURED EVENT

Large card.

Must include:

- competition
- participants
- logos
- date
- time
- prediction
- confidence
- form
- CTA

---

# 57. PREDICTION ENGINE

MVP prediction engine must initially be rule/statistical based.

Inputs:

- recent form
- home advantage
- historical results
- standings
- scoring performance
- defensive performance
- event statistics
- available player/team statistics

Output:

probability

confidence

factors

---

# 58. PREDICTION MODEL

Example:

Football:

Home:
48%

Draw:
27%

Away:
25%

Confidence:

74%

The prediction system MUST clearly indicate:

Model estimate

NOT:

Guaranteed result

---

# 59. PREDICTION DATABASE

predictions

id
event_id
model_version
home_probability
draw_probability
away_probability
confidence
generated_at

prediction_factors

prediction_id
factor
value
impact

---

# 60. PREDICTION RESULT

After event:

prediction_result

prediction_id
actual_result
correct
accuracy_score

This data feeds:

- user statistics
- model evaluation
- leaderboard
- analytics

---

# 61. USER PREDICTION

Users can make their own prediction.

Example:

Who wins?

HOME
DRAW
AWAY

After submission:

Prediction locked.

User receives XP after event completion.

---

# 62. USER TABLE

users

id
username
email
password_hash
avatar_url
language
timezone
created_at
status

---

# 63. USER PREFERENCES

user_preferences

user_id
language
favorite_sport
favorite_team
notifications_enabled
theme

---

# 64. USER PREDICTIONS

user_predictions

id
user_id
event_id
prediction
created_at
result
xp_awarded

---

# 65. GAMIFICATION

MVP:

XP
Level
Streak
Badge
Challenge
Ranking

No monetary rewards.

---

# 66. XP RULES

Example:

Prediction submitted:
+10 XP

Correct prediction:
+50 XP

Daily login:
+5 XP

Three-event challenge:
+30 XP

Weekly challenge:
+100 XP

Values must be configurable.

---

# 67. RANKING

Ranking calculated from:

XP
Accuracy
Prediction count
Streak

Avoid ranking users solely by number of predictions.

---

# 68. REWARDS

Rewards are digital:

- badges
- XP
- levels
- profile frames
- achievement icons

Future:

partner rewards

But not part of MVP.

---

# 69. NEWS

News architecture:

Provider
 ↓
News ingestion
 ↓
Entity extraction
 ↓
Normalization
 ↓
SQLite
 ↓
Frontend

News should be linked to:

Sport
Competition
Team
Player
Event

---

# 70. SEARCH ENGINE

MVP search:

SQLite FTS5

Search:

Teams
Players
Competitions
Events
News

Example:

Arsenal

returns:

Team
Upcoming events
Players
News

---

# 71. BACKGROUND JOB SYSTEM

Use scheduled jobs.

Jobs:

syncSports

syncCompetitions

syncTeams

syncPlayers

syncEvents

syncResults

syncStandings

syncStatistics

syncNews

syncLiveEvents

generatePredictions

calculateRewards

calculateRankings

---

# 72. CRON

Example:

Every day:

competitions

Every 6 hours:

teams / players

Every hour:

events

Every 15 minutes:

upcoming event data

Every 5-15 seconds:

live events only

Every hour:

news

After event:

prediction result

Daily:

ranking calculation

---

# 73. IMPORTANT LIVE DATA RULE

Never run live polling globally.

BAD:

poll every event

GOOD:

poll only:

status = live

Example:

500 events

Only:

12 live

Poll:

12

---

# 74. DATA FRESHNESS

Each record must contain:

created_at
updated_at
source
source_updated_at

Frontend may show:

Updated 12 sec ago

or:

Updated 5 min ago

---

# 75. PROVIDER DATA STATUS

Every record should track:

PRIMARY
SECONDARY
FALLBACK

Example:

event.source_provider

This helps debugging and data quality.

---

# 76. DATA CONFLICT RESOLUTION

If two providers return different results:

Priority rules:

1. provider priority
2. latest timestamp
3. completeness
4. validation

Example:

Provider A:

score = 2-1

Provider B:

score = 1-1

If A has higher priority and latest timestamp:

use A.

Store conflict in logs.

---

# 77. API SECURITY

External provider API keys MUST remain backend-only.

Never expose provider API keys in frontend.

Frontend:

WAGERline API

Backend:

Provider APIs

---

# 78. AUTHENTICATION

MVP:

Email/password

Optional:

Google OAuth later

Session:

HTTP-only secure cookie

Do not store authentication tokens in localStorage unless required.

---

# 79. ADMIN PANEL

MVP should include a lightweight admin interface.

Admin can:

- enable/disable sport
- enable/disable competition
- configure provider priority
- trigger sync
- view sync status
- view API errors
- manage featured events
- manage news
- manage rewards
- view prediction performance

---

# 80. ADMIN DATA SOURCE SCREEN

Show:

Provider
Status
Last Sync
Requests Today
Errors
Rate Limit
Priority

Example:

SportScore
ACTIVE
12:31
842
3
10000
P1

---

# 81. ADMIN SYNC SCREEN

Actions:

SYNC SPORTS

SYNC COMPETITIONS

SYNC EVENTS

SYNC LIVE

SYNC NEWS

GENERATE PREDICTIONS

---

# 82. LOGGING

Backend logs:

- provider request
- provider response status
- sync job
- normalization error
- database error
- API error
- authentication error

Do NOT log:

passwords
tokens
API keys
sensitive user information

---

# 83. OBSERVABILITY

MVP metrics:

API response time
Provider success rate
Provider error rate
Live sync latency
Database size
Events processed
Predictions generated
Active users

---

# 84. PROJECT STRUCTURE

Recommended:

/apps

  /web

  /api

/packages

  /database

  /i18n

  /types

  /ui

  /sports

  /providers

  /prediction-engine

  /config

/jobs

  sync-events
  sync-live
  sync-news
  sync-statistics

---

# 85. DATABASE MIGRATIONS

Use migration system.

Every schema change must create migration.

Example:

001_initial.sql

002_add_predictions.sql

003_add_rewards.sql

Never modify production schema manually.

---

# 86. SEED DATA

MVP seed must contain:

Sports:

Football
Basketball
American Football
Ice Hockey
Formula 1

Football competitions:

Premier League
La Liga
Serie A
Bundesliga
Ligue 1
Süper Lig

Basketball:

NBA

American Football:

NFL

Ice Hockey:

NHL

Formula 1:

Formula 1

---

# 87. DEVELOPMENT MODE

AI Coder must support mock mode.

MOCK_DATA=true

When enabled:

No external API calls.

Use local fixture JSON.

This allows:

- UI development
- testing
- offline development
- API quota protection

---

# 88. PROVIDER MODE

Environment:

DATA_PROVIDER_MODE=production

or:

DATA_PROVIDER_MODE=mock

or:

DATA_PROVIDER_MODE=hybrid

---

# 89. HYBRID MODE

Hybrid:

External API
+
mock data

Useful when provider does not support a specific sport/field.

---

# 90. ENVIRONMENT VARIABLES

Example:

DATABASE_URL

SPORTS_PROVIDER

THESPORTSDB_API_KEY

SPORTSCORE_API_KEY

SPORTDB_API_KEY

API_SPORTS_KEY

JWT_SECRET

NEXT_PUBLIC_API_URL

DEFAULT_LANGUAGE

CACHE_TTL

LIVE_POLL_INTERVAL

All provider keys must be backend environment variables.

If a provider does not require an API key:

do NOT create a fake key requirement.

---

# 91. API KEY POLICY

Provider authentication must be configurable.

Provider may support:

API key
No authentication
Header authentication
Query parameter authentication

The adapter handles the provider-specific mechanism.

The rest of the application must not know how authentication works.

---

# 92. DATA PROVIDER CAPABILITY MATRIX

The system must maintain capabilities.

Example:

provider_capabilities

provider
sport
competition
live
events
standings
players
statistics
news
historical

This prevents the application from requesting unsupported data.

---

# 93. SPORT CAPABILITY MODEL

Each sport defines:

event_type
participants
periods
statistics
standings
prediction_type

Football:

match
home/away
halves
win/draw/loss

NBA:

game
home/away
quarters
win/loss

NFL:

game
home/away
quarters
win/loss

NHL:

game
home/away
periods
win/loss

F1:

race
drivers
laps
podium/position

---

# 94. FRONTEND COMPONENT RULE

No page-specific duplicate components.

Example:

Use:

<EventCard />

instead of:

<PremierLeagueEventCard />

<NBAGameCard />

<NFLEventCard />

unless the visual requirements are genuinely different.

---

# 95. DESIGN SYSTEM COMPONENTS

Required:

Button
Badge
Card
Tabs
Dropdown
Modal
Tooltip
Avatar
Progress
ProbabilityBar
StatCard
Table
Skeleton
Alert
Toast
Pagination
Search
Filter
SportIcon

---

# 96. HOME PAGE COMPONENTS

<HomeHero />

<SportSelector />

<LiveNow />

<FeaturedEvent />

<TopEvents />

<PredictionHighlights />

<TrendingEvents />

<SportsExplorer />

<LatestNews />

<StatsHighlights />

<GlobalRanking />

<DailyRewards />

---

# 97. EVENT COMPONENTS

<EventHeader />

<EventScore />

<EventStatus />

<EventTimeline />

<EventStatistics />

<EventForm />

<EventH2H />

<EventPrediction />

<EventNews />

---

# 98. RESPONSIVE RULE

Desktop:

12-column grid.

Example:

Hero:
12 columns

Live:
12 columns

Featured:
8 columns

Prediction:
4 columns

News:
8 columns

Ranking:
4 columns

Mobile:

All become single-column or horizontal scroll.

---

# 99. HOME PAGE VISUAL HIERARCHY

Priority:

1. HERO
2. LIVE
3. FEATURED EVENT
4. AI INSIGHTS
5. TOP EVENTS
6. TRENDING
7. SPORTS
8. NEWS
9. STATISTICS
10. RANKING
11. REWARDS

---

# 100. PERFORMANCE

Target:

LCP < 2.5s

CLS < 0.1

INP < 200ms

Use:

image optimization
lazy loading
code splitting
server rendering
cache
incremental rendering

---

# 101. SEO

Every major page must be indexable.

Pages:

Home
Sports
Competitions
Events
Teams
Players
News

Localized:

/en/...
/es/...
/ar/...

---

# 102. SEO INTERNAL LINKING

Example:

Premier League

↓

Arsenal

↓

Arsenal vs Liverpool

↓

Prediction

↓

Statistics

↓

News

Every entity should link to related entities.

---

# 103. SITEMAP

Generate:

sitemap.xml

Localized URLs.

Example:

/en/football/premier-league
/es/football/premier-league
/ar/football/premier-league

---

# 104. CANONICAL

Every localized page must have correct canonical.

Use hreflang:

en
es
ar

---

# 105. SECURITY

Backend must implement:

rate limiting
input validation
authentication
authorization
CSRF protection where applicable
CORS
secure cookies
SQL injection prevention
provider key protection

Use parameterized SQL.

---

# 106. SQLITE RULES

Use WAL mode.

Recommended:

PRAGMA journal_mode=WAL;

Use indexes for:

event_id
sport_id
competition_id
start_time
status
team_id
player_id

---

# 107. SQLITE BACKUP

Automated backups.

At minimum:

daily SQLite backup.

Keep:

7 daily backups

Optional:

30-day backup.

---

# 108. DATABASE INDEXES

Required indexes:

events(start_time)

events(status)

events(competition_id)

events(sport_id)

event_participants(event_id)

event_statistics(event_id)

news(published_at)

news(sport_id)

teams(slug)

players(slug)

competitions(slug)

user_predictions(user_id)

rankings(user_id)

---

# 109. DATA RETENTION

Do NOT delete finished events aggressively.

Historical event data is valuable for:

- statistics
- SEO
- prediction
- form
- H2H
- model evaluation

Finished events should remain available.

---

# 110. MVP DATA PRIORITY

P0:

Sports
Competitions
Teams
Events
Scores
Results
Standings
Basic statistics
Live events

P1:

Players
Historical
H2H
News
Predictions

P2:

Advanced statistics
Advanced prediction factors
Detailed player analytics

---

# 111. MVP DEVELOPMENT ORDER

PHASE 1

Design System

↓

PHASE 2

SQLite schema

↓

PHASE 3

Provider adapters

↓

PHASE 4

Data ingestion

↓

PHASE 5

Backend API

↓

PHASE 6

Home page

↓

PHASE 7

Live center

↓

PHASE 8

Event page

↓

PHASE 9

League pages

↓

PHASE 10

Statistics

↓

PHASE 11

News

↓

PHASE 12

Authentication

↓

PHASE 13

Predictions

↓

PHASE 14

Gamification

↓

PHASE 15

SEO / i18n

↓

PHASE 16

Testing / optimization

---

# 112. AI CODER IMPLEMENTATION RULE

AI Coder must NOT attempt to build the entire platform in one step.

Implementation must be incremental.

First:

Architecture

Then:

Database

Then:

Provider abstraction

Then:

Data ingestion

Then:

API

Then:

UI

Then:

Prediction

Then:

Gamification

---

# 113. FIRST CODING MILESTONE

The first working milestone must provide:

SQLite

+

Sports

+

Competitions

+

Teams

+

Events

+

Provider adapters

+

Sync jobs

+

Backend API

+

Home page

No authentication required initially.

---

# 114. FIRST DEMO

The first demo must show:

HOME

Live events

Upcoming events

Featured event

Sports selector

Football competitions

NBA

NFL

NHL

F1

No empty screens.

If live API data is unavailable:

mock data must be shown.

---

# 115. SECOND DEMO

Add:

Event detail

Statistics

Prediction

News

League detail

Team detail

---

# 116. THIRD DEMO

Add:

Authentication

Profile

User predictions

XP

Ranking

Rewards

---

# 117. FINAL MVP

The MVP is complete when:

[ ] Five sports work

[ ] Six football leagues work

[ ] Data ingestion works

[ ] SQLite persistence works

[ ] Provider fallback works

[ ] Live events work

[ ] Event pages work

[ ] Statistics work

[ ] Predictions work

[ ] News works

[ ] User profiles work

[ ] Rankings work

[ ] Rewards work

[ ] EN works

[ ] ES works

[ ] AR works

[ ] RTL works

[ ] SEO works

[ ] Responsive UI works

[ ] Admin sync works

[ ] Backup works

---

# 118. FINAL ARCHITECTURE

                         WAGERline
                              │
             ┌────────────────┼────────────────┐
             │                │                │
          FRONTEND         BACKEND          ADMIN
             │                │                │
          Next.js          Node.js          Admin UI
          TypeScript       Fastify
             │                │
             │          ┌─────┴──────┐
             │          │            │
             │      Sports API    Prediction
             │      Modules       Engine
             │          │
             │      Data Layer
             │          │
             │        SQLite
             │
             └──────────┬─────────────
                        │
                  WAGERline API
                        │
       ┌────────────────┼────────────────┐
       │                │                │
TheSportsDB        SportScore         SportDB
       │                │                │
       └────────────────┼────────────────┘
                        │
                    API-Sports
                        │
                        ↓
                  DATA INGESTION
                        │
                   NORMALIZATION
                        │
                      SQLite

---

# 119. FINAL USER EXPERIENCE

USER

↓

LANGUAGE

EN / ES / AR

↓

HOME

↓

TODAY'S SPORTS INTELLIGENCE

↓

LIVE / TOP EVENTS

↓

EVENT

↓

STATISTICS

↓

AI PREDICTION

↓

USER PREDICTION

↓

XP

↓

RANKING

↓

REWARD

↓

RETURN

---

# 120. PRODUCT NORTH STAR

WAGERline must feel like:

Sports Intelligence Platform

not:

Betting Website

not:

Sports News Website

not:

Live Score Website

not:

Statistics Website

The product combines all four into one experience.

Core statement:

> SEE THE GAME.
> UNDERSTAND THE DATA.
> MAKE YOUR PREDICTION.
> BUILD YOUR RANK.

```

### Özellikle değiştirdiğim kritik mimari

Burada **SQLite'ı sadece “veritabanı” olarak değil, dış API'lerle frontend arasındaki merkezi veri katmanı** yaptım:

```text
                 ┌───────────────┐
                 │ TheSportsDB   │
                 ├───────────────┤
                 │ SportScore    │
                 ├───────────────┤
                 │ SportDB       │
                 ├───────────────┤
                 │ API-Sports    │
                 └───────┬───────┘
                         │
                    PROVIDER
                    ADAPTERS
                         │
                         ▼
                 DATA NORMALIZER
                         │
                         ▼
                    ┌────────┐
                    │ SQLite │
                    └───┬────┘
                        │
              ┌─────────┴─────────┐
              │                   │
          BACKEND API        PREDICTION
              │                ENGINE
              │                   │
              └─────────┬─────────┘
                        ▼
                    NEXT.JS
                        │
             ┌──────────┼──────────┐
             │          │          │
            EN         ES         AR
                                  RTL
```

Bunun önemli avantajı şu: **hangi API'nin hangi sporu desteklediği frontend'i ilgilendirmiyor.** Örneğin yarın SportScore'dan NBA verisi alınamazsa, NBA için API-Sports devreye girebilir; kullanıcı arayüzü değişmez.

Ayrıca **EN / ES / AR'yi sonradan eklenen bir özellik değil, ilk günden veri modelinin parçası** yaptım. Bu özellikle SEO tarafında önemli; `/en`, `/es`, `/ar` yapısı ve `hreflang`, localized metadata ve SQLite'daki translation tabloları başlangıçtan itibaren tasarlanmış durumda.

Bir sonraki aşamada bunun üzerine **“WAGERline UI Design System + Homepage detaylı görsel spesifikasyonu”** çıkarmak en doğru adım olur. Orada ana sayfanın **1440px desktop ekranında piksel bazında hangi bölümün kaç px yüksekliğinde olacağı, grid kolonları, kart boyutları, renk paleti, fontlar, ikonlar, görsel kullanım alanları ve mobil kırılımları** netleştirilebilir.
