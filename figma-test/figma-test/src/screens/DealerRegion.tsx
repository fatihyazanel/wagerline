import { CardHead, Chip, Hint, RegionCard } from '../components/ui'

export default function DealerRegion() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-3">
          <RegionCard
            rank="gold"
            medal="🥇"
            name="Ege Bölgesi"
            sub="Ortalama: 7.420 · 112 bayi"
            bonus="+%6"
          />
          <RegionCard
            rank="silver"
            medal="🥈"
            name="Marmara"
            badge={<Chip tone="amber">Bölgem</Chip>}
            sub="Ortalama: 6.890 · 108 bayi"
            bonus="+%3"
          />
          <RegionCard
            rank="bronze"
            medal="🥉"
            name="İç Anadolu Güney"
            sub="Ortalama: 6.640 · 96 bayi"
            bonus="+%2"
          />
        </div>

        <section className="card card__pad">
          <CardHead
            title="Tüm Bölgeler — Mayıs 2026"
            inlineSub="· Bölge bazında anonim ortalamalar"
          />
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bölge</th>
                <th>Bayi</th>
                <th>Ortalama Puan</th>
                <th>Trend</th>
                <th className="num">Bonus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>1</b>
                </td>
                <td className="cell-strong">Ege</td>
                <td>112</td>
                <td>7.420</td>
                <td>
                  <Chip tone="green">▲ +2.8%</Chip>
                </td>
                <td className="num b">+%6</td>
              </tr>
              <tr>
                <td>
                  <b>2</b>
                </td>
                <td className="cell-strong">
                  Marmara <Chip tone="amber">Bölgem</Chip>
                </td>
                <td>108</td>
                <td>6.890</td>
                <td>
                  <Chip tone="green">▲ +1.4%</Chip>
                </td>
                <td className="num b">+%3</td>
              </tr>
              <tr>
                <td>
                  <b>3</b>
                </td>
                <td className="cell-strong">İç Anadolu Güney</td>
                <td>96</td>
                <td>6.640</td>
                <td>
                  <Chip>— 0.0%</Chip>
                </td>
                <td className="num b">+%2</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Akdeniz</td>
                <td>88</td>
                <td>6.420</td>
                <td>
                  <Chip tone="red">▼ -0.8%</Chip>
                </td>
                <td className="num text-muted">—</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Karadeniz</td>
                <td>92</td>
                <td>6.180</td>
                <td>
                  <Chip tone="green">▲ +0.6%</Chip>
                </td>
                <td className="num text-muted">—</td>
              </tr>
              <tr>
                <td>6</td>
                <td>İç Anadolu Kuzey</td>
                <td>78</td>
                <td>5.940</td>
                <td>
                  <Chip tone="green">▲ +1.1%</Chip>
                </td>
                <td className="num text-muted">—</td>
              </tr>
            </tbody>
          </table>
        </section>

        <Hint tone="amber">
          💡 <b>İpucu:</b> Marmara'nın 1. olması için ortalama 530 puan gerekiyor.
          Bölgenin tüm bayilerinin küçük katkıları toplam farkı kapatır.
        </Hint>
      </div>
    </div>
  )
}
