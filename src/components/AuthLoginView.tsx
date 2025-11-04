import { Suspense } from 'react';

import LoginForm, { type LoginFormProps } from '@/app/(auth)/login/login-form';

type AuthLoginViewProps = LoginFormProps & {
  title?: string;
  subtitle?: string;
};

function LoginFallback({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="auth-card" aria-busy="true">
      <h1 className="auth-card__title">{title}</h1>
      <p className="auth-card__subtitle">{subtitle}</p>
    </div>
  );
}

export default function AuthLoginView({
  title = 'Sign in',
  subtitle = 'Welcome back! Enter your details to continue.',
  ...props
}: AuthLoginViewProps = {}) {
  return (
    <main className="auth-page">
      <Suspense fallback={<LoginFallback title={title} subtitle={subtitle} />}>
        <LoginForm title={title} subtitle={subtitle} {...props} />
      </Suspense>
    </main>
  );
}
