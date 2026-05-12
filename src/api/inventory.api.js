import { apiClient } from "./client";

export const inventoryApi = {
  // GET /api/inventory/:saleId/stock
  getStock: async (saleId) => {
    const { data } = await apiClient.get(`/api/inventory/${saleId}/stock`);
    return data.data;
  },
};
