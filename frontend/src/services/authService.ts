import apiService from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileResponse,
  LogoutResponse,
  TokenStatus,
} from "@/types/auth.types";
import type { User, UpdateUserData } from "@/types/user.types";

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

  async updateProfile(userData: UpdateUserData): Promise<UpdateProfileResponse> {
    const response = await apiService.put<{
      token?: string;
      user: User;
    }>("/auth/profile", userData);

    if (response.success && response.data) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
            if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        success: response.success,
        message: response.message || "Profilo aggiornato con successo",
        data: response.data, 
      };
    }

    throw new Error(response.error || "Aggiornamento profilo fallito");
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

  async getMe(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await apiService.get<{ user: User }>("/auth/me");

    if (response.success && response.data) {
      return {
        success: response.success,
        data: response.data,
      };
    }

    throw new Error(response.error || "Errore nel recupero dei dati utente");
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiService.post<{
        token: string;
        user: User;
      }>("/auth/refresh");

      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return {
          success: response.success,
          message: response.message || "Token refreshed successfully",
          data: response.data,
        };
      }

      throw new Error(response.error || "Token refresh failed");
    } catch (error) {
      console.error("AuthService: Token refresh failed:", error);
      this.clearAuthData();
      throw error;
    }
  }

  async getTokenStatus(): Promise<TokenStatus> {
    const response = await apiService.get<TokenStatus>("/auth/token-status");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Failed to get token status");
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const expirationTime = this.getTokenExpirationTime();
    return expirationTime !== null && expirationTime > 0;
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

  getTokenExpirationTime(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);

      if (!decoded.exp) return null;

      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      return Math.floor(timeUntilExpiration / (1000 * 60));
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  isTokenNearExpiration(minutesThreshold: number = 15): boolean {
    const minutesLeft = this.getTokenExpirationTime();
    return minutesLeft !== null && minutesLeft <= minutesThreshold;
  }
}

export const authService = new AuthService();
export default authService;