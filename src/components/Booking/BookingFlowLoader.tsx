"use client";

import { useSearchParams } from "next/navigation";
import BookingFlow, { type BookingPackageView } from "./BookingFlow";

interface BookingFlowLoaderProps {
  packages: BookingPackageView[];
  timeSlots: string[];
  openDays: number[];
  maxAdvanceDays: number;
  minNoticeHours: number;
  addOns: { name: string; price: number }[];
}

export default function BookingFlowLoader({
  packages,
  timeSlots,
  openDays,
  maxAdvanceDays,
  minNoticeHours,
  addOns,
}: BookingFlowLoaderProps) {
  const searchParams = useSearchParams();
  const initialPackageSlug = searchParams.get("package") ?? undefined;
  return (
    <BookingFlow
      packages={packages}
      initialPackageSlug={initialPackageSlug}
      timeSlots={timeSlots}
      openDays={new Set(openDays)}
      maxAdvanceDays={maxAdvanceDays}
      minNoticeHours={minNoticeHours}
      addOns={addOns}
    />
  );
}
