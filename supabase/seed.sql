-- ============================================
-- Slindon Patisserie - Seed Data
-- ============================================

-- Insert Categories
INSERT INTO "Category" (name, slug, description, "sortOrder", "isActive") VALUES
  ('Patisserie', 'patisserie', 'Handmade pastries, croissants, and sweet treats', 1, true),
  ('Artisan Bread', 'artisan-bread', 'Traditional breads baked fresh daily', 2, true),
  ('Catering', 'catering', 'Party platters, sandwiches, and event catering', 3, true),
  ('Wholesale Boxes', 'wholesale-boxes', 'Bulk orders for businesses', 4, true),
  ('POS & Supplies', 'pos-supplies', 'Point of sale materials and packaging', 5, true),
  ('Sundries', 'sundries', 'Bags, packaging, and bakery supplies', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Site Settings
INSERT INTO "SiteSetting" (key, value, type) VALUES
  ('site_name', 'Slindon Patisserie', 'string'),
  ('contact_email', 'info@slindonpatisserie.co.uk', 'string'),
  ('contact_phone', '01243 814369', 'string'),
  ('collection_address', 'Camberley, Surrey', 'string'),
  ('delivery_fee', '5', 'number'),
  ('free_delivery_threshold', '50', 'number')
ON CONFLICT (key) DO NOTHING;

-- Insert sample products
INSERT INTO "Product" (name, slug, description, "categoryId", "retailPrice", "wholesalePrice", availability, "leadTimeDays", featured) 
SELECT 
  'Butter Croissant', 
  'butter-croissant',
  'Flaky, buttery French croissant made with French butter',
  (SELECT id FROM "Category" WHERE slug = 'patisserie'),
  2.50,
  1.25,
  'BOTH',
  1,
  true
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Product" (name, slug, description, "categoryId", "retailPrice", "wholesalePrice", availability, "leadTimeDays", featured) 
SELECT 
  'Pain au Chocolat', 
  'pain-au-chocolat',
  'Golden pastry with rich dark chocolate',
  (SELECT id FROM "Category" WHERE slug = 'patisserie'),
  2.80,
  1.40,
  'BOTH',
  1,
  true
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Product" (name, slug, description, "categoryId", "retailPrice", "wholesalePrice", availability, "leadTimeDays", featured) 
SELECT 
  'Sourdough Loaf', 
  'sourdough-loaf',
  'Traditional sourdough with a crusty exterior',
  (SELECT id FROM "Category" WHERE slug = 'artisan-bread'),
  4.50,
  2.25,
  'BOTH',
  1,
  true
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Product" (name, slug, description, "categoryId", "retailPrice", "wholesalePrice", availability, "leadTimeDays") 
SELECT 
  'Mixed Sandwich Platter', 
  'mixed-sandwich-platter',
  'Assorted sandwiches for 10 people',
  (SELECT id FROM "Category" WHERE slug = 'catering'),
  45.00,
  22.50,
  'BOTH',
  2
ON CONFLICT (slug) DO NOTHING;

-- Insert Factory A
INSERT INTO "Factory" (name, location, address, "contactEmail", active) VALUES
  ('Factory A', 'Camberley', '123 High Street, Camberley, Surrey GU15 3XX', 'factorya@slindonpatisserie.co.uk', true)
ON CONFLICT DO NOTHING;
