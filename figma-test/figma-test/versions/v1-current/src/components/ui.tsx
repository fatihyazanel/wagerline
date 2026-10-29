import { useState, type ReactNode } from 'react'

/* ============================================================
   Shared UI primitives — indigo/light Gamify design system.
   Reused across every role screen.
   ============================================================ */

export type Tone = 'default' | 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'purple'

const toneClass: Record<Tone, string> = {
  default: '',
  brand: 'chip--brand',
  green: 'chip--green',
  red: 'chip--red',
  amber: 'chip--amber',
  blue: 'chip--blue',
  purple: 'chip--purple',
}

export function Chip({
  tone = 'default',
  children,
  style,
}: {
  tone?: Tone
  children: ReactNode
  style?: React.CSSProperties
}) {
  return <span className={`chip ${toneClass[tone]}`} style={style}>{children}</span>
}

/* ---------- Card head ---------- */
export function CardHead({
  icon,
  title,
  sub,
  inlineSub,
  right,
}: {
  icon?: ReactNode
  title: ReactNode
  sub?: ReactNode
  inlineSub?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="card__head card__head--wrap">
      <div>
        <div className="card__title">
          {icon}
          {title}
          {inlineSub && <span className="card__inline-sub">{inlineSub}</span>}
        </div>
        {sub && <p className="card__subtitle">{sub}</p>}
      </div>
      {right && <div className="head-right">{right}</div>}
    </div>
  )
}

/* ---------- Hint / callout ---------- */
export function Hint({
  tone = 'brand',
  icon,
  children,
}: {
  tone?: 'brand' | 'blue' | 'green' | 'amber'
  icon?: ReactNode
  children: ReactNode
}) {
  const cls = tone === 'brand' ? 'hint' : `hint hint--${tone}`
  return (
    <div className={cls}>
      {icon}
      <div>{children}</div>
    </div>
  )
}

/* ---------- Stat card ---------- */
export function StatCard({
  label,
  value,
  sub,
  pill,
  pillTone = 'green',
}: {
  label: ReactNode
  value: ReactNode
  sub?: ReactNode
  pill?: ReactNode
  pillTone?: Tone
}) {
  return (
    <article className="card statcard">
      <div className="statcard__head">
        {label}
        {pill && <Chip tone={pillTone}>{pill}</Chip>}
      </div>
      <div className="statcard__val">{value}</div>
      {sub && <div className="statcard__sub">{sub}</div>}
    </article>
  )
}

