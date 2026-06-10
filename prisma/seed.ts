import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create factories
  const factoryA = await prisma.factory.create({
    data: {
      name: 'Factory A',
      location: 'Camberley',
      address: '123 Main Street, Camberley, GU15 3YN',
      contactEmail: 'factory-a@slindonpatisserie.co.uk',
      active: true,
    },
  })

  const factoryB = await prisma.factory.create({
    data: {
      name: 'Factory B',
      location: 'Camberley',
      address: '456 Industrial Estate, Camberley, GU15 4AB',
      contactEmail: 'factory-b@slindonpatisserie.co.uk',
      active: true,
    },
  })

  // Create products - Bakery category
  const bakeryProducts = [
    {
      name: 'Butter Croissant',
      description: 'Flaky, buttery French croissant made with finest French butter. Golden and crispy on the outside, soft and layered within.',
      category: 'bakery',
      retailPrice: 2.50,
      wholesalePrice: 1.25,
      productionTimeHours: 8,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Pain au Chocolat',
      description: 'Classic French pastry with rich dark chocolate batons. Layers of buttery dough wrapped around premium chocolate.',
      category: 'bakery',
      retailPrice: 2.80,
      wholesalePrice: 1.40,
      productionTimeHours: 8,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Almond Croissant',
      description: 'Croissant filled with almond cream and topped with flaked almonds and icing sugar.',
      category: 'bakery',
      retailPrice: 3.20,
      wholesalePrice: 1.60,
      productionTimeHours: 10,
      madeAtFactoryA: true,
      madeAtFactoryB: false,
    },
    {
      name: 'Pain aux Raisins',
      description: 'Spiral pastry with custard and raisins, dusted with sugar.',
      category: 'bakery',
      retailPrice: 2.70,
      wholesalePrice: 1.35,
      productionTimeHours: 10,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'French Baguette',
      description: 'Traditional long loaf with a crispy crust and light, airy interior. Perfect for sandwiches or with cheese.',
      category: 'bakery',
      retailPrice: 2.20,
      wholesalePrice: 1.10,
      productionTimeHours: 4,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Sourdough Boule',
      description: 'Rustic round loaf with a caramelized crust and tangy, open crumb. Made with our 48-hour fermented starter.',
      category: 'bakery',
      retailPrice: 4.50,
      wholesalePrice: 2.25,
      productionTimeHours: 48,
      madeAtFactoryA: true,
      madeAtFactoryB: false,
    },
    {
      name: 'Chocolate Brownie',
      description: 'Rich, fudgy brownie with Belgian chocolate chunks. Dense and decadent.',
      category: 'bakery',
      retailPrice: 3.00,
      wholesalePrice: 1.50,
      productionTimeHours: 24,
      madeAtFactoryA: false,
      madeAtFactoryB: true,
    },
    {
      name: 'Victoria Sponge',
      description: 'Classic British sandwich cake with vanilla buttercream and strawberry jam between two light sponge layers.',
      category: 'bakery',
      retailPrice: 4.80,
      wholesalePrice: 2.40,
      productionTimeHours: 12,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
  ]

  // Create products - Catering category
  const cateringProducts = [
    {
      name: 'Mini Sandwich Selection',
      description: 'Assorted mini sandwiches: cucumber, egg mayo, ham & mustard, cheese & pickle. Perfect for events.',
      category: 'catering',
      retailPrice: 15.00,
      wholesalePrice: 7.50,
      productionTimeHours: 4,
      madeAtFactoryA: true,
      madeAtFactoryB: false,
    },
    {
      name: 'Savory Platter',
      description: 'Selection of quiches, sausage rolls, and savory tarts. Serves 8-10 people.',
      category: 'catering',
      retailPrice: 35.00,
      wholesalePrice: 17.50,
      productionTimeHours: 8,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Fruit Scones (6 pack)',
      description: 'Traditional fruit scones with currents and sultanas. Best served warm with clotted cream and jam.',
      category: 'catering',
      retailPrice: 8.50,
      wholesalePrice: 4.25,
      productionTimeHours: 6,
      madeAtFactoryA: true,
      madeAtFactoryB: false,
    },
    {
      name: 'Cream Tea for Two',
      description: 'Two plain scones, clotted cream, strawberry jam, and a pot of loose leaf tea.',
      category: 'catering',
      retailPrice: 12.00,
      wholesalePrice: 6.00,
      productionTimeHours: 2,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Pastry Selection Box',
      description: '12 assorted Danish pastries and croissants. Ideal for meetings or breakfast service.',
      category: 'catering',
      retailPrice: 28.00,
      wholesalePrice: 14.00,
      productionTimeHours: 12,
      madeAtFactoryA: true,
      madeAtFactoryB: false,
    },
  ]

  // Create wholesale products
  const wholesaleProducts = [
    {
      name: 'Large Croissant Box (30)',
      description: 'Box of 30 premium butter croissants. Bulk pricing for bakeries and cafes.',
      category: 'wholesale',
      retailPrice: 45.00,
      wholesalePrice: 35.00,
      wholesaleDiscountOverride: true,
      productionTimeHours: 8,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Baguette Box (20)',
      description: 'Box of 20 freshly baked French baguettes.',
      category: 'wholesale',
      retailPrice: 32.00,
      wholesalePrice: 25.00,
      wholesaleDiscountOverride: true,
      productionTimeHours: 4,
      madeAtFactoryA: true,
      madeAtFactoryB: true,
    },
    {
      name: 'Patisserie Selection Box',
      description: 'Assorted selection of 40 mixed patisserie items including croissants, Danish, and tarts.',
      category: 'wholesale',
      retailPrice: 75.00,
      wholesalePrice: 60.00,
      wholesaleDiscountOverride: true,
      productionTimeHours: 12,
      madeAtFactoryA: true,
      madeAtFactoryB: false,
    },
  ]

  // Create POS products
  const posProducts = [
    {
      name: 'Paper Bags (500)',
      description: 'Plain brown paper bags. Medium size.',
      category: 'pos',
      retailPrice: 15.00,
      productionTimeHours: 0,
      madeAtFactoryA: false,
      madeAtFactoryB: false,
    },
    {
      name: 'Branded Paper Bags (250)',
      description: 'Paper bags printed with Slindon Patisserie logo.',
      category: 'pos',
      retailPrice: 35.00,
      productionTimeHours: 0,
      madeAtFactoryA: false,
      madeAtFactoryB: false,
    },
  ]

  // Create sundries products
  const sundriesProducts = [
    {
      name: 'Clotted Cream (227g)',
      description: 'Premium Cornish clotted cream. Keep refrigerated.',
      category: 'sundries',
      retailPrice: 4.50,
      productionTimeHours: 0,
      madeAtFactoryA: false,
      madeAtFactoryB: false,
    },
    {
      name: 'Strawberry Jam (340g)',
      description: 'Homemade strawberry jam with real fruit.',
      category: 'sundries',
      retailPrice: 3.50,
      productionTimeHours: 0,
      madeAtFactoryA: false,
      madeAtFactoryB: false,
    },
  ]

  // Insert all products
  const allProducts = [
    ...bakeryProducts,
    ...cateringProducts,
    ...wholesaleProducts,
    ...posProducts,
    ...sundriesProducts,
  ]

  for (const product of allProducts) {
    await prisma.product.create({
      data: {
        ...product,
        image: `/images/products/${product.name.toLowerCase().replace(/ /g, '-')}.jpg`,
        available: true,
      },
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Created 2 factories and ${allProducts.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })