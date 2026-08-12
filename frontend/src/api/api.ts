import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("[DEBUG axios interceptor] Request URL:", config.url, "baseURL:", config.baseURL, "token in localStorage:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[DEBUG axios interceptor] Added Authorization header:", config.headers.Authorization);
    } else {
      console.log("[DEBUG axios interceptor] NO TOKEN FOUND in localStorage!");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
