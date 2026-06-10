# Slindon Patisserie - Website Specification

> **Project:** Ecommerce Website for Traditional Bakery  
> **Client:** Joby (Slindon Patisserie)  
> **Location:** Camberley, Surrey  
> **Version:** 2.0  
> **Last Updated:** June 10, 2026 (Post-Meeting Update)  
> **Meeting Date:** Wednesday June 2026

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
│  │ Copyright 2026 Slindon Patisserie  ││
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
| **Login** | Email + password, "Remember me" option |
| **Logout** | Clear session, redirect to home |
| **Password Reset** | Email link for password reset |
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

**Rationale:** This allows flexibility for Joby to manage delivery capacity without hard-cutoff frustration. Customers see all options and express interest, Joby can approve/manage delivery slots.

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

**Rationale:** Franchise deals are complex and need personalized discussion. Showing prices online kills negotiation and may undervalue the opportunity. Contact-first approach lets Joby qualify leads and close better deals.

### 4.7 Pricing Model

**Retail vs Wholesale:**
- Wholesale pricing is approximately **50% of retail** (most products)
- Some products have **exceptions** to the 50% rule (defined per product)
- Pricing displayed dynamically based on user account type

| Account Type | Pricing | Display |
|--------------|---------|---------|
| **Retail** | Full price | £X.XX |
| **Wholesale** | Discounted | £X.XX (with "Wholesale" badge) |

**Implementation:** Each product has:
- `retailPrice`: number
- `wholesalePrice`: number (can be null for products not available wholesale)
- `wholesaleDiscountOverride`: boolean (if true, use actual wholesalePrice, not 50%)

### 4.8 Factory Routing & Production

**Two Factories:**
- **Factory A** - Location TBD
- **Factory B** - Location TBD

**Product Assignment:**
- Products can be made at **Factory A only**, **Factory B only**, or **Both**
- Each factory has its own production schedule and capacity

**Wait Time Calculation:**
- Each product has a `productionTime` (in hours)
- Products made at multiple factories have the **fastest** production time
- Order's minimum pickup time = **max(all product wait times)**

**Example:**
```
Donut: 24 hours production, made at Factory A
Brownie: 48 hours production, made at Factory B
Order contains both → Minimum pickup: 48 hours from now
```

**Pickup Slot Selection:**
- Customer sees: "Earliest pickup: [Date] at [Time]"
- Available slots start from minimum wait time
- Time slots are configurable (e.g., 9am, 10am, 11am...)
- Slots show availability based on capacity

### 4.9 Order Management

| Status | Description |
|--------|-------------|
| **Pending** | Order just placed, awaiting confirmation |
| **Confirmed** | Order confirmed, being prepared |
| **Ready** | Ready for collection or out for delivery |
| **Collected/Delivered** | Order completed |

### 4.10 Teya Sales Integration

**Teya** is a point-of-sale (POS) and payment system. Integration will enable:

| Feature | Description |
|---------|-------------|
| **Order Sync** | Orders placed on website automatically appear in Teya POS |
| **Factory Routing** | Orders auto-sent to relevant factory based on product assignments |
| **Multi-Factory Split** | Orders containing products from both factories split and sent to respective factories |
| **Payment Processing** | Teya handles payment on collection (card reader at counter) |
| **Inventory Sync** | Stock levels reflected in both systems |

**Integration Architecture:**
```
Website Order → Prisma DB → Teya API → Factory A / Factory B
                     ↓
              Teya POS (for payment on collection)
```

**API Requirements:**
- Teya API endpoint for order creation
- Webhook for order status updates
- Factory assignment based on products
- Order splitting logic for multi-factory orders

**Note:** Teya integration details pending - need to discuss API access and specific endpoints with Joby.

---

## 5. Component Inventory

### 5.1 Navigation Components

| Component | States | Notes |
|-----------|--------|-------|
| **Header** | Default, Scrolled (shadow), Mobile | Sticky on scroll |
| **NavLink** | Default, Hover (underline), Active | - |
| **MobileMenu** | Closed, Open (slide-in) | 300ms slide animation |
| **CartIcon** | Empty (0 badge), Has items (count badge) | - |

### 5.2 Product Components

