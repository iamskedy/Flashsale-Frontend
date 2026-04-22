export default function OrderStatus({ status }) {
  const map = {
    confirmed: { bg: '#22d87a18', color: 'var(--green)', border: '#22d87a44', label: '✓ Confirmed' },
    pending:   { bg: '#ffd16618', color: 'var(--gold)',  border: '#ffd16644', label: '⏳ Pending' },
    failed:    { bg: '#ff4f6a18', color: 'var(--red)',   border: '#ff4f6a44', label: '✗ Failed' },
    cancelled: { bg: 'var(--surface3)', color: 'var(--text3)', border: 'var(--border)', label: 'Cancelled' },
  }
  const s = map[status] || map.cancelled

  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 12,
      fontWeight: 600,
      padding: '4px 14px',
      borderRadius: 20,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}
