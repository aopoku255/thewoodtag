import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="not-found-shell">
      <span className="not-found-number" aria-hidden="true">
        404
      </span>
      <Reveal as="div" className="not-found-content">
        <div className="section-tag">Error 404</div>
        <h1>
          This <em>Frame</em>
          <br />
          Doesn&apos;t Exist
        </h1>
        <p>
          The page you&apos;re looking for may have been moved, renamed, or
          never existed. Let&apos;s get you back in focus.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn-gold" data-cursor-hover>
            <span>Back to Home</span>
          </Link>
          <Link href="/catalogue" className="btn-outline" data-cursor-hover>
            View Catalogue
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
