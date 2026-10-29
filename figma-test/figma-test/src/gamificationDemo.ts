export const periodOptions = ['Temmuz 2026', 'Haziran 2026', 'Yilbasindan beri', 'Son 12 ay']
export const activeProducts = ['Fiber', 'Superbox', 'AKG Ciro', 'Aksesuar Ciro', 'Rekontratlama', 'Smartphone']

export const scoringWeights = {
  strategic: 70,
  segmentation: 30,
  hgo: 0,
  growth: 0,
}

export const adminBonusConfig = {
  badgeBonus: 10,
  streakBonus: 20,
  challengeBonus: 8,
  topN: 5,
}

export const productWeights = [
  { name: 'Fiber', unit: 'adet', weight: 28, score: 92, rank: 2, topN: 5, badge: true, streak: true },
  { name: 'Smartphone', unit: 'adet', weight: 18, score: 84, rank: 4, topN: 5, badge: true, streak: false },
  { name: 'Superbox', unit: 'adet', weight: 16, score: 76, rank: 7, topN: 5, badge: false, streak: false },
  { name: 'AKG Ciro', unit: 'TL', weight: 14, score: 81, rank: 5, topN: 5, badge: true, streak: true },
  { name: 'Aksesuar Ciro', unit: 'TL', weight: 12, score: 68, rank: 11, topN: 5, badge: false, streak: false },
  { name: 'Rekontratlama', unit: 'adet', weight: 12, score: 73, rank: 8, topN: 5, badge: false, streak: false },
]

export const bonusRules = [
  { rank: '1. sira', bonus: '+10%', note: 'Rozet puani odul artisi' },
  { rank: '2. sira', bonus: '+7%', note: 'Admin belirler' },
  { rank: '3. sira', bonus: '+5%', note: 'Admin belirler' },
  { rank: 'Streak', bonus: '+20%', note: 'Iki ay ust uste ilk n' },
  { rank: 'Challenge', bonus: '+8%', note: 'Kabul edilen challenge kazanilirsa' },
]

export const dealerScore = {
  total: 93.2,
  league: 'Platin Lig',
  rank: 4,
  totalDealers: 176,
  monthlyProductionBase: 8420,
  segmentation: 86.3,
  strategic: 96.2,
  hgo: 0,
  growth: 0,
  badgeMultiplier: 1.32,
  activeBadges: 6,
  challengeProgress: 62,
}

export const leagueBaseStats = {
  min: 6800,
  avg: 8120,
  max: 9740,
  mine: dealerScore.monthlyProductionBase,
}

export const scoreContributions = [
  {
    metric: 'Stratejik Urunler',
    raw: 80.5,
    afterBonus: 96.2,
    weight: 70,
    contribution: 67.3,
    details: [
      { label: 'Normalize alt metrik toplam', value: '80.5' },
      { label: 'Rozet bonusu', value: '+%10' },
      { label: 'Streak bonusu', value: '+%20' },
      { label: 'Challenge bonusu', value: '+%8' },
    ],
  },
  {
    metric: 'Segmentasyon',
    raw: 86.3,
    afterBonus: 86.3,
    weight: 30,
    contribution: 25.9,
    details: [
      { label: 'Dealer score normalize', value: '86.3' },
      { label: 'Rozet bonusu', value: '+%0' },
      { label: 'Streak bonusu', value: '+%0' },
      { label: 'Challenge bonusu', value: '+%0' },
    ],
  },
  { metric: 'HGO', raw: 0, afterBonus: 0, weight: 0, contribution: 0, details: [{ label: 'Faz 1', value: 'Gorunur, etkisiz' }] },
  { metric: 'Buyume', raw: 0, afterBonus: 0, weight: 0, contribution: 0, details: [{ label: 'Faz 1', value: 'Gorunur, etkisiz' }] },
]

