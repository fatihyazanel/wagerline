export interface NormalizedStanding {
  provider: string
  leagueId: number
  seasonId: number
  position: number
  teamId: number | null
  teamName: string
  gamesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export function normalizeStandingsFromApiFootball(league: any, standings: any[]): NormalizedStanding[] {
  return standings.map((entry: any) => ({
    provider: 'api-football',
    leagueId: league.id,
    seasonId: league.season,
    position: entry.rank,
    teamId: entry.team?.id || null,
    teamName: entry.team?.name || 'Unknown',
    gamesPlayed: entry.all?.played || 0,
    wins: entry.all?.win || 0,
    draws: entry.all?.draw || 0,
    losses: entry.all?.lose || 0,
    goalsFor: entry.all?.goals?.for || 0,
    goalsAgainst: entry.all?.goals?.against || 0,
    goalDifference: (entry.all?.goals?.for || 0) - (entry.all?.goals?.against || 0),
    points: entry.points || 0,
  }))
}

export function normalizeStandingsFromTheSportsDb(league: any, standings: any[]): NormalizedStanding[] {
  return standings.map((entry: any) => ({
    provider: 'thesportsdb',
    leagueId: league.id,
    seasonId: league.seasonId,
    position: parseInt(entry.intRank) || 0,
    teamId: entry.idTeam || null,
    teamName: entry.strTeam || 'Unknown',
    gamesPlayed: parseInt(entry.intPlayed) || 0,
    wins: parseInt(entry.intWin) || 0,
    draws: parseInt(entry.intDraw) || 0,
    losses: parseInt(entry.intLoss) || 0,
    goalsFor: parseInt(entry.intGoalsFor) || 0,
    goalsAgainst: parseInt(entry.intGoalsAgainst) || 0,
    goalDifference: (parseInt(entry.intGoalsFor) || 0) - (parseInt(entry.intGoalsAgainst) || 0),
    points: parseInt(entry.intPoints) || 0,
  }))
}

export function validateStanding(standing: NormalizedStanding): boolean {
  return !!(standing.leagueId && standing.teamId && standing.position > 0)
}
