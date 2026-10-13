import { NextResponse } from "next/server";
import { isAdminAuthenticated, setAdminSession, verifyAdminPassword } from "@/lib/auth";

/** GET — lightweight session check for the admin UI. */
export async function GET() {
  const ok = await isAdminAuthenticated();
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 });
}

/** POST { password } — verifies ADMIN_PASSWORD and sets httpOnly waris_admin_session. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const password = String(body.password ?? "");
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
