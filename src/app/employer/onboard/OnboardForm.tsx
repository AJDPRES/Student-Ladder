'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { onboardCompany, type OnboardState } from '@/app/employer/actions';

const initialState: OnboardState = { status: 'idle' };

function StateNotice({ state }: { state: OnboardState }) {
  if (state.status === 'idle') return null;
  const className = state.status === 'error' ? 'auth-card__error' : 'auth-card__hint';
  return (
    <p className={className} role={state.status === 'error' ? 'alert' : 'status'}>
      {state.message}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="chip chip--primary" disabled={pending}>
      {pending ? 'Submitting…' : 'Save company'}
    </button>
  );
}

export default function OnboardForm() {
  const [state, formAction] = useFormState(onboardCompany, initialState);

  return (
    <form className="admin-form" action={formAction}>
      <StateNotice state={state} />
      <label className="admin-form__field admin-form__field--required">
        <span>Company name</span>
        <input name="name" required aria-required="true" />
      </label>
      <label className="admin-form__field">
        <span>Slug (optional)</span>
        <input name="slug" placeholder="example-company" />
      </label>
      <label className="admin-form__field">
        <span>Website</span>
        <input name="website" type="url" placeholder="https://" />
      </label>
      <label className="admin-form__field">
        <span>Logo URL</span>
        <input name="logoUrl" type="url" placeholder="https://" />
      </label>
      <div className="admin-form__actions">
        <SubmitButton />
      </div>
    </form>
  );
}
