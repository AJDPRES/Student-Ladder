'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

import { safeNext } from '@/lib/portal';

function sanitizeCallbackUrl(value: string | null): string | undefined {
  const sanitized = safeNext(value);
  return sanitized || undefined;
}

export type LoginFormProps = {
  defaultCallback?: string;
  portal?: 'student' | 'employer' | 'admin';
  title?: string;
  subtitle?: string;
  showRegisterHint?: boolean;
  secondaryLink?: { href: string; label: string; prefix?: string };
  notice?: string;
};

export default function LoginForm({
  defaultCallback = '/',
  portal = 'student',
  title = 'Sign in',
  subtitle = 'Welcome back! Enter your details to continue.',
  showRegisterHint = portal === 'student',
  secondaryLink,
  notice,
}: LoginFormProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // default to provided fallback if no valid callbackUrl provided
  const callbackUrl =
    sanitizeCallbackUrl((searchParams?.get('next') ?? searchParams?.get('callbackUrl') ?? null) as string | null) ??
    defaultCallback;
  const urlError = searchParams?.get('error') ?? null; // Auth.js sets ?error=... on redirects
  const derivedUrlError = (() => {
    if (urlError === 'CredentialsSignin') return 'Invalid email or password';
    if (urlError === 'PORTAL_MISMATCH') return 'Please sign in through the correct portal.';
    if (urlError === 'forbidden') return 'Administrator access required.';
    if (urlError === 'unauthenticated') return 'Please sign in to continue.';
    return null;
  })();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      setError('Invalid email or password');
      setPending(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        portal,
        redirect: false,
        callbackUrl: callbackUrl ?? '/',
      });

      if (result?.error) {
        setError('Invalid email or password');
        setPending(false);
        return;
      }

      const destination = typeof result?.url === 'string' && result.url.trim() ? result.url : callbackUrl ?? '/';
      setPending(false);
      router.push(destination);
      // Ensure server components see the new session
      router.refresh();
    } catch (err) {
      console.error('Login failed', err);
      setError('Unable to sign in. Please try again.');
      setPending(false);
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">{title}</h1>
      <p className="auth-card__subtitle">{subtitle}</p>

      <form className="auth-card__form" onSubmit={handleSubmit}>
        {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
        <input type="hidden" name="portal" value={portal} />

        <label className="auth-card__field">
          <span className="auth-card__label">Email</span>
          <input type="email" name="email" autoComplete="email" required disabled={pending} />
        </label>

        <label className="auth-card__field">
          <span className="auth-card__label">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            minLength={8}
            disabled={pending}
          />
        </label>

        {(error || derivedUrlError) && (
          <p className="auth-card__error" role="alert">
            {error ?? derivedUrlError}
          </p>
        )}

        <button type="submit" className="chip" disabled={pending}>
          {pending ? 'Please wait…' : 'Sign in'}
        </button>

        {showRegisterHint && (
          <p className="auth-card__hint">
            Don&apos;t have an account? <Link href="/register">Create one</Link>.
          </p>
        )}
        {notice && <p className="auth-card__hint">{notice}</p>}
        {secondaryLink && (
          <p className="auth-card__hint">
            {secondaryLink.prefix ? `${secondaryLink.prefix} ` : ''}
            <Link href={secondaryLink.href}>{secondaryLink.label}</Link>.
          </p>
        )}
      </form>
    </div>
  );
}
