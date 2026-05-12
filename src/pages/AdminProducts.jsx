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
    : variant === 'danger' ? '#ff4f6a22'
    : 'var(--surface2)',
  color: variant === 'primary' ? '#fff'
    : variant === 'danger' ? 'var(--red)'
    : 'var(--text2)',
  border: variant === 'danger' ? '1px solid #ff4f6a44' : 'none',
})

function ProductModal({ product, onClose, onSave, loading }) {
  const isEdit = Boolean(product?.id)
  const [form, setForm] = useState({
    name:        product?.name        ?? '',
    basePrice:   product?.basePrice   ?? '',
    description: product?.description ?? '',
    imageUrl:    product?.imageUrl    ?? '',
  })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim())   return setError('Product name is required.')
    if (!form.basePrice || Number(form.basePrice) <= 0) return setError('Base price must be positive.')
    try {
      await onSave(form)
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
        borderRadius: 16, padding: 36, width: 480, maxWidth: '95vw',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>
          {isEdit ? '✏️ Edit Product' : '➕ New Product'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="iPhone 16 Pro" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Base Price (₹) *</label>
            <input style={inputStyle} type="number" value={form.basePrice} onChange={set('basePrice')} placeholder="1099" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.description} onChange={set('description')} placeholder="Short description..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Image URL</label>
            <input style={inputStyle} value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
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
            {loading ? <span className="spin">⟳</span> : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | product object
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn: () => adminApi.getProducts({ page, search }),
    keepPreviousData: true,
  })

  const createMut = useMutation({
    mutationFn: adminApi.createProduct,
    onSuccess: () => { qc.invalidateQueries(['admin', 'products']); showToast('✅ Product created!') },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, ...payload }) => adminApi.updateProduct(id, payload),
    onSuccess: () => { qc.invalidateQueries(['admin', 'products']); showToast('✅ Product updated!') },
  })

  const deleteMut = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => { qc.invalidateQueries(['admin', 'products']); showToast('🗑️ Product deleted.') },
    onError: (err) => showToast(`❌ ${err.response?.data?.message ?? 'Delete failed'}`),
  })

  const products  = data?.data ?? []
  const meta      = data?.meta ?? {}
  const totalPages = meta.totalPages ?? 1

  return (
    <div className="slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: 2, color: 'var(--text)' }}>Products</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>{meta.total ?? 0} total</p>
        </div>
        <button style={btnStyle('primary')} onClick={() => setModal('create')}>+ New Product</button>
      </div>

      {/* Search */}
      <input
        style={{ ...inputStyle, maxWidth: 320, marginBottom: 24 }}
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
      />

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {/* Head */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 140px 160px',
          padding: '12px 24px', background: 'var(--surface2)',
          borderBottom: '1px solid var(--border)',
          fontSize: 11, fontWeight: 700, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          <span>Product</span><span>Base Price</span><span>Image</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {isLoading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
            <span className="spin">⟳</span> Loading...
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>No products found.</div>
        )}

        {products.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 140px 160px',
            padding: '14px 24px', alignItems: 'center',
            borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{p.description?.slice(0, 50) ?? '—'}</div>
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", color: 'var(--orange)', fontSize: 14 }}>
              ₹{p.basePrice}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }} />
              ) : '—'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={btnStyle('secondary')} onClick={() => setModal(p)}>Edit</button>
              <button
                style={btnStyle('danger')}
                onClick={() => {
                  if (window.confirm(`Delete "${p.name}"?`)) deleteMut.mutate(p.id)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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

      {/* Modal */}
      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          loading={createMut.isLoading || updateMut.isLoading}
          onClose={() => setModal(null)}
          onSave={(form) =>
            modal === 'create'
              ? createMut.mutateAsync(form)
              : updateMut.mutateAsync({ id: modal.id, ...form })
          }
        />
      )}

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