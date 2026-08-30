import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getSiteSettings, getSocialLinks, getNavItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, socialLinks, headerLinks, exploreLinks, sessionLinks, legalLinks] =
    await Promise.all([
      getSiteSettings(),
      getSocialLinks(),
      getNavItems("header"),
      getNavItems("footer-explore"),
      getNavItems("footer-sessions"),
      getNavItems("footer-legal"),
    ]);

  return (
    <>
      <Header
        navLinks={headerLinks.map((l) => ({ label: l.label, href: l.url }))}
        wordmark={settings.logoWordmark}
      />
      <main className="site-main">{children}</main>
      <Footer
        exploreLinks={exploreLinks.map((l) => ({ label: l.label, href: l.url }))}
        sessionLinks={sessionLinks.map((l) => ({ label: l.label, href: l.url }))}
        legalLinks={legalLinks.map((l) => ({ label: l.label, href: l.url }))}
        socialLinks={socialLinks.map((l) => ({ label: l.platform, url: l.url, icon: l.icon }))}
        settings={settings}
      />
    </>
  );
}
