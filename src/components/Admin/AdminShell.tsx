"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/Header/ThemeToggle";

type NavEntry =
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; items: { label: string; href: string }[] };

const NAV: NavEntry[] = [
  { type: "link", label: "Dashboard", href: "/admin/dashboard" },
  {
    type: "group",
    label: "Website",
    items: [
      { label: "General Settings", href: "/admin/website/general" },
      { label: "Homepage Hero", href: "/admin/website/hero" },
      { label: "About Section", href: "/admin/website/about" },
      { label: "Services", href: "/admin/website/services" },
      { label: "Catalogue", href: "/admin/website/catalogue" },
      { label: "Studio Packages", href: "/admin/website/studio" },
      { label: "Booking", href: "/admin/website/booking" },
      { label: "Contact Page", href: "/admin/website/contact" },
      { label: "Navigation", href: "/admin/website/navigation" },
      { label: "Legal Pages", href: "/admin/website/legal" },
      { label: "SEO", href: "/admin/website/seo" },
    ],
  },
  { type: "link", label: "Media", href: "/admin/media" },
  { type: "link", label: "Bookings", href: "/admin/bookings" },
  { type: "link", label: "Messages", href: "/admin/messages" },
  {
    type: "group",
    label: "Settings",
    items: [
      { label: "Admin Profile", href: "/admin/settings/profile" },
      { label: "Password", href: "/admin/settings/password" },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/website/general": "General Settings",
  "/admin/website/hero": "Homepage Hero",
  "/admin/website/about": "About Section",
  "/admin/website/services": "Services",
  "/admin/website/catalogue": "Catalogue",
  "/admin/website/studio": "Studio Packages",
  "/admin/website/booking": "Booking",
  "/admin/website/contact": "Contact Page",
  "/admin/website/navigation": "Navigation",
  "/admin/website/legal": "Legal Pages",
  "/admin/website/seo": "SEO",
  "/admin/media": "Media",
  "/admin/bookings": "Bookings",
  "/admin/messages": "Messages",
  "/admin/settings/profile": "Admin Profile",
  "/admin/settings/password": "Password",
};

function SidebarNav({
  pathname,
  adminEmail,
  onNavigate,
}: {
  pathname: string;
  adminEmail: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin");
    router.refresh();
  };

  return (
    <>
      <div className="admin-portal-brand">
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="13" stroke="var(--gold)" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="3" fill="var(--gold)" />
        </svg>
        <span className="site-navbar-logo-word">
          LUM<em>EN</em>
        </span>
      </div>

      <nav className="admin-portal-nav">
        {NAV.map((entry) =>
          entry.type === "link" ? (
            <Link
              key={entry.href}
              href={entry.href}
              className={`admin-nav-link${pathname === entry.href ? " is-active" : ""}`}
              onClick={onNavigate}
              data-cursor-hover
            >
              {entry.label}
            </Link>
          ) : (
            <div key={entry.label} className="admin-nav-group">
              <div className="admin-nav-group__label">{entry.label}</div>
              {entry.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link admin-nav-link--sub${
                    pathname === item.href ? " is-active" : ""
                  }`}
                  onClick={onNavigate}
                  data-cursor-hover
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )
        )}
      </nav>

      <div className="admin-portal-signout">
        <button type="button" onClick={handleSignOut} disabled={signingOut} data-cursor-hover>
          {signingOut && <span className="btn-spinner" aria-hidden="true" />}
          Sign Out ({adminEmail})
        </button>
      </div>
    </>
  );
}

export default function AdminShell({
  children,
  adminEmail,
}: {
  children: ReactNode;
  adminEmail: string;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <div className="admin-portal-root">
      <div className="admin-mobile-topbar">
        <button
          type="button"
          className="admin-mobile-menu-btn"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
          data-cursor-hover
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M1 4H15M1 8H15M1 12H15"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="admin-mobile-topbar-title">{title}</span>
        <ThemeToggle />
      </div>

      {drawerOpen && (
        <button
          type="button"
          className="admin-nav-drawer-backdrop"
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`admin-portal-sidebar--drawer${
          drawerOpen ? " admin-portal-sidebar--drawer-open" : " admin-portal-sidebar--drawer-closed"
        }`}
      >
        <div className="page-panel admin-portal-sidebar--drawer-scroll">
          <SidebarNav pathname={pathname} adminEmail={adminEmail} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </aside>

      <div className="admin-portal-grid">
        <aside className="admin-portal-sidebar">
          <SidebarNav pathname={pathname} adminEmail={adminEmail} />
        </aside>
        <main className="admin-portal-main">{children}</main>
      </div>
    </div>
  );
}
