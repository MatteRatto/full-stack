import apiService from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LogoutResponse,
} from "@/types/auth.types";
import type { User } from "@/types/user.types";
import type { ApiResponse } from "@/types/api.types";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<{
      token: string;
      user: User;
    }>("/auth/login", credentials);

    if (response.success && response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return {
        success: response.success,
        message: response.message || "Login effettuato con successo",
        data: response.data,
      };
    }

    throw new Error(response.error || "Login fallito");
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<{
      token: string;
      user: User;
    }>("/auth/register", userData);

    if (response.success && response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return {
        success: response.success,
        message: response.message || "Registrazione completata con successo",
        data: response.data,
      };
    }

    throw new Error(response.error || "Registrazione fallita");
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await apiService.post<LogoutResponse>("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return response;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        success: true,
        message: "Logout completato",
      };
    }
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return await apiService.get<{ user: User }>("/auth/me");
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export const authService = new AuthService();
export default authService;
