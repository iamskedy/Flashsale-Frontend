const base = {
  width: '100%',
  padding: '14px 24px',
  borderRadius: 10,
  border: 'none',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontFamily: "'DM Sans',sans-serif",
  letterSpacing: 0.3,
}

export default function BuyButton({ state, onClick, disabled, price }) {
  if (disabled && state === 'idle') {
    return (
      <button style={{ ...base, background: 'var(--surface3)', color: 'var(--text3)', cursor: 'not-allowed' }}>
        😔 Sold Out
      </button>
    )
  }

  if (state === 'loading' || state === 'processing') {
    return (
      <button style={{ ...base, background: 'var(--surface3)', color: 'var(--text2)', cursor: 'wait' }}>
        <span className="spin">⟳</span>
        {state === 'loading' ? ' Confirming order...' : ' Processing payment...'}
      </button>
    )
  }

  if (state === 'success') {
    return (
      <button style={{ ...base, background: '#22d87a22', color: 'var(--green)', border: '1px solid #22d87a44', cursor: 'default' }}>
        ✅ Order Confirmed!
      </button>
    )
  }

  if (state === 'error') {
    return (
      <button style={{ ...base, background: '#ff4f6a18', color: 'var(--red)', border: '1px solid #ff4f6a44' }} onClick={onClick}>
        ⚠ Failed — Retry
      </button>
    )
  }

  return (
    <button
      className="btn-orange"
      style={{ ...base, background: 'var(--orange)', color: '#fff' }}
      onClick={onClick}
    >
      ⚡ Buy Now{price ? ` — ₹${price}` : ''}
    </button>
  )
}
