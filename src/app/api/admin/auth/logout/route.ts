import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySessionByToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await destroySessionByToken(token);
  }
  store.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
