/**
 * Middleware helper for Clerk authentication
 * This provides a configured middleware function that can be used in Next.js apps
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Create a Clerk middleware with custom configuration
 *
 * @example
 * ```ts
 * // In your app's middleware.ts:
 * import { createAuthMiddleware } from '@workspace/auth/middleware';
 *
 * export default createAuthMiddleware({
 *   protectedRoutes: ['/dashboard(.*)'],
 *   publicRoutes: ['/']
 * });
 * ```
 */
export function createAuthMiddleware(options?: {
  protectedRoutes?: string[];
  publicRoutes?: string[];
}) {
  const isProtectedRoute = options?.protectedRoutes
    ? createRouteMatcher(options.protectedRoutes)
    : () => false;

  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  });
}

/**
 * Default middleware configuration
 * Matches the Clerk quickstart setup
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export default clerkMiddleware();
