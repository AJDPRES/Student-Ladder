import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JobType } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { jobCanonicalPath, jobTypeLabel, slugToJobType } from '@/lib/jobs/paths';

const PAGE_SIZE = 20;
const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

type PageProps = {
  params: { slug: string };
  searchParams?: { page?: string };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const jobType = slugToJobType(params.slug);
  if (!jobType) return {};
  return {
    title: `${jobTypeLabel(jobType)} | The Student Ladder`,
    alternates: { canonical: `/${params.slug}/` },
  };
}

export default async function JobTypeLanding({ params, searchParams }: PageProps) {
  const jobType = slugToJobType(params.slug) as JobType | null;
  if (!jobType) {
    notFound();
  }

  const page = (() => {
    const value = Number.parseInt(searchParams?.page ?? '1', 10);
    return Number.isFinite(value) && value > 0 ? value : 1;
  })();
  const skip = (page - 1) * PAGE_SIZE;

  const jobs = await prisma.job.findMany({
    where: { status: 'PUBLISHED', type: jobType },
    include: { company: { select: { name: true, slug: true } } },
    orderBy: { postedAt: 'desc' },
    skip,
    take: PAGE_SIZE,
  });

  return (
    <main className="page page--public">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">{jobTypeLabel(jobType)}</h1>
          <p className="page-subtitle">Latest opportunities from The Student Ladder.</p>
        </div>
      </header>
      <section className="job-list">
        {jobs.length === 0 ? (
          <p>No published jobs found.</p>
        ) : (
          <ul className="job-cards">
            {jobs.map((job) => {
              const href = jobCanonicalPath({
                slug: job.slug,
                type: job.type,
                sponsored: job.sponsored,
                company: job.company ? { slug: job.company.slug } : undefined,
              });
              const companyName = job.company?.name ?? 'Independent';
              return (
                <li key={job.id} className="job-card">
                  <article>
                    <h2 className="job-card__title">
                      <Link href={href}>{job.title}</Link>
                    </h2>
                    <div className="job-card__meta">
                      <span>{companyName}</span>
                      <span>·</span>
                      <span>{DATE_FORMATTER.format(job.postedAt)}</span>
                    </div>
                    {job.locations?.length ? (
                      <p className="job-card__locations">{job.locations.join(', ')}</p>
                    ) : null}
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
