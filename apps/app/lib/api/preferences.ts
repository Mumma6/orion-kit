import { api } from "./client";
import type {
  PreferencesResponse,
  UpdatePreferencesResponse,
  UpdatePreferencesInput,
} from "@workspace/types";

// Re-export types for convenience (though importing from @workspace/types is preferred)
export type { UpdatePreferencesInput };

export async function getPreferences(): Promise<PreferencesResponse> {
  return api.get<PreferencesResponse>("/preferences");
}

export async function updatePreferences(
  updates: UpdatePreferencesInput
): Promise<UpdatePreferencesResponse> {
  return api.put<UpdatePreferencesResponse>("/preferences", updates);
}
