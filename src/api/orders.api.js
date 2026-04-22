import { apiClient } from './client'

export const ordersApi = {
  purchase: async (saleId, productId, quantity, idempotencyKey) => {
    const { data } = await apiClient.post(
      '/api/orders/purchase',
      { saleId, productId, quantity },
      { headers: { 'x-idempotency-key': idempotencyKey } }
    )
    return data
  },

  getOrders: async () => {
    const { data } = await apiClient.get('/api/orders/my-orders')
    return data.data
  },
}
