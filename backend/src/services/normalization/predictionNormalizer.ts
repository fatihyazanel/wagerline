export interface NormalizedPrediction {
  provider: string
  externalId: string
  fixtureId: number
  homeWinProbability: number
  drawProbability: number
  awayWinProbability: number
  expectedHomeGoals: number
  expectedAwayGoals: number
  recommendedBet: string
  confidence: number
  adviceSource: string
}

export function normalizePredictionFromApiFootball(fixtureId: number, prediction: any): NormalizedPrediction {
  return {
    provider: 'api-football',
    externalId: `api-football-${fixtureId}`,
    fixtureId,
    homeWinProbability: prediction.predictions?.win?.home ? parseFloat(prediction.predictions.win.home) : 0,
    drawProbability: prediction.predictions?.draw ? parseFloat(prediction.predictions.draw) : 0,
    awayWinProbability: prediction.predictions?.win?.away ? parseFloat(prediction.predictions.win.away) : 0,
    expectedHomeGoals: prediction.predictions?.goals?.home ? parseFloat(prediction.predictions.goals.home) : 0,
    expectedAwayGoals: prediction.predictions?.goals?.away ? parseFloat(prediction.predictions.goals.away) : 0,
    recommendedBet: prediction.predictions?.bet || 'unknown',
    confidence: prediction.predictions?.percent ? parseFloat(prediction.predictions.percent) : 0,
    adviceSource: 'api-football-external',
  }
}

export function normalizePredictionFromTheSportsDb(fixtureId: number, prediction: any): NormalizedPrediction {
  return {
    provider: 'thesportsdb',
    externalId: `thesportsdb-${fixtureId}`,
    fixtureId,
    homeWinProbability: prediction.homeProb ? parseFloat(prediction.homeProb) : 0,
    drawProbability: prediction.drawProb ? parseFloat(prediction.drawProb) : 0,
    awayWinProbability: prediction.awayProb ? parseFloat(prediction.awayProb) : 0,
    expectedHomeGoals: 0,
    expectedAwayGoals: 0,
    recommendedBet: 'unknown',
    confidence: 50,
    adviceSource: 'thesportsdb-external',
  }
}

// Poisson regression for home/away predictions
export function generatePoissonPrediction(fixtureId: number, homeTeamStats: any, awayTeamStats: any): NormalizedPrediction {
  const homeAttack = homeTeamStats?.avgGoalsFor || 1.5
  const homeDefense = homeTeamStats?.avgGoalsAgainst || 1.2
  const awayAttack = awayTeamStats?.avgGoalsFor || 1.3
  const awayDefense = awayTeamStats?.avgGoalsAgainst || 1.4

  const expectedHomeGoals = (homeAttack * awayDefense) / 1.5
  const expectedAwayGoals = (awayAttack * homeDefense) / 1.5

  // Simple probability calculation
  const homeWinProb = poissonProbability(expectedHomeGoals, expectedAwayGoals, 'home')
  const drawProb = poissonProbability(expectedHomeGoals, expectedAwayGoals, 'draw')
  const awayWinProb = poissonProbability(expectedHomeGoals, expectedAwayGoals, 'away')

  return {
    provider: 'wagerline-ml',
    externalId: `wagerline-${fixtureId}`,
    fixtureId,
    homeWinProbability: homeWinProb,
    drawProbability: drawProb,
    awayWinProbability: awayWinProb,
    expectedHomeGoals: Math.round(expectedHomeGoals * 100) / 100,
    expectedAwayGoals: Math.round(expectedAwayGoals * 100) / 100,
    recommendedBet: homeWinProb > 0.4 ? 'home' : awayWinProb > 0.4 ? 'away' : 'draw',
    confidence: Math.max(homeWinProb, drawProb, awayWinProb) * 100,
    adviceSource: 'wagerline-poisson',
  }
}

function poissonProbability(homeGoals: number, awayGoals: number, result: string): number {
  const factorial = (n: number): number => {
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  const poisson = (lambda: number, k: number): number => {
    return (Math.pow(lambda, k) * Math.pow(Math.E, -lambda)) / factorial(k)
  }

  if (result === 'home') {
    let prob = 0
    for (let i = 1; i <= 10; i++) {
      for (let j = 0; j < i; j++) {
        prob += poisson(homeGoals, i) * poisson(awayGoals, j)
      }
    }
    return Math.min(prob, 1)
  } else if (result === 'away') {
    let prob = 0
    for (let i = 0; i <= 10; i++) {
      for (let j = i + 1; j <= 10; j++) {
        prob += poisson(homeGoals, i) * poisson(awayGoals, j)
      }
    }
    return Math.min(prob, 1)
  } else {
    // draw
    let prob = 0
    for (let i = 0; i <= 10; i++) {
      prob += poisson(homeGoals, i) * poisson(awayGoals, i)
    }
    return Math.min(prob, 1)
  }
}

export function validatePrediction(pred: NormalizedPrediction): boolean {
  const total = pred.homeWinProbability + pred.drawProbability + pred.awayWinProbability
  return !!(pred.fixtureId && total > 0.5 && total <= 1.1)
}
