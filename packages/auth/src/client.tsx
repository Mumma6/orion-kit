"use client";

/**
 * Client-side auth exports
 * These are meant to be used in React components
 */

// Re-export Clerk client components
export {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
  useClerk,
  useSignIn,
  useSignUp,
  RedirectToSignIn,
  RedirectToSignUp,
  RedirectToUserProfile,
  SignIn,
  SignUp,
  UserProfile,
  OrganizationSwitcher,
  OrganizationProfile,
  CreateOrganization,
  OrganizationList,
} from "@clerk/nextjs";

// Re-export useful types
export type {
  UserResource,
  OrganizationResource,
  SessionResource,
} from "@clerk/types";
