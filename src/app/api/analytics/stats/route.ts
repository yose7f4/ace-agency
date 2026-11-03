import { NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/analytics/tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
