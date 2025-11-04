'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import type { JobKind, JobType, UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { jobCanonicalPath, jobTypeToSlug } from '@/lib/jobs/paths';
import { slugifyTitle, uniqueJobSlug } from '@/lib/slug';

async function requireEmployer(nextPath = '/employer/dashboard') {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/employer/login?next=${encodeURIComponent(nextPath)}`);
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, employer: { select: { companyId: true } } },
  });
  if (user?.role !== 'EMPLOYER') {
    redirect(`/employer/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (!user.employer) {
    redirect('/employer/onboard');
  }
  return { userId, companyId: user.employer.companyId };
}

function normalizeString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function toStringArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

type JobRevalidationRecord = {
  slug: string;
  type: JobType;
  sponsored: boolean;
  company: { slug: string } | null;
};

function revalidateJob(job: JobRevalidationRecord, previous?: JobRevalidationRecord) {
  revalidatePath('/employer/dashboard');
  if (job.company?.slug) {
    revalidatePath(`/company/${job.company.slug}/`);
  }
  const canonical = jobCanonicalPath({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : undefined,
  });
  const typePath = `/${jobTypeToSlug(job.type)}/`;
  revalidatePath(canonical);
  revalidatePath(typePath);

  if (previous) {
    const prevCanonical = jobCanonicalPath({
      slug: previous.slug,
      type: previous.type,
      sponsored: previous.sponsored,
      company: previous.company ? { slug: previous.company.slug } : undefined,
    });
    const prevTypePath = `/${jobTypeToSlug(previous.type)}/`;
    if (prevCanonical !== canonical) {
      revalidatePath(prevCanonical);
    }
    if (prevTypePath !== typePath) {
      revalidatePath(prevTypePath);
    }
    if (previous.company?.slug && previous.company.slug !== job.company?.slug) {
      revalidatePath(`/company/${previous.company.slug}/`);
    }
  }
}

export type OnboardState = {
  status: 'idle' | 'created' | 'linked' | 'error';
  message?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'company';
}

async function ensureEmployerRole(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'EMPLOYER') {
    await prisma.user.update({ where: { id: userId }, data: { role: 'EMPLOYER' as UserRole } });
  }
}

async function ensureEmployerLink(userId: string, companyId: string) {
  await prisma.employer.upsert({
    where: { userId },
    update: { companyId },
    create: { userId, companyId },
  });
  await ensureEmployerRole(userId);
}

async function ensureUniqueSlug(base: string) {
  let slug = base;
  let counter = 2;
  while (true) {
    const existing = await prisma.company.findUnique({ where: { slug } });
    if (!existing) {
      return slug;
    }
    slug = `${base}-${counter++}`;
  }
}

async function linkExistingCompany(userId: string, companyId: string, slug: string, message: string): Promise<OnboardState> {
  await ensureEmployerLink(userId, companyId);
  revalidatePath('/employer/dashboard');
  revalidatePath(`/company/${slug}/`);
  return { status: 'linked', message };
}

export async function onboardCompany(_: OnboardState, formData: FormData): Promise<OnboardState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect('/employer/login?next=/employer/onboard');
  }

  const name = normalizeString(formData.get('name'));
  const customSlug = normalizeString(formData.get('slug'));
  const website = normalizeString(formData.get('website'));
  const logoUrl = normalizeString(formData.get('logoUrl'));

  if (!name) {
    return { status: 'error', message: 'Please provide a company name.' };
  }

  let slug = customSlug ?? slugify(name);

  const existing = await prisma.company.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });

  if (existing) {
    return linkExistingCompany(userId!, existing.id, existing.slug, 'That company already exists. You have been linked to it.');
  }

  if (!customSlug) {
    slug = await ensureUniqueSlug(slug);
  }

  try {
    const company = await prisma.company.create({
      data: { name, slug, website, logoUrl, verified: false },
    });
    await prisma.$transaction([
      prisma.employer.create({ data: { userId: userId!, companyId: company.id } }),
      prisma.user.update({ where: { id: userId! }, data: { role: 'EMPLOYER' as UserRole } }),
    ]);
    revalidatePath('/employer/dashboard');
    revalidatePath(`/company/${company.slug}/`);
    return { status: 'created', message: 'Company created. You can now manage roles.' };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const fallback = await prisma.company.findFirst({
        where: {
          OR: [{ name }, { slug }],
        },
      });
      if (fallback) {
        return linkExistingCompany(userId!, fallback.id, fallback.slug, 'That company already exists. You have been linked to it.');
      }
    }
    console.error('Employer onboarding failed', error);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }
}

export type EmployerJobState = { status: 'idle' | 'ok' | 'error'; message?: string; onboard?: string };

