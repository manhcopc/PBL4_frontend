import createAuthRepository from "../../infrastructure/auth/authRepository";
import createAuthService from "./authService";

const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export default authService;
