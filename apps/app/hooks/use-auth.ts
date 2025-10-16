import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified?: boolean;
}

export interface AuthResponse {
  user: AuthUser | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Only use cookies - no localStorage for security
  const cookies = document.cookie.split(";");
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("auth=")
  );
  return authCookie ? authCookie.split("=")[1] || null : null;
}

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

export function useUser() {
  const { data, ...rest } = useAuth();
  return {
    data: data?.user || null,
    ...rest,
  };
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
    mutationFn: async (input: RegisterInput): Promise<{ success: boolean }> => {
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
    mutationFn: async (): Promise<{ success: boolean }> => {
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
