import type { Metadata } from "next";
import Link from "next/link";

import { jobCanonicalPath, jobTypeLabel } from "@/lib/jobs/paths";
import type { SearchParams } from "@/app/job-search/query";
import { getFacets, searchJobs } from "@/app/job-search/query";
import RelatedCompanies from "@/components/jobs/RelatedCompanies";
import ViewSwitch from "@/components/jobs/ViewSwitch";
import SearchBox from "@/components/ui/SearchBox";

const TYPE_OPTIONS = [
  { slug: "work-experience", label: jobTypeLabel("WORK_EXPERIENCE") },
  { slug: "apprenticeships", label: jobTypeLabel("APPRENTICESHIP") },
  { slug: "internships", label: jobTypeLabel("INTERNSHIP") },
  { slug: "placements", label: jobTypeLabel("PLACEMENT") },
  { slug: "graduate-schemes", label: jobTypeLabel("GRADUATE_SCHEME") },
];

function coerceParams(searchParams: Record<string, string | string[] | undefined>): SearchParams {
  const get = (key: string) => (typeof searchParams[key] === "string" ? (searchParams[key] as string) : undefined);
  const toNumber = (value: string | undefined) => {
    if (!value) return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  return {
    q: get("q"),
    type: get("type"),
    sector: get("sector"),
    location: get("location"),
    verified: get("verified") === "true" || get("verified") === "false" ? (get("verified") as "true" | "false") : undefined,
    kind: get("kind") === "SCHEME" || get("kind") === "LIVE" ? (get("kind") as "SCHEME" | "LIVE") : undefined,
    page: toNumber(get("page")),
  };
}

export async function generateMetadata({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }): Promise<Metadata> {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string" && value) params.set(key, value);
  });
  const query = params.toString();
  const canonical = query ? `/job-search/?${query}` : "/job-search/";
  return {
    title: "Job search | The Student Ladder",
    alternates: { canonical },
    robots: query.includes("q=") ? { index: false } : undefined,
  };
}

