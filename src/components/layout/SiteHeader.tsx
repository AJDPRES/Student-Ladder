"use client";

import Link from "next/link";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          student ladder
        </Link>
        <nav className={styles.nav}>
          <Link className={styles.navLink} href="/">Home</Link>
          <Link className={styles.navLink} href="/#job-types">Job Types</Link>
          <Link className={styles.navLink} href="/#companies">Companies</Link>
          <Link className={styles.navLink} href="/articles">Articles</Link>
          <Link className={styles.navLink} href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
