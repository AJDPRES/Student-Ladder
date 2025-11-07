'use client';

import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const dynamic = 'force-static';

const JOB_MEDIA = '/images/job-search/cards/related-job-hero.png';
const PRIMARY_JOB = {
  title: 'Sub-Saharan Africa (SSA) Investment Banking 2025 Analyst – London',
  company: 'Bank of America',
  status: { label: 'Live', icon: '/icons/flashlight-fill.svg' },
  posted: 'Posted 4 days ago',
  tags: [
    { id: 'journalism', label: 'Journalism', icon: '/icons/book-3-line.svg' },
    { id: 'internship', label: 'Internship', icon: '/icons/apps-2-line.svg' },
  ],
  image: { src: JOB_MEDIA, width: 138, height: 102 },
};

type JobNoteData = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const JOB_REQUIREMENTS: JobNoteData[] = [
  {
    id: 'req-arthur-taylor',
    title: 'Meeting with Arthur Taylor',
    description: 'Discuss the MVP version of Apex Mobile and Desktop app.',
    date: 'Aug 02',
  },
];

const JOB_BENEFITS: JobNoteData[] = [
  {
    id: 'benefit-1',
    title: 'Meeting with Arthur Taylor',
    description: 'Discuss the MVP version of Apex Mobile and Desktop app.',
    date: 'Aug 02',
  },
  {
    id: 'benefit-2',
    title: 'Meeting with Arthur Taylor',
    description: 'Discuss the MVP version of Apex Mobile and Desktop app.',
    date: 'Aug 02',
  },
  {
    id: 'benefit-3',
    title: 'Meeting with Arthur Taylor',
    description: 'Discuss the MVP version of Apex Mobile and Desktop app.',
    date: 'Aug 02',
  },
  {
    id: 'benefit-4',
    title: 'Meeting with Arthur Taylor',
    description: 'Discuss the MVP version of Apex Mobile and Desktop app.',
    date: 'Aug 02',
  },
];

const JOB_DESCRIPTION_PARAGRAPHS = [
  `Job description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one. Description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one.`,
  `Job description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one. Description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one.`,
];

const RELATED_JOBS = [
  {
    id: 'curve-ssa-analyst-1',
    title: PRIMARY_JOB.title,
    company: 'Curve',
    status: PRIMARY_JOB.status.label,
    statusIcon: PRIMARY_JOB.status.icon,
    image: PRIMARY_JOB.image,
    tags: PRIMARY_JOB.tags,
    posted: PRIMARY_JOB.posted,
  },
  {
    id: 'curve-ssa-analyst-2',
    title: PRIMARY_JOB.title,
    company: 'Curve',
    status: PRIMARY_JOB.status.label,
    statusIcon: PRIMARY_JOB.status.icon,
    image: PRIMARY_JOB.image,
    tags: PRIMARY_JOB.tags,
    posted: PRIMARY_JOB.posted,
  },
];

const SIDEBAR_FACTS = [
  { id: 'closing-date', label: 'closing date', value: '16th April 2024', icon: '/icons/time-line.svg' },
  { id: 'salary', label: 'salary', value: 'Competitive Salary', icon: '/icons/money-pound-circle-line.svg' },
  { id: 'location', label: 'location', value: 'London, UK', icon: '/icons/global-line.svg' },
];

const SIDEBAR_FACTS_SL = SIDEBAR_FACTS.filter((fact) => fact.id === 'location');

