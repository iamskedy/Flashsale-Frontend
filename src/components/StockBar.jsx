export default function StockBar({ stock, total }) {
  const pct = total > 0 ? Math.round((stock / total) * 100) : 0
  const color =
    pct <= 15 ? 'var(--red)' :
    pct <= 40 ? 'var(--gold)' :
    'var(--green)'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
          {stock === 0 ? 'Sold out' : 'Stock remaining'}
        </span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500, color }}>
          {stock === 0 ? '❌ Gone' : `${stock} left (${pct}%)`}
        </span>
      </div>
      <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}
