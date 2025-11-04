import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JobType } from '@prisma/client';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { jobCanonicalPath, jobTypeLabel, slugToJobType } from '@/lib/jobs/paths';
import SaveJobForm from '@/components/jobs/SaveJobForm';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

type PageProps = {
  params: { slug: string; job: string };
};

async function fetchJob(params: PageProps['params']) {
  const jobType = slugToJobType(params.slug) as JobType | null;
  if (!jobType) return null;
  const job = await prisma.job.findFirst({
    where: {
      status: 'PUBLISHED',
      type: jobType,
      slug: params.job,
      sponsored: false,
    },
    include: { company: { select: { name: true, slug: true } } },
  });
  return job;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const job = await fetchJob(params);
  if (!job) return {};
  const canonical = jobCanonicalPath({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : undefined,
  });
  return {
    title: `${job.title} | ${jobTypeLabel(job.type)} | The Student Ladder`,
    alternates: { canonical },
  };
}

export default async function EditorialJobPage({ params }: PageProps) {
  const [session, job] = await Promise.all([auth(), fetchJob(params)]);
  if (!job) {
    notFound();
  }

  const viewerId = session?.user?.email
    ? (await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } }))?.id
    : null;
  const saved = viewerId
    ? Boolean(
        await prisma.jobSave.findUnique({
          where: { userId_jobId: { userId: viewerId, jobId: job.id } },
        }),
      )
    : false;

  const canonical = jobCanonicalPath({
    slug: job.slug,
    type: job.type,
    sponsored: job.sponsored,
    company: job.company ? { slug: job.company.slug } : undefined,
  });
  const jobPostingJsonLd = buildJobPostingJsonLd(job, canonical);

  return (
    <main className="page page--public">
      <article className="job-detail">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
        />
        <header>
          <p className="job-detail__type">{jobTypeLabel(job.type)}</p>
          <h1>{job.title}</h1>
          <div className="job-detail__meta">
            {job.company && (
              <Link href={`/company/${job.company.slug}/`}>{job.company.name}</Link>
            )}
            <span>·</span>
            <span>Published {DATE_FORMATTER.format(job.postedAt)}</span>
            {job.deadline ? (
              <>
                <span>·</span>
                <span>Deadline {DATE_FORMATTER.format(job.deadline)}</span>
              </>
            ) : null}
          </div>
        </header>
        {job.locations?.length ? <p>Locations: {job.locations.join(', ')}</p> : null}
        {job.sectors?.length ? <p>Sectors: {job.sectors.join(', ')}</p> : null}
        {job.description && (
          <div className="job-detail__description" dangerouslySetInnerHTML={{ __html: job.description }} />
        )}
        <p>
          <a className="chip" href={job.applyUrl} target="_blank" rel="noreferrer">Apply now</a>
        </p>
        <SaveJobForm jobId={job.id} canonical={canonical} isSaved={saved} isAuthenticated={Boolean(viewerId)} />
        <p className="job-detail__canonical">Canonical URL: {canonical}</p>
      </article>
    </main>
  );
}

function buildJobPostingJsonLd(job: NonNullable<Awaited<ReturnType<typeof fetchJob>>>, canonical: string) {
  const locations = Array.isArray(job.locations) ? job.locations.filter(Boolean) : [];
  const sectors = Array.isArray(job.sectors) ? job.sectors.filter(Boolean) : [];
  const description = job.description ? job.description.replace(/<[^>]+>/g, '') : undefined;
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null;
  const baseSalary = hasSalary
    ? {
        '@type': 'MonetaryAmount',
        currency: job.currency ?? 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin ?? job.salaryMax ?? undefined,
          maxValue: job.salaryMax ?? job.salaryMin ?? undefined,
          unitText: 'YEAR',
        },
      }
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted: job.postedAt.toISOString(),
    validThrough: job.deadline ? job.deadline.toISOString() : undefined,
    employmentType: job.type,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.name ?? 'Independent',
    },
    jobLocation: locations.length
      ? locations.map((loc) => ({
          '@type': 'Place',
          address: { '@type': 'PostalAddress', addressLocality: loc },
        }))
      : undefined,
    industry: sectors,
    jobLocationType: locations.length === 0 ? 'TELECOMMUTE' : undefined,
    baseSalary,
    directApply: true,
    url: canonical,
    sameAs: canonical,
  };
}
