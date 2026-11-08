# WAGERline MVP

Current application: `wagerline-app/` (Next.js), `backend/` (Fastify + SQLite).
The root `src/` directory is the legacy ingestion prototype.

Start in two terminals:

```powershell
cd backend
npm.cmd install
npm.cmd run db:migrate
npm.cmd run dev
```

```powershell
cd wagerline-app
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. Browser requests use `/api/v1` on the same origin;
Next.js proxies them to `API_INTERNAL_URL` (default `http://127.0.0.1:3001`).
For separate hosts, set that server-side variable before building. See
`wagerline-app/.env.example` and `backend/.env.example`. Keep API keys in the backend.

Verification: `npm.cmd run build` in both folders; `npm.cmd run test:smoke`
and `npm.cmd run db:audit` in `backend`; `node scripts/review-workspace.cjs`
in `wagerline-app` with both servers running.
The browser review uses installed Microsoft Edge in headless mode.

Verified data refresh commands in `backend`: `npm.cmd run sync:results`,
`npm.cmd run sync:logos`, `npm.cmd run sync:news`, then `npm.cmd run cache:news-images`.
Run TheSportsDB imports sequentially to respect its public API rate limit.
Logo and image source URLs are retained in `team_logo_sources` and `news_image_sources`.
Deploy `wagerline-app/public/team-logos` and `public/news-images` together with the database.
Predictions are published database records; absent model output is not synthesized.
Personal picks are stored in the browser, not an authenticated account.

See [the workspace review](REVIEW-2026-11-06.md) and [the earlier review](REVIEW-2026-11-05.md) for verified behavior,
remaining data limitations and artifacts. The MVP notes below describe the original prototype.

Multi-sport intelligence platform combining live scores, statistics, predictions, and gamification.

## Architecture

```
External APIs (TheSportsDB, SportScore, API-Sports)
        ↓
Provider Adapters (Fallback System)
        ↓
Data Normalization
        ↓
SQLite Database
        ↓
Backend API (Fastify)
        ↓
Frontend (Next.js)
```

## Project Structure

```
/src
  /database
    schema.sql      - SQLite schema (50+ tables)
    db.js           - Database wrapper
  /providers
    base.provider.js          - Abstract provider
    sportscore.provider.js     - SportScore adapter
    thesportsdb.provider.js    - TheSportsDB adapter
    api-sports.provider.js     - API-Sports adapter
    provider-manager.js        - Fallback system
  /jobs
    sync-sports.js   - Sync: Sports, Competitions, Seasons
    sync-events.js   - Sync: Events, Participants, Scores
  index.js           - Entry point
```

## Database Schema

**Core Tables:**
- sports, competitions, seasons, venues, countries

**Participants:**
- teams, team_translations, players, drivers, coaches

**Events:**
- events, event_participants, event_scores, event_statistics

**Standings:**
- standings, standing_entries

**Predictions:**
- predictions, prediction_factors, prediction_results

**Users:**
- users, user_preferences, user_predictions, user_activity

**Gamification:**
- user_xp, levels, badges, user_badges, challenges, rewards, streaks

**System:**
- data_sources, api_requests, sync_jobs, sync_logs, system_settings
- external_entity_mapping

## Setup

```bash
npm install
npm run db:migrate
npm run sync:sports
npm run sync:events
npm run dev
```

## Features Implemented

### 1. SQLite Database ✓
- WAL mode enabled
- 40+ tables with proper relationships
- Indexes on frequently queried columns
- Support for multi-language data (translations)
- External provider mapping

### 2. Provider Adapters ✓
- **TheSportsDB**: Teams, Events, Scores
- **SportScore**: Full API coverage
- **API-Sports**: Football focus (Standardi)
- Fallback system: A→B→C fallback chain
- Rate limiting & retry logic

### 3. Sync Jobs ✓
- **sync-sports.js**: Sports & Competitions seed data
- **sync-events.js**: Events, Participants, Scores ingestion
- Job tracking: Created, Updated, Processed counts
- Error logging & state management

## Next Steps

1. **Backend API** (Fastify)
   - REST endpoints: /api/v1/sports, /api/v1/events/live
   - Language support: Accept-Language header
   - Admin panel for sync control

2. **Frontend** (Next.js)
   - Home page with live events
   - Event detail page with statistics
   - League standings
   - i18n: EN/ES/AR support
   - RTL support for Arabic

3. **Live Updates**
   - Near-live polling (5-15s for active events)
   - WebSocket support
   - Real-time predictions

4. **Authentication**
   - Email/password login
   - User profiles & preferences
   - JWT + HTTP-only cookies

5. **Predictions & Gamification**
   - Rule-based prediction engine
   - XP system
   - Ranking & badges
   - Leaderboards

## Environment Variables

```
DATABASE_URL=./data/wagerline.db
API_SPORTS_KEY=your_key
SPORTSCORE_API_KEY=your_key
THESPORTSDB_API_KEY=your_key
DEFAULT_LANGUAGE=en
DATA_PROVIDER_MODE=mock|production
```

## Status

- [x] Database schema
- [x] Provider adapters
- [x] Sync jobs
- [ ] Backend API
- [ ] Frontend
- [ ] Live updates
- [ ] Authentication
- [ ] Predictions
- [ ] Gamification
- [ ] i18n & SEO

---

**MVP Target**: Full platform with 5 sports, 6 football leagues, live events, predictions, and gamification.
