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

function extractNotice(searchParams?: SearchParams) {
  const get = (key: string) => getParam(searchParams, key);
  if (get('verified') === '1') return 'Email verified. You can now sign in.';
  if (get('verify') === 'sent') return 'We sent you a verification code. Check your inbox.';
  if (get('registered') === '1') return 'Account already exists. Please sign in.';
  if (get('error') === 'expired_token') return 'Verification link expired. Request a new code.';
  return undefined;
}

export default async function LoginPage({ searchParams }: { searchParams?: SearchParams }) {
  const notice = extractNotice(searchParams);
  const rawNext = getParam(searchParams, 'next') ?? getParam(searchParams, 'callbackUrl');
  const nextParam = safeNext(rawNext);
  const session = await auth();

  if (!session?.user) {
    return (
      <AuthLoginView
        portal="student"
        defaultCallback={nextParam || '/'}
        notice={notice}
        secondaryLink={{ href: EMPLOYER_LOGIN, label: 'Switch to employer login', prefix: 'Hiring?' }}
      />
    );
  }

  const sanitizedNext = nextParam || undefined;

  if (session.user.isAdmin) {
    return <PortalMismatch portal="student" callbackUrl={STUDENT_LOGIN} next={sanitizedNext} />;
  }

  if (session.user.role === 'EMPLOYER') {
    return <PortalMismatch portal="student" callbackUrl={STUDENT_LOGIN} next={sanitizedNext} />;
  }

  if (session.user.role === 'STUDENT') {
    redirect(nextParam || '/');
  }

  return <PortalMismatch portal="student" callbackUrl={STUDENT_LOGIN} next={sanitizedNext} />;
}
