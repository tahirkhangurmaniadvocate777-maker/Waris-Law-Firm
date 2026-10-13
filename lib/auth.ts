import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "waris_admin_session";
export const SESSION_COOKIE_VALUE = "authenticated_admin_true";

/** @deprecated Use SESSION_COOKIE_NAME */
export const ADMIN_SESSION_COOKIE = SESSION_COOKIE_NAME;

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "waris-admin-2026";
}

export function verifyAdminPassword(password: string) {
  const expected = adminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(SESSION_COOKIE_VALUE);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