export const maskedRanks = [
  { rank: 1, dealer: 'Bayi P-014', region: 'Marmara', score: 94.8, diff: '+6.1' },
  { rank: 2, dealer: 'Bayi P-088', region: 'Ege', score: 92.1, diff: '+3.4' },
  { rank: 3, dealer: 'Bayi P-031', region: 'Marmara', score: 90.2, diff: '+1.5' },
  { rank: 4, dealer: 'Sen', region: 'Marmara', score: 93.2, diff: '0.0' },
  { rank: 5, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 87.9, diff: '-0.8' },
  { rank: 6, dealer: 'Bayi P-066', region: 'Karadeniz', score: 86.5, diff: '-2.2' },
  { rank: 7, dealer: 'Bayi P-102', region: 'Akdeniz', score: 85.8, diff: '-2.9' },
]

export type RankMetricKey =
  | 'total'
  | 'strategic'
  | 'segmentation'
  | 'fiber'
  | 'superbox'
  | 'akg'
  | 'accessory'
  | 'recontract'
  | 'smartphone'

export const rankMetricOptions: { key: RankMetricKey; label: string }[] = [
  { key: 'total', label: 'Total Gamification' },
  { key: 'strategic', label: 'Stratejik Urun' },
  { key: 'segmentation', label: 'Segmentasyon' },
  { key: 'fiber', label: 'Fiber Rozeti' },
  { key: 'superbox', label: 'Superbox Rozeti' },
  { key: 'akg', label: 'AKG Ciro Rozeti' },
  { key: 'accessory', label: 'Aksesuar Ciro Rozeti' },
  { key: 'recontract', label: 'Rekontratlama Rozeti' },
  { key: 'smartphone', label: 'Smartphone Rozeti' },
]

