import api from "./api";

export const getChallans = async (params?: any) => {
  const response = await api.get("/challans", { params });
  return response.data;
};

export const createChallan = async (data: any) => {
  const response = await api.post("/challans", data);
  return response.data;
};