/* ---------- Progress bar ---------- */
export function Progress({
  value,
  tone,
  className,
}: {
  value: number
  tone?: 'purple' | 'blue' | 'green' | 'amber'
  className?: string
}) {
  return (
    <div className={`progress ${tone ? `progress--${tone}` : ''} ${className ?? ''}`}>
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

/* ---------- Metric row ---------- */
export function MetricRow({
  icon,
  iconBg,
  iconColor,
  name,
  sub,
  progress,
  progressTone,
  value,
  valueSub,
  box,
}: {
  icon: ReactNode
  iconBg: string
  iconColor: string
  name: ReactNode
  sub?: ReactNode
  progress?: number
  progressTone?: 'purple' | 'blue' | 'green' | 'amber'
  value: ReactNode
  valueSub?: ReactNode
  box?: boolean
}) {
  return (
    <div className={`metric-row ${box ? 'metric-row--box' : ''}`}>
      <div className="metric-icon" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="metric-name">
        {name}
        {sub && <small>{sub}</small>}
      </div>
      {progress != null ? <Progress value={progress} tone={progressTone} /> : <div className="grow" />}
      <div className="metric-val">
        {value}
        {valueSub && <small>{valueSub}</small>}
      </div>
    </div>
  )
}

/* ---------- Avatar ---------- */
export function Avatar({
  initials,
  gradient,
  className,
}: {
  initials: string
  gradient: string
  className?: string
}) {
  return (
    <span className={`avatar-sm ${className ?? ''}`} style={{ background: gradient }}>
      {initials}
    </span>
  )
}

export const gradients = {
  bluePurple: 'linear-gradient(135deg, #4a6bff, #8b5cf6)',
  amberOrange: 'linear-gradient(135deg, #e17100, #f54900)',
  greenTeal: 'linear-gradient(135deg, #009966, #34d399)',
  purplePink: 'linear-gradient(135deg, #7c3aed, #c084fc)',
  blueSky: 'linear-gradient(135deg, #155dfc, #5b9bff)',
  redOrange: 'linear-gradient(135deg, #e7000b, #f54900)',
}

/* ---------- Badge card ---------- */
export type Medal = 'amber' | 'purple' | 'blue' | 'green' | 'brand' | 'bronz'

export function BadgeCard({
  icon,
  medal = 'amber',
  name,
  desc,
  mult,
  lock,
  locked,
}: {
  icon: ReactNode
  medal?: Medal
  name: ReactNode
  desc?: ReactNode
  mult?: ReactNode
  lock?: ReactNode
  locked?: boolean
}) {
  return (
    <div className={`badge-card ${locked ? 'is-locked' : ''}`}>
      {lock && <span className="badge-card__lock">{lock}</span>}
      <div className={`badge-medal badge-medal--${medal}`}>{icon}</div>
      <div className="badge-card__name">{name}</div>
      {desc && <div className="badge-card__desc">{desc}</div>}
      {mult && <div className="badge-card__mult">{mult}</div>}
    </div>
  )
}

/* ---------- Challenge card (vivid) ---------- */
export function ChallengeCard({
  tag,
  title,
  desc,
  progress,
  pmetaLeft,
  pmetaRight,
  icon,
}: {
  tag: ReactNode
  title: ReactNode
  desc?: ReactNode
  progress?: number
  pmetaLeft?: ReactNode
  pmetaRight?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="challengecard">
      {icon && <div className="challengecard__icon">{icon}</div>}
      <span className="challengecard__tag">{tag}</span>
      <div className="challengecard__title">{title}</div>
      {desc && <div className="challengecard__desc">{desc}</div>}
      {progress != null && (
        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {(pmetaLeft || pmetaRight) && (
        <div className="challengecard__pmeta">
          <span>{pmetaLeft}</span>
          <span>{pmetaRight}</span>
        </div>
      )}
    </div>
  )
}

/* ---------- Donut ---------- */
export type DonutSegment = { pct: number; color: string; label: string; value: ReactNode }

export function Donut({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: DonutSegment[]
  centerValue: ReactNode
  centerLabel: ReactNode
}) {
  const C = 314.159 // 2πr, r=50
  let offset = 0
  return (
    <div className="donut-wrap">
      <div className="donut">
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r="50" fill="none" stroke="var(--chip-bg)" strokeWidth="20" />
          {segments.map((s, i) => {
            const len = (s.pct / 100) * C
            const dash = `${len} ${C}`
            const dashOffset = -offset
            offset += len
            return (
              <circle
                key={i}
                cx="65"
                cy="65"
                r="50"
                fill="none"
                stroke={s.color}
                strokeWidth="20"
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
              />
            )
          })}
        </svg>
        <div className="donut__center">
          <div>
            <div className="v">{centerValue}</div>
            <div className="l">{centerLabel}</div>
          </div>
        </div>
      </div>
      <div className="legend">
        {segments.map((s, i) => (
          <div className="legend__row" key={i}>
            <span className="legend__dot" style={{ background: s.color }} />
            {s.label}
            <span className="legend__val">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Region podium card ---------- */
export function RegionCard({
  rank,
  medal,
  name,
  badge,
  sub,
  bonus,
}: {
  rank: 'gold' | 'silver' | 'bronze'
  medal: ReactNode
  name: ReactNode
  badge?: ReactNode
  sub: ReactNode
  bonus: ReactNode
}) {
  return (
    <div className={`regioncard regioncard--${rank}`}>
      <div className="regioncard__medal">{medal}</div>
      <div className="regioncard__info">
        <div className="regioncard__nm">
          {name}
          {badge}
        </div>
        <div className="regioncard__sub">{sub}</div>
      </div>
      <div className="regioncard__bonus">
        {bonus}
        <small>Bonus</small>
      </div>
    </div>
  )
}

/* ---------- Flow steps ---------- */
export type FlowStep = { title: string; desc: string; state?: 'done' | 'active' }

export function FlowSteps({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="flow">
      {steps.map((s, i) => (
        <div key={i} className={`flow-step ${s.state ? `is-${s.state}` : ''}`}>
          <div className="flow-step__num">{s.state === 'done' ? '✓' : i + 1}</div>
          <div className="flow-step__title">{s.title}</div>
          <div className="flow-step__desc">{s.desc}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Switch (self-toggling, prototype-fidelity) ---------- */
export function Switch({ on = false, locked = false }: { on?: boolean; locked?: boolean }) {
  const [state, setState] = useState(on)
  return (
    <button
      type="button"
      className={`switch ${state && !locked ? 'is-on' : ''} ${locked ? 'is-locked' : ''}`}
      aria-pressed={state}
      onClick={() => !locked && setState((v) => !v)}
    />
  )
}

/* ---------- Segmented tabs (self-managing) ---------- */
export function SegTabs({ tabs, defaultIndex = 0 }: { tabs: string[]; defaultIndex?: number }) {
  const [active, setActive] = useState(defaultIndex)
  return (
    <div className="segtabs">
      {tabs.map((t, i) => (
        <button key={t} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)}>
          {t}
        </button>
      ))}
    </div>
  )
}

/* ---------- Manager note ---------- */
export function ManagerNote({
  initials,
  name,
  role,
  text,
  date,
}: {
  initials: string
  name: ReactNode
  role?: ReactNode
  text: ReactNode
  date?: ReactNode
}) {
  return (
    <div className="mgr-note">
      <div className="mgr-note__head">
        <Avatar initials={initials} gradient="linear-gradient(135deg, #155dfc, #7c3aed)" />
        <div>
          <div className="mgr-note__name">{name}</div>
          {role && <div className="mgr-note__role">{role}</div>}
        </div>
      </div>
      <div className="mgr-note__text">{text}</div>
      {date && <div className="mgr-note__date">{date}</div>}
    </div>
  )
}
