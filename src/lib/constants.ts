// ============================================
// Site Configuration
// ============================================

export const siteConfig = {
  name: 'Slindon Patisserie',
  description: 'Handmade patisserie products from Slindon, West Sussex. Over 40 years of crafting delicious treats.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://slindonpatisserie.co.uk',
  ogImage: '/og-image.png',
  location: 'Slindon, Arundel, West Sussex, BN18 0RP',
  phone: '01243 814369',
  links: {
    youtube: 'https://youtube.com/@SlindonBakery',
    instagram: 'https://instagram.com/slindonpatisserie',
    email: 'mailto:info@slindonpatisserie.co.uk',
  },
  address: {
    line1: 'The Old Bakery',
    line2: 'Slindon',
    line3: 'Arundel',
    county: 'West Sussex',
    postcode: 'BN18 0RP',
  },
  author: {
    name: 'Slindon Patisserie',
    bio: 'Family-run bakery with over 40 years of history in the South Downs National Park.',
  },
};

// ============================================
// Metadata
// ============================================

export const meta = {
  title: 'Slindon Patisserie',
  description: 'Handmade patisserie products from Slindon, West Sussex. Over 40 years of crafting delicious treats.',
  keywords: ['bakery', 'patisserie', 'slindon', 'west sussex', 'farmers market', 'wholesale', 'artisan'] as string[],
  siteName: 'Slindon Patisserie',
  twitter: '@slindonpatisserie',
  instagramHandle: '@slindonpatisserie',
};

// ============================================
// Navigation
// ============================================

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Our Story', href: '/about' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'Franchise', href: '/franchise' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Our Story', href: '/about' },
    { label: 'Wholesale', href: '/wholesale' },
    { label: 'Franchise', href: '/franchise' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  content: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
  social: [
    { label: 'YouTube', href: siteConfig.links.youtube },
    { label: 'Instagram', href: siteConfig.links.instagram },
  ],
};

// ============================================
// Design Tokens - Bakery Theme (Heritage Brand)
// ============================================

export const colors = {
  primary: '#8B1E22', // Heritage Deep Red - main brand color
  primaryHover: '#9B2A32', // Lighter red for hover
  accent: '#D0A246', // Antique Gold - secondary/highlights
  accentHover: '#E0B256', // Lighter gold for hover
  background: '#F7F2E9', // Soft Cream
  surface: '#FFFFFF', // White cards
  text: '#3A2C2A', // Dark brown
  textMuted: '#6B5344', // Warm brown muted
  border: '#E8DDD0', // Light warm border
  gold: '#D0A246', // Antique Gold
  red: '#8B1E22', // Heritage Red
} as const;

// ============================================
// Animation
// ============================================

export const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
} as const;

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  },
} as const;
