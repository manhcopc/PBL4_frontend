import axios from "axios";

const API_URL = "/server";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
        localStorage.setItem("accessToken", res.data.access);
        error.config.headers.Authorization = `Bearer ${res.data.access}`;
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
