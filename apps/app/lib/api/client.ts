const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  const url = params
    ? `${API_BASE_URL}${endpoint}?${new URLSearchParams(params).toString()}`
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

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
}

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
