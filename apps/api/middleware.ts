import { clerkMiddleware, createRouteMatcher } from "@workspace/auth/server";
import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { logger } from "@workspace/observability/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { createAuthMiddleware } from "@workspace/auth/middleware";

/*
// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/api/tasks(.*)",
  "/api/preferences(.*)",
  "/api/subscription(.*)",
  "/api/billing-portal(.*)",
]);

export default clerkMiddleware(
  async (auth, req: NextRequest, event: NextFetchEvent) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      const allowedOrigin =
        process.env.NODE_ENV === "production"
          ? "https://orion-kit-app.vercel.app"
          : "http://localhost:3001";

      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Protect routes that require authentication
    if (isProtectedRoute(req)) {
      await auth.protect();
    }

    // For all other requests, add CORS headers to the response
    const response = NextResponse.next();
    const allowedOrigin =
      process.env.NODE_ENV === "production"
        ? "https://orion-kit-app.vercel.app"
        : "http://localhost:3001";

    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Cookie"
    );

    logger.info(...transformMiddlewareRequest(req));

    event.waitUntil(logger.flush());

    return response;
  }
);
*/

export default createAuthMiddleware({
  protectedRoutes: ["/api/tasks(.*)"],
  publicRoutes: ["/api/health"],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
