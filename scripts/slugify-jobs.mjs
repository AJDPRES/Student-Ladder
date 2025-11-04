#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugifyTitle(title) {
  const normalized = title
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/_-]+/g, '')
    .replace(/[\s/_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'role';
}

async function slugExists(tx, { slug, type, sponsored, companyId, excludeId }) {
  const where = {
    slug,
    type,
    sponsored,
  };
  if (sponsored) {
    where.companyId = companyId;
  } else {
    where.sponsored = false;
  }
  if (excludeId) {
    where.NOT = { id: excludeId };
  }
  const existing = await tx.job.findFirst({ where, select: { id: true } });
  return Boolean(existing);
}

async function uniqueJobSlug(tx, { base, type, sponsored, companyId, excludeId }) {
  let attempt = base;
  let counter = 2;
  while (await slugExists(tx, { slug: attempt, type, sponsored, companyId, excludeId })) {
    attempt = `${base}-${counter++}`;
  }
  return attempt;
}

async function run() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'asc' } });
  let updated = 0;
  for (const job of jobs) {
    await prisma.$transaction(async (tx) => {
      const base = slugifyTitle(job.title);
      const targetSlug = await uniqueJobSlug(tx, {
        base,
        type: job.type,
        sponsored: job.sponsored,
        companyId: job.sponsored ? job.companyId : undefined,
        excludeId: job.id,
      });
      if (targetSlug !== job.slug) {
        await tx.job.update({ where: { id: job.id }, data: { slug: targetSlug } });
        console.log(`Updated job ${job.id}: ${job.slug} -> ${targetSlug}`);
        updated += 1;
      }
    });
  }
  console.log(`Slug backfill complete. ${updated} job(s) updated.`);
}

run()
  .catch((error) => {
    console.error('Slug backfill failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
