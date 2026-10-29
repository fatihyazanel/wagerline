# 📰 News API Endpoints

Base URL: `http://localhost:3001/api/v1/news`

---

## 🔄 News Sources

```
Guardian:    50 articles (ACTIVE ✅)
BBC Sport:   0 articles  (Feed error - RSS removed)
ESPNFC:      0 articles  (RSS parsing issues)
```

---

## 📋 Endpoints

### 1. GET `/` - List All News
Get all news articles with pagination.

**Query Parameters:**
```
?page=1
?limit=20
?lang=en
?sport=football
?source=guardian
```

**Example:**
```bash
curl "http://localhost:3001/api/v1/news?page=1&limit=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "From the Pocket: Alastair Clarkson's exit makes sense...",
      "slug": "from-the-pocket-alastair-clarkson-exit-makes-sense",
      "description": "Detailed analysis...",
      "content": "https://www.theguardian.com/...",
      "image_url": "https://...",
      "source": "guardian",
      "sport_id": 1,
      "published_at": "2026-09-02T05:31:54.000Z",
      "created_at": "2026-09-02T10:45:23.000Z"
    }
  ],
  "meta": {
    "language": "en",
    "page": 1,
    "limit": 10,
    "total": 50,
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 2. GET `/:id` - Get Single News Article
Get detailed information about a specific news article.

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/1?lang=en"
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "From the Pocket: Alastair Clarkson's exit makes sense...",
    "slug": "from-the-pocket-alastair-clarkson-exit-makes-sense",
    "description": "Detailed analysis...",
    "content": "https://www.theguardian.com/...",
    "image_url": "https://...",
    "source": "guardian",
    "sport_id": 1,
    "published_at": "2026-09-02T05:31:54.000Z",
    "created_at": "2026-09-02T10:45:23.000Z"
  },
  "meta": {
    "language": "en",
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 3. GET `/source/:source` - News by Source
Get news filtered by source (guardian, bbc, espnfc).

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/source/guardian?limit=20"
```

**Response:**
```json
{
  "data": [
    { ... },
    { ... }
  ],
  "meta": {
    "language": "en",
    "source": "guardian",
    "total": 50,
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 4. GET `/sport/:sport` - News by Sport
Get news for a specific sport.

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/sport/football?limit=30"
```

**Response:**
```json
{
  "data": [
    { ... },
    { ... }
  ],
  "meta": {
    "language": "en",
    "sport": "football",
    "total": 50,
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 5. GET `/team/:slug` - News by Team
Get news mentioning a specific team.

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/team/arsenal"
```

**Response:**
```json
{
  "data": [
    { "title": "Arsenal signs new midfielder..." },
    { "title": "Arsenal beats Liverpool..." }
  ],
  "meta": {
    "language": "en",
    "team": "arsenal",
    "total": 5,
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 6. GET `/trending` - Trending News
Get 10 most recent articles.

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/trending?lang=en"
```

**Response:**
```json
{
  "data": [
    { "title": "Latest breaking news..." },
    { "title": "Just now..." }
  ],
  "meta": {
    "language": "en",
    "category": "trending",
    "total": 10,
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 7. GET `/search` - Search News
Search articles by keyword.

**Query Parameters:**
```
?q=arsenal          (required, min 2 chars)
?lang=en
```

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/search?q=manchester"
```

**Response:**
```json
{
  "data": [
    { "title": "Manchester City wins again..." },
    { "title": "Manchester United draws..." }
  ],
  "meta": {
    "language": "en",
    "query": "manchester",
    "total": 8,
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

### 8. GET `/stats` - News Statistics
Get overall news statistics.

**Example:**
```bash
curl "http://localhost:3001/api/v1/news/stats"
```

**Response:**
```json
{
  "data": {
    "total": 50,
    "by_source": [
      { "source": "guardian", "count": 50 },
      { "source": "bbc", "count": 0 },
      { "source": "espnfc", "count": 0 }
    ],
    "by_sport": [
      { "slug": "football", "count": 25 },
      { "slug": "basketball", "count": 10 },
      { "slug": null, "count": 15 }
    ],
    "latest_article": "2026-09-02T05:31:54.000Z"
  },
  "meta": {
    "timestamp": "2026-09-02T10:45:30Z"
  }
}
```

---

## 🔄 Sync Commands

### Fetch News from APIs
```bash
npm run sync:news
```

**What it does:**
1. ✅ Fetches 50 articles from Guardian API
2. ❌ Attempts BBC Sport RSS (currently broken)
3. ❌ Attempts ESPNFC RSS (currently parsing issues)
4. Stores all in SQLite database

**Output:**
```
🔄 Syncing news from Guardian...
  Found 50 articles
  ✅ Created 50

📊 NEWS SYNC SUMMARY
  Guardian:  50
  BBC Sport: 0
  ESPNFC:    0
  Total:     50
```

---

## 🔐 Environment Setup

### Guardian API

**Get API Key:**
1. Visit: https://open-platform.theguardian.com/
2. Register for free account
3. Get API key
4. Add to `.env`:

```env
GUARDIAN_API_KEY=your_key_here
```

**Current Key (in .env):**
```
GUARDIAN_API_KEY=REPLACE_WITH_GUARDIAN_API_KEY
```

---

## 📊 Database Schema

### news table
```sql
CREATE TABLE news (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,           -- URL or full content
  image_url TEXT,
  source TEXT,            -- guardian, bbc, espnfc
  sport_id INTEGER,
  competition_id INTEGER,
  team_id INTEGER,
  external_url TEXT,      -- Original article URL
  published_at TIMESTAMP,
  created_at TIMESTAMP
)
```

---

## 🎯 Frontend Integration

### Next.js Example
```typescript
// /app/[locale]/news/page.tsx
async function NewsPage({ params }: { params: { locale: string } }) {
  const response = await fetch('http://localhost:3001/api/v1/news?limit=20')
  const news = await response.json()

  return (
    <div>
      <h1>Latest Sports News</h1>
      {news.data.map((article) => (
        <NewsCard key={article.id} article={article} locale={params.locale} />
      ))}
    </div>
  )
}
```

### Search
```typescript
const handleSearch = async (query: string) => {
  const response = await fetch(
    `http://localhost:3001/api/v1/news/search?q=${query}`
  )
  const results = await response.json()
  setResults(results.data)
}
```

### Trending
```typescript
useEffect(() => {
  fetch('http://localhost:3001/api/v1/news/trending')
    .then(r => r.json())
    .then(data => setTrendingNews(data.data))
}, [])
```

---

## 📈 Stats

| Metric | Value |
|--------|-------|
| Total News | 50 |
| Guardian Articles | 50 |
| BBC Articles | 0 |
| ESPNFC Articles | 0 |
| Latest Update | 2026-09-02 05:31:54 UTC |

---

## 🚀 Ready to Use

```bash
# 1. Sync news
npm run sync:news

# 2. Start server
npm run dev

# 3. Test API
curl http://localhost:3001/api/v1/news/trending

# 4. Integrate to frontend
# Update Next.js to call these endpoints
```

**Database: `data/wagerline.db` (50 articles)**  
**API: `/api/v1/news` endpoints ready** ✅
