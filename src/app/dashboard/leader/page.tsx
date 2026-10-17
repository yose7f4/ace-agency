'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Candidate, Profile, Offer, CandidateStatus } from '@/lib/supabase/types';
import { VocarooPlayer } from '@/components/voice/VocarooPlayer';
import { WhatsAppButtons } from '@/components/candidates/WhatsAppButtons';
import { 
  Users, 
  Copy, 
  Check, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Award
} from 'lucide-react';

export default function TeamLeaderDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamRecruiters, setTeamRecruiters] = useState<Profile[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecruiterFilter, setSelectedRecruiterFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Scheduling modal state
  const [schedulingCandidate, setSchedulingCandidate] = useState<Candidate | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  
  // Batch start modal state
  const [batchCandidate, setBatchCandidate] = useState<Candidate | null>(null);
  const [batchDate, setBatchDate] = useState(new Date().toISOString().split('T')[0]);

  const supabase = createBrowserClient();

  useEffect(() => {
    loadLeaderData();
  }, []);

  const loadLeaderData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get leader profile
      const { data: leaderProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (leaderProfile) {
        setProfile(leaderProfile as Profile);

        // 2. STRICT ISOLATION: Fetch only Recruiters belonging to this Team Leader
        const { data: recruiters } = await supabase
          .from('profiles')
          .select('*')
          .eq('team_leader_id', leaderProfile.id);

        if (recruiters) setTeamRecruiters(recruiters as Profile[]);

        // 3. STRICT ISOLATION: Fetch only Candidates where candidates.team_leader_id == leader.id
        const { data: teamCandidates } = await supabase
          .from('candidates')
          .select('*')
          .eq('team_leader_id', leaderProfile.id)
          .order('created_at', { ascending: false });

        if (teamCandidates) setCandidates(teamCandidates as Candidate[]);

        // 4. Fetch offers for title resolution
        const { data: allOffers } = await supabase
          .from('offers')
          .select('*');

        if (allOffers) setOffers(allOffers as Offer[]);
      }
    } catch (err) {
      console.error('Error loading leader dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopiedLink(true);
    showNotify('success', `Team Leader Code (${profile.referral_code}) copied! Provide to Admin to assign recruiters to your team.`);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleUpdateStatus = async (candidateId: string, newStatus: CandidateStatus) => {
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      
      if (newStatus === 'Interview_Scheduled' && !candidate?.interview_date) {
        // Open interview scheduler modal
        if (candidate) {
          setSchedulingCandidate(candidate);
          return;
        }
      }

      if (newStatus === 'Batch_Started' && !candidate?.batch_start_date) {
        // Open batch date modal
        if (candidate) {
          setBatchCandidate(candidate);
          return;
        }
      }

      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .eq('id', candidateId);

      if (error) throw error;

      setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c));
      showNotify('success', `Candidate status updated to ${newStatus}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update candidate status';
      showNotify('error', msg);
    }
  };

  const handleSaveInterviewSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingCandidate || !scheduledDateTime) return;

    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          status: 'Interview_Scheduled',
          interview_date: new Date(scheduledDateTime).toISOString(),
        })
        .eq('id', schedulingCandidate.id);

      if (error) throw error;

      setCandidates(prev => prev.map(c => c.id === schedulingCandidate.id ? {
        ...c,
        status: 'Interview_Scheduled',
        interview_date: new Date(scheduledDateTime).toISOString()
      } : c));

      showNotify('success', 'Interview scheduled and candidate status updated!');
      setSchedulingCandidate(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error scheduling interview';
      showNotify('error', msg);
    }
  };

  const handleSaveBatchStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCandidate || !batchDate) return;

    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          status: 'Batch_Started',
          batch_start_date: batchDate,
        })
        .eq('id', batchCandidate.id);

      if (error) throw error;

      // Reload to pull auto-calculated commission_unlock_date from trigger
      loadLeaderData();
      showNotify('success', 'Batch start date logged! Cooling period timer active.');
      setBatchCandidate(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error starting batch';
      showNotify('error', msg);
    }
  };

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // KPIs
  const totalLeads = candidates.length;
  const totalInterviews = candidates.filter(c => ['Interview_Scheduled', 'Interviewed', 'Shortlisted'].includes(c.status)).length;
  const activeBatches = candidates.filter(c => c.status === 'Batch_Started').length;
  const teamCommissions = candidates.reduce((acc, c) => acc + (c.commission_amount || 0), 0);

  // Filters
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRecruiter = selectedRecruiterFilter === 'all' || c.recruiter_id === selectedRecruiterFilter;
    const matchesStatus = selectedStatusFilter === 'all' || c.status === selectedStatusFilter;

    return matchesSearch && matchesRecruiter && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Team Invite Link */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">Team Leader Command Hub</h1>
            </div>
            <p className="text-sm text-slate-400">
              Manage your team of recruiters, interview pipeline, Vocaroo voice notes, and WhatsApp outreach
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyInviteLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'TL Code Copied!' : 'Copy Team Leader Code'}
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
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

        {/* Team KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Team Leads</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{totalLeads}</span>
              <span className="text-xs text-blue-400 font-medium">
                {teamRecruiters.length} Active Recruiters
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Interviews Pipeline</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400">{totalInterviews}</span>
              <span className="text-xs text-slate-400 font-medium">Scheduled/Done</span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Active Batch (In Cooling)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400">{activeBatches}</span>
              <span className="text-xs text-emerald-400 font-medium">Onboarding</span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Team Generated Commissions</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {teamCommissions.toLocaleString()} EGP
              </span>
              <span className="text-xs text-slate-400 font-medium">Pipeline Value</span>
            </div>
          </div>
        </div>

        {/* Recruiters in my Team Roster */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" />
              Recruiters on My Team ({teamRecruiters.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Affiliate codes capture leads directly to you
            </span>
          </div>

          {teamRecruiters.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">
              No recruiters have joined your team yet. Click "Copy Team Invite Link" above and send it to your recruiters!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {teamRecruiters.map(rec => {
                const count = candidates.filter(c => c.recruiter_id === rec.id).length;
                return (
                  <div key={rec.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs block">{rec.full_name || rec.email}</span>
                      <span className="text-[10px] text-amber-400 font-mono">Ref: {rec.referral_code}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {count} Leads
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Candidate Pipeline & Action Center */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search candidate name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Recruiter filter */}
              <select
                value={selectedRecruiterFilter}
                onChange={(e) => setSelectedRecruiterFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Recruiters</option>
                {teamRecruiters.map(r => (
                  <option key={r.id} value={r.id}>{r.full_name || r.email}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview_Scheduled">Interview Scheduled</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Offered">Offered</option>
                <option value="Hired">Hired</option>
                <option value="Batch_Started">Batch Started</option>
                <option value="Commission_Unlocked">Commission Unlocked</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </span>
          </div>

          {/* Team Candidates Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate / Contact</th>
                    <th className="py-3 px-4">Applied Offer & Recruiter</th>
                    <th className="py-3 px-4">Voice Note (Vocaroo)</th>
                    <th className="py-3 px-4">1-Click WhatsApp</th>
                    <th className="py-3 px-4">Status Updater</th>
                    <th className="py-3 px-4">Batch / Unlock Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 italic">
                        No candidates found for this filter. Candidates submitted using your team's referral links will appear here instantly.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((candidate) => {
                      const offer = offers.find(o => o.id === candidate.offer_id);
                      const recruiter = teamRecruiters.find(r => r.id === candidate.recruiter_id);

                      return (
                        <tr key={candidate.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-bold text-white text-sm block">{candidate.full_name}</span>
                              <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                                <span>{candidate.phone}</span>
                                {candidate.age && <span>• {candidate.age} yrs</span>}
                                {candidate.english_level && (
                                  <span className="text-amber-400 font-semibold">• {candidate.english_level}</span>
                                )}
                              </div>
                              {candidate.residence && (
                                <span className="text-[10px] text-slate-500 block">{candidate.residence} ({candidate.grad_status || 'Any'})</span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-200 block text-xs">
                              {offer?.title || 'General Application'}
                            </span>
                            <span className="text-[11px] text-blue-400 block">
                              Recruiter: {recruiter?.full_name || candidate.referral_code || 'Direct Link'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Applied: {new Date(candidate.created_at).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <VocarooPlayer
                              url={candidate.voice_note_url}
                              candidateName={candidate.full_name}
                            />
                          </td>

                          <td className="py-4 px-4">
                            <WhatsAppButtons
                              candidateName={candidate.full_name}
                              phone={candidate.phone}
                              whatsapp={candidate.whatsapp}
                              offerTitle={offer?.title}
                              interviewDate={candidate.interview_date}
                            />
                          </td>

                          <td className="py-4 px-4">
                            <select
                              value={candidate.status}
                              onChange={(e) => handleUpdateStatus(candidate.id, e.target.value as CandidateStatus)}
                              className={`text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none border cursor-pointer ${
                                candidate.status === 'Applied' ? 'bg-slate-900 border-slate-700 text-slate-300' :
                                candidate.status === 'Interview_Scheduled' ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' :
                                candidate.status === 'Shortlisted' ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' :
                                candidate.status === 'Hired' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' :
                                candidate.status === 'Batch_Started' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' :
                                candidate.status === 'Commission_Unlocked' ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-200' :
                                candidate.status === 'Rejected' ? 'bg-red-500/15 border-red-500/40 text-red-300' :
                                'bg-slate-900 border-slate-700 text-slate-200'
                              }`}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Screening">Screening</option>
                              <option value="Interview_Scheduled">Schedule Interview</option>
                              <option value="Interviewed">Interviewed</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Offered">Offered</option>
                              <option value="Hired">Hired</option>
                              <option value="Batch_Started">Batch Started</option>
                              <option value="Commission_Unlocked">Commission Unlocked</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Withdrawn">Withdrawn</option>
                            </select>
                          </td>

                          <td className="py-4 px-4">
                            {candidate.commission_unlock_date ? (
                              <div>
                                <span className="font-mono text-emerald-400 font-bold block text-xs">
                                  {candidate.commission_unlock_date}
                                </span>
                                <span className="text-[10px] text-amber-300">
                                  {candidate.commission_amount} EGP Commission
                                </span>
                              </div>
                            ) : candidate.interview_date ? (
                              <span className="text-blue-300 text-[11px] block">
                                Int: {new Date(candidate.interview_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">Not Batched</span>
                            )}
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

        {/* SCHEDULE INTERVIEW MODAL */}
        {schedulingCandidate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Schedule Interview Slot
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Scheduling for <strong className="text-white">{schedulingCandidate.full_name}</strong>
              </p>

              <form onSubmit={handleSaveInterviewSchedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSchedulingCandidate(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  >
                    Confirm & Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BATCH START DATE MODAL */}
        {batchCandidate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Start Onboarding Batch
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Setting batch start date for <strong className="text-white">{batchCandidate.full_name}</strong> will initiate the cooling period countdown timer.
              </p>

              <form onSubmit={handleSaveBatchStart} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Batch Start Date</label>
                  <input
                    type="date"
                    required
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBatchCandidate(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  >
                    Activate Batch & Start Timer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
