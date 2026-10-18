'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Offer } from '@/lib/supabase/types';
import { 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Mic, 
  Globe, 
  Send,
  Calculator,
  ChevronRight,
  Headphones,
  Check,
  Building2,
  TrendingUp,
  Award,
  Zap,
  Lock,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Search,
  Compass,
  MapPin
} from 'lucide-react';

const FALLBACK_BPO_OFFERS = [
  {
    id: 'f1a10001-0000-0000-0000-000000000001',
    title: 'English US Airline Customer Service',
    company_name: 'Alorica',
    language: 'English',
    level: 'B2–C1',
    salary_range: 'Up to 21,000 EGP / Monthly',
    work_style: 'On-site',
    shift: 'Rotational (24/7)',
    location: 'Sheikh Zayed',
    recruiter_commission: 2000,
    cooling_period_days: 30,
    description: 'English US Airline Account with online interview and full transportation across Cairo & Giza.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000002',
    title: 'Bilingual French Customer Service Agent',
    company_name: 'Alorica',
    language: 'French',
    level: 'B2+ / C1',
    salary_range: 'Up to 32,000 EGP Gross / Monthly',
    work_style: 'On-site',
    shift: 'Rotational (9 hrs)',
    location: 'Sheikh Zayed',
    recruiter_commission: 3000,
    cooling_period_days: 30,
    description: 'High-earning French customer service in Sheikh Zayed. Transportation provided.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000003',
    title: 'English Travel Advisor (GDS Exp)',
    company_name: 'Atain',
    language: 'English',
    level: 'B2+ / C1',
    salary_range: '20,000 EGP Net / Monthly',
    work_style: 'On-site',
    shift: 'Rotational (9 hrs)',
    location: 'Maadi',
    recruiter_commission: 2200,
    cooling_period_days: 30,
    description: 'Global GDS travel advisor in Maadi. On-site interviews Monday to Friday.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000004',
    title: 'German Travel Account Bilingual (GDS Exp)',
    company_name: 'Atain',
    language: 'German',
    level: 'B2+ / C1',
    salary_range: '31,400 EGP Net / Monthly',
    work_style: 'On-site',
    shift: 'Day / Rotational',
    location: 'Maadi Technology Park',
    recruiter_commission: 3500,
    cooling_period_days: 30,
    description: 'Premium German & English bilingual travel advisor in Maadi Tech Park.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000005',
    title: 'Dutch Monolingual Customer Support',
    company_name: 'Enable',
    language: 'Dutch',
    level: 'B2–C1',
    salary_range: '62,000 EGP Gross',
    work_style: 'On-site',
    shift: 'Rotational 8-hr (9 AM – 9 PM)',
    location: 'Smart Village',
    recruiter_commission: 4500,
    cooling_period_days: 30,
    description: 'Top gross European account in Smart Village. Full-time in-source customer support.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000006',
    title: 'German Customer Service & Tech Support',
    company_name: 'Concentrix',
    language: 'German',
    level: 'B2–C1',
    salary_range: '25,000 – 33,000 EGP Gross',
    work_style: 'On-site',
    shift: '9 hrs/day (5 days/wk)',
    location: 'Smart Village / Maadi / Alex / Hurghada',
    recruiter_commission: 3200,
    cooling_period_days: 30,
    description: 'German customer support across multiple Egyptian hubs with door-to-door transport for females.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000007',
    title: 'Sales Agent (US Telesales Account)',
    company_name: 'LPM',
    language: 'English',
    level: 'B2+',
    salary_range: '20,000 EGP Net + Uncapped Commission (starts 6K)',
    work_style: 'On-site',
    shift: 'Fixed: 3:15 PM – 12:30 AM (Sat & Sun Off)',
    location: '6th of October City',
    recruiter_commission: 2200,
    cooling_period_days: 14,
    description: 'High-converting US telesales campaign in October. Door-to-door shuttles for females.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000008',
    title: 'Transfer / Qualification Agent (US Market)',
    company_name: 'Contact Center Source (CCS)',
    language: 'English',
    level: 'B2 / C1+',
    salary_range: '11,000 Net + 1,000 Transport + 3,000 KPIs + Comm',
    work_style: 'On-site',
    shift: 'Fixed Night: 6:00 PM – 3:00 AM (Sat & Sun Off)',
    location: 'Nasr City',
    recruiter_commission: 1500,
    cooling_period_days: 14,
    description: 'No experience needed, paid training, fixed night shifts with weekends off in Nasr City.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000009',
    title: 'German Outbound Sales Specialist',
    company_name: 'TTEC',
    language: 'German',
    level: 'B2–C1',
    salary_range: 'Up to 48,000 EGP / Monthly',
    work_style: 'On-site',
    shift: 'Fixed Day / Rotational',
    location: 'Maadi Technology Park',
    recruiter_commission: 4000,
    cooling_period_days: 30,
    description: 'High-ticket German enterprise outbound sales in Maadi Technology Park.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000010',
    title: 'Portuguese Customer Support (Email & Chat)',
    company_name: 'Teleperformance',
    language: 'Portuguese',
    level: 'Portuguese C1 & English B1+',
    salary_range: 'Up to 26,800 EGP Net / Monthly',
    work_style: 'On-site',
    shift: 'Rotational 9 hours',
    location: 'One Kattameya / Plaza',
    recruiter_commission: 2800,
    cooling_period_days: 30,
    description: 'Non-voice Portuguese email & chat support in One Kattameya with full transport provided.'
  }
];

