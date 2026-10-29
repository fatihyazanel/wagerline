const axios = require('axios');
const BaseProvider = require('./base.provider');

class TheSportsDBProvider extends BaseProvider {
  constructor(apiKey) {
    super({
      name: 'TheSportsDB',
      baseUrl: 'https://www.thesportsdb.com/api/v1/json',
      apiKey: apiKey,
      rateLimit: 200
    });
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000
    });
  }

  async getSports() {
    try {
      const response = await this.client.get(`/${this.apiKey}/eventslast.php`);
      const sports = {};
      response.data.results.forEach(event => {
        if (event.strSport && !sports[event.strSport]) {
          sports[event.strSport] = {
            name: event.strSport,
            slug: event.strSport.toLowerCase().replace(/\s+/g, '-')
          };
        }
      });
      return Object.values(sports);
    } catch (error) {
      console.error('TheSportsDB getSports error:', error.message);
      return [];
    }
  }

  async getTeams(sportId, competitionId) {
    try {
      const response = await this.client.get(
        `/${this.apiKey}/eventslast.php?id=${competitionId}`
      );
      const teams = {};
      response.data.results.forEach(event => {
        if (event.idHomeTeam && !teams[event.idHomeTeam]) {
          teams[event.idHomeTeam] = {
            externalId: event.idHomeTeam,
            name: event.strHomeTeam,
            logo: event.strHomeTeamBadge
          };
        }
        if (event.idAwayTeam && !teams[event.idAwayTeam]) {
          teams[event.idAwayTeam] = {
            externalId: event.idAwayTeam,
            name: event.strAwayTeam,
            logo: event.strAwayTeamBadge
          };
        }
      });
      return Object.values(teams);
    } catch (error) {
      console.error('TheSportsDB getTeams error:', error.message);
      return [];
    }
  }

  async getEvents(competitionId) {
    try {
      const response = await this.client.get(
        `/${this.apiKey}/eventslast.php?id=${competitionId}`
      );
      return (response.data.results || []).map(event => ({
        externalId: event.idEvent,
        competitionId,
        status: this.mapStatus(event.strStatus),
        startTime: event.dateEvent,
        homeTeamId: event.idHomeTeam,
        awayTeamId: event.idAwayTeam,
        homeScore: event.intHomeScore,
        awayScore: event.intAwayScore
      }));
    } catch (error) {
      console.error('TheSportsDB getEvents error:', error.message);
      return [];
    }
  }

  mapStatus(status) {
    const statusMap = {
      'Match Finished': 'finished',
      'Not Started': 'scheduled',
      '1st Half': 'live',
      '2nd Half': 'live'
    };
    return statusMap[status] || 'scheduled';
  }
}

module.exports = TheSportsDBProvider;
