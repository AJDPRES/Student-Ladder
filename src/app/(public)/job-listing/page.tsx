import Link from 'next/link';

export const dynamic = 'force-static';

const JOB_MEDIA = '/images/job-search/cards/related-job-hero.png';
const RELATED_JOB_ACTION = '/images/job-search/cards/related-job-save.svg';

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

const JOB_REQUIREMENTS = [
  {
    id: 'req-arthur-taylor',
    title: 'Meeting with Arthur Taylor',
    description: 'Discuss the MVP version of Apex Mobile and Desktop app.',
    date: 'Aug 02',
  },
];

const JOB_BENEFITS = [
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

export default function JobListingPrototypePage() {
  return (
    <div className="job-detail-page">
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

      <section className="job-detail-banner" aria-label="Job scheme banner">
        <div className="job-detail-alert" role="status">
          <span className="job-detail-alert__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
              <path
                d="M20.1 19.2H21.9V21H2.10001V19.2H3.90001V3.9C3.90001 3.66131 3.99483 3.43239 4.16361 3.2636C4.33239 3.09482 4.56131 3 4.80001 3H19.2C19.4387 3 19.6676 3.09482 19.8364 3.2636C20.0052 3.43239 20.1 3.66131 20.1 3.9V19.2ZM18.3 19.2V4.8H5.70001V19.2H18.3ZM8.40001 11.1H11.1V12.9H8.40001V11.1ZM8.40001 7.5H11.1V9.3H8.40001V7.5ZM8.40001 14.7H11.1V16.5H8.40001V14.7ZM12.9 14.7H15.6V16.5H12.9V14.7ZM12.9 11.1H15.6V12.9H12.9V11.1ZM12.9 7.5H15.6V9.3H12.9V7.5Z"
                fill="#F17B2C"
              />
            </svg>
          </span>
          <span className="job-detail-alert__text">Job scheme by Bank of America</span>
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
                        <img src="/images/job-detail/job-description-image.png" alt="Team working" width={437} height={179} />
                      </div>
                    </div>
                  </section>

                  <section className="job-details__section">
                    <div className="job-details__divider">JOB REQUIREMENTS</div>
                    <div className="job-details__body job-details__body--notes" role="list">
                      {JOB_REQUIREMENTS.map((note) => (
                        <div key={note.id} className="job-note" role="listitem">
                          <span className="job-note__icon" aria-hidden="true">
                            <img src="/icons/select-box-circle-fill.svg" alt="" width={20} height={20} />
                          </span>
                          <div className="job-note__content">
                            <p className="job-note__title">{note.title}</p>
                            <p className="job-note__description">{note.description}</p>
                          </div>
                          <span className="job-note__date">{note.date}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="job-details__section">
                    <div className="job-details__divider">JOB BENEFITS</div>
                    <div className="job-details__body job-details__body--notes" role="list">
                      {JOB_BENEFITS.map((note) => (
                        <div key={note.id} className="job-note" role="listitem">
                          <span className="job-note__icon" aria-hidden="true">
                            <img src="/icons/select-box-circle-fill.svg" alt="" width={20} height={20} />
                          </span>
                          <div className="job-note__content">
                            <p className="job-note__title">{note.title}</p>
                            <p className="job-note__description">{note.description}</p>
                          </div>
                          <span className="job-note__date">{note.date}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </article>
              </div>

              <section className="job-related" aria-labelledby="job-related-heading">
                <div className="job-related__frame">
                  <div className="job-related__header" id="job-related-heading">
                    <span className="job-related__line" aria-hidden="true" />
                    <span className="job-related__label">RELATED JOBS</span>
                    <span className="job-related__line" aria-hidden="true" />
                  </div>
                  <div className="job-related__cards" role="list">
                    {RELATED_JOBS.map((job, index) => (
                      <article key={job.id} className="job-related-card" role="listitem">
                        <div className="job-related-card__row">
                          <div className="job-related-card__media-group">
                            <div className="job-related-card__media">
                              <img
                                src={job.image.src}
                                alt="Company preview"
                                width={job.image.width}
                                height={job.image.height}
                                loading={index ? 'lazy' : 'eager'}
                              />
                            </div>
                            <span className="job-related-card__media-badge">
                              <img src="/icons/verified-line.svg" alt="" width={12} height={12} aria-hidden="true" />
                              <span>verified</span>
                            </span>
                          </div>
                          <button type="button" className="job-related-card__action" aria-label="Save job">
                            <img src={RELATED_JOB_ACTION} alt="" width={40} height={36} loading="lazy" />
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
                        {index < RELATED_JOBS.length - 1 && <span className="job-related-card__divider" aria-hidden="true" />}
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="job-detail-column job-detail-column--sidebar">
              <div className="job-sidebar">
                <div className="job-sidebar__section job-sidebar__section--apply job-sidebar__section--divider">
                  <button type="button" className="job-sidebar__apply">
                    <span className="job-sidebar__apply-icon" aria-hidden="true">
                      <img src="/icons/arrow-right-up-line.svg" alt="" width={20} height={20} />
                    </span>
                    <span>Apply for Job</span>
                  </button>
                </div>

                <section className="job-sidebar__section job-sidebar__section--divider job-sidebar__facts" aria-label="Job facts">
                  <ul className="job-sidebar__fact-list">
                    {SIDEBAR_FACTS.map((fact) => (
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
                        <img src="/images/job-sidebar/profile-card-verified-icon.svg" alt="" width={12} height={12} aria-hidden="true" />
                        <span>verified</span>
                      </span>
                    </div>
                    <div className="job-sidebar__profile-copy">
                      <p className="job-sidebar__profile-name">Bank of America</p>
                      <p className="job-sidebar__profile-description">
                        I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.
                      </p>
                    </div>
                  </div>
                  <div className="job-sidebar__profile-footer">
                    <span id="job-sidebar-profile-title" className="job-sidebar__profile-title">
                      Profile
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
    </div>
  );
}
