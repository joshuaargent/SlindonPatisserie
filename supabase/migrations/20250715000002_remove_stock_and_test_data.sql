-- Remove stock tracking - products are always available
ALTER TABLE "Product" DROP COLUMN IF EXISTS "stockQuantity";

-- Remove test data from SiteSetting (keep only essential settings)
DELETE FROM "SiteSetting" WHERE "key" NOT IN ('site_name', 'contact_email', 'contact_phone', 'delivery_fee');

-- Remove seed test products (keep empty tables for production)
-- Products should be added via admin dashboard
