import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import { updateEmployerJob, deleteEmployerJob } from '@/app/employer/actions';

import JobForm from '../shared/JobForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PageProps = { params: { id: string } };

export default async function EditEmployerJobPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/employer/login?next=${encodeURIComponent(`/employer/jobs/${params.id}`)}`);
  }
  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
    select: { companyId: true },
  });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'EMPLOYER') {
    redirect(`/employer/login?next=${encodeURIComponent(`/employer/jobs/${params.id}`)}`);
  }
  if (!employer) {
    redirect('/employer/onboard');
  }

  const job = await prisma.job.findFirst({
    where: { id: params.id, companyId: employer.companyId },
  });
  if (!job) {
    redirect('/employer/dashboard');
  }

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Edit job</h1>
          <p className="page-subtitle">Only draft jobs can be edited here.</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/employer/login" />
        </div>
      </header>
      <section className="admin-panel">
        <article className="admin-user-card">
          <JobForm action={updateEmployerJob} job={job} />
          <form className="admin-form admin-form--danger" action={deleteEmployerJob}>
            <input type="hidden" name="jobId" value={job.id} />
            <div className="admin-form__actions">
              <button type="submit" className="chip chip--danger">Delete job</button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}
