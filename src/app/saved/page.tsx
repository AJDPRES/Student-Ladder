import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { jobCanonicalPath } from '@/lib/jobs/paths';
import { unsaveJob } from '@/app/jobs/actions';

export const dynamic = 'force-dynamic';

export default async function SavedJobsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?next=/saved');
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, role: true } });
  if (!user || user.role !== 'STUDENT') {
    redirect('/login?next=/saved');
  }

  const saves = await prisma.jobSave.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      job: {
        include: { company: { select: { slug: true, name: true } } },
      },
    },
  });

  return (
    <main className="page page--saved">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Saved jobs</h1>
          <p className="page-subtitle">Quick access to your shortlist.</p>
        </div>
      </header>
      <section className="job-list">
        {saves.length === 0 ? (
          <p>You haven’t saved any jobs yet.</p>
        ) : (
          <ul className="job-cards">
            {saves.map((save) => {
              const job = save.job;
              if (!job) return null;
              const href = jobCanonicalPath({
                slug: job.slug,
                type: job.type,
                sponsored: job.sponsored,
                company: job.company ? { slug: job.company.slug } : undefined,
              });
              return (
                <li key={`${save.userId}-${save.jobId}`} className="job-card">
                  <article>
                    <h2 className="job-card__title">
                      <Link href={href}>{job.title}</Link>
                    </h2>
                    <div className="job-card__meta">
                      <span>{job.company?.name ?? 'Independent'}</span>
                    </div>
                    <form action={unsaveJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button className="chip" type="submit">Remove</button>
                    </form>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
