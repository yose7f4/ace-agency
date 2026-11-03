'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import { CandidateApplicationForm } from '@/components/candidates/CandidateApplicationForm';
import KineticGrid from '@/components/ui/kinetic-grid';
import { GradientText } from '@/components/ui/gradient-text';
import { SHEET_OFFERS, SheetOffer } from '@/data/sheetOffers';
import { 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck, 
  Users, 
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
  FileCheck2,
  PhoneCall,
  UserCheck,
  GraduationCap,
  Filter,
  RotateCcw,
  Bus,
  X
} from 'lucide-react';

const LANGUAGE_LIST = [
  { id: 'All', label: 'All Languages', flag: '🌐' },
  { id: 'English', label: 'English', flag: '🇬🇧' },
  { id: 'French', label: 'French', flag: '🇫🇷' },
  { id: 'German', label: 'German', flag: '🇩🇪' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'Portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'Dutch', label: 'Dutch', flag: '🇳🇱' },
  { id: 'Italian', label: 'Italian', flag: '🇮🇹' },
  { id: 'Arabic', label: 'Arabic', flag: '🇪🇬' },
];

const GRADUATION_OPTIONS = [
  { id: 'All', label: 'All Education Levels' },
  { id: 'undergrads', label: '🎒 Undergrads Welcome' },
  { id: 'graduates_only', label: '📜 Graduates Only' },
  { id: 'dropouts_gap', label: '⚡ Dropouts & Gap Years' },
];

const LOCATION_OPTIONS = [
  { id: 'All', label: 'All Cairo & Giza Hubs' },
  { id: 'new_cairo', label: '📍 New Cairo & Tagamoa' },
  { id: 'maadi', label: '📍 Maadi & Kattameya' },
  { id: 'zayed_october', label: '📍 Smart Village, Zayed & 6th Oct' },
  { id: 'nasr_heliopolis', label: '📍 Nasr City, Heliopolis & Sheraton' },
  { id: 'remote', label: '📍 Remote / Alex / Other' },
];

const EXPERIENCE_OPTIONS = [
  { id: 'All', label: 'All Experience Levels' },
  { id: 'fresh', label: '✨ No Experience Needed (Fresh)' },
  { id: 'experienced', label: '💼 Experienced (1+ Years)' },
];

const STATUS_OPTIONS = [
  { id: 'All', label: 'All Vacancy Statuses' },
  { id: 'active', label: '🟢 Active Intakes Only' },
  { id: 'hold', label: '🟠 On Hold' }
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
  const [offers, setOffers] = useState<SheetOffer[]>(SHEET_OFFERS);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGraduation, setSelectedGraduation] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfferToApply, setSelectedOfferToApply] = useState<string | undefined>(undefined);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<'all' | 'candidates' | 'recruiters'>('all');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadLiveOffers() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .in('status', ['active', 'hold'])
          .order('company_name');

        if (data && data.length > 0) {
          // Merge Supabase live status with the full 66 sheet offers
          const merged = SHEET_OFFERS.map(sheetItem => {
            const dbMatch = data.find(d => d.id === sheetItem.id);
            if (dbMatch) {
              return {
                ...sheetItem,
                status: (dbMatch.status === 'hold' ? 'On Hold' : 'Active') as 'Active' | 'On Hold',
                title: dbMatch.title || sheetItem.title,
                salary_range: dbMatch.salary_range || sheetItem.salary_range
              };
            }
            return sheetItem;
          });
          setOffers(merged);
        }
      } catch (err) {
        console.error('Failed to fetch live offers from DB, keeping official sheet catalog', err);
      }
    }

    loadLiveOffers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyPost = (offer: SheetOffer) => {
    const applyUrl = `${window.location.origin}/apply/${offer.id}`;
    const text = `🔥 *VERIFIED VACANCY ALERT — ACE RECRUITMENT AGENCY* 🔥\n\n` +
      `💼 *Position:* ${offer.title}\n` +
      `🏢 *Account / Employer:* ${offer.company_full}\n` +
      `🗣 *Language:* ${offer.primary_language} (${offer.level})\n` +
      `🎓 *Education:* ${offer.grad_status_raw || offer.grad_label}\n` +
      `📍 *Location:* ${offer.location} (${offer.work_style})\n` +
      `💼 *Experience:* ${offer.experience_raw || (offer.experience_category === 'fresh' ? 'No experience needed' : 'Experience required')}\n` +
      `⏰ *Shift:* ${offer.shift || 'Rotational (5 Days)'}\n` +
      `💰 *Compensation:* ${offer.salary_range}\n` +
      (offer.bonus_details ? `🎁 *Bonuses / Commissions:* ${offer.bonus_details}\n` : '') +
      (offer.transport && offer.transport !== 'Not stated' ? `🚌 *Transit:* ${offer.transport}\n` : '') +
      `✅ *Zero Placement Fees — 100% Free Candidate Service*\n\n` +
      `👇 *Fast-Track Direct Apply:* ${applyUrl}`;

    navigator.clipboard.writeText(text);
    showToast(`Vacancy template for ${offer.company_name} copied!`);
  };

  const handleApplyClick = (offerId: string) => {
    setSelectedOfferToApply(offerId);
    const applySection = document.getElementById('apply-now');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('Opportunity selected! Complete your 60-second application below.');
  };

  // Filter offers by language, graduation status, location, experience, and search query
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      // 1. Language Filter
      const matchesLang =
        selectedLanguage === 'All' ||
        (o.languages && o.languages.includes(selectedLanguage)) ||
        (o.primary_language && o.primary_language.toLowerCase() === selectedLanguage.toLowerCase());

      // 2. Graduation Filter
      let matchesGrad = true;
      if (selectedGraduation === 'undergrads') {
        matchesGrad = o.allows_undergrads === true;
      } else if (selectedGraduation === 'graduates_only') {
        matchesGrad = o.graduates_only === true;
      } else if (selectedGraduation === 'dropouts_gap') {
        matchesGrad = o.allows_dropouts === true;
      }

      // 3. Location Filter
      let matchesLoc = true;
      if (selectedLocation !== 'All') {
        matchesLoc = o.location_category === selectedLocation;
      }

      // 4. Experience Filter
      let matchesExp = true;
      if (selectedExperience === 'fresh') {
        matchesExp = o.experience_category === 'fresh';
      } else if (selectedExperience === 'experienced') {
        matchesExp = o.experience_category === 'experienced';
      }

      // 5. Status Filter
      let matchesStatus = true;
      if (selectedStatus === 'active') {
        matchesStatus = o.status === 'Active';
      } else if (selectedStatus === 'hold') {
        matchesStatus = o.status === 'On Hold';
      }

      // 6. Search Query Filter
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.company_name.toLowerCase().includes(q) ||
        o.company_full.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.salary_range.toLowerCase().includes(q) ||
        o.shift.toLowerCase().includes(q) ||
        o.notes.toLowerCase().includes(q) ||
        o.grad_status_raw.toLowerCase().includes(q) ||
        o.languages.some(l => l.toLowerCase().includes(q));

      return matchesLang && matchesGrad && matchesLoc && matchesExp && matchesStatus && matchesSearch;
    });
  }, [offers, selectedLanguage, selectedGraduation, selectedLocation, selectedExperience, selectedStatus, searchQuery]);

  const isAnyFilterActive =
    selectedLanguage !== 'All' ||
    selectedGraduation !== 'All' ||
    selectedLocation !== 'All' ||
    selectedExperience !== 'All' ||
    selectedStatus !== 'All' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedLanguage('All');
    setSelectedGraduation('All');
    setSelectedLocation('All');
    setSelectedExperience('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  return (
    <KineticGrid globalColor="default" className="min-h-screen flex flex-col bg-black text-slate-100 selection:bg-amber-400/30 selection:text-amber-200 relative overflow-x-hidden">
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
            <GradientText className="bg-transparent">
              Global BPO Careers.
            </GradientText>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
            Direct hiring with Egypt’s largest multinational accounts: Concentrix, Teleperformance, WGS, Enable, and Vodafone UK. Free door-to-door transit, zero candidate fees, and salaries up to 62,000 EGP.
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

          {/* Social Proof Enterprise Brand Strip */}
          <div className="mt-8 sm:mt-12 w-full max-w-5xl">
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

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LUXURY BOARDING-PASS VACANCY MARKETPLACE                                */}
      {/* ========================================================================= */}
      <section id="vacancies" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold mb-3 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              OFFICIAL CORPORATE VACANCY DIRECTORY • 66 VACANCIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Verified Corporate Vacancies
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Real enterprise intakes across Cairo & Giza: Concentrix, Teleperformance, TTEC, Enable, Xceed, and more. Filter by graduation status, language, and hub.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
              Showing <span className="text-amber-400 font-bold">{filteredOffers.length}</span> of {offers.length} Vacancies
            </span>
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================= COMPREHENSIVE FILTER BAR ======================= */}
        <div className="mb-10 p-5 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl space-y-4 shadow-2xl">
          {/* Row 1: Search Bar & Live Counter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by position, company (Concentrix, TP...), location, or keyword..."
                className="w-full bg-[#080C14] border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Language Selector Scroll Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {LANGUAGE_LIST.map((lang) => {
              const count = lang.id === 'All'
                ? offers.length
                : offers.filter(o => (o.languages && o.languages.includes(lang.id)) || (o.primary_language && o.primary_language.toLowerCase() === lang.id.toLowerCase())).length;

              const isSelected = selectedLanguage === lang.id;

              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/25 font-black'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/5 hover:border-white/15 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/10 text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 3: Multi-Faceted Selectors (Graduation Status, Location, Experience, Intake Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            {/* Graduation Status Filter */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Education / Graduation</span>
              </label>
              <select
                value={selectedGraduation}
                onChange={(e) => setSelectedGraduation(e.target.value)}
                className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/60 cursor-pointer"
              >
                {GRADUATION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Hub Filter */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Location / Hub</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400/60 cursor-pointer"
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Experience Level</span>
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400/60 cursor-pointer"
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Intake Status</span>
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400/60 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Active Filter Chips */}
          {isAnyFilterActive && (
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Active Filters:</span>

              {selectedLanguage !== 'All' && (
                <button
                  onClick={() => setSelectedLanguage('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[11px] font-medium hover:bg-amber-400/25 transition-colors cursor-pointer"
                >
                  <span>Lang: {selectedLanguage}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedGraduation !== 'All' && (
                <button
                  onClick={() => setSelectedGraduation('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-[11px] font-medium hover:bg-emerald-400/25 transition-colors cursor-pointer"
                >
                  <span>Education: {GRADUATION_OPTIONS.find(o => o.id === selectedGraduation)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedLocation !== 'All' && (
                <button
                  onClick={() => setSelectedLocation('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 text-[11px] font-medium hover:bg-cyan-400/25 transition-colors cursor-pointer"
                >
                  <span>Location: {LOCATION_OPTIONS.find(o => o.id === selectedLocation)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedExperience !== 'All' && (
                <button
                  onClick={() => setSelectedExperience('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-400/15 text-purple-300 border border-purple-400/30 text-[11px] font-medium hover:bg-purple-400/25 transition-colors cursor-pointer"
                >
                  <span>Exp: {EXPERIENCE_OPTIONS.find(o => o.id === selectedExperience)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedStatus !== 'All' && (
                <button
                  onClick={() => setSelectedStatus('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-400/15 text-slate-300 border border-slate-400/30 text-[11px] font-medium hover:bg-slate-400/25 transition-colors cursor-pointer"
                >
                  <span>Status: {STATUS_OPTIONS.find(o => o.id === selectedStatus)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {searchQuery.trim() !== '' && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-400/15 text-slate-300 border border-slate-400/30 text-[11px] font-medium hover:bg-slate-400/25 transition-colors cursor-pointer"
                >
                  <span>Keyword: "{searchQuery}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={handleResetFilters}
                className="text-amber-400 hover:text-amber-300 text-[11px] font-bold underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Empty State when no results match */}
        {filteredOffers.length === 0 ? (
          <div className="py-20 px-6 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center max-w-xl mx-auto backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Vacancies Match Your Filters</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mb-6">
              We couldn't find any positions matching your selected combination of filters. Try adjusting your education status, language, or location filter to see more results.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters & Show 66 Vacancies</span>
            </button>
          </div>
        ) : (
          /* Boarding-Pass Vacancy Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              return (
                <div
                  key={offer.id}
                  className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0F1626]/90 via-[#0C111E]/95 to-[#070A12]/98 border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Bar: Language Flag & Education Pill & Status */}
                    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xl">{offer.flag || '🇬🇧'}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-white/[0.06] text-white border border-white/10">
                          {offer.primary_language} ({offer.level})
                        </span>
                        {offer.allows_undergrads ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            🎓 Undergrads Welcome
                          </span>
                        ) : offer.graduates_only ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            🎓 Graduates Only
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                            🎓 {offer.grad_label}
                          </span>
                        )}
                      </div>

                      {offer.status === 'On Hold' ? (
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/25">
                          On Hold
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/25">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Title & Employer Account */}
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 flex-wrap">
                      <Building2 className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                      <span className="text-slate-200 font-semibold">{offer.company_full}</span>
                      <span className="text-slate-600">&bull;</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-300 line-clamp-1">{offer.location}</span>
                    </p>

                    {/* Compensation Highlight Card */}
                    <div className="mt-5 p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Net / Gross Compensation
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {offer.work_style}
                        </span>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-amber-400 font-mono tracking-tight block">
                        {offer.salary_range}
                      </span>
                      {offer.bonus_details && (
                        <div className="text-[11px] text-amber-200/90 flex items-start gap-1.5 font-medium pt-1 border-t border-white/5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{offer.bonus_details}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{offer.experience_raw || (offer.experience_category === 'fresh' ? 'No experience needed' : 'Experience required')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Shift: {offer.shift || 'Rotational (5 Days)'}</span>
                        </div>
                        {offer.transport && offer.transport !== 'Not stated' && (
                          <div className="flex items-center gap-1.5 text-cyan-300">
                            <Bus className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{offer.transport}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interview details snippet */}
                    {offer.interview_process && offer.interview_process !== 'Not stated' && (
                      <div className="mt-3 text-[11px] text-slate-400 flex items-start gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{offer.interview_process}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions: Apply & Share */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => handleApplyClick(offer.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wide transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Apply for Vacancy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

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
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. INTEGRATED 3-STEP CANDIDATE APPLICATION GATEWAY                        */}
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
          <CandidateApplicationForm initialOfferId={selectedOfferToApply} />
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
            <Link href="/track" className="hover:text-amber-400 transition-colors">Candidate Tracker</Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors">Partner Sign In</Link>
          </div>

          <p>© {new Date().getFullYear()} ACE Agency. All rights reserved. Zero Candidate Fees.</p>
        </div>
      </footer>
    </KineticGrid>
  );
}