export const rankingBoards: Record<RankMetricKey, typeof maskedRanks> = {
  total: maskedRanks,
  strategic: [
    { rank: 4, dealer: 'Sen', region: 'Marmara', score: 96.2, diff: '0.0' },
    { rank: 6, dealer: 'Bayi P-014', region: 'Marmara', score: 92.6, diff: '+7.8' },
    { rank: 7, dealer: 'Bayi P-088', region: 'Ege', score: 89.4, diff: '+4.6' },
    { rank: 8, dealer: 'Bayi P-031', region: 'Marmara', score: 86.1, diff: '+1.3' },
    { rank: 10, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 83.9, diff: '-0.9' },
    { rank: 11, dealer: 'Bayi P-066', region: 'Karadeniz', score: 82.2, diff: '-2.6' },
    { rank: 12, dealer: 'Bayi P-102', region: 'Akdeniz', score: 80.7, diff: '-4.1' },
  ],
  segmentation: [
    { rank: 2, dealer: 'Bayi P-031', region: 'Marmara', score: 91.2, diff: '+4.9' },
    { rank: 3, dealer: 'Bayi P-088', region: 'Ege', score: 89.1, diff: '+2.8' },
    { rank: 4, dealer: 'Bayi P-014', region: 'Marmara', score: 87.0, diff: '+0.7' },
    { rank: 5, dealer: 'Sen', region: 'Marmara', score: 86.3, diff: '0.0' },
    { rank: 6, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 84.5, diff: '-1.8' },
    { rank: 7, dealer: 'Bayi P-066', region: 'Karadeniz', score: 82.4, diff: '-3.9' },
    { rank: 8, dealer: 'Bayi P-102', region: 'Akdeniz', score: 81.0, diff: '-5.3' },
  ],
  fiber: [
    { rank: 1, dealer: 'Bayi P-014', region: 'Marmara', score: 118.2, diff: '+9.8' },
    { rank: 2, dealer: 'Sen', region: 'Marmara', score: 121.4, diff: '0.0' },
    { rank: 3, dealer: 'Bayi P-088', region: 'Ege', score: 103.6, diff: '-4.8' },
    { rank: 4, dealer: 'Bayi P-031', region: 'Marmara', score: 97.2, diff: '-11.2' },
    { rank: 5, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 94.8, diff: '-13.6' },
  ],
  superbox: [
    { rank: 5, dealer: 'Bayi P-088', region: 'Ege', score: 88.5, diff: '+12.3' },
    { rank: 6, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 84.4, diff: '+8.2' },
    { rank: 7, dealer: 'Sen', region: 'Marmara', score: 76.2, diff: '0.0' },
    { rank: 8, dealer: 'Bayi P-066', region: 'Karadeniz', score: 75.1, diff: '-1.1' },
    { rank: 9, dealer: 'Bayi P-102', region: 'Akdeniz', score: 72.6, diff: '-3.6' },
  ],
  akg: [
    { rank: 3, dealer: 'Bayi P-031', region: 'Marmara', score: 102.4, diff: '+7.6' },
    { rank: 4, dealer: 'Bayi P-014', region: 'Marmara', score: 99.8, diff: '+5.0' },
    { rank: 5, dealer: 'Sen', region: 'Marmara', score: 106.9, diff: '0.0' },
    { rank: 6, dealer: 'Bayi P-066', region: 'Karadeniz', score: 90.2, diff: '-4.6' },
  ],
  accessory: [
    { rank: 1, dealer: 'Bayi P-102', region: 'Akdeniz', score: 98.2, diff: '+30.2' },
    { rank: 2, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 93.4, diff: '+25.4' },
    { rank: 55, dealer: 'Sen', region: 'Marmara', score: 68.0, diff: '0.0' },
    { rank: 56, dealer: 'Bayi P-066', region: 'Karadeniz', score: 65.9, diff: '-2.1' },
  ],
  recontract: [
    { rank: 6, dealer: 'Bayi P-088', region: 'Ege', score: 83.2, diff: '+10.2' },
    { rank: 7, dealer: 'Bayi P-031', region: 'Marmara', score: 78.1, diff: '+5.1' },
    { rank: 8, dealer: 'Sen', region: 'Marmara', score: 73.0, diff: '0.0' },
    { rank: 9, dealer: 'Bayi P-014', region: 'Marmara', score: 71.8, diff: '-1.2' },
  ],
  smartphone: [
    { rank: 2, dealer: 'Bayi P-031', region: 'Marmara', score: 97.6, diff: '+8.2' },
    { rank: 3, dealer: 'Bayi P-120', region: 'Ic Anadolu', score: 91.0, diff: '+1.6' },
    { rank: 4, dealer: 'Sen', region: 'Marmara', score: 99.8, diff: '0.0' },
    { rank: 5, dealer: 'Bayi P-066', region: 'Karadeniz', score: 86.1, diff: '-3.3' },
  ],
}

export const strategicProductScores = [
  { name: 'Fiber', normalized: 92, badgeBonus: 10, streakBonus: 20, challengeBonus: 0, final: 121.4, weight: 28, contribution: 34.0, rank: 2, monthlyChange: '+18%' },
  { name: 'Smartphone', normalized: 84, badgeBonus: 10, streakBonus: 0, challengeBonus: 8, final: 99.8, weight: 18, contribution: 18.0, rank: 4, monthlyChange: '+9%' },
  { name: 'Superbox', normalized: 76, badgeBonus: 0, streakBonus: 0, challengeBonus: 0, final: 76.0, weight: 16, contribution: 12.2, rank: 7, monthlyChange: '-6%' },
  { name: 'AKG Ciro', normalized: 81, badgeBonus: 10, streakBonus: 20, challengeBonus: 0, final: 106.9, weight: 14, contribution: 15.0, rank: 5, monthlyChange: '+14%' },
  { name: 'Aksesuar Ciro', normalized: 68, badgeBonus: 0, streakBonus: 0, challengeBonus: 0, final: 68.0, weight: 12, contribution: 8.2, rank: 11, monthlyChange: '-11%' },
  { name: 'Rekontratlama', normalized: 73, badgeBonus: 0, streakBonus: 0, challengeBonus: 0, final: 73.0, weight: 12, contribution: 8.8, rank: 8, monthlyChange: '+3%' },
]

export const strategicContributionTotal = 96.2

