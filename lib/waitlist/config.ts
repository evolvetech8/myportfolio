export function waitlistReady() {
  return process.env.REVIEW_WAITLIST_ENABLED === 'true' && Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.RESEND_API_KEY && process.env.BETA_FROM_EMAIL && process.env.APP_ORIGIN);
}
