import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type {
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
  // Get token from localStorage first, then fallback to cookies
  const token = localStorage.getItem("auth_token") || getAuthToken();
  console.log(
    "fetchAuthUser - token from localStorage:",
    localStorage.getItem("auth_token")
  );
  console.log("fetchAuthUser - token from cookies:", getAuthToken());
  console.log("fetchAuthUser - final token:", token);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("fetchAuthUser - headers:", headers);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  console.log("fetchAuthUser - response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("fetchAuthUser - error response:", errorText);
    throw new Error(
      `Auth API Error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("fetchAuthUser - success response:", data);
  return data;
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
      console.log("Attempting login with:", input.email);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("Login response:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("Login successful, storing token:", data.token);

      // Store token in localStorage for cross-origin compatibility
      localStorage.setItem("auth_token", data.token);

      // Verify token was stored
      const storedToken = localStorage.getItem("auth_token");
      console.log("Token stored in localStorage:", storedToken);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
    onSuccess: (data) => {
      // Store token in localStorage for cross-origin compatibility
      localStorage.setItem("auth_token", data.token);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Redirect to dashboard
      router.push("/dashboard");
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
      // Clear token from localStorage
      localStorage.removeItem("auth_token");

      // Clear all auth-related queries
      queryClient.setQueryData(authKeys.user(), { user: null });
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Redirect to home page
      router.push("/");
    },
  });
}
