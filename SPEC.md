# Slindon Patisserie - Website Specification

> **Project:** Ecommerce Website for Traditional Bakery  
> **Client:** Joby (Slindon Patisserie)  
> **Location:** Camberley, Surrey  
> **Version:** 2.0  
> **Last Updated:** July 15, 2026  
> **Database:** Supabase PostgreSQL  
> **Email:** Resend (planned)

---

## 1. Concept & Vision

**Slindon Patisserie** is a traditional bakery business in Camberley, offering artisan breads, pastries, cakes, and catering products to both retail and wholesale customers. The website embodies the warmth and authenticity of an old-school patisserie — the kind of place where the smell of fresh bread fills the air and every item is crafted with care.

The digital presence should feel like stepping into a cozy bakery: warm cream tones, hand-crafted typography, and imagery that celebrates the craft of traditional baking. This is not a sterile corporate store — it's a community bakery with heritage and heart.

**Core Philosophy:** Quality over quantity, tradition over trends, service over sales.

---

## 2. Design Language

### 2.1 Aesthetic Direction

**Reference:** Old-world European patisserie meets modern British bakery. Think warm morning light through a shop window, handwritten chalkboard menus, golden croissants on worn wooden counters.

### 2.2 Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Warm Cream | `#F5F0E6` | Backgrounds, cards |
| **Secondary** | Rich Brown | `#4A3728` | Headings, primary text |
| **Accent** | Gilded Gold | `#C4A35A` | CTAs, highlights, borders |
| **Warm** | Burnt Sienna | `#8B5A2B` | Buttons, links |
| **Text** | Dark Espresso | `#2C1810` | Body copy |
| **Muted** | Warm Gray | `#8B7D6B` | Secondary text, captions |
| **Surface** | Antique White | `#FFFEF9` | Cards, elevated surfaces |

### 2.3 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| **Display** | Playfair Display | 700 | 48-72px |
| **H1** | Playfair Display | 600 | 36-48px |
| **H2** | Playfair Display | 600 | 28-36px |
| **H3** | Lora | 600 | 20-24px |
| **Body** | Source Sans 3 | 400 | 16px |
| **Caption** | Source Sans 3 | 400 | 14px |
| **Button** | Source Sans 3 | 600 | 16px |

### 2.4 Spatial System

- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px
- **Container max-width:** 1280px
- **Card padding:** 24px
- **Section padding:** 64px vertical (desktop), 48px (mobile)

### 2.5 Motion Philosophy

Subtle, warm animations that feel natural — like dough rising or steam rising from a fresh loaf.

- **Entrance:** Fade + subtle rise (opacity 0→1, y: 20→0, 400ms ease-out)
- **Hover:** Gentle lift with shadow (translateY -2px, shadow increase, 200ms)
- **Page transitions:** Smooth crossfade (300ms)
- **Loading states:** Warm shimmer effect on cream background

### 2.6 Visual Assets

- **Icons:** Lucide icons with 1.5px stroke weight, warm brown color
- **Images:** High-quality product photography (to be provided by Joby)
- **Decorative:** Subtle wheat/flour texture overlays, hand-drawn dividers
- **Logo:** To be provided (old-school patisserie style)

---

## 3. Layout & Structure

### 3.1 Page Architecture

