import { CardHead, Chip, StatCard, SegTabs } from '../components/ui'

type Approval = {
  name: string
  loc: string
  system: string
  dealer: string
  extra?: string
  highlight?: boolean
}

const approvals: Approval[] = [
  { name: 'Mehmet Kaya', loc: 'Beşiktaş', system: '5G 30 adet', dealer: 'Premium SP %22', extra: ' (mevcut %18)', highlight: true },
  { name: 'Zeynep Duran', loc: 'Pendik', system: 'Fiber %15', dealer: 'Fiber %18 + ek 250 puan' },
  { name: 'Hakan Güler', loc: 'Tuzla', system: 'Segmentasyon +1 kulvar', dealer: 'Mevcut kulvarda Top 3' },
]

export default function CsmChallengeManage() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="Aktif Challenge" value="14" sub="Tüm bayilere atandı" />
          <StatCard label="Risk Altında" pill="!" pillTone="red" value="3" sub="%30 altı ilerleme" />
          <StatCard label="Bekleyen Onay" value="4" sub="Bayi alternatif önerdi" />
          <StatCard label="Bu ay Tamam" value="9" sub="Ödül dağıtıldı" />
        </div>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Yeni Challenge Oluştur" inlineSub="· Bayi seç + hedef belirle" />
            <div className="form-row">
              <label>Atanan bayi</label>
              <select className="select">
                <option>Mehmet Kaya · Beşiktaş</option>
                <option>Ayşe Tunç · Kadıköy</option>
                <option>Tüm bayilerim (18)</option>
              </select>
            </div>
            <div className="form-row">
              <label>Mod</label>
              <SegTabs tabs={['🤖 Sistem önerisi', '✋ Manuel']} />
            </div>
            <div className="form-row">
              <label>Challenge tipi</label>
              <select className="select">
                <option>Stratejik Ürün</option>
                <option>Segmentasyon</option>
              </select>
            </div>
            <div className="form-row">
              <label>Hedef metrik</label>
              <select className="select">
                <option>5G destekli cihaz adedi</option>
                <option>Premium SP oranı</option>
                <option>Fiber penetrasyon</option>
              </select>
            </div>
            <div className="form-row">
              <label>
                Hedef değeri <small>Sistem stretch önerdi</small>
              </label>
              <div className="input-row">
                <input className="input" defaultValue="30" />
                <span className="text-sm">adet · Bölge ort. +%15</span>
              </div>
            </div>
            <div className="form-row">
              <label>Ödül</label>
              <div className="input-row">
                <span>+</span>
                <input className="input" defaultValue="250" />
                <span className="text-sm">puan</span>
              </div>
            </div>
            <div className="form-row">
              <label>Dönem</label>
              <select className="select">
                <option>Mayıs 2026 (ay sonu)</option>
              </select>
            </div>
            <div className="rowflex" style={{ marginTop: 16, justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn--ghost">Taslak Kaydet</button>
              <button className="btn btn--primary">Bayiye Gönder</button>
            </div>
          </section>

          <section className="card card__pad">
            <CardHead title="Bekleyen Onaylar" inlineSub="· Bayinin önerdiği alternatifler" />
            <div className="stack-sm">
              {approvals.map((a) => (
                <div
                  key={a.name}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: a.highlight ? 'var(--amber-bg)' : 'var(--page-bg)',
                  }}
                >
                  <div className="spread">
                    <b>{a.name}</b>
                    <Chip>{a.loc}</Chip>
                  </div>
                  <div className="text-sm text-muted" style={{ marginTop: 8 }}>
                    Sistemin önerdiği: <b>{a.system}</b>
                    <br />
                    Bayi önerisi: <b>{a.dealer}</b>
                    {a.extra}
                  </div>
                  <div className="rowflex" style={{ marginTop: 8, gap: 6 }}>
                    <button className="btn btn--ghost btn--sm">Reddet</button>
                    <button className="btn btn--primary btn--sm">Onayla</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
