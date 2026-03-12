import { NextRequest, NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/features/admin/auth";

const ADMIN_LOGIN_PATH = "/admin/login";

function isAuthorized(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidAdminSession(sessionCookie);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN_PATH || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  if (isAdminApiRoute) {
    return NextResponse.json(
      {
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
