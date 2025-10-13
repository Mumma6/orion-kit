import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export default clerkMiddleware();
