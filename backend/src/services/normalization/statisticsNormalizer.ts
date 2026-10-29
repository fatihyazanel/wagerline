export interface NormalizedStatistics {
  provider: string
  fixtureId: number
  teamId: number | null
  shotsOnGoal: number
  shotsOffGoal: number
  totalShots: number
  blockedShots: number
  shotsInsideBox: number
  shotsOutsideBox: number
  fouls: number
  cornerKicks: number
  offsides: number
  ballPossession: number
  yellowCards: number
  redCards: number
  goalkeeperSaves: number
  totalPasses: number
  accuratePasses: number
  passAccuracy: number
}

export function normalizeStatisticsFromApiFootball(fixtureId: number, teamId: number, stats: any): NormalizedStatistics {
  const passes = stats.find((s: any) => s.type === 'passes')
  const shots = stats.find((s: any) => s.type === 'shots')
  const tackles = stats.find((s: any) => s.type === 'tackles')
  const possession = stats.find((s: any) => s.type === 'possession')

  return {
    provider: 'api-football',
    fixtureId,
    teamId,
    shotsOnGoal: shots?.value?.['Shots on Goal'] ? parseInt(shots.value['Shots on Goal']) : 0,
    shotsOffGoal: shots?.value?.['Shots off Goal'] ? parseInt(shots.value['Shots off Goal']) : 0,
    totalShots: shots?.value?.['Total Shots'] ? parseInt(shots.value['Total Shots']) : 0,
    blockedShots: shots?.value?.['Blocked Shots'] ? parseInt(shots.value['Blocked Shots']) : 0,
    shotsInsideBox: shots?.value?.['Shots insidebox'] ? parseInt(shots.value['Shots insidebox']) : 0,
    shotsOutsideBox: shots?.value?.['Shots outsidebox'] ? parseInt(shots.value['Shots outsidebox']) : 0,
    fouls: tackles?.value?.['Fouls'] ? parseInt(tackles.value['Fouls']) : 0,
    cornerKicks: tackles?.value?.['Corner Kicks'] ? parseInt(tackles.value['Corner Kicks']) : 0,
    offsides: tackles?.value?.['Offsides'] ? parseInt(tackles.value['Offsides']) : 0,
    ballPossession: possession?.value ? parseInt(possession.value) : 0,
    yellowCards: tackles?.value?.['Yellow Cards'] ? parseInt(tackles.value['Yellow Cards']) : 0,
    redCards: tackles?.value?.['Red Cards'] ? parseInt(tackles.value['Red Cards']) : 0,
    goalkeeperSaves: stats.find((s: any) => s.type === 'goalkeeper')?.value?.['Saves'] ? parseInt(stats.find((s: any) => s.type === 'goalkeeper').value['Saves']) : 0,
    totalPasses: passes?.value?.['Total Passes'] ? parseInt(passes.value['Total Passes']) : 0,
    accuratePasses: passes?.value?.['Passes Accurate'] ? parseInt(passes.value['Passes Accurate']) : 0,
    passAccuracy: passes?.value?.['Passes %'] ? parseFloat(passes.value['Passes %']) : 0,
  }
}

export function normalizeStatisticsFromTheSportsDb(fixtureId: number, teamId: number, stats: any): NormalizedStatistics {
  return {
    provider: 'thesportsdb',
    fixtureId,
    teamId,
    shotsOnGoal: stats.intShotsOnGoal ? parseInt(stats.intShotsOnGoal) : 0,
    shotsOffGoal: 0,
    totalShots: stats.intTotalShots ? parseInt(stats.intTotalShots) : 0,
    blockedShots: 0,
    shotsInsideBox: 0,
    shotsOutsideBox: 0,
    fouls: stats.intFouls ? parseInt(stats.intFouls) : 0,
    cornerKicks: stats.intCornerKicks ? parseInt(stats.intCornerKicks) : 0,
    offsides: stats.intOffsides ? parseInt(stats.intOffsides) : 0,
    ballPossession: stats.intBallPossession ? parseInt(stats.intBallPossession) : 0,
    yellowCards: stats.intYellowCards ? parseInt(stats.intYellowCards) : 0,
    redCards: stats.intRedCards ? parseInt(stats.intRedCards) : 0,
    goalkeeperSaves: stats.intGoalkeeperSaves ? parseInt(stats.intGoalkeeperSaves) : 0,
    totalPasses: stats.intTotalPasses ? parseInt(stats.intTotalPasses) : 0,
    accuratePasses: stats.intAccuratePasses ? parseInt(stats.intAccuratePasses) : 0,
    passAccuracy: stats.intPassAccuracy ? parseInt(stats.intPassAccuracy) : 0,
  }
}

export function validateStatistics(stats: NormalizedStatistics): boolean {
  return !!(stats.fixtureId && stats.teamId && stats.totalShots >= 0)
}
