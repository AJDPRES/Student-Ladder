"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { jobCanonicalPath } from '@/lib/jobs/paths';

function buildLoginTarget(nextPath?: string) {
  const fallback = '/saved';
  const target = typeof nextPath === 'string' && nextPath.startsWith('/') ? nextPath : fallback;
  return `/login?next=${encodeURIComponent(target)}`;
}

async function requireStudentId(nextPath?: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect(buildLoginTarget(nextPath));
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });
  if (!user || user.role !== 'STUDENT') {
    redirect(buildLoginTarget(nextPath));
  }
  return user.id;
}

async function loadJob(jobId: string) {
  return prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, slug: true, type: true, sponsored: true, company: { select: { slug: true } } },
  });
}

function canonicalFromJob(job: { slug: string; type: string; sponsored: boolean; company: { slug: string } | null }) {
  return jobCanonicalPath({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : undefined,
  });
}

export async function saveJob(formData: FormData) {
  const jobId = (formData.get('jobId') as string | null)?.trim();
  if (!jobId) return;
  const job = await loadJob(jobId);
  if (!job) return;
  const canonical = canonicalFromJob(job);
  const userId = await requireStudentId(canonical);
  await prisma.jobSave.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: {},
    create: { userId, jobId },
  });
  revalidatePath(canonical);
  revalidatePath('/saved');
}

export async function unsaveJob(formData: FormData) {
  const jobId = (formData.get('jobId') as string | null)?.trim();
  if (!jobId) return;
  const job = await loadJob(jobId);
  if (!job) return;
  const canonical = canonicalFromJob(job);
  const userId = await requireStudentId(canonical);
  await prisma.jobSave.delete({ where: { userId_jobId: { userId, jobId } } }).catch(() => undefined);
  revalidatePath(canonical);
  revalidatePath('/saved');
}
