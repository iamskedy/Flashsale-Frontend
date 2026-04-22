export default function Ticker() {
  const items = [
    '⚡ FLASH SALE LIVE NOW',
    '🔥 Limited Stock Remaining',
    '⏱ Real-time updates via WebSocket',
    '🚀 50,000 users online',
    '💥 Zero overselling — Redis Lua atomic',
    '⚡ Sub-15ms purchase response',
    '🎯 New drops every hour',
    '🔒 SSL Secured Payments',
  ]
  const doubled = [...items, ...items]

  return (
    <div style={{ overflow: 'hidden', background: 'var(--orange)', padding: '10px 0' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 20s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            fontWeight: 500,
            color: '#fff',
            padding: '0 28px',
            letterSpacing: 1,
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.6)', borderRadius: '50%', display: 'inline-block' }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
