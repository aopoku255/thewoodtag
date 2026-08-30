import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL || "admin@thewoodtag.com";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "woodtag-admin-2026";

async function main() {
  // ---------- Admin user ----------
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await prisma.adminUser.create({
      data: { email: ADMIN_EMAIL, passwordHash, name: "Studio Admin" },
    });
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  }

  // ---------- Site settings ----------
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "Instagram", url: "#", icon: "camera", sortOrder: 0 },
      { platform: "Video reel", url: "#", icon: "play", sortOrder: 1 },
      { platform: "LinkedIn", url: "#", icon: "linkedin", sortOrder: 2 },
      { platform: "Highlights", url: "#", icon: "sparkle", sortOrder: 3 },
    ],
  });

  // ---------- Navigation ----------
  await prisma.navigationItem.deleteMany();
  await prisma.navigationItem.createMany({
    data: [
      { label: "Studio", url: "/studio", location: "header", sortOrder: 0 },
      { label: "Services", url: "/services", location: "header", sortOrder: 1 },
      { label: "Catalogue", url: "/catalogue", location: "header", sortOrder: 2 },
      { label: "My booking", url: "/bookings", location: "header", sortOrder: 3 },
      { label: "Contact", url: "/contact", location: "header", sortOrder: 4 },

      { label: "About Us", url: "/about", location: "footer-explore", sortOrder: 0 },
      { label: "Services", url: "/services", location: "footer-explore", sortOrder: 1 },
      { label: "Catalogue", url: "/catalogue", location: "footer-explore", sortOrder: 2 },

      { label: "Packages", url: "/pricing", location: "footer-sessions", sortOrder: 0 },
      { label: "Book a Session", url: "/contact", location: "footer-sessions", sortOrder: 1 },

      { label: "Privacy Policy", url: "/privacy", location: "footer-legal", sortOrder: 0 },
      { label: "Refund & Cancellation", url: "/refund-cancellation", location: "footer-legal", sortOrder: 1 },
      { label: "Portrait Sessions Terms", url: "/portrait-terms", location: "footer-legal", sortOrder: 2 },
    ],
  });

  // ---------- Hero ----------
  const hero = await prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: [
      { heroId: hero.id, imageUrl: "/images/hero-01.svg", alt: "Studio portrait placeholder, warm amber tone", sortOrder: 0 },
      { heroId: hero.id, imageUrl: "/images/hero-02.svg", alt: "Studio portrait placeholder, terracotta tone", sortOrder: 1 },
      { heroId: hero.id, imageUrl: "/images/hero-03.svg", alt: "Studio portrait placeholder, bronze tone", sortOrder: 2 },
      { heroId: hero.id, imageUrl: "/images/hero-04.svg", alt: "Studio portrait placeholder, plum dusk tone", sortOrder: 3 },
    ],
  });

  // ---------- About ----------
  const about = await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  await prisma.aboutGalleryImage.deleteMany();
  await prisma.aboutGalleryImage.createMany({
    data: [
      { aboutId: about.id, imageUrl: "/images/about-01.svg", alt: "Editorial portrait placeholder", caption: "EDITORIAL", sortOrder: 0 },
      { aboutId: about.id, imageUrl: "/images/about-02.svg", alt: "Couples portrait placeholder", caption: "COUPLES", sortOrder: 1 },
      { aboutId: about.id, imageUrl: "/images/about-03.svg", alt: "Studio portrait placeholder", caption: "STUDIO", sortOrder: 2 },
      { aboutId: about.id, imageUrl: "/images/about-04.svg", alt: "Portrait session placeholder", caption: "PORTRAITS", sortOrder: 3 },
    ],
  });

  // ---------- Services ----------
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      { slug: "wedding", title: "Wedding", description: "Exceptional imagery for extraordinary love stories.", imageUrl: "/images/service-wedding.svg", imageAlt: "Wedding photography placeholder", sortOrder: 0 },
      { slug: "couples", title: "Couples Experience", description: "A refined pre-wedding experience capturing your love story with elegance and authenticity.", imageUrl: "/images/service-couples.svg", imageAlt: "Couples photography placeholder", sortOrder: 1 },
      { slug: "family", title: "Family Session", description: "A refined session capturing timeless moments, together.", imageUrl: "/images/service-family.svg", imageAlt: "Family photography placeholder", sortOrder: 2 },
      { slug: "portraits", title: "Portraits", description: "Classic portraits thoughtfully crafted to celebrate you with elegance, authenticity, and timeless style.", imageUrl: "/images/service-portraits.svg", imageAlt: "Portrait photography placeholder", sortOrder: 3 },
      { slug: "events", title: "Events", description: "Tailored to capture every important moment of your event, from intimate gatherings to large-scale celebrations.", imageUrl: "/images/service-events.svg", imageAlt: "Event photography placeholder", sortOrder: 4 },
      { slug: "kids-maternity", title: "Kids & Maternity", description: "The beauty of motherhood and the joy of childhood, with warmth and genuine emotion.", imageUrl: "/images/service-kids-maternity.svg", imageAlt: "Kids and maternity photography placeholder", sortOrder: 5 },
      { slug: "call-to-the-bar", title: "Call to the Bar", description: "Timeless, editorial-inspired portraits crafted to preserve your achievement with elegance and distinction.", imageUrl: "/images/service-call-to-bar.svg", imageAlt: "Call to the Bar photography placeholder", sortOrder: 6 },
      { slug: "senior-portraits", title: "Senior Portraits", description: "Editorial in feel, personal in story, crafted to mark the milestone with elegance.", imageUrl: "/images/service-senior.svg", imageAlt: "Senior portrait photography placeholder", sortOrder: 7 },
    ],
  });

  // ---------- Catalogue ----------
  await prisma.catalogueImage.deleteMany();
  await prisma.catalogueCategory.deleteMany();

  const catalogueSeed: {
    slug: string;
    title: string;
    description: string;
    cover: string;
    count: number;
  }[] = [
    { slug: "portraits", title: "Portraits", description: "Classic and editorial portraiture, shot with intention.", cover: "/images/catalogue-portraits.svg", count: 4 },
    { slug: "couples", title: "Couples", description: "Warm, candid moments between two people.", cover: "/images/catalogue-couples.svg", count: 4 },
    { slug: "maternity", title: "Maternity", description: "Soft, celebratory imagery for a season of anticipation.", cover: "/images/catalogue-maternity.svg", count: 6 },
    { slug: "graduation", title: "Graduation", description: "Academic milestone portraits with confidence, pride, and a polished editorial feel.", cover: "/images/catalogue-graduation.svg", count: 6 },
    { slug: "call-to-bar", title: "Call To Bar", description: "Call to Bar and legal portrait sessions created with presence, sophistication, and detail.", cover: "/images/catalogue-call-to-bar.svg", count: 4 },
    { slug: "wedding", title: "Wedding", description: "Elegant wedding imagery filled with emotion, celebration, and timeless detail.", cover: "/images/catalogue-wedding.svg", count: 4 },
  ];

  for (let i = 0; i < catalogueSeed.length; i++) {
    const c = catalogueSeed[i];
    const category = await prisma.catalogueCategory.create({
      data: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        coverImageUrl: c.cover,
        coverImageAlt: `${c.title} catalogue placeholder`,
        sortOrder: i,
      },
    });
    await prisma.catalogueImage.createMany({
      data: Array.from({ length: c.count }, (_, idx) => ({
        categoryId: category.id,
        imageUrl: `/images/catalogue/${c.slug}-${String(idx + 1).padStart(2, "0")}.svg`,
        alt: `${c.title} placeholder image ${idx + 1}`,
        sortOrder: idx,
      })),
    });
  }

  // ---------- Studio packages ----------
  await prisma.studioPackage.deleteMany();
  await prisma.studioPackage.createMany({
    data: [
      { slug: "plain-backdrop", title: "Plain Backdrop", duration: "60 min", price: "GHS 150", hourlyLabel: "Hourly GHS 150", description: "Plain backdrop setup | Studio lighting included | Changing closet.", imageUrl: "/images/studio-package-01.svg", imageAlt: "Plain backdrop package placeholder", sortOrder: 0 },
      { slug: "canvas-backdrops", title: "Canvas Backdrops", duration: "60 min", price: "GHS 220", hourlyLabel: "Hourly GHS 200", description: "Canvas backdrop setup | Studio lighting included | Changing closet.", imageUrl: "/images/studio-package-02.svg", imageAlt: "Canvas backdrop package placeholder", sortOrder: 1 },
      { slug: "canvas-plain-combo", title: "Canvas and Plain Backdrop Combo", duration: "90 min", price: "GHS 300", hourlyLabel: "Hourly GHS 300", description: "Backdrop combo with light | Canvas & plain backdrops | Changing closet included.", imageUrl: "/images/studio-package-03.svg", imageAlt: "Backdrop combo package placeholder", sortOrder: 2 },
      { slug: "aesthetic-corners", title: "Aesthetic Corners", duration: "90 min", price: "GHS 500", hourlyLabel: "Hourly GHS 250", description: "Aesthetic corners with light | About 4-7 decorated sets | Makeup space & changing closet included.", imageUrl: "/images/studio-package-04.svg", imageAlt: "Aesthetic corners package placeholder", sortOrder: 3 },
      { slug: "full-studio", title: "The Wood Tag Full Studio", duration: "120 min", price: "GHS 700", hourlyLabel: "Hourly GHS 350", description: "Backdrop + aesthetic corners | Full lighting setup | Makeup space included | Best full experience.", imageUrl: "/images/studio-package-05.svg", imageAlt: "Full studio package placeholder", sortOrder: 4 },
      { slug: "content-creator-bundle", title: "Content Creator Bundle", duration: "120 min", price: "GHS 350", hourlyLabel: "Hourly GHS 175", description: "Tripod | Aesthetic corner | Makeup space | Microphone | Lighting.", imageUrl: "/images/studio-package-06.svg", imageAlt: "Content creator bundle placeholder", sortOrder: 5 },
    ],
  });

  const studioPage = await prisma.studioPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  await prisma.studioView.deleteMany();
  await prisma.studioView.createMany({
    data: [
      { pageId: studioPage.id, imageUrl: "/images/studio-view-01.svg", alt: "Studio corner placeholder", caption: "Aesthetic Corners", sortOrder: 0 },
      { pageId: studioPage.id, imageUrl: "/images/studio-view-02.svg", alt: "Studio backdrop placeholder", caption: "Backdrop Wall", sortOrder: 1 },
      { pageId: studioPage.id, imageUrl: "/images/studio-view-03.svg", alt: "Studio lighting setup placeholder", caption: "Lighting Rig", sortOrder: 2 },
      { pageId: studioPage.id, imageUrl: "/images/studio-view-04.svg", alt: "Studio lounge placeholder", caption: "Client Lounge", sortOrder: 3 },
    ],
  });

  await prisma.studioAddon.deleteMany();
  await prisma.studioAddon.createMany({
    data: [
      { slug: "camera-with-lens", title: "Camera with Lens", spec: "Canon-equivalent body with 85mm or 50mm lens", description: "Access to a professional camera and selected lenses. Available for clients who need equipment for their shoot but do not own a camera.", imageUrl: "/images/studio-view-02.svg", imageAlt: "Camera with lens placeholder", sortOrder: 0 },
      { slug: "backdrop-combo", title: "Backdrop Combo", spec: "With light · 1 hour 30 minutes", description: "A flexible studio option that allows the use of multiple backdrops within one session, combined with professional lighting.", imageUrl: "/images/studio-view-01.svg", imageAlt: "Backdrop combo placeholder", sortOrder: 1 },
      { slug: "lighting-kit", title: "Extra Lighting Kit", spec: "Two-point softbox setup", description: "Add a second lighting setup for more dramatic falloff, rim light, or a second background wash during your session.", imageUrl: "/images/studio-view-03.svg", imageAlt: "Lighting kit placeholder", sortOrder: 2 },
      { slug: "wardrobe-styling", title: "Wardrobe & Styling", spec: "Changing closet included", description: "A private changing space and light styling support so you can switch looks between sets without leaving the studio.", imageUrl: "/images/studio-view-04.svg", imageAlt: "Wardrobe and styling placeholder", sortOrder: 3 },
    ],
  });

  // ---------- Contact ----------
  await prisma.contactPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // ---------- Booking settings ----------
  await prisma.bookingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // ---------- Legal pages ----------
  await prisma.legalPage.deleteMany();
  await prisma.legalPage.createMany({
    data: [
      {
        slug: "privacy",
        title: "Privacy Policy",
        description: "This page explains what information we collect, how it is used, and how photographs from your session are handled.",
        sectionsJson: JSON.stringify([
          {
            heading: "Information We Collect",
            subsections: [
              { label: "1. Contact & Booking Details", bullets: ["Name, email, and phone number provided through the booking or contact form.", "Session preferences, dates, and any notes you share about your project.", "Payment confirmation details, handled by our payment processor — we do not store card numbers."] },
              { label: "2. Photographs & Media", bullets: ["Images captured during your session are stored securely for editing and delivery.", "Selected images may be used in our portfolio, catalogue, or social channels unless you opt out in writing.", "Raw, unedited files are retained for a limited period and then archived or deleted."] },
            ],
          },
          {
            heading: "How We Use Your Information",
            subsections: [
              { label: "3. Communication", bullets: ["To confirm bookings, send reminders, and share delivery updates.", "To respond to enquiries submitted through the contact form."] },
              { label: "4. What We Never Do", bullets: ["We do not sell client information to third parties.", "We do not share personal contact details outside the studio without consent."] },
            ],
          },
          {
            heading: "Your Choices",
            subsections: [
              { label: "5. Access & Removal", bullets: ["You may request a copy of the information we hold about you at any time.", "You may ask us to remove your images from our public portfolio or social channels.", "Reach out through the contact page and we will action requests within a reasonable timeframe."] },
            ],
          },
        ]),
      },
      {
        slug: "refund-cancellation",
        title: "Refund & Cancellation",
        description: "Our booking terms exist to protect studio time for every client. Please read this before confirming a session.",
        sectionsJson: JSON.stringify([
          {
            heading: "Deposits & Payment",
            subsections: [
              { label: "1. Booking & Payment", bullets: ["A non-refundable deposit is required to secure every session or studio rental.", "Your date and time are confirmed only once the deposit is received.", "Any remaining balance is due on or before the day of the shoot.", "No booking is held without payment."] },
            ],
          },
          {
            heading: "Cancellations & Rescheduling",
            subsections: [
              { label: "2. Rescheduling", bullets: ["Deposits are non-refundable under all circumstances.", "Clients may reschedule once with at least 48 hours' notice.", "Same-day rescheduling or no-shows result in loss of the deposit.", "Late arrival reduces your session time rather than delaying the next booking."] },
            ],
          },
          {
            heading: "Session Time",
            subsections: [
              { label: "3. During Your Session", bullets: ["Sessions begin at the scheduled time, whether or not all party members have arrived.", "Unused time is not refundable or transferable to a future session.", "Overtime is billed in 30-minute increments at the package's hourly rate."] },
            ],
          },
        ]),
      },
      {
        slug: "portrait-terms",
        title: "Portrait Sessions Terms",
        description: "The terms below apply to portrait, editorial, and studio-rental sessions booked with The Wood Tag.",
        sectionsJson: JSON.stringify([
          {
            heading: "Deliverables & Editing",
            subsections: [
              { label: "1. Editing Style", bullets: ["All images are edited in The Wood Tag's signature retouching style.", "Custom edit requests outside our standard style may incur an additional fee.", "Selects are delivered via an online gallery within the timeframe stated in your package."] },
              { label: "2. Raw Files", bullets: ["Unedited raw files are not included and are only available as a paid add-on."] },
            ],
          },
          {
            heading: "Usage Rights",
            subsections: [
              { label: "3. Personal Use", bullets: ["Clients receive a personal-use license to print and share delivered images.", "Commercial use of delivered images requires a separate licensing agreement."] },
              { label: "4. Studio Portfolio", bullets: ["The Wood Tag retains the right to use session images for portfolio and marketing purposes.", "Clients may request specific images be excluded from public use at any time."] },
            ],
          },
          {
            heading: "Studio Conduct",
            subsections: [
              { label: "5. During Your Visit", bullets: ["Please arrive with hair and makeup ready unless your package includes styling support.", "Outside food and drink are welcome in designated areas of the studio only.", "Studio equipment and props are to be handled with care; damage may incur a fee."] },
            ],
          },
        ]),
      },
    ],
  });

  // ---------- SEO ----------
  await prisma.seoSetting.deleteMany();
  await prisma.seoSetting.createMany({
    data: [
      { page: "home", title: "The Wood Tag — Photography Studio", metaDescription: "Where light becomes story. A fine-art portrait and editorial photography studio." },
      { page: "services", title: "Services — The Wood Tag", metaDescription: "Wedding, portrait, family, and editorial photography services at The Wood Tag." },
      { page: "catalogue", title: "Catalogue — The Wood Tag", metaDescription: "Browse our photography catalogue by category." },
      { page: "studio", title: "Studio — The Wood Tag", metaDescription: "Book the studio by package." },
      { page: "about", title: "About — The Wood Tag", metaDescription: "Studio packages and behind-the-scenes views of The Wood Tag." },
      { page: "contact", title: "Contact — The Wood Tag", metaDescription: "Get in touch with The Wood Tag to plan your session." },
      { page: "pricing", title: "Packages — The Wood Tag", metaDescription: "Studio session pricing at a glance." },
      { page: "bookings", title: "My Booking — The Wood Tag", metaDescription: "Look up your booking and receipt." },
    ],
  });

  // ---------- Sample bookings & messages (for the admin demo) ----------
  const bookingCount = await prisma.booking.count();
  if (bookingCount === 0) {
    await prisma.booking.createMany({
      data: [
        { reference: "WOODTAG-DEMO-2026", clientName: "Ama Mensah", email: "ama@example.com", phone: "+1 555 000 1111", packageTitle: "Aesthetic Corners", date: "2026-03-14", time: "2:00 PM", status: "confirmed", total: 500, balanceDue: 0 },
        { reference: "WOODTAG-CAN-7731", clientName: "Kojo Boateng", email: "kojo@example.com", phone: "+1 555 000 2222", packageTitle: "Canvas Backdrops", date: "2026-03-16", time: "11:00 AM", status: "pending", total: 220, balanceDue: 220 },
        { reference: "WOODTAG-CON-4420", clientName: "Naa Adjei", email: "naa@example.com", phone: "+1 555 000 3333", packageTitle: "Content Creator Bundle", date: "2026-03-18", time: "9:00 AM", status: "confirmed", total: 350, balanceDue: 150 },
        { reference: "WOODTAG-FUL-2093", clientName: "Yaw Owusu", email: "yaw@example.com", phone: "+1 555 000 4444", packageTitle: "The Wood Tag Full Studio", date: "2026-03-09", time: "1:00 PM", status: "completed", total: 700, balanceDue: 0 },
        { reference: "WOODTAG-PLA-8845", clientName: "Efua Darko", email: "efua@example.com", phone: "+1 555 000 5555", packageTitle: "Plain Backdrop", date: "2026-03-05", time: "3:00 PM", status: "cancelled", total: 150, balanceDue: 0 },
        { reference: "WOODTAG-COM-1187", clientName: "Kwabena Asare", email: "kwabena@example.com", phone: "+1 555 000 6666", packageTitle: "Canvas and Plain Backdrop Combo", date: "2026-03-22", time: "5:00 PM", status: "pending", total: 300, balanceDue: 300 },
      ],
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login — email: ${ADMIN_EMAIL}  password: ${existingAdmin ? "(unchanged)" : ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
