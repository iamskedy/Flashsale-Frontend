import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { disconnectSocket } from '../socket/socket'

export default function Nav() {
  const { isAuthenticated, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    disconnectSocket()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: 64,
      background: 'rgba(8,9,12,0.96)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--orange)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>⚡</div>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 2, color: 'var(--text)' }}>
          FlashSale
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[['/', 'Home'], ['/sales', 'Sales'], ['/orders', 'Orders']].map(([path, label]) => (
          <Link key={path} to={path} className="nav-link" style={{
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive(path) ? 'var(--text)' : 'var(--text2)',
            background: isActive(path) ? 'var(--surface2)' : 'transparent',
            padding: '6px 14px',
            borderRadius: 8,
          }}>
            {label}
            {path === '/sales' && (
              <span className="pulse" style={{
                background: 'var(--red)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 10,
                marginLeft: 6,
                display: 'inline-block',
              }}>LIVE</span>
            )}
          </Link>
        ))}

        {isAuthenticated()
          ? (
            <button onClick={handleLogout} style={{
              marginLeft: 8,
              background: 'transparent',
              color: 'var(--text2)',
              fontSize: 13,
              border: '1px solid var(--border2)',
              borderRadius: 8,
              padding: '7px 16px',
              cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              transition: 'border-color 0.15s, color 0.15s',
            }}>
              Log out
            </button>
          )
          : (
            <Link to="/login" className="btn-orange" style={{
              marginLeft: 8,
              background: 'var(--orange)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              Sign In
            </Link>
          )
        }
      </div>
    </nav>
  )
}
