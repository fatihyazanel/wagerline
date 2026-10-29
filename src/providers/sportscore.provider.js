const axios = require('axios');
const BaseProvider = require('./base.provider');

class SportScoreProvider extends BaseProvider {
  constructor(apiKey) {
    super({
      name: 'SportScore',
      baseUrl: 'https://api.sportscoreapi.com/api/v1',
      apiKey: apiKey,
      rateLimit: 600
    });
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  async getSports() {
    try {
      const response = await this.client.get('/sports');
      return response.data.data.map(sport => ({
        externalId: sport.id,
        slug: sport.slug,
        name: sport.name
      }));
    } catch (error) {
      console.error('SportScore getSports error:', error.message);
      return [];
    }
  }

  async getCompetitions(sportId) {
    try {
      const response = await this.client.get(`/sports/${sportId}/competitions`);
      return response.data.data.map(comp => ({
        externalId: comp.id,
        sportId,
        slug: comp.slug,
        name: comp.name,
        countryId: comp.country_id
      }));
    } catch (error) {
      console.error('SportScore getCompetitions error:', error.message);
      return [];
    }
  }

  async getSeasons(competitionId) {
    try {
      const response = await this.client.get(`/competitions/${competitionId}/seasons`);
      return response.data.data.map(season => ({
        externalId: season.id,
        name: season.name,
        startDate: season.start_date,
        endDate: season.end_date,
        isCurrent: season.is_current
      }));
    } catch (error) {
      console.error('SportScore getSeasons error:', error.message);
      return [];
    }
  }

  async getTeams(sportId) {
    try {
      const response = await this.client.get(`/sports/${sportId}/teams`);
      return response.data.data.map(team => ({
        externalId: team.id,
        sportId,
        slug: team.slug,
        name: team.name,
        logo: team.logo_url,
        countryId: team.country_id
      }));
    } catch (error) {
      console.error('SportScore getTeams error:', error.message);
      return [];
    }
  }

  async getEvents(sportId, competitionId, date) {
    try {
      const params = {};
      if (date) params.date = date;
      const response = await this.client.get(
        `/competitions/${competitionId}/matches`,
        { params }
      );
      return response.data.data.map(event => ({
        externalId: event.id,
        sportId,
        competitionId,
        status: event.status,
        startTime: event.start_time,
        eventType: 'match'
      }));
    } catch (error) {
      console.error('SportScore getEvents error:', error.message);
      return [];
    }
  }

  async getLiveEvents() {
    try {
      const response = await this.client.get('/matches/live');
      return response.data.data.map(event => ({
        externalId: event.id,
        status: 'live',
        startTime: event.start_time
      }));
    } catch (error) {
      console.error('SportScore getLiveEvents error:', error.message);
      return [];
    }
  }

  async getStatistics(eventId) {
    try {
      const response = await this.client.get(`/matches/${eventId}/statistics`);
      return response.data.data;
    } catch (error) {
      console.error('SportScore getStatistics error:', error.message);
      return {};
    }
  }
}

module.exports = SportScoreProvider;
