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
  { label: 'Our Story', href: '/about' },
  { label: 'Find Us', href: '/markets' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'Franchise', href: '/franchise' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Our Story', href: '/about' },
    { label: 'Find Us', href: '/markets' },
    { label: 'Wholesale', href: '/wholesale' },
    { label: 'Franchise', href: '/franchise' },
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
// Design Tokens - Bakery Theme
// ============================================

export const colors = {
  primary: '#8B4513', // Rich brown (saddle brown)
  primaryHover: '#6B3410', // Darker brown
  accent: '#D4A574', // Warm caramel/golden brown
  background: '#FDF8F0', // Warm cream
  surface: '#FFFFFF', // White cards
  text: '#2D1810', // Dark chocolate
  textMuted: '#6B5B4F', // Warm gray-brown
  border: '#E8DDD0', // Light warm border
  gold: '#C9A962', // Antique gold
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
