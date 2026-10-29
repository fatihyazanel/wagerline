class BaseProvider {
  constructor(config) {
    this.name = config.name;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.rateLimit = config.rateLimit || 100;
    this.retryAttempts = 3;
  }

  async getSports() {
    throw new Error('Not implemented');
  }

  async getCompetitions(sportId) {
    throw new Error('Not implemented');
  }

  async getSeasons(competitionId) {
    throw new Error('Not implemented');
  }

  async getTeams(sportId) {
    throw new Error('Not implemented');
  }

  async getPlayers(teamId) {
    throw new Error('Not implemented');
  }

  async getEvents(sportId, competitionId, date) {
    throw new Error('Not implemented');
  }

  async getEvent(eventId) {
    throw new Error('Not implemented');
  }

  async getLiveEvents() {
    throw new Error('Not implemented');
  }

  async getStandings(competitionId, seasonId) {
    throw new Error('Not implemented');
  }

  async getStatistics(eventId) {
    throw new Error('Not implemented');
  }

  async getNews() {
    throw new Error('Not implemented');
  }

  async getDrivers() {
    throw new Error('Not implemented');
  }

  async getRaces(seasonId) {
    throw new Error('Not implemented');
  }
}

module.exports = BaseProvider;
