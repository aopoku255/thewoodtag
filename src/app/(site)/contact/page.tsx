import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";
import ContactForm from "@/components/Contact/ContactForm";
import { getContactPageContent, getPublishedServices, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("contact");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function ContactPage() {
  const [content, services] = await Promise.all([getContactPageContent(), getPublishedServices()]);

  return (
    <div className="page-shell page-shell--narrow page-shell-centered">
      <Reveal as="div" className="section-tag">
        {content.eyebrow}
      </Reveal>

      <Reveal as="h1" delay={1} className="page-heading">
        {content.headingLine}
        <br />
        <em>{content.headingEmphasis}</em>
      </Reveal>

      <Reveal as="p" delay={2} className="page-lede">
        {content.description}
      </Reveal>

      <Reveal as="div" delay={3} className="page-panel form-panel">
        <ContactForm
          services={services.map((s) => ({ slug: s.slug, title: s.title }))}
          successHeading={content.successHeading}
          successMessage={content.successMessage}
        />
      </Reveal>
    </div>
  );
}
