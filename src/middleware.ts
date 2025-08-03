import { authMiddleware } from "@clerk/nextjs";

// This requires user to sign in to see any page or call any API route
// Exclude health check and startup endpoints from authentication
export default authMiddleware({
  publicRoutes: [
    "/api/health",
    "/api/startup", 
    "/api/test",
    "/api/companions",
    "/api/text"
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
