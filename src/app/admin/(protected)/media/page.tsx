import { prisma } from "@/lib/db";
import MediaLibraryManager from "@/components/Admin/MediaLibraryManager";

export default async function MediaAdminPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">LIBRARY</div>
          <h1 className="admin-section-title">Media</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          Every image uploaded from any content form lives here. Deleting a
          file that&apos;s still in use elsewhere will break that image, so
          replace it first.
        </p>
        <MediaLibraryManager initial={assets} />
      </div>
    </>
  );
}
