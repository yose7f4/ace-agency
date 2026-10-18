'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Award,
  Menu,
  X,
  Send,
  Calculator,
  Compass,
  ArrowRight,
  Search
} from 'lucide-react';

function NavbarNavigation() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfile(data as Profile);
          }
        }
      } catch (err) {
        console.error('Failed to load user profile in navbar', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      setProfile(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error', err);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Super Admin
          </span>
        );
      case 'team_leader':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Users className="w-3 h-3 text-blue-400" />
            Team Leader
          </span>
        );
      case 'recruiter':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Award className="w-3 h-3 text-emerald-400" />
            Recruiter
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-8 bg-slate-900 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (profile) {
    return (
      <div className="flex items-center gap-2.5 sm:gap-3">
        {profile.role === 'admin' && (
          <Link
            href="/dashboard/admin"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith('/dashboard/admin')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Hub</span>
          </Link>
        )}

        {profile.role === 'team_leader' && (
          <Link
            href="/dashboard/leader"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith('/dashboard/leader')
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Leader Hub</span>
          </Link>
        )}

        {profile.role === 'recruiter' && (
          <Link
            href="/dashboard/recruiter"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith('/dashboard/recruiter')
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Recruiter Portal</span>
          </Link>
        )}

        <div className="hidden md:block">
          {getRoleBadge(profile.role)}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <span className="text-xs text-slate-300 font-medium hidden lg:inline max-w-[120px] truncate">
            {profile.full_name || profile.email}
          </span>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/track"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
      >
        <Search className="w-3.5 h-3.5 text-amber-400" />
        Track Status
      </Link>
      <Link
        href="/apply"
        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
      >
        <Send className="w-3.5 h-3.5" />
        Apply
      </Link>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/15 hover:shadow-amber-500/25 transition-all"
      >
        <LogIn className="w-3.5 h-3.5 text-slate-950" />
        Partner Login
      </Link>
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-[#070a12]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-blue-600 p-[1.5px] shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/25 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#070a12] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-blue-400">
                  ACE
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
                  Agency
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  RLS Active
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                Talent & Commission Engine
              </span>
            </div>
          </Link>

          {/* Desktop Anchor Navigation */}
          {pathname === '/' && (
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-800/80 text-xs font-semibold text-slate-300">
              <a
                href="#vacancies"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Opportunities
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#recruiter-engine"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-blue-400" />
                Affiliate Engine
              </a>
              <a
                href="#calculator"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                Earnings Calculator
              </a>
            </nav>
          )}
        </div>

        {/* Dynamic Nav & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Suspense fallback={<div className="w-20 h-8 bg-slate-900 rounded-lg animate-pulse" />}>
            <NavbarNavigation />
          </Suspense>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-[#070a12]/95 px-4 pt-3 pb-5 space-y-2 text-sm font-medium animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            <Search className="w-4 h-4 text-amber-400" />
            Track Application Status
          </Link>
          <a
            href="#vacancies"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Explore Open Vacancies
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            Dual-Track Process
          </a>
          <a
            href="#recruiter-engine"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            Recruiter & Leader Hubs
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            Commission Earnings Calculator
          </a>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30"
            >
              Apply as a Candidate
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950"
            >
              Partner & Recruiter Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
