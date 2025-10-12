import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { clerkMiddleware } from "@workspace/auth/server";
import { logger } from "@workspace/observability/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export default clerkMiddleware(
  async (auth, req: NextRequest, event: NextFetchEvent) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "http://localhost:3001",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // For all other requests, add CORS headers to the response
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
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
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for all routes
    "/(.*)",
  ],
};