export async function createEmployerJob(
  _previousState: EmployerJobState,
  formData: FormData,
): Promise<EmployerJobState> {
  const { companyId } = await requireEmployer('/employer/jobs/new');
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { slug: true } });
  if (!company) {
    return { status: 'error', message: 'No company linked. Please onboard first.', onboard: '/employer/onboard' };
  }

  const title = normalizeString(formData.get('title'));
  const type = normalizeString(formData.get('type')) as JobType | null;
  const kind = (normalizeString(formData.get('kind')) as JobKind | null) ?? 'SCHEME';
  const description = normalizeString(formData.get('description'));
  const locations = toStringArray(formData.get('locations'));
  const sectors = toStringArray(formData.get('sectors'));
  const tags = toStringArray(formData.get('tags'));
  const applyUrl = normalizeString(formData.get('applyUrl'));
  const deadlineString = normalizeString(formData.get('deadline'));
  const deadline = parseDate(deadlineString);
  const sponsored = formData.get('sponsored') === 'on';

  if (!title || !type || !kind || !applyUrl) {
    return { status: 'error', message: 'Please fill in all required fields.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const slugBase = slugifyTitle(title);
      const slugValue = await uniqueJobSlug({
        tx,
        base: slugBase,
        type,
        sponsored,
        companyId,
      });
      await tx.job.create({
        data: {
          title,
          slug: slugValue,
          type,
          kind,
          status: 'DRAFT',
          companyId,
          description,
          locations,
          sectors,
          tags,
          applyUrl,
          deadline,
          sponsored,
          postedAt: new Date(),
        },
      });
    });
    revalidatePath('/employer/dashboard');
    revalidatePath(`/company/${company.slug}/`);
    return { status: 'ok' };
  } catch (error) {
    console.error('Employer job create failed', error);
    return { status: 'error', message: 'Could not create the job. Try again.' };
  }
}

export async function updateEmployerJob(formData: FormData) {
  const jobId = normalizeString(formData.get('jobId'));
  if (!jobId) return;
  const { companyId } = await requireEmployer(`/employer/jobs/${jobId}`);

  const title = normalizeString(formData.get('title'));
  const type = normalizeString(formData.get('type')) as JobType | null;
  const kind = (normalizeString(formData.get('kind')) as JobKind | null) ?? 'SCHEME';
  const description = normalizeString(formData.get('description'));
  const locations = toStringArray(formData.get('locations'));
  const sectors = toStringArray(formData.get('sectors'));
  const tags = toStringArray(formData.get('tags'));
  const applyUrl = normalizeString(formData.get('applyUrl'));
  const deadlineString = normalizeString(formData.get('deadline'));
  const deadline = parseDate(deadlineString);
  const sponsored = formData.get('sponsored') === 'on';

  if (!title || !type || !kind || !applyUrl) {
    return;
  }

  const existing = await prisma.job.findFirst({
    where: { id: jobId, companyId },
    include: { company: { select: { slug: true } } },
  });
  if (!existing) {
    redirect('/employer/dashboard');
  }

  const job = await prisma.$transaction(async (tx) => {
    const slugBase = slugifyTitle(title);
    const slugValue = await uniqueJobSlug({ tx, base: slugBase, type, sponsored, companyId, excludeId: jobId });
    return tx.job.update({
      where: { id: jobId },
      data: {
        title,
        slug: slugValue,
        type,
        kind,
        status: 'DRAFT',
        description,
        locations,
        sectors,
        tags,
        applyUrl,
        deadline,
        sponsored,
      },
      include: { company: { select: { slug: true } } },
    });
  });

  revalidateJob(
    {
      slug: job.slug,
      type: job.type,
      sponsored: job.sponsored,
      company: job.company ? { slug: job.company.slug } : null,
    },
    {
      slug: existing.slug,
      type: existing.type,
      sponsored: existing.sponsored,
      company: existing.company ? { slug: existing.company.slug } : null,
    },
  );
  redirect('/employer/dashboard');
}

export async function deleteEmployerJob(formData: FormData) {
  const jobId = normalizeString(formData.get('jobId'));
  if (!jobId) return;
  const { companyId } = await requireEmployer(`/employer/jobs/${jobId}`);
  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId },
    include: { company: { select: { slug: true } } },
  });
  if (!job) return;
  await prisma.job.delete({ where: { id: jobId } });
  const canonical = jobCanonicalPath({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : undefined,
  });
  revalidatePath('/employer/dashboard');
  revalidatePath(canonical);
  revalidatePath(`/${jobTypeToSlug(job.type)}/`);
  if (job.company?.slug) {
    revalidatePath(`/company/${job.company.slug}/`);
  }
}
