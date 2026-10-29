# 🚀 PHASE 1: Multi-Sport API Implementation Plan

**Duration:** 3-4 days  
**Sports:** Basketball, American Football, Ice Hockey, Baseball, Formula 1, Tennis  
**APIs:** ESPN, NHL, MLB, Ergast, Tennis Data (ALL FREE, NO AUTH)

---

## 📋 DETAILED BREAKDOWN

### 1️⃣ ESPN API Provider (Multi-sport)

**File:** `src/providers/espnApi/client.ts`

**Sports supported:**
- Basketball (NBA + EuroLeague)
- American Football (NFL)
- Baseball (MLB)
- Golf (PGA Tour)
- MMA/Boxing (UFC, Boxing)
- Rugby (select leagues)

**Endpoints:**
```
Base: https://site.api.espn.com/site/api/site/v2/sports

/sports/{sport}/{league}/leagues/{id}/teams
/sports/{sport}/{league}/leagues/{id}/standings
/sports/{sport}/{league}/leagues/{id}/events
/sports/{sport}/{league}/teams/{teamId}
/sports/{sport}/{league}/teams/{teamId}/roster
/sports/{sport}/{league}/teams/{teamId}/schedule
```

**Parameters:**
```
sport: basketball, football, baseball, golf, mma
league: nba, eubleague, nfl, mlb, pga, ufc
```

---

### 2️⃣ NHL API Provider

**File:** `src/providers/nhlApi/client.ts`

**Base URL:** `https://statsapi.web.nhl.com/api/v1`

**Endpoints:**
```
GET /teams
GET /standings
GET /schedule
GET /teams/{teamId}
GET /teams/{teamId}/roster
GET /teams/{teamId}/stats
GET /divisions
GET /conferences
```

---

### 3️⃣ MLB StatsAPI Provider

**File:** `src/providers/mlbStatsApi/client.ts`

**Base URL:** `https://statsapi.mlb.com/api/v1`

**Endpoints:**
```
GET /teams
GET /standings
GET /schedule
GET /teams/{teamId}
GET /teams/{teamId}/roster
GET /divisions
GET /leagues
```

---

### 4️⃣ Ergast F1 API Provider

**File:** `src/providers/ergastApi/client.ts`

**Base URL:** `https://ergast.com/api/f1`

**Endpoints:**
```
GET /{season}/drivers.json
GET /{season}/constructors.json
GET /{season}/races.json
GET /{season}/driverstandings.json
GET /{season}/constructorstandings.json
GET /{season}/{round}/results.json
GET /{season}/{round}/qualifying.json
```

---

### 5️⃣ Tennis Data API Provider

**File:** `src/providers/tennisDataApi/client.ts`

**Base URL:** `https://tennis-data.co.uk`

**Endpoints:**
```
GET /data/matches/{year}/{month}.json  (historical)
GET /rankings/atp.json
GET /rankings/wta.json
GET /tournaments.json
```

---

## 🗂️ DIRECTORY STRUCTURE (AFTER IMPLEMENTATION)

```
src/providers/
├── apiFootball/
│   └── client.ts              ✅ EXISTS
├── theSportsDb/
│   └── client.ts              ✅ EXISTS
├── espnApi/                   ← NEW
│   ├── client.ts              ← NEW
│   └── types.ts               ← NEW
├── nhlApi/                    ← NEW
│   ├── client.ts              ← NEW
│   └── types.ts               ← NEW
├── mlbStatsApi/               ← NEW
│   ├── client.ts              ← NEW
│   └── types.ts               ← NEW
├── ergastApi/                 ← NEW
│   ├── client.ts              ← NEW
│   └── types.ts               ← NEW
├── tennisDataApi/             ← NEW
│   ├── client.ts              ← NEW
│   └── types.ts               ← NEW
├── SportsDataProvider.ts       ✅ EXISTS (interface)
└── providerRegistry.ts        ← NEW (provider factory)
```

---

## 🔧 UNIFIED PROVIDER INTERFACE

**Update:** `src/providers/SportsDataProvider.ts`

