import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import EmployerJobForm from './EmployerJobForm';

import JobForm from '../shared/JobForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function NewEmployerJobPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/employer/login?next=/employer/jobs/new');
  }
  const employer = await prisma.employer.findUnique({ where: { userId: session.user.id } });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'EMPLOYER') {
    redirect('/employer/login?next=/employer/jobs/new');
  }
  if (!employer) {
    redirect('/employer/onboard');
  }

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">New job</h1>
          <p className="page-subtitle">Draft a role for review. Jobs remain Draft until approved.</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/employer/login" />
        </div>
      </header>
      <section className="admin-panel">
        <EmployerJobForm />
      </section>
    </main>
  );
}
