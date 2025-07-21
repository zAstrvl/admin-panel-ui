import Axios from "axios";

// ✅ Proxy kullanıyorsanız base URL'i kaldırın
Axios.defaults.baseURL = "/api"; // Sadece /api

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    console.log("Request URL:", config.baseURL + config.url); // Debug için

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - CORS hatalarını yakala
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network Error - Possible CORS issue");
      console.error("Check if backend CORS is configured properly");
    }
    return Promise.reject(error);
  }
);

export default Axios;
