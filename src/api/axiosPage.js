
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://fintrckr.onrender.com/api";


export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const authRequest = axios.create({
  baseURL: BASE_URL,
});

authRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

 if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});
