/**
 * @workspace/types
 * Centralized API response types for the entire monorepo
 *
 * This package combines:
 * - Generic API response interfaces
 * - Domain types from @workspace/database and @workspace/payment
 * - Composed response types for consistent API contracts
 */

// Generic API responses
export * from "./api";

// Domain-specific response types
export * from "./tasks";
export * from "./preferences";
export * from "./billing";
