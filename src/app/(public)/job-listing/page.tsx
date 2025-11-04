import Link from 'next/link';

export const dynamic = 'force-static';

const RELATED_JOBS = [
  {
    id: 'curve-ssa-analyst-1',
    title: 'Sub-Saharan Africa (SSA) Investment Banking 2025 Analyst – London',
    company: 'Curve',
    status: 'Live',
    statusIcon: '/icons/flashlight-fill.svg',
    image: {
      src: '/images/job-search/cards/job-card-hero.png',
      width: 138,
      height: 102,
    },
    tags: [
      { id: 'journalism', label: 'Journalism', icon: '/icons/archive-2-fill.svg' },
      { id: 'internship', label: 'Internship', icon: '/icons/apps-2-fill.svg' },
    ],
    posted: 'Posted 4 days ago',
  },
  {
    id: 'curve-ssa-analyst-2',
    title: 'Sub-Saharan Africa (SSA) Investment Banking 2025 Analyst – London',
    company: 'Curve',
    status: 'Live',
    statusIcon: '/icons/flashlight-fill.svg',
    image: {
      src: '/images/job-search/cards/job-card-hero.png',
      width: 138,
      height: 102,
    },
    tags: [
      { id: 'journalism', label: 'Journalism', icon: '/icons/archive-2-fill.svg' },
      { id: 'internship', label: 'Internship', icon: '/icons/apps-2-fill.svg' },
    ],
    posted: 'Posted 4 days ago',
  },
];