function JobNoteRow({ note }: { note: JobNoteData }) {
  return (
    <div className="job-note" role="listitem">
      <span className="job-note__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" focusable="false" aria-hidden="true">
          <path d="M12 21C7.0293 21 3 16.9707 3 12C3 7.0293 7.0293 3 12 3C16.9707 3 21 7.0293 21 12C21 16.9707 16.9707 21 12 21ZM11.1027 15.6L17.4657 9.2361L16.1931 7.9635L11.1027 13.0548L8.5566 10.5087L7.284 11.7813L11.1027 15.6Z" />
        </svg>
      </span>
      <div className="job-note__content">
        <p className="job-note__title">{note.title}</p>
      </div>
    </div>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" role="presentation" aria-hidden="true">
      <path
        d="M12 21C7.0293 21 3 16.9707 3 12C3 7.0293 7.0293 3 12 3C16.9707 3 21 7.0293 21 12C21 16.9707 16.9707 21 12 21ZM12 19.2C13.9096 19.2 15.7409 18.4414 17.0912 17.0912C18.4414 15.7409 19.2 13.9096 19.2 12C19.2 10.0904 18.4414 8.25909 17.0912 6.90883C15.7409 5.55857 13.9096 4.8 12 4.8C10.0904 4.8 8.25909 5.55857 6.90883 6.90883C5.55857 8.25909 4.8 10.0904 4.8 12C4.8 13.9096 5.55857 15.7409 6.90883 17.0912C8.25909 18.4414 10.0904 19.2 12 19.2ZM11.1 7.5H12.9V9.3H11.1V7.5ZM11.1 11.1H12.9V16.5H11.1V11.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" role="presentation" aria-hidden="true">
      <path d="M12 10.7284L16.455 6.27344L17.7276 7.54604L13.2726 12.001L17.7276 16.456L16.455 17.7286L12 13.2736L7.545 17.7286L6.2724 16.456L10.7274 12.001L6.2724 7.54604L7.545 6.27344L12 10.7284Z" fill="currentColor" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" role="presentation" aria-hidden="true">
      <path d="M15.6699 9.62403L7.7939 17.5L6.5 16.2061L14.3751 8.33013H7.43428V6.5H17.5V16.5657H15.6699V9.62403Z" fill="currentColor" />
    </svg>
  );
}

