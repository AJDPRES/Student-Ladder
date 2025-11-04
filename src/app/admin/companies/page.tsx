import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { prisma, prismaReady } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/env';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import MissingDatabaseNotice from '@/components/MissingDatabaseNotice';
import { jobCanonicalPath, jobTypeToSlug } from '@/lib/jobs/paths';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

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

function toBoolean(value: FormDataEntryValue | null): boolean {
  return value === 'on';
}

async function revalidateCompanyJobs(companyId: string) {
  const jobs = await prisma.job.findMany({
    where: { companyId, status: 'PUBLISHED' },
    select: {
      slug: true,
      type: true,
      sponsored: true,
      company: { select: { slug: true } },
    },
  });
  const seenTypePaths = new Set<string>();
  for (const job of jobs) {
    const canonical = jobCanonicalPath({
      slug: job.slug,
      type: job.type,
      sponsored: job.sponsored,
      company: job.company ? { slug: job.company.slug } : undefined,
    });
    revalidatePath(canonical);
    const typePath = `/${jobTypeToSlug(job.type)}/`;
    if (!seenTypePaths.has(typePath)) {
      seenTypePaths.add(typePath);
      revalidatePath(typePath);
    }
  }
}

async function createCompany(formData: FormData) {
  'use server';
  await requireAdmin();
  const name = normalizeString(formData.get('name'));
  const slug = normalizeString(formData.get('slug'));
  const website = normalizeString(formData.get('website'));
  const logoUrl = normalizeString(formData.get('logoUrl'));
  const verified = toBoolean(formData.get('verified'));
  if (!name || !slug) {
    return;
  }
  const company = await prisma.company.create({
    data: { name, slug, website, logoUrl, verified },
    select: { id: true, slug: true },
  });
  revalidatePath('/admin/companies');
  revalidatePath(`/company/${company.slug}/`);
}

async function updateCompany(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = normalizeString(formData.get('companyId'));
  const name = normalizeString(formData.get('name'));
  const slug = normalizeString(formData.get('slug'));
  const website = normalizeString(formData.get('website'));
  const logoUrl = normalizeString(formData.get('logoUrl'));
  const verified = toBoolean(formData.get('verified'));
  if (!id || !name || !slug) return;
  const previous = await prisma.company.findUnique({ where: { id }, select: { slug: true } });
  if (!previous) return;
  await prisma.company.update({
    where: { id },
    data: { name, slug, website, logoUrl, verified },
  });
  revalidatePath('/admin/companies');
  revalidatePath(`/company/${slug}/`);
  if (previous.slug !== slug) {
    revalidatePath(`/company/${previous.slug}/`);
  }
  await revalidateCompanyJobs(id);
}

export default async function AdminCompaniesPage() {
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
    console.error('Prisma failed to initialize for admin companies', error);
    return renderDatabaseNotice('unreachable', error);
  }
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!currentUser?.isAdmin) {
    redirect('/login');
  }

  let companies;
  try {
    companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { jobs: true } } },
    });
  } catch (error) {
    console.error('Failed to load companies', error);
    return renderDatabaseNotice('unreachable', error);
  }

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle">Manage publishers and their metadata.</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/admin/login" />
        </div>
      </header>

      <section className="admin-panel">
        <article className="admin-user-card">
          <h2 className="admin-user-card__title">Create company</h2>
          <form className="admin-form" action={createCompany}>
            <label className="admin-form__field">
              <span>Name</span>
              <input name="name" required />
            </label>
            <label className="admin-form__field">
              <span>Slug</span>
              <input name="slug" required />
            </label>
            <label className="admin-form__field">
              <span>Website</span>
              <input name="website" type="url" placeholder="https://" />
            </label>
            <label className="admin-form__field">
              <span>Logo URL</span>
              <input name="logoUrl" type="url" placeholder="https://" />
            </label>
            <label className="admin-checkbox">
              <input type="checkbox" name="verified" />
              <span>Verified</span>
            </label>
            <div className="admin-form__actions">
              <button type="submit" className="chip">Create</button>
            </div>
          </form>
        </article>

        <div className="admin-user-list">
          {companies.map((company) => (
            <article key={company.id} className="admin-user-card">
              <header className="admin-user-card__header">
                <div>
                  <div className="admin-user-card__title">
                    <span className="admin-user-card__email">{company.name}</span>
                    {company.verified && <span className="admin-badge">Verified</span>}
                  </div>
                  <div className="admin-meta">
                    <span>Slug: {company.slug}</span>
                    <span>Jobs: {company._count.jobs}</span>
                    <span>Created: {DATE_FORMATTER.format(company.createdAt)}</span>
                  </div>
                </div>
              </header>
              <form className="admin-form" action={updateCompany}>
                <input type="hidden" name="companyId" value={company.id} />
                <label className="admin-form__field">
                  <span>Name</span>
                  <input name="name" defaultValue={company.name} required />
                </label>
                <label className="admin-form__field">
                  <span>Slug</span>
                  <input name="slug" defaultValue={company.slug} required />
                </label>
                <label className="admin-form__field">
                  <span>Website</span>
                  <input name="website" type="url" defaultValue={company.website ?? ''} />
                </label>
                <label className="admin-form__field">
                  <span>Logo URL</span>
                  <input name="logoUrl" type="url" defaultValue={company.logoUrl ?? ''} />
                </label>
                <label className="admin-checkbox">
                  <input type="checkbox" name="verified" defaultChecked={company.verified} />
                  <span>Verified</span>
                </label>
                <div className="admin-form__actions">
                  <button type="submit" className="chip">Save</button>
                </div>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
