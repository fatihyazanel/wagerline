export interface SportsDataProvider {
  getLeagues(): Promise<any[]>;

  getTeams(
    leagueId: number,
    season: number
  ): Promise<any[]>;

  getPlayers(
    teamId: number,
    season: number
  ): Promise<any[]>;

  getFixtures(
    leagueId: number,
    season: number
  ): Promise<any[]>;

  getFixture(
    fixtureId: number
  ): Promise<any>;

  getFixtureEvents(
    fixtureId: number
  ): Promise<any[]>;

  getFixtureStatistics(
    fixtureId: number
  ): Promise<any>;

  getFixturePlayers(
    fixtureId: number
  ): Promise<any>;

  getStandings(
    leagueId: number,
    season: number
  ): Promise<any>;

  getInjuries(
    leagueId: number,
    season: number
  ): Promise<any>;

  getOdds(
    fixtureId: number
  ): Promise<any>;

  getLiveOdds(
    fixtureId: number
  ): Promise<any>;

  getPrediction(
    fixtureId: number
  ): Promise<any>;

  getHeadToHead(
    teamA: number,
    teamB: number
  ): Promise<any>;

  getLiveFixtures(): Promise<any[]>;
}
