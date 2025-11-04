"use client";

import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";

type AdminNavProps = {
  state: "guest" | "admin" | "other";
};

export default function AdminNav({ state }: AdminNavProps) {
  const isAdmin = state === "admin";

  return (
    <header className="site-nav">
      <div className="site-nav__brand">
        <Link href="/" className="site-nav__logo">
          The Student Ladder
        </Link>
      </div>
      <nav className="site-nav__links" aria-label="Admin navigation">
        <Link href="/admin" className="site-nav__link">
          Overview
        </Link>
        {isAdmin && (
          <>
            <Link href="/admin/jobs" className="site-nav__link">
              Jobs
            </Link>
            <Link href="/admin/companies" className="site-nav__link">
              Companies
            </Link>
          </>
        )}
      </nav>
      <div className="site-nav__actions">
        {state === "guest" && (
          <Link href="/admin/login" className="chip chip--primary">
            Admin login
          </Link>
        )}
        {state !== "guest" && (
          <LogoutButton className="chip chip--ghost" callbackUrl="/admin/login" label="Sign out" />
        )}
      </div>
    </header>
  );
}
