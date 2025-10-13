/**
 * User Preferences Domain
 * Combines: Database entity + Zod schemas + API responses
 */

import type { UserPreference } from "@workspace/database/schema";
import type { ApiResponse } from "./api";

// ============================================
// ENTITY (from database)
// ============================================
export type { UserPreference } from "@workspace/database/schema";

// ============================================
// INPUT SCHEMAS (Zod - for validation)
// ============================================
export { updateUserPreferencesSchema } from "@workspace/database/schema";

// ============================================
// INPUT TYPES (TypeScript - for API requests)
// ============================================
export type UpdatePreferencesInput = Partial<
  Omit<UserPreference, "id" | "clerkUserId" | "createdAt" | "updatedAt">
>;

// ============================================
// API RESPONSE TYPES (composed with generics)
// ============================================
export type PreferencesResponse = ApiResponse<UserPreference>;
export type UpdatePreferencesResponse = ApiResponse<UserPreference>;
