/**
 * Error Handling Utilities
 * Centralized error handling and formatting
 */

import { toast } from "sonner";
import { ZodError } from "zod";

/**
 * Generic error type
 */
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Format any error into a user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "An unexpected error occurred";
}

/**
 * Format Zod validation errors into readable messages
 */
export function formatZodError(error: ZodError): string {
  const firstError = error.errors[0];
  if (!firstError) return "Validation failed";

  const field = firstError.path.join(".");
  return field ? `${field}: ${firstError.message}` : firstError.message;
}

/**
 * Show error toast notification
 */
export function showErrorToast(error: unknown, title = "Error") {
  let message: string;

  if (error instanceof ZodError) {
    message = formatZodError(error);
  } else {
    message = getErrorMessage(error);
  }

  toast.error(title, {
    description: message,
  });
}

/**
 * Show success toast notification
 */
export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
  });
}

/**
 * Handle API errors with automatic toast
 */
export function handleApiError(error: unknown, customMessage?: string) {
  console.error("API Error:", error);

  const message = customMessage || getErrorMessage(error);

  toast.error("Request failed", {
    description: message,
  });
}

/**
 * Async function wrapper with automatic error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    onError?: (error: unknown) => void;
    errorMessage?: string;
    showToast?: boolean;
  }
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);

    if (options?.onError) {
      options.onError(error);
    }

    if (options?.showToast !== false) {
      showErrorToast(error, options?.errorMessage);
    }

    return null;
  }
}
