import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { getSocket } from '../socket/socket'

const inputStyle = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border2)',
  borderRadius: 10,
  padding: '12px 16px',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: "'DM Sans',sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text2)',
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  marginBottom: 8,
  display: 'block',
}

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data =
        mode === 'login'
          ? await authApi.login(email, password)
          : await authApi.register(email, password)
      login(data.token, data.user.id, data.user.role)
      getSocket() // init WebSocket right after login
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 98px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="slide-up" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 20,
        padding: 40,
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse,var(--orange-glow),transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: 40, marginBottom: 12, textAlign: 'center' }}>⚡</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: 2, color: 'var(--text)', marginBottom: 8 }}>
          {mode === 'login' ? 'Welcome Back' : 'Join FlashSale'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 32 }}>
          {mode === 'login' ? 'Sign in to access live deals.' : 'Create an account to start shopping.'}
        </div>

        {error && (
          <div style={{
            background: '#ff4f6a18',
            border: '1px solid #ff4f6a44',
            color: 'var(--red)',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 20,
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email</label>
          <input
            className="form-input"
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Password</label>
          <input
            className="form-input"
            style={inputStyle}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        <button
          className="btn-orange"
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            background: 'var(--orange)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {loading
            ? <><span className="spin">⟳</span> Signing in...</>
            : `⚡ ${mode === 'login' ? 'Sign In' : 'Create Account'}`
          }
        </button>

        <div style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center', marginTop: 24 }}>
          {mode === 'login'
            ? <>Don't have an account?{' '}
                <span
                  style={{ color: 'var(--orange)', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => { setMode('register'); setError('') }}
                >Sign up</span>
              </>
            : <>Already have an account?{' '}
                <span
                  style={{ color: 'var(--orange)', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => { setMode('login'); setError('') }}
                >Sign in</span>
              </>
          }
        </div>
      </div>
    </div>
  )
}
