import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getCountryInfo, parseUserAgent, parseReferrer } from '@/lib/geo';

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
  screen?: string;
}

export interface UniqueViewer {
  id: string; // Display ID e.g. "USR-37340D"
  ipHash: string;
  country: string;
  countryName: string;
  flag: string;
  city?: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  os: string;
  browser: string;
  screen?: string;
  referrer: string;
  firstSeen: string;
  lastActive: string;
  firstSeenAgo: string;
  lastActiveAgo: string;
  isOnlineNow: boolean;
  totalPageViews: number;
  pagesExplored: Array<{ path: string; views: number; lastVisitedAgo: string }>;
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
  uniqueViewers: UniqueViewer[];
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'traffic.json');
const MAX_SAVED_VISITS = 3000;

// Known localhost / internal IP hashes to exclude
const LOCALHOST_HASH = crypto.createHash('sha256').update('127.0.0.1ace_secret_salt').digest('hex').slice(0, 12);

let memoryVisits: VisitRecord[] | null = null;
let saveTimeout: NodeJS.Timeout | null = null;

function isRealVisit(v: VisitRecord): boolean {
  if (!v || !v.path) return false;
  const p = v.path.toLowerCase();
  if (p.includes('zybtracker') || p.includes('hybridaction') || p.includes('/api') || p.includes('analytics')) {
    return false;
  }
  if (v.ipHash === LOCALHOST_HASH || v.referrer === 'localhost') {
    return false;
  }
  return true;
}

function loadVisitsFromDisk(): VisitRecord[] {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Automatically prune any stale fake data on load
        return parsed.filter(isRealVisit);
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
  }, 1000);
}

export function purgeAllData() {
  memoryVisits = [];
  try {
    if (fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, '[]', 'utf-8');
    }
  } catch (err) {
    console.error('Failed to purge traffic data', err);
  }
}

