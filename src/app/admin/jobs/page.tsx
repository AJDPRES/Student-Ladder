import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import type { JobKind, JobStatus, JobType } from '@prisma/client';

import { auth } from '@/auth';
import { prisma, prismaReady } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/env';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import MissingDatabaseNotice from '@/components/MissingDatabaseNotice';
import CopyButton from '@/components/CopyButton';
import StatusToggle from '@/components/admin/StatusToggle';
import { jobCanonicalPath, jobTypeToSlug } from '@/lib/jobs/paths';
import { slugifyTitle, uniqueJobSlug } from '@/lib/slug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const JOB_TYPES: JobType[] = ['WORK_EXPERIENCE', 'APPRENTICESHIP', 'INTERNSHIP', 'PLACEMENT', 'GRADUATE_SCHEME'];
const JOB_KINDS: JobKind[] = ['SCHEME', 'LIVE'];

function formatError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof Error && typeof error.message === 'string') return error.message;
  if (typeof error === 'string') return error;
  return undefined;
}

function renderDatabaseNotice(kind: 'missing' | 'unreachable', error?: unknown) {
  const hint = IS_PRODUCTION ? undefined : formatError(error);
  return (
    <main className="page page--admin">
      <MissingDatabaseNotice kind={kind} hint={hint} />
    </main>
  );
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!user?.isAdmin) {
    redirect('/login');
  }
  return session.user.id;
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

