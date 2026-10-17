/**
 * Affiliate link helper for ACE Recruitment Agency
 * Captures ?ref=[referral_code] or ?tl_ref=[referral_code]
 * Persists in localStorage and document.cookie for 30 days per AGENT.md
 */

const AFFILIATE_KEY = 'ace_affiliate_ref';
const COOKIE_DAYS = 30;

export function captureReferralCode(searchParams?: URLSearchParams | null): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = searchParams || new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('tl_ref');

    if (ref && ref.trim()) {
      const cleanRef = ref.trim().toUpperCase();
      // Store in localStorage
      localStorage.setItem(AFFILIATE_KEY, cleanRef);
      // Store in document cookie for 30 days
      const maxAge = COOKIE_DAYS * 24 * 60 * 60;
      document.cookie = `${AFFILIATE_KEY}=${cleanRef}; path=/; max-age=${maxAge}; SameSite=Lax`;
      return cleanRef;
    }

    // Otherwise retrieve stored referral
    return getStoredReferralCode();
  } catch {
    return null;
  }
}

export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // Check localStorage first
    const local = localStorage.getItem(AFFILIATE_KEY);
    if (local && local.trim()) return local.trim().toUpperCase();

    // Check cookie fallback
    const match = document.cookie.match(new RegExp('(^| )' + AFFILIATE_KEY + '=([^;]+)'));
    if (match && match[2]) return match[2].trim().toUpperCase();
  } catch {
    return null;
  }

  return null;
}
