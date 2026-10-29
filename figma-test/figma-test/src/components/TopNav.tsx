import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { roles, roleOrder } from '../app/roles'
import { useRouter } from '../app/router'
import { NavIconGlyph } from './navIcons'

export default function TopNav() {
  const { role, screen, setRole, go } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const current = roles[role]

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <nav className="topnav">
      <div className="topnav__logo">SALES CHAMPIONS LEAGUE</div>

      <div className="topnav__links">
        {current.nav.map((item) => (
          <button
            key={item.screen}
            className={`topnav__link${screen === item.screen ? ' is-active' : ''}`}
            onClick={() => go(item.screen)}
          >
            <NavIconGlyph name={item.icon} />
            <span>{item.label}</span>
            {item.badge && <span className="navbadge">{item.badge}</span>}
          </button>
        ))}
      </div>

      <div className="topnav__spacer" />

      <div className="roleswitch" ref={menuRef}>
        <button className="roleswitch__btn" onClick={() => setMenuOpen((v) => !v)}>
          <span>Rol: {current.short}</span>
          <ChevronDown size={14} style={{ opacity: 0.85 }} />
        </button>
        {menuOpen && (
          <div className="roleswitch__menu">
            <div className="roleswitch__title">Rol Değiştir (demo)</div>
            {roleOrder.map((key) => {
              const r = roles[key]
              return (
                <button
                  key={key}
                  className={`roleswitch__item${key === role ? ' is-active' : ''}`}
                  onClick={() => {
                    setRole(key)
                    setMenuOpen(false)
                  }}
                >
                  <span className="roleswitch__avatar">{r.user.initials}</span>
                  <span className="roleswitch__meta">
                    {r.label}
                    <small>{r.user.name}</small>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button className="topnav__profile">
        <span>{current.user.name}</span>
        <span className="topnav__avatar">
          {current.user.initials}
          <span className="topnav__badge">3</span>
        </span>
      </button>
    </nav>
  )
}
