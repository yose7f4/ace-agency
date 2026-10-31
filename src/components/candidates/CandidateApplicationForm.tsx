'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { captureReferralCode, getStoredReferralCode } from '@/lib/affiliate';
import { VocarooPlayer } from '@/components/voice/VocarooPlayer';
import type { Offer } from '@/lib/supabase/types';
import Link from 'next/link';
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
  Check, 
  Copy, 
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building2,
  Calendar,
  Award
} from 'lucide-react';

interface CandidateApplicationFormProps {
  initialOfferId?: string;
}

function CandidateApplicationFormInner({ initialOfferId }: CandidateApplicationFormProps) {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>(initialOfferId || '');
  const [referralCode, setReferralCode] = useState<string>('');

  // Step Tracker (1: Identity & Legal, 2: Language & Voice, 3: Availability & Review)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields - Step 1: Personal & Legal
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [nationalId, setNationalId] = useState('');
  const [militaryStatus, setMilitaryStatus] = useState('Completed');
  const [age, setAge] = useState<number | ''>('');
  const [residence, setResidence] = useState('Cairo');

  // Form Fields - Step 2: Language & Voice
  const [gradStatus, setGradStatus] = useState('Graduate');
  const [englishLevel, setEnglishLevel] = useState('B2');
  const [secondLanguage, setSecondLanguage] = useState('None');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');

  // Form Fields - Step 3: Work Preferences & Availability
  const [callingPeriod, setCallingPeriod] = useState('Morning (10:00 AM - 2:00 PM)');
  const [experienceYears, setExperienceYears] = useState(0);
  const [batchName, setBatchName] = useState('Feb WGS Batch (Fast-Track)');

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const supabase = createBrowserClient();

  useEffect(() => {
    // 1. Capture referral code from URL query (?ref=...) and persist for 30 days
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

  // Step 1 Validation
  const validateStep1 = () => {
    setValidationError(null);
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setValidationError('Please enter your full official name (at least first and last name).');
      return false;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('Please enter a valid mobile number (e.g., 010xxxxxxxx).');
      return false;
    }
    const cleanNationalId = nationalId.replace(/[^0-9]/g, '');
    if (cleanNationalId.length !== 14) {
      setValidationError('Egyptian National ID must be exactly 14 numeric digits.');
      return false;
    }
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setValidationError(null);
    if (!voiceNoteUrl.trim() || !voiceNoteUrl.includes('vocaroo.com')) {
      setValidationError('Please record a 45-60s spoken audition on vocaroo.com and paste the valid link.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    setErrorMessage(null);
    setSubmitting(true);

    try {
      // 1. Client-Side Pre-Flight Check for 60-day duplicate phone/whatsapp/national_id
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

      const { data: existingDuplicate } = await supabase
        .from('candidates')
        .select('id, created_at')
        .or(`phone.eq.${phone},whatsapp.eq.${whatsapp || phone},national_id.eq.${nationalId}`)
        .gte('created_at', sixtyDaysAgo)
        .limit(1);

      if (existingDuplicate && existingDuplicate.length > 0) {
        const existingDate = new Date(existingDuplicate[0].created_at).toLocaleDateString();
        setDuplicateError(
          `Our 60-day anti-duplicate policy detected a previous application submitted on ${existingDate}. Duplicate submissions within 60 days are restricted to protect recruiter attribution.`
        );
        setSubmitting(false);
        return;
      }

      // 2. Submit candidate application with all meeting data points
      const { data: insertedData, error: insertError } = await supabase
        .from('candidates')
        .insert({
          offer_id: selectedOfferId || null,
          referral_code: referralCode || null,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          whatsapp: (whatsapp || phone).trim(),
          national_id: nationalId.trim(),
          military_status: militaryStatus,
          calling_period: callingPeriod,
          batch_name: batchName,
          age: age ? Number(age) : null,
          residence,
          grad_status: gradStatus,
          english_level: englishLevel,
          voice_note_url: voiceNoteUrl.trim(),
          experience_years: Number(experienceYears),
          status: 'Applied',
        })
        .select('id, app_reference_code')
        .single();

      if (insertError) {
        if (insertError.message.includes('DUPLICATE_CANDIDATE_60_DAYS') || insertError.message.includes('60 days')) {
          setDuplicateError(
            'This record was already submitted within the last 60 days. Our anti-duplicate lock has protected this applicant record.'
          );
          setSubmitting(false);
          return;
        }
        throw insertError;
      }

      if (insertedData) {
        const ref = insertedData.app_reference_code || ('ACE-' + insertedData.id.replace(/-/g, '').slice(0, 6).toUpperCase());
        setGeneratedCode(ref);
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
    const rawNumber = (whatsapp || phone || '').replace(/[^0-9]/g, '');
    let cleanNumber = rawNumber;
    if (rawNumber.startsWith('01') && rawNumber.length === 11) {
      cleanNumber = '2' + rawNumber;
    }
    const coordinatorMsg = `Hello ACE Agency! 👋 My application reference code is *${generatedCode}* for *${offer?.title || 'Selected Position'}*. I have submitted my details and voice audition.`;
    const waCoordinatorUrl = `https://wa.me/201000000000?text=${encodeURIComponent(coordinatorMsg)}`;

    return (
      <div className="glass-panel max-w-xl mx-auto rounded-3xl p-8 sm:p-10 border border-emerald-500/30 text-center shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Application Successfully Received!
        </h2>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Thank you, <strong className="text-amber-400">{fullName}</strong>! Your application for{' '}
          <strong className="text-white">{offer?.title || 'Selected Opportunity'}</strong> has been registered with ACE Recruitment Agency.
        </p>

        {/* Generated Reference Code Badge */}
        {generatedCode && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Your Application Reference Code</span>
              <span className="text-xl font-mono font-black text-white">{generatedCode}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2500);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        )}

        {/* Next Steps Reminder */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left mb-6 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Important Next Step:</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our talent coordinators will reach out via WhatsApp during your preferred calling window (<strong>{callingPeriod}</strong>). Please remember to mention that you applied through <strong>ACE Recruitment Agency</strong> during your interview!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs text-center transition-all"
          >
            Return to Vacancies
          </Link>
          <a
            href={waCoordinatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notify Coordinator</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            FAST-TRACK MULTILINGUAL APPLICATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Apply with ACE Agency
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero fees • 60-day anti-theft candidate lock • Verified BPO partner batches
          </p>
        </div>

        {referralCode && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Ref: {referralCode}</span>
          </div>
        )}
      </div>

      {/* 3-Step Guided Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-xs font-bold">
          <span className={step >= 1 ? 'text-amber-400' : 'text-slate-500'}>1. Legal & Identity</span>
          <span className={step >= 2 ? 'text-amber-400' : 'text-slate-500'}>2. Language & Voice</span>
          <span className={step >= 3 ? 'text-amber-400' : 'text-slate-500'}>3. Preferences</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
          />
        </div>
      </div>

      {/* Error Notifications */}
      {validationError && (
        <div className="p-4 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}
      {duplicateError && (
        <div className="p-4 mb-6 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{duplicateError}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= STEP 1: PERSONAL & LEGAL IDENTITY ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            {/* Offer Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Target Opportunity
              </label>
              <select
                value={selectedOfferId}
                onChange={(e) => handleOfferChange(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">General Application / Best Match</option>
                {availableOffers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title} — {o.company_name} ({o.language} • {o.salary_range})
                  </option>
                ))}
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Full Name (الاسم بالكامل) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmed Mohamed Hassan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Mobile Phone (موبايل) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  disabled={sameAsPhone}
                  placeholder="01012345678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 ${
                    sameAsPhone ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
                <label className="inline-flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                  />
                  <span>Same as Mobile Phone</span>
                </label>
              </div>
            </div>

            {/* Egyptian National ID (Meeting addition) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Egyptian National ID (الرقم القومي) *
                </span>
                <span className="text-[10px] text-amber-400 font-mono">14 Numeric Digits</span>
              </label>
              <input
                type="text"
                required
                maxLength={14}
                placeholder="2990101xxxxxxxx"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Required for corporate BPO blacklist screening and deduplication.
              </span>
            </div>

            {/* Military Status (Meeting addition) & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Military Status (الموقف من التجنيد) *
                </label>
                <select
                  value={militaryStatus}
                  onChange={(e) => setMilitaryStatus(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Completed">Completed (أدى الخدمة)</option>
                  <option value="Exempted">Exempted (معفى نهائي)</option>
                  <option value="Postponed">Postponed (مؤجل)</option>
                  <option value="Female / Not Applicable">Female / Not Applicable (غير مطالب)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Age (السن) *
                </label>
                <input
                  type="number"
                  required
                  min={18}
                  max={45}
                  placeholder="e.g. 24"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Email & Residence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Residence Governorate (المحافظة) *
                </label>
                <select
                  value={residence}
                  onChange={(e) => setResidence(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Cairo">Cairo (القاهرة)</option>
                  <option value="Giza">Giza (الجيزة)</option>
                  <option value="Alexandria">Alexandria (الإسكندرية)</option>
                  <option value="Qalyubia">Qalyubia (القليوبية)</option>
                  <option value="Sharqia">Sharqia (الشرقية)</option>
                  <option value="Other">Other Governorate (محافظة أخرى)</option>
                </select>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <span>Continue to Step 2: Language & Voice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: LANGUAGE, EDUCATION & VOICE NOTE ================= */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            {/* Education / Graduation Status (Meeting addition: High School & Drop-out) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Education Status (المؤهل الدراسي) *
              </label>
              <select
                value={gradStatus}
                onChange={(e) => setGradStatus(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Graduate">University Graduate (خريج مؤهل عالي)</option>
                <option value="Undergraduate">Undergraduate Student (طالب جامعي)</option>
                <option value="High School">High School / Diploma (ثانوية عامة / دبلوم)</option>
                <option value="College Drop-out">College Drop-out (متوقف عن الدراسة)</option>
              </select>
            </div>

            {/* English Level & Second Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  English Level *
                </label>
                <select
                  value={englishLevel}
                  onChange={(e) => setEnglishLevel(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="B1">B1 (Intermediate • Fast-Track Allowed)</option>
                  <option value="B2">B2 (Upper Intermediate • Standard BPO)</option>
                  <option value="C1">C1 (Fluent / Advanced • Premium Accounts)</option>
                  <option value="C2">C2 (Bilingual / Native Speaker)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Second Language (Optional)
                </label>
                <select
                  value={secondLanguage}
                  onChange={(e) => setSecondLanguage(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="None">None (English Only)</option>
                  <option value="German">German (Deutsch B2/C1)</option>
                  <option value="French">French (Français B2/C1)</option>
                  <option value="Italian">Italian (Italiano B2/C1)</option>
                  <option value="Spanish">Spanish (Español B2/C1)</option>
                </select>
              </div>
            </div>

            {/* Zero-Storage Voice Note URL (Vocaroo) */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  Spoken English Audition (تسجيل صوتي إجباري) *
                </span>
                <a
                  href="https://vocaroo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
                >
                  <span>Open Vocaroo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Record a <strong>45 to 60-second audio</strong> introducing yourself in English (your education, language level, and work history) on{' '}
                <a href="https://vocaroo.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold underline">vocaroo.com</a>{' '}
                and paste your link below.
              </p>

              <input
                type="url"
                required
                placeholder="https://vocaroo.com/1xxxxxxxxxxx or https://voca.ro/1xxxxxxxxxxx"
                value={voiceNoteUrl}
                onChange={(e) => setVoiceNoteUrl(e.target.value)}
                className="w-full bg-[#090d18] border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-200 placeholder-slate-600 font-mono focus:outline-none focus:border-amber-400"
              />

              {/* In-Browser Vocaroo Audio Preview */}
              {voiceNoteUrl && voiceNoteUrl.includes('voca') && (
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">Audio Playback Check</span>
                  <VocarooPlayer url={voiceNoteUrl} />
                </div>
              )}
            </div>

            {/* Back & Next Navigation */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-1.5 py-3 px-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <span>Continue to Step 3: Availability & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: WORK PREFERENCES & SUBMIT ================= */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            {/* Preferred Calling Window (Meeting addition) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Preferred Phone Screening Window (الميعاد المفضل للاتصال) *
              </label>
              <select
                value={callingPeriod}
                onChange={(e) => setCallingPeriod(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Morning (10:00 AM - 2:00 PM)">Morning (10:00 AM - 2:00 PM)</option>
                <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon (2:00 PM - 6:00 PM)</option>
                <option value="Evening (6:00 PM - 10:00 PM)">Evening (6:00 PM - 10:00 PM)</option>
              </select>
            </div>

            {/* BPO / Call Center Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  Years of Call Center Experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Target Intake Batch
                </label>
                <select
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Feb WGS Batch (Fast-Track)">Feb WGS Batch (Fast-Track • Zero Fees)</option>
                  <option value="Teleperformance Immediate Batch">Teleperformance Immediate Batch</option>
                  <option value="Concentrix Multilingual Batch">Concentrix Multilingual Batch</option>
                  <option value="Next Available General Batch">Next Available General Batch</option>
                </select>
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">Application Summary</span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Candidate: <strong className="text-white">{fullName}</strong></div>
                <div>Phone: <strong className="text-white">{phone}</strong></div>
                <div>National ID: <strong className="text-white font-mono">{nationalId}</strong></div>
                <div>Military: <strong className="text-white">{militaryStatus}</strong></div>
                <div>English: <strong className="text-white">{englishLevel}</strong></div>
                <div>Education: <strong className="text-white">{gradStatus}</strong></div>
              </div>
            </div>

            {/* Terms Guarantee */}
            <div className="text-[11px] text-slate-400 leading-relaxed p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                By submitting, I confirm that all submitted details are accurate. I agree that during my interview I will mention that I was referred by <strong>ACE Recruitment Agency</strong>.
              </span>
            </div>

            {/* Back & Submit Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-1.5 py-3.5 px-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Registering Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export function CandidateApplicationForm(props: CandidateApplicationFormProps) {
  return (
    <Suspense fallback={
      <div className="w-full max-w-3xl mx-auto p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span>Loading Application Gateway...</span>
      </div>
    }>
      <CandidateApplicationFormInner {...props} />
    </Suspense>
  );
}
