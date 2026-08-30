import { randomUUID } from "crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "./s3Client";

/**
 * S3-compatible bucket media storage (Tigris). The bucket itself stays
 * private — Tigris doesn't support public-read bucket policies via the S3
 * API — so uploaded files are served back through the `/media/[filename]`
 * proxy route, not a direct bucket URL. Every caller only depends on this
 * module's two functions, never on the S3 client directly, so the backing
 * provider can change again without touching call sites.
 */

const PUBLIC_PREFIX = "/media/";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

function extensionFor(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

export async function saveUploadedFile(
  file: File
): Promise<{ url: string; filename: string }> {
  const ext = extensionFor(file.type);
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    })
  );
  return { url: `${PUBLIC_PREFIX}${filename}`, filename };
}

export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url.startsWith(PUBLIC_PREFIX)) return; // never touch non-uploaded assets
  const key = url.slice(PUBLIC_PREFIX.length);
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch {
    // already gone — fine
  }
}
