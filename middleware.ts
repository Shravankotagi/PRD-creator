import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/pricing",
  "/sign-in",
  "/api/webhook",
  "/api/stripe/webhook",
  "/api/auth/demo-setup",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if Better Auth session cookie exists
  const sessionToken = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__secure-better-auth.session_token");

  const isLoggedIn = !!sessionToken;

  // Let Better Auth internal API routes pass through
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }



  // Check if the current route is public
  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // If the route is private and the user is not logged in, redirect to sign-in
  if (!isPublic && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};