// Maps each of Turkey's 81 provinces (as named in public/turkey.geojson)
// to one of the 7 traditional geographic regions (coğrafi bölgeler).
// Region names match the labels used in src/data.ts -> regionRows.

export type RegionName =
  | 'Marmara'
  | 'Ege'
  | 'Akdeniz'
  | 'İç Anadolu'
  | 'Karadeniz'
  | 'Doğu Anadolu'
  | 'Güneydoğu Anadolu'

const REGION_PROVINCES: Record<RegionName, string[]> = {
  Marmara: [
    'İstanbul', 'Edirne', 'Kırklareli', 'Tekirdağ', 'Çanakkale', 'Balıkesir',
    'Bursa', 'Yalova', 'Kocaeli', 'Sakarya', 'Bilecik',
  ],
  Ege: ['İzmir', 'Manisa', 'Aydın', 'Denizli', 'Muğla', 'Uşak', 'Kütahya', 'Afyon'],
  Akdeniz: [
    'Antalya', 'Burdur', 'Isparta', 'Mersin', 'Adana', 'Osmaniye', 'Hatay',
    'Kahramanmaraş',
  ],
  'İç Anadolu': [
    'Ankara', 'Konya', 'Karaman', 'Aksaray', 'Niğde', 'Nevşehir', 'Kırşehir',
    'Kırıkkale', 'Kayseri', 'Sivas', 'Yozgat', 'Çankırı', 'Eskişehir',
  ],
  Karadeniz: [
    'Zonguldak', 'Karabük', 'Bartın', 'Kastamonu', 'Sinop', 'Çorum', 'Amasya',
    'Samsun', 'Tokat', 'Ordu', 'Giresun', 'Trabzon', 'Rize', 'Artvin',
    'Gümüşhane', 'Bayburt', 'Bolu', 'Düzce',
  ],
  'Doğu Anadolu': [
    'Erzurum', 'Erzincan', 'Ağrı', 'Kars', 'Ardahan', 'Iğdır', 'Van', 'Muş',
    'Bitlis', 'Bingöl', 'Elazığ', 'Tunceli', 'Malatya', 'Hakkari',
  ],
  'Güneydoğu Anadolu': [
    'Gaziantep', 'Kilis', 'Şanlıurfa', 'Adıyaman', 'Diyarbakır', 'Mardin',
    'Batman', 'Siirt', 'Şırnak',
  ],
}

// Flattened lookup: province name -> region name.
export const provinceToRegion: Record<string, RegionName> = Object.entries(
  REGION_PROVINCES,
).reduce((acc, [region, provinces]) => {
  for (const p of provinces) acc[p] = region as RegionName
  return acc
}, {} as Record<string, RegionName>)
