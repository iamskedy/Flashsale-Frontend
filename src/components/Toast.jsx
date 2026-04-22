const borderColor = {
  success: 'var(--green)',
  error: 'var(--red)',
  info: 'var(--blue)',
}

export default function Toast({ toasts }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: 'var(--surface2)',
          borderRadius: 12,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 280,
          maxWidth: 360,
          border: `1px solid var(--border2)`,
          borderLeft: `3px solid ${borderColor[t.type] || 'var(--blue)'}`,
          animation: 'toast-in 0.3s ease',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          pointerEvents: 'auto',
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.title}</div>
            <div style={{ color: 'var(--text2)' }}>{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
