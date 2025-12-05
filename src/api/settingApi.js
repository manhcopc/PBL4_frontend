import axios from "axios";
import api from "./api";

const API_URL = "/api";
const publicClient = axios.create({
  baseURL: API_URL,
});

export default {
  changePassword: (data) => api.post(`/ChangePassword/`, data),
  sendOtp: (data) => publicClient.post(`/SendOTPForVerify/`, data),
  verifyOtp: (data) => publicClient.post(`/VerifyOTP/`, data),
  resetPassword: (data) => publicClient.post(`/ResetPassword/`, data),
};
