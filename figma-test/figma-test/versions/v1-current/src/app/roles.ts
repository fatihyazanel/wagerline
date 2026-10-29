// Role / screen registry. Mirrors the prototype's 5 roles and 19 screens,
// but the visual language is the existing indigo/light Gamify design system.

export type RoleKey = 'dealer' | 'csm' | 'regional' | 'director' | 'admin'

export type ScreenKey =
  | 'dealer-dashboard'
  | 'dealer-league'
  | 'dealer-badges'
  | 'dealer-challenge'
  | 'dealer-region'
  | 'public-overview'
  | 'csm-dealers'
  | 'csm-dealer-detail'
  | 'csm-challenge-manage'
  | 'regional-csms'
  | 'regional-overview'
  | 'director-comparison'
  | 'admin-overview'
  | 'admin-league'
  | 'admin-badges'
  | 'admin-region'
  | 'admin-access'
  | 'admin-audit'

export type NavIcon =
  | 'home'
  | 'trophy'
  | 'badge'
  | 'target'
  | 'pin'
  | 'grid'
  | 'users'
  | 'user'
  | 'sitemap'
  | 'bars'
  | 'calendar'
  | 'shield'
  | 'file'
  | 'settings'

export type NavItem = {
  screen: ScreenKey
  label: string
  icon: NavIcon
  badge?: string
}

// Per-screen page-header metadata (title + eyebrow pill + subtitle).
export type ScreenMeta = {
  crumb: string
  title: string
  subtitle: string
  pill: string
}

export const screenMeta: Record<ScreenKey, ScreenMeta> = {
  'dealer-dashboard': {
    crumb: 'Bayi · Ana Sayfa',
    title: 'Hoş geldin, Mehmet',
    subtitle: 'Aylık final puanın, lig pozisyonun ve aktif hedeflerinin özeti.',
    pill: 'Bayi Görünümü',
  },
  'dealer-league': {
    crumb: 'Bayi · Lig Pozisyonum',
    title: 'Lig 5 — Anonim Sıralama',
    subtitle: 'Kendi pozisyonun, lider farkın ve dağılım içindeki yerin. İsim ve puan listesi gösterilmez.',
    pill: 'Anonim Lig',
  },
  'dealer-badges': {
    crumb: 'Bayi · Rozetlerim',
    title: 'Rozet Koleksiyonum',
    subtitle: 'Kazanılan ve kazanılabilir rozetler; final puanına çarpan olarak uygulanır.',
    pill: 'Rozetler',
  },
  'dealer-challenge': {
    crumb: 'Bayi · Challenge',
    title: 'Aylık Challenge Merkezi',
    subtitle: 'Bu ayki hedefin, hedef mantığı ve geçmiş challenge sonuçların.',
    pill: 'Meydan Okuma',
  },
  'dealer-region': {
    crumb: 'Bayi · Bölgem',
    title: 'Bölgesel Görünüm',
    subtitle: 'Bölge sıralaması, bonus dağılımı ve Marmara’nın konumu (anonim ortalamalar).',
    pill: 'Bölgem',
  },
  'public-overview': {
    crumb: 'Genel Sayfa · Herkese Açık',
    title: 'Türkiye Özeti',
    subtitle: 'Tüm Türkiye satış ekosisteminin anlık performans ve lig gelişim verileri.',
    pill: 'Ekosistem Görünümü',
  },
  'csm-dealers': {
    crumb: 'CSM · Bayilerim',
    title: 'Bağlı Bayi Performansı',
    subtitle: 'Sana doğrudan bağlı 18 bayinin lig, puan ve challenge kırılımı.',
    pill: 'Bayilerim',
  },
  'csm-dealer-detail': {
    crumb: 'CSM · Bayi Detay',
    title: 'Mehmet Kaya — Beşiktaş',
    subtitle: 'Bayi puan kırılımı, geçmiş performans, yönetici notu ve aktif challenge.',
    pill: 'Bayi Detay',
  },
  'csm-challenge-manage': {
    crumb: 'CSM · Challenge Yönetimi',
    title: 'Challenge Atama & Takip',
    subtitle: 'Yeni challenge oluştur, bayi alternatif önerilerini onayla ve ilerlemeyi izle.',
    pill: 'Challenge Yönetimi',
  },
  'regional-csms': {
    crumb: 'Bölge Md. · CSM’lerim',
    title: 'CSM Ekibim',
    subtitle: 'Sana bağlı 6 CSM’in performansı. Bayilerle bağ CSM üzerinden kurulur.',
    pill: 'CSM Ekibi',
  },
  'regional-overview': {
    crumb: 'Bölge Md. · Bölgem',
    title: 'Marmara Bölgesi',
    subtitle: 'Bölge puanı, lig dağılımı ve stratejik ürün penetrasyonu.',
    pill: 'Bölgem',
  },
  'director-comparison': {
    crumb: 'Direktör · North vs South',
    title: 'Bölge Karşılaştırması',
    subtitle: 'North Turkey ve South Turkey direktörlüklerinin karşılaştırmalı özeti.',
    pill: 'Direktör Görünümü',
  },
  'admin-overview': {
    crumb: 'Admin · Komuta Merkezi',
    title: 'Sistem Geneli Yönetim',
    subtitle: 'Sistem geneli metrikler, trendler ve ay sonu finalizasyon önizlemesi.',
    pill: 'Komuta Merkezi',
  },
  'admin-league': {
    crumb: 'Admin · Lig & Hesaplama',
    title: 'Lig Yapılandırma',
    subtitle: 'Aylık hesaplama akışı, ana puan başlık ağırlıkları ve stratejik ürün havuzu.',
    pill: 'Lig & Hesaplama',
  },
  'admin-badges': {
    crumb: 'Admin · Rozet Kuralları',
    title: 'Rozet Kural Seti',
    subtitle: 'Rozet tetikleyicileri, eşikleri ve çarpanları. Include/Exclude müdahaleleri.',
    pill: 'Rozet Kuralları',
  },
  'admin-region': {
    crumb: 'Admin · Bölge Bonusu',
    title: 'Bölge Bonus Yapılandırma',
    subtitle: 'İlk 3 bölge için bonus oranları ve bölge tanımları.',
    pill: 'Bölge Bonusu',
  },
  'admin-access': {
    crumb: 'Admin · Erişim Matrisi',
    title: 'Yetki & Erişim Yönetimi',
    subtitle: 'Rol × sayfa erişim matrisi, admin yetkili kullanıcılar ve kabul kriterleri.',
    pill: 'Erişim Matrisi',
  },
  'admin-audit': {
    crumb: 'Admin · Audit Log',
    title: 'Sistem Audit Logu',
    subtitle: 'Tüm kural değişiklikleri, onaylar ve reddedilen talepler.',
    pill: 'Audit Log',
  },
}