export const badges = [
  { name: 'Fiber Yildizi', metric: 'Fiber', rank: '2/176', score: 92, prev: '4/180', gap: 'Rozet alindi', state: 'won' },
  { name: 'Smartphone Avcisi', metric: 'Smartphone', rank: '4/176', score: 84, prev: '9/180', gap: 'Rozet alindi', state: 'won' },
  { name: 'Segmentasyon Ustasi', metric: 'Dealer score', rank: '6/176', score: 86.3, prev: '8/180', gap: '1.8 puan', state: 'near' },
  { name: 'AKG Lideri', metric: 'AKG Ciro', rank: '5/176', score: 81, prev: '5/180', gap: 'Streak aktif', state: 'won' },
  { name: 'HGO Rozeti', metric: 'HGO', rank: 'Faz 1', score: 0, prev: '-', gap: 'Agirlik 0', state: 'locked' },
  { name: 'Buyume Rozeti', metric: 'Buyume', rank: 'Faz 1', score: 0, prev: '-', gap: 'Agirlik 0', state: 'locked' },
]

export const badgeHistory = [
  { name: 'Fiber Yildizi', count: 4, months: 'Mar, Nis, Haz, Tem', currentRank: '2/176', normalized: 92, previous: '4/180', state: 'won' },
  { name: 'Smartphone Avcisi', count: 2, months: 'Haz, Tem', currentRank: '4/176', normalized: 84, previous: '9/180', state: 'won' },
  { name: 'AKG Lideri', count: 3, months: 'Nis, Haz, Tem', currentRank: '5/176', normalized: 81, previous: '5/180', state: 'won' },
  { name: 'Segmentasyon Ustasi', count: 1, months: 'May', currentRank: '6/176', normalized: 86.3, previous: '8/180', state: 'near' },
  { name: 'Superbox Atagi', count: 0, months: '-', currentRank: '7/176', normalized: 76, previous: '11/180', state: 'near' },
]

export const overviewLeaders = [
  { title: 'Son 2 ay rozet lideri', dealer: 'Bayi E-044', value: '11 rozet', region: 'Ege' },
  { title: 'En hizli yukselen', dealer: 'Bayi M-219', value: '+38 sira', region: 'Marmara' },
  { title: 'Challenge sampiyonu', dealer: 'Bayi G-017', value: '4/4 galibiyet', region: 'Guneydogu' },
]

export const leagueHighlights = [
  { league: 'Elmas', icon: 'gem', topBadgeDealer: 'Bayi E-044', region: 'Ege', badges: 6, avg: 91.4, topScore: 108.2 },
  { league: 'Platin', icon: 'star', topBadgeDealer: 'Bayi M-219', region: 'Marmara', badges: 5, avg: 84.7, topScore: 101.6 },
  { league: 'Altin', icon: 'award', topBadgeDealer: 'Bayi A-118', region: 'Akdeniz', badges: 5, avg: 78.2, topScore: 96.4 },
  { league: 'Gumus', icon: 'medal', topBadgeDealer: 'Bayi K-052', region: 'Karadeniz', badges: 4, avg: 70.9, topScore: 88.1 },
  { league: 'Bronz', icon: 'shield', topBadgeDealer: 'Bayi I-087', region: 'Ic Anadolu', badges: 3, avg: 63.4, topScore: 80.7 },
]

export const topThirtyLeaders = Array.from({ length: 30 }, (_, index) => ({
  rank: index + 1,
  dealer: `Bayi ${String(index + 101).padStart(3, '0')}`,
  league: ['Elmas', 'Platin', 'Altin', 'Gumus', 'Bronz'][index % 5],
  region: ['Marmara', 'Ege', 'Akdeniz', 'Karadeniz', 'Ic Anadolu'][index % 5],
  badges: 6 - (index % 4),
  total: Number((101.8 - index * 0.9).toFixed(1)),
}))

