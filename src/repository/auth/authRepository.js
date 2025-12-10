import api from "../../data/clientApi";

// // const API_URL = "/api";
// const API_URL = import.meta.env.VITE_API_URL || "https://testmarkdb.azurewebsites.net/api";
// const publicClient = axios.create({
//   baseURL: API_URL,
// });

export default function createAuthRepository() {
  return {
    async login(credentials) {
      const res = await api.post("/token/", credentials);
      return res.data;
    },
    async requestPasswordReset(payload) {
      const res = await api.post("/SendOTPForVerify/", payload);
      return res.data;
    },
    async verifyOtp(payload) {
      const res = await api.post("/VerifyOTP/", payload);
      return res.data;
    },
    async resetPassword(payload) {
      const res = await api.post("/ResetPassword/", payload);
      return res.data;
    },
    async changePassword(payload) {
      const res = await api.post("/ChangePassword/", payload);
      return res.data;
    },
  };
}
