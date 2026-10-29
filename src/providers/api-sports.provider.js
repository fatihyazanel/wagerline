const axios = require('axios');
const BaseProvider = require('./base.provider');

class APISportsProvider extends BaseProvider {
  constructor(apiKey) {
    super({
      name: 'API-Sports',
      baseUrl: 'https://v3.football.api-sports.io',
      apiKey: apiKey,
      rateLimit: 100
    });
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-apisports-key': this.apiKey
      },
      timeout: 10000
    });
  }

  async getTeams(leagueId, season) {
    try {
      const response = await this.client.get('/teams', {
        params: { league: leagueId, season }
      });
      return response.data.response.map(item => ({
        externalId: item.team.id,
        name: item.team.name,
        logo: item.team.logo,
        country: item.team.country
      }));
    } catch (error) {
      console.error('API-Sports getTeams error:', error.message);
      return [];
    }
  }

  async getEvents(leagueId, season) {
    try {
      const response = await this.client.get('/fixtures', {
        params: { league: leagueId, season }
      });
      return response.data.response.map(fixture => ({
        externalId: fixture.fixture.id,
        status: fixture.fixture.status.short,
        startTime: fixture.fixture.date,
        homeTeamId: fixture.teams.home.id,
        awayTeamId: fixture.teams.away.id,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away
      }));
    } catch (error) {
      console.error('API-Sports getEvents error:', error.message);
      return [];
    }
  }

  async getStatistics(fixtureId) {
    try {
      const response = await this.client.get('/fixtures/statistics', {
        params: { fixture: fixtureId }
      });
      const stats = {};
      response.data.response.forEach(team => {
        team.statistics.forEach(stat => {
          if (!stats[team.team.id]) stats[team.team.id] = {};
          stats[team.team.id][stat.type] = stat.value;
        });
      });
      return stats;
    } catch (error) {
      console.error('API-Sports getStatistics error:', error.message);
      return {};
    }
  }

  async getStandings(leagueId, season) {
    try {
      const response = await this.client.get('/standings', {
        params: { league: leagueId, season }
      });
      return response.data.response[0].standings[0].map(entry => ({
        teamId: entry.team.id,
        position: entry.rank,
        played: entry.all.played,
        won: entry.all.win,
        drawn: entry.all.draw,
        lost: entry.all.lose,
        goalsFor: entry.all.goals.for,
        goalsAgainst: entry.all.goals.against,
        points: entry.points
      }));
    } catch (error) {
      console.error('API-Sports getStandings error:', error.message);
      return [];
    }
  }
}

module.exports = APISportsProvider;
