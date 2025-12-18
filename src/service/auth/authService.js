import {
  createAuthTokens,
  createPasswordResetRequest,
  createOtpVerification,
  createResetPasswordPayload,
  createChangePasswordPayload,
} from "../../domain/auth/models";

const defaultTokenStorage = typeof window !== "undefined" ? window.localStorage : null;

export default function createAuthService(authRepository, tokenStorage = defaultTokenStorage) {
  const persistTokens = (tokens) => {
    if (!tokenStorage || !tokens) return;
    tokenStorage.setItem("accessToken", tokens.access);
    tokenStorage.setItem("refreshToken", tokens.refresh);
  };

  const clearTokens = () => {
    if (!tokenStorage) return;
    tokenStorage.removeItem("accessToken");
    tokenStorage.removeItem("refreshToken");
  };

  return {
    async login(credentials) {
      const data = await authRepository.login(credentials);
      const tokens = createAuthTokens({
        access: data.access,
        refresh: data.refresh,
      });
      persistTokens(tokens);
      return tokens;
    },
    logout() {
      clearTokens();
    },
    async requestPasswordReset(email, action = "password_reset") {
      const payload = createPasswordResetRequest({ email, action });
      return authRepository.requestPasswordReset(payload);
    },
    async verifyOtp(token, code) {
      const payload = createOtpVerification({ token, code });
      
      // 👇 SỬA LẠI: Dùng dấu phẩy để trình duyệt hiển thị chi tiết object
      console.log("Dữ liệu gửi đi trong service:", payload); 
      
      const data = await authRepository.verifyOtp(payload);
      
      // 👇 QUAN TRỌNG: Dùng dấu phẩy để xem cấu trúc trả về
      console.log("Dữ liệu trả về trong service (Tìm token mới ở đây):", data);
      
      return data;
    },
    async resetPassword(token, newPassword) {
      const payload = createResetPasswordPayload({ token, newPassword });
      console.log(`dữ liệu gửi đi trong service ${payload}`);
      return authRepository.resetPassword(payload);
    },
    async changePassword(oldPassword, newPassword) {
      const payload = createChangePasswordPayload({ oldPassword, newPassword });
      return authRepository.changePassword(payload);
    },
  };
}
