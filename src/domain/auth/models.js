export const createAuthTokens = ({ access, refresh }) => ({
  access,
  refresh,
});

export const createCredentials = ({ username, password }) => ({
  username,
  password,
});

export const createPasswordResetRequest = ({ email, action }) => ({
  email,
  action,
});

export const createOtpVerification = ({ email, otp }) => ({
  email,
  otp,
});

export const createResetPasswordPayload = ({ token, newPassword }) => ({
  token,
  new_password: newPassword,
});

export const createChangePasswordPayload = ({ oldPassword, newPassword }) => ({
  old_password: oldPassword,
  new_password: newPassword,
});
