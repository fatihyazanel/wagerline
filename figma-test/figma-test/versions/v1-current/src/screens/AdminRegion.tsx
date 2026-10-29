import { CardHead, Chip, RegionCard, Switch } from '../components/ui'

export default function AdminRegion() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-3">
          <RegionCard rank="gold" medal="🥇" name="1. Bölge Bonusu" sub="En yüksek ortalama" bonus="+%6" />
          <RegionCard rank="silver" medal="🥈" name="2. Bölge Bonusu" sub="İkinci sıra" bonus="+%3" />
          <RegionCard rank="bronze" medal="🥉" name="3. Bölge Bonusu" sub="Üçüncü sıra" bonus="+%2" />
        </div>

        <div className="grid-2">
          <div className="stack">
            <section className="card card__pad">
              <CardHead
                title="Bölge Bonus Yapılandırma"
                right={<button className="btn btn--primary">Onaya Gönder</button>}
              />
              <div className="form-row">
                <label>Genel sayfaya dahil et?</label>
                <Switch on />
              </div>
              <div className="form-row">
                <label>Bonus oranlarını manuel ayarla</label>
                <Switch on />
              </div>
              <div className="weight-row">
                <div className="weight-row__n">🥇 1. Bölge</div>
                <input type="range" min={0} max={20} defaultValue={6} />
                <div className="weight-row__pct">+%6</div>
              </div>
              <div className="weight-row">
                <div className="weight-row__n">🥈 2. Bölge</div>
                <input type="range" min={0} max={20} defaultValue={3} />
                <div className="weight-row__pct">+%3</div>
              </div>
              <div className="weight-row">
                <div className="weight-row__n">🥉 3. Bölge</div>
                <input type="range" min={0} max={20} defaultValue={2} />
                <div className="weight-row__pct">+%2</div>
              </div>
              <div className="form-row">
                <label>Uygulama zamanı</label>
                <select className="select">
                  <option>Ay sonu finalizasyonda</option>
                  <option>Aylık ortalama üzerinden</option>
                </select>
              </div>
              <div className="form-row">
                <label>Bonus formülü</label>
                <code style={{ background: 'var(--page-bg)', padding: '8px 12px', borderRadius: 8, fontSize: 11 }}>
                  final_puan × (1 + bölge_bonus)
                </code>
              </div>
            </section>
          </div>

          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Bölge Tanımları" right={<button className="btn btn--ghost">+ Yeni Bölge</button>} />
              <table className="table">
                <thead>
                  <tr>
                    <th>Bölge</th>
                    <th>Direktör</th>
                    <th>Bayi</th>
                    <th>Aktif</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="cell-strong">Marmara</td>
                    <td>
                      <Chip tone="blue">North</Chip>
                    </td>
                    <td>108</td>
                    <td>
                      <Switch on />
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-strong">Ege</td>
                    <td>
                      <Chip tone="amber">South</Chip>
                    </td>
                    <td>112</td>
                    <td>
                      <Switch on />
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-strong">İç Anadolu Güney</td>
                    <td>
                      <Chip tone="amber">South</Chip>
                    </td>
                    <td>96</td>
                    <td>
                      <Switch on />
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-strong">Akdeniz</td>
                    <td>
                      <Chip tone="amber">South</Chip>
                    </td>
                    <td>88</td>
                    <td>
                      <Switch on />
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-strong">Karadeniz</td>
                    <td>
                      <Chip tone="blue">North</Chip>
                    </td>
                    <td>92</td>
                    <td>
                      <Switch on />
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-strong">Doğu Anadolu</td>
                    <td>
                      <Chip tone="blue">North</Chip>
                    </td>
                    <td>72</td>
                    <td>
                      <Switch on />
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-muted">Güneydoğu</td>
                    <td>
                      <Chip tone="amber">South</Chip>
                    </td>
                    <td>64</td>
                    <td>
                      <Switch />
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
