import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/admin.api'

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  background: 'var(--surface2)', border: '1px solid var(--border2)',
  color: 'var(--text)', fontSize: 14, outline: 'none',
  fontFamily: "'DM Sans',sans-serif",
}

const btnStyle = (variant = 'primary') => ({
  padding: '9px 20px', borderRadius: 8, border: 'none',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
  background: variant === 'primary' ? 'var(--orange)'
    : variant === 'danger'   ? '#ff4f6a22'
    : variant === 'warn'     ? '#ffd16622'
    : 'var(--surface2)',
  color: variant === 'primary' ? '#fff'
    : variant === 'danger'   ? 'var(--red)'
    : variant === 'warn'     ? 'var(--gold)'
    : 'var(--text2)',
  border: variant === 'danger' ? '1px solid #ff4f6a44'
    : variant === 'warn'    ? '1px solid #ffd16644'
    : 'none',
})

function statusColor(s) {
  return s === 'active' ? 'var(--green)'
    : s === 'scheduled' ? 'var(--blue)'
    : s === 'cancelled' ? 'var(--red)'
    : 'var(--text3)'
}

// Converts local datetime-local input value to ISO string
const toISO = (v) => v ? new Date(v).toISOString() : ''
// Converts ISO to datetime-local input value
const toLocal = (iso) => iso ? new Date(iso).toISOString().slice(0, 16) : ''