| Component | States | Notes |
|-----------|--------|-------|
| **ProductCard** | Default, Hover (lift + shadow), Loading (skeleton) | Image, title, price, add button |
| **ProductGrid** | Default, Empty (no products message) | Responsive columns |
| **ProductDetail** | Default, Loading, Out of stock | Full info, gallery, add to cart |
| **CategoryFilter** | Default, Active filter | Horizontal scroll on mobile |

### 5.3 Cart Components

| Component | States | Notes |
|-----------|--------|-------|
| **CartDrawer** | Closed, Open (slide from right) | 400px width |
| **CartItem** | Default, Updating (spinner), Removing (fade out) | Image, title, qty, price, remove |
| **CartSummary** | Default, Free delivery earned | Subtotal, delivery, total |

### 5.4 Form Components

| Component | States | Notes |
|-----------|--------|-------|
| **Input** | Default, Focus (gold border), Error (red), Disabled | - |
| **Select** | Default, Open (dropdown), Disabled | - |
| **Button** | Default, Hover, Active, Loading (spinner), Disabled | Primary, Secondary, Ghost variants |
| **Checkbox** | Unchecked, Checked, Disabled | - |
| **Radio** | Unselected, Selected, Disabled | - |

### 5.5 Feedback Components

| Component | States | Notes |
|-----------|--------|-------|
| **Toast** | Success (green), Error (red), Info (gold) | Auto-dismiss after 5s |
| **Modal** | Closed, Open (fade in) | Backdrop blur |
| **LoadingSpinner** | - | Gold color, 24px |
| **Skeleton** | - | Cream shimmer animation |

---

## 6. Page Specifications

### 6.1 Homepage

**Hero Section:**
- Full-width background image (bakery scene)
- Overlay with headline: "Artisan Bakery, Traditional Quality"
- Subtext: "Fresh from our oven to your table"
- CTA Button: "Shop Now" (or "View Products" if not logged in)

**Featured Products:**
- Section heading: "Today's Fresh Bakes"
- 4-8 featured products in grid
- "View All Products" link

**About Preview:**
- Brief history snippet
- Image of the bakery
- "Our Story" link

**Franchise Teaser:**
- "Interested in joining our family?"
- Brief franchise description
- "Learn More" button

### 6.2 Products Page

**Filters:**
- Category tabs: Bakery, Catering, Wholesale, POS, Sundries
- Toggle: Retail / Wholesale (if applicable)
- Sort: Featured, Price Low-High, Price High-Low, Name A-Z

**Product Grid:**
- Responsive grid layout
- Pagination or infinite scroll
- Empty state: "No products found"

### 6.3 Product Detail Page

**Layout:**
- Product image (large, zoom on hover)
- Product info: name, category, price, description
- Add to cart section: quantity selector, add button
- Related products section

### 6.4 About / Business History Page

**Content:**
- Brand story and heritage
- Values and craftsmanship
- Team/family background
- Traditional baking methods
- Photos of the bakery through time

### 6.5 Franchise Page

**Sections:**
- Hero: "Own Your Dream Bakery"
- What is "Biz in a Box" model
- Benefits and support
- Investment overview
- Success stories/testimonials
- Application form (name, email, phone, message)

### 6.6 Careers Page

**Content:**
- "Join Our Team" heading
- Part-time positions available
- Job description (weekday work)
- Application form: Name, Email, Phone, CV upload, Message
- Note: Applications go to Joby

### 6.7 Contact Page

**Information:**
- Address: Camberley location
- Phone: (TBD)
- Email: (TBD)
- Opening hours: 9-5, Mon-Sat (TBD)

**Form:**
- Name, Email, Subject, Message
- Submit button

### 6.8 Account Pages

**Dashboard:**
- Welcome message
- Quick links: Recent Orders, Profile, Addresses
- Account summary

**Orders:**
- List of past orders with status
- Order detail view
- Reorder button

**Profile:**
- Edit personal information
- Change password

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 6.0 |
| **UI** | React 19 |
| **Styling** | Tailwind CSS 4.2 |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Client State** | Zustand (cart, UI state) |
| **Server State** | React Query / SWR |
| **Database** | Prisma + PostgreSQL |
| **Auth** | NextAuth.js with Prisma adapter |
| **Payments** | Teya POS (payment on collection) |

### 7.2 Data Models

