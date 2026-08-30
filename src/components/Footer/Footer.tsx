import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface SocialItem {
  label: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  logoWordmark: string;
  footerQuote: string;
  primaryEmail: string;
  phone: string;
  address: string;
  businessHours: string;
  copyrightText: string;
  footerCredit: string;
}

const ICON_PATHS: Record<string, string> = {
  camera: "M4 4h12v12H4z M8 8h4v4H8z M13 3.5h.01",
  play: "M4 4l12 6-12 6z",
  linkedin:
    "M4 8h2v8H4zM5 4a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 5 4zM9 8h2v1.3C11.6 8.3 12.7 8 13.8 8c2.2 0 3.2 1.4 3.2 4v4h-2v-3.6c0-1.3-.5-2.1-1.6-2.1-1 0-1.7.7-1.9 1.4-.1.2-.1.5-.1.8V16H9z",
  sparkle: "M10 3l1.8 4.7L16.5 9l-4.7 1.8L10 15.5l-1.8-4.7L3.5 9l4.7-1.3z",
};

function splitWordmark(wordmark: string): [string, string] {
  const emLength = Math.min(2, Math.max(1, wordmark.length - 1));
  const splitAt = wordmark.length - emLength;
  return [wordmark.slice(0, splitAt), wordmark.slice(splitAt)];
}

export default function Footer({
  exploreLinks,
  sessionLinks,
  legalLinks,
  socialLinks,
  settings,
}: {
  exploreLinks: NavLink[];
  sessionLinks: NavLink[];
  legalLinks: NavLink[];
  socialLinks: SocialItem[];
  settings: FooterSettings;
}) {
  const [bold, em] = splitWordmark(settings.logoWordmark);
  const contactLinks: NavLink[] = [
    { label: settings.primaryEmail, href: `mailto:${settings.primaryEmail}` },
    { label: settings.phone, href: `tel:${settings.phone.replace(/[^0-9+]/g, "")}` },
    { label: settings.address, href: "/contact" },
    { label: settings.businessHours, href: "/contact" },
    ...legalLinks,
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <Link href="/" aria-label={`${settings.logoWordmark} home`}>
            <span className="site-footer-brand-word">
              {bold}
              <em>{em}</em> STUDIO
            </span>
          </Link>
          <p className="site-footer-quote">&ldquo;{settings.footerQuote}&rdquo;</p>
          <div className="site-footer-social">
            {socialLinks.map((icon) => (
              <a key={icon.label} href={icon.url} aria-label={icon.label} data-cursor-hover>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d={ICON_PATHS[icon.icon] ?? ICON_PATHS.camera}
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer-col">
          <div className="site-footer-col-title">Explore</div>
          <ul>
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-col">
          <div className="site-footer-col-title">Sessions</div>
          <ul>
            {sessionLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-col">
          <div className="site-footer-col-title">Contact</div>
          <ul>
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>
          &copy; {new Date().getFullYear()} {settings.copyrightText}
        </span>
        <em>{settings.footerCredit}</em>
      </div>
    </footer>
  );
}
