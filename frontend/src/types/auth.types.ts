import type { UpdateUserData, User } from "./user.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    user: User;
  };
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface ServerTokenStatus {
  minutesLeft: number;
  isNearExpiration: boolean;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tokenExpirationMinutes: number | null;
  serverTokenStatus: ServerTokenStatus | null;
  isDemoMode: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (userData: UpdateUserData) => Promise<void>;
}

export interface AuthError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface TokenStatus {
  minutesUntilExpiration: number;
  isExpired: boolean;
  isNearExpiration: boolean;
}
