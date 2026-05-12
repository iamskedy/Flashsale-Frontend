import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '../api/admin.api'

function StatCard({ label, value, color = 'var(--orange)', icon }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 32, fontFamily: "'DM Mono',monospace", fontWeight: 700, color }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function statusColor(status) {
  return status === 'active' ? 'var(--green)'
    : status === 'scheduled' ? 'var(--blue)'
    : status === 'cancelled' ? 'var(--red)'
    : 'var(--text3)'
}

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30_000,
  })

  if (isLoading) return (
    <div style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="spin">⟳</span> Loading dashboard...
    </div>
  )

  if (isError) return (
    <div style={{ color: 'var(--red)' }}>❌ Failed to load dashboard.</div>
  )

  const { stats, recentSales } = data

  return (
    <div className="slide-up">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: 2, color: 'var(--text)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text3)', marginTop: 4, fontSize: 14 }}>
          Real-time overview of your flash sale system
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        <StatCard icon="📦" label="Total Products"   value={stats.totalProducts}   color="var(--text)" />
        <StatCard icon="🏷️"  label="Total Sales"     value={stats.totalSales}      color="var(--text)" />
        <StatCard icon="🔴" label="Active Sales"     value={stats.activeSales}     color="var(--red)"  />
        <StatCard icon="📅" label="Scheduled Sales"  value={stats.scheduledSales}  color="var(--blue)" />
      </div>

      {/* Recent Sales */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Recent Sales</h2>
          <Link to="/admin/sales" style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {recentSales?.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)' }}>No sales yet.</div>
          )}
          {recentSales?.map((sale, i) => (
            <div key={sale.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: i < recentSales.length - 1 ? '1px solid var(--border)' : 'none',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 15 }}>
                  {sale.product?.name ?? 'Unknown Product'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                  {new Date(sale.startTime).toLocaleString()} → {new Date(sale.endTime).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, color: 'var(--orange)' }}>
                  ₹{sale.salePrice}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                  background: `${statusColor(sale.status)}22`,
                  color: statusColor(sale.status),
                  textTransform: 'uppercase', letterSpacing: 1,
                }}>
                  {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}