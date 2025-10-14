// Re-export Kinde types for convenience
export type {
  KindeUser,
  KindeOrganization,
  KindeState,
  KindePermissions,
  KindePermission,
  KindeRoles,
  KindeAccessToken,
  KindeIdToken,
} from "@kinde-oss/kinde-auth-nextjs/types";

// Additional utility types
export interface AuthUser {
  id: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
  isAuthenticated: boolean;
}

export interface AuthSession {
  user: AuthUser | null;
  organization: any | null; // KindeOrganization type
  permissions: string[];
  isAuthenticated: boolean;
}

export interface AuthConfig {
  protectedRoutes?: string[];
  publicRoutes?: string[];
  redirectToSignIn?: string;
  redirectAfterSignIn?: string;
  redirectAfterSignOut?: string;
}
