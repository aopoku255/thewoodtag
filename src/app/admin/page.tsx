import { redirect } from "next/navigation";
import Reveal from "@/components/Reveal/Reveal";
import ThemeToggle from "@/components/Header/ThemeToggle";
import AdminGateForm from "@/components/Admin/AdminGateForm";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FEATURES = [
  "Manage incoming client bookings and booking status updates",
  "Organize studio packages, pricing options, and availability",
  "Control studio slot schedules from the protected admin workspace",
];

export default async function AdminGatePage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin/dashboard");

  return (
    <div className="admin-gate">
      <div className="admin-gate-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="admin-gate-grid">
        <Reveal as="div" className="admin-gate-panel">
          <div className="section-tag panel-eyebrow">ADMIN PORTAL</div>
          <h1 className="admin-gate-heading">
            Manage studio operations with one secure workspace.
          </h1>
          <p className="admin-gate-lede">
            Use this workspace to manage photography packages, studio slot
            schedules, and client bookings from one secure back office while
            keeping the public-facing studio site focused on the brand
            experience.
          </p>
          <div className="admin-gate-features">
            {FEATURES.map((feature) => (
              <div key={feature} className="admin-gate-feature">
                {feature}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" delay={1} className="admin-gate-panel">
          <div className="section-tag panel-eyebrow">SIGN IN</div>
          <h2 className="panel-subheading">Welcome back</h2>
          <p className="admin-gate-form-helper">
            Use your admin credentials to access the portal dashboard.
          </p>
          <AdminGateForm />
        </Reveal>
      </div>
    </div>
  );
}
