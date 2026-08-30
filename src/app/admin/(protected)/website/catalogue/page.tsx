import { prisma } from "@/lib/db";
import CatalogueManager from "@/components/Admin/CatalogueManager";

export default async function CatalogueAdminPage() {
  const categories = await prisma.catalogueCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Catalogue</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          Click a category to manage its gallery images. Categories appear on
          the public Catalogue page in the order shown below.
        </p>
        <CatalogueManager initial={categories} />
      </div>
    </>
  );
}
