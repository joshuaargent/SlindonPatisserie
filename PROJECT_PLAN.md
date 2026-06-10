# Slindon Patisserie Website - Project Plan

> **Client:** Joby (Slindon Patisserie)  
> **Location:** Camberley  
> **Date:** June 2026  
> **Status:** Post-Meeting Update (Wednesday Meeting)  
> **Last Updated:** June 10, 2026

---

## 1. Project Overview

A gated ecommerce website for a traditional bakery business, enabling retail and wholesale customers to order products for collection or delivery.

### Key Objectives
- Sell bakery products (retail & wholesale)
- Offer collection from Camberley location
- Provide delivery (interest-based, not hard minimums)
- Feature business history and franchise opportunities
- Old school patisserie branding aesthetic
- Integrate with Teya POS for order management and payment

### Key Meeting Decisions ✅

| Decision | Details |
|----------|---------|
| **Franchise Pricing** | No prices shown - contact form only, Joby closes deals |
| **Delivery Approach** | Soft interest: "Interested in delivery? Click here" |
| **Tech Stack** | Zustand (client) + Prisma (database) + NextAuth |
| **Pricing Model** | Wholesale ~50% of retail (exceptions per product) |
| **Factory Routing** | 2 factories, products assigned, split orders automatically |
| **Wait Time** | Show largest product wait time, customer picks slot after minimum |
| **Teya Integration** | Sync orders to factory, payment on collection |

---

## 2. Business Details

### Client Information
- **Contact:** Joby
- **Location:** Camberley
- **Operating Hours:** 9:00 AM - 5:00 PM
- **Current Status:** Just returned from 9 days straight working

### Business Type
- Traditional Patisserie (bakery)
- Retail and wholesale offerings

---

## 3. Website Requirements

### 3.1 Ecommerce Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Gated Website** | Customers must log in to access pricing/ordering | High |
| **Retail Store** | Individual customer purchases | High |
| **Wholesale Store** | Bulk/business customer purchases | High |
| **Collection** | Pick up from Camberley location | High |
| **Delivery** | Home/workplace delivery (over minimum £ amount) | High |
| **Pay on Collection** | No online payment - pay when picking up | High |
| **Shopping Cart** | Add products, adjust quantities | High |
| **Order Management** | Order history, status tracking | Medium |

### 3.2 Product Categories

| Category | Examples | Notes |
|----------|----------|-------|
| **Bakery Products** | Breads, pastries, cakes | Main offering |
| **Catering** | Rolls, party platters | New category to add |
| **POS Materials** | Point of sale items | For other businesses |
| **Sundries** | Bags, packaging | Additional revenue stream |

### 3.3 Website Sections

| Section | Content | Status |
|---------|---------|--------|
| **Home** | Hero, featured products, about preview | Todo |
| **Products** | Browse by category (Retail/Wholesale) | Todo |
| **Business History** | Brand story, heritage, values | Todo |
| **Franchise** | "Biz in a box" model, investment details | Todo |
| **Careers** | Part-time staff positions, application form | Todo |
| **Contact** | Location, hours, enquiry form | Todo |
| **Account** | Login, registration, order history | Todo |

---

## 4. Branding & Design

### 4.1 Brand Identity
- **Theme:** Old school patisserie
- **Aesthetic:** Traditional, artisanal, premium quality
- **Logo:** To be provided by Joby

### 4.2 Design Direction
- Warm, inviting color palette (cream, brown, gold tones)
- Classic typography (serif fonts for headings)
- High-quality product photography (Joby to supply)
- Traditional bakery imagery elements

### 4.3 Visual References
- YouTube Video: https://m.youtube.com/watch?v=DCcNjBQn5EE

---

## 5. Functionality Requirements

### 5.1 Customer Flow

```
Landing Page → Register/Login → Browse Products → Add to Cart → 
Select Collection/Delivery → Place Order → Pay on Collection/Delivery
```

### 5.2 User Accounts
- Customer registration (name, email, password)
- Login functionality
- Profile management
- Order history
- Wholesale account approval (optional)

