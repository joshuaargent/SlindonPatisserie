-- ============================================
-- RUN THIS IN SUPABASE SQL EDITITOR
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User & Authentication
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Categories
CREATE TABLE IF NOT EXISTS "Category" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS "Product" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "Category"(id) ON DELETE RESTRICT,
  "retailPrice" REAL NOT NULL,
  "wholesalePrice" REAL,
  image TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  "leadTimeDays" INTEGER NOT NULL DEFAULT 1,
  availability TEXT NOT NULL DEFAULT 'RETAIL',
  "madeAtFactoryA" BOOLEAN NOT NULL DEFAULT true,
  "madeAtFactoryB" BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  "stockQuantity" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Factory
CREATE TABLE IF NOT EXISTS "Factory" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pickup Slot
CREATE TABLE IF NOT EXISTS "PickupSlot" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  date TIMESTAMPTZ NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 10,
  booked INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(date, time)
);

-- Cart
CREATE TABLE IF NOT EXISTS "Cart" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart Item
CREATE TABLE IF NOT EXISTS "CartItem" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "cartId" TEXT NOT NULL REFERENCES "Cart"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE("cartId", "productId")
);

-- Order
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  subtotal REAL NOT NULL,
  "deliveryFee" REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL,
  "deliveryMethod" TEXT NOT NULL,
  "deliveryAddress" TEXT,
  "pickupDate" TIMESTAMPTZ NOT NULL,
  "pickupTime" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "paymentMethod" TEXT,
  "teyaOrderId" TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Item
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  quantity INTEGER NOT NULL,
  "unitPrice" REAL NOT NULL,
  "factoryId" TEXT REFERENCES "Factory"(id),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Status History
CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Review
CREATE TABLE IF NOT EXISTS "Review" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  rating INTEGER NOT NULL,
  title TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  reply TEXT,
  "repliedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Franchise Enquiry
CREATE TABLE IF NOT EXISTS "FranchiseEnquiry" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wholesale Enquiry
CREATE TABLE IF NOT EXISTS "WholesaleEnquiry" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "businessName" TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Career Application
CREATE TABLE IF NOT EXISTS "CareerApplication" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  message TEXT NOT NULL,
  "cvData" TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact Enquiry
CREATE TABLE IF NOT EXISTS "ContactEnquiry" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site Setting
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriber
CREATE TABLE IF NOT EXISTS "Subscriber" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  email TEXT UNIQUE NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);
CREATE INDEX IF NOT EXISTS idx_category_slug ON "Category"(slug);
CREATE INDEX IF NOT EXISTS idx_product_slug ON "Product"(slug);
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS idx_product_available ON "Product"(available);
CREATE INDEX IF NOT EXISTS idx_order_user ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO "Category" (name, slug, description, "sortOrder", "isActive") VALUES
  ('Patisserie', 'patisserie', 'Handmade pastries and sweet treats', 1, true),
  ('Artisan Bread', 'artisan-bread', 'Traditional breads baked fresh daily', 2, true),
  ('Catering', 'catering', 'Party platters and event catering', 3, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "SiteSetting" (key, value, type) VALUES
  ('site_name', 'Slindon Patisserie', 'string'),
  ('contact_email', 'info@slindonpatisserie.co.uk', 'string'),
  ('contact_phone', '01243 814369', 'string'),
  ('delivery_fee', '5', 'number')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ADMIN USER (password: admin123 - CHANGE THIS!)
-- ============================================
INSERT INTO "User" (email, password, name, role) VALUES
  ('admin@slindonpatisserie.co.uk', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4gRr.9MOU4UG6Mm', 'Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
