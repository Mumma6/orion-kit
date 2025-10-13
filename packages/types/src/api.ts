/**
 * Generic API Response Types
 * Reusable response interfaces for consistent API contracts
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  statusCode?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}

export interface CreateResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface UpdateResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface DeleteResponse {
  success: true;
  message: string;
  deletedId?: string | number;
}

// Type guards
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isErrorResponse(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.success === false;
}
