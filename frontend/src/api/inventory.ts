import api from "./api";

export const getInventory = async (params?: any) => {
  const response = await api.get("/inventory", { params });
  return response.data;
};
