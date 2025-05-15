import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types";
import type { User } from "@/types/user.types";
import authService from "@/services/authService";
import { toast } from "react-toastify";

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { token: string; user: User } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_TOKEN_EXPIRATION"; payload: number | null }
  | {
      type: "SET_SERVER_STATUS";
      payload: { minutesLeft: number; isNearExpiration: boolean } | null;
    };

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  tokenExpirationMinutes: number | null;
  serverTokenStatus: { minutesLeft: number; isNearExpiration: boolean } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
  tokenExpirationMinutes: null,
  serverTokenStatus: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        token: null,
        user: null,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        token: null,
        user: null,
        error: null,
        isLoading: false,
        tokenExpirationMinutes: null,
        serverTokenStatus: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_TOKEN_EXPIRATION":
      return {
        ...state,
        tokenExpirationMinutes: action.payload,
      };
    case "SET_SERVER_STATUS":
      return {
        ...state,
        serverTokenStatus: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const updateTokenExpiration = useCallback(() => {
    const token = authService.getToken();
    if (token) {
      const expirationMinutes = authService.getTokenExpirationTime();
      dispatch({ type: "SET_TOKEN_EXPIRATION", payload: expirationMinutes });

      if (expirationMinutes !== null && expirationMinutes <= 0) {
        logout();
      }
    }
  }, []);

  const updateServerStatus = useCallback(async () => {
    if (!authService.getToken()) return;

    try {
      const serverStatus = await authService.getTokenStatus();
      dispatch({
        type: "SET_SERVER_STATUS",
        payload: {
          minutesLeft: serverStatus.minutesUntilExpiration,
          isNearExpiration: serverStatus.isNearExpiration,
        },
      });

      if (serverStatus.isExpired) {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch server token status:", error);
      if ((error as any).status === 401) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (!authService.getToken()) return;

    updateTokenExpiration();
    const localInterval = setInterval(updateTokenExpiration, 60000);

    updateServerStatus();
    const serverInterval = setInterval(updateServerStatus, 120000);

    return () => {
      clearInterval(localInterval);
      clearInterval(serverInterval);
    };
  }, [updateTokenExpiration, updateServerStatus]);

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getStoredUser();

    if (token && user) {
      const expirationMinutes = authService.getTokenExpirationTime();

      if (expirationMinutes !== null && expirationMinutes <= 0) {
        logout();
        return;
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { token, user },
      });
      dispatch({ type: "SET_TOKEN_EXPIRATION", payload: expirationMinutes });

      updateServerStatus();
    }
  }, [updateServerStatus]);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            token: response.data.token,
            user: response.data.user,
          },
        });

        updateTokenExpiration();
        updateServerStatus();

        toast.success(response.message || "Login effettuato con successo!");
      } else {
        throw new Error(response.message || "Login fallito");
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || "Si è verificato un errore durante il login";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await authService.register(userData);

      if (response.success && response.data) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            token: response.data.token,
            user: response.data.user,
          },
        });

        updateTokenExpiration();
        updateServerStatus();

        toast.success(
          response.message || "Registrazione completata con successo!"
        );
      } else {
        throw new Error(response.message || "Registrazione fallita");
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || "Si è verificato un errore durante la registrazione";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      dispatch({ type: "AUTH_LOGOUT" });
      toast.success("Logout effettuato con successo!");
    } catch (error: any) {
      dispatch({ type: "AUTH_LOGOUT" });
      console.error("Logout error:", error);
    }
  };

  const setUser = (user: User | null): void => {
    if (user) {
      dispatch({ type: "SET_USER", payload: user });
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();

      if (response.success && response.data) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            token: response.data.token,
            user: response.data.user,
          },
        });

        setTimeout(() => {
          const newExpirationMinutes = authService.getTokenExpirationTime();

          dispatch({
            type: "SET_TOKEN_EXPIRATION",
            payload: newExpirationMinutes,
          });

          authService
            .getTokenStatus()
            .then((serverStatus) => {
              dispatch({
                type: "SET_SERVER_STATUS",
                payload: {
                  minutesLeft: serverStatus.minutesUntilExpiration,
                  isNearExpiration: serverStatus.isNearExpiration,
                },
              });
            })
            .catch((error) => {
              console.error("AuthContext: Failed to get server status:", error);
            });
        }, 50);

        return true;
      }

      return false;
    } catch (error: any) {
      console.error("AuthContext: Token refresh failed:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    token: state.token,
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: !!state.token && !!state.user,
    tokenExpirationMinutes: state.tokenExpirationMinutes,
    serverTokenStatus: state.serverTokenStatus,
    login,
    register,
    logout,
    setUser,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
