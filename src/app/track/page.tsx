'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { VocarooPlayer } from '@/components/voice/VocarooPlayer';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Mic, 
  Building2, 
  MapPin, 
  DollarSign, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';

interface CandidateTrackingData {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  interviewDate: string | null;
  batchStartDate: string | null;
  voiceNoteUrl: string | null;
  englishLevel: string | null;
  gradStatus: string | null;
  createdAt: string;
  offer: {
    title: string;
    company_name: string;
    language: string;
    level: string;
    salary_range: string;
    work_style: string;
    location: string;
    shift: string;
    transport: string;
  } | null;
  coordinator: {
    name: string;
    whatsapp: string;
  };
}

const STAGES = [
  { key: 'Applied', label: 'Applied', desc: 'Application received & registered' },
  { key: 'Screening', label: 'Screening', desc: 'Voice audition & language evaluation' },
  { key: 'Interview_Scheduled', label: 'Interview Scheduled', desc: 'Interview date & coordinator assigned' },
  { key: 'Shortlisted', label: 'Client Evaluation', desc: 'Shared with corporate account lead' },
  { key: 'Offered', label: 'Offered & Hired', desc: 'Official placement confirmed' }
];

function getStageIndex(status: string) {
  switch (status) {
    case 'Applied': return 0;
    case 'Screening': return 1;
    case 'Interview_Scheduled':
    case 'Interviewed': return 2;
    case 'Shortlisted': return 3;
    case 'Offered':
    case 'Hired':
    case 'Batch_Started':
    case 'Commission_Unlocked':
    case 'Commission_Paid': return 4;
    case 'Rejected':
    case 'Withdrawn': return -1;
    default: return 0;
  }
}

