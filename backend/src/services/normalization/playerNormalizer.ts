export interface NormalizedPlayer {
  provider: string
  externalId: string | number
  name: string
  slug: string
  position: string | null
  height: number | null
  weight: number | null
  dateOfBirth: string | null
  nationality: string | null
  number: number | null
  marketValue: string | null
}

export function normalizePlayerFromApiFootball(player: any): NormalizedPlayer {
  return {
    provider: 'api-football',
    externalId: player.id,
    name: player.player?.name || player.name,
    slug: (player.player?.name || player.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    position: player.player?.position || null,
    height: player.player?.height ? parseInt(player.player.height) : null,
    weight: player.player?.weight ? parseInt(player.player.weight) : null,
    dateOfBirth: player.player?.birth?.date || null,
    nationality: player.player?.nationality || null,
    number: player.number || null,
    marketValue: player.player?.value || null,
  }
}

export function normalizePlayerFromTheSportsDb(player: any): NormalizedPlayer {
  return {
    provider: 'thesportsdb',
    externalId: player.idPlayer || player.id,
    name: player.strPlayer || player.name,
    slug: (player.strPlayer || player.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    position: player.strPosition || null,
    height: player.intHeight ? parseInt(player.intHeight) : null,
    weight: player.intWeight ? parseInt(player.intWeight) : null,
    dateOfBirth: player.dateBorn || null,
    nationality: player.strNationality || null,
    number: player.intNumber || null,
    marketValue: null,
  }
}

export function validatePlayer(player: NormalizedPlayer): boolean {
  return !!(player.externalId && player.name && player.slug)
}
