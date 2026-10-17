'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { captureReferralCode, getStoredReferralCode } from '@/lib/affiliate';
import { VocarooPlayer } from '@/components/voice/VocarooPlayer';
import type { Offer } from '@/lib/supabase/types';
import { 
  Sparkles, 
  Send, 
  User, 
  Phone, 
  MessageSquare, 
  Mail, 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Briefcase, 
  Globe, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CandidateApplicationFormProps {
  initialOfferId?: string;
}

export function CandidateApplicationForm({ initialOfferId }: CandidateApplicationFormProps) {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>(initialOfferId || '');
  const [referralCode, setReferralCode] = useState<string>('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [age, setAge] = useState<number | ''>('');
  const [residence, setResidence] = useState('');
  const [gradStatus, setGradStatus] = useState('Graduate');
  const [englishLevel, setEnglishLevel] = useState('B2');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createBrowserClient();

  useEffect(() => {
    // 1. Capture referral code from URL query (?ref=...) and persist in cookies & localStorage for 30 days
    const code = captureReferralCode(searchParams) || getStoredReferralCode() || '';
    setReferralCode(code);

    // 2. Load active offers for dropdown selection if not pre-locked
    async function loadOffers() {
      try {
        const { data } = await supabase
          .from('offers')
          .select('*')
          .eq('status', 'active')
          .order('title');

        if (data) {
          setAvailableOffers(data as Offer[]);
          if (initialOfferId) {
            const current = (data as Offer[]).find(o => o.id === initialOfferId);
            if (current) setOffer(current);
          }
        }
      } catch (err) {
        console.error('Error loading offers', err);
      }
    }

    loadOffers();
  }, [searchParams, initialOfferId]);

  // Sync WhatsApp when "same as phone" is checked
  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone);
    }
  }, [phone, sameAsPhone]);

  // When offer selection changes
  const handleOfferChange = (id: string) => {
    setSelectedOfferId(id);
    const found = availableOffers.find(o => o.id === id);
    setOffer(found || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    setErrorMessage(null);
    setSubmitting(true);

    try {
      // 1. Client-Side Pre-Flight Check for 60-day duplicate phone/whatsapp
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

      const { data: existingDuplicate } = await supabase
        .from('candidates')
        .select('id, created_at')
        .or(`phone.eq.${phone},whatsapp.eq.${whatsapp || phone}`)
        .gte('created_at', sixtyDaysAgo)
        .limit(1);

      if (existingDuplicate && existingDuplicate.length > 0) {
        const existingDate = new Date(existingDuplicate[0].created_at).toLocaleDateString();
        setDuplicateError(
          `Our 60-day anti-duplicate policy detected an application with phone (${phone}) submitted on ${existingDate}. Duplicate submissions within 60 days are restricted.`
        );
        setSubmitting(false);
        return;
      }

      // 2. Submit candidate application
      // Note: The database trigger 'trg_resolve_candidate_affiliate' automatically looks up
      // the recruiter_id and team_leader_id from 'referral_code' on insert!
      const { error: insertError } = await supabase
        .from('candidates')
        .insert({
          offer_id: selectedOfferId || null,
          referral_code: referralCode || null,
          full_name: fullName,
          email,
          phone,
          whatsapp: whatsapp || phone,
          age: age ? Number(age) : null,
          residence,
          grad_status: gradStatus,
          english_level: englishLevel,
          voice_note_url: voiceNoteUrl || null,
          experience_years: Number(experienceYears),
          status: 'Applied',
        });

      if (insertError) {
        if (insertError.message.includes('DUPLICATE_CANDIDATE_60_DAYS') || insertError.message.includes('60 days')) {
          setDuplicateError(
            'This phone or WhatsApp number was already submitted within the last 60 days. Our anti-duplicate lock has protected this applicant record.'
          );
          setSubmitting(false);
          return;
        }
        throw insertError;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Application submission failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel max-w-xl mx-auto rounded-3xl p-8 sm:p-10 border border-emerald-500/30 text-center shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Application Received!
        </h2>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Thank you, <strong className="text-amber-400">{fullName}</strong>! Your application for{' '}
          <strong className="text-white">{offer?.title || 'Selected Opportunity'}</strong> has been registered successfully with ACE Recruitment Agency.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs text-slate-400 space-y-2 mb-6">
          <div className="flex items-center justify-between text-white font-semibold">
            <span>Primary Contact:</span>
            <span>{phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>English Level:</span>
            <span className="text-amber-300 font-bold">{englishLevel}</span>
          </div>
          {referralCode && (
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>Affiliate Reference:</span>
              <span className="font-mono text-amber-400">{referralCode}</span>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 text-left mb-6">
          <strong>Next Steps:</strong> Our recruitment coordinators will evaluate your voice note and reach out to you via WhatsApp within 24 to 48 hours for your fast-track interview scheduling.
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setFullName('');
            setPhone('');
            setWhatsapp('');
            setVoiceNoteUrl('');
          }}
          className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Vacancy Highlight Banner (If offer is selected) */}
      {offer && (
        <div className="glass-panel-gold rounded-2xl p-5 border relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-0.5">
                Target Opportunity
              </span>
              <h2 className="text-xl font-black text-white">{offer.title}</h2>
              <span className="text-xs text-slate-400 font-medium">
                {offer.company_name} • <span className="text-slate-300">{offer.location}</span>
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-block">
                {offer.salary_range || 'Competitive Salary'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 block">Language:</span>
              <span className="font-semibold text-white">{offer.language} ({offer.level})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Work Style:</span>
              <span className="font-semibold text-white">{offer.work_style}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Shift:</span>
              <span className="font-semibold text-white">{offer.shift}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Transport:</span>
              <span className="font-semibold text-white truncate block">{offer.transport}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
        {/* Step Progress Pill Indicator */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 text-[11px] font-semibold">
          <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">1</span>
            <span>Profile</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-800/60 text-slate-300">
            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] font-black flex items-center justify-center">2</span>
            <span>Language</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-800/60 text-slate-300">
            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] font-black flex items-center justify-center">3</span>
            <span>Voice</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Fast-Track Candidate Application</h1>
          </div>
          <p className="text-xs text-slate-400">
            Zero fees, fast review, and direct placement with top corporate partners.
          </p>
        </div>

        {/* 60-Day Duplicate Error Warning */}
        {duplicateError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">60-Day Duplicate Protection Lock</span>
              <p>{duplicateError}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Position Selector (If not already locked to a specific offer) */}
          {!initialOfferId && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Select Desired Vacancy
              </label>
              <select
                value={selectedOfferId}
                onChange={(e) => handleOfferChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">General Application (Match best available vacancy)</option>
                {availableOffers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title} — {o.language} ({o.company_name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
              Full Legal Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Youssef Tarek"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-300">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Same as phone</span>
                </label>
              </div>
              <div className="relative">
                <MessageSquare className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  required
                  disabled={sameAsPhone}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Email & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Age <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={17}
                max={60}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 23"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Residence & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Area of Residence (City / District) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={residence}
                  onChange={(e) => setResidence(e.target.value)}
                  placeholder="e.g. Nasr City, Cairo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Graduation Status
              </label>
              <select
                value={gradStatus}
                onChange={(e) => setGradStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Graduate">Graduate</option>
                <option value="Undergraduate">Undergraduate / College Student</option>
                <option value="Gap Year">Gap Year</option>
                <option value="High School">High School</option>
              </select>
            </div>
          </div>

          {/* English Level & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                English Proficiency Level <span className="text-red-400">*</span>
              </label>
              <select
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="B1">B1 — Intermediate</option>
                <option value="B2">B2 — Upper Intermediate</option>
                <option value="C1">C1 — Advanced</option>
                <option value="Fluent">Fluent / Native</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Years of Relevant Experience
              </label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value={0}>0 Years (Fresh / No Experience)</option>
                <option value={1}>1 Year</option>
                <option value={2}>2 - 3 Years</option>
                <option value={4}>4+ Years</option>
              </select>
            </div>
          </div>

          {/* ZERO-STORAGE VOCAROO VOICE NOTE LINK */}
          <div className="p-5 rounded-2xl glass-panel-gold border relative space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                  <Mic className="w-4 h-4" />
                </span>
                <div>
                  <label className="block text-xs font-black text-white uppercase tracking-wider">
                    Fast-Track Voice Audition
                  </label>
                  <span className="text-[10px] text-amber-300 font-semibold">Skips 2 rounds of initial HR screening</span>
                </div>
              </div>

              <a
                href="https://vocaroo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 inline-flex items-center gap-1.5 shadow-sm transition-all"
              >
                Open Vocaroo Recorder <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-[11px] text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0">1</span>
                <span>Click button to open Vocaroo</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0">2</span>
                <span>Speak for 45–60s in English</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0">3</span>
                <span>Copy & paste the link below</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Introduce yourself and your communication background. Paste your link (e.g. <code className="text-amber-300 font-mono">https://vocaroo.com/...</code>):
            </p>

            <div className="relative">
              <Mic className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={voiceNoteUrl}
                onChange={(e) => setVoiceNoteUrl(e.target.value)}
                placeholder="https://vocaroo.com/1a2b3c4d5e"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Live Audio Preview */}
            {voiceNoteUrl && (
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block mb-1">Audio Preview:</span>
                <VocarooPlayer url={voiceNoteUrl} candidateName={fullName} />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                Submit Application Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
