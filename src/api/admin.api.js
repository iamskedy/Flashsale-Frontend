import { apiClient } from './client'

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export const adminApi = {
  // GET /api/admin/dashboard
  getDashboard: async () => {
    const { data } = await apiClient.get('/api/admin/dashboard')
    return data.data
  },

  // ─── PRODUCTS ───────────────────────────────────────────────────────────────
  // GET /api/admin/products?page=1&limit=20&search=
  getProducts: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const { data } = await apiClient.get('/api/admin/products', {
      params: { page, limit, search },
    })
    return data
  },

  // POST /api/admin/products
  createProduct: async (payload) => {
    const { data } = await apiClient.post('/api/admin/products', payload)
    return data.data
  },

  // PUT /api/admin/products/:id
  updateProduct: async (id, payload) => {
    const { data } = await apiClient.put(`/api/admin/products/${id}`, payload)
    return data.data
  },

  // DELETE /api/admin/products/:id
  deleteProduct: async (id) => {
    const { data } = await apiClient.delete(`/api/admin/products/${id}`)
    return data
  },

  // ─── SALES ──────────────────────────────────────────────────────────────────
  // GET /api/admin/sales?page=1&limit=20&status=
  getSales: async ({ page = 1, limit = 20, status = '' } = {}) => {
    const { data } = await apiClient.get('/api/admin/sales', {
      params: { page, limit, ...(status && { status }) },
    })
    return data
  },

  // POST /api/admin/sales
  createSale: async (payload) => {
    const { data } = await apiClient.post('/api/admin/sales', payload)
    return data.data
  },

  // PUT /api/admin/sales/:id
  updateSale: async (id, payload) => {
    const { data } = await apiClient.put(`/api/admin/sales/${id}`, payload)
    return data.data
  },

  // PATCH /api/admin/sales/:id/cancel
  cancelSale: async (id) => {
    const { data } = await apiClient.patch(`/api/admin/sales/${id}/cancel`)
    return data.data
  },

  // ─── METRICS ────────────────────────────────────────────────────────────────
  // GET /api/metrics/:saleId
  getMetrics: async (saleId) => {
    const { data } = await apiClient.get(`/api/metrics/${saleId}`)
    return data.data
  },
}