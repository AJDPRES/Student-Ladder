import { prisma } from '@/lib/prisma';
import { sha256 } from '@/lib/hash';

const CODE_PURPOSE = 'email-code';
const CODE_TTL_MS = 24 * 60 * 60 * 1000;
export const DEV_EMAIL_CODE = '12345';

export function normalizeEmailForCode(email: string): string {
  return email.trim().toLowerCase();
}

export function hashEmailCode(email: string, code: string): string {
  return sha256(`${normalizeEmailForCode(email)}:${code}`);
}

export async function issueDevEmailCode(email: string) {
  const normalized = normalizeEmailForCode(email);
  const tokenHash = hashEmailCode(normalized, DEV_EMAIL_CODE);
  const expires = new Date(Date.now() + CODE_TTL_MS);
  await prisma.verificationToken.deleteMany({ where: { identifier: normalized, purpose: CODE_PURPOSE } });
  await prisma.verificationToken.create({
    data: { identifier: normalized, purpose: CODE_PURPOSE, tokenHash, expires },
  });
  console.log(`[DEV] Verification code for ${normalized} is: ${DEV_EMAIL_CODE}`);
}

export async function validateEmailCode(email: string, code: string) {
  const normalized = normalizeEmailForCode(email);
  const tokenHash = hashEmailCode(normalized, code);
  return prisma.verificationToken.findFirst({
    where: { identifier: normalized, purpose: CODE_PURPOSE, tokenHash, expires: { gt: new Date() } },
  });
}

export async function clearEmailCodeToken(id: string) {
  await prisma.verificationToken.delete({ where: { id } });
}
