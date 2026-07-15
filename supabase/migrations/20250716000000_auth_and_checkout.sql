-- ============================================
-- Migration: Supabase Auth + Guest Checkout + Wholesale
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Add auth_id column to link User to Supabase auth.users
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "authId" TEXT;

-- 2. Drop the password column (Supabase Auth manages passwords)
ALTER TABLE "User" DROP COLUMN IF EXISTS "password";

-- 3. Link existing users to auth.users by email
UPDATE "User" u
SET "authId" = (
  SELECT id FROM auth.users WHERE email = u.email LIMIT 1
)
WHERE "authId" IS NULL;

-- 4. Make Order.userId nullable (for guest checkout)
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- 5. Add customer name/email/phone columns for guest orders
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerName" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerEmail" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerPhone" TEXT;

-- 6. Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT USING (
    "authId" = (SELECT id FROM auth.users() LIMIT 1)
    OR email = (SELECT email FROM auth.users() LIMIT 1)
  );

CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE USING (
    "authId" = (SELECT id FROM auth.users() LIMIT 1)
    OR email = (SELECT email FROM auth.users() LIMIT 1)
  );

-- Orders visible to: owner, or guest with matching email
CREATE POLICY "Users can view own orders" ON "Order"
  FOR SELECT USING (
    "userId" = (SELECT id FROM "User" WHERE "authId" = (SELECT id FROM auth.users() LIMIT 1) LIMIT 1)
    OR "customerEmail" = (SELECT email FROM auth.users() LIMIT 1)
    OR "userId" IS NULL
  );

-- Reviews: any logged-in user can read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON "Review"
  FOR SELECT USING (status = 'APPROVED');

-- Reviews: logged-in users can insert their own
CREATE POLICY "Users can create own reviews" ON "Review"
  FOR INSERT WITH CHECK (
    "userId" = (SELECT id FROM "User" WHERE "authId" = (SELECT id FROM auth.users() LIMIT 1) LIMIT 1)
  );

-- ============================================
-- Create a placeholder "Guest" user for orders
-- without an account
-- ============================================
INSERT INTO "User" (id, email, name, role, "isActive")
VALUES ('00000000-0000-0000-0000-000000000000', 'guest@slindon.internal', 'Guest Customer', 'CUSTOMER', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Update auth trigger to store auth ID
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, "authId")
  VALUES (NEW.id, NEW.email, NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- WholesaleEnquiry: add userId for linked accounts
-- ============================================
ALTER TABLE "WholesaleEnquiry" ADD COLUMN IF NOT EXISTS "userId" TEXT REFERENCES "User"(id);

CREATE OR REPLACE FUNCTION populate_wholesale_user()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW."userId" IS NULL THEN
    NEW."userId" := (
      SELECT id FROM "User" WHERE email = NEW.email LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_wholesale_set_user ON "WholesaleEnquiry";
CREATE TRIGGER trg_wholesale_set_user
  BEFORE INSERT ON "WholesaleEnquiry"
  FOR EACH ROW EXECUTE FUNCTION populate_wholesale_user();
