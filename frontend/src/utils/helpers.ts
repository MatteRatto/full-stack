import type { ApiError } from "@/types/api.types";

/**
 * Format error message from API error
 */
export const formatApiError = (error: ApiError): string => {
  if (error.data?.errors && Array.isArray(error.data.errors)) {
    return error.data.errors.map((err: any) => err.message).join(", ");
  }
  return error.message || "Si è verificato un errore inaspettato";
};

/**
 * Check if code is running in browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

/**
 * Format date to Italian locale
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  return password.length >= 6 && passwordRegex.test(password);
};

/**
 * Remove undefined and null values from object
 */
export const cleanObject = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  const cleaned: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key as keyof T] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
