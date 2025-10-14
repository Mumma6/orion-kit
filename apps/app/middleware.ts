import { createAuthMiddleware } from "@workspace/auth/middleware";

export default createAuthMiddleware({
  protectedRoutes: ["/dashboard(.*)"],
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Skip API routes - they have their own middleware
    "/((?!api).*)",
  ],
};
