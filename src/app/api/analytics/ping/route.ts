import { NextRequest, NextResponse } from 'next/server';
import { recordVisit } from '@/lib/analytics/tracker';

export async function POST(request: NextRequest) {
  try {
    let body: { path?: string; referrer?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty or beacon
    }

    // Extract headers supplied by Cloudflare & proxies
    const cfCountry = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country');
    const cfCity = request.headers.get('cf-ipcity');
    const rawIp = 
      request.headers.get('cf-connecting-ip') || 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent');
    const referrer = body.referrer || request.headers.get('referer');
    const path = body.path || '/';

    const visit = recordVisit({
      rawIp,
      cfCountry,
      cfCity,
      userAgent,
      path,
      referrer
    });

    return NextResponse.json({ ok: true, id: visit.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error logging visit:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
