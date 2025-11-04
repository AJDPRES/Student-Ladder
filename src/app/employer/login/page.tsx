import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import AuthLoginView from '@/components/AuthLoginView';
import PortalMismatch from '@/components/auth/PortalMismatch';
import { EMPLOYER_LOGIN, STUDENT_LOGIN, safeNext } from '@/lib/portal';

type SearchParams = Record<string, string | string[]>;

function getParam(params: SearchParams | undefined, key: string) {
  if (!params) return undefined;
  const value = params[key];
  return typeof value === 'string' ? value : undefined;
}

export default async function EmployerLoginPage({ searchParams }: { searchParams?: SearchParams }) {
  const rawNext = getParam(searchParams, 'next') ?? getParam(searchParams, 'callbackUrl');
  const nextParam = safeNext(rawNext);
  const session = await auth();

  if (!session?.user) {
    return (
      <AuthLoginView
        portal="employer"
        title="Employer sign in"
        subtitle="Access your employer dashboard to manage roles."
        defaultCallback={nextParam || '/employer/dashboard'}
        showRegisterHint={false}
        notice="Need to onboard? Complete your company profile after signing in."
        secondaryLink={{ href: STUDENT_LOGIN, label: 'Student login', prefix: 'Looking for opportunities?' }}
      />
    );
  }

  const sanitizedNext = nextParam || undefined;

  if (session.user.role === 'EMPLOYER') {
    redirect(nextParam || '/employer/dashboard');
  }

  return <PortalMismatch portal="employer" callbackUrl={EMPLOYER_LOGIN} next={sanitizedNext} />;
}
