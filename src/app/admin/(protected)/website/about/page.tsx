import { prisma } from "@/lib/db";
import AboutForm from "@/components/Admin/AboutForm";
import GalleryImagesManager from "@/components/Admin/GalleryImagesManager";

export default async function AboutAdminPage() {
  const about = await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { galleryImages: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">About Section</h1>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <AboutForm initial={about} />
      </div>

      <div className="admin-panel">
        <h2 className="admin-subsection-title">Gallery Images</h2>
        <p className="panel-helper">
          These rotate in the framed carousel next to the About copy on the
          homepage.
        </p>
        <GalleryImagesManager
          apiBase="/api/admin/about/gallery"
          initial={about.galleryImages}
          showCaption
          itemLabel="image"
        />
      </div>
    </>
  );
}
