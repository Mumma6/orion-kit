import { z } from "zod";
import type { ApiResponse } from "./api";

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().optional(),
  emailVerified: z.boolean().optional(),
});

export const LoginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password too long"),
});

export const UpdateProfileInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

export interface LoginResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

export type AuthResponse = ApiResponse<AuthUser | null>;
export type LogoutResponse = ApiResponse<{ loggedOut: true }>;
export type UpdateProfileResponse = ApiResponse<AuthUser>;
export type DeleteAccountResponse = ApiResponse<{ deleted: true }>;