export default async function JobSearchPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = coerceParams(searchParams);

  let facets: Awaited<ReturnType<typeof getFacets>>;
  let results: Awaited<ReturnType<typeof searchJobs>>;

  try {
    [facets, results] = await Promise.all([getFacets(), searchJobs(params)]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[job-search] Failed to load data from Prisma. Rendering fallback list.", message);
    const fallbackPage = Math.max(1, params.page ?? 1);
    facets = { sectors: [], locations: [] };
    results = { items: [], total: 0, page: fallbackPage, pages: 0 };
  }

  const buildUrl = (nextPage: number) => {
    const query = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") return;
      if (typeof value === "string" && value) query.set(key, value);
    });
    query.set("page", String(nextPage));
    return `/job-search/?${query.toString()}`;
  };

  const enrichedResults =
    results.items.length > 0 && results.items.length < 15
      ? Array.from({ length: 15 }, (_, index) => results.items[index % results.items.length])
      : results.items;

  return (
    <>
      <div className="job-search-hero">
        <header className="job-search-header">
          <div className="job-search-header__surface" aria-hidden="true">
            <img src="/images/job-search/header-surface.png" alt="" className="job-search-header__surface-image" />
          </div>
          <div className="job-search-header__inner job-search-shell">
            <div className="job-search-header__topbar">
              <div className="job-search-header__topbar-group">
                <Link href="/" className="job-search-header__logo" aria-label="Student Ladder">
                  <img src="/logo-wordmark.svg" alt="" width={178} height={24} />
                </Link>
                <nav className="job-search-header__nav" aria-label="Primary">
                  <div className="job-search-header__nav-menu">
                    <Link href="/#job-types" className="job-search-header__nav-item">Job Types</Link>
                    <Link href="/#career-paths" className="job-search-header__nav-item">Career Paths</Link>
                    <Link href="/#companies" className="job-search-header__nav-item">Companies</Link>
                  </div>
                </nav>
              </div>
              <div className="job-search-header__right">
                <div className="job-search-header__actions">
                  <button type="button" className="job-search-header__action" aria-label="View notifications">
                    <img src="/icons/flashlight-line.svg" alt="" width={20} height={20} aria-hidden="true" />
                    <span className="job-search-header__notification" />
                  </button>
                </div>
                <button type="button" className="job-search-header__profile" aria-haspopup="true" aria-label="Open profile menu">
                  <span className="job-search-header__avatar">
                    <img src="/images/job-search/avatar-topbar.png" alt="Sophia" width={32} height={32} />
                  </span>
                  <span className="job-search-header__name">Sophia</span>
                  <img src="/icons/arrow-down-s-fill.svg" alt="" width={20} height={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="job-search-searchbox">
          <div className="job-search-shell">
            <SearchBox align="left" />
          </div>
        </div>
      </div>

      <main className="job-search-main">
        <div className="job-search-content job-search-shell">
          <div className="job-search-body">
            <aside className="job-search-sidebar" aria-label="Filters">
              <div className="job-search-sidebar__inner">
                <div className="job-search-sidebar__intro">
                  <div className="job-search-sidebar__label">
                    <img src="/images/job-search/icons/filter-3-line.svg" alt="" width={20} height={20} />
                    <span>Filter</span>
                  </div>
                  <div className="job-search-divider" />
                </div>

                <div className="job-search-sidebar__sections">
                  <section className="job-search-sidebar__section">
                    <header className="job-search-sidebar__section-header">
                      <img src="/images/job-search/icons/apps-2-line.svg" alt="" width={20} height={20} />
                      <span>Job Type</span>
                    </header>
                    <div className="job-search-chip-group">
                      <div className="job-search-chip-row">
                        <button type="button" className="job-search-chip">
                          <span>All</span>
                        </button>
                        <button type="button" className="job-search-chip">
                          <span>Experience</span>
                        </button>
                      </div>
                      <div className="job-search-chip-row">
                        <button type="button" className="job-search-chip job-search-chip--active">
                          <span>Apprenticeship</span>
                        </button>
                        <button type="button" className="job-search-chip">
                          <span>Internship</span>
                        </button>
                      </div>
                      <div className="job-search-chip-row">
                        <button type="button" className="job-search-chip">
                          <span>Placement</span>
                        </button>
                        <button type="button" className="job-search-chip">
                          <span>Graduate</span>
                        </button>
                      </div>
                    </div>
                  </section>

                    <section className="job-search-sidebar__section">
                      <header className="job-search-sidebar__section-header">
                        <img src="/images/job-search/icons/archive-2-line.svg" alt="" width={20} height={20} />
                        <span>Career Path</span>
                      </header>
                      <div className="job-search-tag-group">
                        <label className="job-search-tag-input">
                          <span className="sr-only">Add career paths</span>
                          <input placeholder="Add career paths..." />
                        </label>
                        <div className="job-search-tags">
                          <button type="button" className="job-search-tag">
                            <span className="job-search-tag__label">Accounting</span>
                            <span className="job-search-tag__icon" aria-hidden="true">×</span>
                          </button>
                          <button type="button" className="job-search-tag">
                            <span className="job-search-tag__label">Finance</span>
                            <span className="job-search-tag__icon" aria-hidden="true">×</span>
                          </button>
                          <button type="button" className="job-search-tag">
                            <span className="job-search-tag__label">Investment Banking</span>
                            <span className="job-search-tag__icon" aria-hidden="true">×</span>
                          </button>
                        </div>
                      </div>
                    </section>

                    <section className="job-search-sidebar__section">
                      <header className="job-search-sidebar__section-header">
                        <img src="/images/job-search/icons/map-pin-line.svg" alt="" width={20} height={20} />
                        <span>Location</span>
                      </header>
                      <button type="button" className="job-search-select">
                        <span className="job-search-select__icon" aria-hidden="true">
                          <img src="/images/job-search/icons/flag-united-kingdom.svg" alt="" width={20} height={20} />
                        </span>
                        <span className="job-search-select__value">London</span>
                        <img src="/images/job-search/icons/arrow-down-s-line.svg" alt="" width={20} height={20} />
                      </button>
                    </section>
                </div>
              </div>
            </aside>

            <div className="job-search-results">
              <RelatedCompanies />

              <section className="job-search-results__toolbar" aria-label="Result controls">
                <ViewSwitch />
                <button type="button" className="job-search-sort" aria-haspopup="listbox">
                  <span className="job-search-sort__icon" aria-hidden="true">
                    <span className="job-search-icon job-search-icon--sort" />
                  </span>
                  <span className="job-search-sort__label">Sort by</span>
                  <span className="job-search-sort__chevron" aria-hidden="true">
                    <span className="job-search-icon job-search-icon--chevron" />
                  </span>
                </button>
              </section>

              <ul className="job-search-results-list">
                {enrichedResults.map((job, index) => {
                  const key = `${job.id}-${index}`;
                  const href = jobCanonicalPath({
                    slug: job.slug,
                    type: job.type,
                    sponsored: job.sponsored,
                    company: job.company ? { slug: job.company.slug } : undefined,
                  });
                  const companyName = job.company?.name ?? "Independent";
                  const locationLabel = job.locations?.join(", ") ?? "United Kingdom";
                  const jobTypeText = jobTypeLabel(job.type);
                  return (
                    <li key={key} className="job-card">
                      <article className="job-card__inner">
                        <div className="job-card__media">
                          <img src="/images/job-search/cards/job-card-hero.png" alt="" width={138} height={102} />
                          <div className="job-card__media-badge">
                            <span aria-hidden="true" className="job-card__media-badge-icon">
                              <span className="job-search-icon job-search-icon--verified job-search-icon--12" />
                            </span>
                            <span>verified</span>
                          </div>
                        </div>

                        <div className="job-card__content">
                          <div className="job-card__header">
                            <div className="job-card__heading">
                              <div className="job-card__title-group">
                                <h2 className="job-card__title">
                                  <Link href={href}>{job.title}</Link>
                                </h2>
                                <span className="job-card__pill">
                                  <span aria-hidden="true" className="job-card__pill-icon">
                                    <span className="job-search-icon job-search-icon--flashlight job-search-icon--16" />
                                  </span>
                                  <span>{jobTypeText}</span>
                                </span>
                              </div>
                              <p className="job-card__company">{companyName}</p>
                            </div>

                            <button type="button" className="job-card__save" aria-label="Save job">
                              <span className="job-search-icon job-search-icon--star" aria-hidden="true" />
                            </button>
                          </div>

                          <p className="job-card__description">
                            Job description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one. Description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one.
                          </p>

                          <div className="job-card__footer">
                            <div className="job-card__tags">
                              <span className="job-card__tag">
                                <span aria-hidden="true" className="job-card__tag-icon">
                                  <span className="job-search-icon job-search-icon--apps job-search-icon--16" />
                                </span>
                                <span>{jobTypeText}</span>
                              </span>
                              <span className="job-card__tag">
                                <span aria-hidden="true" className="job-card__tag-icon">
                                  <span className="job-search-icon job-search-icon--archive job-search-icon--16" />
                                </span>
                                <span>{companyName}</span>
                              </span>
                              <span className="job-card__tag">
                                <span aria-hidden="true" className="job-card__tag-icon">
                                  <span className="job-search-icon job-search-icon--map job-search-icon--16" />
                                </span>
                                <span>{locationLabel}</span>
                              </span>
                            </div>
                            <span className="job-card__date">Posted 2 weeks ago</span>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>

              <div className="job-search__pagination">
                {results.page > 1 && <Link href={buildUrl(results.page - 1)}>Previous</Link>}
                {results.page < results.pages && <Link href={buildUrl(results.page + 1)}>Next</Link>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
