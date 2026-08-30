import { Suspense } from "react";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";
import BookingFlowLoader from "@/components/Booking/BookingFlowLoader";
import { getPublishedPackages, getBookingSettings, parseAddOnCatalog, parseOpenDays } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Book a Session — The Wood Tag" };

export default async function NewBookingPage() {
  const [packages, settings] = await Promise.all([getPublishedPackages(), getBookingSettings()]);

  return (
    <div className="page-shell">
      <Reveal as="div" className="page-panel">
        <div className="section-tag panel-eyebrow">BOOK A SESSION</div>
        <h1 className="page-heading">Pick a date, a slot, and you&apos;re set.</h1>
        <p className="page-lede">
          Choose add-ons if you&apos;d like, then confirm your details. We&apos;ll
          email a confirmation and hold your slot.
        </p>
      </Reveal>

      <Reveal as="div" delay={1} className="page-panel">
        <Suspense fallback={null}>
          <BookingFlowLoader
            packages={packages.map((p) => ({
              slug: p.slug,
              title: p.title,
              duration: p.duration,
              price: p.price,
              imageUrl: p.imageUrl,
              imageAlt: p.imageAlt,
            }))}
            timeSlots={settings.timeSlots.split(",").map((s) => s.trim())}
            openDays={[...parseOpenDays(settings.openDays)]}
            maxAdvanceDays={settings.maxAdvanceDays}
            minNoticeHours={settings.minNoticeHours}
            addOns={parseAddOnCatalog(settings.addOns)}
          />
        </Suspense>
      </Reveal>
    </div>
  );
}
