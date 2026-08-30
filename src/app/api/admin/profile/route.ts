import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const PUT = withAdmin(async (admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  if (parsed.data.email !== admin.email) {
    const existing = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
  }
  const updated = await prisma.adminUser.update({ where: { id: admin.id }, data: parsed.data });
  return NextResponse.json({ admin: { email: updated.email, name: updated.name } });
});
