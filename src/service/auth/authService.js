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
    async verifyOtp(email, otp) {
      const payload = createOtpVerification({ email, otp });
      return authRepository.verifyOtp(payload);
    },
    async resetPassword(token, newPassword) {
      const payload = createResetPasswordPayload({ token, newPassword });
      return authRepository.resetPassword(payload);
    },
    async changePassword(oldPassword, newPassword) {
      const payload = createChangePasswordPayload({ oldPassword, newPassword });
      return authRepository.changePassword(payload);
    },
  };
}
