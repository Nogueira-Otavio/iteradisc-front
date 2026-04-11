import axios from "axios";
import AuthService from "./IteraDiscService/IteraDiscServiceAuth";

export const HTTPClient = axios.create({
  baseURL: "http://localhost:5279",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

HTTPClient.interceptors.request.use((config) => {
  const token = AuthService.obterToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

HTTPClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.encerrarSessao();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);