```typescript
interface SportsDataProvider {
  // Metadata
  sport: string  // 'football' | 'basketball' | 'americanfootball' | etc.
  name: string   // 'API-Football' | 'ESPN' | 'NHL' | etc.
  
  // Core methods (all providers must implement)
  getLeagues(season?: number): Promise<any[]>
  getTeams(leagueId: number, season?: number): Promise<any[]>
  getPlayers(teamId: number, season?: number): Promise<any[]>
  getFixtures(leagueId: number, season?: number): Promise<any[]>
  getFixture(fixtureId: number): Promise<any>
  getFixtureEvents(fixtureId: number): Promise<any[]>
  getFixtureStatistics(fixtureId: number): Promise<any>
  getStandings(leagueId: number, season?: number): Promise<any>
  
  // Optional sport-specific methods
  getInjuries?(leagueId: number, season?: number): Promise<any>
  getOdds?(fixtureId: number): Promise<any>
  getPrediction?(fixtureId: number): Promise<any>
  getHeadToHead?(teamA: number, teamB: number): Promise<any[]>
  getLiveFixtures?(): Promise<any[]>
}
```

---

## 🔌 PROVIDER REGISTRY

**File:** `src/providers/providerRegistry.ts`

```typescript
const providersByName = {
  'api-football': apiFootballClient,
  'espn': espnClient,
  'nhl': nhlClient,
  'mlb': mlbClient,
  'ergast': ergastClient,
  'tennis-data': tennisDataClient,
  'thesportsdb': theSportsDbClient,
}

const sportProviders = {
  'football': ['api-football', 'thesportsdb'],
  'basketball': ['espn'],
  'americanfootball': ['espn'],
  'icehockey': ['nhl', 'espn'],
  'baseball': ['mlb', 'espn'],
  'formula1': ['ergast'],
  'tennis': ['tennis-data'],
  'cricket': [],        // ⏳ Phase 2
  'volleyball': [],     // ⏳ Phase 2
  'rugby': ['espn'],    // ⏳ Later
  'golf': ['espn'],     // ⏳ Later
  'mma': ['espn'],      // ⏳ Later
}

export function getProviderForSport(sport: string): SportsDataProvider {
  const providers = sportProviders[sport]
  if (!providers || providers.length === 0) {
    throw new Error(`No provider available for ${sport}`)
  }
  return providersByName[providers[0]]
}
```

---

## 📊 SYNC JOB STRUCTURE

**File:** `src/jobs/syncComplete_AllSports.ts`

```typescript
async function syncAllSports() {
  const sports = [
    { name: 'football', leagues: [39, 140, 135, 78, 61, 203, 88] },
    { name: 'basketball', leagues: [1] }, // NBA
    { name: 'americanfootball', leagues: [1] }, // NFL
    { name: 'icehockey', leagues: [1] }, // NHL
    { name: 'baseball', leagues: [103] }, // MLB
    { name: 'formula1', leagues: null }, // F1 (season-based)
    { name: 'tennis', leagues: null }, // Tennis (tournament-based)
  ]
  
  for (const sport of sports) {
    await syncSportData(sport)
  }
}

async function syncSportData(sport) {
  const provider = getProviderForSport(sport.name)
  
  // Teams
  const teams = await provider.getTeams(sport.leagueId, 2025)
  // Players
  for (const team of teams) {
    const players = await provider.getPlayers(team.id, 2025)
  }
  // Fixtures
  const fixtures = await provider.getFixtures(sport.leagueId, 2025)
  // ... etc
}
```

---

## 🎯 DAILY TASKS

### Day 1: ESPN & NHL APIs
- [ ] ESPN Provider (basketball, football, baseball, golf, mma)
- [ ] NHL Provider
- [ ] Unit tests

### Day 2: MLB & Ergast
- [ ] MLB Provider
- [ ] Ergast F1 Provider
- [ ] Unit tests

### Day 3: Tennis & Integration
- [ ] Tennis Data Provider
- [ ] Provider Registry
- [ ] Updated SportsDataProvider interface
- [ ] Integration tests

### Day 4: Sync Jobs
- [ ] syncComplete_AllSports.ts
- [ ] Per-sport normalizers
- [ ] Database population
- [ ] Verification

---

## ✅ SUCCESS CRITERIA

```
[ ] All 6 providers implemented
[ ] All APIs responding with data
[ ] Database populated for each sport
[ ] Sync jobs completing successfully
[ ] Real data flowing through system
[ ] No rate limit issues
[ ] Error handling working

Expected Data:
  Basketball:  30 teams, 450+ players
  NFL:         32 teams, 1600+ players
  NHL:         32 teams, 960+ players
  MLB:         30 teams, 900+ players
  F1:          20 races, 10 teams, 20 drivers
  Tennis:      1000+ matches, 500+ players
```

---

## 🚀 START NOW!

Ready to implement?

1. Create ESPN Provider first (covers 5 sports)
2. Then NHL Provider
3. Then MLB Provider
4. Then Ergast Provider
5. Then Tennis Provider
6. Then integrate all

**Estimated:** 3-4 days to full integration

Let's go! 💪
