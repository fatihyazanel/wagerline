export interface NormalizedTeam {
  provider: string
  externalId: string | number
  name: string
  slug: string
  logo: string | null
  country: string | null
  founded: number | null
  venue: string | null
}

export function normalizeTeamFromApiFootball(team: any): NormalizedTeam {
  return {
    provider: 'api-football',
    externalId: team.id,
    name: team.name,
    slug: team.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    logo: team.logo || null,
    country: team.country || null,
    founded: team.founded || null,
    venue: team.venue?.name || null,
  }
}

export function normalizeTeamFromTheSportsDb(team: any): NormalizedTeam {
  return {
    provider: 'thesportsdb',
    externalId: team.idTeam || team.id,
    name: team.strTeam || team.name,
    slug: (team.strTeam || team.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    logo: team.strTeamBadge || team.logo || null,
    country: team.strCountry || null,
    founded: team.intFormedYear ? parseInt(team.intFormedYear) : null,
    venue: team.strStadium || null,
  }
}

export function validateTeam(team: NormalizedTeam): boolean {
  return !!(team.externalId && team.name && team.slug)
}
