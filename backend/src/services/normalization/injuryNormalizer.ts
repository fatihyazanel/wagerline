export interface NormalizedInjury {
  provider: string
  externalId: string
  playerId: number
  teamId: number
  type: string
  reason: string
  startDate: string
  endDate: string | null
  status: 'active' | 'recovered'
}

export function normalizeInjuryFromApiFootball(injury: any): NormalizedInjury {
  const today = new Date().toISOString().split('T')[0]
  const endDate = injury.player?.injured ? null : today

  return {
    provider: 'api-football',
    externalId: `${injury.player?.id}-${injury.fixture?.id}`,
    playerId: injury.player?.id || 0,
    teamId: injury.team?.id || 0,
    type: injury.type || 'injury',
    reason: injury.reason || 'unknown',
    startDate: today,
    endDate,
    status: injury.player?.injured ? 'active' : 'recovered',
  }
}

export function normalizeInjuryFromTheSportsDb(injury: any): NormalizedInjury {
  const today = new Date().toISOString().split('T')[0]

  return {
    provider: 'thesportsdb',
    externalId: `${injury.idPlayer}-${injury.idTeam}`,
    playerId: injury.idPlayer || 0,
    teamId: injury.idTeam || 0,
    type: injury.strType || 'injury',
    reason: injury.strReason || 'unknown',
    startDate: injury.strDate || today,
    endDate: injury.strDateEnd || null,
    status: injury.strDateEnd ? 'recovered' : 'active',
  }
}

export function validateInjury(injury: NormalizedInjury): boolean {
  return !!(injury.playerId && injury.teamId && injury.startDate)
}