function toNumber(value: FormDataEntryValue | null): number | null {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function toDate(value: FormDataEntryValue | null): Date | null {
  const text = normalizeString(value);
  if (!text) return null;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toBoolean(value: FormDataEntryValue | null): boolean {
  return value === 'on';
}

type JobRevalidationRecord = {
  slug: string;
  type: JobType;
  sponsored: boolean;
  company: { slug: string } | null;
};

function buildJobRevalidationMeta(job: JobRevalidationRecord) {
  const canonical = jobCanonicalPath({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : undefined,
  });
  const typePath = `/${jobTypeToSlug(job.type)}/`;
  const companyPath = job.company?.slug ? `/company/${job.company.slug}/` : null;
  return { canonical, typePath, companyPath };
}

function revalidateJobPaths(job: JobRevalidationRecord, previous?: JobRevalidationRecord) {
  const nextMeta = buildJobRevalidationMeta(job);
  revalidatePath('/admin/jobs');
  revalidatePath(nextMeta.canonical);
  revalidatePath(nextMeta.typePath);
  if (nextMeta.companyPath) {
    revalidatePath(nextMeta.companyPath);
  }

  if (previous) {
    const prevMeta = buildJobRevalidationMeta(previous);
    if (prevMeta.canonical !== nextMeta.canonical) {
      revalidatePath(prevMeta.canonical);
    }
    if (prevMeta.typePath !== nextMeta.typePath) {
      revalidatePath(prevMeta.typePath);
    }
    if (prevMeta.companyPath && prevMeta.companyPath !== nextMeta.companyPath) {
      revalidatePath(prevMeta.companyPath);
    }
  }
}

async function updateJobStatus(formData: FormData) {
  'use server';
  await requireAdmin();
  const jobId = normalizeString(formData.get('jobId'));
  const nextStatus = normalizeString(formData.get('status')) as JobStatus | null;
  const allowed: JobStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
  if (!jobId || !nextStatus || !allowed.includes(nextStatus)) {
    return;
  }

  const job = await prisma.job.update({
    where: { id: jobId },
    data: { status: nextStatus },
    include: { company: { select: { slug: true } } },
  });

  revalidateJobPaths({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : null,
  });
}

async function createJob(formData: FormData) {
  'use server';
  await requireAdmin();
  const title = normalizeString(formData.get('title'));
  const slug = normalizeString(formData.get('slug'));
  const type = normalizeString(formData.get('type')) as JobType | null;
  const kind = (normalizeString(formData.get('kind')) as JobKind | null) ?? 'SCHEME';
  const status = (normalizeString(formData.get('status')) as JobStatus | null) ?? 'PUBLISHED';
  const companyId = normalizeString(formData.get('companyId'));
  const description = normalizeString(formData.get('description'));
  const applyUrl = normalizeString(formData.get('applyUrl'));
  if (!title || !slug || !type || !companyId || !applyUrl) return;

  const locations = toStringArray(formData.get('locations'));
  const sectors = toStringArray(formData.get('sectors'));
  const tags = toStringArray(formData.get('tags'));
  const salaryMin = toNumber(formData.get('salaryMin'));
  const salaryMax = toNumber(formData.get('salaryMax'));
  const currency = normalizeString(formData.get('currency'));
  const deadline = toDate(formData.get('deadline'));
  const postedAt = toDate(formData.get('postedAt')) ?? new Date();
  const sponsored = toBoolean(formData.get('sponsored'));
  const verified = toBoolean(formData.get('verified'));

  const job = await prisma.$transaction(async (tx) => {
    const slugBase = slugifyTitle(title);
    const slugValue = await uniqueJobSlug({ tx, base: slugBase, type, sponsored, companyId });
    return tx.job.create({
      data: {
        title,
        slug: slugValue,
        type,
        kind,
        status,
        companyId,
        description,
        applyUrl,
        locations,
        sectors,
        tags,
        salaryMin,
        salaryMax,
        currency,
        deadline,
        postedAt,
        sponsored,
        verified,
      },
      include: { company: { select: { slug: true } } },
    });
  });

  revalidateJobPaths(job);
}

async function updateJob(formData: FormData) {
  'use server';
  await requireAdmin();
  const jobId = normalizeString(formData.get('jobId'));
  if (!jobId) return;
  const title = normalizeString(formData.get('title'));
  const slug = normalizeString(formData.get('slug'));
  const type = normalizeString(formData.get('type')) as JobType | null;
  const kind = (normalizeString(formData.get('kind')) as JobKind | null) ?? 'SCHEME';
  const status = (normalizeString(formData.get('status')) as JobStatus | null) ?? 'PUBLISHED';
  const companyId = normalizeString(formData.get('companyId'));
  const description = normalizeString(formData.get('description'));
  const applyUrl = normalizeString(formData.get('applyUrl'));
  if (!title || !slug || !type || !companyId || !applyUrl) return;

  const locations = toStringArray(formData.get('locations'));
  const sectors = toStringArray(formData.get('sectors'));
  const tags = toStringArray(formData.get('tags'));
  const salaryMin = toNumber(formData.get('salaryMin'));
  const salaryMax = toNumber(formData.get('salaryMax'));
  const currency = normalizeString(formData.get('currency'));
  const deadline = toDate(formData.get('deadline'));
  const postedAt = toDate(formData.get('postedAt')) ?? new Date();
  const sponsored = toBoolean(formData.get('sponsored'));
  const verified = toBoolean(formData.get('verified'));

  const previous = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: { select: { slug: true } } },
  });
  if (!previous) return;

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
        status,
        companyId,
        description,
        applyUrl,
        locations,
        sectors,
        tags,
        salaryMin,
        salaryMax,
        currency,
        deadline,
        postedAt,
        sponsored,
        verified,
      },
      include: { company: { select: { slug: true } } },
    });
  });

  revalidateJobPaths(job, previous);
}

