import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";
import { saveUploadedFile, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/mediaStorage";

export const GET = withAdmin(async () => {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ assets });
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or SVG." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large (8MB max)." }, { status: 400 });
  }

  const { url, filename } = await saveUploadedFile(file);
  const asset = await prisma.mediaAsset.create({
    data: { url, filename, alt, mimeType: file.type, size: file.size },
  });

  return NextResponse.json({ asset }, { status: 201 });
});
