// ─── Shared admin UI primitives ──────────────────────────────────────────────
// Matches the existing dark design system: --bg, --surface, --orange, Bebas Neue

export const STATUS_META = {
  active:    { label: 'LIVE',      bg: '#22d87a18', color: 'var(--green)',  dot: 'var(--green)' },
  scheduled: { label: 'SCHEDULED', bg: '#4f9eff18', color: 'var(--blue)',   dot: 'var(--blue)'  },
  ended:     { label: 'ENDED',     bg: '#ffffff08', color: 'var(--text3)',  dot: 'var(--text3)' },
  cancelled: { label: 'CANCELLED', bg: '#ff4f6a18', color: 'var(--red)',    dot: 'var(--red)'   },
}

export function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.ended
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: m.bg, color: m.color,
      fontSize: 10, fontWeight: 700, letterSpacing: 1,
      padding: '4px 10px', borderRadius: 20,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: m.dot,
        animation: status === 'active' ? 'pulse 1.5s infinite' : 'none',
      }} />
      {m.label}
    </span>
  )
}

export function AdminCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border2)',
      borderRadius: 16,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function StatCard({ value, label, accent = 'var(--orange)' }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, letterSpacing: 2, color: accent, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  )
}

const inputBase = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border2)',
  borderRadius: 10,
  padding: '11px 14px',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: "'DM Sans',sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

export function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700,
        color: 'var(--text3)', textTransform: 'uppercase',
        letterSpacing: 0.8, marginBottom: 8,
      }}>
        {label}{required && <span style={{ color: 'var(--orange)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export function Input({ style = {}, ...props }) {
  return (
    <input
      className="form-input"
      style={{ ...inputBase, ...style }}
      {...props}
    />
  )
}

export function Select({ style = {}, children, ...props }) {
  return (
    <select
      style={{ ...inputBase, cursor: 'pointer', ...style }}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ style = {}, ...props }) {
  return (
    <textarea
      className="form-input"
      style={{ ...inputBase, resize: 'vertical', minHeight: 80, ...style }}
      {...props}
    />
  )
}

export function OrangeBtn({ children, style = {}, ...props }) {
  return (
    <button
      className="btn-orange"
      style={{
        background: 'var(--orange)', color: '#fff',
        border: 'none', borderRadius: 10,
        padding: '11px 22px',
        fontSize: 14, fontWeight: 700,
        cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
        display: 'inline-flex', alignItems: 'center', gap: 8,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostBtn({ children, style = {}, danger = false, ...props }) {
  return (
    <button
      style={{
        background: danger ? '#ff4f6a12' : 'transparent',
        color: danger ? 'var(--red)' : 'var(--text2)',
        border: `1px solid ${danger ? '#ff4f6a44' : 'var(--border2)'}`,
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 13, fontWeight: 500,
        cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
        transition: 'all 0.15s',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function Spinner({ size = 24, text = '' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '60px 0', color: 'var(--text2)' }}>
      <span className="spin" style={{ fontSize: size }}>⟳</span>
      {text && <span style={{ fontSize: 14 }}>{text}</span>}
    </div>
  )
}

export function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div className="slide-up" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 20,
        padding: '32px 36px',
        width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Top orange line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
          borderRadius: '20px 20px 0 0',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 2, color: 'var(--text)' }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 8, width: 32, height: 32,
              cursor: 'pointer', fontSize: 16, color: 'var(--text3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toast({ message, type, onClose }) {
  const isErr = type === 'error'
  // Auto-dismiss
  import('react').then(({ useEffect }) => {}) // already imported by callers
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 999,
      background: isErr ? '#ff4f6a18' : '#22d87a18',
      border: `1px solid ${isErr ? '#ff4f6a44' : '#22d87a44'}`,
      color: isErr ? 'var(--red)' : 'var(--green)',
      padding: '12px 20px', borderRadius: 12,
      fontSize: 14, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 12,
      backdropFilter: 'blur(10px)',
      animation: 'toast-in 0.25s ease both',
      maxWidth: 360,
    }}>
      <span style={{ flex: 1 }}>{isErr ? '⚠' : '✅'} {message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 18, padding: 0 }}>×</button>
    </div>
  )
}
