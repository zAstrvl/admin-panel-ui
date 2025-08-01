import Axios from "axios";
import { apiUrl } from "utils/constants";

Axios.defaults.baseURL = `${apiUrl}/api`;

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    console.log("Request URL:", config.url);
    console.log("Base URL:", config.baseURL);
    console.log("Full URL:", config.baseURL + config.url);

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
