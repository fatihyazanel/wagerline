import { Gem, Globe, Radio, Coins } from 'lucide-react'
import { CardHead, MetricRow, Progress } from '../components/ui'

export default function RegionalOverview() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="hero">
          <div className="hero__row">
            <div className="hero__score">
              <div className="hero__score-label">BÖLGE PUANI</div>
              <div className="hero__score-val">6.890</div>
              <div className="hero__score-sub">Marmara · 2. sırada</div>
            </div>
            <div className="hero__meta">
              <div>
                <div className="hero__meta-lbl">Sıralama</div>
                <div className="hero__meta-v">
                  2.<small>/14 bölge</small>
                </div>
                <div className="delta-up">+%3 bonus</div>
              </div>
              <div>
                <div className="hero__meta-lbl">Toplam Bayi</div>
                <div className="hero__meta-v">108</div>
                <div className="delta-up">▲ +6 yeni</div>
              </div>
              <div>
                <div className="hero__meta-lbl">CSM Sayısı</div>
                <div className="hero__meta-v">6</div>
              </div>
              <div>
                <div className="hero__meta-lbl">Trend</div>
                <div className="hero__meta-v">+%1.4</div>
                <div className="delta-up">vs Nisan</div>
              </div>
            </div>
            <div className="hero__emoji">🥈</div>
          </div>
        </div>

        <div className="grid-2-eq">
          <section className="card card__pad">
            <CardHead title="Bayi Lig Dağılımı" inlineSub="· Marmara · 108 bayi" />
            <table className="table">
              <thead>
                <tr>
                  <th>Lig</th>
                  <th>Bayi</th>
                  <th>Oran</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cell-strong">🏆 Lig 1-3 (Elite)</td>
                  <td>22</td>
                  <td>
                    <div className="rowflex">
                      <span className="miniprogress">
                        <Progress value={20} />
                      </span>
                      <span className="text-sm">20%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="cell-strong">Lig 4-5</td>
                  <td>54</td>
                  <td>
                    <div className="rowflex">
                      <span className="miniprogress">
                        <Progress value={50} tone="blue" />
                      </span>
                      <span className="text-sm">50%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Lig 6-7</td>
                  <td>26</td>
                  <td>
                    <div className="rowflex">
                      <span className="miniprogress">
                        <Progress value={24} tone="green" />
                      </span>
                      <span className="text-sm">24%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Lig 8 (yükselmeyi bekleyen)</td>
                  <td>6</td>
                  <td>
                    <div className="rowflex">
                      <span className="miniprogress">
                        <div className="progress">
                          <span style={{ width: '6%', background: 'var(--light)' }} />
                        </div>
                      </span>
                      <span className="text-sm">6%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="card card__pad">
            <CardHead title="Stratejik Ürün Penetrasyonu" inlineSub="· Bölge ortalaması" />
            <MetricRow
              icon={<Gem size={18} />}
              iconBg="var(--purple-bg)"
              iconColor="var(--purple)"
              name="Premium SP"
              progress={78}
              progressTone="purple"
              value="78.3"
            />
            <MetricRow
              icon={<Globe size={18} />}
              iconBg="var(--bronz-bg)"
              iconColor="var(--bronz)"
              name="Fiber"
              progress={64}
              value="64.2"
            />
            <MetricRow
              icon={<Radio size={18} />}
              iconBg="var(--blue-bg)"
              iconColor="var(--blue)"
              name="5G Destekli Cihaz"
              progress={82}
              progressTone="blue"
              value="82.1"
            />
            <MetricRow
              icon={<Coins size={18} />}
              iconBg="var(--green-bg)"
              iconColor="var(--green)"
              name="Yüksek TL Paket"
              progress={71}
              progressTone="green"
              value="71.6"
            />
          </section>
        </div>
      </div>
    </div>
  )
}
