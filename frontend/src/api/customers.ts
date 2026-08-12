import api from "./api";

export const getCustomers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  console.log("[DEBUG frontend api] Requesting GET /customers with params:", params);
  try {
    const response = await api.get("/customers", { params });
    console.log("[DEBUG frontend api] Response received:", response.status, response.data);
    return response.data;
  } catch (error: any) {
    console.error("[DEBUG frontend api] Error in GET /customers:", error.response?.status, error.response?.data, error);
    throw error;
  }
};

export const getCustomer = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await api.get("/customers", { params });
  return response.data;
};

export const createCustomer = async (data: {
  name: string;
  email: string;
  phone: string;
  address: string;
}) => {
  const response = await api.post("/customers", data);
  return response.data;
};

export const updateCustomer = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>
) => {
  const response = await api.patch(`/customers/${id}`, data);
  return response.data;
};
export const deleteCustomer = async (id: string) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};
