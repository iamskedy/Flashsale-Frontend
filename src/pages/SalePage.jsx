import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { salesApi } from '../api/sales.api'
import { ordersApi } from '../api/orders.api'
import { getSocket } from '../socket/socket'
import { useSaleStore } from '../store/sale.store'
import BuyButton from '../components/BuyButton'
import StockBar from '../components/StockBar'
import Countdown from '../components/Countdown'

function discountPct(sale) {
  const base = parseFloat(sale.product?.basePrice || sale.salePrice)
  const price = parseFloat(sale.salePrice)
  if (!base || base <= price) return 0
  return Math.round((1 - price / base) * 100)
}

export default function SalePage() {
  const { saleId } = useParams()
  const [buyState, setBuyState] = useState('idle')
  const [message, setMessage] = useState('')
  const setStock = useSaleStore((s) => s.setStock)
  const liveStock = useSaleStore((s) => s.getStock(saleId))
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: sale, isLoading } = useQuery({
    queryKey: ['sale', saleId],
    queryFn: () => salesApi.getSale(saleId),
    enabled: Boolean(saleId),
    retry: 1,
  })

  // ── WebSocket subscription ──────────────────────────────────────────────
  useEffect(() => {
    if (!saleId) return
    let socket
    try {
      socket = getSocket()
      socket.emit('subscribe:sale', saleId)

      const onStockUpdate = (data) => {
        if (data.saleId === saleId) setStock(saleId, data.stockRemaining)
      }
      const onOrderConfirmed = (data) => {
        setBuyState('success')
        setMessage(`Order confirmed! Order ID: ${data.orderId.slice(0, 8)}...`)
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      }
      const onOrderFailed = (data) => {
        setBuyState('error')
        setMessage(`Payment failed: ${data.reason}. Stock has been released.`)
      }

      socket.on('stock:update', onStockUpdate)
      socket.on('order:confirmed', onOrderConfirmed)
      socket.on('order:failed', onOrderFailed)

      return () => {
        socket.off('stock:update', onStockUpdate)
        socket.off('order:confirmed', onOrderConfirmed)
        socket.off('order:failed', onOrderFailed)
        socket.emit('unsubscribe:sale', saleId)
      }
    } catch (err) {
      console.warn('[SalePage] WebSocket not available:', err.message)
    }
  }, [saleId, setStock, queryClient])

  const handleBuy = async () => {
    if (!sale || !saleId) return
    const idempotencyKey = crypto.randomUUID()
    setBuyState('loading')
    setMessage('')
    try {
      await ordersApi.purchase(saleId, sale.productId, 1, idempotencyKey)
      setBuyState('processing')
      setMessage("Payment processing... you'll be notified via WebSocket shortly.")
    } catch (err) {
      setBuyState('error')
      setMessage(err.response?.data?.message || 'Purchase failed. Please try again.')
    }
  }

  const handleRetry = () => {
    setBuyState('idle')
    setMessage('')
  }

  // ── Loading / error states ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, color: 'var(--text2)' }}>
        <span className="spin" style={{ fontSize: 24, marginRight: 12 }}>⟳</span> Loading sale...
      </div>
    )
  }

  if (!sale) {
    return (
      <div style={{ padding: 80, textAlign: 'center', color: 'var(--red)' }}>
        ❌ Sale not found.{' '}
        <span onClick={() => navigate('/sales')} style={{ color: 'var(--orange)', cursor: 'pointer' }}>
          Browse all sales →
        </span>
      </div>
    )
  }

  const currentStock = liveStock ?? sale.totalStock
  const off = discountPct(sale)
  const savings = (parseFloat(sale.product?.basePrice || '0') - parseFloat(sale.salePrice)).toLocaleString()
  const isActive = sale.status === 'active'
  const isSoldOut = currentStock === 0

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px', position: 'relative', zIndex: 1 }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/sales')}
        style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', marginBottom: 28, fontSize: 13, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ← Back to Sales
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

        {/* ── Left: Product Visual ── */}
        <div className="slide-up" style={{
          background: 'linear-gradient(135deg, #0f1117, #1a0a03)',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 420,
        }}>
          {/* Glow orb */}
          <div style={{
            position: 'absolute', bottom: -60, left: -60,
            width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(ellipse, var(--orange-glow), transparent 70%)',
          }} />

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--orange)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            {isActive && (
              <div className="pulse" style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', boxShadow: '0 0 8px var(--red)' }} />
            )}
            {isActive ? 'Live Flash Sale' : sale.status.toUpperCase()}
          </div>

          {/* Product icon */}
          <div className="float" style={{ fontSize: 88, marginBottom: 20, position: 'relative' }}>
            {sale.product?.imageUrl
              ? <img src={sale.product.imageUrl} style={{ width: 100, objectFit: 'contain' }} alt={sale.product?.name} />
              : '🎧'
            }
          </div>

          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 42, letterSpacing: 2, lineHeight: 1.05, color: 'var(--text)', marginBottom: 14 }}>
            {sale.product?.name}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
            {sale.product?.description}
          </div>
        </div>

        {/* ── Right: Purchase Panel ── */}
        <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, animationDelay: '0.08s' }}>

          {/* Price block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 60, color: 'var(--orange)', letterSpacing: 2, lineHeight: 1 }}>
                ₹{sale.salePrice}
              </span>
              {sale.product?.basePrice && (
                <span style={{ fontSize: 26, color: 'var(--text3)', textDecoration: 'line-through' }}>
                  ₹{sale.product.basePrice}
                </span>
              )}
            </div>
            {off > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22d87a18', color: 'var(--green)', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8, marginTop: 8 }}>
                🎉 You save ₹{savings}
              </div>
            )}
          </div>

          {/* Stock bar */}
          <StockBar stock={currentStock} total={sale.totalStock} />

          {/* Countdown */}
          {isActive && <Countdown targetTime={sale.endTime} label="Ends in" />}

          {/* Message */}
          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.5,
              background: buyState === 'success' ? '#22d87a18' : buyState === 'error' ? '#ff4f6a18' : '#4f9eff18',
              color: buyState === 'success' ? 'var(--green)' : buyState === 'error' ? 'var(--red)' : 'var(--blue)',
              border: `1px solid ${buyState === 'success' ? '#22d87a44' : buyState === 'error' ? '#ff4f6a44' : '#4f9eff44'}`,
            }}>
              {message}
            </div>
          )}

          {/* Buy button */}
          <BuyButton
            state={buyState}
            onClick={buyState === 'error' ? handleRetry : handleBuy}
            disabled={!isActive || isSoldOut}
            price={sale.salePrice}
          />

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['⚡ 8ms', 'Response time'],
              ['🔒 SSL', 'Secured checkout'],
              [`📦 ${currentStock}`, 'In stock'],
              ['🔄 1 max', 'Per user limit'],
            ].map(([v, l]) => (
              <div key={l} style={{ background: 'var(--surface2)', borderRadius: 10, padding: 16 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 17, fontWeight: 500, color: 'var(--text)' }}>
                  {v}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
