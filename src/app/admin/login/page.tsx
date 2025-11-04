import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import AuthLoginView from '@/components/AuthLoginView';
import PortalMismatch from '@/components/auth/PortalMismatch';
import { ADMIN_LOGIN, STUDENT_LOGIN, safeNext } from '@/lib/portal';

type SearchParams = Record<string, string | string[]>;

function getParam(params: SearchParams | undefined, key: string) {
  if (!params) return undefined;
  const value = params[key];
  return typeof value === 'string' ? value : undefined;
}

export default async function AdminLoginPage({ searchParams }: { searchParams?: SearchParams }) {
  const rawNext = getParam(searchParams, 'next') ?? getParam(searchParams, 'callbackUrl');
  const nextParam = safeNext(rawNext);
  const session = await auth();

  if (!session?.user) {
    return (
      <AuthLoginView
        portal="admin"
        title="Admin sign in"
        subtitle="Use an administrator account to access the console."
        defaultCallback={nextParam || '/admin'}
        showRegisterHint={false}
        notice="You will be redirected to the admin console after signing in."
        secondaryLink={{ href: STUDENT_LOGIN, label: 'Return to student login', prefix: 'Regular member?' }}
      />
    );
  }

  const sanitizedNext = nextParam || undefined;

  if (session.user.isAdmin) {
    redirect(nextParam || '/admin');
  }

  return <PortalMismatch portal="admin" callbackUrl={ADMIN_LOGIN} next={sanitizedNext} />;
}
