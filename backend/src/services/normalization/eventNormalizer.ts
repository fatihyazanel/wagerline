export interface NormalizedEventIncident {
  provider: string
  externalId: string
  type: 'GOAL' | 'OWN_GOAL' | 'PENALTY' | 'MISSED_PENALTY' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR'
  playerId: number | null
  assistPlayerId: number | null
  teamId: number | null
  minute: number
  extraMinute: number | null
  detail: string | null
}

export function normalizeEventIncidentFromApiFootball(incident: any, fixtureId: number): NormalizedEventIncident {
  let type: NormalizedEventIncident['type'] = 'YELLOW_CARD'

  if (incident.type === 'Goal') {
    type = incident.detail?.includes('Own') ? 'OWN_GOAL' : 'GOAL'
  } else if (incident.type === 'Card') {
    type = incident.detail?.includes('Red') ? 'RED_CARD' : 'YELLOW_CARD'
  } else if (incident.type === 'subst') {
    type = 'SUBSTITUTION'
  } else if (incident.type === 'Var') {
    type = 'VAR'
  } else if (incident.type === 'Penalty') {
    type = incident.detail?.includes('Missed') ? 'MISSED_PENALTY' : 'PENALTY'
  }

  return {
    provider: 'api-football',
    externalId: `${fixtureId}-${incident.time?.elapsed || 0}-${type}`,
    type,
    playerId: incident.player?.id || null,
    assistPlayerId: incident.assist?.id || null,
    teamId: incident.team?.id || null,
    minute: incident.time?.elapsed || 0,
    extraMinute: incident.time?.extra || null,
    detail: incident.detail || null,
  }
}

export function normalizeEventIncidentFromTheSportsDb(incident: any, fixtureId: number): NormalizedEventIncident {
  let type: NormalizedEventIncident['type'] = 'YELLOW_CARD'

  if (incident.strEventType === 'Goal') {
    type = incident.strEventDetail?.includes('Own') ? 'OWN_GOAL' : 'GOAL'
  } else if (incident.strEventType === 'Substitution') {
    type = 'SUBSTITUTION'
  } else if (incident.strEventType === 'Card') {
    type = incident.strEventDetail?.includes('Red') ? 'RED_CARD' : 'YELLOW_CARD'
  } else if (incident.strEventType === 'Var') {
    type = 'VAR'
  }

  return {
    provider: 'thesportsdb',
    externalId: `${fixtureId}-${incident.intEventMinute || 0}-${type}`,
    type,
    playerId: incident.idPlayer || null,
    assistPlayerId: incident.idAssist || null,
    teamId: incident.idTeam || null,
    minute: incident.intEventMinute || 0,
    extraMinute: incident.intEventExtraMinute || null,
    detail: incident.strEventDetail || null,
  }
}

export function validateEventIncident(incident: NormalizedEventIncident): boolean {
  return !!(incident.externalId && incident.type && incident.minute >= 0)
}
