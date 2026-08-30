"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import NavigationProgress from "./NavigationProgress";

interface NavLink {
  label: string;
  href: string;
}

export default function Header({
  navLinks,
  wordmark,
}: {
  navLinks: NavLink[];
  wordmark: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`site-navbar${scrolled ? " is-scrolled" : ""}`}>
        <Link href="/" aria-label={`${wordmark} home`}>
          <Logo wordmark={wordmark} />
        </Link>

        <ul className="nav-desktop-links">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`nav-link nav-desktop-link${
                    isActive ? " is-active" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="site-navbar-actions">
          <ThemeToggle />
          <button
            type="button"
            className="nav-mobile-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M1 4H15M1 8H15M1 12H15"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        <NavigationProgress />
      </nav>

      <div className={`site-navbar-mobile-panel${menuOpen ? " is-open" : ""}`}>
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
