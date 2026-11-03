import { NextRequest, NextResponse } from 'next/server';
import { purgeAllData } from '@/lib/analytics/tracker';

const ACCESS_PASSWORD = 'nekoAm';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

    if (token !== ACCESS_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    purgeAllData();
    return NextResponse.json({ ok: true, message: 'All telemetry data purged successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
