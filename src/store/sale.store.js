import { create } from 'zustand'

export const useSaleStore = create((set, get) => ({
  stock: {},

  setStock: (saleId, count) =>
    set((state) => ({ stock: { ...state.stock, [saleId]: count } })),

  getStock: (saleId) => get().stock[saleId],
}))
