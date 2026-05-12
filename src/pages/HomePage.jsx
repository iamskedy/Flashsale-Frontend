import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { salesApi } from '../api/sales.api'
import StockBar from '../components/StockBar'

const EMOJIS = ['🎧', '📱', '💻', '⌚', '🎮', '🖥️', '📷', '🔊']

export default function HomePage() {
  const { data: sales } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getSales,
    staleTime: 30_000,
    retry: 1,
  })
  console.log('sales data:', sales)

  const activeSales = sales?.filter((s) => s.status === 'active') ?? []

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '90px 32px 70px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, var(--orange-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Live badge */}
        <div className="slide-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--surface2)',
          border: '1px solid var(--border2)',
          borderRadius: 20,
          padding: '6px 16px',
          fontSize: 12, fontWeight: 500, color: 'var(--orange)',
          marginBottom: 28, letterSpacing: 0.5,
        }}>
          <div className="pulse" style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%' }} />
          🔥 Flash Sale — Live Now
        </div>

        {/* Headline */}
        <h1 className="slide-up" style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 'clamp(56px,10vw,96px)',
          letterSpacing: 4,
          lineHeight: 0.95,
          color: 'var(--text)',
          marginBottom: 24,
          animationDelay: '0.05s',
        }}>
          DEALS THAT <span style={{ color: 'var(--orange)' }}>BURN</span><br />FAST.
        </h1>

        <p className="slide-up" style={{
          fontSize: 16,
          color: 'var(--text2)',
          maxWidth: 520,
          lineHeight: 1.7,
          marginBottom: 40,
          animationDelay: '0.1s',
        }}>
          Up to 70% off on top products — for a limited time only. Once it's gone, it's gone.
        </p>

        {/* CTA Buttons */}
        <div className="slide-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.15s' }}>
          <Link to="/sales" className="btn-orange" style={{
            background: 'var(--orange)', color: '#fff',
            fontSize: 14, fontWeight: 600,
            border: 'none', borderRadius: 10,
            padding: '13px 28px', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            ⚡ Shop the Sale
          </Link>
          <Link to="/orders" style={{
            background: 'transparent', color: 'var(--text)',
            fontSize: 14, fontWeight: 500,
            border: '1px solid var(--border2)', borderRadius: 10,
            padding: '13px 28px', textDecoration: 'none',
          }}>
            My Orders
          </Link>
        </div>

        {/* Stats */}
        <div className="slide-up" style={{
          display: 'flex', gap: 48,
          marginTop: 64, paddingTop: 48,
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap', justifyContent: 'center',
          animationDelay: '0.2s',
        }}>
          {[
            ['50K+', 'Users online'],
            ['₹0', 'Oversells ever'],
            [String(activeSales.length || 0), 'Active deals'],
            ['8ms', 'Response time'],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 2, color: 'var(--orange)' }}>
                {v}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's Drops ── */}
      {sales?.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: 'var(--text)' }}>
              Today's <span style={{ color: 'var(--orange)' }}>Drops</span>
            </div>
            <Link to="/sales" style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 500, textDecoration: 'none' }}>
              View all deals →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {sales.slice(0, 3).map((sale, idx) => (
              <Link key={sale.id} to={`/sales/${sale.id}`} style={{ textDecoration: 'none' }}>
                <div className="sale-card" style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}>
                  {/* Image area */}
                  <div style={{
                    height: 160,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--surface2), var(--surface3))',
                    fontSize: 64,
                  }}>
                    <div className="float">{EMOJIS[idx % EMOJIS.length]}</div>
                  </div>

                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                      {sale.product?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'var(--orange)' }}>
                        ₹{sale.salePrice}
                      </span>
                      {sale.product?.basePrice && (
                        <span style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'line-through' }}>
                          ₹{sale.product.basePrice}
                        </span>
                      )}
                    </div>
                    <StockBar stock={sale.liveStock ?? sale.totalStock} total={sale.totalStock} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Features strip ── */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32,
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        {[
          ['⚡', 'Lightning Fast', 'Sub-15ms purchase response. Your order is secured in milliseconds.'],
          ['🔒', 'Zero Oversells', 'Atomic Redis Lua scripts guarantee no stock goes negative — ever.'],
          ['📡', 'Live Updates', 'WebSocket-powered real-time stock and order status updates.'],
          ['🎯', 'Fair & Transparent', 'One item per user per sale. No bots, no bulk buyers.'],
        ].map(([icon, title, desc]) => (
          <div key={title}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
