import { siteConfig } from '@/lib/constants';

// ============================================
// Slindon Patisserie - Business Data
// ============================================

export const businessInfo = {
  name: 'Slindon Patisserie',
  tagline: 'Handmade Patisserie, Traditional Quality',
  description: `Slindon Patisserie is a family run bakery. We craft handmade patisserie products using traditional recipes and the finest ingredients. Order online for collection from our Camberley bakery or find us at local farmers markets.`,
  history: `For over 40 years, Slindon Patisserie has been crafting handmade bakery products using recipes passed down through generations. Led by Master Baker Andrew Turner-Cross, we continue the traditions that have made us a beloved fixture in the community. Every product that leaves our bakery carries the same dedication to quality.`,
  // Main bakery location (Slindon)
  location: 'Slindon, Arundel, West Sussex',
  address: 'The Old Bakery, Slindon, Arundel, West Sussex, BN18 0RP',
  phone: '01243 814369',
  email: 'info@slindonpatisserie.co.uk',
  avatar: '/images/bakery-logo.png',
  
  // Collection point (Camberley) - where customers pick up online orders
  collectionPoint: {
    name: 'Camberley Collection',
    address: 'Camberley, Surrey',
    note: 'Full address provided in order confirmation',
    hours: 'Mon-Sat: 9:00 AM - 5:00 PM',
    phone: '01243 814369',
  },
};

export const socialLinks = {
  youtube: 'https://youtube.com/@SlindonBakery',
  instagram: 'https://instagram.com/slindonpatisserie',
};

// Team members
export const teamMembers = [
  {
    name: 'Andrew Turner-Cross',
    role: 'Master Baker',
    description: 'Leading our bakery with over 40 years of experience in traditional patisserie.',
  },
  {
    name: 'Juliet Ann Turner-Cross',
    role: 'Family Partnership',
    description: 'Integral part of our family business operations and quality control.',
  },
  {
    name: 'Jovie',
    role: 'Markets & Content',
    description: 'Our friendly face at farmers markets and creator of our social media content.',
  },
];

// Farmers market schedule
export const marketSchedule = [
  {
    name: 'Arundel Market',
    day: '3rd Saturday of each month',
    time: '9:00 AM - 1:00 PM',
    location: 'Arundel Town Centre',
    description: 'Our flagship market - find us near the castle grounds.',
  },
  {
    name: 'Shoreham Market',
    day: 'Weekly',
    time: '9:00 AM - 1:00 PM',
    location: 'Shoreham-by-Sea',
    description: 'Regular presence at this popular coastal market.',
  },
  {
    name: 'Ripley Market',
    day: 'Weekly',
    time: '9:00 AM - 2:00 PM',
    location: 'Ripley, Surrey',
    description: 'Visit us at one of the largest farmers markets in the area.',
  },
  {
    name: 'Camberley Market',
    day: 'Weekly',
    time: '9:00 AM - 1:00 PM',
    location: 'Camberley Town Centre',
    description: 'Serving the Camberley community with our full range of products.',
  },
  {
    name: 'St Nicholas Centre',
    day: 'Weekly',
    time: '9:00 AM - 1:00 PM',
    location: 'Worthing',
    description: 'Regular presence at this busy shopping centre.',
  },
];

// Products
export const products = {
  categories: [
    {
      name: 'Pastries',
      items: ['Croissants', 'Pain au Chocolat', 'Almond Croissants', 'Danish Pastries'],
    },
    {
      name: 'Cakes',
      items: ['Sponge Cakes', 'Cheesecake', 'Victoria Sponge', 'Carrot Cake'],
    },
    {
      name: 'Bread',
      items: ['Sourdough', 'Ciabatta', 'Baguette', 'Focaccia'],
    },
    {
      name: 'Seasonal',
      items: ['Christmas Puddings', 'Easter Eggs', 'Hot Cross Buns', 'Summer Fruits'],
    },
  ],
};
