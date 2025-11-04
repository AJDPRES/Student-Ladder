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
        <header className="job-search-header" aria-label="Job search header">
          <div className="job-search-header__surface" aria-hidden="true" />
          <div className="job-search-header__topbar job-search-shell" role="navigation" aria-label="Topbar">
            <div className="job-search-header__frame">
              <div className="job-search-header__group-2089">
                <div className="job-search-header__group-2006">
                  <Link href="/" className="job-search-header__logo" aria-label="Student Ladder">
                    <span className="job-search-header__logo-text">student ladder</span>
                  </Link>
                </div>

                <div className="job-search-header__group-2087">
                  <div className="job-search-header__left-frame">
                    <nav className="job-search-header__navigation" aria-label="Primary">
                      <Link href="/#job-types" className="job-search-header__item">
                        <span className="job-search-header__item-label">Job Types</span>
                      </Link>
                      <Link href="/#career-paths" className="job-search-header__item">
                        <span className="job-search-header__item-label">Career Paths</span>
                      </Link>
                      <Link href="/#companies" className="job-search-header__item">
                        <span className="job-search-header__item-label">Companies</span>
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="job-search-header__frame-2008">
                <div className="job-search-header__frame-2007">
                  <div className="job-search-header__right">
                    <div className="job-search-header__actions">
                      <button type="button" className="job-search-header__action" aria-label="View notifications">
                        <span className="job-search-header__action-icon" aria-hidden="true">
                          <img src="/icons/flashlight-line.svg" alt="" width={20} height={20} />
                        </span>
                        <span className="job-search-header__action-indicator" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="job-search-header__profile"
                      aria-haspopup="true"
                      aria-label="Open profile menu"
                    >
                      <span className="job-search-header__name-frame">
                        <span className="job-search-header__avatar">
                          <img src="/images/job-search/avatar-topbar.png" alt="Sophia" width={32} height={32} />
                        </span>
                        <span className="job-search-header__profile-text-frame">
                          <span className="job-search-header__profile-text">Sophia</span>
                        </span>
                      </span>
                      <img src="/icons/arrow-down-s-fill.svg" alt="" width={20} height={20} aria-hidden="true" />
                    </button>
                  </div>
                </div>
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
        <div className="job-search-layout job-search-shell">
          <aside className="job-search-filter" aria-label="Filters">
            <div className="job-search-filter__frame">
              <div className="job-search-filter__heading">
                <span className="job-search-filter__heading-icon" aria-hidden="true">
                  <img src="/images/job-search/icons/filter-3-line.svg" alt="" width={20} height={20} />
                </span>
                <span className="job-search-filter__heading-label">Filter</span>
              </div>
              <div className="job-search-filter__divider" aria-hidden="true" />
              <div className="job-search-filter__sections">
                <section className="job-search-filter-section job-search-filter-section--type">
                  <header className="job-search-filter-section__title">
                    <span className="job-search-filter-section__icon" aria-hidden="true">
                      <img src="/images/job-search/icons/apps-2-line.svg" alt="" width={20} height={20} />
                    </span>
                    <span className="job-search-filter-section__label">Job Type</span>
                  </header>
                  <div className="job-search-filter__chip-rows" role="group" aria-label="Job type options">
                    <div className="job-search-filter__chip-row">
                      <button type="button" className="job-search-filter__chip">
                        <span>All</span>
                      </button>
                      <button type="button" className="job-search-filter__chip">
                        <span>Experience</span>
                      </button>
                    </div>
                    <div className="job-search-filter__chip-row">
                      <button
                        type="button"
                        className="job-search-filter__chip job-search-filter__chip--accent"
                      >
                        <span>Apprenticeship</span>
                      </button>
                      <button type="button" className="job-search-filter__chip">
                        <span>Internship</span>
                      </button>
                    </div>
                    <div className="job-search-filter__chip-row">
                      <button type="button" className="job-search-filter__chip">
                        <span>Placement</span>
                      </button>
                      <button type="button" className="job-search-filter__chip">
                        <span>Graduate</span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="job-search-filter-section job-search-filter-section--career">
                  <header className="job-search-filter-section__title">
                    <span className="job-search-filter-section__icon" aria-hidden="true">
                      <img src="/images/job-search/icons/archive-2-line.svg" alt="" width={20} height={20} />
                    </span>
                    <span className="job-search-filter-section__label">Career Path</span>
                  </header>
                  <div className="job-search-filter__tag-stack">
                    <label className="job-search-filter__tag-field">
                      <span className="sr-only">Add career paths</span>
                      <input placeholder="Add career paths..." />
                    </label>
                    <div className="job-search-filter__tags">
                      <span className="job-search-filter__tag">
                        <span className="job-search-filter__tag-label">Accounting</span>
                        <button type="button" className="job-search-filter__tag-dismiss" aria-label="Remove Accounting">
                          <span aria-hidden="true">×</span>
                        </button>
                      </span>
                      <span className="job-search-filter__tag">
                        <span className="job-search-filter__tag-label">Finance</span>
                        <button type="button" className="job-search-filter__tag-dismiss" aria-label="Remove Finance">
                          <span aria-hidden="true">×</span>
                        </button>
                      </span>
                      <span className="job-search-filter__tag">
                        <span className="job-search-filter__tag-label">Investment Banking</span>
                        <button type="button" className="job-search-filter__tag-dismiss" aria-label="Remove Investment Banking">
                          <span aria-hidden="true">×</span>
                        </button>
                      </span>
                    </div>
                  </div>
                </section>

                <section className="job-search-filter-section job-search-filter-section--location">
                  <header className="job-search-filter-section__title">
                    <span className="job-search-filter-section__icon" aria-hidden="true">
                      <img src="/images/job-search/icons/map-pin-line.svg" alt="" width={20} height={20} />
                    </span>
                    <span className="job-search-filter-section__label">Location</span>
                  </header>
                  <button type="button" className="job-search-filter__dropdown" aria-haspopup="listbox">
                    <span className="job-search-filter__dropdown-flag" aria-hidden="true">
                      <img src="/images/job-search/icons/flag-united-kingdom.svg" alt="" width={20} height={20} />
                    </span>
                    <span className="job-search-filter__dropdown-value">London</span>
                    <span className="job-search-filter__dropdown-caret" aria-hidden="true">
                      <img src="/images/job-search/icons/arrow-down-s-line.svg" alt="" width={20} height={20} />
                    </span>
                  </button>
                </section>
              </div>
            </div>
          </aside>

          <div className="job-search-panel">
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
                          <div className="job-card__media-surface">
                            <img src="/images/job-search/cards/job-card-hero.png" alt="" width={138} height={102} />
                          </div>
                          <div className="job-card__media-badge">
                            <span aria-hidden="true" className="job-card__media-badge-icon">
                              <span className="job-search-icon job-search-icon--verified job-search-icon--12" />
                            </span>
                            <span className="job-card__media-badge-label">verified</span>
                          </div>
                        </div>

                        <div className="job-card__content">
                          <header className="job-card__header">
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
                          </header>

                          <p className="job-card__description">
                            Job description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one. Description for the job listing one, containing some brief snippet information, and for the job listing one. Either comes from job listing one.
                          </p>

                          <footer className="job-card__footer">
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
                          </footer>
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