const FAQS = [
  {
    category: 'candidates',
    q: 'Are there any recruitment fees or application charges for candidates?',
    a: 'Absolutely zero. ACE Agency is funded entirely by our corporate hiring partners (LPM, TTEC, Teleperformance, Geeky CX, etc.). Candidates never pay a single cent at any stage.'
  },
  {
    category: 'candidates',
    q: 'How does the 45-second Vocaroo voice audition work?',
    a: 'Instead of waiting weeks for resume screening, candidates record a simple 45-60 second English or foreign language introduction on Vocaroo.com and paste the link into the application. Our recruitment coordinators evaluate it directly and schedule WhatsApp fast-track interviews within 24–48 hours.'
  },
  {
    category: 'candidates',
    q: 'Can fresh graduates and undergraduates apply for multilingual positions?',
    a: 'Yes! Vacancies at LPM, TTC, Total Trip Planners, Crystal Reach, and LeadBull openly accept undergraduates, gap-year students, and fresh graduates. Language proficiency (B2/C1) is prioritized.'
  },
  {
    category: 'candidates',
    q: 'How do I track my interview schedule and application status?',
    a: 'Upon submitting your application, you receive a unique Application Reference Code (e.g. ACE-XXXXXX). Visit our Track Status portal anytime with your phone number and reference code to see live interview appointments and coordinator WhatsApp contacts.'
  },
  {
    category: 'recruiters',
    q: 'How does the 30-day affiliate cookie tracking operate?',
    a: 'When you share a job post with your unique affiliate referral code (?ref=YOUR_CODE), any candidate who visits and applies from that browser within 30 days is automatically attributed to your account via both cookies and database attribution triggers.'
  },
  {
    category: 'recruiters',
    q: 'What is the 60-day anti-duplicate candidate lock?',
    a: 'To guarantee fairness and prevent recruiter poaching, our system locks candidate phone and WhatsApp numbers for 60 days. The first recruiter to submit an eligible candidate owns the attribution for any placements during that window.'
  },
  {
    category: 'recruiters',
    q: 'When are commission payouts released from the cooling period?',
    a: 'Commissions enter a designated cooling timer (14, 21, 30, or 36 days based on the specific account) upon candidate start date to verify probation stability. As soon as the automated timer concludes, funds unlock to your withdrawable wallet with instant payout records.'
  }
];

