'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import { CandidateApplicationForm } from '@/components/candidates/CandidateApplicationForm';
import KineticGrid from '@/components/ui/kinetic-grid';
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
  Volume2,
  VolumeX,
  CreditCard,
  Share2,
  Copy,
  Play,
  Pause,
  Radio,
  Car,
  FileCheck2,
  PhoneCall,
  UserCheck
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
    flag: '🇬🇧',
    theme: 'gold',
    description: 'Premier US Airline account. Immediate intake for Feb WGS batch. Door-to-door transportation provided across Cairo & Giza.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000002',
    title: 'Bilingual French Customer Experience',
    company_name: 'Teleperformance',
    language: 'French',
    level: 'B2+ / C1',
    salary_range: '32,000 - 36,000 EGP Net',
    work_style: 'Hybrid',
    shift: 'Day & Evening Shift',
    location: 'Sheikh Zayed & 6th of October',
    recruiter_commission: 3200,
    cooling_period_days: 30,
    flag: '🇫🇷',
    theme: 'cyan',
    description: 'High-earning French customer care. Full health insurance, social benefits, and dedicated bus meeting points.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000003',
    title: 'German Executive Technical Support',
    company_name: 'Concentrix',
    language: 'German',
    level: 'B2+ / C1',
    salary_range: '38,000 - 45,000 EGP Net',
    work_style: '100% Remote / WFH',
    shift: 'Rotational (5 Days)',
    location: 'Work From Home (Egypt-Wide)',
    recruiter_commission: 4500,
    cooling_period_days: 30,
    flag: '🇩🇪',
    theme: 'emerald',
    description: '100% Remote German Technical Support. Hardware provided, instant sign-on bonus, and fast-track interview pipeline.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000004',
    title: 'Italian Travel & Luxury Booking Advisor',
    company_name: 'Alorica',
    language: 'Italian',
    level: 'B2 / C1',
    salary_range: '28,000 - 34,000 EGP Net',
    work_style: 'On-site',
    shift: 'Rotational (24/7)',
    location: 'Maadi Technology Park',
    recruiter_commission: 3000,
    cooling_period_days: 30,
    flag: '🇮🇹',
    theme: 'purple',
    description: 'Global Italian luxury travel account in Maadi Tech Park. On-site interviews with instant job offer issuance.'
  },
  {
    id: 'f1a10001-0000-0000-0000-000000000005',
    title: 'Spanish E-Commerce Resolution Lead',
    company_name: 'Webhelp',
    language: 'Spanish',
    level: 'B2 / C1',
    salary_range: '26,000 - 30,000 EGP Net',
    work_style: 'On-site',
    shift: 'Rotational',
    location: 'New Cairo',
    recruiter_commission: 2800,
    cooling_period_days: 30,
    flag: '🇪🇸',
    theme: 'orange',
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
    flag: '🇬🇧',
    theme: 'gold',
    description: 'High-volume intake batch accepting intermediate B1 English. Undergraduates and high school graduates welcome!'
  }
];

const FAQS = [
  {
    category: 'candidates',
    q: 'Are there any placement fees or deductions for candidates applying through ACE Agency?',
    a: 'Absolutely zero. ACE Recruitment Agency is officially contracted and retained by multinational BPO conglomerates (Concentrix, Teleperformance, WGS, Vodafone). Our candidate recruitment, voice evaluation, and interview scheduling are 100% free of charge at all times.'
  },
  {
    category: 'candidates',
    q: 'Why is a 45–60 second Vocaroo voice audition required?',
    a: 'Top international contact centers prioritize pronunciation, spoken fluency, and grammar. Recording a quick voice audition allows hiring managers to bypass resume backlogs and fast-track your profile for direct on-site or online interviews within 24 to 48 hours.'
  },
  {
    category: 'candidates',
    q: 'Why is the 14-digit Egyptian National ID (الرقم القومي) requested on the application?',
    a: 'National ID verification is mandatory across all enterprise BPO clients to verify hiring eligibility, confirm no active blacklists from previous engagements, and formally reserve your seat in the upcoming batch.'
  },
  {
    category: 'recruiters',
    q: 'How does the 30-day affiliate cookie tracking operate?',
    a: 'When you share any job post or vacancy link with your affiliate code (?ref=YOUR_CODE), any candidate who visits and applies from that device within 30 days is automatically attributed to your account via encrypted cookies and database triggers.'
  },
  {
    category: 'recruiters',
    q: 'What is the 60-day anti-theft candidate lock?',
    a: 'To guarantee absolute fairness and protect recruiter attribution, our database enforces a strict 60-day lock on applicant phone numbers and National IDs. The first recruiter to submit an applicant maintains exclusive claim over their placement commissions.'
  },
  {
    category: 'recruiters',
    q: 'When are commission payouts released from the cooling timer?',
    a: 'Commissions enter a designated cooling period (typically 30 days upon candidate batch start) to verify attendance and onboarding completion. Once cleared, payouts are released immediately to your registered Bank Account or Instapay.'
  }
];