export const regionalMetricSummary = {
  total: [
    { region: 'Marmara', gamification: 84.7, strategic: 86.1, segmentation: 82.4, challengeWins: 38, challengeJoins: 74, topChallengeProduct: 'Smartphone' },
    { region: 'Ege', gamification: 86.9, strategic: 88.2, segmentation: 84.1, challengeWins: 42, challengeJoins: 79, topChallengeProduct: 'Fiber' },
    { region: 'Akdeniz', gamification: 78.2, strategic: 76.8, segmentation: 81.3, challengeWins: 26, challengeJoins: 58, topChallengeProduct: 'Superbox' },
    { region: 'Karadeniz', gamification: 74.5, strategic: 72.2, segmentation: 79.5, challengeWins: 21, challengeJoins: 46, topChallengeProduct: 'Rekontratlama' },
  ],
  fiber: [
    { region: 'Ege', gamification: 88.4, strategic: 91.5, segmentation: 83.2, challengeWins: 31, challengeJoins: 62, topChallengeProduct: 'Fiber' },
    { region: 'Marmara', gamification: 85.2, strategic: 89.1, segmentation: 82.1, challengeWins: 29, challengeJoins: 56, topChallengeProduct: 'Fiber' },
    { region: 'Akdeniz', gamification: 76.0, strategic: 73.8, segmentation: 80.4, challengeWins: 18, challengeJoins: 39, topChallengeProduct: 'Fiber' },
    { region: 'Karadeniz', gamification: 72.8, strategic: 70.6, segmentation: 78.2, challengeWins: 16, challengeJoins: 35, topChallengeProduct: 'Fiber' },
  ],
  smartphone: [
    { region: 'Marmara', gamification: 86.1, strategic: 90.4, segmentation: 81.6, challengeWins: 36, challengeJoins: 68, topChallengeProduct: 'Smartphone' },
    { region: 'Ic Anadolu', gamification: 81.4, strategic: 84.3, segmentation: 78.9, challengeWins: 24, challengeJoins: 51, topChallengeProduct: 'Smartphone' },
    { region: 'Ege', gamification: 80.9, strategic: 83.1, segmentation: 79.7, challengeWins: 22, challengeJoins: 47, topChallengeProduct: 'Smartphone' },
    { region: 'Akdeniz', gamification: 75.2, strategic: 76.8, segmentation: 74.9, challengeWins: 19, challengeJoins: 43, topChallengeProduct: 'Smartphone' },
  ],
}

export const periodScenario = {
  current: {
    label: 'Bu ay',
    activeDealers: 860,
    hottestChallengeProduct: 'Smartphone',
    fastestProduct: 'Fiber',
    fastestChange: '+18%',
    leaderShift: 0,
  },
  previous: {
    label: 'Onceki ay',
    activeDealers: 842,
    hottestChallengeProduct: 'Fiber',
    fastestProduct: 'AKG Ciro',
    fastestChange: '+14%',
    leaderShift: 1,
  },
  ytd: {
    label: 'Yilbasindan beri',
    activeDealers: 884,
    hottestChallengeProduct: 'Rekontratlama',
    fastestProduct: 'Smartphone',
    fastestChange: '+31%',
    leaderShift: 2,
  },
}

export type PeriodKey = keyof typeof periodScenario

