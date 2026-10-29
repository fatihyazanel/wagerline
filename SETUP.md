# WAGERline - Setup Guide

## Multi-Language Support (EN / ES / AR)

### Frontend i18n Structure
```
src/i18n/
├── en/common.json
├── es/common.json
└── ar/common.json
```

### Translation Usage
```tsx
import { useTranslation } from '@/hooks/useTranslation'

export default function Component() {
  const { t, language } = useTranslation('en') // or 'es', 'ar'
  
  return <button>{t('buttons.submit')}</button>
}
```

### RTL Support
Arabic pages automatically use RTL:
```tsx
<html dir={language === 'ar' ? 'rtl' : 'ltr'}>
```

---

## Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Environment Setup
```bash
cp .env.example .env
```

### Database
```bash
npm run db:migrate  # Initialize SQLite
npm run db:seed    # Add seed data
```

### Start Server
```bash
npm run dev        # Development mode
npm run build      # Build for production
npm start          # Production mode
```

**API runs on:** `http://localhost:3001/api/v1`

---

## API Endpoints

### Sports
```
GET /api/v1/sports
GET /api/v1/sports/:slug
```

### Competitions
```
GET /api/v1/competitions
GET /api/v1/competitions/:slug
```

### Events
```
GET /api/v1/events/today
GET /api/v1/events/live
GET /api/v1/events/:id
GET /api/v1/events/:id/statistics
```

### Teams
```
GET /api/v1/teams
GET /api/v1/teams/:slug
```

### Language Support
All endpoints accept `?lang=en|es|ar` parameter:
```
GET /api/v1/competitions/premier-league?lang=ar
```

---

## Database Schema

### Core Tables
- `sports` - Football, Basketball, etc.
- `competitions` - Premier League, NBA, etc.
- `teams` - Team data with translations
- `events` - Matches, races, games
- `seasons` - Competition seasons

### Features
- **SQLite WAL mode** for better concurrency
- **Translations** for teams, competitions
- **Multi-provider** support (SportDB, API-Sports, etc.)
- **Live sync** architecture
- **Rate limiting** protection

### Indexes
Optimized for:
- Event start times
- Event status
- Team slugs
- Leaderboard queries

---

## Data Ingestion

### Seed Data
Initial data includes:
- 5 Sports
- 10 Football competitions
- 8 Teams with EN/ES/AR translations
- 5 Levels
- Relationships set up

### Provider Adapters
```
backend/src/providers/
├── thesportsdb/
├── sportscore/
├── sportdb/
└── api-sports/
```

---

## Frontend Setup

### Install Next.js
```bash
cd wagerline-app
npm install
```

### Environment
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Start Development
```bash
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

---

## Multi-Language Implementation Checklist

- [x] Translation files (EN/ES/AR)
- [x] i18n hook
- [x] RTL support
- [x] API language parameter
- [x] Backend response localization
- [ ] URL routing by locale `/[locale]/...`
- [ ] Language selector in header
- [ ] localStorage persistence
- [ ] SEO hreflang tags
- [ ] Canonical URLs

---

## Next Steps

1. **Phase 1**: Backend API fully operational ✓
2. **Phase 2**: Database seeding with real data
3. **Phase 3**: Provider adapters integration
4. **Phase 4**: Frontend API integration
5. **Phase 5**: Home page using real data
6. **Phase 6**: Event detail pages
7. **Phase 7**: User authentication
8. **Phase 8**: Gamification system

---

## Architecture

```
Frontend (Next.js)
    ↓
WAGERline API (Fastify/Node.js)
    ↓
SQLite Database
    ↓
Provider Adapters
    ↓
External APIs
(TheSportsDB, SportScore, API-Sports, etc.)
```

---

## Testing

### Check API
```bash
curl http://localhost:3001/api/v1/sports
```

### Check Frontend
```bash
Open http://localhost:3000
```

---

## Important Notes

- **Database**: SQLite with WAL mode (persistent storage)
- **Languages**: EN default, ES and AR fully supported
- **RTL**: Automatic for Arabic
- **API Keys**: Backend-only, never exposed to frontend
- **Mock Mode**: Development mode without real API calls
