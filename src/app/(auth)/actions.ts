'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

import { prisma, prismaReady } from '@/lib/prisma';
import { issueDevEmailCode } from '@/lib/email-code';

type RegisterActionState = { error?: string };

function sanitizeCallbackUrl(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') return undefined;
  if (!value.startsWith('/')) return undefined;
  return value;
}

export async function registerAction(formData: FormData): Promise<RegisterActionState | void> {
  await prismaReady();
  const emailValue = formData.get('email');
  const rawEmail = typeof emailValue === 'string' ? emailValue.trim() : '';
  const email = rawEmail.toLowerCase();
  const passwordValue = formData.get('password');
  const password = typeof passwordValue === 'string' ? passwordValue : '';
  const nameValue = formData.get('name');
  const name = typeof nameValue === 'string' && nameValue.trim() ? nameValue.trim() : null;
  const callbackUrl = sanitizeCallbackUrl(formData.get('callbackUrl'));

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    redirect('/login?registered=1');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  await issueDevEmailCode(email);

  const search = new URLSearchParams({ email });
  if (callbackUrl) {
    search.set('callbackUrl', callbackUrl);
  }
  redirect(`/verify-code?${search.toString()}`);
}
