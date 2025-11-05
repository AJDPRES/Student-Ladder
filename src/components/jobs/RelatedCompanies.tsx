'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type WheelEvent } from 'react';

type Company = {
  name: string;
  imageSrc: string;
};

const COMPANY_CARDS: Company[] = [
  { name: 'Bank of America', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Goldman Sachs', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Morgan Stanley', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'HSBC', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Barclays', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'JP Morgan', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Citigroup', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Deloitte', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'EY', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'KPMG', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'PwC', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Accenture', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'McKinsey & Company', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Boston Consulting Group', imageSrc: '/images/job-search/cards/related-company-card.png' },
  { name: 'Bain & Company', imageSrc: '/images/job-search/cards/related-company-card.png' },
];

const GRID_PREVIEW_COUNT = 4;
const LEFT_THRESHOLD = 32;
const RIGHT_THRESHOLD = 32;

export default function RelatedCompanies() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const previewCompanies = useMemo(() => COMPANY_CARDS.slice(0, GRID_PREVIEW_COUNT), []);
  const scrollerCompanies = useMemo(() => COMPANY_CARDS.slice(), []);

  const updateFades = useCallback((viewport: HTMLDivElement) => {
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const atStart = viewport.scrollLeft <= LEFT_THRESHOLD;
    const atEnd = maxScroll - viewport.scrollLeft <= RIGHT_THRESHOLD;
    const hasOverflow = maxScroll > 0;

    setShowLeftFade(hasOverflow && !atStart);
    setShowRightFade(hasOverflow && !atEnd);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      setShowLeftFade(false);
      setShowRightFade(false);
      return;
    }

    const viewport = scrollerRef.current;
    if (!viewport) return;

    viewport.scrollLeft = 0;
    setShowLeftFade(false);
    setShowRightFade(false);

    requestAnimationFrame(() => {
      const current = scrollerRef.current;
      if (!current) return;
      updateFades(current);
    });
  }, [isExpanded, updateFades]);

  useEffect(() => {
    if (!isExpanded) return;
    const viewport = scrollerRef.current;
    if (!viewport) return;

    const handleResize = () => {
      const current = scrollerRef.current;
      if (!current) return;
      updateFades(current);
    };

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    observer?.observe(viewport);

    handleResize();

    return () => {
      observer?.disconnect();
    };
  }, [isExpanded, updateFades]);

  const handleScroll = () => {
    if (!isExpanded) return;
    const viewport = scrollerRef.current;
    if (!viewport) return;
    updateFades(viewport);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!isExpanded) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const viewport = scrollerRef.current;
    if (!viewport) return;

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (maxScroll === 0) return;

    event.preventDefault();
    const nextLeft = Math.min(maxScroll, Math.max(0, viewport.scrollLeft + event.deltaY));
    if (nextLeft === viewport.scrollLeft) return;

    viewport.scrollLeft = nextLeft;
    updateFades(viewport);
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isExpanded) return;
    if (event.pointerType === 'touch') return;
    const viewport = scrollerRef.current;
    if (!viewport) return;
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: viewport.scrollLeft };
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isExpanded) return;
    const viewport = scrollerRef.current;
    if (!viewport) return;
    const drag = dragRef.current;
    if (!drag.active) return;

    const delta = drag.startX - event.clientX;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const nextLeft = Math.min(maxScroll, Math.max(0, drag.scrollLeft + delta));
    if (viewport.scrollLeft === nextLeft) return;

    viewport.scrollLeft = nextLeft;
    updateFades(viewport);
  };

  const endDrag: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isExpanded) return;
    const viewport = scrollerRef.current;
    if (!viewport) return;
    const drag = dragRef.current;
    if (!drag.active) return;

    dragRef.current = { active: false, startX: 0, scrollLeft: viewport.scrollLeft };
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  const handleActivate = () => {
    if (isExpanded) return;
    setIsExpanded(true);
  };

  const scrollerClassName = [
    'job-search-companies__scroller',
    showLeftFade ? 'is-scrollable-left' : '',
    showRightFade ? 'is-scrollable-right' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={`job-search-companies${isExpanded ? ' job-search-companies--expanded' : ''}`}
      aria-labelledby="job-search-companies-label"
    >
      <header className="job-search-companies__header">
        <span id="job-search-companies-label" className="job-search-companies__label">
          related companies
        </span>
      </header>

      <div className="job-search-companies__body">
        <div className="job-search-companies__grid" aria-hidden={isExpanded}>
          {previewCompanies.map((company, index) => (
            <article key={`preview-${index}-${company.name}`} className="job-search-companies__card">
              <div className="job-search-companies__thumb">
                <div className="job-search-companies__thumb-inner">
                  <img src={company.imageSrc} alt="" width={183} height={102} />
                  <span aria-hidden="true" className="job-search-companies__thumb-overlay" />
                </div>
                {!isExpanded && index === previewCompanies.length - 1 && (
                  <button
                    type="button"
                    className="job-search-companies__expand"
                    aria-label="Show all related companies"
                    onClick={handleActivate}
                  >
                    <span className="job-search-companies__expand-icon" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="job-search-companies__name">{company.name}</p>
            </article>
          ))}
        </div>

        <div className={scrollerClassName} aria-hidden={!isExpanded}>
          <div
            ref={scrollerRef}
            className="job-search-companies__viewport"
            role="list"
            onScroll={handleScroll}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
          >
            {scrollerCompanies.map((company, index) => (
              <article key={`company-${index}-${company.name}`} className="job-search-companies__card" role="listitem">
                <div className="job-search-companies__thumb">
                  <div className="job-search-companies__thumb-inner">
                    <img src={company.imageSrc} alt="" width={183} height={102} />
                    <span aria-hidden="true" className="job-search-companies__thumb-overlay" />
                  </div>
                </div>
                <p className="job-search-companies__name">{company.name}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
