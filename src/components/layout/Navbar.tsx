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
    <header className="sticky top-3 sm:top-5 z-50 w-full px-3 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto floating-navbar rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto border border-white/10 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(245,158,11,0.15)] bg-[#05070D]/90 backdrop-blur-2xl">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-5 sm:gap-7">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500 p-[1.5px] shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#05070D] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                  ACE
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-300 group-hover:text-amber-300 transition-colors">
                  AGENCY
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Intake Active
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-tight">
                Corporate BPO Recruitment
              </span>
            </div>
          </Link>

          {/* Desktop Anchor Navigation */}
          {pathname === '/' && (
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-white/10 text-xs font-semibold text-slate-300">
              <a
                href="#vacancies"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Vacancies
              </a>
              <a
                href="#bento-features"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                Technology
              </a>
              <a
                href="#calculator"
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                Earnings Calculator
              </a>
              <a
                href="#apply-now"
                className="px-3.5 py-1.5 rounded-full hover:text-amber-300 hover:bg-amber-400/10 transition-all font-bold text-amber-400 cursor-pointer"
              >
                Fast-Track Apply
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
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] focus:outline-none cursor-pointer"
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
