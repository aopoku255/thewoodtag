-- AlterTable
ALTER TABLE "AboutContent" ALTER COLUMN "paragraph1" SET DEFAULT 'The Wood Tag is an independent photography and creative house dedicated to capturing life''s milestones with elegance, artistry, and honesty. What began as a single studio room has grown into a home for fine-art portraiture, cinematic videography, and considered styling.';

-- AlterTable
ALTER TABLE "LegalPage" ALTER COLUMN "eyebrow" SET DEFAULT 'The Wood Tag';

-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "siteName" SET DEFAULT 'The Wood Tag',
ALTER COLUMN "logoWordmark" SET DEFAULT 'WOODTAG',
ALTER COLUMN "primaryEmail" SET DEFAULT 'hello@thewoodtag.com',
ALTER COLUMN "copyrightText" SET DEFAULT 'The Wood Tag Photography. All rights reserved.';

-- AlterTable
ALTER TABLE "StudioPageContent" ALTER COLUMN "description" SET DEFAULT 'The Wood Tag is a modern, creative space designed for photography, art, and visual storytelling. With a welcoming environment, professional setup, and a focus on craft, we provide the perfect backdrop for bringing your ideas to life.';
