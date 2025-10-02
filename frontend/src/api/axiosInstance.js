import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Variable global para guardar la promesa de refresh en curso
let refreshPromise = null;

// 👉 Interceptor para agregar token a cada request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Interceptor para manejar expiración y refresh de tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      // 🚦 Si ya hay un refresh en curso → esperar a que termine
      if (!refreshPromise) {
        refreshPromise = axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: localStorage.getItem("refreshToken"),
          }
        );
      }

      try {
        const res = await refreshPromise;
        refreshPromise = null; // 🔄 reset para la siguiente vez

        const newAccessToken = res.data.access;
        const newRefreshToken = res.data.refresh;

        // ✅ Guardar nuevos tokens
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 🔁 Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshPromise = null; // limpiar promesa fallida
        console.error("🔴 Refresh token inválido o expirado:", refreshError);

        // 🔐 Logout automático
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
