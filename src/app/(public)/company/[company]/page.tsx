import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { jobCanonicalPath, jobTypeLabel } from '@/lib/jobs/paths';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

type PageProps = {
  params: { company: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const company = await prisma.company.findUnique({ where: { slug: params.company }, select: { name: true } });
  if (!company) return {};
  return {
    title: `${company.name} | Companies | The Student Ladder`,
    alternates: { canonical: `/company/${params.company}/` },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const company = await prisma.company.findUnique({
    where: { slug: params.company },
    select: {
      id: true,
      name: true,
      website: true,
      verified: true,
      jobs: {
        where: { status: 'PUBLISHED' },
        orderBy: { postedAt: 'desc' },
        include: { company: { select: { slug: true } } },
      },
    },
  });
  if (!company) {
    notFound();
  }

  return (
    <main className="page page--public">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">{company.name}</h1>
          {company.website && (
            <a href={company.website} target="_blank" rel="noreferrer">Visit website</a>
          )}
        </div>
      </header>
      <section className="job-list">
        {company.jobs.length === 0 ? (
          <p>No published roles yet.</p>
        ) : (
          <ul className="job-cards">
            {company.jobs.map((job) => {
              const href = jobCanonicalPath({
                slug: job.slug,
                type: job.type,
                sponsored: job.sponsored,
                company: { slug: params.company },
              });
              return (
                <li key={job.id} className="job-card">
                  <article>
                    <h2 className="job-card__title">
                      <Link href={href}>{job.title}</Link>
                    </h2>
                    <div className="job-card__meta">
                      <span>{jobTypeLabel(job.type)}</span>
                      <span>·</span>
                      <span>{DATE_FORMATTER.format(job.postedAt)}</span>
                    </div>
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
