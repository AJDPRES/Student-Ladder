import ActionIcon from "@/components/icons/ActionIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import SearchBox from "@/components/ui/SearchBox";
import FloatingCard from "./FloatingCard";
import styles from "./HomepageHeader.module.css";

const LEFT_CARDS = [
  { top: 360, left: -40, scale: 1, blur: 0, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 120, left: -80, scale: 0.95, blur: 2, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 260, left: -160, scale: 0.7, blur: 6, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 520, left: -110, scale: 0.8, blur: 4, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 40, left: 60, scale: 0.6, blur: 7, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 440, left: 100, scale: 0.85, blur: 3, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 240, left: 150, scale: 0.55, blur: 9, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 600, left: 40, scale: 0.65, blur: 5, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
];

const RIGHT_CARDS = [
  { top: 420, right: 120, scale: 1, blur: 0, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 160, right: -90, scale: 0.9, blur: 2, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 320, right: -150, scale: 0.65, blur: 8, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 60, right: 80, scale: 0.58, blur: 6, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 240, right: 40, scale: 0.78, blur: 4, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 520, right: -20, scale: 0.68, blur: 4, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 360, right: 160, scale: 0.6, blur: 7, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
  { top: 80, right: -40, scale: 0.72, blur: 5, title: "The Washington Post", logo: "/images/washington-post-logo.png" },
];

export default function HomepageHeader() {
  return (
    <section className={styles.section} aria-label="Homepage header">
      <div aria-hidden="true" className={styles.backdrop} />
      <div aria-hidden="true" className={styles.cardLayer}>
        {LEFT_CARDS.map((card, index) => (
          <FloatingCard key={`left-${index}`} {...card} />
        ))}
        {RIGHT_CARDS.map((card, index) => (
          <FloatingCard key={`right-${index}`} {...card} />
        ))}
      </div>

      <div className={styles.menu}>
        <div className={`${styles.menuInner} site-container`}>
          <nav className={styles.navLinks} aria-label="Primary">
            <a href="/#job-types" className={styles.navLink}>
              Job Types
            </a>
            <a href="/#career-paths" className={styles.navLink}>
              Career Paths
            </a>
            <a href="/#companies" className={styles.navLink}>
              Companies
            </a>
          </nav>
          <a href="/" className={styles.logo} aria-label="Student Ladder">
            <img src="/logo-wordmark.svg" alt="Student Ladder" className={styles.logoMark} />
          </a>
          <div className={styles.actions}>
            <ActionIcon />
            <button type="button" className={styles.profileButton}>
              <span className={styles.avatar}>
                <img src="/images/user-avatar.png" alt="Sophia" className={styles.avatarImage} />
              </span>
              <span className={styles.profileName}>Sophia</span>
              <ChevronDownIcon className={styles.profileChevron} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.contentWrap} site-container`}>
        <div className={styles.centerBox}>
          <div className={styles.headingBlock}>
            <h1 className={styles.title}>Launch your career</h1>
            <p className={styles.subtitle}>
              Explore &amp; apply
              <br />
              for roles that match you.
            </p>
          </div>
          <SearchBox />
        </div>
      </div>
    </section>
  );
}
