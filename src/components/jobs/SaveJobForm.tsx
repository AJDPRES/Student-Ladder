import Link from 'next/link';

import { saveJob, unsaveJob } from '@/app/jobs/actions';

import SubmitButton from './SubmitButton';

export default function SaveJobForm({
  jobId,
  canonical,
  isSaved,
  isAuthenticated,
}: {
  jobId: string;
  canonical: string;
  isSaved: boolean;
  isAuthenticated: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <Link className="chip" href={`/login?next=${encodeURIComponent(canonical)}`}>
        Save this job
      </Link>
    );
  }

  const action = isSaved ? unsaveJob : saveJob;

  return (
    <form action={action}>
      <input type="hidden" name="jobId" value={jobId} />
      <SubmitButton isSaved={isSaved} />
    </form>
  );
}
