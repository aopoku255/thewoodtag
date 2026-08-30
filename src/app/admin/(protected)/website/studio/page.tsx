import { prisma } from "@/lib/db";
import PackagesManager from "@/components/Admin/PackagesManager";
import AddonsManager from "@/components/Admin/AddonsManager";
import StudioPageForm from "@/components/Admin/StudioPageForm";
import GalleryImagesManager from "@/components/Admin/GalleryImagesManager";

export default async function StudioAdminPage() {
  const [packages, addons, studioPage] = await Promise.all([
    prisma.studioPackage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.studioAddon.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.studioPageContent.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
      include: { views: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Studio Packages</h1>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h2 className="admin-subsection-title">Bookable Packages</h2>
        <p className="panel-helper">
          These appear on the public Studio and Pricing pages, and are what
          clients book through the booking flow.
        </p>
        <PackagesManager initial={packages} />
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h2 className="admin-subsection-title">Studio Add-ons</h2>
        <p className="panel-helper">
          Shown on the About page as optional studio extras.
        </p>
        <AddonsManager initial={addons} />
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h2 className="admin-subsection-title">About Page Intro</h2>
        <p className="panel-helper">
          The heading, copy, and buttons at the top of the public About page.
        </p>
        <StudioPageForm initial={studioPage} />
      </div>

      <div className="admin-panel">
        <h2 className="admin-subsection-title">About Page Gallery</h2>
        <p className="panel-helper">
          Rotates in the framed carousel next to the About page intro.
        </p>
        <GalleryImagesManager
          apiBase="/api/admin/studio-page/views"
          initial={studioPage.views}
          showCaption
          itemLabel="view"
        />
      </div>
    </>
  );
}
