import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { logger } from "@workspace/observability/server";
import { getUserId } from "@workspace/auth/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Determine allowed origin based on environment
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL!,
    "http://localhost:3001",
    "http://localhost:3000",
  ];

  const origin = req.headers.get("origin");
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const corsOrigin = isAllowedOrigin ? origin : allowedOrigins[0]!;

  // Handle CORS preflight requests FIRST - before any auth checks
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Check if this is a protected route
  const protectedRoutes = [
    "/tasks",
    "/preferences",
    "/subscription",
    "/checkout",
    "/billing-portal",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const userId = await getUserId(req);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      });
    }
  }

  // For all other requests, add CORS headers
  const res = NextResponse.next();

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Origin", corsOrigin);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT,OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie"
  );

  logger.info(...transformMiddlewareRequest(req));

  event.waitUntil(logger.flush());

  return res;
}

export const config = {
  matcher: [
    // Run on everything but Next internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
