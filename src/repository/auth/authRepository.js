import api from "../../data/api";


export default function createAuthRepository() {
  return {
    async login(credentials) {
      const res = await api.post("/token/", credentials);
      return res.data;
    },
    //   const res = await publicClient.post("/token/", credentials);
    //   return res.data;
    // },
    async requestPasswordReset(payload) {
      const res = await api.post("/SendOTPForVerify/", payload);
      return res.data;
    },
    async verifyOtp(payload) {
      const res = await api.post("/VerifyOTP/", payload);
            console.log("dữ liệu trả về trong repository ", res.data);

      return res.data;
    },
    async resetPassword(payload) {
      const res = await api.post("/PasswordReset/", payload);
      // console.log("dữ liệu trả về trong repository ", res.data);
  
      return res.data;
    },
    async changePassword(payload) {
      const res = await api.post("/ChangePassword/", payload);
      return res.data;
    },
    async logout() {
      const res = await api.post("/logout/");
      return res.data;
    },
  };
}
