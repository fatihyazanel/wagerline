export interface NormalizedFixture {
  provider: string
  externalId: string | number
  leagueId: string | number
  seasonId: string | number
  homeTeamId: string | number | null
  awayTeamId: string | number | null
  homeTeamName: string
  awayTeamName: string
  startTime: string
  status: string
  round: number | null
  homeScore: number | null
  awayScore: number | null
  venue: string | null
}

export function normalizeFixtureFromApiFootball(fixture: any): NormalizedFixture {
  return {
    provider: 'api-football',
    externalId: fixture.fixture?.id || fixture.id,
    leagueId: fixture.league?.id || null,
    seasonId: fixture.season || null,
    homeTeamId: fixture.teams?.home?.id || null,
    awayTeamId: fixture.teams?.away?.id || null,
    homeTeamName: fixture.teams?.home?.name || 'Unknown',
    awayTeamName: fixture.teams?.away?.name || 'Unknown',
    startTime: fixture.fixture?.date || fixture.date,
    status: (fixture.fixture?.status?.short || fixture.status || 'NS').toUpperCase(),
    round: fixture.league?.round ? parseInt(fixture.league.round.split(' ').pop()) : null,
    homeScore: fixture.goals?.home,
    awayScore: fixture.goals?.away,
    venue: fixture.fixture?.venue?.name || null,
  }
}

export function normalizeFixtureFromTheSportsDb(fixture: any): NormalizedFixture {
  const homeScore = fixture.intHomeScore ? parseInt(fixture.intHomeScore) : null
  const awayScore = fixture.intAwayScore ? parseInt(fixture.intAwayScore) : null

  let status = 'NS'
  if (fixture.strStatus) {
    if (fixture.strStatus.includes('Final')) status = 'FT'
    else if (fixture.strStatus.includes('Half')) status = 'HT'
    else if (fixture.strStatus.includes('Live')) status = 'LIVE'
    else if (fixture.strStatus.includes('Postp')) status = 'PPD'
  }

  return {
    provider: 'thesportsdb',
    externalId: fixture.idEvent || fixture.id,
    leagueId: fixture.idLeague || null,
    seasonId: fixture.intSeason || null,
    homeTeamId: fixture.idHomeTeam || null,
    awayTeamId: fixture.idAwayTeam || null,
    homeTeamName: fixture.strHomeTeam || 'Unknown',
    awayTeamName: fixture.strAwayTeam || 'Unknown',
    startTime: fixture.dateEvent ? `${fixture.dateEvent}T${fixture.strTime || '00:00:00'}` : new Date().toISOString(),
    status,
    round: fixture.intRound || null,
    homeScore,
    awayScore,
    venue: fixture.strVenue || null,
  }
}

export function validateFixture(fixture: NormalizedFixture): boolean {
  return !!(
    fixture.externalId &&
    fixture.homeTeamName &&
    fixture.awayTeamName &&
    fixture.startTime &&
    fixture.homeTeamId &&
    fixture.awayTeamId
  )
}
