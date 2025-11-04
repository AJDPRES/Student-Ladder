"use client";

import SearchIcon from "@/components/icons/SearchIcon";
import styles from "./SearchBox.module.css";

type SearchBoxAlign = "center" | "left";

interface SearchBoxProps {
  align?: SearchBoxAlign;
}

export default function SearchBox({ align = "center" }: SearchBoxProps) {
  return (
    <form
      role="search"
      className={align === "left" ? `${styles.form} ${styles.formLeft}` : styles.form}
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="sr-only" htmlFor="q">
        Search jobs
      </label>
      <div className={styles.wrapper}>
        <input id="q" name="q" placeholder="Search for your dream job" className={styles.input} />
        <SearchIcon className={styles.icon} aria-hidden="true" />
      </div>
    </form>
  );
}
