import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user only
  const hashedPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@slindonpatisserie.co.uk' },
    update: {},
    create: {
      email: 'admin@slindonpatisserie.co.uk',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create essential site settings
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
  console.log('Created site settings')

  console.log('\n✅ Database initialized successfully!')
  console.log('\n📋 Login credentials:')
  console.log('   Admin: admin@slindonpatisserie.co.uk / admin123')
  console.log('\n📝 Add categories, products, and other content from the admin dashboard at /admin')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })