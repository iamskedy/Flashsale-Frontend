import { apiClient } from './client'

export const authApi = {
  login: async (email, password) => {
    const { data } = await apiClient.post('/api/auth/login', { email, password })
    return data  
  },
  register: async (email, password) => {
    const { data } = await apiClient.post('/api/auth/register', { email, password })
    return data 
  },
}