export default function HomePage() {
  const [offers, setOffers] = useState<any[]>(FALLBACK_BPO_OFFERS);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'candidates' | 'recruiters'>('candidates');
  const [placedCount, setPlacedCount] = useState<number>(4);
  const [commissionTier, setCommissionTier] = useState<number>(4500);
  const [faqCategory, setFaqCategory] = useState<'all' | 'candidates' | 'recruiters'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadLiveOffers() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from('offers')
          .select('id, title, company_name, language, level, salary_range, work_style, location, shift, recruiter_commission, cooling_period_days, description')
          .eq('status', 'active')
          .order('company_name');

        if (data && data.length > 0) {
          setOffers(data);
        }
      } catch (err) {
        console.error('Failed to fetch live offers, using fallback BPO accounts', err);
      }
    }

    loadLiveOffers();
  }, []);

  // Filter offers by language and search query
  const filteredOffers = offers.filter((o) => {
    const matchesLang =
      selectedLanguage === 'All' ||
      o.language.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.location && o.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLang && matchesSearch;
  });

  // Calculations for interactive earnings slider
  const totalCommission = placedCount * commissionTier;
  const teamLeaderOverride = Math.round(totalCommission * 0.15);
  const totalWithOverride = totalCommission + teamLeaderOverride;

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-amber-500/15 via-blue-600/15 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none animate-float" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Top Live Ticker Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-gold text-amber-300 text-xs font-bold tracking-wide mb-8 animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
            <span>ACE RECRUITMENT AGENCY &bull; EGYPTIAN BPO PORTAL</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-amber-200/90 font-medium">20 Active BPO Vacancies Available</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl">
            Elite Multilingual Careers.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400">
              High-Velocity Affiliate Engine.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            Direct fast-track recruitment for Egypt’s premier BPO conglomerates: LPM, TTEC, Teleperformance, Geeky CX, eClerx, Alorica, and Cxperts. Featuring zero-storage voice auditions, 30-day affiliate cookie locks, and live candidate tracking.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Send className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              Apply as a Candidate
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-xs sm:text-sm glass-panel text-amber-300 hover:text-white hover:bg-slate-800/80 border border-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              Track Application Status
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-blue-400" />
              Recruiter & Partner Hub
            </Link>
          </div>

          {/* Floating Live Verification / Terminal Cockpit Mockup */}
          <div className="mt-14 w-full max-w-4xl glass-panel rounded-3xl p-5 sm:p-7 border border-slate-800/90 shadow-2xl relative text-left overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-slate-800 mx-1" />
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  live-pipeline.ace-agency.internal
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> RLS Data Isolated
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> 60-Day Anti-Duplicate Lock
                </span>
              </div>
            </div>

            {/* Simulated Live Match Row */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Candidate Audition</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> B2+ Verified
                  </span>
                </div>
                <p className="text-sm font-bold text-white">Youssef T. — LPM Telesales Agent</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="flex items-center gap-0.5 h-4 text-amber-400">
                    <span className="w-1 bg-amber-400 rounded-full wave-bar-1" />
                    <span className="w-1 bg-amber-400 rounded-full wave-bar-2" />
                    <span className="w-1 bg-amber-400 rounded-full wave-bar-3" />
                    <span className="w-1 bg-amber-400 rounded-full wave-bar-4" />
                    <span className="w-1 bg-amber-400 rounded-full wave-bar-5" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono ml-2">vocaroo.com/1a9B***</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Recruiter Attribution</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> 30-Day Cookie
                  </span>
                </div>
                <p className="text-sm font-bold text-white">Ref: ACE-REC-8921</p>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Recruiter: Omar M.</span>
                  <span className="text-emerald-400 font-bold">+1,500 EGP Pending</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Cooling Period Release</span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> 14 Days (LPM)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
                  <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full w-[70%]" />
                </div>
                <p className="text-[11px] text-slate-400 pt-0.5">Automated release unlocks upon probation maturity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Agency Performance Metrics Bar */}
      <section className="border-y border-slate-800/80 bg-slate-950/70 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              20
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-300">Live Egyptian BPO Offers</p>
            <p className="text-[11px] text-slate-400">LPM, TTEC, TP, Geeky CX, eClerx</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              45-Sec
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-300">Fast Voice Auditions</p>
            <p className="text-[11px] text-slate-400">Zero-storage audio evaluation</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              60-Day
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-300">Anti-Duplicate Protection</p>
            <p className="text-[11px] text-slate-400">Guaranteed recruiter attribution</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-white">
              24 – 48h
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-300">Interview Turnaround</p>
            <p className="text-[11px] text-slate-400">Direct WhatsApp coordinator chat</p>
          </div>
        </div>
      </section>

      {/* Featured 20 BPO Opportunities Section */}
      <section id="vacancies" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              HOT EGYPTIAN BPO VACANCIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Explore 20 Verified Corporate Openings
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Verified salary packages, door-to-door transport, night shift allowances, and fast-track interview scheduling.
            </p>
          </div>

          {/* Language Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl glass-panel border border-slate-800 self-start md:self-auto overflow-x-auto">
            {['All', 'English', 'Dutch', 'Portuguese', 'French', 'Spanish'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLanguage === lang
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company (LPM, TTEC, Geeky CX...), title, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Vacancy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((vacancy) => (
            <div
              key={vacancy.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 card-hover-effect flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Subtle accent corner glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 group-hover:bg-amber-500/15 rounded-bl-full transition-all duration-300 pointer-events-none" />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {vacancy.language} &bull; {vacancy.level}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {vacancy.company_name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">
                    {vacancy.recruiter_commission ? `${vacancy.recruiter_commission.toLocaleString()} EGP Payout` : ''}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {vacancy.title}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-300">{vacancy.location}</span>
                </p>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-2">
                  {vacancy.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Salary:</span>
                    <span className="font-bold text-amber-400 text-xs truncate max-w-[180px] text-right">{vacancy.salary_range}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Setup:</span>
                    <span className="font-semibold text-white text-xs">{vacancy.work_style}</span>
                  </div>
                  {vacancy.cooling_period_days && (
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                      <span>Cooling Timer:</span>
                      <span className="font-mono text-blue-400">{vacancy.cooling_period_days} Days</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <Link
                  href={`/apply/${vacancy.id}`}
                  className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  Fast-Track Apply
                </Link>
                <Link
                  href="/login"
                  className="py-2 px-3 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition-all flex items-center gap-1 shrink-0"
                  title="Recruiter affiliate link"
                >
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Affiliate</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center space-y-2">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
          >
            Submit an open application for best matching vacancy <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div>
            <Link
              href="/track"
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
            >
              Already submitted? Track your application status here <ArrowRight className="w-3 h-3 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dual-Track Process: Candidates vs Recruiters */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
            TRANSPARENT & FRICTIONLESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Engineered for Candidates & Recruiters Alike
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Choose your path to explore how ACE Agency removes traditional recruitment bottlenecks.
          </p>

          {/* Interactive Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl glass-panel border border-slate-800 mt-6 gap-2">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'candidates'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab('recruiters')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'recruiters'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              For Affiliate Recruiters
            </button>
          </div>
        </div>

        {/* Dynamic Workflow Steps */}
        {activeTab === 'candidates' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3 font-mono">01</span>
              <h3 className="text-base font-bold text-white mb-2">Fast 1-Min Form</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit your contact details and language level. No long resume parsing or tedious account creation required.
              </p>
            </div>

            <div className="glass-panel-gold rounded-2xl p-6 border relative">
              <span className="text-3xl font-black text-amber-500/40 block mb-3 font-mono">02</span>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-400" />
                45s Voice Audition
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste a Vocaroo voice link proving your conversational fluency. Skip 2 rounds of basic screening immediately.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3 font-mono">03</span>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                WhatsApp Coordination
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our coordinators message you on WhatsApp within 24-48 hours with company briefing, interview prep, and time slots.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3 font-mono">04</span>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Live Status Tracker
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track your real-time milestone progress on /track with your phone and reference code anytime.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3 font-mono">01</span>
              <h3 className="text-base font-bold text-white mb-2">Unique Referral Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1-click copy pre-written social media job ads bundled with your cryptographic affiliate identifier.
              </p>
            </div>

            <div className="glass-panel-blue rounded-2xl p-6 border relative">
              <span className="text-3xl font-black text-blue-500/40 block mb-3 font-mono">02</span>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                30-Day Cookie Lock
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Persistent 30-day tracking ensures you get full credit even if candidates explore or apply days later.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3 font-mono">03</span>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                60-Day Anti-Theft Lock
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Duplicate phone numbers within 60 days are blocked from being stolen by other recruiters or third parties.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3 font-mono">04</span>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Cooling Period Wallet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commissions mature automatically and unlock to your wallet. Direct bank, Instapay, or digital wallet transfers.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Interactive Recruiter Earnings Calculator */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <Calculator className="w-3.5 h-3.5" />
                PROJECTION ENGINE
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Affiliate Recruiter Earnings Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Estimate your monthly earnings based on candidate placements and language tier.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-slate-400">Prorated Instapay / Bank Wire</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                  <span>Placed Candidates This Month:</span>
                  <span className="text-base text-amber-400 font-black">{placedCount} Candidates</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={placedCount}
                  onChange={(e) => setPlacedCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                  <span>1 placement</span>
                  <span>10 placements</span>
                  <span>20+ placements</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Average Placement Commission Tier:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Standard Telesales', val: 1500 },
                    { label: 'French / Spanish', val: 2500 },
                    { label: 'Dutch Executive', val: 4000 }
                  ].map((tier) => (
                    <button
                      key={tier.val}
                      onClick={() => setCommissionTier(tier.val)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        commissionTier === tier.val
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="block text-[11px] font-medium">{tier.label}</span>
                      <span className="block font-black text-white mt-1">{tier.val.toLocaleString()} EGP</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Calculation Display Card */}
            <div className="glass-panel-emerald rounded-2xl p-6 border relative space-y-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Estimated Direct Monthly Payout</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  {totalCommission.toLocaleString()} <span className="text-sm font-bold text-emerald-300">EGP</span>
                </span>
              </div>

              <div className="pt-3 border-t border-emerald-500/20 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Per-candidate reward:</span>
                  <span className="font-bold text-white">{commissionTier.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Team Leader Override (if applicable):</span>
                  <span className="font-bold text-amber-400">+{teamLeaderOverride.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold text-white">
                  <span>Total Potential Yield:</span>
                  <span className="text-amber-300 font-black">{totalWithOverride.toLocaleString()} EGP</span>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
              >
                Access Recruiter Portal to Start Earning <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Dashboards Section */}
      <section id="recruiter-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            ROLE-BASED SECURITY & PERMISSIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Three Distinct Operational Command Hubs</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Strict PostgreSQL Row-Level Security (RLS) ensures recruiters, team leaders, and super administrators only see their authorized candidate pools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Tier */}
          <div className="glass-panel rounded-3xl p-7 border border-slate-800 card-hover-effect flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Super Admin Command</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Method 1 Manual Offer Creator, 1-click status toggling, complete user & team hierarchy management, and agency-wide commission disbursement tracking.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Complete candidate audit log
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Provision Leader & Recruiter accounts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Automated cooling period overrides
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/dashboard/admin"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
              >
                Access Admin Hub <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Team Leader Tier */}
          <div className="glass-panel rounded-3xl p-7 border border-slate-800 card-hover-effect flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/10">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Team Leader Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict team isolation: supervise assigned recruiters, inline Vocaroo audio audition players, scheduled status updates, and 1-click WhatsApp messaging.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" /> Real-time team candidate queues
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" /> Vocaroo inline audition player
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" /> Direct WhatsApp candidate launch
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/dashboard/leader"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 flex items-center justify-center gap-1.5 transition-all"
              >
                Access Leader Hub <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recruiter Tier */}
          <div className="glass-panel rounded-3xl p-7 border border-slate-800 card-hover-effect flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Recruiter Affiliate Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active vacancies marketplace, 1-click "Copy Minimized Post + My Affiliate Link", 30-day cookie tracking, and cooling-period commission wallet.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 1-Click pre-written job ad copies
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 30-Day automated cookie tracking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Transparent cooling period balance
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/dashboard/recruiter"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
              >
                Access Recruiter Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            CLEAR ANSWERS
          </div>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need to know about candidate fast-track applications and recruiter commission models.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {(['all', 'candidates', 'recruiters'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  faqCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.filter(f => faqCategory === 'all' || f.category === faqCategory).map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl p-8 sm:p-12 glass-panel-gold border overflow-hidden text-center">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold inline-block">
              READY TO ACCELERATE?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Launch Your Career or Supercharge Your Recruitment Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join hundreds of multilingual specialists and affiliate partners operating on Egypt's fastest-growing recruitment network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/apply"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-950" />
                Submit Application Now
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs glass-panel text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-amber-400" />
                Track Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-slate-900 bg-[#05070d] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/80">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-950 font-black" />
              </div>
              <span className="text-base font-black text-white tracking-wider">ACE AGENCY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation multilingual recruitment architecture and affiliate commission tracking platform.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Status: Operational (99.98%)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Top BPO Openings</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#vacancies" className="hover:text-amber-400 transition-colors">LPM Telesales (20K Net)</a></li>
              <li><a href="#vacancies" className="hover:text-amber-400 transition-colors">TTEC Dutch Sales (64K Gross)</a></li>
              <li><a href="#vacancies" className="hover:text-amber-400 transition-colors">Geeky CX Debt Sales (20K Base + USD)</a></li>
              <li><a href="#vacancies" className="hover:text-amber-400 transition-colors">Teleperformance English (19K Net)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Portals & Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/apply" className="hover:text-amber-400 transition-colors">Candidate Fast-Track Form</Link></li>
              <li><Link href="/track" className="hover:text-amber-400 transition-colors">Candidate Status Tracker</Link></li>
              <li><Link href="/dashboard/recruiter" className="hover:text-amber-400 transition-colors">Recruiter Affiliate Portal</Link></li>
              <li><Link href="/dashboard/leader" className="hover:text-amber-400 transition-colors">Team Leader Supervisor Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Compliance & Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Protected by Row-Level Security (RLS) data isolation, 60-day anti-tamper duplicate candidate locks, and zero audio storage policies.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              ISO/IEC 27001 Standards Aligned
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} ACE Recruitment Agency. All rights reserved.</p>
          <p className="text-slate-400">
            Strict Data Isolation &bull; Anti-Fraud Protection &bull; Instant WhatsApp Routing
          </p>
        </div>
      </footer>
    </div>
  );
}
