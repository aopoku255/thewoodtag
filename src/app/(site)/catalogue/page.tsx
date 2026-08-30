import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";
import CatalogueGrid from "@/components/Catalogue/CatalogueGrid";
import { getPublishedCatalogueCategories, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("catalogue");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function CataloguePage() {
  const categories = await getPublishedCatalogueCategories();
  const view = categories.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    cover: { src: c.coverImageUrl, alt: c.coverImageAlt },
    images: c.images.map((img) => ({ src: img.imageUrl, alt: img.alt })),
  }));

  return (
    <section className="about-section">
      <Reveal as="div" className="section-tag">
        CATALOGUE
      </Reveal>

      <Reveal as="h1" delay={1} className="about-section-heading">
        Our <em>Catalogue</em>
      </Reveal>

      <Reveal as="p" delay={2} className="about-section-prose">
        Explore our photography collections by category. Click any image to
        view it full size and browse the collection with previous and next
        controls.
      </Reveal>

      <CatalogueGrid categories={view} />
    </section>
  );
}
