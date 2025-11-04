import styles from "./FindCompanySection.module.css";
import PopularCompaniesDivider from "./PopularCompaniesDivider";
import PopularCompaniesGrid from "./PopularCompaniesGrid";
import PopularCompaniesDividerLine from "./PopularCompaniesDividerLine";

export default function FindCompanySection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="find-company-heading"
    >
      <div className={`site-container ${styles.containerOverride}`}>
        <PopularCompaniesDividerLine />
        <div className={styles.subHeader}>
          <div className={styles.subHeaderAccent} aria-hidden="true" />
          <div className={styles.subHeaderContent}>
            <p id="find-company-heading" className={styles.title}>
              Find the company for you
            </p>
          </div>
          <button type="button" className={styles.subHeaderButton}>
            <span className={styles.subHeaderLabel}>View all companies</span>
            <span className={styles.subHeaderIcon} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.companiesSection}>
          <div className={styles.dividerWrapper}>
            <PopularCompaniesDivider />
          </div>
          <div className={styles.gridWrapper}>
            <PopularCompaniesGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
