import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/s3Client";

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  let object;
  try {
    object = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: filename }));
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  if (!object.Body) {
    return new NextResponse(null, { status: 404 });
  }

  const stream = await object.Body.transformToWebStream();
  return new NextResponse(stream, {
    headers: {
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
