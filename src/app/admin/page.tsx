import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { prisma, prismaReady } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/env';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import MissingDatabaseNotice from '@/components/MissingDatabaseNotice';
import { deleteUser, updateUserPassword, updateUserProfile } from './actions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

type AdminUser = {
  id: string;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
  createdAt: Date;
};

function formatError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof Error && typeof error.message === 'string') return error.message;
  if (typeof error === 'string') return error;
  return undefined;
}

function renderDatabaseNotice(kind: 'missing' | 'unreachable', error?: unknown) {
  const hint = IS_PRODUCTION ? undefined : formatError(error);
  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">Configure a database to manage users.</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/admin/login" />
        </div>
      </header>
      <section className="pack-grid">
        <MissingDatabaseNotice kind={kind} hint={hint} />
      </section>
    </main>
  );
}

async function handleProfileUpdate(formData: FormData) {
  'use server';
  const userId = String(formData.get('userId') ?? '');
  const email = formData.get('email');
  const name = formData.get('name');
  const adminToggle = formData.get('isAdmin');

  if (!userId || typeof email !== 'string' || !email.trim()) {
    return;
  }

  const normalizedEmail = email.trim();
  const normalizedName =
    typeof name === 'string'
      ? name.trim() === ''
        ? null
        : name.trim()
      : undefined;
  const isAdmin = adminToggle === 'on';

  await updateUserProfile(userId, {
    email: normalizedEmail,
    name: normalizedName,
    isAdmin,
  });
  revalidatePath('/admin');
}

async function handlePasswordReset(formData: FormData) {
  'use server';
  const userId = String(formData.get('userId') ?? '');
  const newPassword = formData.get('newPassword');
  if (!userId || typeof newPassword !== 'string' || newPassword.trim().length < 8) {
    return;
  }
  await updateUserPassword(userId, newPassword.trim());
  revalidatePath('/admin');
}

async function handleDeleteUser(formData: FormData) {
  'use server';
  const userId = String(formData.get('userId') ?? '');
  const requesterId = String(formData.get('requesterId') ?? '');
  if (!userId || userId === requesterId) {
    return;
  }
  await deleteUser(userId);
  revalidatePath('/admin');
}

function AdminUserCard({ user, selfId }: { user: AdminUser; selfId: string }) {
  const created = DATE_FORMATTER.format(user.createdAt);

  const profileAction = handleProfileUpdate;
  const passwordAction = handlePasswordReset;
  const deleteAction = handleDeleteUser;

  return (
    <article className="admin-user-card">
      <header className="admin-user-card__header">
        <div>
          <div className="admin-user-card__identity">
            <div className="admin-user-card__title">
              <span className="admin-user-card__email">{user.email ?? 'No email'}</span>
              {user.isAdmin && <span className="admin-badge">Admin</span>}
            </div>
            {user.name ? <span className="admin-user-card__name">{user.name}</span> : null}
          </div>
          <div className="admin-meta">
            <span>ID: {user.id}</span>
            <span>Created: {created}</span>
          </div>
        </div>
      </header>
      <div className="admin-user-card__body">
        <form className="admin-form" action={profileAction}>
          <input type="hidden" name="userId" value={user.id} />
          <label className="admin-form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              defaultValue={user.email ?? ''}
              required
            />
          </label>
          <label className="admin-form__field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              defaultValue={user.name ?? ''}
              placeholder="(optional)"
            />
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" name="isAdmin" defaultChecked={user.isAdmin} />
            <span>Administrator</span>
          </label>
          <div className="admin-form__actions">
            <button className="chip" type="submit">Save profile</button>
          </div>
        </form>
        <form className="admin-form admin-form--inline" action={passwordAction}>
          <input type="hidden" name="userId" value={user.id} />
          <label className="admin-form__field">
            <span>Reset password</span>
            <input
              type="password"
              name="newPassword"
              minLength={8}
              placeholder="New password"
              required
            />
          </label>
          <div className="admin-form__actions">
            <button className="chip" type="submit">Update password</button>
          </div>
        </form>
        <form className="admin-form admin-form--danger" action={deleteAction}>
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="requesterId" value={selfId} />
          <div className="admin-form__actions">
            <button
              className="chip chip--danger"
              type="submit"
              disabled={user.id === selfId}
              title={user.id === selfId ? 'You cannot delete your own account.' : 'Delete user'}
            >
              Delete user
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!hasDatabaseUrl()) {
    return renderDatabaseNotice('missing');
  }

  try {
    await prismaReady();
  } catch (error) {
    console.error('Prisma failed to initialize for admin view', error);
    return renderDatabaseNotice('unreachable', error);
  }

  let currentUser: { id: string; isAdmin: boolean } | null = null;
  try {
    currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isAdmin: true },
    });
  } catch (error) {
    console.error('Failed to load current user for admin view', error);
    return renderDatabaseNotice('unreachable', error);
  }

  if (!currentUser?.isAdmin) {
    redirect('/login?error=forbidden');
  }

  let users: AdminUser[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error('Failed to load users for admin view', error);
    return renderDatabaseNotice('unreachable', error);
  }

  const adminCount = users.reduce((sum, user) => (user.isAdmin ? sum + 1 : sum), 0);

  return (
    <main className="page page--admin">
      <header className="page-header">
        <div className="page-header__titles">
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">Manage users, promote admins, and reset passwords.</p>
        </div>
        <div className="page-header__actions">
          <ThemeToggle />
          <LogoutButton callbackUrl="/admin/login" />
        </div>
      </header>
      <section className="admin-panel">
        <div className="admin-summary">
          <div className="admin-summary__item">
            <span className="admin-summary__label">Total users</span>
            <strong className="admin-summary__value">{users.length}</strong>
          </div>
          <div className="admin-summary__item">
            <span className="admin-summary__label">Admins</span>
            <strong className="admin-summary__value">{adminCount}</strong>
          </div>
        </div>
        <div className="admin-user-list">
          {users.length === 0 ? (
            <div className="admin-empty">No users yet.</div>
          ) : (
            users.map((user) => <AdminUserCard key={user.id} user={user} selfId={currentUser!.id} />)
          )}
        </div>
      </section>
    </main>
  );
}
