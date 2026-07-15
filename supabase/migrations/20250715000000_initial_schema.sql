-- ============================================
-- Slindon Patisserie - Initial Schema
-- ============================================

-- Enable UUID extension (Supabase uses pgcrypto for UUIDs)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- User & Authentication
-- ============================================
CREATE TABLE "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);

-- ============================================
-- Product Categories
-- ============================================
CREATE TABLE "Category" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_category_slug ON "Category"(slug);
CREATE INDEX idx_category_active ON "Category"("isActive");

-- ============================================
-- Products
-- ============================================
CREATE TABLE "Product" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_slug ON "Product"(slug);
CREATE INDEX idx_product_category ON "Product"("categoryId");
CREATE INDEX idx_product_available ON "Product"(available);
CREATE INDEX idx_product_featured ON "Product"(featured);

-- ============================================
-- Factories (for order routing)
-- ============================================
CREATE TABLE "Factory" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Pickup Slots
-- ============================================
CREATE TABLE "PickupSlot" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date TIMESTAMPTZ NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 10,
  booked INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(date, time)
);

CREATE INDEX idx_pickupslot_date ON "PickupSlot"(date);
CREATE INDEX idx_pickupslot_available ON "PickupSlot"(available);

-- ============================================
-- Cart
-- ============================================
CREATE TABLE "Cart" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cart_user ON "Cart"("userId");

-- ============================================
-- Cart Items
-- ============================================
CREATE TABLE "CartItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "cartId" TEXT NOT NULL REFERENCES "Cart"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE("cartId", "productId")
);

CREATE INDEX idx_cartitem_cart ON "CartItem"("cartId");
CREATE INDEX idx_cartitem_product ON "CartItem"("productId");

-- ============================================
-- Orders
-- ============================================
CREATE TABLE "Order" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_order_user ON "Order"("userId");
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_number ON "Order"("orderNumber");
CREATE INDEX idx_order_created ON "Order"("createdAt");

-- ============================================
-- Order Items
-- ============================================
CREATE TABLE "OrderItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  quantity INTEGER NOT NULL,
  "unitPrice" REAL NOT NULL,
  "factoryId" TEXT REFERENCES "Factory"(id),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orderitem_order ON "OrderItem"("orderId");
CREATE INDEX idx_orderitem_product ON "OrderItem"("productId");
CREATE INDEX idx_orderitem_factory ON "OrderItem"("factoryId");

-- ============================================
-- Order Status History
-- ============================================
CREATE TABLE "OrderStatusHistory" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orderstatushistory_order ON "OrderStatusHistory"("orderId");

-- ============================================
-- Customer Reviews
-- ============================================
CREATE TABLE "Review" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_review_status ON "Review"(status);
CREATE INDEX idx_review_user ON "Review"("userId");
CREATE INDEX idx_review_created ON "Review"("createdAt");

-- ============================================
-- Franchise Enquiry
-- ============================================
CREATE TABLE "FranchiseEnquiry" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_franchise_status ON "FranchiseEnquiry"(status);

-- ============================================
-- Wholesale Enquiry
-- ============================================
CREATE TABLE "WholesaleEnquiry" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_wholesale_status ON "WholesaleEnquiry"(status);

-- ============================================
-- Career Application
-- ============================================
CREATE TABLE "CareerApplication" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_career_status ON "CareerApplication"(status);

-- ============================================
-- Contact Enquiry
-- ============================================
CREATE TABLE "ContactEnquiry" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_contact_status ON "ContactEnquiry"(status);

-- ============================================
-- Site Settings
-- ============================================
CREATE TABLE "SiteSetting" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sitesetting_key ON "SiteSetting"(key);

-- ============================================
-- Newsletter Subscribers
-- ============================================
CREATE TABLE "Subscriber" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriber_email ON "Subscriber"(email);
CREATE INDEX idx_subscriber_active ON "Subscriber"("isActive");

-- ============================================
-- Functions & Triggers
-- ============================================

-- Function to auto-update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updatedAt triggers
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON "Category"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON "Product"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_updated_at BEFORE UPDATE ON "Review"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_franchise_updated_at BEFORE UPDATE ON "FranchiseEnquiry"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wholesale_updated_at BEFORE UPDATE ON "WholesaleEnquiry"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_updated_at BEFORE UPDATE ON "CareerApplication"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON "ContactEnquiry"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sitesetting_updated_at BEFORE UPDATE ON "SiteSetting"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON "Cart"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  sequence_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING("orderNumber" FROM 5) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM "Order";
  
  new_number := 'ORD-' || LPAD(sequence_num::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Factory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PickupSlot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderStatusHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FranchiseEnquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WholesaleEnquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CareerApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactEnquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscriber" ENABLE ROW LEVEL SECURITY;
