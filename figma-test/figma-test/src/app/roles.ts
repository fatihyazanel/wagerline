export type RoleKey = 'dealer' | 'firm' | 'csm' | 'executive' | 'admin'

export type ScreenKey =
  | 'dealer-dashboard'
  | 'dealer-league'
  | 'dealer-badges'
  | 'dealer-challenge'
  | 'dealer-region'
  | 'firm-dealers'
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

export type ScreenMeta = {
  crumb: string
  title: string
  subtitle: string
  pill: string
}

export const screenMeta: Record<ScreenKey, ScreenMeta> = {
  'dealer-dashboard': {
    crumb: 'Bayi - Ana Sayfa',
    title: 'Hos geldin Bayi-3234',
    subtitle: 'Bu ayki gamification puanin, rozet avin, lig siralaman ve aktif challenge durumun.',
    pill: 'Bayi Oyuncu Ekrani',
  },
  'dealer-league': {
    crumb: 'Bayi - Lig Pozisyonum',
    title: 'Platin Lig - Anonim Siralama',
    subtitle: 'Ustundeki ve altindaki 5 bayi maskeli gosterilir; puan, bolge ve rozet mesafeni gorebilirsin.',
    pill: 'Anonim Lig',
  },
  'firm-dealers': {
    crumb: 'Firma - Bayilerim',
    title: 'Firma Bayi Portfoyu',
    subtitle: 'Ayni firmaya bagli bayilerin gamification, stratejik urun ve segmentasyon puanlari; bayi detayinda alt urun siralari.',
    pill: 'Firma',
  },
  'dealer-badges': {
    crumb: 'Bayi - Rozetlerim',
    title: 'Rozet Koleksiyonum',
    subtitle: 'Stratejik urun, segmentasyon, HGO, buyume ve toplam puan rozetleri; streak bonuslari dahil.',
    pill: 'Rozetler',
  },
  'dealer-challenge': {
    crumb: 'Bayi - Challenge',
    title: 'Aylik Challenge Merkezi',
    subtitle: 'Sistem sana uygun rakipleri onerir; kabul edilen challenge ay sonunda ilgili rozet puanina bonus verir.',
    pill: 'Meydan Okuma',
  },
  'dealer-region': {
    crumb: 'Bayi - Bolgem',
    title: 'Bolgesel Siralama',
    subtitle: 'Gamification puanina gore bolge siralamasi; odul yok, gorunurluk ve rekabet var.',
    pill: 'Bolgem',
  },
  'public-overview': {
    crumb: 'Genel Sayfa - Ekosistem',
    title: 'Turkiye Gamification Ozeti',
    subtitle: 'Lig dagilimi, rozet ortalamalari, bolge haritasi ve tarih/urun filtreleriyle demo gorunumu.',
    pill: 'Ekosistem',
  },
  'csm-dealers': {
    crumb: 'CSM - Bayilerim',
    title: 'Bagli Bayi Performansi',
    subtitle: 'Sorumlu oldugun bayilerin lig bazli puan, rozet, challenge katilim ve kazanma oranlari.',
    pill: 'Bayilerim',
  },
  'csm-dealer-detail': {
    crumb: 'CSM - Bayi Detay',
    title: 'Mehmet Kaya - Besiktas',
    subtitle: 'Bayi puan kirilimi, gecmis rozetleri, siralama gecmisi ve ICM fark kontrolu.',
    pill: 'Bayi Detay',
  },
  'csm-challenge-manage': {
    crumb: 'CSM - Eski Challenge',
    title: 'Challenge Yetkisi Bayide',
    subtitle: 'Bu demo versiyonunda CSM challenge atamaz; yalnizca bayi taleplerini izler.',
    pill: 'Pasif',
  },
  'regional-csms': {
    crumb: 'Executive - CSMler',
    title: 'CSM Ekibim',
    subtitle: 'CSM toplamlarina gore bayi ortalamalari, rozet hacmi ve lig kirilimi.',
    pill: 'CSM Ekibi',
  },
  'regional-overview': {
    crumb: 'Executive - Bolgesel Ozet',
    title: 'Bolgesel Performans',
    subtitle: 'Bolge puani, lig dagilimi, stratejik urun ve segmentasyon rozet ortalamalari.',
    pill: 'Bolgesel Ozet',
  },
  'director-comparison': {
    crumb: 'Executive - North vs South',
    title: 'North / South Karsilastirmasi',
    subtitle: 'Direktorluk bazinda urun ortalama puani, toplam rozet, challenge ve bolge siralamalari.',
    pill: 'Executive',
  },
  'admin-overview': {
    crumb: 'Admin - Komuta Merkezi',
    title: 'Sistem Geneli Yonetim',
    subtitle: 'Aktif donem, onay bekleyen kural setleri, finalizasyon ve ICM fark izleme.',
    pill: 'Komuta Merkezi',
  },
  'admin-league': {
    crumb: 'Admin - Lig & Hesaplama',
    title: 'Lig ve Puan Motoru',
    subtitle: 'Son 12 ay uretim puaniyla 5 lig, ana metrik agirliklari, aktif urun secimi ve onay akisi.',
    pill: 'Lig & Hesaplama',
  },
  'admin-badges': {
    crumb: 'Admin - Rozet Kurallari',
    title: 'Rozet, Streak ve Challenge Kurallari',
    subtitle: 'Ilk n, sira bonusu, 2 ay ust uste streak ve challenge odul oranlari.',
    pill: 'Rozet Kurallari',
  },
  'admin-region': {
    crumb: 'Admin - Kaldirildi',
    title: 'Bolge Bonusu Kaldirildi',
    subtitle: 'Bu alan V2 kapsaminda pasif; bolge siralamasi odulsuz gorunurluk saglar.',
    pill: 'Pasif',
  },
  'admin-access': {
    crumb: 'Admin - Erisim Matrisi',
    title: 'Yetki & Erisim Yonetimi',
    subtitle: 'Bayi, firma, CSM, executive ve admin rollerinin sayfa erisimleri.',
    pill: 'Erisim Matrisi',
  },
  'admin-audit': {
    crumb: 'Admin - Audit Log',
    title: 'Sistem Audit Logu',
    subtitle: 'Kim degistirdi, kim onayladi, hangi kural seti yayina alindi; tum iz kayitlari.',
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
    user: { name: 'Bayi-3234', role: 'Bayi - Platin Lig', initials: 'B3' },
    nav: [
      { screen: 'dealer-dashboard', label: 'Ana Sayfa', icon: 'home' },
      { screen: 'dealer-badges', label: 'Rozetlerim', icon: 'badge' },
      { screen: 'dealer-challenge', label: 'Challenge', icon: 'target', badge: '1' },
      { screen: 'dealer-region', label: 'Bolgem', icon: 'pin' },
    ],
  },
  firm: {
    key: 'firm',
    label: 'Firma',
    short: 'Firma',
    user: { name: 'Firma-4821', role: 'Firma - 7 bayi', initials: 'F4' },
    nav: [
      { screen: 'firm-dealers', label: 'Bayilerim', icon: 'users', badge: '7' },
    ],
  },
  csm: {
    key: 'csm',
    label: 'CSM',
    short: 'CSM',
    user: { name: 'Selin Yildiz', role: 'CSM - Istanbul Anadolu', initials: 'SY' },
    nav: [
      { screen: 'public-overview', label: 'Genel Sayfa', icon: 'grid' },
      { screen: 'csm-dealers', label: 'Bayilerim', icon: 'users', badge: '18' },
    ],
  },
  executive: {
    key: 'executive',
    label: 'Executive',
    short: 'Executive',
    user: { name: 'Executive-1048', role: 'Bolge Md. / Direktor gorunumu', initials: 'EX' },
    nav: [
      { screen: 'public-overview', label: 'Genel Sayfa', icon: 'grid' },
      { screen: 'regional-csms', label: 'CSMler', icon: 'users', badge: '6' },
      { screen: 'regional-overview', label: 'Bolgesel Ozet', icon: 'pin' },
      { screen: 'director-comparison', label: 'North vs South', icon: 'bars' },
    ],
  },
  admin: {
    key: 'admin',
    label: 'Admin Paneli',
    short: 'Admin',
    user: { name: 'Mert Reis', role: 'Super Admin - Onayli', initials: 'MR' },
    nav: [
      { screen: 'admin-league', label: 'Lig & Hesaplama', icon: 'calendar' },
      { screen: 'admin-badges', label: 'Rozet Kurallari', icon: 'badge' },
      { screen: 'admin-access', label: 'Erisim Matrisi', icon: 'shield' },
      { screen: 'admin-audit', label: 'Audit Log', icon: 'file' },
    ],
  },
}

export const roleOrder: RoleKey[] = ['dealer', 'firm', 'csm', 'executive', 'admin']
