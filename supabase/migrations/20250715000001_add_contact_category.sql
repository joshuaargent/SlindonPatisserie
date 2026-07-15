-- Add category field to ContactEnquiry for email routing
ALTER TABLE "ContactEnquiry" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'GENERAL';