export function recordVisit(params: {
  rawIp?: string | null;
  cfCountry?: string | null;
  cfCity?: string | null;
  userAgent?: string | null;
  path?: string | null;
  referrer?: string | null;
  screen?: string | null;
}): VisitRecord | null {
  if (!memoryVisits) {
    memoryVisits = loadVisitsFromDisk();
  }

  const rawIp = params.rawIp || '127.0.0.1';
  const ipHash = crypto.createHash('sha256').update(rawIp + 'ace_secret_salt').digest('hex').slice(0, 12);

  // Ignore localhost
  if (ipHash === LOCALHOST_HASH && params.referrer === 'localhost') {
    return null;
  }

  let countryCode = params.cfCountry;
  if (!countryCode || countryCode === 'XX' || countryCode === 'T1') {
    countryCode = 'EG';
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
    browser: device.browser,
    screen: params.screen || undefined
  };

  if (!isRealVisit(record)) {
    return null;
  }

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
  } else {
    // Ensure in-memory list is clean
    memoryVisits = memoryVisits.filter(isRealVisit);
  }

  const now = Date.now();
  const fifteenMinutesAgo = now - 15 * 60 * 1000;
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayStartTime = todayStart.getTime();

  // Aggregate by Unique Viewer (IP Hash)
  const viewerMap = new Map<string, {
    ipHash: string;
    firstSeen: string;
    lastActive: string;
    country: string;
    countryName: string;
    flag: string;
    city?: string;
    deviceType: 'Mobile' | 'Desktop' | 'Tablet';
    os: string;
    browser: string;
    screen?: string;
    referrer: string;
    totalVisits: number;
    pages: Map<string, { count: number; lastTime: string }>;
  }>();

  let todayCount = 0;
  const countryCounts: Record<string, { count: number; name: string; flag: string }> = {};
  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
  const browserCounts: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};

  for (const v of memoryVisits) {
    const t = new Date(v.timestamp).getTime();

    if (t >= todayStartTime) {
      todayCount++;
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

    // Build Viewer Profile
    let viewer = viewerMap.get(v.ipHash);
    if (!viewer) {
      viewer = {
        ipHash: v.ipHash,
        firstSeen: v.timestamp,
        lastActive: v.timestamp,
        country: v.country,
        countryName: v.countryName,
        flag: v.flag,
        city: v.city,
        deviceType: v.deviceType,
        os: v.os,
        browser: v.browser,
        screen: v.screen,
        referrer: v.referrer,
        totalVisits: 0,
        pages: new Map()
      };
      viewerMap.set(v.ipHash, viewer);
    }

    // Update timestamps
    if (new Date(v.timestamp).getTime() > new Date(viewer.lastActive).getTime()) {
      viewer.lastActive = v.timestamp;
      viewer.country = v.country;
      viewer.countryName = v.countryName;
      viewer.flag = v.flag;
      viewer.city = v.city || viewer.city;
      viewer.deviceType = v.deviceType;
      viewer.os = v.os;
      viewer.browser = v.browser;
      viewer.screen = v.screen || viewer.screen;
      viewer.referrer = v.referrer;
    }
    if (new Date(v.timestamp).getTime() < new Date(viewer.firstSeen).getTime()) {
      viewer.firstSeen = v.timestamp;
    }

    viewer.totalVisits++;

    const pageData = viewer.pages.get(v.path) || { count: 0, lastTime: v.timestamp };
    pageData.count++;
    if (new Date(v.timestamp).getTime() > new Date(pageData.lastTime).getTime()) {
      pageData.lastTime = v.timestamp;
    }
    viewer.pages.set(v.path, pageData);
  }

  // Format Unique Viewers List
  const uniqueViewers: UniqueViewer[] = Array.from(viewerMap.values()).map(vw => {
    const lastActiveTime = new Date(vw.lastActive).getTime();
    const isOnlineNow = lastActiveTime >= fifteenMinutesAgo;

    const pagesExplored = Array.from(vw.pages.entries())
      .map(([path, data]) => ({
        path,
        views: data.count,
        lastVisitedAgo: formatTimeAgo(data.lastTime)
      }))
      .sort((a, b) => b.views - a.views);

    return {
      id: `USR-${vw.ipHash.toUpperCase().slice(0, 6)}`,
      ipHash: vw.ipHash,
      country: vw.country,
      countryName: vw.countryName,
      flag: vw.flag,
      city: vw.city,
      deviceType: vw.deviceType,
      os: vw.os,
      browser: vw.browser,
      screen: vw.screen,
      referrer: vw.referrer,
      firstSeen: vw.firstSeen,
      lastActive: vw.lastActive,
      firstSeenAgo: formatTimeAgo(vw.firstSeen),
      lastActiveAgo: formatTimeAgo(vw.lastActive),
      isOnlineNow,
      totalPageViews: vw.totalVisits,
      pagesExplored
    };
  }).sort((a, b) => {
    // Sort online users first, then by last active timestamp
    if (a.isOnlineNow && !b.isOnlineNow) return -1;
    if (!a.isOnlineNow && b.isOnlineNow) return 1;
    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
  });

  const totalVisits = memoryVisits.length;
  const liveNow = uniqueViewers.filter(u => u.isOnlineNow).length;
  const uniqueVisitorsToday = uniqueViewers.filter(u => new Date(u.lastActive).getTime() >= todayStartTime).length;

  const countries = Object.entries(countryCounts)
    .map(([code, item]) => ({
      code,
      name: item.name,
      flag: item.flag,
      count: item.count,
      percentage: totalVisits > 0 ? Math.round((item.count / totalVisits) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const pages = Object.entries(pageCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const browsers = Object.entries(browserCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const referrers = Object.entries(referrerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const recentVisits = memoryVisits.slice(0, 30).map(v => ({
    ...v,
    timeAgo: formatTimeAgo(v.timestamp)
  }));

  return {
    liveNow,
    totalVisits,
    todayVisits: todayCount,
    uniqueVisitorsToday,
    uniqueVisitorsAllTime: uniqueViewers.length,
    countries,
    devices: deviceCounts,
    browsers,
    pages,
    referrers,
    recentVisits,
    uniqueViewers
  };
}