### 5.3 Order Management
- View current orders
- Order status (Pending, Preparing, Ready, Collected/Delivered)
- Reorder from previous orders

### 5.4 Delivery Approach

**Strategy:** Interest-based, not hard minimums

| Step | Description |
|------|-------------|
| 1 | Customer on checkout sees "Collection" selected by default |
| 2 | "Interested in delivery? Click here" link shown |
| 3 | Customer enters postcode to check serviceability |
| 4 | If serviceable, delivery option unlocks |
| 5 | Customer selects delivery, pays on collection/delivery |

**Benefits:**
- No customer frustration from hard cutoffs
- Joby can manage delivery capacity flexibly
- Can charge for delivery or offer free over threshold (to be decided)

### 5.5 Pricing Model

| Customer Type | Pricing | Notes |
|---------------|---------|-------|
| **Retail** | Full price | Default for new accounts |
| **Wholesale** | ~50% of retail | Most products |
| **Exceptions** | Per-product pricing | Some products have specific wholesale prices |

**Implementation:**
- Each product has `retailPrice` and `wholesalePrice`
- `wholesaleDiscountOverride` flag for exceptions
- Pricing shown dynamically based on account type

---

## 6. Factory Routing & Production

### 6.1 Two Factories
| Factory | Products | Notes |
|---------|----------|-------|
| **Factory A** | Subset of products | Location TBD |
| **Factory B** | Subset of products | Location TBD |
| **Both** | Some products available at both | Use fastest production time |

### 6.2 Wait Time Calculation

**Logic:**
1. Each product has a `productionTime` (in hours)
2. If product made at both factories → use shortest production time
3. Order minimum pickup time = MAX(all product production times)

**Example:**
```
Donut: 24 hours, Factory A only
Brownie: 48 hours, Factory B only
Order contains both → Minimum pickup: 48 hours from order time
```

### 6.3 Order Splitting

When order contains products from both factories:
1. System splits order into Factory A items and Factory B items
2. Each factory receives their portion
3. Customer picks up both at same time (or order shows split)
4. Teya integration handles routing to correct factory

### 6.4 Pickup Slot Selection

| Step | Description |
|------|-------------|
| 1 | Calculate minimum wait time from order items |
| 2 | Show customer: "Earliest pickup: [Date] at [Time]" |
| 3 | Display available time slots from minimum wait onwards |
| 4 | Customer selects preferred slot |
| 5 | Slot is reserved for their order |

**Time Slots:** Configurable (e.g., 9am, 10am, 11am, 12pm, 1pm, 2pm, 3pm, 4pm)

---

## 7. Franchise Section

### 7.1 Strategy: Information + Contact (No Pricing)

**Why no prices?**
- Franchise deals are complex and personalized
- Prices shown online kill negotiation
- Joby needs to qualify leads and close deals personally

### 7.2 Page Content
- "Biz in a box" model explanation
- Benefits and what franchisees get
- Support package (training, equipment, supply chain)
- Success stories/testimonials
- "Investment details available on request" placeholder
- Contact form → sends enquiry to Joby

### 7.3 Contact Form Fields
- Name
- Email
- Phone
- Message (optional)
- How did you hear about us?

### 7.4 Information Needed from Joby
- [ ] Franchise model details
- [ ] Support package specifics
- [ ] Success stories/testimonials
- [ ] Timeline/process overview

---

## 8. Staff Recruitment

### 8.1 Careers Section
- Part-time positions (weekday work)
- Job descriptions
- Application form
- Contact for enquiries

### 8.2 Application Flow
- Online application form
- Submit CV/contact details
- Joby receives applications (not on website)

---

## 9. Technical Requirements

### 9.1 Tech Stack
| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 6.0 |
| UI | React 19 |
| Styling | Tailwind CSS 4.2 |
| Client State | Zustand (cart, UI) |
| Database | Prisma + PostgreSQL |
| Auth | NextAuth.js |
| POS/Payments | Teya |

