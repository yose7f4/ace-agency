'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import { CandidateApplicationForm } from '@/components/candidates/CandidateApplicationForm';
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
  MapPin,
  Calculator,
  Flame,
  Volume2,
  VolumeX,
  CreditCard,
  Share2,
  Copy
} from 'lucide-react';

const FALLBACK_BPO_OFFERS = [
  {
    id: 'f1a10001-0000-0000-0000-000000000001',
    title: 'English US Airline Customer Service',
    company_name: 'WGS Global',
    language: 'English',
    level: 'B2–C1',
    salary_range: '22,000 - 26,000 EGP Net',
    work_style: 'On-site',
    shift: 'Rotational (9 hrs)',
    location: 'New Cairo & Maadi',
    recruiter_commission: 2200,
    cooling_period_days: 30,
    description: 'Premier US Airline account. Immediate intake for Feb WGS batch. Door-to-door transportation provided across Cairo & Giza.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000002',
    title: 'Bilingual French Customer Experience',
    company_name: 'Teleperformance',
    language: 'French',
    level: 'B2+ / C1',
    salary_range: '32,000 - 36,000 EGP Net',
    work_style: 'On-site / Hybrid',
    shift: 'Day & Evening Shift',
    location: 'Sheikh Zayed & 6th of October',
    recruiter_commission: 3200,
    cooling_period_days: 30,
    description: 'High-earning French customer care. Full health insurance, social benefits, and dedicated bus meeting points.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000003',
    title: 'German Executive Technical Support',
    company_name: 'Concentrix',
    language: 'German',
    level: 'B2+ / C1',
    salary_range: '38,000 - 45,000 EGP Net',
    work_style: 'Remote / Work From Home',
    shift: 'Rotational (5 Days)',
    location: 'Work From Home (Egypt-Wide)',
    recruiter_commission: 4500,
    cooling_period_days: 30,
    description: '100% Remote German Technical Support. Hardware provided, instant sign-on bonus, and fast-track interview pipeline.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000004',
    title: 'Italian Travel & Booking Advisor',
    company_name: 'Alorica',
    language: 'Italian',
    level: 'B2 / C1',
    salary_range: '28,000 - 34,000 EGP Net',
    work_style: 'On-site',
    shift: 'Rotational (24/7)',
    location: 'Maadi Technology Park',
    recruiter_commission: 3000,
    cooling_period_days: 30,
    description: 'Global Italian luxury travel account in Maadi Tech Park. On-site interviews with instant job offer issuance.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000005',
    title: 'Spanish E-Commerce Specialist',
    company_name: 'Webhelp',
    language: 'Spanish',
    level: 'B2 / C1',
    salary_range: '26,000 - 30,000 EGP Net',
    work_style: 'On-site',
    shift: 'Rotational',
    location: 'New Cairo',
    recruiter_commission: 2800,
    cooling_period_days: 30,
    description: 'Spanish E-Commerce resolution specialist for European accounts. Free gym access and career progression.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000006',
    title: 'English Fast-Track B1 Support',
    company_name: 'WGS Global',
    language: 'English',
    level: 'B1 (Fast-Track)',
    salary_range: '17,000 - 20,000 EGP Net',
    work_style: 'On-site',
    shift: 'Rotational',
    location: 'Nasr City',
    recruiter_commission: 1800,
    cooling_period_days: 21,
    description: 'High-volume intake batch accepting intermediate B1 English. Undergraduates and high school graduates welcome!'
  }
];

