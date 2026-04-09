import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "catring_admin_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "catring-admin-secret-key"
);

export type AdminSession = {
  id: string;
  email: string;
  name: string;
};

export async function createSession(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/admin");
  }

  return session;
}

export const sessionCookieName = SESSION_COOKIE;
