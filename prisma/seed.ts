import 'dotenv/config'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@optician.com'
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('✓ Admin user already exists:', email)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN' // Using Role enum
    }
  })

  console.log('✓ Admin user created successfully!')
  console.log('  Email:', admin.email)
  console.log('  Password:', password)
  console.log('\n⚠️  IMPORTANT: Please change this password after first login!')
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