```
┌─────────────────────────────────────────┐
│  Header (Sticky)                        │
│  ┌─────────────────────────────────────┐│
│  │ Logo    Nav Links    Cart  Account ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  Main Content                           │
│  (Page-specific layout)                  │
├─────────────────────────────────────────┤
│  Footer                                 │
│  ┌─────────────────────────────────────┐│
│  │ About  |  Products  |  Support      ││
│  │ Social |  Contact   |  Legal        ││
│  │ Copyright 2026 Slindon Patisserie   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3.2 Navigation Structure

| Section | Pages | Auth Required |
|---------|-------|---------------|
| **Public** | Home, About, Contact, Login, Register | No |
| **Shop** | Products (Retail), Products (Wholesale), Product Detail | Yes |
| **Account** | Dashboard, Orders, Profile, Addresses | Yes |
| **Business** | Franchise, Careers | No |
| **Admin** | (Future) Order Management, Product Management | Yes |

### 3.3 Responsive Strategy

- **Mobile-first** approach
- **Breakpoints:** 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Mobile nav:** Hamburger menu with slide-out drawer
- **Product grid:** 1 col (mobile) → 2 col (tablet) → 4 col (desktop)

---

## 4. Features & Interactions

### 4.1 Authentication System

| Feature | Behavior |
|---------|----------|
| **Register** | Email, password, name, phone (optional) |
| **Login** | Email + password |
| **Logout** | Clear session, redirect to home |
| **Password Reset** | Email link for password reset (via Resend) |
| **Account Types** | Retail (default), Wholesale (approval required) |

### 4.2 Product Catalog

| Category | Description | Customer Type |
|----------|-------------|---------------|
| **Bakery** | Breads, pastries, cakes, cookies | Retail |
| **Catering** | Rolls, party platters, sandwiches | Retail/Wholesale |
| **Wholesale** | Bulk bakery products | Wholesale |
| **POS Materials** | Point of sale items for other businesses | Wholesale |
| **Sundries** | Bags, packaging, supplies | All |

### 4.3 Shopping Cart

| Feature | Behavior |
|---------|----------|
| **Add to cart** | Slide-in panel confirmation, update cart icon |
| **Update quantity** | +/- buttons, minimum 1, maximum 99 |
| **Remove item** | Trash icon, confirm modal |
| **Cart persistence** | LocalStorage for guests, database for logged-in |
| **Cart badge** | Show item count on header icon |

### 4.4 Checkout Flow

```
Cart → Delivery Method → Review → Confirmation → (Pay on Collection/Delivery)
```

| Step | Fields | Validation |
|------|--------|------------|
| **Cart Review** | View items, quantities, prices | - |
| **Delivery Method** | Collection / Delivery | Required |
| **Collection Details** | Selected time slot | Required if collection |
| **Delivery Address** | Street, city, postcode | Required if delivery |
| **Review** | All details, edit options | - |
| **Confirm** | Create order, send confirmation | - |

### 4.5 Delivery Approach

**Strategy:** Soft interest-based approach, not hard minimums.

| Condition | Behavior |
|-----------|----------|
| **Default checkout** | Collection selected by default |
| **Delivery option** | "Interested in delivery? Click here" link on checkout |
| **Delivery interest form** | Customer enters postcode, sees if serviceable |
| **Delivery confirmation** | If serviceable, delivery option unlocks |
| **Delivery cost** | TBD - to be configured per area/range |

### 4.6 Franchise Page Strategy

**Approach:** Information + Contact (no pricing displayed)

| Element | Purpose |
|---------|---------|
| **Benefits section** | List what franchisees get ("Biz in a Box") |
| **Investment overview** | Placeholder: "Investment details available on request" |
| **Support package** | Training, equipment, supply chain, marketing |
| **Success stories** | Testimonials from existing franchisees |
| **Contact form** | Name, email, phone, message → sends to Joby |
| **No pricing** | Sales conversation required to close deals |

### 4.7 Pricing Model

**Retail vs Wholesale:**
- Wholesale pricing is approximately **50% of retail** price

### 4.8 Contact Form & Email Routing

The contact form supports **category-based email routing** for automated responses via Resend.

**Contact Categories:**
| Category | Description | Auto-Response |
|----------|-------------|---------------|
| `general` | General enquiries | None |
| `allergy` | Allergy enquiries | **Send allergens list** |
| `order` | Order-related questions | None |
| `wholesale` | Wholesale enquiries | None |
| `franchise` | Franchise opportunities | None |
| `careers` | Job applications | None |
| `complaint` | Complaints | None |
| `other` | Other topics | None |

**Resend Integration:**
- When a customer selects "Allergy" category, an automated email with the allergens list is sent
- Other categories are stored in database for manual review
- Future: Different email templates for each category

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 6.0 |
| **UI** | React 19 |
| **Styling** | Tailwind CSS 4.2 |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Client State** | Zustand (cart, UI state) |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth |
| **Payments** | Teya POS (payment on collection) |
| **Email** | Resend (planned) |

### 5.2 Database Schema (Supabase)

**Tables:**
- User (authentication and user data)
- Category (product categories)
- Product (bakery products)
- Factory (production facilities)
- PickupSlot (collection time slots)
- Cart / CartItem (shopping cart)
- Order / OrderItem / OrderStatusHistory (orders)
- Review (customer reviews)
- FranchiseEnquiry / WholesaleEnquiry / CareerApplication / ContactEnquiry (enquiries)
- SiteSetting (configuration)
- Subscriber (newsletter)

### 5.3 Environment Variables

```bash
# Supabase (via Vercel Integration)
NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SECRET_KEY}"

# Admin
ADMIN_API_KEY="your-admin-api-key"

# Resend (future)
RESEND_API_KEY="re_xxxxxxxxxxxx"
```

---

## 6. Development

### 6.1 Local Development

```bash
npm install
npm run dev
```

### 6.2 Supabase Setup

1. Create project at https://app.supabase.com
2. Connect GitHub integration in project settings
3. Migrations auto-run on preview branches

### 6.3 Resend Integration (Planned)

1. Create Resend account at https://resend.com
2. Add `RESEND_API_KEY` to environment variables
3. Create email templates for each contact category
4. Implement auto-response logic in `/api/contact` route

---

*Specification Version: 2.0*  
*Created: June 10, 2026*  
*Last Updated: July 15, 2026*  
*Client: Joby (Slindon Patisserie)*
