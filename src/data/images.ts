// ============================================
// Image Data - Slindon Patisserie
// ============================================
// 
// To add images:
// 1. Place image files in /public/images/[category]/
// 2. Add entries below with path and metadata
// 3. Reference using the path in components
//
// Categories:
// - bakery: General bakery images, exterior, interior
// - products: Product photography
// - team: Team member photos
// - markets: Farmers market images
// ============================================

export interface ImageEntry {
  id: string;
  path: string;
  alt: string;
  description: string;
  category: 'bakery' | 'products' | 'team' | 'markets';
  width?: number;
  height?: number;
}

export const images: ImageEntry[] = [
  // Bakery images
  {
    id: 'bakery-exterior',
    path: '/images/bakery/exterior.jpg',
    alt: 'Slindon Patisserie Exterior',
    description: 'The Old Bakery in Slindon village',
    category: 'bakery',
  },
  {
    id: 'bakery-interior',
    path: '/images/bakery/interior.jpg',
    alt: 'Inside Our Bakery',
    description: 'Our traditional bakery interior',
    category: 'bakery',
  },
  {
    id: 'bakery-baking',
    path: '/images/bakery/baking.jpg',
    alt: 'Fresh From the Oven',
    description: 'Our bakers at work',
    category: 'bakery',
  },

  // Product images
  {
    id: 'product-croissants',
    path: '/images/products/croissants.jpg',
    alt: 'Fresh Croissants',
    description: 'Our signature butter croissants',
    category: 'products',
  },
  {
    id: 'product-cakes',
    path: '/images/products/cakes.jpg',
    alt: 'Handmade Cakes',
    description: 'Selection of our handmade cakes',
    category: 'products',
  },
  {
    id: 'product-bread',
    path: '/images/products/bread.jpg',
    alt: 'Artisan Bread',
    description: 'Freshly baked artisan bread',
    category: 'products',
  },
  {
    id: 'product-pastries',
    path: '/images/products/pastries.jpg',
    alt: 'Sweet Pastries',
    description: 'Variety of sweet pastries',
    category: 'products',
  },

  // Team images
  {
    id: 'team-andrew',
    path: '/images/team/andrew.jpg',
    alt: 'Andrew Turner-Cross',
    description: 'Our Master Baker',
    category: 'team',
  },
  {
    id: 'team-jovie',
    path: '/images/team/jovie.jpg',
    alt: 'Jovie',
    description: 'Markets & Content',
    category: 'team',
  },

  // Market images
  {
    id: 'market-stall',
    path: '/images/markets/stall.jpg',
    alt: 'Our Market Stall',
    description: 'Find us at farmers markets across the region',
    category: 'markets',
  },
  {
    id: 'market-display',
    path: '/images/markets/display.jpg',
    alt: 'Market Display',
    description: 'Our beautiful product display',
    category: 'markets',
  },
];

// Helper function to get images by category
export function getImagesByCategory(category: ImageEntry['category']): ImageEntry[] {
  return images.filter(img => img.category === category);
}

// Get single image by ID
export function getImageById(id: string): ImageEntry | undefined {
  return images.find(img => img.id === id);
}

// Placeholder image for when actual images aren't available
export const placeholderImage = {
  path: '/images/placeholder.svg',
  alt: 'Image placeholder',
  description: 'Image placeholder',
};