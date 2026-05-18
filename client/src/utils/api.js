import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.trim(),
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getUpcomingFollowUps = () => api.get("/applications/upcoming-followups");

export default api;
