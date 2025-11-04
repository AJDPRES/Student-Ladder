"use client";

import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";

import Dropdown from "./Dropdown";

type StudentNavProps = {
  state: "guest" | "student" | "employer" | "admin";
  jobTypes: { slug: string; label: string }[];
};

export default function StudentNav({ state, jobTypes }: StudentNavProps) {
  const isStudent = state === "student";
  const isGuest = state === "guest";
  const showLogout = state === "student" || state === "employer" || state === "admin";

  return (
    <header className="site-nav">
      <div className="site-nav__brand">
        <Link href="/" className="site-nav__logo">
          The Student Ladder
        </Link>
      </div>
      <nav className="site-nav__links" aria-label="Primary navigation">
        <Link href="/job-search" className="site-nav__link">
          Job search
        </Link>
        <Dropdown id="jobs" label="Job types">
          {jobTypes.map((type) => (
            <Link key={type.slug} href={`/${type.slug}/`} className="site-nav__dropdown-link">
              {type.label}
            </Link>
          ))}
        </Dropdown>
        {isStudent && (
          <>
            <Link href="/saved" className="site-nav__link">
              Saved jobs
            </Link>
            <Link href="/settings" className="site-nav__link">
              Settings
            </Link>
          </>
        )}
      </nav>
      <div className="site-nav__actions">
        {isGuest && (
          <>
            <Link href="/login" className="chip chip--ghost">
              Student login
            </Link>
            <Link href="/register" className="chip chip--primary">
              Create account
            </Link>
          </>
        )}
        {showLogout && <LogoutButton className="chip chip--ghost" label="Sign out" />}
      </div>
    </header>
  );
}
