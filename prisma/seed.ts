import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@slindonpatisserie.co.uk' },
    update: {},
    create: {
      email: 'admin@slindonpatisserie.co.uk',
      password: hashedPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  })
  console.log('Created admin user:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'pastries' },
      update: {},
      create: { name: 'Pastries', slug: 'pastries', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'breads' },
      update: {},
      create: { name: 'Breads', slug: 'breads', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'cakes' },
      update: {},
      create: { name: 'Cakes', slug: 'cakes', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'seasonal' },
      update: {},
      create: { name: 'Seasonal', slug: 'seasonal', sortOrder: 4 },
    }),
  ])
  console.log('Created categories:', categories.length)

  const [pastries, breads, cakes, seasonal] = categories

  // Create products
  const products = [
    // Pastries
    { name: 'Butter Croissant', slug: 'butter-croissant', description: 'Flaky, buttery French croissant made with finest French butter.', categoryId: pastries.id, retailPrice: 2.50, productionTimeHours: 8 },
    { name: 'Pain au Chocolat', slug: 'pain-au-chocolat', description: 'Classic French pastry with rich dark chocolate batons.', categoryId: pastries.id, retailPrice: 2.80, productionTimeHours: 8 },
    { name: 'Almond Croissant', slug: 'almond-croissant', description: 'Croissant filled with almond cream and topped with flaked almonds.', categoryId: pastries.id, retailPrice: 3.20, productionTimeHours: 10 },
    { name: 'Pain aux Raisins', slug: 'pain-aux-raisins', description: 'Spiral pastry with custard and raisins, dusted with sugar.', categoryId: pastries.id, retailPrice: 2.70, productionTimeHours: 10 },
    // Breads
    { name: 'French Baguette', slug: 'french-baguette', description: 'Traditional long loaf with a crispy crust and light, airy interior.', categoryId: breads.id, retailPrice: 2.20, productionTimeHours: 4 },
    { name: 'Sourdough Boule', slug: 'sourdough-boule', description: 'Rustic round loaf with a caramelized crust and tangy, open crumb.', categoryId: breads.id, retailPrice: 4.50, productionTimeHours: 48 },
    { name: 'Ciabatta', slug: 'ciabatta', description: 'Italian white bread with a crisp crust and porous interior.', categoryId: breads.id, retailPrice: 3.00, productionTimeHours: 6 },
    // Cakes
    { name: 'Victoria Sponge', slug: 'victoria-sponge', description: 'Classic British sandwich cake with vanilla buttercream and strawberry jam.', categoryId: cakes.id, retailPrice: 4.80, productionTimeHours: 12 },
    { name: 'Chocolate Brownie', slug: 'chocolate-brownie', description: 'Rich, fudgy brownie with Belgian chocolate chunks.', categoryId: cakes.id, retailPrice: 3.00, productionTimeHours: 24 },
    { name: 'Carrot Cake', slug: 'carrot-cake', description: 'Moist carrot cake with cream cheese frosting and walnuts.', categoryId: cakes.id, retailPrice: 5.50, productionTimeHours: 16 },
    // Seasonal
    { name: 'Hot Cross Buns', slug: 'hot-cross-buns', description: 'Traditional spiced buns with cross marking, dried fruits.', categoryId: seasonal.id, retailPrice: 3.50, productionTimeHours: 12, isWholesaleOnly: false },
    { name: 'Christmas Pudding', slug: 'christmas-pudding', description: 'Rich, moist pudding with brandy and dried fruits. Pre-order only.', categoryId: seasonal.id, retailPrice: 18.00, productionTimeHours: 72 },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        wholesalePrice: product.retailPrice * 0.6,
        available: true,
        featured: product.retailPrice >= 4.50,
        madeAtFactoryA: true,
        madeAtFactoryB: true,
      },
    })
  }
  console.log('Created products:', products.length)

  // Create factory
  await prisma.factory.upsert({
    where: { id: 'factory-main' },
    update: {},
    create: {
      id: 'factory-main',
      name: 'Main Bakery',
      location: 'Camberley',
      address: 'Camberley, Surrey',
      contactEmail: 'bakery@slindonpatisserie.co.uk',
      active: true,
    },
  })
  console.log('Created factory')

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'Slindon Patisserie', type: 'string' },
    { key: 'contact_email', value: 'info@slindonpatisserie.co.uk', type: 'string' },
    { key: 'contact_phone', value: '01243 814369', type: 'string' },
    { key: 'collection_address', value: 'Camberley, Surrey', type: 'string' },
    { key: 'delivery_fee', value: '5', type: 'number' },
    { key: 'free_delivery_threshold', value: '50', type: 'number' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('Created site settings:', settings.length)

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📋 Login credentials:')
  console.log('   Admin: admin@slindonpatisserie.co.uk / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })