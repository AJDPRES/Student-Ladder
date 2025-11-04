import styles from "./RecentJobsSection.module.css";

const AVATAR_GROUP_IMAGE = "/images/recent-jobs-avatars.png";
const AVATAR_GROUP_IMAGE_2X = "/images/recent-jobs-avatars-2x.png";

type JobCard = {
  title: string;
  company: string;
  logoSrc?: string;
  logoAlt?: string;
  logoFallback?: string;
};

const JOBS: JobCard[] = [
  {
    title: "Sub-Saharan Africa (SSA) Investment Banking 2025 Analyst – London",
    company: "Curve",
    logoSrc: "/images/job-card-artwork-curve.png",
    logoAlt: "Curve logo",
  },
  {
    title: "Summer Assurance Associate Programme 2025",
    company: "PwC",
    logoFallback: "PwC",
  },
  {
    title: "Global Markets Off-Cycle Analyst",
    company: "Bank of America",
    logoSrc: "/images/bank-of-america-logo.png",
    logoAlt: "Bank of America logo",
  },
  {
    title: "Growth Marketing Intern",
    company: "Canva",
    logoFallback: "Canva",
  },
  {
    title: "Strategy & Operations Fellow",
    company: "Google",
    logoFallback: "Google",
  },
  {
    title: "Early Careers Product Designer",
    company: "Notion",
    logoFallback: "Notion",
  },
];

const VerifiedGlyph = () => (
  <svg
    className={styles.miniJobBadgeGlyph}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    aria-hidden="true"
  >
    <path
      d="M6 1.25a.5.5 0 0 1 .323.118l1.144.964 1.48-.166a.5.5 0 0 1 .53.391l.332 1.462 1.312.78a.5.5 0 0 1 .158.733l-.87 1.198.341 1.454a.5.5 0 0 1-.37.595l-1.436.326-.88 1.198a.5.5 0 0 1-.733.102L6 9.59l-1.35.745a.5.5 0 0 1-.733-.102l-.88-1.198-1.435-.326a.5.5 0 0 1-.37-.595l.34-1.454-.87-1.198a.5.5 0 0 1 .158-.733l1.312-.78.333-1.462a.5.5 0 0 1 .53-.391l1.48.166 1.144-.964A.5.5 0 0 1 6 1.25Zm1.152 3.09a.45.45 0 0 0-.317.139L5.54 5.877l-.375-.341a.45.45 0 1 0-.606.666l.69.627a.45.45 0 0 0 .622-.012l1.705-1.73a.45.45 0 0 0-.425-.697Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

export default function RecentJobsSection() {
  const marqueeJobs = [...JOBS, ...JOBS];

  return (
    <section
      className={styles.section}
      aria-labelledby="recent-jobs-heading"
    >
      <div className={styles.statsCard}>
        <span className={styles.statsLine} aria-hidden="true" />
        <p id="usage-stats-heading" className={styles.statsText}>
          used by +1 million students
        </p>
        <span className={styles.avatarGroup} aria-hidden="true">
          <img
            src={AVATAR_GROUP_IMAGE}
            srcSet={`${AVATAR_GROUP_IMAGE} 1x, ${AVATAR_GROUP_IMAGE_2X} 2x`}
            alt=""
            className={styles.avatarGroupImage}
            loading="lazy"
          />
        </span>
        <span className={styles.statsLine} aria-hidden="true" />
      </div>

      <div className={`site-container ${styles.inner}`}>
        <article className={styles.card} aria-labelledby="recent-jobs-heading">
          <h2 id="recent-jobs-heading" className={styles.visuallyHidden}>
            Recent jobs section
          </h2>
          <div
            className={styles.recentJobsSlider}
            role="region"
            aria-label="Recent jobs slider"
          >
            <div className={styles.recentJobsSliderViewport}>
              <div className={styles.recentJobsSliderTrack} role="list">
                {marqueeJobs.map((job, index) => (
                  <article
                    className={styles.miniJob}
                    key={`${job.title}-${index}`}
                    role="listitem"
                    aria-hidden={index >= JOBS.length}
                  >
                    <div className={styles.miniJobMedia} aria-hidden="true">
                      <div className={styles.miniJobTile}>
                        {job.logoSrc ? (
                          <img
                            src={job.logoSrc}
                            alt={job.logoAlt ?? ""}
                            className={styles.miniJobLogoImage}
                            loading={index > 2 ? "lazy" : "eager"}
                          />
                        ) : (
                          <span className={styles.miniJobLogoFallback}>
                            {job.logoFallback}
                          </span>
                        )}
                      </div>
                      <span className={styles.miniJobBadge}>
                        <VerifiedGlyph />
                        Verified
                      </span>
                    </div>
                    <div className={styles.miniJobBody}>
                      <h3 className={styles.miniJobTitle}>{job.title}</h3>
                      <p className={styles.miniJobCompany}>{job.company}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
