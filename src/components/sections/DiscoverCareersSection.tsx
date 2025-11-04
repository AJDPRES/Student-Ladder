import styles from "./DiscoverCareersSection.module.css";
import CareerOptionCards from "./CareerOptionCards";
import CareerPathsDivider from "./CareerPathsDivider";
import CareerPathsViewer from "./CareerPathsViewer";

export default function DiscoverCareersSection() {
  return (
    <section className={styles.section} aria-labelledby="discover-careers-heading">
      <div className={`site-container ${styles.containerOverride}`}>
        <div className={styles.subHeader}>
          <div className={styles.subHeaderAccent} aria-hidden="true" />
          <div className={styles.subHeaderContent}>
            <p id="discover-careers-heading" className={styles.title}>
              Discover careers
            </p>
          </div>
          <button type="button" className={styles.subHeaderButton}>
            <span className={styles.subHeaderLabel}>View all careers</span>
            <span className={styles.subHeaderIcon} aria-hidden="true" />
          </button>
        </div>
        <CareerOptionCards />
        <CareerPathsDivider />
        <CareerPathsViewer />
      </div>
    </section>
  );
}
