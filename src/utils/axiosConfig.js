import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import Axios from "axios";

Axios.defaults.baseURL = "http://localhost:7294/api"; // API URL'sini ayarla

Axios.interceptors.request.use(
  (config) => {
    // İstek öncesi işlemler
    const token = localStorage.getItem("authToken"); // Token'ı localStorage'dan al

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Token'ı Authorization header'ına ekle
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    console.log("Axios request config:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request - redirecting to login");
      localStorage.removeItem("authToken"); // Token'ı sil
    }
    return Promise.reject(error);
  }
);

export default Axios;
