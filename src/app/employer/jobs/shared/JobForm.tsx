import type { JobKind, JobStatus, JobType } from '@prisma/client';

const JOB_TYPES: JobType[] = ['WORK_EXPERIENCE', 'APPRENTICESHIP', 'INTERNSHIP', 'PLACEMENT', 'GRADUATE_SCHEME'];
const JOB_KINDS: JobKind[] = ['SCHEME', 'LIVE'];

type JobFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  job?: {
    id: string;
    title: string;
    slug: string;
    type: JobType;
    kind: JobKind;
    status: JobStatus;
    description: string | null;
    locations: string[];
    sectors: string[];
    tags: string[];
    applyUrl: string;
    deadline: Date | null;
    sponsored: boolean;
  };
};

function formatList(values?: string[]): string {
  if (!values || values.length === 0) return '';
  return values.join(', ');
}

function toDateValue(value?: Date | null): string {
  if (!value) return '';
  return value.toISOString().slice(0, 10);
}

export default function JobForm({ action, job }: JobFormProps) {
  return (
    <form className="admin-form" action={action}>
      {job ? <input type="hidden" name="jobId" value={job.id} /> : null}
      <label className="admin-form__field admin-form__field--required">
        <span>Title</span>
        <input name="title" defaultValue={job?.title ?? ''} required aria-required="true" />
      </label>
      <p className="admin-form__hint">URL is generated automatically from the title.</p>
      <label className="admin-form__field admin-form__field--required">
        <span>Type</span>
        <select name="type" defaultValue={job?.type ?? JOB_TYPES[JOB_TYPES.length - 1]} required aria-required="true">
          {JOB_TYPES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="admin-form__field">
        <span>Kind</span>
        <select name="kind" defaultValue={job?.kind ?? 'SCHEME'}>
          {JOB_KINDS.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="admin-form__field admin-form__field--required">
        <span>Apply URL</span>
        <input name="applyUrl" type="url" defaultValue={job?.applyUrl ?? ''} required aria-required="true" placeholder="https://" />
      </label>
      <label className="admin-form__field">
        <span>Description</span>
        <textarea name="description" rows={4} defaultValue={job?.description ?? ''} />
      </label>
      <label className="admin-form__field">
        <span>Locations (comma separated)</span>
        <input name="locations" defaultValue={formatList(job?.locations)} />
      </label>
      <label className="admin-form__field">
        <span>Sectors (comma separated)</span>
        <input name="sectors" defaultValue={formatList(job?.sectors)} />
      </label>
      <label className="admin-form__field">
        <span>Tags (comma separated)</span>
        <input name="tags" defaultValue={formatList(job?.tags)} />
      </label>
      <label className="admin-form__field">
        <span>Deadline</span>
        <input name="deadline" type="date" defaultValue={toDateValue(job?.deadline)} />
      </label>
      <label className="admin-checkbox">
        <input type="checkbox" name="sponsored" defaultChecked={job?.sponsored ?? false} />
        <span>Sponsored</span>
      </label>
      <p className="admin-form__hint">Status: Draft (awaiting admin review)</p>
      <div className="admin-form__actions">
        <button type="submit" className="chip chip--primary">{job ? 'Save changes' : 'Create draft'}</button>
      </div>
    </form>
  );
}
