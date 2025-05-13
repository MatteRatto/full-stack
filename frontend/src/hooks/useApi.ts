import { useState, useCallback } from "react";
import apiService from "@/services/api";
import type { ApiResponse, ApiError } from "@/types/api.types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    payload?: any
  ) => Promise<T>;
  reset: () => void;
}

export const useApi = <T = any>(): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      method: "get" | "post" | "put" | "delete" | "patch",
      url: string,
      payload?: any
    ): Promise<T> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        let response: ApiResponse<T>;

        switch (method) {
          case "get":
            response = await apiService.get<T>(url, { data: payload });
            break;
          case "post":
            response = await apiService.post<T>(url, payload);
            break;
          case "put":
            response = await apiService.put<T>(url, payload);
            break;
          case "delete":
            response = await apiService.delete<T>(url);
            break;
          case "patch":
            response = await apiService.patch<T>(url, payload);
            break;
          default:
            throw new Error(`Metodo HTTP non supportato: ${method}`);
        }

        if (response.success && response.data) {
          setState((prev) => ({
            ...prev,
            loading: false,
            data: response.data ?? null,
            error: null,
          }));
          return response.data;
        } else {
          throw new Error(response.error || "Si è verificato un errore");
        }
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Si è verificato un errore";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          data: null,
        }));

        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
};

export default useApi;
