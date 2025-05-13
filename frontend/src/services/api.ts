import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponse, ApiError, RequestOptions } from "@/types/api.types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            "Si è verificato un errore",
          status: error.response?.status || 500,
          data: error.response?.data,
        };

        if (apiError.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }

        return Promise.reject(apiError);
      }
    );
  }

  private async request<T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method,
      url,
      ...options,
    };

    try {
      const response = await this.api.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  public get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("get", url, { ...options, params: options?.data });
  }

  public post<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("post", url, { ...options, data });
  }

  public put<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("put", url, { ...options, data });
  }

  public delete<T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("delete", url, options);
  }

  public patch<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("patch", url, { ...options, data });
  }
}

export const apiService = new ApiService();
export default apiService;
