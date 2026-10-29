// All copy/values transcribed from the Figma "Türkiye Özeti" design.

export const navLinks = [
  { label: 'Genel Durum', icon: 'chart', active: true, caret: false },
  { label: 'Bayi Detay', icon: 'store', active: false, caret: true },
  { label: 'Meydan Okuma', icon: 'star', active: false, caret: false },
  { label: 'Admin Paneli', icon: 'settings', active: false, caret: true },
] as const

export const filterTabs = [
  { label: 'Bu ay', active: true },
  { label: 'Önceki ay', active: false },
  { label: 'Yılbaşından beri', active: false },
  { label: 'Son 1 yıl', active: false },
  { label: 'Tarihe göre ara...', active: false, icon: 'search' },
] as const

export type Kpi = {
  title: string
  formula: string
  value: string
  delta: string
  footLabel: string
  footValue: string
  icon: 'chart' | 'layers' | 'star'
  accent: string
}

export const kpis: Kpi[] = [
  {
    title: 'Ekosistem Ortalaması',
    formula: 'Formül: Seg. Ağırlığı + Strat. Ürün Ağırlığı',
    value: '85.6',
    delta: '%12,4',
    footLabel: 'Toplam Bayi Katılımı:',
    footValue: '1,150 Aktif Bayi',
    icon: 'chart',
    accent: '#4f39f6',
  },
  {
    title: 'Segmentasyon Skoru',
    formula: 'Kendi kulvarındaki gelişim',
    value: '85.6',
    delta: '%6,2',
    footLabel: 'Ağırlık Etkisi (Admin):',
    footValue: '%60 Ağırlık',
    icon: 'layers',
    accent: '#155dfc',
  },
  {
    title: 'Stratejik Ürünler Skoru',
    formula: 'Odak ürün satışı başarısı',
    value: '85.6',
    delta: '%6,7',
    footLabel: 'Ağırlık Etkisi (Admin):',
    footValue: '%40 Ağırlık',
    icon: 'star',
    accent: '#e17100',
  },
]

export type League = {
  name: string
  count: string
  score: string
  icon: 'gem' | 'gem' | 'award' | 'medal' | 'shield'
  key: 'elmas' | 'platin' | 'altin' | 'gumus' | 'bronz'
}

export const leagues: League[] = [
  { name: 'Elmas Ligi', count: '156 Bayi', score: 'Ort. 87.7 Puan', icon: 'gem', key: 'elmas' },
  { name: 'Platin Lig', count: '156 Bayi', score: 'Ort. 87.7 Puan', icon: 'gem', key: 'platin' },
  { name: 'Altın Ligi', count: '245 Bayi', score: 'Ort. 84.3 Puan', icon: 'award', key: 'altin' },
  { name: 'Gümüş Ligi', count: '312 Bayi', score: 'Ort. 81.9 Puan', icon: 'medal', key: 'gumus' },
  { name: 'Bronz Ligi', count: '437 Bayi', score: 'Ort. 71.2 Puan', icon: 'shield', key: 'bronz' },
]

export type LeagueRow = {
  league: string
  key: League['key']
  count: string
  target: string
  current: string
  topDealer: string
}

export const leagueRows: LeagueRow[] = [
  { league: 'Elmas Ligi', key: 'elmas', count: '156', target: '%90', current: '%87.7', topDealer: 'Marmara Platin 1 (Maskeli)' },
  { league: 'Platin Lig', key: 'platin', count: '156', target: '%90', current: '%87.7', topDealer: 'Marmara Platin 1 (Maskeli)' },
  { league: 'Altın Lig', key: 'altin', count: '245', target: '%80', current: '%84.3', topDealer: 'İç Anadolu Altın 12' },
  { league: 'Gümüş Lig', key: 'gumus', count: '312', target: '%70', current: '%81.9', topDealer: 'Ege Gümüş 4' },
  { league: 'Bronz Lig', key: 'bronz', count: '312', target: '%70', current: '%81.9', topDealer: 'Ege Gümüş 4' },
]

export const leagueAccents: Record<League['key'], string> = {
  elmas: '#ff1044',
  platin: '#0092b8',
  altin: '#e17100',
  gumus: '#45556c',
  bronz: '#f54900',
}

export const aiText =
  "Bayiler, 14 Bölge Müdürlüğü'ne doğrudan bağlı değildir. Operasyonel tüm bağ, bayilerden sorumlu Channel Sales Manager (CSM) üzerinden kurulur."

export type RegionRow = { region: string; score: string; change: string }

export const regionRows: RegionRow[] = [
  { region: 'Marmara', score: '%87.7', change: '%4.2' },
  { region: 'İç Anadolu', score: '%84.3', change: '%4.2' },
  { region: 'Ege', score: '%81.9', change: '%4.2' },
  { region: 'Akdeniz', score: '%81.9', change: '%4.2' },
  { region: 'Karadeniz', score: '%81.9', change: '%4.2' },
  { region: 'Doğu Anadolu', score: '%81.9', change: '%4.2' },
  { region: 'Güneydoğu Anadolu', score: '%81.9', change: '%4.2' },
]
