/**
 * Generic API Response Types
 * Reusable response interfaces for consistent API contracts
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
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
