-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Studio Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'Lumen Studio',
    "siteTagline" TEXT NOT NULL DEFAULT 'Where light becomes story.',
    "logoWordmark" TEXT NOT NULL DEFAULT 'LUMEN',
    "faviconEmoji" TEXT NOT NULL DEFAULT '📷',
    "primaryEmail" TEXT NOT NULL DEFAULT 'hello@lumenstudio.co',
    "phone" TEXT NOT NULL DEFAULT '+1 (555) 019-2847',
    "address" TEXT NOT NULL DEFAULT '45 Wren Studios, Harbourfront District',
    "businessHours" TEXT NOT NULL DEFAULT 'Mon-Sat, 9am-6pm',
    "whatsappUrl" TEXT NOT NULL DEFAULT '',
    "copyrightText" TEXT NOT NULL DEFAULT 'Lumen Studio Photography. All rights reserved.',
    "footerQuote" TEXT NOT NULL DEFAULT 'Every frame holds a piece of forever.',
    "footerCredit" TEXT NOT NULL DEFAULT 'Design & Development, in-house',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'camera',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'Fine Art Portraiture',
    "headingLine" TEXT NOT NULL DEFAULT 'Timeless,',
    "headingEmphasis" TEXT NOT NULL DEFAULT 'Portraits',
    "description" TEXT NOT NULL DEFAULT 'Every sitting begins with a conversation, not a checklist. We build the light, the mood, and the moment around you, then step back and let it happen.',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Catalogue',
    "ctaSubLabel" TEXT NOT NULL DEFAULT 'See The Work',
    "ctaUrl" TEXT NOT NULL DEFAULT '/catalogue',
    "stat1Number" TEXT NOT NULL DEFAULT '8',
    "stat1Suffix" TEXT NOT NULL DEFAULT '+',
    "stat1Label" TEXT NOT NULL DEFAULT 'Years Behind The Lens',
    "stat2Number" TEXT NOT NULL DEFAULT '600',
    "stat2Suffix" TEXT NOT NULL DEFAULT '+',
    "stat2Label" TEXT NOT NULL DEFAULT 'Stories Captured',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'About Us',
    "headingLine" TEXT NOT NULL DEFAULT 'Where',
    "headingEmphasis" TEXT NOT NULL DEFAULT 'Light',
    "headingLast" TEXT NOT NULL DEFAULT 'Lingers',
    "paragraph1" TEXT NOT NULL DEFAULT 'Lumen Studio is an independent photography and creative house dedicated to capturing life''s milestones with elegance, artistry, and honesty. What began as a single studio room has grown into a home for fine-art portraiture, cinematic videography, and considered styling.',
    "paragraph2" TEXT NOT NULL DEFAULT 'From intimate studio sessions to full-scale celebrations, our aim stays the same: to hand you memories worth keeping. Every frame is treated with care because we believe your story deserves to be told beautifully, and remembered as legacy.',
    "ctaPrimaryLabel" TEXT NOT NULL DEFAULT 'Let''s Work Together',
    "ctaPrimaryUrl" TEXT NOT NULL DEFAULT '/contact',
    "ctaLinkLabel" TEXT NOT NULL DEFAULT 'View Catalogue',
    "ctaLinkUrl" TEXT NOT NULL DEFAULT '/catalogue',
    "ctaOutlineLabel" TEXT NOT NULL DEFAULT 'Our Studio Packages',
    "ctaOutlineUrl" TEXT NOT NULL DEFAULT '/studio',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutGalleryImage" (
    "id" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogueCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "coverImageAlt" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogueCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogueImage" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CatalogueImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioPackage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "hourlyLabel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Studio',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudioPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioPageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'Studio',
    "heading" TEXT NOT NULL DEFAULT 'Studio',
    "headingEmphasis" TEXT NOT NULL DEFAULT 'Packages',
    "description" TEXT NOT NULL DEFAULT 'Lumen Studio is a modern, creative space designed for photography, art, and visual storytelling. With a welcoming environment, professional setup, and a focus on craft, we provide the perfect backdrop for bringing your ideas to life.',
    "ctaOutlineLabel" TEXT NOT NULL DEFAULT 'Read Terms & Conditions',
    "ctaOutlineUrl" TEXT NOT NULL DEFAULT '/portrait-terms',
    "ctaPrimaryLabel" TEXT NOT NULL DEFAULT 'Book Now',
    "ctaPrimaryUrl" TEXT NOT NULL DEFAULT '/studio',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudioPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioView" (
    "id" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StudioView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioAddon" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StudioAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'General Enquiry',
    "headingLine" TEXT NOT NULL DEFAULT 'Ready to tell',
    "headingEmphasis" TEXT NOT NULL DEFAULT 'your story?',
    "description" TEXT NOT NULL DEFAULT 'Every session starts with a conversation. Share a few details below and the studio will follow up to shape the rest.',
    "successHeading" TEXT NOT NULL DEFAULT 'Enquiry sent',
    "successMessage" TEXT NOT NULL DEFAULT 'Thank you, {firstName}. The studio will reply to {email} within one business day.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "openDays" TEXT NOT NULL DEFAULT '1,2,3,4,5,6',
    "timeSlots" TEXT NOT NULL DEFAULT '9:00 AM,11:00 AM,1:00 PM,3:00 PM,5:00 PM',
    "minNoticeHours" INTEGER NOT NULL DEFAULT 24,
    "maxAdvanceDays" INTEGER NOT NULL DEFAULT 60,
    "confirmationMessage" TEXT NOT NULL DEFAULT 'We''ve sent a confirmation to {email}. Your reference is {reference} — save it to look up your booking and receipt at any time.',
    "cancellationMessage" TEXT NOT NULL DEFAULT 'Deposits are non-refundable. Clients may reschedule once with at least 48 hours'' notice.',
    "lookupHeading" TEXT NOT NULL DEFAULT 'Look up your booking and receipt.',
    "lookupDescription" TEXT NOT NULL DEFAULT 'Enter the booking reference from your confirmation email. You will see payment instructions if a balance is due, and your receipt on the same page after payment is confirmed.',
    "addOns" TEXT NOT NULL DEFAULT 'Extra Hour:100,Extra Outfit Change:50,Printed Album:200,Videography Add-on:300',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "packageTitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total" INTEGER NOT NULL,
    "balanceDue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL DEFAULT 'Lumen Studio',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sectionsJson" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoSetting" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "ogTitle" TEXT NOT NULL DEFAULT '',
    "ogDescription" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SeoSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogueCategory_slug_key" ON "CatalogueCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StudioPackage_slug_key" ON "StudioPackage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StudioAddon_slug_key" ON "StudioAddon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_slug_key" ON "LegalPage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SeoSetting_page_key" ON "SeoSetting"("page");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "HeroContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutGalleryImage" ADD CONSTRAINT "AboutGalleryImage_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "AboutContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogueImage" ADD CONSTRAINT "CatalogueImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CatalogueCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioView" ADD CONSTRAINT "StudioView_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "StudioPageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
