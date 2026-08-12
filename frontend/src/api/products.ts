import api from "./api";

export const getProducts = async (params?: any) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};