**User:**
```typescript
{
  id: string
  email: string
  password: string (hashed)
  name: string
  phone?: string
  role: 'customer' | 'wholesale' | 'admin'
  createdAt: Date
}
```

**Product:**
```typescript
{
  id: string
  name: string
  description: string
  category: 'bakery' | 'catering' | 'wholesale' | 'pos' | 'sundries'
  retailPrice: number
  wholesalePrice: number | null
  wholesaleDiscountOverride: boolean
  image: string
  available: boolean
  productionTime: number // hours
  factoryA: boolean // made at Factory A
  factoryB: boolean // made at Factory B
}
```

**Factory:**
```typescript
{
  id: string
  name: string // 'Factory A' or 'Factory B'
  location: string
  address: string
  contactEmail: string
}
```

**Order:**
```typescript
{
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryMethod: 'collection' | 'delivery'
  deliveryAddress?: Address
  pickupTime: Date // selected by customer
  status: 'pending' | 'confirmed' | 'ready' | 'completed'
  factorySplit: {
    factoryA: OrderItem[]
    factoryB: OrderItem[]
  }
  teyaOrderId?: string
  createdAt: Date
}
```

**PickupSlot:**
```typescript
{
  id: string
  date: Date
  time: string // e.g., '09:00', '10:00'
  capacity: number
  booked: number
  available: boolean
}
```

### 7.3 API Endpoints

**Authentication:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/reset-password` | Send password reset email |

**Products:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters: category, wholesale/retail) |
| GET | `/api/products/[id]` | Get product detail |
| GET | `/api/products/wait-time` | Calculate minimum wait time for product list |

**Cart:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PATCH | `/api/cart/[itemId]` | Update cart item quantity |
| DELETE | `/api/cart/[itemId]` | Remove cart item |

**Orders:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (with factory split logic) |
| GET | `/api/orders` | List user orders |
| GET | `/api/orders/[id]` | Get order detail |
| PATCH | `/api/orders/[id]/status` | Update order status (admin) |

**Pickup Slots:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pickup-slots` | Get available slots (from minimum wait time) |
| POST | `/api/pickup-slots` | Create slots (admin) |

**Delivery (Interest Form):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/delivery/check` | Check if postcode is serviceable |
| POST | `/api/delivery/interest` | Submit delivery interest (stores preference) |

**Franchise:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/franchise/contact` | Submit franchise enquiry to Joby |

**Teya Integration:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teya/sync` | Sync order to Teya |
| GET | `/api/teya/orders` | Get Teya order status |
| POST | `/api/teya/webhook` | Teya webhook for status updates |

---

## 8. Assets Required

| Asset | Status | Notes |
|-------|--------|-------|
| **Logo** | ⏳ Pending | SVG + PNG versions |
| **Product Images** | ⏳ Pending | High-quality photos |
| **Hero Image** | ⏳ Pending | Bakery scene for homepage |
| **About Images** | ⏳ Pending | Historical/current photos |
| **Favicon** | ⏳ Pending | Match logo |

---

## 9. Open Questions (for Wednesday Meeting)

1. **Delivery threshold:** What minimum order amount for free delivery?
2. **Delivery area:** What radius do you deliver to?
3. **Delivery fee:** Is there a fee for orders below threshold?
4. **Wholesale approval:** How do wholesale accounts work?
5. **Payment confirmation:** Do you want any payment processing?
6. **Product pricing:** Can we get wholesale vs retail prices?
7. **Business hours:** What are your opening hours?
8. **Contact details:** Phone and email for the site?
9. **Logo delivery:** When can you send the logo?
10. **Product images:** When can you send product photos?

---

## 10. Development Phases

| Phase | Tasks | Status |
|-------|-------|--------|
| **Phase 1** | Design system, branding, layout components | Todo |
| **Phase 2** | Product catalog, browsing, filtering | Todo |
| **Phase 3** | Shopping cart, add/remove/update | Todo |
| **Phase 4** | User authentication (register/login) | Todo |
| **Phase 5** | Checkout flow (collection/delivery) | Todo |
| **Phase 6** | Order management, history | Todo |
| **Phase 7** | Business pages (About, Franchise, Careers) | Todo |
| **Phase 8** | Testing, polish, launch | Todo |

---

*Specification Version: 1.0*  
*Created: June 10, 2026*  
*Client: Joby (Slindon Patisserie)*