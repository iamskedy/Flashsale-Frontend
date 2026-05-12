import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

const navItems = [
  { to: '/admin',          label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '📦 Products'            },
  { to: '/admin/sales',    label: '⚡ Flash Sales'          },
]

const sidebarStyle = {
  width: 220,
  minHeight: '100vh',
  background: 'var(--surface)',
  borderRight: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  padding: '32px 0',
  flexShrink: 0,
}

const linkBase = {
  display: 'block',
  padding: '11px 28px',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text2)',
  textDecoration: 'none',
  borderLeft: '3px solid transparent',
  transition: 'all 0.18s',
}

const linkActive = {
  ...linkBase,
  color: 'var(--orange)',
  background: 'var(--surface2)',
  borderLeftColor: 'var(--orange)',
}

export default function AdminLayout() {
  const logout   = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Sidebar ── */}
      <aside style={sidebarStyle}>
        {/* Logo */}
        <div style={{ padding: '0 28px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 2, color: 'var(--orange)' }}>
            ⚡ ADMIN
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Flash Sale System</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, paddingTop: 24 }}>
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => isActive ? linkActive : linkBase}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0 28px', borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px 0', borderRadius: 8,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              color: 'var(--text2)', fontSize: 13, cursor: 'pointer',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}