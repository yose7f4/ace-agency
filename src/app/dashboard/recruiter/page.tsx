'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Offer, Candidate, Profile } from '@/lib/supabase/types';
import { 
  Briefcase, 
  Copy, 
  Check, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Users, 
  Search, 
  Filter, 
  Globe, 
  Moon, 
  GraduationCap, 
  Flame, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Calendar,
  Lock,
  Unlock,
  Coins
} from 'lucide-react';

export default function RecruiterDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'candidates'>('marketplace');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters for Offers Marketplace
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [filterNightShift, setFilterNightShift] = useState(false);
  const [filterUndergrads, setFilterUndergrads] = useState(false);
  const [filterNoExperience, setFilterNoExperience] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    loadRecruiterData();
  }, []);

  const loadRecruiterData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get recruiter profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userProfile) {
        setProfile(userProfile as Profile);

        // 2. Fetch Active Offers for the Marketplace
        const { data: activeOffers } = await supabase
          .from('offers')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (activeOffers) setOffers(activeOffers as Offer[]);

        // 3. STRICT ISOLATION: Fetch only candidates where candidates.recruiter_id == user.id
        const { data: myCandidates } = await supabase
          .from('candidates')
          .select('*')
          .eq('recruiter_id', userProfile.id)
          .order('created_at', { ascending: false });

        if (myCandidates) setCandidates(myCandidates as Candidate[]);
      }
    } catch (err) {
      console.error('Error fetching recruiter dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Copy Minimized Post + My Affiliate Link
  const handleCopyOfferPost = (offer: Offer) => {
    if (!profile) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const affiliateApplyLink = `${origin}/apply/${offer.id}?ref=${profile.referral_code}`;

    let postText = offer.minimized_description;
    if (postText && postText.includes('{{APPLY_LINK}}')) {
      postText = postText.replace(/{{APPLY_LINK}}/g, affiliateApplyLink);
    } else {
      // Default formatted post if template not set
      postText = `🔥 NEW VACANCY ALERT — ACE RECRUITMENT 🔥\n💼 Position: ${offer.title}\n🏢 Account: ${offer.company_name}\n🗣 Language: ${offer.language} (${offer.level})\n📍 Location: ${offer.location} (${offer.work_style})\n⏰ Shift: ${offer.shift}\n🚌 Transportation: ${offer.transport}\n💰 Net Salary: ${offer.salary_range}\n🎓 Education: ${offer.grad_status}\n\n✅ Fast-Track Interview & Zero Fees!\n👇 Apply now in under 2 minutes:\n${affiliateApplyLink}`;
    }

    navigator.clipboard.writeText(postText);
    setCopiedId(offer.id);
    showNotify('success', 'Minimized post with your affiliate link copied!');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCopyGeneralLink = () => {
    if (!profile) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const generalLink = `${origin}/apply?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(generalLink);
    setCopiedId('general');
    showNotify('success', 'General agency affiliate link copied!');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter Active Offers
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = selectedLanguage === 'all' || offer.language?.toLowerCase() === selectedLanguage.toLowerCase();
    const matchesNightShift = !filterNightShift || (offer.shift && offer.shift.toLowerCase().includes('night'));
    const matchesUndergrads = !filterUndergrads || (offer.grad_status && offer.grad_status.toLowerCase().includes('undergrad'));
    const matchesNoExp = !filterNoExperience || (offer.requirements && offer.requirements.toLowerCase().includes('no experience')) || (offer.min_age && offer.min_age <= 19);

    return matchesSearch && matchesLanguage && matchesNightShift && matchesUndergrads && matchesNoExp;
  });

  // Commission Calculations
  const unlockedCommissions = candidates
    .filter(c => c.status === 'Commission_Unlocked' || (c.commission_unlock_date && new Date(c.commission_unlock_date) <= new Date()))
    .reduce((acc, c) => acc + (c.commission_amount || 0), 0);

  const pendingCoolingCommissions = candidates
    .filter(c => c.status === 'Batch_Started' && c.commission_unlock_date && new Date(c.commission_unlock_date) > new Date())
    .reduce((acc, c) => acc + (c.commission_amount || 0), 0);

  const totalHired = candidates.filter(c => ['Hired', 'Batch_Started', 'Commission_Unlocked', 'Commission_Paid'].includes(c.status)).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Recruiter Header & Referral Identity */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Briefcase className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">Recruiter Affiliate Portal</h1>
            </div>
            <p className="text-sm text-slate-400">
              Browse hot vacancies, generate tracked affiliate posts, and monitor your cooling-period commission wallet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">My Affiliate Code</span>
                <span className="text-sm font-mono font-black text-amber-400">{profile?.referral_code || '...'}</span>
              </div>
              <button
                onClick={handleCopyGeneralLink}
                className="p-2 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                title="Copy General Affiliate Link"
              >
                {copiedId === 'general' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Global Notification */}
        {notification && (
          <div className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            notification.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Commission Wallet & Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Unlocked Wallet Balance */}
          <div className="glass-panel-gold rounded-2xl p-5 border relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                Unlocked Commissions
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ready for Payout
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">
                {unlockedCommissions.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-400">EGP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Cleared cooling period with 0 chargebacks
            </p>
          </div>

          {/* Pending In-Cooling Balance */}
          <div className="glass-panel-blue rounded-2xl p-5 border relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                In Cooling Period
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Timer Running
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">
                {pendingCoolingCommissions.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-blue-400">EGP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Candidates in active onboarding batch
            </p>
          </div>

          {/* Hired Candidates */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Total Hired / Batched</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400">{totalHired}</span>
              <span className="text-xs text-slate-400 font-medium">Candidates</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Successful corporate placements
            </p>
          </div>

          {/* Total Applications Driven */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-2">My Total Leads Driven</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{candidates.length}</span>
              <span className="text-xs text-amber-400 font-medium">Via ?ref</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              30-day cookie affiliate attribution
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'marketplace' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Active Offers Marketplace ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'candidates' 
                ? 'border-blue-400 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            My Candidates & Cooling Tracker ({candidates.length})
          </button>
        </div>

        {/* TAB 1: OFFERS MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Filter Bar with Quick Tags */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by position, company, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  {/* Language Selector */}
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Italian">Italian</option>
                    <option value="Spanish">Spanish</option>
                  </select>

                  {/* Night Shift Toggle */}
                  <button
                    onClick={() => setFilterNightShift(!filterNightShift)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      filterNightShift 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    Night Shift
                  </button>

                  {/* Undergrads Filter */}
                  <button
                    onClick={() => setFilterUndergrads(!filterUndergrads)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      filterUndergrads 
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Undergrads Allowed
                  </button>

                  {/* No Experience Filter */}
                  <button
                    onClick={() => setFilterNoExperience(!filterNoExperience)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      filterNoExperience 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    No Experience
                  </button>
                </div>
              </div>
            </div>

            {/* Offer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-500 italic">
                  No active vacancies match your current filter criteria.
                </div>
              ) : (
                filteredOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                          <Globe className="w-3 h-3" />
                          {offer.language} ({offer.level})
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          +{offer.recruiter_commission || offer.commission_amount} EGP
                        </span>
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {offer.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mb-4">
                        {offer.company_name} • <span className="text-slate-300">{offer.location}</span>
                      </p>

                      {/* Key Attributes */}
                      <div className="space-y-1.5 py-3 border-y border-slate-800/80 text-xs text-slate-300 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Net Salary:</span>
                          <span className="font-bold text-white">{offer.salary_range || 'Competitive'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Work Style:</span>
                          <span className="text-emerald-400 font-semibold">{offer.work_style}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Shift Type:</span>
                          <span>{offer.shift}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Transport:</span>
                          <span className="text-slate-300 truncate max-w-[170px]">{offer.transport}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Cooling Period:</span>
                          <span className="text-amber-400 font-semibold">{offer.cooling_period_days} Days</span>
                        </div>
                      </div>
                    </div>

                    {/* Action: 1-Click Copy Minimized Post + My Affiliate Link */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleCopyOfferPost(offer)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/15 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        title="Copy ready-to-post marketing copy with your personal referral link appended"
                      >
                        {copiedId === offer.id ? (
                          <>
                            <Check className="w-4 h-4 text-slate-950" />
                            Post & Link Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-950" />
                            Copy Minimized Post + My Affiliate Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY CANDIDATES TRACKER & COOLING TIMER */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Candidates Attributed to You</h3>
                  <p className="text-xs text-slate-400">Strictly isolated to leads submitted with your ?ref=[code] link</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {candidates.length} Leads
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate Name</th>
                      <th className="py-3 px-4">Position Applied</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4">Cooling-Period Countdown</th>
                      <th className="py-3 px-4">Expected Commission</th>
                      <th className="py-3 px-4">Submission Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {candidates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-500 italic">
                          You haven't referred any candidates yet. Copy an offer post above and share your link to start earning!
                        </td>
                      </tr>
                    ) : (
                      candidates.map((candidate) => {
                        const offer = offers.find(o => o.id === candidate.offer_id);

                        // Cooling period countdown calculation
                        let daysRemaining = 0;
                        let isUnlocked = false;
                        if (candidate.commission_unlock_date) {
                          const unlockDate = new Date(candidate.commission_unlock_date);
                          const today = new Date();
                          const diffTime = unlockDate.getTime() - today.getTime();
                          daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                          isUnlocked = daysRemaining === 0 || candidate.status === 'Commission_Unlocked';
                        }

                        return (
                          <tr key={candidate.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-bold text-white text-sm block">{candidate.full_name}</span>
                              <span className="text-[11px] text-slate-400">{candidate.phone}</span>
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-semibold text-slate-200 block text-xs">
                                {offer?.title || 'General Vacancy'}
                              </span>
                              <span className="text-[11px] text-slate-400">{offer?.company_name || 'ACE Corporate'}</span>
                            </td>

                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                candidate.status === 'Applied' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                                candidate.status === 'Interview_Scheduled' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                                candidate.status === 'Hired' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                                candidate.status === 'Batch_Started' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                                candidate.status === 'Commission_Unlocked' ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/50' :
                                candidate.status === 'Rejected' ? 'bg-red-500/15 text-red-300 border-red-500/30' :
                                'bg-slate-800 text-slate-300 border-slate-700'
                              }`}>
                                {candidate.status.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              {candidate.status === 'Batch_Started' && candidate.commission_unlock_date ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                                    <Clock className="w-3.5 h-3.5 animate-spin" />
                                    <span>{daysRemaining} Days Remaining</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 block">
                                    Unlocks on: {candidate.commission_unlock_date}
                                  </span>
                                </div>
                              ) : isUnlocked ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                                  <Unlock className="w-3.5 h-3.5" />
                                  Unlocked & Ready
                                </span>
                              ) : (
                                <span className="text-slate-500 italic text-[11px]">
                                  Pending Batch Start
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 font-mono font-bold text-sm text-amber-400">
                              {candidate.commission_amount || offer?.recruiter_commission || 1500} EGP
                            </td>

                            <td className="py-4 px-4 text-slate-400 text-xs">
                              {new Date(candidate.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
