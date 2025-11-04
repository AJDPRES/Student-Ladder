'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-card">
        <h1 className="error-card__title">Login error</h1>
        <p className="error-card__copy">Something failed while loading the sign-in page.</p>
        <div className="error-card__actions">
          <button onClick={() => reset()} className="error-button error-button--primary">
            Try again
          </button>
          <a href="/login" className="error-button error-button--secondary">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
