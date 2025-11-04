#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const employers = await prisma.employer.findMany({ select: { userId: true } });
  for (const employer of employers) {
    await prisma.user.update({ where: { id: employer.userId }, data: { role: 'EMPLOYER' } });
    console.log(`Set role=EMPLOYER for user ${employer.userId}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
