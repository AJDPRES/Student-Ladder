import type { JobType, Prisma } from '@prisma/client';

export function slugifyTitle(title: string): string {
  const normalized = title
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/_-]+/g, '')
    .replace(/[\s/_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'job';
}

async function slugExists(
  tx: Prisma.TransactionClient,
  opts: { slug: string; type: JobType; sponsored: boolean; companyId?: string; excludeId?: string },
) {
  const where: Prisma.JobWhereInput = {
    slug: opts.slug,
    type: opts.type,
    sponsored: opts.sponsored,
  };
  if (opts.sponsored) {
    where.companyId = opts.companyId;
  } else {
    where.sponsored = false;
  }
  if (opts.excludeId) {
    where.NOT = { id: opts.excludeId };
  }
  const existing = await tx.job.findFirst({ where, select: { id: true } });
  return Boolean(existing);
}

export async function uniqueJobSlug({
  tx,
  base,
  type,
  sponsored,
  companyId,
  excludeId,
}: {
  tx: Prisma.TransactionClient;
  base: string;
  type: JobType;
  sponsored: boolean;
  companyId?: string;
  excludeId?: string;
}): Promise<string> {
  let attempt = base;
  let counter = 2;
  while (await slugExists(tx, { slug: attempt, type, sponsored, companyId, excludeId })) {
    attempt = `${base}-${counter++}`;
  }
  return attempt;
}
