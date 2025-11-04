export const STUDENT_LOGIN = '/login';
export const EMPLOYER_LOGIN = '/employer/login';
export const ADMIN_LOGIN = '/admin/login';

export function isLoginPath(path: string) {
  const value = path.toLowerCase();
  return value === STUDENT_LOGIN || value === EMPLOYER_LOGIN || value === ADMIN_LOGIN;
}

export function safeNext(next: string | null | undefined) {
  if (!next) return '';

  let candidate: string;
  try {
    candidate = decodeURIComponent(next);
  } catch {
    candidate = next;
  }

  if (!candidate.startsWith('/')) return '';

  const lower = candidate.toLowerCase();
  if (lower.includes('/login')) return '';
  if (lower.startsWith('/api/')) return '';
  if (candidate.length > 2000) return '';

  return candidate;
}
