export const ADMIN_SESSION_COOKIE = "lst_admin_session";
const ADMIN_SESSION_VALUE = "active";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function resolvePassword(): string {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PANEL_PASSWORD ?? "";
}

export function isAdminPasswordConfigured(): boolean {
  return resolvePassword().trim().length > 0;
}

export function verifyAdminPassword(password: string): boolean {
  const configured = resolvePassword();
  if (configured.trim().length === 0) {
    return false;
  }

  return password === configured;
}

export function getAdminSessionCookieValue(): string {
  return ADMIN_SESSION_VALUE;
}

export function isValidAdminSession(sessionValue: string | null | undefined): boolean {
  return sessionValue === ADMIN_SESSION_VALUE;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/"
  };
}

export function getAdminLogoutCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
    path: "/"
  };
}