export const csmDealerOptions = [
  {
    id: 'mk',
    name: 'Mehmet Kaya',
    location: 'Besiktas',
    initials: 'MK',
    league: 'Platin',
    total: 88.7,
    rank: '4/176',
    strategic: 84.8,
    segmentation: 86.3,
    products: [
      { name: 'Fiber', score: 108.4, rank: '2/176', previous: '4/180' },
      { name: 'Smartphone', score: 89.4, rank: '4/176', previous: '9/180' },
      { name: 'Aksesuar Ciro', score: 68.0, rank: '11/176', previous: '8/180' },
    ],
  },
  {
    id: 'at',
    name: 'Ayse Tunc',
    location: 'Kadikoy',
    initials: 'AT',
    league: 'Elmas',
    total: 94.2,
    rank: '2/152',
    strategic: 98.1,
    segmentation: 88.4,
    products: [
      { name: 'Fiber', score: 96.2, rank: '5/152', previous: '7/150' },
      { name: 'Smartphone', score: 112.6, rank: '1/152', previous: '3/150' },
      { name: 'Superbox', score: 82.1, rank: '9/152', previous: '11/150' },
    ],
  },
  {
    id: 'cd',
    name: 'Can Demir',
    location: 'Maltepe',
    initials: 'CD',
    league: 'Gumus',
    total: 61.8,
    rank: '58/204',
    strategic: 55.2,
    segmentation: 72.1,
    products: [
      { name: 'Fiber', score: 44.5, rank: '79/204', previous: '63/206' },
      { name: 'Rekontratlama', score: 66.2, rank: '41/204', previous: '38/206' },
      { name: 'Aksesuar Ciro', score: 51.9, rank: '70/204', previous: '74/206' },
    ],
  },
]

export const firmDealerRows = [
  {
    id: 'b3234',
    code: 'Bayi-3234',
    city: 'Bursa',
    region: 'Guney Marmara',
    league: 'Platin',
    total: 93.2,
    strategic: 96.2,
    segmentation: 86.3,
    rank: '4/176',
    products: [
      { name: 'Fiber', score: 121.4, rank: '2/176', unit: 'adet', value: 42 },
      { name: 'Smartphone', score: 99.8, rank: '4/176', unit: 'adet', value: 31 },
      { name: 'AKG Ciro', score: 106.9, rank: '5/176', unit: 'TL', value: 1420000 },
      { name: 'Aksesuar Ciro', score: 68.0, rank: '11/176', unit: 'TL', value: 410000 },
    ],
  },
  {
    id: 'b4491',
    code: 'Bayi-4491',
    city: 'Izmir',
    region: 'Ege',
    league: 'Elmas',
    total: 96.8,
    strategic: 101.4,
    segmentation: 88.1,
    rank: '2/152',
    products: [
      { name: 'Fiber', score: 94.2, rank: '6/152', unit: 'adet', value: 38 },
      { name: 'Smartphone', score: 116.3, rank: '1/152', unit: 'adet', value: 47 },
      { name: 'Superbox', score: 83.4, rank: '8/152', unit: 'adet', value: 24 },
      { name: 'AKG Ciro', score: 110.8, rank: '3/152', unit: 'TL', value: 1680000 },
    ],
  },
  {
    id: 'b7810',
    code: 'Bayi-7810',
    city: 'Ankara',
    region: 'Ic Anadolu',
    league: 'Altin',
    total: 79.4,
    strategic: 77.2,
    segmentation: 84.5,
    rank: '18/190',
    products: [
      { name: 'Fiber', score: 72.4, rank: '24/190', unit: 'adet', value: 21 },
      { name: 'Rekontratlama', score: 88.1, rank: '7/190', unit: 'adet', value: 118 },
      { name: 'Aksesuar Ciro', score: 64.5, rank: '31/190', unit: 'TL', value: 290000 },
    ],
  },
  {
    id: 'b9055',
    code: 'Bayi-9055',
    city: 'Antalya',
    region: 'Akdeniz',
    league: 'Gumus',
    total: 66.7,
    strategic: 58.8,
    segmentation: 76.2,
    rank: '63/204',
    products: [
      { name: 'Fiber', score: 49.8, rank: '88/204', unit: 'adet', value: 13 },
      { name: 'Superbox', score: 70.4, rank: '33/204', unit: 'adet', value: 19 },
      { name: 'AKG Ciro', score: 55.1, rank: '79/204', unit: 'TL', value: 210000 },
    ],
  },
]

