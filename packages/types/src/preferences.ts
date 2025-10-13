/**
 * User Preferences Response Types
 * Composed from generic API responses and domain types
 */

import type { UserPreference } from "@workspace/database/schema";
import type { ApiSuccessResponse, UpdateResponse } from "./api";

// Re-export domain types
export type { UserPreference } from "@workspace/database/schema";

// Preferences input types
export type UpdatePreferencesInput = Partial<
  Omit<UserPreference, "id" | "clerkUserId" | "createdAt" | "updatedAt">
>;

// Preferences response types
export type PreferencesResponse = ApiSuccessResponse<UserPreference>;
export type UpdatePreferencesResponse = UpdateResponse<UserPreference>;
