type JobType =
  | 'WORK_EXPERIENCE'
  | 'APPRENTICESHIP'
  | 'INTERNSHIP'
  | 'PLACEMENT'
  | 'GRADUATE_SCHEME';

type JobKind = 'SCHEME' | 'LIVE';

export type SearchParams = {
  q?: string;
  type?: string;
  sector?: string;
  location?: string;
  verified?: 'true' | 'false';
  kind?: JobKind;
  page?: number;
};

export type JobSearchItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: JobType;
  sponsored: boolean;
  verified: boolean;
  kind: JobKind;
  locations: string[];
  sectors: string[];
  tags: string[];
  company: {
    name: string;
    slug: string;
  } | null;
};

const PAGE_SIZE = 20;

const SAMPLE_JOBS: JobSearchItem[] = [
  {
    id: 'curve-investment-analyst',
    title: 'Sub-Saharan Africa (SSA) Investment Banking 2025 Analyst – London',
    slug: 'curve-investment-analyst',
    summary:
      'Join Curve’s 2025 investment banking cohort working closely with the SSA portfolio. You will support live deal execution and research high-growth opportunities.',
    type: 'GRADUATE_SCHEME',
    sponsored: true,
    verified: true,
    kind: 'LIVE',
    locations: ['London'],
    sectors: ['Finance', 'Banking'],
    tags: ['investment banking', 'analyst', 'graduate scheme'],
    company: {
      name: 'Curve',
      slug: 'curve',
    },
  },
  {
    id: 'pwc-summer-assurance',
    title: 'Summer Assurance Associate Programme 2025',
    slug: 'pwc-summer-assurance',
    summary:
      'Eight-week programme covering PwC’s assurance methodology, client delivery workshops and exposure to live audits across FTSE clients.',
    type: 'INTERNSHIP',
    sponsored: false,
    verified: true,
    kind: 'LIVE',
    locations: ['Manchester', 'Birmingham'],
    sectors: ['Professional Services', 'Accounting'],
    tags: ['assurance', 'audit', 'summer internship'],
    company: {
      name: 'PwC',
      slug: 'pwc',
    },
  },
  {
    id: 'boa-global-markets',
    title: 'Global Markets Off-Cycle Analyst',
    slug: 'boa-global-markets',
    summary:
      'Rotational six-month placement across FICC and equities within Bank of America. Includes exposure to sales, trading and structuring teams.',
    type: 'PLACEMENT',
    sponsored: false,
    verified: true,
    kind: 'LIVE',
    locations: ['London'],
    sectors: ['Finance', 'Sales & Trading'],
    tags: ['markets', 'sales & trading', 'placement'],
    company: {
      name: 'Bank of America',
      slug: 'bank-of-america',
    },
  },
  {
    id: 'canva-growth-marketing',
    title: 'Growth Marketing Intern',
    slug: 'canva-growth-marketing',
    summary:
      'Support Canva’s EMEA growth squad on campaign planning, performance reporting and market expansion initiatives for 12 weeks.',
    type: 'INTERNSHIP',
    sponsored: false,
    verified: true,
    kind: 'LIVE',
    locations: ['London', 'Hybrid'],
    sectors: ['Marketing', 'Technology'],
    tags: ['growth marketing', 'product marketing'],
    company: {
      name: 'Canva',
      slug: 'canva',
    },
  },
  {
    id: 'google-strategy-ops-fellow',
    title: 'Strategy & Operations Fellow',
    slug: 'google-strategy-ops-fellow',
    summary:
      'A 6-month fellowship embedded within Google’s UK business operations team to drive analytical projects and business reviews.',
    type: 'WORK_EXPERIENCE',
    sponsored: false,
    verified: true,
    kind: 'SCHEME',
    locations: ['London'],
    sectors: ['Technology', 'Strategy'],
    tags: ['strategy', 'operations', 'fellowship'],
    company: {
      name: 'Google',
      slug: 'google',
    },
  },
  {
    id: 'notion-early-careers-designer',
    title: 'Early Careers Product Designer',
    slug: 'notion-early-careers-designer',
    summary:
      'Contribute to Notion’s core product experiences. You will partner with product, engineering and research to design end-to-end flows.',
    type: 'APPRENTICESHIP',
    sponsored: false,
    verified: true,
    kind: 'LIVE',
    locations: ['London', 'Remote'],
    sectors: ['Product Design', 'Technology'],
    tags: ['product design', 'ux/ui'],
    company: {
      name: 'Notion',
      slug: 'notion',
    },
  },
];

function normalizeString(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed.toLowerCase();
}

function matchesQuery(job: JobSearchItem, q: string | undefined): boolean {
  const normalized = normalizeString(q);
  if (!normalized) return true;
  const haystacks = [
    job.title,
    job.summary,
    job.company?.name ?? '',
    job.locations.join(' '),
    job.tags.join(' '),
    job.sectors.join(' '),
  ];
  return haystacks.some((value) => value.toLowerCase().includes(normalized));
}

function matchesType(job: JobSearchItem, typeSlug: string | undefined): boolean {
  if (!typeSlug) return true;
  return job.type.toLowerCase() === typeSlug.toLowerCase().replace(/-/g, '_');
}

function matchesLocation(job: JobSearchItem, location: string | undefined): boolean {
  if (!location) return true;
  return job.locations.some((loc) => loc.toLowerCase().includes(location.toLowerCase()));
}

function matchesSector(job: JobSearchItem, sector: string | undefined): boolean {
  if (!sector) return true;
  return job.sectors.some((value) => value.toLowerCase().includes(sector.toLowerCase()));
}

function matchesVerified(job: JobSearchItem, verifiedParam: 'true' | 'false' | undefined): boolean {
  if (!verifiedParam) return true;
  const desired = verifiedParam === 'true';
  return job.verified === desired;
}

function matchesKind(job: JobSearchItem, kind: JobKind | undefined): boolean {
  if (!kind) return true;
  return job.kind === kind;
}

function filterJobs(params: SearchParams): JobSearchItem[] {
  return SAMPLE_JOBS.filter(
    (job) =>
      matchesQuery(job, params.q) &&
      matchesType(job, params.type) &&
      matchesLocation(job, params.location) &&
      matchesSector(job, params.sector) &&
      matchesVerified(job, params.verified) &&
      matchesKind(job, params.kind),
  );
}

export async function searchJobs(rawParams: SearchParams) {
  const page = Math.max(1, rawParams.page ?? 1);
  const filtered = filterJobs(rawParams);
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return {
    items,
    total,
    page,
    pages,
  };
}

export async function getFacets() {
  const sectors = Array.from(new Set(SAMPLE_JOBS.flatMap((job) => job.sectors))).sort();
  const locations = Array.from(new Set(SAMPLE_JOBS.flatMap((job) => job.locations))).sort();

  return {
    sectors,
    locations,
  };
}
