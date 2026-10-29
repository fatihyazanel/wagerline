'use client'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#050816',
      borderTop: '1px solid #263149',
      padding: '32px',
      marginTop: '48px',
    }}>
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '48px',
      }}>
        {/* Left: Logo & Copyright */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 900, marginBottom: '12px' }}>
            WAGER<span style={{ color: '#FFD400' }}>line</span>
          </div>
          <p style={{ fontSize: '10px', color: '#737C8F' }}>
            © 2026 All rights reserved.
          </p>
        </div>

        {/* Center: Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          {['About Us', 'Contact', 'Privacy Policy', 'Terms of Use'].map(link => (
            <a key={link} href="#" style={{
              fontSize: '10px',
              color: '#737C8F',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}>
              {link}
            </a>
          ))}
        </div>

        {/* Right: Languages */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', textAlign: 'right' }}>
          {['🇬🇧 English', '🇪🇸 Español', '🇸🇦 العربية'].map(lang => (
            <span key={lang} style={{
              fontSize: '10px',
              color: '#737C8F',
              cursor: 'pointer',
            }}>
              {lang}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