export type RoleDef = {
  key: RoleKey
  label: string
  short: string
  user: { name: string; role: string; initials: string }
  nav: NavItem[]
}

export const roles: Record<RoleKey, RoleDef> = {
  dealer: {
    key: 'dealer',
    label: 'Bayi',
    short: 'Bayi',
    user: { name: 'Mehmet Kaya', role: 'Bayi · İstanbul Beşiktaş', initials: 'MK' },
    nav: [
      { screen: 'dealer-dashboard', label: 'Ana Sayfa', icon: 'home' },
      { screen: 'dealer-league', label: 'Lig Pozisyonum', icon: 'trophy' },
      { screen: 'dealer-badges', label: 'Rozetlerim', icon: 'badge' },
      { screen: 'dealer-challenge', label: 'Challenge', icon: 'target', badge: '1' },
      { screen: 'dealer-region', label: 'Bölgem', icon: 'pin' },
    ],
  },
  csm: {
    key: 'csm',
    label: 'CSM',
    short: 'CSM',
    user: { name: 'Selin Yıldız', role: 'CSM · İst. Anadolu', initials: 'SY' },
    nav: [
      { screen: 'public-overview', label: 'Genel Sayfa', icon: 'grid' },
      { screen: 'csm-dealers', label: 'Bayilerim', icon: 'users', badge: '18' },
      { screen: 'csm-dealer-detail', label: 'Bayi Detay', icon: 'user' },
      { screen: 'csm-challenge-manage', label: 'Challenge Yönetimi', icon: 'target' },
    ],
  },
  regional: {
    key: 'regional',
    label: 'Bölge Md.',
    short: 'Bölge Md.',
    user: { name: 'Ali Demir', role: 'Bölge Müdürü · Marmara', initials: 'AD' },
    nav: [
      { screen: 'public-overview', label: 'Genel Sayfa', icon: 'grid' },
      { screen: 'regional-csms', label: 'CSM’lerim', icon: 'users', badge: '6' },
      { screen: 'regional-overview', label: 'Bölgem', icon: 'pin' },
    ],
  },
  director: {
    key: 'director',
    label: 'Direktör',
    short: 'Direktör',
    user: { name: 'Mehmet Reis', role: 'Direktör · North Turkey', initials: 'MR' },
    nav: [
      { screen: 'public-overview', label: 'Genel Sayfa', icon: 'grid' },
      { screen: 'director-comparison', label: 'North vs South', icon: 'bars' },
    ],
  },
  admin: {
    key: 'admin',
    label: 'Admin Paneli',
    short: 'Admin',
    user: { name: 'Mert Reis', role: 'Super Admin · AI Product onaylı', initials: 'MR' },
    nav: [
      { screen: 'admin-overview', label: 'Komuta Merkezi', icon: 'grid' },
      { screen: 'admin-league', label: 'Lig & Hesaplama', icon: 'calendar' },
      { screen: 'admin-badges', label: 'Rozet Kuralları', icon: 'badge' },
      { screen: 'admin-region', label: 'Bölge Bonusu', icon: 'pin' },
      { screen: 'admin-access', label: 'Erişim Matrisi', icon: 'shield' },
      { screen: 'admin-audit', label: 'Audit Log', icon: 'file' },
    ],
  },
}

export const roleOrder: RoleKey[] = ['dealer', 'csm', 'regional', 'director', 'admin']
