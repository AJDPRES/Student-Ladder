'use client';

import { useCallback, useMemo, useRef, useState, type WheelEvent } from 'react';

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
const SCROLLER_TARGET_COUNT = 15;
const LEFT_FADE_THRESHOLD = 12;
const RIGHT_FADE_THRESHOLD = 16;

export default function RelatedCompanies() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticRef = useRef(false);
  const expansionPhaseRef = useRef<'preview' | 'opening' | 'open'>('preview');
  const initialFadesRef = useRef(false);

  const previewCompanies = COMPANY_CARDS.slice(0, GRID_PREVIEW_COUNT);
  const scrollerCompanies = useMemo(() => {
    if (COMPANY_CARDS.length >= SCROLLER_TARGET_COUNT) return COMPANY_CARDS.slice(0, SCROLLER_TARGET_COUNT);
    return Array.from({ length: SCROLLER_TARGET_COUNT }, (_, index) => COMPANY_CARDS[index % COMPANY_CARDS.length]);
  }, []);

  const collapseToPreview = useCallback(() => {
    setIsExpanded(false);
    setShowLeftFade(false);
    setShowRightFade(false);
    expansionPhaseRef.current = 'preview';
    initialFadesRef.current = false;
    const viewport = scrollerRef.current;
    if (!viewport) return;
    isProgrammaticRef.current = true;
    viewport.scrollTo({ left: 0, behavior: 'auto' });
    requestAnimationFrame(() => {
      isProgrammaticRef.current = false;
    });
  }, []);

  const updateFadeState = useCallback(
    (
      viewport: HTMLDivElement,
      {
        allowCollapse: _allowCollapse = true,
        allowFadeReset: _allowFadeReset = true,
      }: { allowCollapse?: boolean; allowFadeReset?: boolean } = {}
    ) => {
      if (expansionPhaseRef.current === 'opening') {
        return;
      }

      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const remaining = maxScroll - viewport.scrollLeft;
      const atStart = viewport.scrollLeft <= LEFT_FADE_THRESHOLD;
      const atEnd = remaining <= RIGHT_FADE_THRESHOLD;
      const hasOverflow = maxScroll > 0;

      if (atStart) {
        setShowLeftFade(hasOverflow && viewport.scrollLeft > 0);
        setShowRightFade(hasOverflow);
        if (initialFadesRef.current) initialFadesRef.current = false;
        return;
      }

      setShowLeftFade(true);
      setShowRightFade(!atEnd);
      if (initialFadesRef.current) initialFadesRef.current = false;
    },
    [collapseToPreview]
  );

  const openAll = () => {
    if (isExpanded) {
      return;
    }

    setIsExpanded(true);
    // Start with fades off, then fade them in after the scroller begins its own fade-in
    setShowLeftFade(false);
    setShowRightFade(false);
    expansionPhaseRef.current = 'open';
    initialFadesRef.current = true;
    // Let the scroller mount and begin opacity transition, then fade in the sides
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const viewport = scrollerRef.current;
        if (viewport) {
          viewport.scrollTo({ left: 0, behavior: 'auto' });
          updateFadeState(viewport, { allowCollapse: false, allowFadeReset: false });
        } else {
          setShowLeftFade(true);
          setShowRightFade(true);
        }
      });
    });
  };

  const handleScroll = () => {
    const viewport = scrollerRef.current;
    if (!viewport) return;
    if (expansionPhaseRef.current === 'opening') return;
    if (!isProgrammaticRef.current && viewport.scrollLeft > LEFT_FADE_THRESHOLD && initialFadesRef.current) {
      initialFadesRef.current = false;
    }
    updateFadeState(viewport, {
      allowCollapse: !isProgrammaticRef.current,
      allowFadeReset: !isProgrammaticRef.current,
    });
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const viewport = scrollerRef.current;
    if (!viewport) return;

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (maxScroll === 0) {
      return;
    }

    event.preventDefault();
    const nextLeft = Math.min(maxScroll, Math.max(0, viewport.scrollLeft + event.deltaY));
    if (nextLeft === viewport.scrollLeft) return;
    viewport.scrollLeft = nextLeft;
    if (nextLeft > LEFT_FADE_THRESHOLD && initialFadesRef.current) {
      initialFadesRef.current = false;
    }
    updateFadeState(viewport, {
      allowCollapse: !isProgrammaticRef.current,
      allowFadeReset: !isProgrammaticRef.current,
    });
  };

  const handleToggleClick = () => {
    if (isExpanded) {
      collapseToPreview();
      return;
    }
    openAll();
  };

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

      <div id="job-search-companies-content" className="job-search-companies__body">
        <div className="job-search-companies__preview" aria-hidden={isExpanded}>
          {previewCompanies.map((company, index) => (
            <article key={`${company.name}-${index}`} className="job-search-companies__card">
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

        <div
          className={`job-search-companies__scroller${
            showLeftFade ? ' is-scrollable-left' : ''
          }${showRightFade ? ' is-scrollable-right' : ''}`}
          aria-hidden={!isExpanded}
        >
          <div
            ref={scrollerRef}
            className="job-search-companies__scroller-viewport"
            role="list"
            onScroll={handleScroll}
            onWheel={handleWheel}
          >
            <div className="job-search-companies__scroller-track">
              {scrollerCompanies.map((company, index) => (
                <article key={`scroller-${index}-${company.name}`} className="job-search-companies__card" role="listitem">
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

        <button
          type="button"
          className={`job-search-companies__toggle${isExpanded ? ' is-active' : ''}`}
          aria-expanded={isExpanded}
          aria-controls="job-search-companies-content"
          onClick={handleToggleClick}
        >
          <span className="sr-only">{isExpanded ? 'Collapse related companies' : 'Show all related companies'}</span>
          <span aria-hidden="true" className="job-search-companies__toggle-icon job-search-icon job-search-icon--add" />
        </button>
      </div>
    </section>
  );
}