const FAQS = [
  {
    category: 'candidates',
    q: 'Are there any fees or deductions for candidates applying through ACE Agency?',
    a: 'Absolutely none. ACE Recruitment Agency is an officially contracted recruitment partner for multinational BPO conglomerates. Our placement services are 100% free for candidates at every stage.'
  },
  {
    category: 'candidates',
    q: 'Why is a 45–60 second Vocaroo voice audition required?',
    a: 'Top contact centers evaluate pronunciation, spoken fluency, and grammar as their primary filter. By recording a quick voice note in advance, your application bypasses lengthy resume reviews and receives direct interview shortlisting within 24 to 48 hours.'
  },
  {
    category: 'candidates',
    q: 'Why is Egyptian National ID (الرقم القومي) requested on the application?',
    a: 'National ID verification is required by our corporate BPO clients (Concentrix, Teleperformance, WGS) to verify you are not currently blacklisted or already active in their internal onboarding databases, and ensures your application slot is officially reserved.'
  },
  {
    category: 'recruiters',
    q: 'How does the 30-day affiliate cookie tracking operate?',
    a: 'When you share any job post or vacancy link with your unique affiliate referral code (?ref=YOUR_CODE), any candidate who visits and applies from that browser within 30 days is automatically attributed to your account via encrypted cookies and database triggers.'
  },
  {
    category: 'recruiters',
    q: 'What is the 60-day anti-theft candidate lock?',
    a: 'To guarantee absolute fairness and eliminate candidate poaching, our database triggers enforce a strict 60-day lock on contact numbers and National IDs. The first recruiter to submit an eligible applicant owns that candidate attribution for all placements within the 60-day window.'
  },
  {
    category: 'recruiters',
    q: 'When are commission payouts released from the cooling period?',
    a: 'Commissions enter a designated cooling timer (usually 30 days upon candidate batch start) to verify attendance and probation stability. As soon as the automated timer completes, funds unlock into your wallet for instant disbursement via Bank Wire or Instapay.'
  }
];

