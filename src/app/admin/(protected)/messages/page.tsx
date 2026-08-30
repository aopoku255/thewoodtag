import { prisma } from "@/lib/db";
import MessagesManager from "@/components/Admin/MessagesManager";

export default async function MessagesAdminPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">INBOX</div>
          <h1 className="admin-section-title">Messages</h1>
        </div>
      </div>

      <div className="admin-panel">
        <MessagesManager initial={messages} />
      </div>
    </>
  );
}
