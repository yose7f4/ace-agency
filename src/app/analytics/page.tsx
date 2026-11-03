'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import type { AnalyticsStats } from '@/lib/analytics/tracker';
import { 
  Users, 
  Globe, 
  Activity, 
  Smartphone, 
  Laptop, 
  Radio, 
  Compass, 
  RefreshCw, 
  Share2, 
  Clock, 
  Eye, 
  EyeOff,
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound,
  AlertCircle,
  LogOut,
  Sparkles
} from 'lucide-react';

const CORRECT_KEY = 'nekoAm';
const STORAGE_KEY = 'ace_analytics_auth_key';

export default function AnalyticsDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check stored credentials on mount
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored === CORRECT_KEY) {
        setAccessKey(stored);
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore storage error
    } finally {
      setAuthChecking(false);
    }
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const trimmed = passwordInput.trim();
    if (trimmed === CORRECT_KEY) {
      try {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } catch {}
      setAccessKey(trimmed);
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid security access key. Access denied.');
    }
  };

  const handleLock = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAccessKey('');
    setIsAuthenticated(false);
    setPasswordInput('');
    setStats(null);
  };

  const fetchStats = useCallback(async (isManual = false) => {
    if (!isAuthenticated) return;
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': `Bearer ${accessKey || CORRECT_KEY}`
        },
        cache: 'no-store'
      });

      if (res.status === 401) {
        handleLock();
        setAuthError('Session expired or invalid key. Please log in again.');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics stats', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [isAuthenticated, accessKey]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated, fetchStats]);

  // Loading Screen while checking initial auth
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Verifying security authorization...
        </div>
      </div>
    );
  }

  // 1. PASSWORD GATE (When not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070D] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full rounded-3xl p-8 bg-gradient-to-br from-[#0F1626]/95 to-[#070A12]/95 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)] relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1.5px] mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#05070D] rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-mono font-bold mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              RESTRICTED TELEMETRY
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Traffic Radar Gate
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Confidential visitor analytics & geographic intelligence. Enter your administrative access key to unlock telemetry.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-2">
                Security Access Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter access key..."
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-amber-400 focus:outline-none text-white text-sm font-mono placeholder:text-slate-600 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4 text-slate-950" />
              Unlock Traffic Radar
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-mono"
            >
              ← Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED DASHBOARD (When password matched)
  const topCountry = stats?.countries && stats.countries.length > 0 ? stats.countries[0] : null;
  const totalDeviceCount = (stats?.devices.mobile || 0) + (stats?.devices.desktop || 0) + (stats?.devices.tablet || 0) || 1;
  const mobilePct = Math.round(((stats?.devices.mobile || 0) / totalDeviceCount) * 100);
  const desktopPct = Math.round(((stats?.devices.desktop || 0) / totalDeviceCount) * 100);

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Header & Live Pulse */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              REAL-TIME TRAFFIC RADAR • RESTRICTED ACCESS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Website Traffic & Visitor Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Live visitor counts, geographic distribution, referral channels, and device intelligence across the ACE recruitment network.
            </p>
          </div>

          {/* Controls: Auto-refresh, Manual trigger & Lock */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                autoRefresh
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 hover:bg-amber-400/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-amber-400' : ''}`} />
              Auto-Refresh (10s): {autoRefresh ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => fetchStats(true)}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              Refresh Now
            </button>

            <button
              onClick={handleLock}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Lock screen"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock
            </button>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Active Live Now */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-emerald-500/30 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Radio className="w-4 h-4 animate-pulse" /> ACTIVE VISITORS
              </span>
              <span className="text-[10px] text-slate-400">Last 15 Mins</span>
            </div>
            <div className="text-4xl font-black text-white mt-2 font-mono tracking-tight flex items-baseline gap-2">
              {loading ? '--' : stats?.liveNow || 0}
              <span className="text-xs font-sans text-emerald-400 font-semibold">online now</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Real-time active users currently browsing pages or vacancies.
            </p>
          </div>

          {/* Unique Visitors Today */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-amber-400/30 transition-all relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Users className="w-4 h-4 text-amber-400" /> UNIQUE VISITORS
              </span>
              <span className="text-[10px] text-slate-500">Today (UTC)</span>
            </div>
            <div className="text-4xl font-black text-white mt-2 font-mono tracking-tight flex items-baseline gap-2">
              {loading ? '--' : stats?.uniqueVisitorsToday || 0}
              <span className="text-xs font-sans text-slate-400">people</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              All-time unique visitors: <strong className="text-slate-200">{stats?.uniqueVisitorsAllTime || 0}</strong>
            </p>
          </div>

          {/* Total Page Views */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-cyan-400/30 transition-all relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Eye className="w-4 h-4 text-cyan-400" /> PAGE VIEWS
              </span>
              <span className="text-[10px] text-slate-500">Today / Total</span>
            </div>
            <div className="text-4xl font-black text-white mt-2 font-mono tracking-tight flex items-baseline gap-2">
              {loading ? '--' : stats?.todayVisits || 0}
              <span className="text-xs font-sans text-cyan-300">views today</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Total logged views: <strong className="text-slate-200">{stats?.totalVisits || 0}</strong>
            </p>
          </div>

          {/* Top Country */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-amber-400/30 transition-all relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Globe className="w-4 h-4 text-amber-400" /> TOP GEOGRAPHY
              </span>
              <span className="text-[10px] text-slate-500">By Volume</span>
            </div>
            <div className="text-3xl font-black text-white mt-2 tracking-tight flex items-center gap-2">
              <span>{topCountry ? topCountry.flag : '🌍'}</span>
              <span className="truncate">{topCountry ? topCountry.name : 'Awaiting data'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {topCountry ? `${topCountry.percentage}% of overall site traffic` : 'Traffic origin detection active'}
            </p>
          </div>
        </div>

        {/* Middle Section: Locations & Device Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Countries / Locations Breakdown (Spans 2 cols) */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Geographic Traffic Breakdown</h3>
                  <p className="text-xs text-slate-400">Visitor origin detected via Cloudflare Edge headers</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {stats?.countries.length || 0} Countries Detected
              </span>
            </div>

            {/* Country List & Bars */}
            <div className="space-y-4">
              {stats?.countries && stats.countries.length > 0 ? (
                stats.countries.map((c) => (
                  <div key={c.code} className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <span className="font-bold text-white">{c.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {c.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400">{c.count} visits</span>
                        <span className="font-bold text-amber-400">{c.percentage}%</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, c.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs font-mono">
                  No visits logged yet. Share your Cloudflare link or refresh to see visitor geography!
                </div>
              )}
            </div>
          </div>

          {/* Device & Platform Breakdown (1 col) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Device & Hardware</h3>
                  <p className="text-xs text-slate-400">Visitor viewport & platform types</p>
                </div>
              </div>

              {/* Mobile vs Desktop visual cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <Smartphone className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <span className="text-2xl font-black text-white font-mono block">{mobilePct}%</span>
                  <span className="text-[11px] text-slate-400 font-medium">Mobile Visitors</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <Laptop className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <span className="text-2xl font-black text-white font-mono block">{desktopPct}%</span>
                  <span className="text-[11px] text-slate-400 font-medium">Desktop Visitors</span>
                </div>
              </div>

              {/* Top Browsers */}
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-3">
                Detected Browsers
              </h4>
              <div className="space-y-2">
                {stats?.browsers && stats.browsers.length > 0 ? (
                  stats.browsers.map((b) => (
                    <div key={b.name} className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                      <span className="text-slate-300 font-medium">{b.name}</span>
                      <span className="font-mono text-slate-400 font-bold">{b.count} views</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 font-mono">Awaiting browser traffic...</p>
                )}
              </div>
            </div>

            {/* In-App Browser Note */}
            <div className="mt-6 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-300">
              💡 <strong>WhatsApp & Social Links:</strong> Recruiter affiliate links opened inside WhatsApp or Instagram appear tagged automatically in the browser distribution.
            </div>
          </div>
        </div>

        {/* Top Pages & Traffic Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Top Viewed Pages */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Top Visited Pages & Vacancies</h3>
                <p className="text-xs text-slate-400">Most engaged sections across candidates</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {stats?.pages && stats.pages.length > 0 ? (
                stats.pages.map((p, idx) => (
                  <div key={p.path} className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-white font-medium">{p.path}</span>
                    </div>
                    <span className="font-mono text-amber-400 font-bold">{p.count} views</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-mono text-center py-6">No page views recorded yet.</p>
              )}
            </div>
          </div>

          {/* Traffic Sources / Referrers */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Traffic Acquisition Channels</h3>
                <p className="text-xs text-slate-400">Where visitors are discovering the site</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {stats?.referrers && stats.referrers.length > 0 ? (
                stats.referrers.map((r) => (
                  <div key={r.name} className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      {r.name}
                    </span>
                    <span className="font-mono text-emerald-300 font-bold">{r.count} visits</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-mono text-center py-6">No referral data recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Live Real-Time Activity Feed */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 shadow-xl mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Live Real-Time Activity Stream</h3>
                <p className="text-xs text-slate-400">Chronological feed of incoming visits and page navigations</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing last {stats?.recentVisits?.length || 0} visits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Page Route</th>
                  <th className="pb-3 font-semibold">Device & OS</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentVisits && stats.recentVisits.length > 0 ? (
                  stats.recentVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{v.flag}</span>
                          <div>
                            <span className="font-bold text-white block">{v.countryName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{v.city || v.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                          {v.path}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-slate-300">
                          <span className="font-medium text-white">{v.deviceType}</span>
                          <span className="text-[10px] text-slate-400 block">{v.os} • {v.browser}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-slate-300 font-medium">{v.referrer}</span>
                      </td>
                      <td className="py-3 text-right font-mono text-slate-400">
                        {v.timeAgo}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500 font-mono">
                      No visits logged yet. Visit pages on the website to see live events stream here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Privacy-preserving analytics: IP addresses are salted and hashed. Access secured with password gate.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link href="/apply" className="hover:text-amber-400 transition-colors">Vacancies</Link>
            <Link href="/track" className="hover:text-amber-400 transition-colors">Candidate Tracker</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
