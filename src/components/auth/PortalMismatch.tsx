import Link from 'next/link';

import PortalSignOutButton from './PortalSignOutButton';

type Portal = 'student' | 'employer' | 'admin';

const HEADLINES: Record<Portal, string> = {
  student: 'Switch portal to continue',
  employer: 'Employer portal access required',
  admin: 'Administrator access required',
};

const DESCRIPTIONS: Record<Portal, string> = {
  student: 'You are signed in with a different portal. Sign out before continuing to the student experience.',
  employer: 'You are signed in with a different portal. Sign out before accessing employer tools.',
  admin: 'You are signed in with a different portal. Sign out before opening the admin console.',
};

function buildLoginLink(portal: Portal) {
  switch (portal) {
    case 'employer':
      return { href: '/employer/login', label: 'Employer login' };
    case 'admin':
      return { href: '/admin/login', label: 'Admin login' };
    default:
      return { href: '/login', label: 'Student login' };
  }
}

type PortalMismatchProps = {
  portal: Portal;
  callbackUrl: string;
  next?: string;
};

function appendNext(base: string, next?: string) {
  if (!next) return base;
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}next=${encodeURIComponent(next)}`;
}

export default function PortalMismatch({ portal, callbackUrl, next }: PortalMismatchProps) {
  const loginLink = buildLoginLink(portal);
  const loginHref = appendNext(loginLink.href, next);
  const signOutUrl = appendNext(callbackUrl, next);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{HEADLINES[portal]}</h1>
        <p className="auth-card__subtitle">{DESCRIPTIONS[portal]}</p>
        <div className="auth-card__form">
          <PortalSignOutButton callbackUrl={signOutUrl} />
        </div>
        <p className="auth-card__hint">
          After signing out, return to the{' '}
          <Link href={loginHref} className="auth-card__link">
            {loginLink.label}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
