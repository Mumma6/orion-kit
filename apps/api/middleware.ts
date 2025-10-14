import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { clerkMiddleware } from "@workspace/auth/server";
import { logger } from "@workspace/observability/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

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

export const config = {
  matcher: [
    // Only run on API routes for this API server
    "/api/:path*",
  ],
};
