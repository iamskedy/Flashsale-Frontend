import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api/orders.api'
import { getSocket } from '../socket/socket'
import OrderStatus from '../components/OrderStatus'

export default function OrdersPage() {
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getOrders,
    retry: 1,
  })

  // Listen for real-time order updates
  useEffect(() => {
    let socket
    try {
      socket = getSocket()
      const refresh = () => queryClient.invalidateQueries({ queryKey: ['orders'] })
      socket.on('order:confirmed', refresh)
      socket.on('order:failed', refresh)
      return () => {
        socket.off('order:confirmed', refresh)
        socket.off('order:failed', refresh)
      }
    } catch (err) {
      console.warn('[OrdersPage] WebSocket not available:', err.message)
    }
  }, [queryClient])

  const total = orders?.reduce((s, o) => s + parseFloat(o.totalAmount), 0) ?? 0
  const confirmedCount = orders?.filter((o) => o.status === 'confirmed').length ?? 0

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, color: 'var(--text2)' }}>
        <span className="spin" style={{ fontSize: 24, marginRight: 12 }}>⟳</span> Loading orders...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div className="slide-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: 'var(--text)' }}>
          My <span style={{ color: 'var(--orange)' }}>Orders</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>
          {orders?.length ?? 0} orders · ₹{total.toLocaleString()} total
        </span>
      </div>

      {/* Stats */}
      <div className="slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36, animationDelay: '0.05s' }}>
        {[
          ['Total Spent', `₹${total.toLocaleString()}`, 'var(--orange)'],
          ['Total Orders', String(orders?.length ?? 0), 'var(--blue)'],
          ['Confirmed', String(confirmedCount), 'var(--green)'],
        ].map(([label, value, color]) => (
          <div key={label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 1, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!orders?.length && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>No orders yet.</div>
          <div style={{ fontSize: 13 }}>Go grab a deal!</div>
        </div>
      )}

      {/* Order list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders?.map((order, idx) => (
          <div key={order.id} className="slide-up" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            animationDelay: `${0.08 + idx * 0.04}s`,
          }}>
            <div style={{
              fontSize: 24,
              width: 48, height: 48,
              background: 'var(--surface2)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              📦
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                Order #{order.id.slice(0, 8)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
                Qty: {order.quantity} · {new Date(order.createdAt).toLocaleString()}
                {order.paymentId && (
                  <span style={{ marginLeft: 8 }}>· {order.paymentId.slice(0, 16)}</span>
                )}
              </div>
            </div>

            <OrderStatus status={order.status} />

            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, fontWeight: 500, color: 'var(--text)', flexShrink: 0 }}>
              ₹{parseFloat(order.totalAmount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
