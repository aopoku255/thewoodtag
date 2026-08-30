import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";
import { getPublishedServices, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("services");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <section className="about-section">
      <Reveal as="div" className="section-tag">
        WHAT WE OFFER
      </Reveal>

      <Reveal as="h1" delay={1} className="about-section-heading">
        Our <em>Craft</em>
      </Reveal>

      <div className="service-grid">
        {services.map((service, i) => (
          <Reveal
            as="div"
            key={service.id}
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
            className="service-card"
          >
            <div className="service-card__media img-reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.imageUrl} alt={service.imageAlt} />
            </div>
            <div className="service-card__body">
              <div className="service-card__index">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="service-card__title">{service.title}</h2>
              <p className="service-card__desc">{service.description}</p>
            </div>
          </Reveal>
        ))}
        {services.length === 0 && (
          <p style={{ padding: "40px", color: "var(--text-muted)" }}>
            No services published yet.
          </p>
        )}
      </div>
    </section>
  );
}
