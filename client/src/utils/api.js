// import axios from "axios";
// import { getToken } from "./auth";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Automatically attach token in every request (if exists)
// api.interceptors.request.use((config) => {
//   const token = getToken();

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

// export const getUpcomingFollowUps = () =>
//   api.get("/applications/upcoming-followups");

// export const processEmailImport = (data) =>
//   api.post("/applications/process-email", data);

import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ attach token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ SAFE response interceptor (no crash)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();

      // 🔒 prevent redirect loop
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ================= API HELPERS =================

// 🔥 upcoming followups
export const getUpcomingFollowUps = () =>
  api.get("/applications/upcoming-followups");

// 🔥 email import
export const processEmailImport = (data) =>
  api.post("/applications/process-email", data);

export default api;