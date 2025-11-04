import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emailArg = process.argv[2];
  if (!emailArg) {
    console.error('Usage: node scripts/promote-admin.mjs <email>');
    process.exit(1);
  }

  const email = emailArg.trim();
  if (!email) {
    console.error('Email cannot be empty.');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true },
  });

  console.log(`Promoted ${user.email ?? user.id} to admin.`);
}

main()
  .catch((error) => {
    console.error('Failed to promote admin:', error.message ?? error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
