// Helper for Country codes, flags, and User-Agent parsing

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  EG: { name: 'Egypt', flag: '🇪🇬' },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦' },
  AE: { name: 'United Arab Emirates', flag: '🇦🇪' },
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  FR: { name: 'France', flag: '🇫🇷' },
  IT: { name: 'Italy', flag: '🇮🇹' },
  ES: { name: 'Spain', flag: '🇪🇸' },
  NL: { name: 'Netherlands', flag: '🇳🇱' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  JO: { name: 'Jordan', flag: '🇯🇴' },
  LB: { name: 'Lebanon', flag: '🇱🇧' },
  KW: { name: 'Kuwait', flag: '🇰🇼' },
  QA: { name: 'Qatar', flag: '🇶🇦' },
  BH: { name: 'Bahrain', flag: '🇧🇭' },
  OM: { name: 'Oman', flag: '🇴🇲' },
  TR: { name: 'Turkey', flag: '🇹🇷' },
  GR: { name: 'Greece', flag: '🇬🇷' },
  PT: { name: 'Portugal', flag: '🇵🇹' },
  PL: { name: 'Poland', flag: '🇵🇱' },
  SE: { name: 'Sweden', flag: '🇸🇪' },
  IN: { name: 'India', flag: '🇮🇳' },
  PK: { name: 'Pakistan', flag: '🇵🇰' },
  MA: { name: 'Morocco', flag: '🇲🇦' },
  TN: { name: 'Tunisia', flag: '🇹🇳' },
  DZ: { name: 'Algeria', flag: '🇩🇿' },
  XX: { name: 'Local / Internal', flag: '🌐' }
};

export function getCountryInfo(code?: string | null): CountryInfo {
  if (!code) return { code: 'EG', name: 'Egypt (Default)', flag: '🇪🇬' };
  const upper = code.trim().toUpperCase();
  if (COUNTRY_MAP[upper]) {
    return { code: upper, ...COUNTRY_MAP[upper] };
  }
  return { code: upper, name: upper, flag: '🌍' };
}

export interface ClientDevice {
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  os: string;
  browser: string;
}

export function parseUserAgent(ua?: string | null): ClientDevice {
  if (!ua) {
    return { deviceType: 'Desktop', os: 'Unknown OS', browser: 'Unknown Browser' };
  }

  // Device
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // OS
  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Unknown Browser';
  if (/whatsapp/i.test(ua)) browser = 'WhatsApp In-App';
  else if (/instagram/i.test(ua)) browser = 'Instagram In-App';
  else if (/fbav|fban/i.test(ua)) browser = 'Facebook In-App';
  else if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';

  return { deviceType, os, browser };
}

export function parseReferrer(ref?: string | null): string {
  if (!ref || ref === '' || ref === 'null') return 'Direct / Link';
  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();
    if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp';
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('t.me') || host.includes('telegram')) return 'Telegram';
    if (host.includes('google')) return 'Google Search';
    if (host.includes('tiktok')) return 'TikTok';
    return host.replace(/^www\./, '');
  } catch {
    return 'Referral';
  }
}
