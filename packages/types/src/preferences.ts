import type { UserPreference } from "@workspace/database/schema";
import type { ApiResponse } from "./api";

export type { UserPreference } from "@workspace/database/schema";

export { updateUserPreferencesSchema } from "@workspace/database/schema";

export type UpdatePreferencesInput = Partial<
  Omit<UserPreference, "id" | "clerkUserId" | "createdAt" | "updatedAt">
>;

export type PreferencesResponse = ApiResponse<UserPreference>;
export type UpdatePreferencesResponse = ApiResponse<UserPreference>;
