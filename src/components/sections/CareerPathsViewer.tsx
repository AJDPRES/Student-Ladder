import Image from "next/image";
import styles from "./CareerPathsViewer.module.css";

const SUBMENU_ITEMS = [
  {
    label: "Popular",
    icon: "/icons/user-star-line.svg",
    active: true,
  },
  {
    label: "Business, Finance & Law",
    icon: "/icons/money-pound-circle-line.svg",
    active: false,
  },
  {
    label: "Sciences",
    icon: "/icons/test-tube-line.svg",
    active: false,
  },
  {
    label: "Technology",
    icon: "/icons/layout-grid-line.svg",
    active: false,
  },
  {
    label: "Creative",
    icon: "/icons/layout-grid-line.svg",
    active: false,
  },
  {
    label: "Architecture & Real Estate",
    icon: "/icons/layout-grid-line.svg",
    active: false,
  },
  {
    label: "Government, Policy & Non-Profit",
    icon: "/icons/government-line.svg",
    active: false,
  },
  {
    label: "Education",
    icon: "/icons/graduation-cap-line.svg",
    active: false,
  },
  {
    label: "Defence & Emergency Services",
    icon: "/icons/secure-payment-fill.svg",
    active: false,
  },
  {
    label: "Transport & Logistics",
    icon: "/icons/truck-line.svg",
    active: false,
  },
  {
    label: "Retail, Hospitality & Leisure",
    icon: "/icons/shopping-bag-2-line.svg",
    active: false,
  },
];

type CareerPathCardData = {
  title: string;
  companies: string;
  jobs: string;
  image: string;
};

const CARDS: CareerPathCardData[] = Array.from({ length: 8 }, () => ({
  title: "Engineering",
  companies: "44 Companies",
  jobs: "148 Jobs",
  image: "/images/career-path-card-bg.png",
}));

const chunkIntoRows = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export default function CareerPathsViewer() {
  const rows = chunkIntoRows(CARDS, 4);

  return (
    <div className={styles.viewer}>
      <aside className={styles.submenu} aria-label="Career path filters">
        <ul className={styles.submenuList}>
          {SUBMENU_ITEMS.map((item) => (
            <li key={item.label} className={styles.submenuItemWrapper}>
              <button
                type="button"
                className={
                  item.active ? styles.submenuFeatured : styles.submenuItem
                }
                aria-pressed={item.active}
              >
                <span className={styles.submenuContent}>
                  <span className={styles.submenuIconWrapper}>
                    <span
                      className={styles.submenuIcon}
                      style={{ maskImage: `url(${item.icon})` }}
                      data-active={item.active}
                    />
                  </span>
                  <span
                    className={styles.submenuLabel}
                    data-active={item.active}
                  >
                    {item.label}
                  </span>
                </span>
                {item.active ? (
                  <span className={styles.submenuArrow}>
                    <span className={styles.submenuArrowIcon} />
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className={styles.cardGroups} aria-live="polite">
        {rows.map((row, rowIndex) => (
          <div className={styles.cardRow} key={`row-${rowIndex}`}>
            {row.map((card, cardIndex) => (
              <article className={styles.card} key={`card-${cardIndex}`}>
                <div className={styles.cardCanvas}>
                  <div className={styles.cardBase} aria-hidden="true" />
                  <div className={styles.cardSurface}>
                    <div className={styles.cardImageWrapper}>
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        priority={false}
                        className={styles.cardImage}
                        sizes="175px"
                      />
                    </div>
                    <div className={styles.cardBadges}>
                      <span className={styles.cardBadge}>{card.companies}</span>
                      <span className={styles.cardBadge}>{card.jobs}</span>
                    </div>
                  </div>
                </div>
                <span className={styles.cardTitle}>{card.title}</span>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
