import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const pages = await prisma.seoSetting.findMany({ orderBy: { page: "asc" } });
  return NextResponse.json({ pages });
});
