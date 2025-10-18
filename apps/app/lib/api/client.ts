import { createAuthHeaders } from "@workspace/auth/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

const createHeaders = (options: FetchOptions): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    ...createAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };
};

const createUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  const baseUrl = `${API_BASE_URL}${endpoint}`;
  return params
    ? `${baseUrl}?${new URLSearchParams(params).toString()}`
    : baseUrl;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = (await response.json()) || { error: response.statusText };
    const error = new Error(
      errorData?.error || `API Error: ${response.status} ${response.statusText}`
    ) as Error & { code?: string };

    if (errorData?.code) {
      error.code = errorData.code;
    }

    throw error;
  }

  return response.json();
};

const fetcher = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { params, ...fetchOptions } = options;

  const response = await fetch(createUrl(endpoint, params), {
    ...fetchOptions,
    credentials: "include",
    headers: createHeaders(options),
  });

  return handleResponse<T>(response);
};

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "DELETE" }),
};
