import { prisma } from "@/lib/db";
import HeroForm from "@/components/Admin/HeroForm";
import GalleryImagesManager from "@/components/Admin/GalleryImagesManager";

export default async function HeroAdminPage() {
  const hero = await prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { slides: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Homepage Hero</h1>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <HeroForm initial={hero} />
      </div>

      <div className="admin-panel">
        <h2 className="admin-subsection-title">Background Slides</h2>
        <p className="panel-helper">
          These images rotate behind the hero content and appear in the
          decorative tilted frame.
        </p>
        <GalleryImagesManager apiBase="/api/admin/hero/slides" initial={hero.slides} itemLabel="slide" />
      </div>
    </>
  );
}
