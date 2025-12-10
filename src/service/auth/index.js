import createAuthRepository from "../../repository/auth/authRepository";
import createAuthService from "./authService";

const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export default authService;
