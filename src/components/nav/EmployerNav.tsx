"use client";

import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";

type EmployerNavProps = {
  state: "guest" | "employer" | "student" | "admin";
  company: { name: string; slug: string } | null;
};

export default function EmployerNav({ state, company }: EmployerNavProps) {
  const isEmployer = state === "employer";
  const isGuest = state === "guest";
  const showLogout = state === "employer" || state === "student" || state === "admin";
  const companyHref = company ? `/company/${company.slug}/` : null;

  return (
    <header className="site-nav">
      <div className="site-nav__brand">
        <Link href="/" className="site-nav__logo">
          The Student Ladder
        </Link>
        {isEmployer && company && (
          <span className="chip chip--ghost" aria-live="polite">
            Managing {company.name}
          </span>
        )}
      </div>
      <nav className="site-nav__links" aria-label="Employer navigation">
        <Link href="/employer/dashboard" className="site-nav__link">
          Dashboard
        </Link>
        {isEmployer && (
          <>
            <Link href="/employer/jobs/new" className="site-nav__link">
              Post a job
            </Link>
            <Link href="/employer/onboard" className="site-nav__link">
              Company profile
            </Link>
            {companyHref && (
              <Link href={companyHref} className="site-nav__link">
                Company page
              </Link>
            )}
          </>
        )}
      </nav>
      <div className="site-nav__actions">
        {isGuest && (
          <Link href="/employer/login" className="chip chip--primary">
            Employer login
          </Link>
        )}
        {showLogout && (
          <LogoutButton className="chip chip--ghost" callbackUrl="/employer/login" label="Sign out" />
        )}
      </div>
    </header>
  );
}
