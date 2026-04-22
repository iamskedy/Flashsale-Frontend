import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { salesApi } from '../api/sales.api'
import { useSaleStore } from '../store/sale.store'
import StockBar from '../components/StockBar'
import Countdown from '../components/Countdown'

const EMOJIS = ['🎧', '📱', '💻', '⌚', '🎮', '🖥️', '📷', '🔊']

function discountPct(sale) {
  const base = parseFloat(sale.product?.basePrice || sale.salePrice)
  const price = parseFloat(sale.salePrice)
  if (!base || base <= price) return 0
  return Math.round((1 - price / base) * 100)
}

export default function SalesPage() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getSales,
    refetchInterval: 30_000,
    retry: 1,
  })
  const getStock = useSaleStore((s) => s.getStock)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, color: 'var(--text2)' }}>
        <span className="spin" style={{ fontSize: 24, marginRight: 12 }}>⟳</span> Loading sales...
      </div>
    )
  }

  const activeSale = sales?.find((s) => s.status === 'active')
  const liveCount = sales?.filter((s) => s.status === 'active').length ?? 0
  const endedCount = sales?.filter((s) => s.status === 'ended').length ?? 0

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px', position: 'relative', zIndex: 1 }}>

      {/* ── Live Banner ── */}
      {activeSale && (
        <div className="slide-up" style={{
          background: 'linear-gradient(135deg, var(--surface2), var(--surface3))',
          border: '1px solid var(--border2)',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top gradient line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
          }} />
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, fontWeight: 700,
              color: 'var(--orange)', letterSpacing: 2, textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              <div className="pulse" style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', boxShadow: '0 0 8px var(--red)' }} />
              Live Flash Sale
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>
              ⚡ {activeSale.product?.name} — Limited Time
            </div>
          </div>
          <Countdown targetTime={activeSale.endTime} label="Ends in" />
        </div>
      )}

      {/* ── Section Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: 'var(--text)' }}>
          All <span style={{ color: 'var(--orange)' }}>Deals</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>
          {liveCount} live · {endedCount} ended
        </span>
      </div>

      {/* ── Empty state ── */}
      {!sales?.length && (
        <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '60px 0' }}>
          No sales right now. Check back soon!
        </p>
      )}

      {/* ── Product Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {sales?.map((sale, idx) => {
          const liveStock = getStock(sale.id)
          const stock = liveStock ?? sale.totalStock
          const off = discountPct(sale)
          const isActive = sale.status === 'active'
          const isSoldOut = stock === 0

          return (
            <Link key={sale.id} to={`/sales/${sale.id}`} style={{ textDecoration: 'none' }}>
              <div className="sale-card" style={{
                background: 'var(--surface)',
                border: `1px solid ${isActive ? 'var(--border2)' : 'var(--border)'}`,
                borderRadius: 16,
                overflow: 'hidden',
                opacity: sale.status === 'ended' ? 0.7 : 1,
              }}>
                {/* Card image */}
                <div style={{
                  height: 200,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--surface2), var(--surface3))',
                  position: 'relative',
                }}>
                  <div className="float" style={{ fontSize: 72 }}>
                    {sale.product?.imageUrl
                      ? <img src={sale.product.imageUrl} style={{ width: 90, height: 90, objectFit: 'contain' }} alt="" />
                      : EMOJIS[idx % EMOJIS.length]
                    }
                  </div>
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    {isActive && (
                      <span className="pulse" style={{ background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        ● Live
                      </span>
                    )}
                    {off > 0 && (
                      <span style={{ background: 'var(--orange)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        {off}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Flash Deal
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                    {sale.product?.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
                    {sale.product?.description?.slice(0, 80)}...
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: 'var(--orange)' }}>
                      ₹{sale.salePrice}
                    </span>
                    {sale.product?.basePrice && (
                      <span style={{ fontSize: 16, color: 'var(--text3)', textDecoration: 'line-through' }}>
                        ₹{sale.product.basePrice}
                      </span>
                    )}
                    {off > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: '#22d87a18', padding: '3px 8px', borderRadius: 4 }}>
                        -{off}%
                      </span>
                    )}
                  </div>
                  <StockBar stock={stock} total={sale.totalStock} />
                  <div style={{
                    width: '100%', padding: 13, borderRadius: 10,
                    fontSize: 14, fontWeight: 600, textAlign: 'center',
                    background: isActive && !isSoldOut ? 'var(--orange)' : 'var(--surface3)',
                    color: isActive && !isSoldOut ? '#fff' : 'var(--text3)',
                  }}>
                    {isSoldOut ? '😔 Sold Out' : isActive ? '⚡ View Deal' : sale.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
