/**
 * Generic API Response Types
 * Building blocks for all API responses
 */

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}

// Union type for all possible API responses
export type ApiResult<T = unknown> = ApiResponse<T> | ApiErrorResponse;
