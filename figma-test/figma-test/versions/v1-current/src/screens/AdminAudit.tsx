import { Avatar, CardHead, Chip, SegTabs, StatCard, gradients } from '../components/ui'

export default function AdminAudit() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="Bugünkü Değişiklik" value="12" sub="3 onayda" />
          <StatCard label="Bekleyen Onay" pill="!" pillTone="red" value="3" sub="Senin tarafından" />
          <StatCard label="Reddedilen" pill="7g" value="1" sub="Geri alındı" />
          <StatCard label="Aktif Kural" value="28" sub="Ay başı snapshot" />
        </div>

        <section className="card card__pad">
          <CardHead
            title="Audit Log — Kural Değişiklikleri"
            right={
              <>
                <SegTabs tabs={['Hepsi', 'Bekleyen', 'Onaylanan']} />
                <button className="btn btn--ghost">CSV</button>
              </>
            }
          />

          <div className="audit-row">
            <div className="audit-row__ts">
              15:42
              <br />
              17 Haz
            </div>
            <div className="audit-row__who">
              <Avatar initials="SY" gradient={gradients.purplePink} />
              <div>
                <div className="b">Selin Yıldız</div>
                <small className="text-muted">Admin · Rozet yetkisi</small>
              </div>
            </div>
            <div className="audit-row__what">
              <b>Premium SP ay çarpanı</b> değişti: <Chip>×1.0</Chip> → <Chip tone="amber">×1.20</Chip>
              <br />
              <small className="text-muted">Sebep: Mayıs Premium SP kampanyası</small>
            </div>
            <div className="rowflex">
              <Chip tone="amber">Onay bekliyor</Chip>
            </div>
          </div>

          <div className="audit-row">
            <div className="audit-row__ts">
              14:18
              <br />
              17 Haz
            </div>
            <div className="audit-row__who">
              <Avatar initials="AD" gradient={gradients.greenTeal} />
              <div>
                <div className="b">Ali Demir</div>
                <small className="text-muted">Admin · Bölge yetkisi</small>
              </div>
            </div>
            <div className="audit-row__what">
              Bayi <b>Ahmet Yıldız (İzmir)</b> Mayıs ligine <Chip tone="green">Include</Chip>
              <br />
              <small className="text-muted">Sebep: Mağaza taşınması, veri eksik</small>
            </div>
            <div className="rowflex">
              <Chip tone="green">Onaylandı</Chip>
            </div>
          </div>

          <div className="audit-row">
            <div className="audit-row__ts">
              11:03
              <br />
              17 Haz
            </div>
            <div className="audit-row__who">
              <Avatar initials="MR" gradient={gradients.amberOrange} />
              <div>
                <div className="b">Mert Reis</div>
                <small className="text-muted">Super Admin</small>
              </div>
            </div>
            <div className="audit-row__what">
              Bölge bonus oranları güncellendi: <Chip>1.Bölge +%5</Chip> → <Chip tone="amber">+%6</Chip>
              <br />
              <small className="text-muted">Sebep: 2026 strateji onayı</small>
            </div>
            <div className="rowflex">
              <Chip tone="green">Onaylandı</Chip>
            </div>
          </div>

          <div className="audit-row">
            <div className="audit-row__ts">
              09:47
              <br />
              16 Haz
            </div>
            <div className="audit-row__who">
              <Avatar initials="MA" gradient={gradients.bluePurple} />
              <div>
                <div className="b">Murat Aslan</div>
                <small className="text-muted">Admin · Lig yetkisi</small>
              </div>
            </div>
            <div className="audit-row__what">
              Segmentasyon ağırlığı önerildi: <Chip>%50</Chip> → <Chip>%55</Chip>
              <br />
              <small className="text-muted">Reddedildi: 2 ana başlık dengesi bozulurdu</small>
            </div>
            <div className="rowflex">
              <Chip tone="red">Reddedildi</Chip>
            </div>
          </div>

          <div className="audit-row">
            <div className="audit-row__ts">
              17:22
              <br />
              15 Haz
            </div>
            <div className="audit-row__who">
              <Avatar initials="BŞ" gradient={gradients.blueSky} />
              <div>
                <div className="b">Burcu Şahin</div>
                <small className="text-muted">Admin · Rozet yetkisi</small>
              </div>
            </div>
            <div className="audit-row__what">
              <b>Streak Avcısı rozeti</b> sistemwide aktive edilmek istendi
              <br />
              <small className="text-muted">Sebep: Pilot başarılı</small>
            </div>
            <div className="rowflex">
              <Chip tone="amber">Onay bekliyor</Chip>
            </div>
          </div>

          <div className="audit-row">
            <div className="audit-row__ts">
              13:55
              <br />
              15 Haz
            </div>
            <div className="audit-row__who">
              <Avatar initials="MR" gradient={gradients.amberOrange} />
              <div>
                <div className="b">Mert Reis</div>
                <small className="text-muted">Super Admin</small>
              </div>
            </div>
            <div className="audit-row__what">
              Stratejik ürün havuzuna <b>Yüksek TL Paket</b> eklendi · pilot mod
              <br />
              <small className="text-muted">Sebep: Q2 strateji genişletme</small>
            </div>
            <div className="rowflex">
              <Chip tone="green">Onaylandı</Chip>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
