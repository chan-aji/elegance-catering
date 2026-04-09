import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/data";
import { createSession, sessionCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const admin = await authenticateAdmin(body.email, body.password);

  if (!admin) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const token = await createSession(admin);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.json({ ok: true });
}
