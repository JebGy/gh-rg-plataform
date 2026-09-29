import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "rg_admin_session";

// Secret hash key for session verification
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "rg_antigravity_secret_key_2026";

export function generateToken(username: string): string {
  const data = `${username}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${hmac}`).toString("base64");
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [username, timestamp, hmac] = decoded.split(":");
    if (username !== (process.env.ADMIN_USERNAME || "root")) return false;
    const expectedHmac = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(`${username}:${timestamp}`)
      .digest("hex");
    return hmac === expectedHmac;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  return verifyToken(sessionCookie.value);
}

export async function createAdminSession(username: string): Promise<void> {
  const token = generateToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
