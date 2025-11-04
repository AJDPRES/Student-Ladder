import type { JobType } from '@prisma/client';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { jobTypeLabel, jobTypeToSlug } from '@/lib/jobs/paths';

import StudentNav from './NavView';
import EmployerNav from './EmployerNav';
import AdminNav from './AdminNav';

type Portal = 'student' | 'employer' | 'admin';
const JOB_TYPES: JobType[] = ['GRADUATE_SCHEME', 'INTERNSHIP', 'PLACEMENT', 'WORK_EXPERIENCE', 'APPRENTICESHIP'];

function extractPathname(): string {
  const hdrs = headers();
  const matched = hdrs.get('x-matched-path');
  if (matched) {
    return matched.startsWith('/') ? matched : `/${matched}`;
  }
  const invoked = hdrs.get('x-invoke-path');
  if (invoked) {
    return invoked.startsWith('/') ? invoked : `/${invoked}`;
  }
  const requestUrl = hdrs.get('next-url') ?? hdrs.get('x-url');
  if (requestUrl) {
    try {
      const parsed = new URL(requestUrl, 'http://localhost');
      return parsed.pathname || '/';
    } catch {
      /* ignore malformed values */
    }
  }
  return '/';
}

function inferPortal(pathname: string): Portal {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/employer')) return 'employer';
  return 'student';
}

export default async function NavShell() {
  const pathname = extractPathname();
  const portal = inferPortal(pathname);

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const role = session?.user?.role ?? null;
  const isAdmin = Boolean(session?.user?.isAdmin);

  if (portal === 'admin') {
    const state = isAdmin ? 'admin' : session ? 'other' : 'guest';
    return <AdminNav state={state} />;
  }

  if (portal === 'employer') {
    const state: 'guest' | 'employer' | 'student' | 'admin' =
      role === 'EMPLOYER' ? 'employer' : isAdmin ? 'admin' : session ? 'student' : 'guest';
    const employer = userId
      ? await prisma.employer.findUnique({
          where: { userId },
          select: { company: { select: { name: true, slug: true } } },
        })
      : null;
    return <EmployerNav state={state} company={employer?.company ?? null} />;
  }

  const jobTypes = JOB_TYPES.map((type) => ({
    slug: jobTypeToSlug(type),
    label: jobTypeLabel(type),
  }));
  const state: 'guest' | 'student' | 'employer' | 'admin' =
    !session ? 'guest' : role === 'EMPLOYER' ? 'employer' : isAdmin ? 'admin' : 'student';
  return <StudentNav state={state} jobTypes={jobTypes} />;
}
