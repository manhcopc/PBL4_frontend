import axios from "axios"; 
// const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const baseURL = "https://testmarkdb.azurewebsites.net/api";
console.log("Backend URL hien tai la: ", baseURL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
}); 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        try { 
          const res = await axios.post(`${baseURL}/token/refresh/`, { refresh });
          
          if (res.data.access) { 
            localStorage.setItem("accessToken", res.data.access); 
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`; 
            return api(originalRequest);
          }
        } catch (refreshError) { 
          console.error("Phiên đăng nhập hết hạn:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";  
          return Promise.reject(refreshError);
        }
      } else {
         localStorage.removeItem("accessToken");
         window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
