import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, getAdminLogoutCookieOptions } from "@/features/admin/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", getAdminLogoutCookieOptions());
  return response;
}