export default function JobListingPrototypePage() {
  return (
    <div className="job-detail-page">
      {/* Sticky Topbar (from MCP: Topbar [Navigation] [1.0]) */}
      <div className="job-detail-topbar" role="navigation" aria-label="Topbar">
        <div className="job-detail-topbar__inner">
          {/* Left cluster: logo, search, navigation */}
          <div className="job-detail-topbar__left" aria-hidden={false}>
            <Link href="/" className="job-detail-topbar__logo" aria-label="Student Ladder">
              <img src="/logo-wordmark-black.svg" alt="" width={178} height={24} />
            </Link>
            <div className="job-detail-topbar__left-group">
              <label className="job-detail-topbar__search" aria-label="Search">
                <span className="job-detail-topbar__search-icon" aria-hidden="true">
                  <img src="/icons/search-2-line.svg" alt="" className="job-detail-topbar__search-icon-image" />
                </span>
                <input type="search" placeholder="Search for your dream job" />
              </label>
              <nav className="job-detail-topbar__nav" aria-label="Primary">
                <Link href="/#job-types" className="job-detail-topbar__nav-item">Job Types</Link>
                <Link href="/#career-paths" className="job-detail-topbar__nav-item">Career Paths</Link>
                <Link href="/#companies" className="job-detail-topbar__nav-item">Companies</Link>
              </nav>
            </div>
          </div>
          <span className="job-detail-topbar__gap" aria-hidden="true" />
          {/* Right cluster (Actions + Profile) */}
          <div className="job-detail-topbar__right">
            <div className="job-detail-topbar__actions">
              <button type="button" className="job-detail-topbar__action" aria-label="View notifications">
                <img src="/icons/flashlight-line.svg" alt="" width={20} height={20} aria-hidden="true" />
                <span className="job-detail-topbar__notification" />
              </button>
            </div>
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

      <header className="job-detail-hero" aria-label="Job header" />

      <main className="job-detail-main">
        <div className="job-detail-body">
          <div className="job-detail-alert">
            <span className="job-detail-alert__icon" aria-hidden="true" />
            <span className="job-detail-alert__text">Job scheme by Bank of America</span>
          </div>

          <div className="job-detail-columns">
            <div className="job-detail-column job-detail-column--primary">
              <article className="job-overview">
                <div className="job-overview__inner">
                  <header className="job-overview__header">
                    <h1 className="job-overview__title">Sub-Saharan Africa (SSA) Investment Banking 2025 Analyst – London</h1>
                    <button type="button" className="job-overview__save">
                      <span className="job-overview__save-icon" aria-hidden="true" />
                      <span>Save job</span>
                    </button>
                  </header>
                  <p className="job-overview__company">Bank of America</p>
                  <span className="job-overview__divider" aria-hidden="true" />
                  <div className="job-overview__meta">
                    <div className="job-overview__tags">
                      <span className="job-tag">
                        <img src="/icons/book-3-line.svg" alt="" width={16} height={16} aria-hidden="true" />
                        <span>Journalism</span>
                      </span>
                      <span className="job-tag">
                        <img src="/icons/apps-2-line.svg" alt="" width={16} height={16} aria-hidden="true" />
                        <span>Internship</span>
                      </span>
                    </div>
                    <span className="job-overview__posted">Posted 4 days ago</span>
                  </div>
                  <span className="job-overview__divider" aria-hidden="true" />
                </div>
              </article>

              <article className="job-details">
                <section className="job-details__section">
                  <div className="job-details__divider">
                    <span>Job description</span>
                  </div>
                  <div className="job-details__body job-details__body--description">
                    <div className="job-details__copy">
                      <p>
                        Job description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job
                        listing one. Description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes
                        from job listing one.
                      </p>
                      <p>
                        Job description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job
                        listing one. Description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes
                        from job listing one.
                      </p>
                    </div>
                    <div className="job-details__media">
                      <img
                        src="/images/job-detail/job-description-image.png"
                        alt=""
                        width={437}
                        height={179}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </section>

                <section className="job-details__section">
                  <div className="job-details__divider">
                    <span>Responsibilities</span>
                  </div>
                  <div className="job-details__body job-details__body--notes">
                    <ul className="job-details-list">
                      <li>Support the structuring and execution of new transactions across multiple SSA markets.</li>
                      <li>Prepare detailed market analysis, pitch materials, and investment committee documentation.</li>
                      <li>Collaborate with regional leads to deliver strategic insights for clients and internal stakeholders.</li>
                    </ul>
                  </div>
                </section>

                <section className="job-details__section">
                  <div className="job-details__divider">
                    <span>How to apply</span>
                  </div>
                  <div className="job-details__body">
                    <p>
                      Submit your CV and cover letter via the Bank of America careers portal. Shortlisted applicants will be contacted within two weeks of the
                      posting deadline and invited to complete a digital interview and assessment centre.
                    </p>
                  </div>
                </section>
              </article>

              <section className="job-related" aria-labelledby="job-related-heading">
                <div className="job-related__frame">
                  <div className="job-related__header">
                    <div className="job-related__divider">
                      <span id="job-related-heading" className="job-related__divider-text">related jobs</span>
                    </div>
                  </div>
                  <div className="job-related__body">
                    <div className="job-related__cards" role="list">
                      {RELATED_JOBS.map((job, index) => (
                        <article key={job.id} className="job-related-card" role="listitem">
                          <div className="job-related-card__frame">
                            <div className="job-related-card__stack">
                              <div className="job-related-card__cluster">
                                <div className="job-related-card__header">
                                  <div className="job-related-card__media">
                                    <div className="job-card__media">
                                      <img
                                        src={job.image.src}
                                        alt=""
                                        width={job.image.width}
                                        height={job.image.height}
                                        loading={index > 0 ? 'lazy' : 'eager'}
                                      />
                                      <div className="job-card__media-badge">
                                        <span aria-hidden="true" className="job-card__media-badge-icon">
                                          <span className="job-search-icon job-search-icon--verified job-search-icon--12" />
                                        </span>
                                        <span>verified</span>
                                      </div>
                                    </div>
                                  </div>
                                  <button type="button" className="job-related-card__save" aria-label="Save job">
                                    <img src="/icons/star-smile-fill.svg" alt="" width={20} height={20} aria-hidden="true" />
                                  </button>
                                </div>
                                <div className="job-related-card__info">
                                  <div className="job-related-card__title-row">
                                    <h3 className="job-card__title job-related-card__title">{job.title}</h3>
                                    <span className="job-related-card__status">
                                      <img src={job.statusIcon} alt="" width={16} height={16} aria-hidden="true" />
                                      <span className="job-related-card__status-label">{job.status}</span>
                                    </span>
                                  </div>
                                  <span className="job-related-card__company">{job.company}</span>
                                </div>
                              </div>
                              <div className="job-related-card__tags-row">
                                <div className="job-related-card__tags">
                                  {job.tags.map((tag) => (
                                    <span key={tag.id} className="job-related-card__tag">
                                      <img src={tag.icon} alt="" width={16} height={16} aria-hidden="true" />
                                      <span className="job-related-card__tag-label">{tag.label}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="job-related-card__posted">{job.posted}</span>
                            </div>
                          </div>
                          {index < RELATED_JOBS.length - 1 && <span className="job-related-card__divider" aria-hidden="true" />}
                        </article>
                      ))}
                    </div>
                    <span className="job-related__bottom-divider" aria-hidden="true" />
                  </div>
                </div>
              </section>
            </div>

            <aside className="job-detail-column job-detail-column--sidebar">
              <div className="job-sidebar-shell">
                <div className="job-sidebar" aria-labelledby="job-sidebar-profile-title">
                  <section className="job-sidebar__persona">
                    <div className="job-sidebar__persona-frame">
                      <button type="button" className="job-sidebar__apply">
                        <span className="job-sidebar__apply-icon" aria-hidden="true">
                          <img
                            src="/images/job-sidebar/profile-card-apply-icon.svg"
                            alt=""
                            width={20}
                            height={20}
                          />
                        </span>
                        <span className="job-sidebar__apply-label">Apply for Job</span>
                      </button>
                    </div>
                  </section>

                  <section className="job-sidebar__facts">
                    <ul className="job-sidebar__fact-list">
                      <li className="job-sidebar__fact">
                        <span className="job-sidebar__fact-icon" aria-hidden="true">
                          <span className="job-sidebar__fact-glyph job-sidebar__fact-glyph--deadline" />
                        </span>
                        <div className="job-sidebar__fact-copy">
                          <span className="job-sidebar__fact-label">closing date</span>
                          <span className="job-sidebar__fact-value">16th April 2024</span>
                        </div>
                      </li>
                      <li className="job-sidebar__fact">
                        <span className="job-sidebar__fact-icon" aria-hidden="true">
                          <span className="job-sidebar__fact-glyph job-sidebar__fact-glyph--salary" />
                        </span>
                        <div className="job-sidebar__fact-copy">
                          <span className="job-sidebar__fact-label">salary</span>
                          <span className="job-sidebar__fact-value">Competitive Salary</span>
                        </div>
                      </li>
                      <li className="job-sidebar__fact">
                        <span className="job-sidebar__fact-icon" aria-hidden="true">
                          <span className="job-sidebar__fact-glyph job-sidebar__fact-glyph--location" />
                        </span>
                        <div className="job-sidebar__fact-copy">
                          <span className="job-sidebar__fact-label">location</span>
                          <span className="job-sidebar__fact-value">London, UK</span>
                        </div>
                      </li>
                    </ul>
                  </section>

                  <section className="job-sidebar__profile">
                    <div className="job-sidebar__profile-content">
                      <div className="job-sidebar__profile-media">
                        <div className="job-sidebar__profile-visual">
                          <img
                            src="/images/job-sidebar/profile-card-artwork.png"
                            alt=""
                            width={255}
                            height={102}
                          />
                          <span className="job-sidebar__profile-badge">
                            <img
                              src="/images/job-sidebar/profile-card-verified-icon.svg"
                              alt=""
                              width={12}
                              height={12}
                            />
                            <span className="job-sidebar__profile-badge-text">verified</span>
                          </span>
                        </div>
                      </div>
                      <div className="job-sidebar__profile-copy">
                        <p className="job-sidebar__profile-name">Bank of America</p>
                        <p className="job-sidebar__profile-description">
                          I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design,
                          brand strategy, and Webflow development.
                        </p>
                      </div>
                    </div>
                    <div className="job-sidebar__profile-header">
                      <span className="job-sidebar__profile-title" id="job-sidebar-profile-title">
                        Profile
                      </span>
                      <button type="button" className="job-sidebar__profile-action" aria-label="Open profile options">
                        <img
                          src="/images/job-sidebar/profile-card-compact-button.svg"
                          alt=""
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </aside>
          </div>
      </div>
    </main>
    </div>
  );
}
