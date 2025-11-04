'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import Link from 'next/link';

import JobForm from '../shared/JobForm';
import { createEmployerJob, type EmployerJobState } from '@/app/employer/actions';

const initialState: EmployerJobState = { status: 'idle' };

export default function EmployerJobForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createEmployerJob, initialState);

  useEffect(() => {
    if (state.status === 'ok') {
      router.replace('/employer/dashboard');
    }
  }, [state, router]);

  return (
    <article className="admin-user-card">
      <JobForm action={formAction} />
      {state.status === 'error' && (
        <p className="auth-card__error" role="alert">
          {state.message}
          {state.onboard ? (
            <>
              {' '}
              <Link href={state.onboard}>Onboard your company</Link>
            </>
          ) : null}
        </p>
      )}
    </article>
  );
}
