"use client";

import Link from "next/link";
import SearchIconNav from "@/components/icons/SearchIconNav";
import NotificationIcon from "@/components/icons/NotificationIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import styles from "./TopNavigation.module.css";

const navigationLinks = [
  { label: "Job Types", href: "/job-types" },
  { label: "Career Paths", href: "/career-paths" },
  { label: "Companies", href: "/companies" },
];

export default function TopNavigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            student ladder
          </Link>
          <div className={styles.search}>
            <SearchIconNav width={15} height={15} color="var(--icon-muted)" />
            <input type="search" placeholder="Search for your dream job" className={styles.searchInput} />
          </div>
        </div>

        <div className={styles.links}>
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.iconButton} aria-label="Notifications">
            <NotificationIcon width={24} height={24} />
          </button>
          <button type="button" className={styles.profileButton}>
            <span className={styles.profileLabel}>
              <img src="/images/user-avatar.png" alt="Sophia" className={styles.profileAvatar} />
              <span className={styles.profileName}>Sophia</span>
            </span>
            <ChevronDownIcon width={9} height={4} color="var(--text-ink-950)" className={styles.profileChevron} />
          </button>
        </div>
      </div>
    </nav>
  );
}
