const SportScoreProvider = require('./sportscore.provider');
const TheSportsDBProvider = require('./thesportsdb.provider');
const APISportsProvider = require('./api-sports.provider');

class ProviderManager {
  constructor(config = {}) {
    this.providers = [];
    this.providerPriority = config.providerPriority || {
      football: ['sportscore', 'api-sports', 'thesportsdb'],
      basketball: ['api-sports', 'sportscore'],
      'american-football': ['api-sports', 'sportscore'],
      'ice-hockey': ['api-sports', 'sportscore'],
      'formula-1': ['sportscore']
    };

    if (config.sportscoreKey) {
      this.providers.push(new SportScoreProvider(config.sportscoreKey));
    }
    if (config.thesportsdbKey) {
      this.providers.push(new TheSportsDBProvider(config.thesportsdbKey));
    }
    if (config.apisportsKey) {
      this.providers.push(new APISportsProvider(config.apisportsKey));
    }
  }

  getProvidersByPriority(sport) {
    const priority = this.providerPriority[sport] || [];
    return priority
      .map(name => this.providers.find(p => p.name.toLowerCase().includes(name)))
      .filter(p => p);
  }

  async executeWithFallback(method, args, sport = 'football') {
    const providers = this.getProvidersByPriority(sport);
    const errors = [];

    for (const provider of providers) {
      try {
        if (typeof provider[method] !== 'function') {
          errors.push(`${provider.name} does not support ${method}`);
          continue;
        }
        const result = await provider[method](...args);
        return { data: result, source: provider.name };
      } catch (error) {
        errors.push(`${provider.name}: ${error.message}`);
        console.error(`Provider ${provider.name} failed:`, error.message);
      }
    }

    console.error(`All providers failed for ${method}:`, errors);
    return { data: null, source: null, errors };
  }

  async getTeams(sportId, filters = {}) {
    const sport = filters.sport || 'football';
    return this.executeWithFallback('getTeams', [sportId], sport);
  }

  async getEvents(competitionId, filters = {}) {
    const sport = filters.sport || 'football';
    return this.executeWithFallback('getEvents', [competitionId, filters.season], sport);
  }

  async getStandings(competitionId, filters = {}) {
    const sport = filters.sport || 'football';
    return this.executeWithFallback('getStandings', [competitionId, filters.season], sport);
  }

  async getStatistics(eventId, filters = {}) {
    const sport = filters.sport || 'football';
    return this.executeWithFallback('getStatistics', [eventId], sport);
  }

  async getLiveEvents(filters = {}) {
    const sport = filters.sport || 'football';
    return this.executeWithFallback('getLiveEvents', [], sport);
  }
}

module.exports = ProviderManager;