export const csmTeamRows = [
  { initials: 'SY', name: 'Selin Yildiz', loc: 'Ist. Anadolu', dealers: 18, total: 81.4, strategic: 83.2, segmentation: 79.6, challenge: '14/18', trend: '+4.2%', risk: false },
  { initials: 'AD', name: 'Ali Demir', loc: 'Ist. Avrupa-1', dealers: 22, total: 84.8, strategic: 86.1, segmentation: 82.7, challenge: '19/22', trend: '+5.8%', risk: false },
  { initials: 'MA', name: 'Murat Aslan', loc: 'Ist. Avrupa-2', dealers: 20, total: 76.9, strategic: 73.4, segmentation: 80.1, challenge: '15/20', trend: '+0.4%', risk: false },
  { initials: 'BS', name: 'Burcu Sahin', loc: 'Kocaeli', dealers: 16, total: 74.8, strategic: 72.5, segmentation: 78.0, challenge: '14/16', trend: '+2.1%', risk: false },
  { initials: 'TE', name: 'Tolga Erim', loc: 'Bursa', dealers: 18, total: 64.2, strategic: 58.9, segmentation: 69.4, challenge: '9/18', trend: '-2.8%', risk: true },
  { initials: 'AY', name: 'Ayse Yilmaz', loc: 'Tekirdag', dealers: 14, total: 73.6, strategic: 71.2, segmentation: 76.4, challenge: '12/14', trend: '+1.4%', risk: false },
]

export const challengeSuggestions = [
  { dealer: 'Bayi ****', region: 'Guney Marmara', city: 'Bursa', product: 'Smartphone', reason: 'Ayni lig, son 3 ay benzer tempo', reward: '+8% rozet puani' },
  { dealer: 'Bayi ****', region: 'Ege', city: 'Izmir', product: 'Fiber', reason: 'Fiber adetleri yakin, bolge farkli', reward: '+8% rozet puani' },
  { dealer: 'Bayi ****', region: 'Akdeniz', city: 'Antalya', product: 'Superbox', reason: 'Ilk 5 mesafesi 4 adet', reward: '+6% rozet puani' },
]

export const icmDiffs = [
  { metric: 'Fiber', live: 42, icm: 40, diff: '-2', reason: '2 islem pri kosul bekliyor' },
  { metric: 'Smartphone', live: 31, icm: 31, diff: '0', reason: 'Uyumlu' },
  { metric: 'Rekontratlama', live: 118, icm: 114, diff: '-4', reason: 'Kapama tarihi ay disi' },
]

export const csmRows = [
  { league: 'Elmas', dealers: 3, avg: 91.2, badges: 19, challengeJoin: '72%', challengeWin: '41%' },
  { league: 'Platin', dealers: 5, avg: 86.8, badges: 24, challengeJoin: '68%', challengeWin: '39%' },
  { league: 'Altin', dealers: 4, avg: 79.4, badges: 13, challengeJoin: '55%', challengeWin: '33%' },
  { league: 'Gumus', dealers: 4, avg: 72.6, badges: 8, challengeJoin: '48%', challengeWin: '28%' },
  { league: 'Bronz', dealers: 2, avg: 64.1, badges: 3, challengeJoin: '35%', challengeWin: '16%' },
]

export const directorRows = [
  { group: 'North Turkey', dealers: 442, avg: 82.1, badges: 1184, fiber: 84.4, segmentation: 80.2 },
  { group: 'South Turkey', dealers: 418, avg: 79.6, badges: 1047, fiber: 78.9, segmentation: 81.8 },
]

export const auditRows = [
  { time: '08 Tem 20:18', actor: 'Mert Reis', action: 'Temmuz aktif urun setini guncelledi', approver: 'Zeynep K.', status: 'Onaylandi' },
  { time: '08 Tem 19:42', actor: 'Selin Yildiz', action: 'Fiber ilk n degerini 5 olarak onerdi', approver: 'Mert Reis', status: 'Onay bekliyor' },
  { time: '07 Tem 17:05', actor: 'Sistem', action: 'ICM fark raporu uretildi: 3 metrikte fark var', approver: '-', status: 'Bilgi' },
  { time: '06 Tem 11:20', actor: 'Mert Reis', action: 'Bolge bonusu kurali pasife alindi', approver: 'AI Product Lead', status: 'Yayinda' },
]
