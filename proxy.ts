import { type NextRequest, NextResponse } from "next/server";

// Define strict protected paths
const protectedPaths = ["/dashboard"];

// Define auth paths (to redirect authenticated users away from)
const authPaths = ["/sign-in", "/sign-up"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token");

  // 1. Redirect unauthenticated users trying to access protected routes
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  if (isProtectedPath && !accessToken) {
    const signInUrl = new URL("/sign-in", request.url);
    // signInUrl.searchParams.set("callbackUrl", pathname); // Optional: remember where they were going
    return NextResponse.redirect(signInUrl);
  }

  // 2. Redirect authenticated users trying to access auth routes (prevent double login)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  if (isAuthPath && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
