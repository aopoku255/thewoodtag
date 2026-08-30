import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";
import BookingLookup from "@/components/Bookings/BookingLookup";
import { getBookingSettings, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("bookings");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function BookingsPage() {
  const settings = await getBookingSettings();

  return (
    <div className="page-shell page-shell--narrow">
      <Reveal as="div" className="page-panel">
        <div className="section-tag panel-eyebrow">BOOKINGS</div>
        <h1 className="page-heading">{settings.lookupHeading}</h1>
        <p className="page-lede">{settings.lookupDescription}</p>
      </Reveal>

      <Reveal as="div" delay={1} className="page-panel">
        <div className="section-tag panel-eyebrow">LOOKUP</div>
        <h2 className="panel-subheading">Booking reference</h2>
        <BookingLookup />
      </Reveal>
    </div>
  );
}
