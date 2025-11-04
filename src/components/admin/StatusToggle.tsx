'use client';

import { useEffect, useState } from 'react';

import type { JobStatus } from '@prisma/client';

const STATUS_OPTIONS: { value: JobStatus; label: string; hint: string }[] = [
  { value: 'DRAFT', label: 'Draft', hint: 'Hidden from public lists' },
  { value: 'PUBLISHED', label: 'Published', hint: 'Visible everywhere' },
  { value: 'ARCHIVED', label: 'Archived', hint: 'Removed from listings' },
];

type StatusToggleProps = {
  name: string;
  defaultValue: JobStatus;
};

export default function StatusToggle({ name, defaultValue }: StatusToggleProps) {
  const [value, setValue] = useState<JobStatus>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="status-toggle">
      <input type="hidden" name={name} value={value} />
      <div className="status-toggle__buttons">
        {STATUS_OPTIONS.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className="status-toggle__button"
              data-active={active ? 'true' : 'false'}
              onClick={() => setValue(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="status-toggle__hint">
        {STATUS_OPTIONS.find((option) => option.value === value)?.hint ?? ''}
      </p>
    </div>
  );
}
