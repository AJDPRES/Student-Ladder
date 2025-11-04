import styles from "./PopularCompaniesGrid.module.css";

type CompanyCard = {
  name: string;
  jobsLabel: string;
  descriptor: string;
  logo: string;
  logoAlt: string;
};

const COMPANY_CARDS: CompanyCard[] = [
  { name: "Bank of America", jobsLabel: "148 Jobs", descriptor: "Finance", logo: "/images/company-cards/company-logo.png", logoAlt: "Bank of America logo" },
  { name: "Amazon", jobsLabel: "210 Jobs", descriptor: "Technology", logo: "/images/company-cards/company-logo.png", logoAlt: "Amazon logo" },
  { name: "Microsoft", jobsLabel: "185 Jobs", descriptor: "Software", logo: "/images/company-cards/company-logo.png", logoAlt: "Microsoft logo" },
  { name: "Google", jobsLabel: "162 Jobs", descriptor: "Engineering", logo: "/images/company-cards/company-logo.png", logoAlt: "Google logo" },
  { name: "Goldman Sachs", jobsLabel: "134 Jobs", descriptor: "Investment Banking", logo: "/images/company-cards/company-logo.png", logoAlt: "Goldman Sachs logo" },
  { name: "Deloitte", jobsLabel: "118 Jobs", descriptor: "Consulting", logo: "/images/company-cards/company-logo.png", logoAlt: "Deloitte logo" },
  { name: "PwC", jobsLabel: "126 Jobs", descriptor: "Professional Services", logo: "/images/company-cards/company-logo.png", logoAlt: "PwC logo" },
  { name: "Bloomberg", jobsLabel: "97 Jobs", descriptor: "Media & Finance", logo: "/images/company-cards/company-logo.png", logoAlt: "Bloomberg logo" },
  { name: "J.P. Morgan", jobsLabel: "153 Jobs", descriptor: "Financial Services", logo: "/images/company-cards/company-logo.png", logoAlt: "J.P. Morgan logo" },
  { name: "BlackRock", jobsLabel: "88 Jobs", descriptor: "Asset Management", logo: "/images/company-cards/company-logo.png", logoAlt: "BlackRock logo" },
];

export default function PopularCompaniesGrid() {
  return (
    <div className={styles.grid} role="list">
      {COMPANY_CARDS.map((company) => (
        <article className={styles.card} key={company.name} role="listitem">
          <div className={styles.cardMedia} aria-hidden="true">
            <span className={styles.cardArtwork} />
            <div className={styles.logoTile}>
              <div className={styles.logoContainer}>
                <img src={company.logo} alt={company.logoAlt} className={styles.logo} />
              </div>
            </div>
          </div>
          <div className={styles.cardMeta}>
            <h3 className={styles.companyName}>{company.name}</h3>
            <div className={styles.metaRow}>
              <span className={`${styles.metaBadge} ${styles.metaJobsLabel}`}>
                {company.jobsLabel}
              </span>
              <span className={styles.metaDot} aria-hidden="true" />
              <span className={`${styles.metaBadge} ${styles.metaDescriptor}`}>
                {company.descriptor}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