function CandidateTrackerContent() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [referenceCode, setReferenceCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<CandidateTrackingData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Voice note update state
  const [isUpdatingVoice, setIsUpdatingVoice] = useState(false);
  const [newVoiceUrl, setNewVoiceUrl] = useState('');
  const [voiceUpdateLoading, setVoiceUpdateLoading] = useState(false);
  const [voiceSuccess, setVoiceSuccess] = useState<string | null>(null);

  // Auto-search if parameters are present in URL
  useEffect(() => {
    const urlPhone = searchParams.get('phone');
    const urlCode = searchParams.get('code');
    if (urlPhone && urlCode) {
      handleLookup(urlPhone, urlCode);
    }
  }, [searchParams]);

  const handleLookup = async (lookupPhone = phone, lookupCode = referenceCode) => {
    if (!lookupPhone.trim() || !lookupCode.trim()) {
      setError('Please provide both your phone number and Application Reference Code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/candidate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: lookupPhone, referenceCode: lookupCode })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching application found.');
      }

      setCandidate(data.candidate);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Application lookup failed.';
      setError(msg);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!candidate) return;
    navigator.clipboard.writeText(candidate.referenceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVoiceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !newVoiceUrl.trim()) return;

    setVoiceUpdateLoading(true);
    setVoiceSuccess(null);

    try {
      const res = await fetch('/api/candidate/update-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: candidate.phone,
          referenceCode: candidate.referenceCode,
          voiceNoteUrl: newVoiceUrl.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update voice audition.');
      }

      setCandidate({
        ...candidate,
        voiceNoteUrl: newVoiceUrl.trim()
      });
      setVoiceSuccess('Voice audition updated successfully!');
      setIsUpdatingVoice(false);
      setNewVoiceUrl('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating voice note.';
      alert(msg);
    } finally {
      setVoiceUpdateLoading(false);
    }
  };

  const currentStageIndex = candidate ? getStageIndex(candidate.status) : 0;
  const isRejected = candidate?.status === 'Rejected';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header Card */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Candidate Application Status Tracker
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Track your real-time recruitment journey, scheduled interview dates, and direct coordinator contacts using your phone number and reference code.
        </p>

        {/* Lookup Form */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Registered Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Reference Code
            </label>
            <input
              type="text"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="ACE-XXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              onClick={() => handleLookup()}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  Track Status
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Candidate Cockpit Display */}
      {candidate && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Banner */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                  Applicant Profile
                </span>
                <h2 className="text-2xl font-black text-white">{candidate.fullName}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                  <span>Phone: <strong className="text-slate-200">{candidate.phone}</strong></span>
                  <span>&bull;</span>
                  <span>English: <strong className="text-amber-300 font-bold">{candidate.englishLevel || 'B2'}</strong></span>
                  <span>&bull;</span>
                  <span>Applied: <strong className="text-slate-300">{new Date(candidate.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Ref:</span>
                  <span className="text-sm font-black font-mono text-amber-400">{candidate.referenceCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Reference Code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Visual 5-Stage Stepper */}
            <div className="py-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
                Recruitment Progress Milestone
              </span>

              {isRejected ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Application Status: Not Shortlisted</strong>
                    <p className="mt-0.5 text-slate-300">
                      Thank you for applying. At this time, our hiring partner has prioritized other candidates matching specific shift or language requirements. You may submit another application after 60 days.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : isCurrent
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold font-mono">0{idx + 1}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                          ) : null}
                        </div>
                        <h4 className={`text-xs font-black ${isDone || isCurrent ? 'text-white' : 'text-slate-500'}`}>
                          {stage.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scheduled Interview Banner (If present) */}
            {candidate.interviewDate && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                      Scheduled Fast-Track Interview
                    </span>
                    <span className="text-sm font-black text-white">
                      {new Date(candidate.interviewDate).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {new Date(candidate.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-blue-300 font-medium">Please be online 10 mins early</span>
              </div>
            )}
          </div>

          {/* Details Grid: Opportunity & Coordinator Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Vacancy Card */}
            {candidate.offer ? (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Applied Vacancy
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {candidate.offer.language} ({candidate.offer.level})
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{candidate.offer.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.offer.company_name} &bull; <span className="text-slate-300">{candidate.offer.location}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block">Compensation</span>
                      <span className="font-bold text-amber-400 text-xs">{candidate.offer.salary_range}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block">Work Setup</span>
                      <span className="font-bold text-white text-xs">{candidate.offer.work_style}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Shift: {candidate.offer.shift}</span>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-center text-center">
                <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">General Application</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You submitted an open fast-track application. Our recruiters will map you to the highest matching BPO account.
                </p>
              </div>
            )}

            {/* Assigned Coordinator & WhatsApp Support */}
            <div className="glass-panel-emerald rounded-3xl p-6 border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-2">
                  Direct Talent Coordinator
                </span>
                <h3 className="text-lg font-bold text-white">{candidate.coordinator.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Have questions about your scheduled interview or application status? Reach out directly via WhatsApp.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Coordination Office:</span>
                    <span className="font-semibold text-white">ACE Cairo Hub</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Support Hours:</span>
                    <span className="text-emerald-300 font-semibold">10:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`https://wa.me/${candidate.coordinator.whatsapp}?text=${encodeURIComponent(
                    `Hello ${candidate.coordinator.name}, I am checking on my ACE Agency candidate application for ${
                      candidate.offer?.title || 'Open Vacancy'
                    } (Reference Code: ${candidate.referenceCode}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950" />
                  Chat with Coordinator on WhatsApp
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                </a>
              </div>
            </div>
          </div>

          {/* Voice Audition Evaluation & Update Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Your Spoken Audition Note</h3>
                  <span className="text-xs text-slate-400">Zero-storage Vocaroo audio evaluation</span>
                </div>
              </div>

              <button
                onClick={() => setIsUpdatingVoice(!isUpdatingVoice)}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-amber-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              >
                {isUpdatingVoice ? 'Cancel' : 'Update / Re-record Voice Note'}
              </button>
            </div>

            {voiceSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{voiceSuccess}</span>
              </div>
            )}

            {/* Current Player */}
            {candidate.voiceNoteUrl ? (
              <div className="pt-2">
                <VocarooPlayer url={candidate.voiceNoteUrl} candidateName={candidate.fullName} />
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No voice note uploaded yet.</p>
            )}

            {/* Update Voice Form */}
            {isUpdatingVoice && (
              <form onSubmit={handleVoiceUpdate} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 mt-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Paste New Vocaroo Link:</label>
                  <a
                    href="https://vocaroo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1"
                  >
                    Open Vocaroo Recorder <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={newVoiceUrl}
                    onChange={(e) => setNewVoiceUrl(e.target.value)}
                    placeholder="https://vocaroo.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={voiceUpdateLoading}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {voiceUpdateLoading ? 'Updating...' : 'Save Voice Note'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidateTrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] bg-grid-pattern text-slate-100">
      <Navbar />
      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-12 text-slate-400 text-xs">Loading Candidate Tracker...</div>}>
          <CandidateTrackerContent />
        </Suspense>
      </main>
      <footer className="border-t border-slate-900 bg-[#05070d] py-6 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ACE Recruitment Agency &bull; Candidate Self-Service Tracking Portal</p>
      </footer>
    </div>
  );
}
