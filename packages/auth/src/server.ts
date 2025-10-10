/**
 * Server-side auth exports
 * These are meant to be used in Server Components, Route Handlers, and Server Actions
 */

// Re-export Clerk server utilities
export {
  auth,
  currentUser,
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

// Re-export useful types
export type { User } from "@clerk/nextjs/server";
