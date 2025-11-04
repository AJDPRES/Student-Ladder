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
];

const GRID_PREVIEW_COUNT = 4;
const SCROLLER_TARGET_COUNT = 12;
const LEFT_FADE_THRESHOLD = 12;
const RIGHT_FADE_THRESHOLD = 16;
const CARD_WIDTH = 180.88;
const TRACK_PADDING = 16;
// Minimal offset to clear proximity snapping reliably (kept subtle)
const MIN_LEFT_OFFSET = 24; // px
// Target: ~20% into the first card from its left edge plus track padding
const INITIAL_SCROLL_OFFSET = TRACK_PADDING + CARD_WIDTH * 0.2; // ~52px

export default function RelatedCompanies() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [hasDepartedStart, setHasDepartedStart] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isExpandedRef = useRef(isExpanded);
  const isProgrammaticRef = useRef(false);
  const expansionPhaseRef = useRef<'preview' | 'opening' | 'open'>('preview');
  const userInteractedRef = useRef(false);
  const hasDepartedStartRef = useRef(false);
  const initialFadesRef = useRef(false);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const previewCompanies = COMPANY_CARDS.slice(0, GRID_PREVIEW_COUNT);
  const scrollerCompanies = useMemo(() => {
    if (COMPANY_CARDS.length >= SCROLLER_TARGET_COUNT) return COMPANY_CARDS.slice(0, SCROLLER_TARGET_COUNT);
    return Array.from({ length: SCROLLER_TARGET_COUNT }, (_, index) => COMPANY_CARDS[index % COMPANY_CARDS.length]);
  }, []);

  const collapseToPreview = useCallback(() => {
    setIsExpanded(false);
    setShowLeftFade(false);
    setShowRightFade(false);
    setIsAtStart(true);
    setHasDepartedStart(false);
    expansionPhaseRef.current = 'preview';
    userInteractedRef.current = false;
    hasDepartedStartRef.current = false;
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
        allowCollapse = true,
        allowFadeReset = true,
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
      if (!atStart) {
        hasDepartedStartRef.current = true;
      }

      if (atStart) {
        setIsAtStart(true);
        if (initialFadesRef.current) {
          setShowLeftFade(true);
          setShowRightFade(hasOverflow);
          return;
        }
        if (allowFadeReset) {
          setShowLeftFade(false);
          setShowRightFade(hasOverflow);
        }
        return;
      }

      setIsAtStart(false);
      setShowLeftFade(true);
      setShowRightFade(!atEnd);
      if (!hasDepartedStartRef.current) {
        hasDepartedStartRef.current = true;
        setHasDepartedStart(true);
      }
      if (initialFadesRef.current) initialFadesRef.current = false;
    },
    [collapseToPreview]
  );

  const handleToggle = () => {
    if (isExpanded && isAtStart) {
      collapseToPreview();
      return;
    }

    if (!isExpanded) {
      setIsExpanded(true);
      setIsAtStart(true);
      // Start with fades off, then fade them in after the scroller begins its own fade-in
      setShowLeftFade(false);
      setShowRightFade(false);
      expansionPhaseRef.current = 'open';
      userInteractedRef.current = false;
      hasDepartedStartRef.current = false;
      setHasDepartedStart(false);
      initialFadesRef.current = true;
      // Let the scroller mount and begin opacity transition, then fade in the sides
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowLeftFade(true);
          setShowRightFade(true);
        });
      });
    }
  };

  const handleScroll = () => {
    const viewport = scrollerRef.current;
    if (!viewport) return;
    if (expansionPhaseRef.current === 'opening') return;
    if (!isProgrammaticRef.current && viewport.scrollLeft > LEFT_FADE_THRESHOLD) {
      userInteractedRef.current = true;
      hasDepartedStartRef.current = true;
      if (!hasDepartedStart) setHasDepartedStart(true);
      if (initialFadesRef.current) initialFadesRef.current = false;
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
    if (nextLeft > LEFT_FADE_THRESHOLD) {
      userInteractedRef.current = true;
      hasDepartedStartRef.current = true;
      if (!hasDepartedStart) setHasDepartedStart(true);
      if (initialFadesRef.current) initialFadesRef.current = false;
    }
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

      <div className="job-search-companies__stage">
        <div className="job-search-companies__grid" aria-hidden={isExpanded}>
          {previewCompanies.map((company, index) => (
            <article key={`${company.name}-${index}`} className="job-search-companies__card">
              <div className="job-search-companies__thumb">
                <div className="job-search-companies__thumb-inner">
                  <img src={company.imageSrc} alt="" width={183} height={102} />
                  <span aria-hidden="true" className="job-search-companies__thumb-overlay" />
                </div>
                {!isExpanded && index === previewCompanies.length - 1 && (
                  <button
                    type="button"
                    className="job-search-results__quick-action"
                    aria-label="Show all related companies"
                    onClick={handleToggle}
                  >
                    <span className="job-search-icon job-search-icon--add" aria-hidden="true" />
                  </button>
                )}
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
            className={['job-search-companies__scroller-viewport'].join(' ')}
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
                    {isExpanded && isAtStart && hasDepartedStart && index === 0 && (
                      <button
                        type="button"
                        className="job-search-results__quick-action"
                        aria-label="Collapse related companies"
                        onClick={collapseToPreview}
                      >
                        <span className="job-search-icon job-search-icon--add" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="job-search-companies__name">{company.name}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
