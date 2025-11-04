export async function sendVerificationEmail(to: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const sender = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !sender) {
    console.log('[DEV] Verification link:', link);
    return;
  }
  console.log('[EMAIL] Would send verification email to', to, 'with link:', link);
}
