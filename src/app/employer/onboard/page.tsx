import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';

import OnboardForm from './OnboardForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function EmployerOnboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/employer/login?next=/employer/onboard');
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, employer: { select: { company: { select: { name: true, slug: true } } } } },
  });
  if (user?.role === 'EMPLOYER' && user.employer?.company) {
    return (
      <main className="page page--admin">
        <header className="page-header">
          <div className="page-header__titles">
            <h1 className="page-title">Employer onboarding</h1>
            <p className="page-subtitle">You are already linked to {user.employer.company.name}.</p>
          </div>
          <div className="page-header__actions">
            <ThemeToggle />
            <LogoutButton callbackUrl="/employer/login" />
          </div>
        </header>
        <section className="admin-panel">
          <article className="admin-user-card">
            <p>You can manage your jobs from the employer dashboard.</p>
            <Link className="chip" href="/employer/dashboard">
              Go to dashboard
            </Link>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Employer onboarding</h1>
          <p className="page-subtitle">Create your company profile to start posting roles.</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/employer/login" />
        </div>
      </header>
      <section className="admin-panel">
        <article className="admin-user-card">
          <h2 className="admin-user-card__title">Company details</h2>
          <OnboardForm />
        </article>
      </section>
    </main>
  );
}
