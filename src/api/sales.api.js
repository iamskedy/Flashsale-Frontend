import { apiClient } from './client'

export const salesApi = {
  getSales: async () => {
    const { data } = await apiClient.get('/api/sales')
    return data.data
  },
  getSale: async (id) => {
    const { data } = await apiClient.get(`/api/sales/${id}`)
    return data.data
  },
}