async function deleteJob(formData: FormData) {
  'use server';
  await requireAdmin();
  const jobId = normalizeString(formData.get('jobId'));
  if (!jobId) return;
  const job = await prisma.job.findUnique({
    where: { id: jobId },
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
  revalidatePath('/admin/jobs');
  revalidatePath(canonical);
  revalidatePath(`/${jobTypeToSlug(job.type)}/`);
  if (job.company?.slug) {
    revalidatePath(`/company/${job.company.slug}/`);
  }
}

type JobsPageProps = {
  searchParams?: { status?: string };
};

export default async function AdminJobsPage({ searchParams }: JobsPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  if (!hasDatabaseUrl()) {
    return renderDatabaseNotice('missing');
  }
  try {
    await prismaReady();
  } catch (error) {
    console.error('Prisma failed to initialize for admin jobs', error);
    return renderDatabaseNotice('unreachable', error);
  }
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!currentUser?.isAdmin) {
    redirect('/login');
  }

  const statusFilterRaw = searchParams?.status;
  const statusFilter = statusFilterRaw && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(statusFilterRaw)
    ? (statusFilterRaw as JobStatus)
    : undefined;

  let companies;
  let jobs;
  try {
    companies = await prisma.company.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true } });
    jobs = await prisma.job.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      orderBy: { postedAt: 'desc' },
      include: { company: { select: { id: true, name: true, slug: true } } },
    });
  } catch (error) {
    console.error('Failed to load jobs data', error);
    return renderDatabaseNotice('unreachable', error);
  }

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Jobs</h1>
          <p className="page-subtitle">Create, edit, and verify listings.</p>
        </div>
        <div className="page-header__actions">
          <div className="admin-filter-chips">
            <Link
              className={`chip ${statusFilter ? 'chip--ghost' : 'chip--primary'}`}
              href="/admin/jobs"
            >
              All
            </Link>
            <Link
              className={`chip ${statusFilter === 'DRAFT' ? 'chip--primary' : 'chip--ghost'}`}
              href="/admin/jobs?status=DRAFT"
            >
              Drafts
            </Link>
          </div>
          <ThemeToggle />
          <LogoutButton callbackUrl="/admin/login" />
        </div>
      </header>

      <section className="admin-panel">
        <article className="admin-user-card">
          <h2 className="admin-user-card__title">Create job</h2>
          <JobForm companies={companies} action={createJob} />
        </article>

        <div className="admin-user-list">
          {jobs.map((job) => (
            <article key={job.id} className="admin-user-card">
              <header className="admin-user-card__header">
                <div>
                  <div className="admin-user-card__title">
                    <span className="admin-user-card__email">{job.title}</span>
                    {job.status === 'DRAFT' && job.company?.name && (
                      <span className="admin-badge">Draft · {job.company.name}</span>
                    )}
                    {job.verified && <span className="admin-badge">Verified</span>}
                    {job.sponsored && <span className="admin-badge">Sponsored</span>}
                  </div>
                  <div className="admin-meta">
                    <span>Company: {job.company?.name ?? '—'}</span>
                    <span>Type: {job.type}</span>
                    <span>Status: {job.status}</span>
                    <span>Posted: {DATE_FORMATTER.format(job.postedAt)}</span>
                  </div>
                  <JobStatusActions job={job} />
                </div>
              </header>
              <JobForm
                companies={companies}
                action={updateJob}
                job={job}
                canonical={jobCanonicalPath({
                  slug: job.slug,
                  type: job.type,
                  sponsored: job.sponsored,
                  company: job.company ? { slug: job.company.slug } : undefined,
                })}
              />
              <form className="admin-form admin-form--danger" action={deleteJob}>
                <input type="hidden" name="jobId" value={job.id} />
                <div className="admin-form__actions">
                  <button type="submit" className="chip chip--danger">Delete job</button>
                </div>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

type JobFormJob = {
  id: string;
  title: string;
  slug: string;
  type: JobType;
  kind: JobKind;
  status: JobStatus;
  companyId: string;
  description: string | null;
  applyUrl: string;
  locations: string[];
  sectors: string[];
  tags: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  deadline: Date | null;
  postedAt: Date;
  sponsored: boolean;
  verified: boolean;
};

type JobFormProps = {
  companies: { id: string; name: string }[];
  action: (formData: FormData) => Promise<void>;
  job?: JobFormJob;
  canonical?: string;
};

function StatusButton({ jobId, nextStatus, label, variant }: { jobId: string; nextStatus: JobStatus; label: string; variant?: 'primary' | 'danger' | 'ghost' }) {
  const className = variant === 'danger' ? 'chip chip--danger' : variant === 'primary' ? 'chip chip--primary' : 'chip chip--ghost';
  return (
    <form action={updateJobStatus}>
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="status" value={nextStatus} />
      <button type="submit" className={className}>{label}</button>
    </form>
  );
}

function JobStatusActions({ job }: { job: JobFormJob }) {
  return (
    <div className="admin-status-actions">
      {job.status !== 'PUBLISHED' && (
        <StatusButton jobId={job.id} nextStatus="PUBLISHED" label="Publish" variant="primary" />
      )}
      {job.status === 'PUBLISHED' && (
        <StatusButton jobId={job.id} nextStatus="DRAFT" label="Unpublish" variant="ghost" />
      )}
      {job.status === 'ARCHIVED' ? (
        <StatusButton jobId={job.id} nextStatus="DRAFT" label="Restore draft" variant="ghost" />
      ) : (
        <StatusButton jobId={job.id} nextStatus="ARCHIVED" label="Archive" variant="danger" />
      )}
    </div>
  );
}

function formatList(values?: string[]): string {
  if (!values || values.length === 0) return '';
  return values.join(', ');
}

function toDateValue(value?: Date | null): string {
  if (!value) return '';
  return value.toISOString().slice(0, 10);
}

function JobForm({ companies, action, job, canonical }: JobFormProps) {
  const statusDefault = (job?.status as JobStatus | undefined) ?? 'PUBLISHED';
  return (
    <form className="admin-form" action={action}>
      {job ? <input type="hidden" name="jobId" value={job.id} /> : null}
      <label className="admin-form__field admin-form__field--required">
        <span>Title</span>
        <input name="title" defaultValue={job?.title ?? ''} required aria-required="true" />
      </label>
      <p className="admin-form__hint">Slug and canonical URL are generated automatically.</p>
      <label className="admin-form__field admin-form__field--required">
        <span>Type</span>
        <select name="type" defaultValue={job?.type ?? JOB_TYPES[JOB_TYPES.length - 1]} required aria-required="true">
          {JOB_TYPES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="admin-form__field">
        <span>Kind</span>
        <select name="kind" defaultValue={job?.kind ?? 'SCHEME'}>
          {JOB_KINDS.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="admin-form__field admin-form__field--required">
        <span>Status</span>
        <StatusToggle name="status" defaultValue={statusDefault} />
      </label>
      <label className="admin-form__field admin-form__field--required">
        <span>Company</span>
        <select name="companyId" defaultValue={job?.companyId ?? ''} required aria-required="true">
          <option value="" disabled>Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </label>
      <label className="admin-form__field">
        <span>Description</span>
        <textarea name="description" defaultValue={job?.description ?? ''} rows={3} />
      </label>
      <label className="admin-form__field admin-form__field--required">
        <span>Apply URL</span>
        <input name="applyUrl" type="url" defaultValue={job?.applyUrl ?? ''} required aria-required="true" placeholder="https://" />
      </label>
      <label className="admin-form__field">
        <span>Locations (comma separated)</span>
        <input name="locations" defaultValue={formatList(job?.locations)} />
      </label>
      <label className="admin-form__field">
        <span>Sectors (comma separated)</span>
        <input name="sectors" defaultValue={formatList(job?.sectors)} />
      </label>
      <label className="admin-form__field">
        <span>Tags (comma separated)</span>
        <input name="tags" defaultValue={formatList(job?.tags)} />
      </label>
      <label className="admin-form__field">
        <span>Salary Min</span>
        <input name="salaryMin" type="number" defaultValue={job?.salaryMin ?? ''} />
      </label>
      <label className="admin-form__field">
        <span>Salary Max</span>
        <input name="salaryMax" type="number" defaultValue={job?.salaryMax ?? ''} />
      </label>
      <label className="admin-form__field">
        <span>Currency</span>
        <input name="currency" defaultValue={job?.currency ?? ''} />
      </label>
      <label className="admin-form__field">
        <span>Deadline</span>
        <input name="deadline" type="date" defaultValue={toDateValue(job?.deadline)} />
      </label>
      <label className="admin-form__field">
        <span>Posted At</span>
        <input name="postedAt" type="date" defaultValue={toDateValue(job?.postedAt)} />
      </label>
      <label className="admin-checkbox">
        <input type="checkbox" name="sponsored" defaultChecked={job?.sponsored ?? false} />
        <span>Sponsored</span>
      </label>
      <label className="admin-checkbox">
        <input type="checkbox" name="verified" defaultChecked={job?.verified ?? false} />
        <span>Verified</span>
      </label>
      {canonical && (
        <div className="admin-form__canonical">
          <div className="admin-form__canonical-info">
            <span className="admin-form__canonical-label">Canonical URL</span>
            <code>{canonical}</code>
          </div>
          <CopyButton value={canonical} label="Copy URL" />
        </div>
      )}
      <div className="admin-form__actions">
        <button type="submit" className="chip">{job ? 'Save job' : 'Create job'}</button>
      </div>
    </form>
  );
}
