import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getCountryInfo, parseUserAgent, parseReferrer, CountryInfo, ClientDevice } from '@/lib/geo';

export interface VisitRecord {
  id: string;
  timestamp: string; // ISO string
  ipHash: string;
  country: string;
  countryName: string;
  flag: string;
  city?: string;
  path: string;
  referrer: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  os: string;
  browser: string;
}

export interface AnalyticsStats {
  liveNow: number;
  totalVisits: number;
  todayVisits: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsAllTime: number;
  countries: Array<{
    code: string;
    name: string;
    flag: string;
    count: number;
    percentage: number;
  }>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  browsers: Array<{ name: string; count: number }>;
  pages: Array<{ path: string; count: number }>;
  referrers: Array<{ name: string; count: number }>;
  recentVisits: Array<VisitRecord & { timeAgo: string }>;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'traffic.json');
const MAX_SAVED_VISITS = 3000;

let memoryVisits: VisitRecord[] | null = null;
let saveTimeout: NodeJS.Timeout | null = null;

function loadVisitsFromDisk(): VisitRecord[] {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read traffic.json from disk', err);
  }
  return [];
}

function scheduleSaveToDisk() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    if (!memoryVisits) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(FILE_PATH, JSON.stringify(memoryVisits.slice(0, MAX_SAVED_VISITS), null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write traffic.json to disk', err);
    }
  }, 2000); // 2 second debounce
}

export function recordVisit(params: {
  rawIp?: string | null;
  cfCountry?: string | null;
  cfCity?: string | null;
  userAgent?: string | null;
  path?: string | null;
  referrer?: string | null;
}): VisitRecord {
  if (!memoryVisits) {
    memoryVisits = loadVisitsFromDisk();
  }

  const rawIp = params.rawIp || '127.0.0.1';
  // Salted hash for privacy while allowing unique counting per day
  const ipHash = crypto.createHash('sha256').update(rawIp + 'ace_secret_salt').digest('hex').slice(0, 12);

  // Cloudflare provides 'XX' or undefined for local testing, fallback intelligently
  let countryCode = params.cfCountry;
  if (!countryCode || countryCode === 'XX' || countryCode === 'T1') {
    countryCode = 'EG'; // Default to Egypt for local/regional Egyptian traffic
  }

  const countryInfo = getCountryInfo(countryCode);
  const device = parseUserAgent(params.userAgent);
  const referrer = parseReferrer(params.referrer);
  const cleanPath = params.path ? (params.path.split('?')[0] || '/') : '/';

  const record: VisitRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ipHash,
    country: countryInfo.code,
    countryName: countryInfo.name,
    flag: countryInfo.flag,
    city: params.cfCity || undefined,
    path: cleanPath,
    referrer,
    deviceType: device.deviceType,
    os: device.os,
    browser: device.browser
  };

  memoryVisits.unshift(record);
  if (memoryVisits.length > MAX_SAVED_VISITS) {
    memoryVisits = memoryVisits.slice(0, MAX_SAVED_VISITS);
  }

  scheduleSaveToDisk();
  return record;
}

function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const secs = Math.floor(diffMs / 1000);
  if (secs < 60) return `${Math.max(1, secs)}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getAnalyticsStats(): AnalyticsStats {
  if (!memoryVisits) {
    memoryVisits = loadVisitsFromDisk();
  }

  const now = Date.now();
  const fifteenMinutesAgo = now - 15 * 60 * 1000;
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayStartTime = todayStart.getTime();

  // Active in last 15 minutes (unique IPs)
  const activeIpSet = new Set<string>();
  const todayIpSet = new Set<string>();
  const allTimeIpSet = new Set<string>();

  let todayCount = 0;
  const countryCounts: Record<string, { count: number; name: string; flag: string }> = {};
  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
  const browserCounts: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};

  for (const v of memoryVisits) {
    const t = new Date(v.timestamp).getTime();

    allTimeIpSet.add(v.ipHash);

    if (t >= fifteenMinutesAgo) {
      activeIpSet.add(v.ipHash);
    }

    if (t >= todayStartTime) {
      todayCount++;
      todayIpSet.add(v.ipHash);
    }

    // Country
    if (!countryCounts[v.country]) {
      countryCounts[v.country] = { count: 0, name: v.countryName, flag: v.flag };
    }
    countryCounts[v.country].count++;

    // Device
    if (v.deviceType === 'Mobile') deviceCounts.mobile++;
    else if (v.deviceType === 'Tablet') deviceCounts.tablet++;
    else deviceCounts.desktop++;

    // Browser
    browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;

    // Page
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;

    // Referrer
    referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
  }

  const totalVisits = memoryVisits.length;

  // Format countries
  const countries = Object.entries(countryCounts)
    .map(([code, item]) => ({
      code,
      name: item.name,
      flag: item.flag,
      count: item.count,
      percentage: totalVisits > 0 ? Math.round((item.count / totalVisits) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Format pages
  const pages = Object.entries(pageCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Format browsers
  const browsers = Object.entries(browserCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Format referrers
  const referrers = Object.entries(referrerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Format recent visits
  const recentVisits = memoryVisits.slice(0, 30).map(v => ({
    ...v,
    timeAgo: formatTimeAgo(v.timestamp)
  }));

  return {
    liveNow: Math.max(activeIpSet.size, memoryVisits.length > 0 ? 1 : 0),
    totalVisits,
    todayVisits: todayCount,
    uniqueVisitorsToday: Math.max(todayIpSet.size, memoryVisits.length > 0 ? 1 : 0),
    uniqueVisitorsAllTime: allTimeIpSet.size,
    countries,
    devices: deviceCounts,
    browsers,
    pages,
    referrers,
    recentVisits
  };
}