function SaleModal({ sale, products, onClose, onSave, loading }) {
  const isEdit = Boolean(sale?.id)
  const [form, setForm] = useState({
    productId:  sale?.productId  ?? '',
    salePrice:  sale?.salePrice  ?? '',
    totalStock: sale?.totalStock ?? '',
    maxPerUser: sale?.maxPerUser ?? 1,
    startTime:  toLocal(sale?.startTime),
    endTime:    toLocal(sale?.endTime),
  })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.productId)  return setError('Select a product.')
    if (!form.salePrice || Number(form.salePrice) <= 0) return setError('Sale price must be positive.')
    if (!form.totalStock || Number(form.totalStock) < 1) return setError('Total stock must be at least 1.')
    if (!form.startTime)  return setError('Start time is required.')
    if (!form.endTime)    return setError('End time is required.')
    if (new Date(form.startTime) >= new Date(form.endTime)) return setError('Start time must be before end time.')

    try {
      await onSave({
        ...form,
        salePrice:  Number(form.salePrice),
        totalStock: Number(form.totalStock),
        maxPerUser: Number(form.maxPerUser),
        startTime:  toISO(form.startTime),
        endTime:    toISO(form.endTime),
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong.')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000000cc',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div className="slide-up" style={{
        background: 'var(--surface)', border: '1px solid var(--border2)',
        borderRadius: 16, padding: 36, width: 520, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>
          {isEdit ? '✏️ Edit Sale' : '⚡ New Flash Sale'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Product selector (only on create) */}
          {!isEdit && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Product *</label>
              <select style={{ ...inputStyle }} value={form.productId} onChange={set('productId')}>
                <option value="">— Select product —</option>
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Sale Price (₹) *</label>
              <input style={inputStyle} type="number" value={form.salePrice} onChange={set('salePrice')} placeholder="799" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Total Stock *</label>
              <input style={inputStyle} type="number" value={form.totalStock} onChange={set('totalStock')} placeholder="100" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Max Per User</label>
            <input style={inputStyle} type="number" value={form.maxPerUser} onChange={set('maxPerUser')} min={1} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Start Time *</label>
              <input style={inputStyle} type="datetime-local" value={form.startTime} onChange={set('startTime')} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>End Time *</label>
              <input style={inputStyle} type="datetime-local" value={form.endTime} onChange={set('endTime')} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: '#ff4f6a18', color: 'var(--red)', fontSize: 13, border: '1px solid #ff4f6a44' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button style={btnStyle('secondary')} onClick={onClose}>Cancel</button>
          <button style={btnStyle('primary')} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spin">⟳</span> : isEdit ? 'Save Changes' : 'Create Sale'}
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricsPanel({ saleId, onClose }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'metrics', saleId],
    queryFn: () => adminApi.getMetrics(saleId),
    refetchInterval: 5000,
  })

  const metrics = data?.metrics ?? {}

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000000cc',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div className="slide-up" style={{
        background: 'var(--surface)', border: '1px solid var(--border2)',
        borderRadius: 16, padding: 36, width: 480, maxWidth: '95vw',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>📊 Live Metrics</h2>
          <button style={btnStyle('secondary')} onClick={onClose}>✕ Close</button>
        </div>

        {isLoading && <div style={{ color: 'var(--text2)' }}><span className="spin">⟳</span> Loading...</div>}
        {isError   && <div style={{ color: 'var(--red)' }}>No metrics yet for this sale.</div>}

        {!isLoading && !isError && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Object.entries(metrics).map(([k, v]) => (
              <div key={k} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, color: 'var(--orange)' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {k.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminSales() {
  const qc = useQueryClient()
  const [page, setPage]       = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal]     = useState(null)
  const [metricsId, setMetricsId] = useState(null)
  const [toast, setToast]     = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'sales', page, statusFilter],
    queryFn: () => adminApi.getSales({ page, status: statusFilter }),
    keepPreviousData: true,
  })

  // Products list for the create modal selector
  const { data: productsData } = useQuery({
    queryKey: ['admin', 'products', 1, ''],
    queryFn: () => adminApi.getProducts({ limit: 100 }),
  })

  const createMut = useMutation({
    mutationFn: adminApi.createSale,
    onSuccess: () => { qc.invalidateQueries(['admin', 'sales']); showToast('✅ Sale created!') },
    onError: (err) => showToast(`❌ ${err.response?.data?.message ?? 'Create failed'}`),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, ...payload }) => adminApi.updateSale(id, payload),
    onSuccess: () => { qc.invalidateQueries(['admin', 'sales']); showToast('✅ Sale updated!') },
    onError: (err) => showToast(`❌ ${err.response?.data?.message ?? 'Update failed'}`),
  })

  const cancelMut = useMutation({
    mutationFn: adminApi.cancelSale,
    onSuccess: () => { qc.invalidateQueries(['admin', 'sales']); showToast('🛑 Sale cancelled.') },
    onError: (err) => showToast(`❌ ${err.response?.data?.message ?? 'Cancel failed'}`),
  })

  const sales      = data?.data ?? []
  const meta       = data?.meta ?? {}
  const totalPages = meta.totalPages ?? 1
  const products   = productsData?.data ?? []

  return (
    <div className="slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: 2, color: 'var(--text)' }}>
            Flash Sales
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>{meta.total ?? 0} total</p>
        </div>
        <button style={btnStyle('primary')} onClick={() => setModal('create')}>+ New Sale</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['', 'active', 'scheduled', 'ended', 'cancelled'].map((s) => (
          <button
            key={s}
            style={{
              ...btnStyle('secondary'),
              background: statusFilter === s ? 'var(--orange)' : 'var(--surface2)',
              color: statusFilter === s ? '#fff' : 'var(--text2)',
            }}
            onClick={() => { setStatusFilter(s); setPage(1) }}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {/* Head */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 110px 100px 100px 120px 200px',
          padding: '12px 24px', background: 'var(--surface2)',
          borderBottom: '1px solid var(--border)',
          fontSize: 11, fontWeight: 700, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          <span>Product</span><span>Price</span><span>Stock</span><span>Status</span><span>Period</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {isLoading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
            <span className="spin">⟳</span> Loading...
          </div>
        )}

        {!isLoading && sales.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>No sales found.</div>
        )}

        {sales.map((sale, i) => {
          const canEdit   = sale.status === 'scheduled'
          const canCancel = sale.status === 'active' || sale.status === 'scheduled'

          return (
            <div key={sale.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 100px 100px 120px 200px',
              padding: '14px 24px', alignItems: 'center',
              borderBottom: i < sales.length - 1 ? '1px solid var(--border)' : 'none',
              gap: 8,
            }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                  {sale.product?.name ?? sale.productId.slice(0, 8)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                  max {sale.maxPerUser}/user
                </div>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", color: 'var(--orange)', fontSize: 14 }}>
                ₹{sale.salePrice}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                {sale.remainingStock !== null ? (
                  <span style={{ color: sale.remainingStock === 0 ? 'var(--red)' : 'var(--green)' }}>
                    {sale.remainingStock}
                  </span>
                ) : '—'} / {sale.totalStock}
              </div>
              <div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                  background: `${statusColor(sale.status)}22`,
                  color: statusColor(sale.status),
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  {sale.status}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>
                <div>{new Date(sale.startTime).toLocaleDateString()}</div>
                <div>{new Date(sale.endTime).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button style={{ ...btnStyle('secondary'), padding: '7px 12px', fontSize: 12 }}
                  onClick={() => setMetricsId(sale.id)}>
                  📊
                </button>
                {canEdit && (
                  <button style={{ ...btnStyle('secondary'), padding: '7px 12px', fontSize: 12 }}
                    onClick={() => setModal(sale)}>
                    Edit
                  </button>
                )}
                {canCancel && (
                  <button
                    style={{ ...btnStyle('warn'), padding: '7px 12px', fontSize: 12 }}
                    onClick={() => {
                      if (window.confirm('Cancel this sale?')) cancelMut.mutate(sale.id)
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
          <button style={btnStyle('secondary')} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span style={{ padding: '9px 16px', fontSize: 13, color: 'var(--text2)' }}>
            Page {page} / {totalPages}
          </span>
          <button style={btnStyle('secondary')} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <SaleModal
          sale={modal === 'create' ? null : modal}
          products={products}
          loading={createMut.isLoading || updateMut.isLoading}
          onClose={() => setModal(null)}
          onSave={(form) =>
            modal === 'create'
              ? createMut.mutateAsync(form)
              : updateMut.mutateAsync({ id: modal.id, ...form })
          }
        />
      )}

      {/* Metrics Panel */}
      {metricsId && <MetricsPanel saleId={metricsId} onClose={() => setMetricsId(null)} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28,
          background: 'var(--surface2)', border: '1px solid var(--border2)',
          padding: '12px 20px', borderRadius: 10, fontSize: 14, color: 'var(--text)',
          boxShadow: '0 8px 32px #00000066', zIndex: 200,
          animation: 'toast-in 0.3s ease',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}