import axios from "axios";
import api from "../../api/api";

const API_URL = "/api";
const publicClient = axios.create({
  baseURL: API_URL,
});

export default function createAuthRepository() {
  return {
    async login(credentials) {
      const res = await publicClient.post("/token/", credentials);
      return res.data;
    },
    async requestPasswordReset(payload) {
      const res = await publicClient.post("/SendOTPForVerify/", payload);
      return res.data;
    },
    async verifyOtp(payload) {
      const res = await publicClient.post("/VerifyOTP/", payload);
      return res.data;
    },
    async resetPassword(payload) {
      const res = await publicClient.post("/ResetPassword/", payload);
      return res.data;
    },
    async changePassword(payload) {
      const res = await api.post("/ChangePassword/", payload);
      return res.data;
    },
  };
}
