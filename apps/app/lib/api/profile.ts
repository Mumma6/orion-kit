import { api } from "./client";
import type {
  UpdateProfileInput,
  UpdateProfileResponse,
  DeleteAccountResponse,
} from "@workspace/types";

export const updateProfile = async (
  data: UpdateProfileInput
): Promise<UpdateProfileResponse> => {
  return api.put<UpdateProfileResponse>("/account/profile", data);
};

export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  return api.delete<DeleteAccountResponse>("/account/delete");
};
