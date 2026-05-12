import { io } from 'socket.io-client'
import { useAuthStore } from '../store/auth.store'

let socket = null

export function getSocket() {
  if (!socket) {
    const token = useAuthStore.getState().token
    const wsUrl = import.meta.env.VITE_WS_URL || window.location.origin

    socket = io(wsUrl, {
      auth: { token: token ? `Bearer ${token}` : '' },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      path: '/socket.io/',
      // Don't throw on connection failure — just log
    })

    socket.on('connect', () =>
      console.log('[WS] Connected:', socket.id)
    )
    socket.on('connect_error', (err) =>
      console.warn('[WS] Connection failed (is the backend running?):', err.message)
    )
    socket.on('disconnect', (reason) =>
      console.log('[WS] Disconnected:', reason)
    )
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
