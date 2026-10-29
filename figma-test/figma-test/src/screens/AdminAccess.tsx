import { Avatar, CardHead, Chip, Switch, gradients } from '../components/ui'

function Yes() {
  return <span className="matrix-cell matrix-cell--yes">OK</span>
}
function No() {
  return <span className="matrix-cell matrix-cell--no">-</span>
}
function Partial() {
  return <span className="matrix-cell matrix-cell--partial">K</span>
}

type Access = 'yes' | 'no' | 'partial'
const cell = (a: Access) => (a === 'yes' ? <Yes /> : a === 'no' ? <No /> : <Partial />)

const matrixRows: { page: string; sub: string; cells: Access[] }[] = [
  { page: 'Genel Sayfa', sub: 'Lig, bolge, rozet ve tarih filtreli toplu ozet', cells: ['no', 'no', 'yes', 'yes', 'yes'] },
  { page: 'Bayi Ana Sayfa', sub: 'Bayi kendi ekranini; ust roller detay/izleme amacli gorur', cells: ['yes', 'partial', 'partial', 'yes', 'yes'] },
  { page: 'Firma Bayilerim', sub: 'Bir firmaya bagli birden fazla bayinin siralamasi ve detaylari', cells: ['no', 'yes', 'no', 'partial', 'yes'] },
  { page: 'Challenge', sub: 'Challenge acma/kabul etme bayide; diger roller izleme yapar', cells: ['yes', 'partial', 'partial', 'partial', 'yes'] },
  { page: 'CSM Bayilerim + Detay', sub: "CSM'in sorumlu oldugu bayiler; detay ayni sayfada acilir", cells: ['no', 'no', 'yes', 'yes', 'yes'] },
  { page: 'Executive CSMler', sub: 'Tum TR CSMleri bolge bazli gorulur', cells: ['no', 'no', 'no', 'yes', 'yes'] },
  { page: 'Executive Bolgesel Ozet', sub: 'Secilen bolgedeki bayi lig dagilimi ve urun ortalamalari', cells: ['no', 'no', 'no', 'yes', 'yes'] },
  { page: 'North/South', sub: 'Bolge ort puani, rozet, streak ve challenge karsilastirmasi', cells: ['no', 'no', 'no', 'yes', 'yes'] },
  { page: 'Admin Kural Setleri', sub: 'Agirlik, rozet, include/exclude, audit', cells: ['no', 'no', 'no', 'no', 'yes'] },
]

export default function AdminAccess() {
  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Rol x Sayfa Erisim Matrisi" sub="PDF kabul kriterleri bolumu V2'de kaldirildi; bu ekran yalnizca yetki davranisini gosterir." />
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Sayfa</th>
                <th>Bayi</th>
                <th>Firma</th>
                <th>CSM</th>
                <th>Executive</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((r) => (
                <tr key={r.page}>
                  <td>{r.page}<small>{r.sub}</small></td>
                  {r.cells.map((c, i) => <td key={i}>{cell(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rowflex mt-24" style={{ flexWrap: 'wrap', gap: 16 }}>
            <span className="rowflex"><Yes /> Tam erisim</span>
            <span className="rowflex"><Partial /> Kontrol/izleme</span>
            <span className="rowflex"><No /> Erisim yok</span>
          </div>
        </section>

        <section className="card card__pad">
          <CardHead title="Admin Yetkili Kullanicilar" right={<button className="btn btn--amber">+ Kullanici Ekle</button>} />
          <table className="table">
            <thead>
              <tr>
                <th>Kullanici</th>
                <th>Rol</th>
                <th>Yetki Seviyesi</th>
                <th>Onaylayan</th>
                <th>Tarih</th>
                <th>Aktif</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['MR', 'Mert Reis', 'mert.reis@firma.com', 'Super Admin', 'Tam erisim', 'AI Product Lead', '08 Tem 2026', gradients.amberOrange],
                ['SY', 'Selin Yildiz', 'selin.y@firma.com', 'Admin', 'Rozet + Lig', 'Mert Reis', '08 Tem 2026', gradients.blueSky],
                ['AD', 'Ali Demir', 'ali.d@firma.com', 'Read-only', 'Bolge goruntuleme', 'Mert Reis', '07 Tem 2026', gradients.greenTeal],
              ].map((u) => (
                <tr key={u[1]}>
                  <td>
                    <div className="avatar-cell">
                      <Avatar initials={u[0] as string} gradient={u[7] as string} />
                      <div><div className="cell-strong">{u[1]}</div><small>{u[2]}</small></div>
                    </div>
                  </td>
                  <td><Chip tone={u[3] === 'Super Admin' ? 'amber' : 'blue'}>{u[3]}</Chip></td>
                  <td>{u[4]}</td>
                  <td>{u[5]}</td>
                  <td>{u[6]}</td>
                  <td><Switch on /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