### 9.2 Features to Build
- User authentication (register, login, logout)
- Product catalog with categories
- Shopping cart functionality (Zustand)
- Dynamic pricing (retail vs wholesale)
- Order placement with factory routing
- Pickup slot selection
- Delivery interest form
- Franchise contact form
- Teya integration for order sync

### 9.3 Assets Needed
| Asset | Source | Status |
|-------|--------|--------|
| Logo | Joby to provide | Pending |
| Product Images | Joby to send | Pending |
| Brand Guidelines | Joby to provide | Pending |

---

## 10. Teya Integration

### 10.1 Purpose
Teya is a POS (point-of-sale) system that handles:
- Payment processing (card reader at counter)
- Order management
- Factory routing

### 10.2 Order Flow with Teya
```
Customer places order on website
         ↓
    Prisma Database
         ↓
    Teya API Sync
         ↓
   ┌────┴────┐
Factory A  Factory B
   ↓         ↓
 (items)   (items)
```

### 10.3 Integration Points
| Feature | Description |
|---------|-------------|
| **Order Creation** | POST order to Teya when placed on website |
| **Factory Split** | Orders with products from both factories split automatically |
| **Status Updates** | Teya webhook updates order status in our system |
| **Payment** | Customer pays on collection via Teya card reader |

### 10.4 API Requirements (Pending from Joby)
- [ ] Teya API endpoint for order creation
- [ ] Teya API authentication details
- [ ] Factory-specific endpoints or single endpoint with routing
- [ ] Webhook URL for status updates
- [ ] Order status mapping (our statuses ↔ Teya statuses)

---

## 11. Discussion Points (Meeting Complete ✅)

### Items Discussed & Confirmed
| Topic | Decision | Status |
|-------|----------|--------|
| Franchise | No pricing, contact form only | ✅ Agreed |
| Delivery | Interest-based ("Click here") | ✅ Agreed |
| Tech Stack | Zustand + Prisma | ✅ Agreed |
| Pricing | ~50% wholesale (exceptions allowed) | ✅ Agreed |
| Factories | 2 factories, auto-routing | ✅ Agreed |
| Wait Times | Show longest, customer picks after | ✅ Agreed |
| Teya | POS integration for orders | ✅ Discussed |

### Items Still Needed from Joby
1. **Logo & Branding Assets** - SVG, PNG, colors
2. **Product Images** - For catalog
3. **Product List** - Full list with categories
4. **Franchise Details** - Model, support, testimonials
5. **Business History** - Brand story, heritage
6. **Teya API Access** - Credentials, endpoints
7. **Factory Details** - Locations, contact info
8. **Contact Info** - Phone, email for site

### Questions for Next Meeting
- [ ] What are the specific Teya API endpoints?
- [ ] How do we authenticate with Teya?
- [ ] What's the factory production schedule?
- [ ] What time slots should we offer?
- [ ] Any products that are exceptions to the 50% rule?

---

## 10. Project Timeline

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Design & Branding | Pending |
| **Phase 2** | Core Ecommerce | Pending |
| **Phase 3** | User Accounts | Pending |
| **Phase 4** | Franchise Section | Pending |
| **Phase 5** | Careers Section | Pending |
| **Phase 6** | Testing & Launch | Pending |

---

## 11. Next Steps

1. ✅ Meeting scheduled with Joby (Wednesday)
2. ⏳ Receive logo and brand assets
3. ⏳ Receive product images
4. ⏳ Confirm delivery minimum amounts
5. ⏳ Get franchise details
6. ⏳ Finalize business history content

---

## 12. Open Questions

- [ ] What is the minimum order amount for delivery?
- [ ] Is there a delivery fee or is it free over a threshold?
- [ ] How do wholesale customers apply/get approved?
- [ ] Do you want to accept pre-orders (e.g., for next day collection)?
- [ ] Any seasonal products or limited availability items?
- [ ] Do you want email notifications for new orders?

---

*Document Version: 1.0*  
*Last Updated: June 10, 2026*