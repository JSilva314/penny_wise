import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/auth/signin" || path === "/auth/signup"

  // Get the token from the session cookie
  const token = request.cookies.get("authjs.session-token")?.value || 
                request.cookies.get("__Secure-authjs.session-token")?.value

  // Redirect to signin if accessing protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Redirect to dashboard if accessing auth pages with token
  if (isPublicPath && token && path.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
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
}
