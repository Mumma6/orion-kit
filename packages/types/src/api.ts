/**
 * Generic API Response Types
 * Building blocks for all API responses
 */

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}
