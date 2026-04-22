import { create } from 'zustand'

// Manual persistence — no zustand/middleware needed, avoids TS issues in JS
const STORAGE_KEY = 'flashsale-auth'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: null, userId: null, role: null }
  } catch {
    return { token: null, userId: null, role: null }
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: state.token,
      userId: state.userId,
      role: state.role,
    }))
  } catch {}
}

const initial = loadFromStorage()

export const useAuthStore = create((set, get) => ({
  token: initial.token,
  userId: initial.userId,
  role: initial.role,

  login: (token, userId, role) => {
    const next = { token, userId, role }
    set(next)
    saveToStorage(next)
  },

  logout: () => {
    const next = { token: null, userId: null, role: null }
    set(next)
    localStorage.removeItem(STORAGE_KEY)
  },

  isAuthenticated: () => Boolean(get().token),
}))
