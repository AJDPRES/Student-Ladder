import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

async function updateProfile(formData: FormData) {
  'use server';
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?next=/settings');
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });
  if (!user || user.role !== 'STUDENT') {
    redirect('/login?next=/settings');
  }
  const name = (formData.get('name') as string | null)?.trim() ?? null;
  const degree = (formData.get('degree') as string | null)?.trim() ?? null;
  const location = (formData.get('location') as string | null)?.trim() ?? null;
  const gradYearValue = formData.get('gradYear');
  const gradYear = gradYearValue && typeof gradYearValue === 'string' ? Number(gradYearValue) : null;
  const newsletter = formData.get('newsletter') === 'on';

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      degree,
      location,
      gradYear: Number.isFinite(gradYear) ? gradYear : null,
      newsletter,
    },
  });
}

async function changePassword(formData: FormData) {
  'use server';
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?next=/settings');
  }
  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('newPassword');
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') return;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, passwordHash: true, role: true },
  });
  if (!user || user.role !== 'STUDENT' || !user.passwordHash) {
    redirect('/login?next=/settings');
  }
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return;
  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?next=/settings');
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== 'STUDENT') {
    redirect('/login?next=/settings');
  }

  return (
    <main className="page page--settings">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Update your Student Ladder profile.</p>
        </div>
      </header>
      <section className="settings-grid">
        <form className="admin-form" action={updateProfile}>
          <h2>Profile</h2>
          <label className="admin-form__field">
            <span>Name</span>
            <input name="name" defaultValue={user.name ?? ''} />
          </label>
          <label className="admin-form__field">
            <span>Degree</span>
            <input name="degree" defaultValue={user.degree ?? ''} />
          </label>
          <label className="admin-form__field">
            <span>Graduation year</span>
            <input name="gradYear" type="number" defaultValue={user.gradYear ?? ''} />
          </label>
          <label className="admin-form__field">
            <span>Location</span>
            <input name="location" defaultValue={user.location ?? ''} />
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" name="newsletter" defaultChecked={user.newsletter ?? false} />
            <span>Receive newsletter</span>
          </label>
          <div className="admin-form__actions">
            <button className="chip" type="submit">Save profile</button>
          </div>
        </form>

        <form className="admin-form" action={changePassword}>
          <h2>Password</h2>
          <label className="admin-form__field">
            <span>Current password</span>
            <input name="currentPassword" type="password" required minLength={8} />
          </label>
          <label className="admin-form__field">
            <span>New password</span>
            <input name="newPassword" type="password" required minLength={8} />
          </label>
          <div className="admin-form__actions">
            <button className="chip" type="submit">Change password</button>
          </div>
        </form>
      </section>
    </main>
  );
}
