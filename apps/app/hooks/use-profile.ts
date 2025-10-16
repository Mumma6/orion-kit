import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, deleteAccount } from "@/lib/api/profile";
import { showSuccessToast, showErrorToast } from "@/lib/errors";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showSuccessToast("Profile updated successfully");
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      // Clear all cached data and redirect to home
      window.location.href = "/";
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });
}
