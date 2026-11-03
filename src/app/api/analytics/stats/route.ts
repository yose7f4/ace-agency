import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/analytics/tracker';

export const dynamic = 'force-dynamic';

const ACCESS_PASSWORD = 'nekoAm';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim();
    const tokenFromQuery = request.nextUrl.searchParams.get('key')?.trim();
    const tokenFromCookie = request.cookies.get('ace_analytics_token')?.value?.trim();

    const providedKey = tokenFromHeader || tokenFromQuery || tokenFromCookie;

    if (providedKey !== ACCESS_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid access key required.' },
        { status: 401 }
      );
    }

    const stats = getAnalyticsStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
