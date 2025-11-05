'use client';

import { useState } from 'react';

type View = 'grid' | 'list';

export default function ViewSwitch() {
  const [active, setActive] = useState<View>('grid');

  return (
    <div className="job-search-view-switch" role="tablist" aria-label="View mode">
      <button
        type="button"
        className={`job-search-view-switch__option${active === 'list' ? ' is-active' : ''}`}
        aria-label="List view"
        aria-selected={active === 'list'}
        role="tab"
        onClick={() => setActive('list')}
      >
        <span aria-hidden="true" className="job-search-view-switch__icon job-search-view-switch__icon--list" />
      </button>
      <button
        type="button"
        className={`job-search-view-switch__option${active === 'grid' ? ' is-active' : ''}`}
        aria-label="Grid view"
        aria-selected={active === 'grid'}
        role="tab"
        onClick={() => setActive('grid')}
      >
        <span aria-hidden="true" className="job-search-view-switch__icon job-search-view-switch__icon--grid" />
      </button>
    </div>
  );
}
