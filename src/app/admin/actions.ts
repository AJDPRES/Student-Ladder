'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect('/login?error=unauthenticated');
  const self = await prisma.user.findUnique({ where: { email } });
  if (!self?.isAdmin) redirect('/login?error=forbidden');
  return self;
}

export async function updateUserProfile(
  userId: string,
  data: { email?: string; name?: string | null; isAdmin?: boolean },
) {
  await requireAdmin();
  const { email, name, isAdmin } = data;
  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(email ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
      ...(isAdmin !== undefined ? { isAdmin } : {}),
    },
  });
}

export async function updateUserPassword(userId: string, newPassword: string) {
  await requireAdmin();
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
}
