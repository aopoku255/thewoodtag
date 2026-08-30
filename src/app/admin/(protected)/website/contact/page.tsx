import { prisma } from "@/lib/db";
import ContactPageForm from "@/components/Admin/ContactPageForm";

export default async function ContactAdminPage() {
  const content = await prisma.contactPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Contact Page</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          The heading and copy shown on the public Contact page. Contact
          details like email and phone live in General Settings.
        </p>
        <ContactPageForm initial={content} />
      </div>
    </>
  );
}
