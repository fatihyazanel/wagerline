import { Avatar, CardHead, Chip, SegTabs, StatCard, gradients } from '../components/ui'
import { auditRows } from '../gamificationDemo'

export default function AdminAudit() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="Bugunku islem" value="12" sub="4 kural, 5 onay, 3 sistem" />
          <StatCard label="Bekleyen onay" pill="!" pillTone="red" value="2" sub="Super admin aksiyonu" />
          <StatCard label="ICM fark kaydi" value="3" sub="Ay sonu kontrol bekliyor" />
          <StatCard label="Aktif kural seti" value="Temmuz" sub="Snapshot yayinda" />
        </div>

        <section className="card card__pad">
          <CardHead
            title="Audit Log"
            sub="Tum degisikliklerde yapan kisi, onaylayan kisi, durum ve kural etkisi saklanir."
            right={<><SegTabs tabs={['Hepsi', 'Onay bekleyen', 'Yayinda']} /><button className="btn btn--ghost">CSV</button></>}
          />
          {auditRows.map((row, index) => (
            <div className="audit-row" key={`${row.time}-${row.action}`}>
              <div className="audit-row__ts">{row.time.split(' ')[2] ?? row.time}<br />{row.time.split(' ').slice(0, 2).join(' ')}</div>
              <div className="audit-row__who">
                <Avatar
                  initials={row.actor === 'Sistem' ? 'SYS' : row.actor.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                  gradient={index % 2 === 0 ? gradients.amberOrange : gradients.blueSky}
                />
                <div>
                  <div className="b">{row.actor}</div>
                  <small className="text-muted">{row.actor === 'Sistem' ? 'Otomatik islem' : 'Admin kullanici'}</small>
                </div>
              </div>
              <div className="audit-row__what">
                <b>{row.action}</b>
                <br />
                <small className="text-muted">Onaylayan: {row.approver}</small>
              </div>
              <div className="rowflex">
                <Chip tone={row.status.includes('bekliyor') ? 'amber' : row.status === 'Bilgi' ? 'blue' : 'green'}>{row.status}</Chip>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
