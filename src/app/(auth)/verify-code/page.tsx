import Link from 'next/link';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { issueDevEmailCode, validateEmailCode, normalizeEmailForCode } from '@/lib/email-code';

export const runtime = 'nodejs';

function sanitizeCallbackUrl(value: FormDataEntryValue | string | undefined | null): string | undefined {
  if (typeof value !== 'string') return undefined;
  if (!value.startsWith('/')) return undefined;
  return value;
}

function buildReturnUrl(email: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams({ email });
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  return `/verify-code?${search.toString()}`;
}

async function verifyCodeAction(formData: FormData) {
  'use server';
  const emailValue = formData.get('email');
  const callbackUrl = sanitizeCallbackUrl(formData.get('callbackUrl'));
  const codeValue = formData.get('code');
  const email = typeof emailValue === 'string' ? normalizeEmailForCode(emailValue) : '';
  const code = typeof codeValue === 'string' ? codeValue.trim() : '';
  if (!email) {
    redirect('/register');
  }
  const redirectBack = (reason: string) => {
    redirect(buildReturnUrl(email, { error: reason, callbackUrl: callbackUrl ?? undefined }));
  };
  if (!/^\d{5}$/.test(code)) {
    redirectBack('invalid');
  }
  const token = await validateEmailCode(email, code);
  if (!token) {
    redirectBack('invalid');
    return;
  }
  await prisma.$transaction([
    prisma.user.updateMany({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.delete({ where: { id: token.id } }),
  ]);
  const loginParams = new URLSearchParams({ verified: '1' });
  if (callbackUrl) loginParams.set('callbackUrl', callbackUrl);
  redirect(`/login?${loginParams.toString()}`);
}

async function resendCodeAction(formData: FormData) {
  'use server';
  const emailValue = formData.get('email');
  const callbackUrl = sanitizeCallbackUrl(formData.get('callbackUrl'));
  const email = typeof emailValue === 'string' ? normalizeEmailForCode(emailValue) : '';
  if (!email) {
    redirect('/register');
  }
  await issueDevEmailCode(email);
  redirect(buildReturnUrl(email, { resent: '1', callbackUrl: callbackUrl ?? undefined }));
}

export default function VerifyCodePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const emailParam = typeof searchParams.email === 'string' ? searchParams.email : '';
  const email = normalizeEmailForCode(emailParam || '');
  const callbackUrl = sanitizeCallbackUrl(searchParams.callbackUrl as string | undefined);
  const error = typeof searchParams.error === 'string' ? searchParams.error : undefined;
  const resent = typeof searchParams.resent === 'string' ? searchParams.resent : undefined;
  if (!email) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1 className="auth-card__title">Verify your email</h1>
          <p className="auth-card__subtitle">Please start by creating an account.</p>
          <Link className="chip" href="/register">Go to register</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Check your email</h1>
        <p className="auth-card__subtitle">Enter the 5-digit code we sent to {email}.</p>
        {error === 'invalid' && <p className="auth-card__error">Invalid or expired code. Try again.</p>}
        {resent && <p className="auth-card__hint">We re-sent your code. (In dev, check the server console.)</p>}
        <form className="auth-card__form" action={verifyCodeAction}>
          <input type="hidden" name="email" value={email} />
          {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
          <label className="auth-card__field">
            <span className="auth-card__label">Verification code</span>
            <input inputMode="numeric" pattern="[0-9]{5}" maxLength={5} name="code" required placeholder="12345" />
          </label>
          <button className="chip" type="submit">Verify email</button>
        </form>
        <form action={resendCodeAction} style={{ marginTop: '1rem' }}>
          <input type="hidden" name="email" value={email} />
          {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
          <button className="chip" type="submit">Resend code (dev)</button>
        </form>
      </div>
    </main>
  );
}
