'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Avoid duplicate pings on identical re-renders
    if (lastPathRef.current === fullPath) return;
    lastPathRef.current = fullPath;

    try {
      const payload = JSON.stringify({
        path: pathname || '/',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      });

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
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
      // Non-blocking ping failure is silently ignored
    }
  }, [pathname, searchParams]);

  return null;
}