export default function HomePage() {
  const [offers, setOffers] = useState<any[]>(FALLBACK_BPO_OFFERS);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<'all' | 'candidates' | 'recruiters'>('all');

  // Interactive Live Radar & Audio Wave state
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);
  const [audioProgress, setAudioProgress] = useState(25);

  // Recruiter Earnings Calculator state
  const [placedCount, setPlacedCount] = useState<number>(6);
  const [averageCommission, setAverageCommission] = useState<number>(2600);

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
          // Merge with presentation flags
          const formatted = data.map((item, idx) => {
            const l = (item.language || '').toLowerCase();
            let flag = '🇬🇧';
            let theme = 'gold';
            if (l.includes('german')) { flag = '🇩🇪'; theme = 'emerald'; }
            else if (l.includes('french')) { flag = '🇫🇷'; theme = 'cyan'; }
            else if (l.includes('italian')) { flag = '🇮🇹'; theme = 'purple'; }
            else if (l.includes('spanish')) { flag = '🇪🇸'; theme = 'orange'; }

            return {
              ...item,
              flag,
              theme
            };
          });
          setOffers(formatted);
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

  const handleCopyPost = (offer: any) => {
    const applyUrl = `${window.location.origin}/apply/${offer.id}`;
    const text = `🔥 *NEW VACANCY ALERT — ACE RECRUITMENT AGENCY* 🔥\n\n` +
      `💼 *Position:* ${offer.title}\n` +
      `🏢 *Account:* ${offer.company_name}\n` +
      `🗣 *Language:* ${offer.language} (${offer.level || 'B2'})\n` +
      `📍 *Location:* ${offer.location} (${offer.work_style})\n` +
      `⏰ *Shift:* ${offer.shift || 'Rotational'}\n` +
      `💰 *Net Salary:* ${offer.salary_range}\n` +
      `🚌 *Transport:* Free Door-to-Door Cab / Meeting Points\n` +
      `✅ *Zero Placement Fees*\n\n` +
      `👇 *Apply now directly:* ${applyUrl}`;

    navigator.clipboard.writeText(text);
    showToast(`Vacancy template for ${offer.company_name} copied!`);
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

  // Earnings calculations
  const totalRecruiterEarnings = placedCount * averageCommission;
  const teamLeaderOverride = Math.round(totalRecruiterEarnings * 0.15);
  const totalCombined = totalRecruiterEarnings + teamLeaderOverride;
  const annualProjection = totalCombined * 12;

  return (
    <KineticGrid globalColor="default" className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 selection:bg-amber-400/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* Background radial spotlights & subtle noise */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/20 via-cyan-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-[65%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[140px]" />
      </div>

      <Navbar />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border border-amber-300">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Awwwards-Caliber Visual Headline & Live Radar Terminal   */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-10 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Top Pill with Border Beam */}
          <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold text-amber-300 mb-8 backdrop-blur-xl shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase text-[11px] sm:text-xs text-amber-200">
              OFFICIAL BPO RECRUITMENT MATRIX • EGYPT
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline font-normal">
              Zero Placement Fees • 48-Hour Shortlisting
            </span>
          </div>

          {/* Monumental Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05] sm:leading-[1.03] mb-6">
            Where Elite Talent Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-400">
              Global BPO Careers.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
            Direct hiring with Egypt’s largest multinational accounts: Concentrix, Teleperformance, WGS, and Vodafone UK. Free door-to-door transit, zero candidate fees, and salaries up to 45,000 EGP.
          </p>

          {/* High-Impact CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <a
              href="#apply-now"
              className="relative w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Apply in 60 Seconds</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#vacancies"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-sm tracking-wide border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Explore 6 Live Openings</span>
            </a>

            <Link
              href="/track"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white font-semibold text-xs border border-white/5 transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Candidate Tracker</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* THE HERO ANCHOR: Interactive Live BPO Dispatch Terminal                   */}
          {/* ========================================================================= */}
          <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0F1626]/90 to-[#070A12]/95 border border-amber-400/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden text-left backdrop-blur-2xl">
            {/* Terminal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-xs text-amber-300 font-bold tracking-wider uppercase">
                  ACE DISPATCH TERMINAL // CAIRO HUB
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  REAL-TIME CANDIDATE MATCHING
                </span>
              </div>
            </div>

            {/* Terminal Body: Candidate Audition & Instant Matching */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
              {/* Left Column: Spoken Voice Audition Player */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                      CANDIDATE AUDITION EVALUATION
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Sarah M. — Spoken English Audition
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                    CEFR C1 Verified
                  </span>
                </div>

                {/* Animated Frequency Bars */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      45-Second Vocaroo Stream
                    </span>
                    <span className="font-mono text-emerald-400 text-xs font-bold">
                      Match Score: 99.4%
                    </span>
                  </div>

                  {/* Equalizer Frequency Bars */}
                  <div className="h-10 flex items-center justify-between gap-1 px-1">
                    {[16, 28, 40, 24, 36, 48, 20, 32, 44, 28, 38, 52, 22, 34, 46, 30, 24, 40, 50, 28, 36, 20, 30, 44].map((height, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-full transition-all duration-300 ${
                          isPlayingAudition
                            ? 'bg-gradient-to-t from-amber-500 to-cyan-400 animate-pulse'
                            : 'bg-slate-700'
                        }`}
                        style={{
                          height: isPlayingAudition ? `${Math.max(8, (height * (i % 3 + 1)) % 45)}px` : `${height * 0.4}px`
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setIsPlayingAudition(!isPlayingAudition)}
                      className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      {isPlayingAudition ? (
                        <>
                          <Pause className="w-3 h-3 text-slate-950" /> Pause Sample
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-slate-950" /> Play Voice Sample
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Accent: Neutral US • Fluency: Native
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Match Target Vacancy */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-cyan-500/5 to-transparent border border-amber-400/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      TARGET MATCH
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Direct Shortlist
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Concentrix UK Executive
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    New Cairo Campus &bull; Rotational 5D
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Net Salary:</span>
                      <span className="font-bold text-amber-400 font-mono">24,000 EGP</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Mobility:</span>
                      <span className="text-slate-200">Door-to-Door Cab</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#apply-now"
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <span>Submit Your Own Audition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Social Proof Enterprise Brand Strip */}
          <div className="mt-14 w-full max-w-5xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-5 text-center">
              OFFICIALLY SOURCING TALENT FOR EGYPT'S LARGEST BPO OPERATORS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: 'Concentrix', account: 'Global Enterprise' },
                { name: 'Teleperformance', account: 'Tech & Luxury' },
                { name: 'Vodafone UK', account: 'Premier Telecom' },
                { name: 'WGS Global', account: 'US Airline Services' },
                { name: 'Webhelp', account: 'EU E-Commerce' },
                { name: 'Alorica', account: 'Maadi Tech Park' },
              ].map((partner, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-400/30 hover:bg-white/[0.05] transition-all text-center flex flex-col justify-center"
                >
                  <span className="font-black text-sm text-slate-200 tracking-wide">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {partner.account}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 21st.dev ARCHITECTURAL BENTO GRID: 4 Moats                             */}
      {/* ========================================================================= */}
      <section id="bento-features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            RECRUITMENT ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built for Velocity, Safety & Transparency.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl mx-auto">
            Combining direct ATS evaluation with an automated affiliate commission engine for candidates and talent partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Zero-Storage Spoken Voice Audition */}
          <div className="lg:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-amber-400/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 font-mono">
                  <Mic className="w-3.5 h-3.5" />
                  ZERO-STORAGE VOCAROO SCREENING
                </span>
                <span className="text-[10px] text-slate-400 font-mono">48H Shortlisting</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Your Spoken Voice Is Your True Resume
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Contact centers evaluate pronunciation, accent neutrality, and grammar before ever opening a CV. We embed free Vocaroo zero-storage voice recording so recruiters can review spoken samples and confirm interview dates within 24 to 48 hours.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Audition Checklist</span>
                  <span className="text-[11px] text-slate-400">45-60 seconds intro in English / Target Language</span>
                </div>
              </div>
              <a
                href="#apply-now"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
              >
                Start Your Audition
              </a>
            </div>
          </div>

          {/* Bento Card 2: 24h WhatsApp Reminder & Direct Briefing */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-emerald-400/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit font-mono mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                AUTOMATED BRIEFING & 24H REMINDER
              </span>
              <h3 className="text-xl font-black text-white mb-2">
                Mandatory Agency Referral Protection
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Candidates receive automated WhatsApp reminders 24 hours before their interview with clear briefing notes reminding them to state: <em>"Referred by ACE Recruitment Agency"</em> at corporate reception.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 text-xs text-emerald-300">
              <span className="font-mono text-[10px] uppercase text-emerald-400 block font-bold mb-1">
                ✓ 24-HOUR AUTO REMINDER ACTIVE
              </span>
              <span>Coordinates address, Google Maps pin, dress code & recruiter ID.</span>
            </div>
          </div>

          {/* Bento Card 3: Free Door-to-Door Transportation */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit font-mono mb-4">
                <Car className="w-3.5 h-3.5" />
                FREE TRANSIT GUARANTEE
              </span>
              <h3 className="text-xl font-black text-white mb-2">
                Door-to-Door Cabs & AC Buses
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All partnered accounts provide door-to-door cab services for night shifts and designated bus meeting points connecting Greater Cairo, Giza, and Qalyubia directly to corporate campuses.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-slate-300">
                <span className="text-cyan-300 block font-bold">New Cairo</span>
                <span>WGS & Concentrix</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-slate-300">
                <span className="text-cyan-300 block font-bold">Maadi Tech</span>
                <span>Alorica & Vodafone</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: 60-Day Anti-Theft Candidate Lock */}
          <div className="lg:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/90 border border-white/10 hover:border-amber-400/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  DATABASE-LEVEL ANTI-POACHING
                </span>
                <span className="text-[10px] text-slate-400 font-mono">60-Day Lock Timer</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                100% Commission Attribution Integrity
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                When a recruiter registers a candidate with their 14-digit National ID and phone number, the applicant is locked exclusively to that recruiter for 60 days. No duplicate submissions, no internal stealing, and no disputed payouts.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-amber-400 font-bold block mb-0.5">National ID Index</span>
                <span className="text-slate-400 text-[11px]">Unique constraint prevents duplicate entries across recruiters.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-cyan-400 font-bold block mb-0.5">30-Day Cookie Window</span>
                <span className="text-slate-400 text-[11px]">Direct affiliate cookies track candidate applications automatically.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-emerald-400 font-bold block mb-0.5">Cooling Timer Wallets</span>
                <span className="text-slate-400 text-[11px]">Instant release upon candidate 30-day attendance clearance.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LUXURY BOARDING-PASS VACANCY MARKETPLACE                                */}
      {/* ========================================================================= */}
      <section id="vacancies" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold mb-3 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              HOT FEBRUARY INTAKES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Verified Corporate Vacancies
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Salaries verified with corporate HR. Door-to-door transit, medical coverage, and immediate interview slots.
            </p>
          </div>

          {/* Language Filter Tabs with Live Counters */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 self-start md:self-auto overflow-x-auto backdrop-blur-xl">
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
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{lang}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedLanguage === lang ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/10 text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Boarding-Pass Vacancy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            return (
              <div
                key={offer.id}
                className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0F1626]/90 to-[#070A12]/95 border border-white/10 hover:border-amber-400/40 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Language Flag & Account Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{offer.flag || '🇬🇧'}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-white/[0.06] text-white border border-white/10">
                        {offer.language} ({offer.level})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {offer.work_style}
                    </span>
                  </div>

                  {/* Title & Account */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-200 font-semibold">{offer.company_name}</span> &bull; <span>{offer.location}</span>
                  </p>

                  {/* Compensation Highlight Card */}
                  <div className="mt-5 p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-mono text-slate-400 uppercase">Net Monthly Compensation</span>
                    </div>
                    <span className="text-xl font-black text-amber-400 font-mono tracking-tight block">
                      {offer.salary_range}
                    </span>
                    <span className="text-[11px] text-slate-300 block">
                      Shift: {offer.shift || 'Rotational (5 Days)'}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-300 mt-4 leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                {/* Bottom Actions: Apply & Share */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                  <a
                    href="#apply-now"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wide transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Apply for Vacancy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyPost(offer)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-amber-300 border border-white/10 transition-colors cursor-pointer"
                    title="Copy 1-Click WhatsApp Blast Message"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FINTECH RECRUITER EARNINGS SIMULATOR                                    */}
      {/* ========================================================================= */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0F1626]/95 via-[#0A0E1A]/95 to-[#05070D]/95 border border-amber-400/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold mb-2 font-mono">
                <DollarSign className="w-3.5 h-3.5" />
                AFFILIATE REVENUE CALCULATOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Recruiter Commission Projection Simulator
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
              Automated 30-Day Cooling Clearance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 items-center">
            {/* Left Controls: Sliders */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Monthly Candidates Placed
                  </label>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {placedCount} Candidates
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={placedCount}
                  onChange={(e) => setPlacedCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1 placement</span>
                  <span>15 placements</span>
                  <span>30 placements</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Average Commission Per Hire
                  </label>
                  <span className="text-lg font-black text-cyan-400 font-mono">
                    {averageCommission.toLocaleString('en-US')} EGP
                  </span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="4500"
                  step="250"
                  value={averageCommission}
                  onChange={(e) => setAverageCommission(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1,500 EGP (B1)</span>
                  <span>2,800 EGP (B2)</span>
                  <span>4,500 EGP (German C1)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Direct Recruiter Payout:</span>
                  <span className="font-mono font-bold text-white">{totalRecruiterEarnings.toLocaleString('en-US')} EGP</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Team Leader 15% Override:</span>
                  <span className="font-mono font-bold text-cyan-300">+{teamLeaderOverride.toLocaleString('en-US')} EGP</span>
                </div>
              </div>
            </div>

            {/* Right Display: Big Numbers */}
            <div className="md:col-span-6 p-6 sm:p-8 rounded-3xl bg-black/50 border border-amber-400/20 text-center flex flex-col justify-center items-center">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold mb-1">
                PROJECTED MONTHLY REVENUE
              </span>
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight my-2">
                {totalCombined.toLocaleString('en-US')} <span className="text-lg text-amber-400 font-sans">EGP</span>
              </span>
              <span className="text-xs text-slate-400">
                Annualized Run-Rate: <strong className="text-emerald-400 font-mono">{annualProjection.toLocaleString('en-US')} EGP / yr</strong>
              </span>

              <div className="mt-6 w-full pt-6 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Join as an Affiliate Recruiter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTEGRATED 3-STEP CANDIDATE APPLICATION GATEWAY                        */}
      {/* ========================================================================= */}
      <section id="apply-now" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold mb-3 font-mono">
            <Send className="w-3.5 h-3.5" />
            DIRECT FAST-TRACK GATEWAY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Apply with ACE Agency in 60 Seconds
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Fill out your details, provide your 14-digit Egyptian National ID, and paste your Vocaroo spoken audition link for direct interview routing.
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-3xl mx-auto p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading Application Gateway...</span>
          </div>
        }>
          <CandidateApplicationForm />
        </Suspense>
      </section>

      {/* ========================================================================= */}
      {/* 6. CATEGORIZED FAQ SECTION                                                */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-white/10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-bold mb-3 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Clear Answers for Candidates & Recruiters
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: 'all', label: 'All Questions' },
            { key: 'candidates', label: 'For Job Applicants' },
            { key: 'recruiters', label: 'For Recruiters & Team Leaders' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFaqCategory(cat.key as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                faqCategory === cat.key
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS.filter(f => faqCategory === 'all' || f.category === faqCategory).map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH-CRAFT FOOTER                                                      */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/10 bg-[#030508] py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 font-black">
              A
            </div>
            <span className="font-bold text-slate-300">ACE Recruitment Agency</span>
            <span>&bull;</span>
            <span>Cairo, Egypt</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#vacancies" className="hover:text-amber-400 transition-colors">Vacancies</a>
            <a href="#bento-features" className="hover:text-amber-400 transition-colors">Technology</a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">Affiliate Calculator</a>
            <Link href="/track" className="hover:text-amber-400 transition-colors">Candidate Tracker</Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors">Partner Sign In</Link>
          </div>

          <p>© {new Date().getFullYear()} ACE Agency. All rights reserved. Zero Candidate Fees.</p>
        </div>
      </footer>
    </KineticGrid>
  );
}
