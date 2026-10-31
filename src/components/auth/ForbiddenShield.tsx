'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowRight, Home, LogIn, Sparkles } from 'lucide-react';

interface ForbiddenShieldProps {
  requiredRole?: string;
  description?: string;
}

export function ForbiddenShield({
  requiredRole = 'Super Administrator',
  description,
}: ForbiddenShieldProps) {
  const loginUrl = typeof window !== 'undefined' 
    ? `/login?redirect=${encodeURIComponent(window.location.pathname)}` 
    : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#05070D] text-slate-100 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* Luxury Glass Shield Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)] backdrop-blur-2xl text-center relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Glowing Shield Icon */}
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-amber-500/5 animate-pulse blur-md" />
            <div className="relative w-20 h-20 rounded-2xl bg-[#090D18] border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl">
              <ShieldAlert className="w-10 h-10 text-amber-400 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1 rounded-full border-2 border-[#090D18]">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-bold tracking-wider uppercase mb-3">
            <span>403 Access Restricted</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Protected Command Hub
          </h1>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {description || (
              <>
                This operational terminal requires verified{' '}
                <strong className="text-amber-400 font-semibold">{requiredRole}</strong>{' '}
                privileges. Access has been locked by ACE Agency zero-trust security.
              </>
            )}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href={loginUrl}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>Log In with Authorized Account</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700/60 hover:border-slate-600 transition-all"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>Return to Agency Homepage</span>
            </Link>
          </div>

          {/* Micro Footer Guarantee */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ACE Agency • Enterprise RLS & Role Gate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
