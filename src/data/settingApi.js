import axios from "axios";
import api from "./clientApi";



export default {
  changePassword: (data) => api.post(`/ChangePassword/`, data),
  sendOtp: (data) => api.post(`/SendOTPForVerify/`, data),
  verifyOtp: (data) => api.post(`/VerifyOTP/`, data),
  resetPassword: (data) => api.post(`/ResetPassword/`, data),
  // updateProfile: (data) => api.post(`/UpdateProfile/`, data),
};