export default function HomePage() {
  const [offers, setOffers] = useState<any[]>(FALLBACK_BPO_OFFERS);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'candidates' | 'recruiters'>('candidates');
  const [faqCategory, setFaqCategory] = useState<'all' | 'candidates' | 'recruiters'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Audio wave demo state
  const [isPlayingAudioDemo, setIsPlayingAudioDemo] = useState(true);

  // Recruiter Earnings Calculator state
  const [placedCount, setPlacedCount] = useState<number>(5);
  const [commissionTier, setCommissionTier] = useState<number>(2500);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter offers by language and search query
  const filteredOffers = offers.filter((o) => {
    const matchesLang =
      selectedLanguage === 'All' ||
      (o.language && o.language.toLowerCase().includes(selectedLanguage.toLowerCase()));

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
    <div className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-fade-in border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: 21st.dev Glassmorphism Trust Hero                         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-cyan-500/10 to-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-12 right-12 w-96 h-96 bg-amber-400/10 rounded-full blur-[110px] pointer-events-none animate-float" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-gold text-amber-300 text-xs font-bold tracking-wide mb-8 animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
            <span className="tracking-wider uppercase">FEBRUARY 2027 FAST-TRACK BATCHES ACTIVE</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-amber-200/90 font-medium">Zero Candidate Fees • Instant WhatsApp Routing</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.1] mb-6">
            Elite Multilingual Careers &{' '}
            <span className="shimmer-text">High-Velocity BPO Matrix</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10 font-normal">
            Direct fast-track pipeline connecting Egypt’s top multilingual talent (English, German, French, Italian, Spanish) with Tier-1 corporate BPO accounts. Zero-storage voice auditions, 60-day anti-theft candidate protection, and cooling-period commission wallets.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <a
              href="#vacancies"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl shimmer-button text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 group cursor-pointer"
            >
              <span>Explore Fast-Track Vacancies</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#apply-now"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-white hover:text-amber-300 font-bold text-sm tracking-wide border border-slate-700/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Apply in 60 Seconds</span>
            </a>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4 text-blue-400" />
              <span>Recruiter Portal</span>
            </Link>
          </div>

          {/* Trust Metric Badges Bar */}
          <div className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl glass-panel-luxury border border-amber-500/20 text-center">
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">1,400+</span>
              <p className="text-xs font-bold text-slate-200 mt-0.5">Candidates Placed</p>
              <p className="text-[10px] text-slate-400">WGS, Concentrix, TP</p>
            </div>
            <div className="p-3 border-l border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">48 Hours</span>
              <p className="text-xs font-bold text-slate-200 mt-0.5">Interview Turnaround</p>
              <p className="text-[10px] text-slate-400">Direct WhatsApp Scheduling</p>
            </div>
            <div className="p-3 border-t sm:border-t-0 sm:border-l border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">2.4M+ EGP</span>
              <p className="text-xs font-bold text-slate-200 mt-0.5">Commissions Paid</p>
              <p className="text-[10px] text-slate-400">Cooling Timer Wallets</p>
            </div>
            <div className="p-3 border-t lg:border-t-0 border-l border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">60-Day</span>
              <p className="text-xs font-bold text-slate-200 mt-0.5">Anti-Theft Lock</p>
              <p className="text-[10px] text-slate-400">Zero Recruiter Poaching</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 21st.dev 4-CARD BENTO GRID: Architectural Capabilities                 */}
      {/* ========================================================================= */}
      <section id="bento-features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            ENGINEERED RECRUITMENT MOATS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Next-Generation Architectural Capabilities
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Combining an intelligent ATS with an automated CRM affiliate engine for elite multilingual talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento Card 1: Zero-Storage Spoken Voice Audition */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-slate-800 card-hover-effect relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  Zero-Storage Audio Screening
                </span>
                <button
                  onClick={() => setIsPlayingAudioDemo(!isPlayingAudioDemo)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  title="Toggle Waveform Simulation"
                >
                  {isPlayingAudioDemo ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                45–60 Second Spoken English Auditions
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mb-6">
                Candidates record a quick audio introduction on Vocaroo and paste the link. Audio evaluates directly in-browser for accent, pronunciation, and grammar—bypassing storage bloat and protecting PII.
              </p>

              {/* Interactive Audio Waveform Simulation */}
              <div className="p-4 rounded-2xl bg-[#070b16] border border-amber-500/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="font-bold text-amber-400">Live Voice Screening Visualizer</span>
                    <span className="font-mono text-slate-400">00:45 / 01:00 • B2 Fluent</span>
                  </div>
                  {/* Animated Wave Equalizer */}
                  <div className="h-8 flex items-center gap-1">
                    {[
                      'wave-bar-1', 'wave-bar-2', 'wave-bar-3', 'wave-bar-4', 
                      'wave-bar-5', 'wave-bar-6', 'wave-bar-7', 'wave-bar-2', 
                      'wave-bar-4', 'wave-bar-1', 'wave-bar-5', 'wave-bar-3',
                      'wave-bar-6', 'wave-bar-2', 'wave-bar-7', 'wave-bar-4',
                      'wave-bar-1', 'wave-bar-5', 'wave-bar-3', 'wave-bar-2'
                    ].map((cls, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full transition-all ${
                          isPlayingAudioDemo ? cls : 'h-1.5 opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Instant Team Leader validation
              </span>
              <span className="font-mono text-amber-400">Evaluates Accent & Clarity</span>
            </div>
          </div>

          {/* Bento Card 2: 60-Day Anti-Theft Lock */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 card-hover-effect relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                60-Day Anti-Theft Candidate Lock
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Candidate contact details and Egyptian National IDs are cryptographically locked for 60 calendar days upon submission. The first recruiter to submit an eligible candidate owns the attribution.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-300 space-y-1">
              <div className="flex justify-between">
                <span>Lock Duration:</span>
                <span className="font-bold text-white">60 Calendar Days</span>
              </div>
              <div className="flex justify-between">
                <span>Deduplication:</span>
                <span className="text-emerald-400">Phone + ID + WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: 1-Click WhatsApp Routing */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 card-hover-effect relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                1-Click WhatsApp Coordinator
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Automated templates for interview invites, 24-hour double-check reminders, and interview briefings with the mandatory instruction to mention ACE Agency.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              📌 Includes Agency Attribution clause to guarantee commissions during client interviews.
            </div>
          </div>

          {/* Bento Card 4: February Fast-Track Batches */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-slate-800 card-hover-effect relative overflow-hidden flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  Upcoming Batch Intake
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  February WGS & Concentrix Intake
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                Starting Feb 2027
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Immediate openings across premier BPO accounts. Door-to-door transportation, paid training batches, overnight shift allowances, and zero candidate placement fees.
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-lg font-black text-white">22,000+</span>
                <p className="text-[10px] text-slate-400">Starting Net (EGP)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-lg font-black text-emerald-400">B1 to C1</span>
                <p className="text-[10px] text-slate-400">English Levels</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-lg font-black text-amber-400">Door-to-Door</span>
                <p className="text-[10px] text-slate-400">Transportation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC MULTILINGUAL VACANCY MARKETPLACE                                */}
      {/* ========================================================================= */}
      <section id="vacancies" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              HOT BPO OPENINGS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Verified Corporate Vacancies
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Verified salary packages, door-to-door transport, night shift allowances, and fast-track interview scheduling.
            </p>
          </div>

          {/* Language Filter Tabs with Live Counters */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-slate-800 self-start md:self-auto overflow-x-auto">
            {['All', 'English', 'German', 'French', 'Italian', 'Spanish'].map((lang) => {
              const count = lang === 'All' 
                ? offers.length 
                : offers.filter(o => o.language && o.language.toLowerCase().includes(lang.toLowerCase())).length;

              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedLanguage === lang
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{lang}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedLanguage === lang ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company (WGS, Concentrix...), title, or location..."
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
                      {vacancy.language} • {vacancy.level}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {vacancy.company_name}
                    </span>
                  </div>
                  {vacancy.recruiter_commission && (
                    <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">
                      {vacancy.recruiter_commission.toLocaleString()} EGP Payout
                    </span>
                  )}
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
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Net Salary:</span>
                    <span className="font-bold text-amber-400 text-xs truncate max-w-[180px] text-right">{vacancy.salary_range}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Work Style:</span>
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
                <button
                  onClick={() => {
                    const postText = `🔥 NEW VACANCY ALERT — ACE RECRUITMENT 🔥\n💼 Position: ${vacancy.title}\n🏢 Account: ${vacancy.company_name}\n🗣 Language: ${vacancy.language} (${vacancy.level})\n📍 Location: ${vacancy.location} (${vacancy.work_style})\n💰 Net Salary: ${vacancy.salary_range}\n\n✅ Fast-Track Interview & Zero Fees!\n👇 Apply now in under 2 minutes:\n${window.location.origin}/apply/${vacancy.id}`;
                    navigator.clipboard.writeText(postText);
                    showToast('Job post copied to clipboard with apply link!');
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy 1-Click Social Media Ad"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE RECRUITER EARNINGS CALCULATOR                                */}
      {/* ========================================================================= */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-slate-800/80">
        <div className="glass-panel-luxury rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden">
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
                Estimate your monthly commissions based on placed candidates and language tier.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-slate-400">Weekly Instapay & Bank Wire</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                  <span>Monthly Placed Candidates:</span>
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
                    { label: 'German Executive', val: 4500 }
                  ].map((tier) => (
                    <button
                      key={tier.val}
                      onClick={() => setCommissionTier(tier.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        commissionTier === tier.val
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Earnings Projection Card */}
            <div className="p-6 rounded-2xl bg-[#070b16] border border-amber-500/30 text-center space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Estimated Monthly Earnings
                </span>
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 font-mono">
                  {totalCommission.toLocaleString()} EGP
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span>Base Recruiter Commission:</span>
                  <span className="font-mono text-white font-bold">{totalCommission.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Team Leader Override (15%):</span>
                  <span className="font-mono text-emerald-400 font-bold">+{teamLeaderOverride.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-white">
                  <span>Total With Leadership:</span>
                  <span className="font-mono text-amber-400">{totalWithOverride.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTEGRATED 3-STEP CANDIDATE APPLICATION SECTION                         */}
      {/* ========================================================================= */}
      <section id="apply-now" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
            <Send className="w-3.5 h-3.5" />
            DIRECT FAST-TRACK APPLICATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Apply with ACE Agency in 60 Seconds
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Fill out your details, provide your 14-digit National ID and voice audition link. Direct shortlisting for February batches.
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-3xl mx-auto p-12 text-center text-slate-400 text-xs">
            Loading Fast-Track Application Form...
          </div>
        }>
          <CandidateApplicationForm />
        </Suspense>
      </section>

      {/* ========================================================================= */}
      {/* 6. CATEGORIZED FAQ SECTION                                                */}
      {/* ========================================================================= */}
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
                className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40"
                >
                  <span className="font-bold text-white text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. EXECUTIVE TRUST FOOTER                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-[#030509] py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">ACE Recruitment Agency</span>
            <span>• Multilingual Talent & Affiliate Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <a href="#vacancies" className="hover:text-amber-400 transition-colors">Vacancies</a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">Earnings</a>
            <Link href="/track" className="hover:text-amber-400 transition-colors">Track Status</Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors">Partner Login</Link>
          </div>

          <div className="text-[11px] font-mono text-slate-600">
            Next.js 16 • React 19 • Supabase RLS Protected
          </div>
        </div>
      </footer>
    </div>
  );
}
