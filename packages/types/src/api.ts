/**
 * Generic API Response and Request Types
 * Shared across all apps for consistent API contracts
 */

/**
 * Generic API Success Response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Generic API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  statusCode?: number;
}

/**
 * Union of success and error responses
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Paginated API Response
 */
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

/**
 * List Response
 */
export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}

/**
 * Generic Create Response
 */
export interface CreateResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Generic Update Response
 */
export interface UpdateResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Generic Delete Response
 */
export interface DeleteResponse {
  success: true;
  message: string;
  deletedId?: string | number;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.success === false;
}
