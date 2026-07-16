-- Add payment tracking fields to Order table
-- For Teya Online Payments integration

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "teyaPaymentId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMPTZ;
