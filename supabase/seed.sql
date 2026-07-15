-- ============================================
-- Slindon Patisserie - Production Seed Data
-- ============================================
-- This file runs during local development only.
-- Production data should be added via the admin dashboard.
-- No test data is included.

-- Essential site settings for production
INSERT INTO "SiteSetting" (key, value, type) VALUES
  ('site_name', 'Slindon Patisserie', 'string'),
  ('contact_email', 'info@slindonpatisserie.co.uk', 'string')
ON CONFLICT (key) DO NOTHING;
