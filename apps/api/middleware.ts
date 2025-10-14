import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { clerkMiddleware } from "@workspace/auth/server";
import { logger } from "@workspace/observability/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export default clerkMiddleware(
  async (auth, req: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next();

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
