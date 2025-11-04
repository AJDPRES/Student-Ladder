export function jobTypeToSlug(type: string): string {
  switch (type) {
    case 'WORK_EXPERIENCE':
      return 'work-experience';
    case 'APPRENTICESHIP':
      return 'apprenticeships';
    case 'INTERNSHIP':
      return 'internships';
    case 'PLACEMENT':
      return 'placements';
    case 'GRADUATE_SCHEME':
      return 'graduate-schemes';
    default:
      return 'graduate-schemes';
  }
}

export function slugToJobType(slug: string | null | undefined):
  | 'WORK_EXPERIENCE'
  | 'APPRENTICESHIP'
  | 'INTERNSHIP'
  | 'PLACEMENT'
  | 'GRADUATE_SCHEME'
  | null {
  if (!slug) return null;
  switch (slug.toLowerCase()) {
    case 'work-experience':
      return 'WORK_EXPERIENCE';
    case 'apprenticeships':
      return 'APPRENTICESHIP';
    case 'internships':
      return 'INTERNSHIP';
    case 'placements':
      return 'PLACEMENT';
    case 'graduate-scheme':
    case 'graduate-schemes':
      return 'GRADUATE_SCHEME';
    default:
      return null;
  }
}

export function jobTypeLabel(type: string): string {
  switch (type) {
    case 'WORK_EXPERIENCE':
      return 'Work Experience';
    case 'APPRENTICESHIP':
      return 'Apprenticeships';
    case 'INTERNSHIP':
      return 'Internships';
    case 'PLACEMENT':
      return 'Placements';
    case 'GRADUATE_SCHEME':
      return 'Graduate Schemes';
    default:
      return 'Graduate Schemes';
  }
}

export function jobCanonicalPath(job: {
  slug: string;
  type: string;
  sponsored: boolean;
  company?: { slug: string } | null;
}): string {
  const typeSlug = jobTypeToSlug(job.type);
  if (job.sponsored && job.company?.slug) {
    return `/${job.company.slug}/${typeSlug}/${job.slug}/`;
  }
  return `/${typeSlug}/job/${job.slug}/`;
}
