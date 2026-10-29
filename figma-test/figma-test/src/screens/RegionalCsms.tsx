import { useState } from 'react'
import { Avatar, CardHead, Chip, Hint, Progress, StatCard, gradients } from '../components/ui'

const regionCsmRows = {
  Marmara: [
    { initials: 'SY', name: 'Selin Yildiz', loc: 'Ist. Anadolu', dealers: 18, total: 81.4, strategic: 83.2, segmentation: 79.6, challenge: '14/18', trend: '+4.2%', risk: false },
    { initials: 'AD', name: 'Ali Demir', loc: 'Ist. Avrupa-1', dealers: 22, total: 84.8, strategic: 86.1, segmentation: 82.7, challenge: '19/22', trend: '+5.8%', risk: false },
    { initials: 'BS', name: 'Burcu Sahin', loc: 'Kocaeli', dealers: 16, total: 74.8, strategic: 72.5, segmentation: 78.0, challenge: '14/16', trend: '+2.1%', risk: false },
    { initials: 'TE', name: 'Tolga Erim', loc: 'Bursa', dealers: 18, total: 64.2, strategic: 58.9, segmentation: 69.4, challenge: '9/18', trend: '-2.8%', risk: true },
  ],
  Ege: [
    { initials: 'EO', name: 'Ece Ozan', loc: 'Izmir', dealers: 21, total: 87.6, strategic: 89.8, segmentation: 84.2, challenge: '18/21', trend: '+6.1%', risk: false },
    { initials: 'KA', name: 'Kerem Ates', loc: 'Manisa', dealers: 17, total: 82.2, strategic: 84.0, segmentation: 80.1, challenge: '13/17', trend: '+2.9%', risk: false },
    { initials: 'DY', name: 'Deniz Yaman', loc: 'Aydin', dealers: 15, total: 76.5, strategic: 74.4, segmentation: 79.2, challenge: '10/15', trend: '-0.6%', risk: false },
  ],
  Akdeniz: [
    { initials: 'SA', name: 'Seda Aral', loc: 'Antalya', dealers: 19, total: 78.2, strategic: 76.8, segmentation: 81.3, challenge: '12/19', trend: '+1.4%', risk: false },
    { initials: 'MT', name: 'Mert Talu', loc: 'Adana', dealers: 16, total: 72.9, strategic: 69.6, segmentation: 77.1, challenge: '9/16', trend: '-1.8%', risk: true },
    { initials: 'OY', name: 'Oya Yilmaz', loc: 'Mersin', dealers: 14, total: 75.3, strategic: 73.8, segmentation: 78.4, challenge: '8/14', trend: '+0.7%', risk: false },
  ],
  Karadeniz: [
    { initials: 'BK', name: 'Bora Kaya', loc: 'Samsun', dealers: 18, total: 74.5, strategic: 72.2, segmentation: 79.5, challenge: '11/18', trend: '+0.6%', risk: false },
    { initials: 'NA', name: 'Nil Aksoy', loc: 'Trabzon', dealers: 13, total: 70.8, strategic: 68.4, segmentation: 75.0, challenge: '7/13', trend: '-0.4%', risk: false },
    { initials: 'FT', name: 'Firat Tas', loc: 'Ordu', dealers: 12, total: 66.1, strategic: 62.7, segmentation: 71.8, challenge: '5/12', trend: '-2.1%', risk: true },
  ],
}

type RegionKey = keyof typeof regionCsmRows

export default function RegionalCsms() {
  const [region, setRegion] = useState<RegionKey>('Marmara')
  const rows = regionCsmRows[region]
  const totals = {
    dealers: rows.reduce((sum, row) => sum + row.dealers, 0),
    avg: Number((rows.reduce((sum, row) => sum + row.total, 0) / rows.length).toFixed(1)),
    challengeJoined: rows.reduce((sum, row) => sum + Number(row.challenge.split('/')[0]), 0),
    challengeTotal: rows.reduce((sum, row) => sum + Number(row.challenge.split('/')[1]), 0),
  }

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Bolge Secimi" sub="Executive once bolgeyi secer; tabloda o bolgenin altindaki CSMler listelenir." right={<Chip tone="blue">{region}</Chip>} />
          <div className="selector-row selector-row--badges mt-24">
            {(Object.keys(regionCsmRows) as RegionKey[]).map((item) => (
              <button key={item} className={`selector-pill ${item === region ? 'is-active' : ''}`} onClick={() => setRegion(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="grid-4">
          <StatCard label="CSM Sayisi" value={rows.length} sub={`${region} bolgesi`} />
          <StatCard label="Toplam Bayi" value={totals.dealers} sub="Secili bolge CSMleri" />
          <StatCard label="Ort. Gamification" value={totals.avg} sub="100'luk skala" />
          <StatCard label="Challenge Katilim" value={`${Math.round((totals.challengeJoined / totals.challengeTotal) * 100)}%`} sub={`${totals.challengeJoined}/${totals.challengeTotal} bayi`} />
        </div>

        <section className="card card__pad">
          <CardHead title={`${region} CSM Performansi`} sub="Secili bolgenin altindaki CSMler; total gamification, stratejik urun ve segmentasyon ortalamalariyla gorulur." />
          <table className="table">
            <thead>
              <tr>
                <th>CSM</th>
                <th>Bayi</th>
                <th>Total Gamification</th>
                <th>Stratejik Urun Ort.</th>
                <th>Segmentasyon Ort.</th>
                <th>Challenge</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.name} className={row.risk ? 'is-risk' : undefined}>
                  <td>
                    <div className="avatar-cell">
                      <Avatar initials={row.initials} gradient={[gradients.amberOrange, gradients.blueSky, gradients.purplePink, gradients.greenTeal, gradients.redOrange, gradients.bluePurple][index]} />
                      <div><div className="b">{row.name}</div><small>{row.loc}</small></div>
                    </div>
                  </td>
                  <td>{row.dealers}</td>
                  <td><span className="rowflex"><span className="miniprogress"><Progress value={row.total} tone={row.total > 80 ? 'green' : row.total < 70 ? undefined : 'blue'} /></span><b>{row.total}</b></span></td>
                  <td>{row.strategic}</td>
                  <td>{row.segmentation}</td>
                  <td><Chip tone={row.risk ? 'red' : 'green'}>{row.challenge}</Chip></td>
                  <td><Chip tone={row.trend.startsWith('-') ? 'red' : 'green'}>{row.trend}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Hint tone="amber">
          <b>Aksiyon:</b> Dusuk stratejik urun ortalamasi olan CSMlerde Fiber ve Aksesuar Ciro rozetleri icin bayi bazli aksiyon planlanmali.
        </Hint>
      </div>
    </div>
  )
}
