export function getAppUrl(): string {
  const candidates = [process.env.AUTH_URL, process.env.NEXTAUTH_URL];
  for (const value of candidates) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed.replace(/\/$/, '');
    }
  }
  return 'http://localhost:3000';
}
