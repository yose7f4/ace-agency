'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Sparkles, 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2,
  Users,
  Briefcase,
  KeyRound,
  Compass
} from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleHint, setSelectedRoleHint] = useState<'admin' | 'leader' | 'recruiter'>('recruiter');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        // Fetch user profile to route directly to their specific role dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const role = profile?.role || 'recruiter';
        if (redirectPath) {
          router.push(redirectPath);
        } else if (role === 'admin') {
          router.push('/dashboard/admin');
        } else if (role === 'team_leader') {
          router.push('/dashboard/leader');
        } else {
          router.push('/dashboard/recruiter');
        }
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid login credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Role Context Bar */}
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl glass-panel border border-slate-800 mb-6 text-xs">
        <button
          type="button"
          onClick={() => setSelectedRoleHint('recruiter')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRoleHint === 'recruiter'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
          Recruiter
        </button>
        <button
          type="button"
          onClick={() => setSelectedRoleHint('leader')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRoleHint === 'leader'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-400" />
          Team Leader
        </button>
        <button
          type="button"
          onClick={() => setSelectedRoleHint('admin')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRoleHint === 'admin'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Admin
        </button>
      </div>

      <div className="glass-panel-gold rounded-3xl p-8 border shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-blue-500/20 to-transparent border border-amber-500/30 mb-4 shadow-inner">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">ACE Agency</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {selectedRoleHint === 'recruiter' && 'Access your active vacancies marketplace & affiliate link engine'}
            {selectedRoleHint === 'leader' && 'Supervise assigned recruiters, Vocaroo auditions & WhatsApp workflows'}
            {selectedRoleHint === 'admin' && 'Enterprise offer builder, user provisioning & commission logs'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@ace-agency.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 text-xs transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 text-slate-950" />
                Sign In to Dedicated Portal
                <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Staff & Recruiter Portal &bull; Enterprise credentials are provisioned exclusively by Super Administration.
          </p>
          <div className="mt-3">
            <Link
              href="/apply"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
            >
              Are you a job candidate? Apply for open roles here <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] bg-grid-pattern">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<div className="text-slate-400 text-xs">Loading portal...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
