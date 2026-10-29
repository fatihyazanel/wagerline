import { Avatar, CardHead, Chip, Switch, gradients } from '../components/ui'

function Yes() {
  return <span className="matrix-cell matrix-cell--yes">✓</span>
}
function No() {
  return <span className="matrix-cell matrix-cell--no">−</span>
}
function Partial() {
  return <span className="matrix-cell matrix-cell--partial">⊙</span>
}

type Access = 'yes' | 'no' | 'partial'
const cell = (a: Access) => (a === 'yes' ? <Yes /> : a === 'no' ? <No /> : <Partial />)

const matrixRows: { page: string; sub: string; cells: Access[] }[] = [
  { page: 'Genel Sayfa', sub: 'Anonim toplu özet', cells: ['yes', 'yes', 'yes', 'yes', 'yes'] },
  { page: 'Lig Pozisyonu (anonim)', sub: 'Sadece kendi pozisyonu', cells: ['yes', 'no', 'no', 'no', 'yes'] },
  { page: 'Bayi Özel Sayfa', sub: 'Kişiye özel detaylı veri', cells: ['partial', 'yes', 'no', 'no', 'yes'] },
  {
    page: 'Challenge Alanı',
    sub: 'Yönetici görür · Bayi bağımsız ekran',
    cells: ['partial', 'yes', 'yes', 'yes', 'yes'],
  },
  { page: 'Bayilerim Listesi', sub: "CSM'in kendi bayileri", cells: ['no', 'yes', 'partial', 'partial', 'yes'] },
  { page: "CSM'lerim", sub: 'Bölge Md. → CSM ekibi', cells: ['no', 'no', 'yes', 'yes', 'yes'] },
  { page: 'Direktörlük Özet', sub: 'North/South karşılaştırma', cells: ['no', 'no', 'no', 'yes', 'yes'] },
  { page: 'Admin Paneli', sub: 'AI Product & UX onaylı', cells: ['no', 'no', 'no', 'no', 'yes'] },
  { page: 'Hiyerarşi & Organigram', sub: 'Şeffaf — herkese açık', cells: ['yes', 'yes', 'yes', 'yes', 'yes'] },
]

export default function AdminAccess() {
  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Rol × Sayfa Erişim Matrisi" inlineSub="· PDF Slide 3 uyumlu" />
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Sayfa</th>
                <th>Bayi</th>
                <th>CSM</th>
                <th>Bölge Md.</th>
                <th>Direktör</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((r) => (
                <tr key={r.page}>
                  <td>
                    {r.page}
                    <small>{r.sub}</small>
                  </td>
                  {r.cells.map((c, i) => (
                    <td key={i}>{cell(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rowflex mt-24" style={{ flexWrap: 'wrap', gap: 16 }}>
            <span className="rowflex">
              <Yes /> Tam erişim
            </span>
            <span className="rowflex">
              <Partial /> Sınırlı (yalnızca kendisi/ilişkili)
            </span>
            <span className="rowflex">
              <No /> Erişim yok
            </span>
          </div>
        </section>

        <section className="card card__pad">
          <CardHead
            title="Admin Yetkili Kullanıcılar"
            inlineSub="· AI Product & UX tarafından onaylananlar"
            right={<button className="btn btn--amber">+ Kullanıcı Ekle</button>}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Rol</th>
                <th>Yetki Seviyesi</th>
                <th>Onaylayan</th>
                <th>Tarih</th>
                <th>Aktif</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="avatar-cell">
                    <Avatar initials="MR" gradient={gradients.amberOrange} />
                    <div>
                      <div className="cell-strong">Mert Reis</div>
                      <small>mert.reis@firma.com</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Chip tone="amber">Super Admin</Chip>
                </td>
                <td>Tam erişim</td>
                <td>AI Product Lead</td>
                <td>12 Oca 2026</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="avatar-cell">
                    <Avatar initials="SY" gradient={gradients.purplePink} />
                    <div>
                      <div className="cell-strong">Selin Yıldız</div>
                      <small>selin.y@firma.com</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Chip tone="blue">Admin</Chip>
                </td>
                <td>Rozet + Lig</td>
                <td>Mert Reis</td>
                <td>03 Şub 2026</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="avatar-cell">
                    <Avatar initials="AD" gradient={gradients.greenTeal} />
                    <div>
                      <div className="cell-strong">Ali Demir</div>
                      <small>ali.d@firma.com</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Chip tone="blue">Admin</Chip>
                </td>
                <td>Bölge + Challenge</td>
                <td>Mert Reis</td>
                <td>14 Şub 2026</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="avatar-cell">
                    <Avatar initials="BŞ" gradient={gradients.blueSky} />
                    <div>
                      <div className="cell-strong">Burcu Şahin</div>
                      <small>burcu.s@firma.com</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Chip>Read-only</Chip>
                </td>
                <td>Audit görüntüleme</td>
                <td>Mert Reis</td>
                <td>22 Mar 2026</td>
                <td>
                  <Switch on />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="card card__pad">
          <CardHead title="PDF Kabul Kriterleri Uyum Durumu" inlineSub="· Yetki Mimari Kural Setleri" />
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kabul Kriteri</th>
                <th>Uyum</th>
                <th>Nerede</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="b">1</td>
                <td>Organizasyon yapısı ve kullanıcı rolleri yerleştirilmiştir</td>
                <td>
                  <Chip tone="green">✓ Uyumlu</Chip>
                </td>
                <td>Hiyerarşi ekranı · 4 katman + Admin</td>
              </tr>
              <tr>
                <td className="b">2</td>
                <td>Bayilerin CSM'e doğrudan bağlı olduğu netleşmiştir</td>
                <td>
                  <Chip tone="green">✓ Uyumlu</Chip>
                </td>
                <td>Organigram + Bölge Md. ekranı uyarısı</td>
              </tr>
              <tr>
                <td className="b">3</td>
                <td>Admin paneli yapılandırılabilirlik kuralları işlenmiştir</td>
                <td>
                  <Chip tone="green">✓ Uyumlu</Chip>
                </td>
                <td>Lig, Rozet, Bölge, Erişim, Audit</td>
              </tr>
              <tr>
                <td className="b">4</td>
                <td>
                  <b>Bayi-bayi karşılaştırması yapılmamıştır</b>
                </td>
                <td>
                  <Chip tone="green">✓ Uyumlu</Chip>
                </td>
                <td>Lig Pozisyonu anonim (no isim/puan listesi)</td>
              </tr>
              <tr>
                <td className="b">5</td>
                <td>İş yapısı senaryosu organizasyon ve 2 ana puan başlığı üzerinden</td>
                <td>
                  <Chip tone="green">✓ Uyumlu</Chip>
                </td>
                <td>Segmentasyon + Stratejik Ürün (4'ten 2'ye)</td>
              </tr>
              <tr>
                <td className="b">6</td>
                <td>Bayi pozisyonu 2 ana başlık üzerinden gösterilir</td>
                <td>
                  <Chip tone="green">✓ Uyumlu</Chip>
                </td>
                <td>Bayi Dashboard · 2 metrik kırılımı</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
