import Link from "next/link";
import styles from "./CareerOptionCards.module.css";

type CareerOption = {
  title: string;
  description: string;
  href: string;
};

const CAREER_OPTIONS: CareerOption[] = [
  {
    title: "Work Experience",
    description: "Shadow staff and see a workplace up close.",
    href: "/careers/work-experience",
  },
  {
    title: "Insight Days",
    description: "Spend a day exploring roles across different teams.",
    href: "/careers/insight-days",
  },
  {
    title: "Apprenticeships",
    description: "Earn while you learn on structured training routes.",
    href: "/careers/apprenticeships",
  },
  {
    title: "Internships",
    description: "Build real projects and deepen your skillset over the summer.",
    href: "/careers/internships",
  },
  {
    title: "Graduate Schemes",
    description: "Rotate across teams designed for new graduates.",
    href: "/careers/graduate-schemes",
  },
];

export default function CareerOptionCards() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {CAREER_OPTIONS.map((option) => (
          <article className={styles.card} key={option.title}>
            <div className={styles.cardMedia} aria-hidden="true">
              <div className={styles.cardImage}>
                <img src="/images/career-card-image.png" alt="" loading="lazy" />
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.cardBadgeIcon} aria-hidden="true">
                  <span className={styles.cardBadgeIconMask} />
                </span>
                <span className={styles.cardTitle}>{option.title}</span>
              </div>
              <p className={styles.cardDescription}>{option.description}</p>
              <Link href={option.href} className={styles.cardLink}>
                Explore
                <span className={styles.cardLinkIcon} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
