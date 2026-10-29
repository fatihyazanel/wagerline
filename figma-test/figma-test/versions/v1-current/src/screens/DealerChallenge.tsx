import { Target, Flame } from 'lucide-react'
import { CardHead, Chip, ChallengeCard, FlowSteps } from '../components/ui'

export default function DealerChallenge() {
  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead
            title="Challenge Akışı"
            inlineSub="· 6 adımlı çalışma mantığı (PDF Slide 4)"
          />
          <FlowSteps
            steps={[
              { title: 'Sistem Önerisi', desc: 'Trend + hedef + bölge stretch ile aday oluştur', state: 'done' },
              { title: 'Yönetici İncelemesi', desc: 'CSM alternatif önerir veya onaylar', state: 'done' },
              { title: 'Oluşturma', desc: 'Yönetici doğrudan oluşturur (manuel mod)', state: 'done' },
              { title: 'Tarih & Onay', desc: 'Dönem onayı ve bayiye atama', state: 'done' },
              { title: 'Takip & Puan', desc: 'Başarıda puan otomatik uygulanır', state: 'active' },
              { title: 'Sonuç Görünür', desc: 'Dönem sonunda sonuç açıklanır' },
            ]}
          />
        </section>

        <div className="grid-2">
          {/* LEFT */}
          <section className="card card__pad">
            <CardHead
              title="Bu ayki Challenge"
              right={<Chip tone="green">Aktif · 8 gün kaldı</Chip>}
            />
            <ChallengeCard
              icon={<Target size={86} />}
              tag="STRATEJİK ÜRÜN · MAYIS 2026"
              title="5G destekli cihaz satışında ay sonuna 30 adete ulaş"
              desc="Sistem geçmiş 3 ay 5G performansına + bölge ortalamasına bakarak bu hedefi önerdi. CSM'in Selin Yıldız onayladı."
              progress={60}
              pmetaLeft="18 / 30 adet · %60"
              pmetaRight="Tahmini bitiş: 28 May"
            />
            <div style={{ marginTop: 16 }}>
              <h4 style={{ fontSize: 13, marginBottom: 8 }}>📐 Hedef Mantığı</h4>
              <div
                className="text-sm"
                style={{
                  background: 'var(--page-bg)',
                  padding: 14,
                  borderRadius: 10,
                  lineHeight: 1.7,
                  fontSize: 13,
                }}
              >
                • Son 3 ay 5G ortalaman: <b>22 adet/ay</b>
                <br />• Bölge (Marmara) ortalaması: <b>26 adet/ay</b>
                <br />• Önerilen stretch hedef: <b>30 adet</b> (bölge ort. +%15)
                <br />• Streak çarpanı: <b>×1.10</b> (3 ay üst üste tamamlama)
                <br />• Toplam ödül: <b>+250 puan</b>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="card card__pad">
            <CardHead title="Geçmiş Challenge'lar" />
            <div className="stack-sm">
              <div className="listbox listbox--green">
                <Chip tone="green">✓</Chip>
                <div className="listbox__grow">
                  <div className="b">Nisan · Segmentasyon</div>
                  <div className="text-sm text-muted">Hedef: Kulvar +1 → Sonuç: +2</div>
                </div>
                <div className="b">+200</div>
              </div>
              <div className="listbox listbox--green">
                <Chip tone="green">✓</Chip>
                <div className="listbox__grow">
                  <div className="b">Mart · 5G</div>
                  <div className="text-sm text-muted">25 adet → 28 adet</div>
                </div>
                <div className="b">+250</div>
              </div>
              <div className="listbox listbox--red">
                <Chip tone="red">✕</Chip>
                <div className="listbox__grow">
                  <div className="b">Şubat · Fiber</div>
                  <div className="text-sm text-muted">%15 → %12.3</div>
                </div>
                <div className="b text-muted">0</div>
              </div>
              <div className="listbox listbox--green">
                <Chip tone="green">✓</Chip>
                <div className="listbox__grow">
                  <div className="b">Ocak · Premium SP</div>
                  <div className="text-sm text-muted">%18 → %22</div>
                </div>
                <div className="b">+220</div>
              </div>
            </div>
            <div className="spread" style={{ marginTop: 16 }}>
              <span className="text-sm text-muted">4 ayda 3 başarı · %75 tamamlama</span>
              <span className="streak-pill" style={{ fontSize: 11, padding: '6px 10px' }}>
                <Flame size={13} /> 3 ay streak
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
