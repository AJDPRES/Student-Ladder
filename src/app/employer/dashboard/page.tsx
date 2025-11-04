import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function EmployerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/employer/login?next=/employer/dashboard');
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'EMPLOYER') {
    redirect('/employer/login?next=/employer/dashboard');
  }
  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          verified: true,
          jobs: {
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, status: true, slug: true, type: true, updatedAt: true },
          },
        },
      },
    },
  });
  if (!employer) {
    redirect('/employer/onboard');
  }

  const { company } = employer;

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Employer dashboard</h1>
          <p className="page-subtitle">Manage {company.name}</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/employer/login" />
        </div>
      </header>

      <section className="admin-panel">
        <article className="admin-user-card">
          <header className="admin-user-card__header">
            <div>
              <div className="admin-user-card__title">
                <span className="admin-user-card__email">{company.name}</span>
                {company.verified && <span className="admin-badge">Verified</span>}
              </div>
              <div className="admin-meta">
                <span>Slug: {company.slug}</span>
                <span>Jobs: {company.jobs.length}</span>
              </div>
            </div>
            <Link className="chip" href="/employer/jobs/new">New job</Link>
          </header>
          <div className="admin-user-card__body">
            {company.jobs.length === 0 ? (
              <p>You have not created any jobs yet.</p>
            ) : (
              <ul className="job-cards">
                {company.jobs.map((job) => (
                  <li key={job.id} className="job-card">
                    <article>
                      <header className="admin-user-card__header">
                        <div>
                          <div className="admin-user-card__title">
                            <span className="admin-user-card__email">{job.title}</span>
                            <span className="admin-badge">{job.status}</span>
                          </div>
                          <div className="admin-meta">
                            <span>Slug: {job.slug}</span>
                            <span>Type: {job.type}</span>
                            <span>Updated: {new Date(job.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link className="chip" href={`/employer/jobs/${job.id}`}>Edit</Link>
                      </header>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
