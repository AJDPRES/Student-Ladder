"use client";

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ isSaved }: { isSaved: boolean }) {
  const { pending } = useFormStatus();
  const label = pending ? 'Saving…' : isSaved ? 'Unsave job' : 'Save job';
  return (
    <button className="chip" type="submit" disabled={pending} aria-live="polite">
      {label}
    </button>
  );
}
