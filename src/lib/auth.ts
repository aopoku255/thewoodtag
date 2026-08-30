import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { AdminUser } from "@prisma/client";

export const SESSION_COOKIE_NAME = "woodtag_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a session row and returns the raw token to store in a cookie. Only the hash is persisted. */
export async function createSession(adminUserId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      adminUserId,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  return token;
}

export async function destroySessionByToken(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}

/** Validates a raw session token against the DB, pruning it if expired. */
export async function getAdminForToken(token: string) {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { adminUser: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.adminUser;
}

/** Reads the session cookie (Server Components / Route Handlers only) and returns the signed-in admin, or null. */
export async function getCurrentAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getAdminForToken(token);
}

/**
 * Guard for API route handlers that mutate content. Returns the admin user
 * when authenticated, or `null` — callers should respond with 401 in that
 * case. Every write endpoint under /api/admin/** must call this first.
 */
export async function requireAdminOrNull() {
  return getCurrentAdmin();
}

/**
 * Wraps an /api/admin/** route handler so it 401s automatically when there
 * is no valid session — every admin API route uses this instead of
 * duplicating the same check.
 */
export function withAdmin<Args extends unknown[]>(
  handler: (admin: AdminUser, ...args: Args) => Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(admin, ...args);
  };
}
