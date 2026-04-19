import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Keep the reset idempotent, but do not inject sample records.
  await prisma.sessionNote.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.moodLog.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database initialized without sample data!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