export default function JobListingPrototypeSlPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const relatedModalJob = RELATED_JOBS[0];

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const modalContent =
    isModalOpen && typeof document !== 'undefined'
      ? createPortal(
          <div className="job-modal-overlay" role="presentation" onClick={closeModal}>
            <section
              className="job-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="job-modal-title"
              aria-describedby="job-modal-supporting"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="job-modal__header">
                <div className="job-modal__icon" aria-hidden="true">
                  <InfoCircleIcon />
                </div>
                <div className="job-modal__heading">
                  <h1 id="job-modal-title" className="job-modal__title">
                    Unverified Listing
                  </h1>
                </div>
                <button type="button" className="job-modal__close" aria-label="Close modal" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </header>

              <div className="job-modal__body">
                <p id="job-modal-supporting" className="job-modal__supporting">
                  Job summary by Student Ladder. Information and links are not verified by the employer.
                </p>
                <div className="job-modal__cta">
                  <button type="button" className="job-modal__action" onClick={closeModal}>
                    <span className="job-modal__action-icon" aria-hidden="true">
                      <ArrowUpRightIcon />
                    </span>
                    <span>Continue to Application</span>
                  </button>
                </div>
              </div>

              <section className="job-modal__related" aria-labelledby="job-modal-related-heading">
                <div className="job-modal__related-label-wrap">
                  <p id="job-modal-related-heading" className="job-modal__related-label">
                    related jobs
                  </p>
                </div>
                <div className="job-modal__related-cards" role="list">
                  <article className="job-related-card" role="listitem" aria-labelledby="job-modal-card-title">
                    <div className="job-related-card__content">
                      <div className="job-related-card__row">
                        <div className="job-card__media">
                          <div className="job-card__media-surface">
                            <img
                              className="job-card__media-image"
                              src="/images/job-search/cards/company-logo-box.png"
                              alt={relatedModalJob.company}
                              width={relatedModalJob.image.width}
                              height={relatedModalJob.image.height}
                            />
                          </div>
                          <div className="job-card__media-badge" aria-label="Verified listing">
                            <span aria-hidden="true" className="job-card__media-badge-icon">
                              <span className="job-search-icon job-search-icon--verified job-search-icon--12" />
                            </span>
                            <span className="job-card__media-badge-label">verified</span>
                          </div>
                        </div>
                      </div>
                      <div className="job-related-card__body">
                        <div className="job-related-card__title-row">
                          <h2 id="job-modal-card-title" className="job-related-card__title">
                            {relatedModalJob.title}
                          </h2>
                          <span className="job-related-card__status">
                            <img src={relatedModalJob.statusIcon} alt="" width={16} height={16} aria-hidden="true" />
                            <span>{relatedModalJob.status}</span>
                          </span>
                        </div>
                        <span className="job-related-card__company">{relatedModalJob.company}</span>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </section>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="job-detail-page job-detail-page--sl">
      <div className="job-detail-topbar" role="navigation" aria-label="Topbar">
        <div className="job-detail-topbar__inner">
          <div className="job-detail-topbar__left">
            <Link href="/" className="job-detail-topbar__logo" aria-label="Student Ladder">
              <img src="/logo-wordmark-black.svg" alt="Student Ladder" width={178} height={24} />
            </Link>
            <div className="job-detail-topbar__left-group">
              <label className="job-detail-topbar__search" aria-label="Search">
                <span className="job-detail-topbar__search-icon" aria-hidden="true">
                  <img src="/icons/search-2-line.svg" alt="" width={16} height={16} />
                </span>
                <input type="search" placeholder="Search for your dream job" />
              </label>
              <nav className="job-detail-topbar__nav" aria-label="Primary navigation">
                <Link href="/#job-types" className="job-detail-topbar__nav-item">
                  Job Types
                </Link>
                <Link href="/#career-paths" className="job-detail-topbar__nav-item">
                  Career Paths
                </Link>
                <Link href="/#companies" className="job-detail-topbar__nav-item">
                  Companies
                </Link>
              </nav>
            </div>
          </div>
          <div className="job-detail-topbar__right">
            <button type="button" className="job-detail-topbar__action" aria-label="View notifications">
              <img src="/icons/flashlight-line.svg" alt="" width={20} height={20} aria-hidden="true" />
              <span className="job-detail-topbar__notification" />
            </button>
            <button type="button" className="job-detail-topbar__profile" aria-haspopup="true" aria-label="Open profile menu">
              <span className="job-detail-topbar__avatar">
                <img src="/images/job-search/avatar-topbar.png" alt="Sophia" width={32} height={32} />
              </span>
              <span className="job-detail-topbar__name">Sophia</span>
              <img src="/icons/arrow-down-s-fill.svg" alt="" width={20} height={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="job-detail-hero" aria-hidden="true" />

      <section className="job-detail-banner" aria-label="Job summary banner">
        <div className="job-detail-alert job-detail-alert--sl" role="status">
          <span className="job-detail-alert__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="10" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="7" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <span className="job-detail-alert__text">Job summary by Student Ladder</span>
        </div>
      </section>

      <main className="job-detail-main">
        <div className="job-detail-body">
          <div className="job-detail-columns">
            <div className="job-detail-column job-detail-column--primary">
              <article className="job-overview">
                <div className="job-overview__body" aria-live="polite">
                  <div className="job-overview__header">
                    <h1 className="job-overview__title">{PRIMARY_JOB.title}</h1>
                    <button type="button" className="job-overview__save">
                      <span className="job-overview__save-icon" aria-hidden="true">
                        <img src="/icons/star-smile-fill.svg" alt="" width={20} height={20} />
                      </span>
                      <span>Save Job</span>
                    </button>
                  </div>
                  <p className="job-overview__company">{PRIMARY_JOB.company}</p>
                  <div className="job-overview__meta-block" aria-label="Job meta">
                    <span className="job-overview__divider" aria-hidden="true" />
                    <div className="job-overview__meta">
                      <div className="job-overview__tags" role="list">
                        {PRIMARY_JOB.tags.map((tag) => (
                          <span key={tag.id} className="job-tag" role="listitem">
                            <span className="job-tag__icon" aria-hidden="true">
                              <img src={tag.icon} alt="" width={16} height={16} />
                            </span>
                            <span>{tag.label}</span>
                          </span>
                        ))}
                      </div>
                      <span className="job-overview__posted">{PRIMARY_JOB.posted}</span>
                    </div>
                    <span className="job-overview__divider" aria-hidden="true" />
                  </div>
                </div>
              </article>

              <div className="job-details-wrapper">
                <article className="job-details" aria-label="Method & details">
                  <section className="job-details__section">
                    <div className="job-details__divider">JOB DESCRIPTION</div>
                    <div className="job-details__body job-details__body--description">
                      <div className="job-details__copy">
                        {JOB_DESCRIPTION_PARAGRAPHS.map((paragraph, index) => (
                          <p key={`job-desc-${index}`}>{paragraph}</p>
                        ))}
                      </div>
                      <div className="job-details__media">
                        <img
                          src="/images/job-detail/job-description-image.png"
                          alt="Team working"
                          width={437}
                          height={179}
                        />
                      </div>
                    </div>
                  </section>
                </article>
              </div>

              <section className="job-related" aria-labelledby="job-related-heading">
                <div className="job-related__header" id="job-related-heading">
                  <span className="job-related__label">related jobs</span>
                </div>
                <div className="job-related__frame">
                  <div className="job-related__cards" role="list">
                    {RELATED_JOBS.map((job, index) => (
                      <Fragment key={job.id}>
                        <article className="job-related-card" role="listitem">
                          <div className="job-related-card__content">
                            <div className="job-related-card__row">
                              <div className="job-card__media">
                                <div className="job-card__media-surface">
                                  <img
                                    className="job-card__media-image"
                                    src="/images/job-search/cards/company-logo-box.png"
                                    alt=""
                                    width={138}
                                    height={102}
                                    loading={index ? 'lazy' : 'eager'}
                                  />
                                </div>
                                <div className="job-card__media-badge">
                                  <span aria-hidden="true" className="job-card__media-badge-icon">
                                    <span className="job-search-icon job-search-icon--verified job-search-icon--12" />
                                  </span>
                                  <span className="job-card__media-badge-label">verified</span>
                                </div>
                              </div>
                              <button type="button" className="job-related-card__action" aria-label="Save job">
                                <span className="job-search-icon job-search-icon--star" aria-hidden="true" />
                              </button>
                            </div>
                            <div className="job-related-card__body">
                              <div className="job-related-card__title-row">
                                <h3 className="job-related-card__title">{job.title}</h3>
                                <span className="job-related-card__status">
                                  <img src={job.statusIcon} alt="" width={16} height={16} aria-hidden="true" />
                                  <span>{job.status}</span>
                                </span>
                              </div>
                              <span className="job-related-card__company">{job.company}</span>
                            </div>
                            <div className="job-related-card__footer">
                              <div className="job-related-card__tags" role="list">
                                {job.tags.map((tag) => (
                                  <span key={`${job.id}-${tag.id}`} className="job-related-card__tag" role="listitem">
                                    <span className="job-related-card__tag-icon" aria-hidden="true">
                                      <img src={tag.icon} alt="" width={16} height={16} />
                                    </span>
                                    <span>{tag.label}</span>
                                  </span>
                                ))}
                              </div>
                              <span className="job-related-card__posted">{job.posted}</span>
                            </div>
                          </div>
                        </article>
                        {index < RELATED_JOBS.length - 1 && <span className="job-related__cards-divider" aria-hidden="true" />}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="job-detail-column job-detail-column--sidebar">
              <div className="job-sidebar">
                <div className="job-sidebar__section job-sidebar__section--apply job-sidebar__section--divider">
                  <button type="button" className="job-sidebar__apply" onClick={openModal}>
                    <span className="job-sidebar__apply-icon" aria-hidden="true">
                      <img src="/icons/arrow-right-up-line.svg" alt="" width={20} height={20} />
                    </span>
                    <span>Apply for Job</span>
                  </button>
                </div>

                <section className="job-sidebar__section job-sidebar__section--divider job-sidebar__facts" aria-label="Job facts">
                  <ul className="job-sidebar__fact-list">
                    {SIDEBAR_FACTS_SL.map((fact) => (
                      <li key={fact.id} className="job-sidebar__fact">
                        <span className="job-sidebar__fact-icon" aria-hidden="true">
                          <img src={fact.icon} alt="" width={20} height={20} />
                        </span>
                        <div className="job-sidebar__fact-copy">
                          <span className="job-sidebar__fact-label">{fact.label}</span>
                          <span className="job-sidebar__fact-value">{fact.value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="job-sidebar__section job-sidebar__profile" aria-labelledby="job-sidebar-profile-title">
                  <div className="job-sidebar__profile-card">
                    <div className="job-sidebar__profile-visual">
                      <img src="/images/job-sidebar/profile-card-artwork.png" alt="profile collage" width={255} height={102} />
                      <span className="job-sidebar__profile-badge">
                        <span className="job-sidebar__profile-badge-dot" aria-hidden="true" />
                        <span>unverified</span>
                      </span>
                    </div>
                    <div className="job-sidebar__profile-copy">
                      <p className="job-sidebar__profile-name">Bank of America</p>
                    </div>
                  </div>
                  <div className="job-sidebar__profile-footer">
                    <span id="job-sidebar-profile-title" className="job-sidebar__profile-title">
                      Profile unavailable
                    </span>
                    <button type="button" className="job-sidebar__profile-action" aria-label="Open profile options">
                      <img src="/icons/arrow-right-s-line.svg" alt="" width={18} height={18} />
                    </button>
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {modalContent}
    </div>
  );
}
