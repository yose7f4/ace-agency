'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const BLOCKED_PATH_PATTERNS = [
  'hybridaction',
  'zybtracker',
  'api',
  'analytics',
  '_next',
  'favicon',
  'robots',
  'sitemap'
];

export function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Block embedded iframes (e.g. browser extensions, translation widgets)
    if (window.self !== window.top) return;

    // 2. Block headless / automated crawlers
    if (navigator.webdriver) return;

    const host = window.location.hostname.toLowerCase();
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
    const forceTrack = searchParams?.get('track_dev') === 'true';

    // 3. Ignore local developer traffic unless explicitly testing with ?track_dev=true
    if (isLocalhost && !forceTrack) return;

    const cleanPath = (pathname || '/').toLowerCase();

    // 4. Block invalid / extension / internal routes
    const isBlockedPath = BLOCKED_PATH_PATTERNS.some(pattern => cleanPath.includes(pattern));
    if (isBlockedPath) return;

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (lastPathRef.current === fullPath) return;
    lastPathRef.current = fullPath;

    try {
      const payload = JSON.stringify({
        path: pathname || '/',
        referrer: document.referrer || '',
        screen: `${window.innerWidth}x${window.innerHeight}`
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/ping', blob);
      } else {
        fetch('/api/analytics/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch {
      // Non-blocking
    }
  }, [pathname, searchParams]);

  return null;
}
