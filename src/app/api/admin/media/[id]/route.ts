import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/mediaStorage";

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    await deleteUploadedFile(asset.url);
    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
