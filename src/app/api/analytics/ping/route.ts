import { NextRequest, NextResponse } from 'next/server';
import { recordVisit } from '@/lib/analytics/tracker';

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

const BOT_PATTERNS = [
  'bot',
  'crawl',
  'spider',
  'curl',
  'wget',
  'python',
  'headless',
  'lighthouse',
  'postman'
];

export async function POST(request: NextRequest) {
  try {
    let body: { path?: string; referrer?: string; screen?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty
    }

    const path = (body.path || '/').trim();
    const cleanPath = path.toLowerCase();

    // 1. Validate route: Only allow real user pages
    const isBlocked = BLOCKED_PATH_PATTERNS.some(p => cleanPath.includes(p));
    if (isBlocked) {
      return NextResponse.json({ ok: false, ignored: 'blocked_path' });
    }

    // 2. Validate User-Agent
    const userAgent = request.headers.get('user-agent') || '';
    const uaLower = userAgent.toLowerCase();
    const isBot = BOT_PATTERNS.some(b => uaLower.includes(b));
    if (isBot) {
      return NextResponse.json({ ok: false, ignored: 'bot_detected' });
    }

    // 3. Validate IP / Origin (Ignore local developer traffic)
    const rawIp = 
      request.headers.get('cf-connecting-ip') || 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
      request.headers.get('x-real-ip') ||
      '';

    const host = request.headers.get('host')?.toLowerCase() || '';
    const isLocalhost = rawIp === '127.0.0.1' || rawIp === '::1' || rawIp === '' || host.includes('localhost') || host.includes('127.0.0.1');
    const allowLocal = request.headers.get('x-track-dev') === 'true';

    if (isLocalhost && !allowLocal) {
      return NextResponse.json({ ok: false, ignored: 'localhost_ignored' });
    }

    const cfCountry = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country');
    const cfCity = request.headers.get('cf-ipcity');
    const referrer = body.referrer || request.headers.get('referer');

    const visit = recordVisit({
      rawIp,
      cfCountry,
      cfCity,
      userAgent,
      path,
      referrer,
      screen: body.screen
    });

    return NextResponse.json({ ok: true, id: visit?.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
