import type { ReactNode } from "react";

export default function JobSearchLayout({ children }: { children: ReactNode }) {
  return <div className="job-search-page">{children}</div>;
}
