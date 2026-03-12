import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  getAdminSessionCookieValue,
  isAdminPasswordConfigured,
  verifyAdminPassword
} from "@/features/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let password = "";

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await request.json().catch(() => null)) as { password?: string } | null;
    password = payload?.password ?? "";
  } else {
    const formData = await request.formData();
    password = String(formData.get("password") ?? "");
  }

  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "ADMIN_PASSWORD is not configured"
      },
      { status: 500 }
    );
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid password"
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, getAdminSessionCookieValue(), getAdminSessionCookieOptions());
  return response;
}
