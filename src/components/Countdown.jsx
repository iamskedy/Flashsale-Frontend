import { useState, useEffect } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function Countdown({ targetTime, label }) {
  const calc = () => {
    const d = Math.max(0, new Date(targetTime).getTime() - Date.now())
    return {
      h: Math.floor(d / 3600000),
      m: Math.floor((d % 3600000) / 60000),
      s: Math.floor((d % 60000) / 1000),
    }
  }

  const [t, setT] = useState(calc)

  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(i)
  }, [targetTime])

  const units = [['h', t.h, 'Hours'], ['m', t.m, 'Mins'], ['s', t.s, 'Secs']]

  return (
    <div>
      {label && (
        <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {units.map(([unit, val, fullLabel], i) => (
          <div key={unit} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 42,
                letterSpacing: 2,
                color: 'var(--orange)',
                lineHeight: 1,
                background: 'var(--surface)',
                padding: '4px 12px',
                borderRadius: 8,
                border: '1px solid var(--border2)',
                minWidth: 56,
                display: 'block',
                textAlign: 'center',
              }}>
                {pad(val)}
              </span>
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
                {fullLabel}
              </div>
            </div>
            {i < 2 && (
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: 'var(--text3)', marginBottom: 16 }}>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
