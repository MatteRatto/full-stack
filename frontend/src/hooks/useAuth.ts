import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import type { AuthContextType } from "@/types/auth.types";

/**
 * Custom hook to use the Auth context
 * Provides authentication state and methods
 *
 * @returns AuthContextType - Authentication context value
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Make sure to wrap your component tree with <AuthProvider>."
    );
  }

  return context;
};

export default useAuth;
