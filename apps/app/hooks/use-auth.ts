import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type {
  AuthUser,
  AuthResponse,
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
} from "@workspace/types";
import { getAuthToken } from "@workspace/auth/client";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

async function fetchAuthUser(): Promise<AuthResponse> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add auth token to headers if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Auth API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export function useAuth() {
  return useQuery<AuthResponse>({
    queryKey: authKeys.user(),
    queryFn: fetchAuthUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: LoginInput): Promise<LoginResponse> => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Token is automatically stored in httpOnly cookie by API
      // No need for localStorage

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Redirect to dashboard
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput): Promise<RegisterResponse> => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      return response.json();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // Cookie is automatically cleared by API logout endpoint
      // No need to manually clear localStorage

      // Clear all auth-related queries
      queryClient.setQueryData(authKeys.user(), { user: null });
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Redirect to home page
      router.push("/");
    },
  });
}
