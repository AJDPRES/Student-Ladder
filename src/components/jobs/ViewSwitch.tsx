'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type View = 'grid' | 'list';

export default function ViewSwitch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnGridRef = useRef<HTMLButtonElement>(null);
  const btnListRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<View>('list');

  // Position the animated indicator under the active button
  const positionIndicator = () => {
    const container = containerRef.current;
    const target = active === 'grid' ? btnGridRef.current : btnListRef.current;
    if (!container || !target) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const left = Math.max(2, tRect.left - cRect.left);
    const width = tRect.width;
    container.style.setProperty('--view-indicator-left', `${left}px`);
    container.style.setProperty('--view-indicator-width', `${width}px`);
  };

  useLayoutEffect(() => {
    positionIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => positionIndicator();
    window.addEventListener('resize', onResize);
    positionIndicator();
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="job-search-view-switch" role="tablist" aria-label="View mode">
      <span aria-hidden className="job-search-view-switch__indicator" />
      <button
        ref={btnListRef}
        type="button"
        className={`job-search-view-switch__option${active === 'list' ? ' is-active' : ''}`}
        aria-label="List view"
        aria-selected={active === 'list'}
        role="tab"
        onClick={() => setActive('list')}
      >
        <span className="job-search-icon job-search-icon--menu" aria-hidden="true" />
      </button>
      <button
        ref={btnGridRef}
        type="button"
        className={`job-search-view-switch__option${active === 'grid' ? ' is-active' : ''}`}
        aria-label="Grid view"
        aria-selected={active === 'grid'}
        role="tab"
        onClick={() => setActive('grid')}
      >
        <span className="job-search-icon job-search-icon--grid" aria-hidden="true" />
      </button>
    </div>
  );
}

