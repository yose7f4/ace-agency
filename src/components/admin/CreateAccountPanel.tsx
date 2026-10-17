'use client';

import React, { useState } from 'react';
import type { Profile, UserRole } from '@/lib/supabase/types';
import { 
  UserPlus, 
  Key, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';

interface CreateAccountPanelProps {
  teamLeaders: Profile[];
  onUserCreated?: (newUser: Profile) => void;
  onClose?: () => void;
}

interface CreatedAccountCredentials {
  email: string;
  password: string;
  referral_code: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  whatsapp: string | null;
  team_leader_name?: string | null;
}

/**
 * Generate a strong, memorable temporary password
 */
function generateTemporaryPassword(): string {
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%&*';

  // Ensure minimum character variety
  const initial = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const pool = lower + upper + numbers + symbols;
  for (let i = 0; i < 6; i++) {
    initial.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return initial.sort(() => Math.random() - 0.5).join('');
}

export function CreateAccountPanel({ teamLeaders, onUserCreated, onClose }: CreateAccountPanelProps) {
  const [fullName, setFullName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'recruiter' | 'team_leader'>('recruiter');
  const [teamLeaderId, setTeamLeaderId] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [justGenerated, setJustGenerated] = useState(false);

  // Result popup / modal state
  const [createdCredentials, setCreatedCredentials] = useState<CreatedAccountCredentials | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleGeneratePassword = () => {
    const newPwd = generateTemporaryPassword();
    setPassword(newPwd);
    setShowPassword(true);
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 2000);
  };

  const handleAppendDomain = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setEmailInput('username@ace.com');
      return;
    }
    if (!trimmed.includes('@')) {
      setEmailInput(`${trimmed}@ace.com`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Normalize email: if user entered just username, append @ace.com
    let targetEmail = emailInput.trim();
    if (!targetEmail.includes('@')) {
      targetEmail = `${targetEmail}@ace.com`;
    }

    if (!targetEmail || !targetEmail.includes('@')) {
      setFormError('Please provide a valid email or username.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        email: targetEmail,
        password: password,
        phone: phone.trim() || null,
        whatsapp: phone.trim() || null,
        role: role,
        team_leader_id: role === 'recruiter' && teamLeaderId ? teamLeaderId : null,
      };

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create user account.');
      }

      const assignedLeader = teamLeaders.find(tl => tl.id === teamLeaderId);

      setCreatedCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
        referral_code: data.credentials.referral_code,
        full_name: data.credentials.full_name || fullName.trim() || null,
        role: data.credentials.role,
        phone: data.credentials.phone,
        whatsapp: data.credentials.whatsapp,
        team_leader_name: assignedLeader ? (assignedLeader.full_name || assignedLeader.email) : null,
      });

      if (onUserCreated && data.user) {
        onUserCreated(data.user);
      }

      // Reset form fields
      setFullName('');
      setEmailInput('');
      setPassword('');
      setPhone('');
      setRole('recruiter');
      setTeamLeaderId('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while creating user.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppMessage = (creds: CreatedAccountCredentials) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ace-agency.com';
    return `Welcome to ACE Recruitment Agency! 🚀
🌐 Login Link: ${origin}/login
📧 Email: ${creds.email}
🔑 Password: ${creds.password}
🔗 Your Affiliate Code: ${creds.referral_code}`;
  };

  const handleCopyWhatsApp = () => {
    if (!createdCredentials) return;
    const text = getWhatsAppMessage(createdCredentials);
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  const handleCopyPassword = () => {
    if (!createdCredentials) return;
    navigator.clipboard.writeText(createdCredentials.password);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  return (
    <>
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 sm:p-7 relative shadow-2xl overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Panel Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Provision New User Account
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Admin Exclusive
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instantly provision credentials with email verified, auto-generated referral code, and 1-click WhatsApp copy
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Omar Tarek"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Email or username@ace.com */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email / Username <span className="text-amber-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAppendDomain}
                  className="text-[11px] font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                  title="Append @ace.com"
                >
                  + @ace.com
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. omar.tarek@ace.com or omar.tarek"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Temporary Password with Generator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Temporary Password <span className="text-amber-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 transition-all cursor-pointer"
                >
                  <Key className="w-3 h-3 text-amber-400" />
                  {justGenerated ? 'Password Generated!' : 'Generate Password'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 font-mono border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  placeholder="e.g. +20 10 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Role Assignment <span className="text-amber-400">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'recruiter' | 'team_leader')}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              >
                <option value="recruiter">Recruiter (Affiliate Talent Sourcer)</option>
                <option value="team_leader">Team Leader (Manages Recruiters & Candidates)</option>
              </select>
            </div>

            {/* Team Leader Dropdown (visible when role === 'recruiter') */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Team Leader {role === 'recruiter' && <span className="text-slate-500">(Optional)</span>}
              </label>
              {role === 'recruiter' ? (
                <select
                  value={teamLeaderId}
                  onChange={(e) => setTeamLeaderId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                >
                  <option value="">-- No Team Leader (Independent) --</option>
                  {teamLeaders.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.full_name || tl.email} (Code: {tl.referral_code})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="py-2.5 px-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-500 italic">
                  Team Leaders report directly to Executive Admin
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              A unique referral code (<code className="text-amber-400">ACE-XXXXX</code>) will be generated automatically.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create User Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SUCCESS POPUP / MODAL: CREDENTIALS & WHATSAPP COPY */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-emerald-500/30 p-6 sm:p-8 relative shadow-2xl bg-slate-950/95 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    Account Created Successfully! 🚀
                  </h3>
                  <p className="text-xs text-slate-400">
                    User account is activated and ready to sign in.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Overview Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">User Name:</span>
                <span className="font-bold text-white text-sm">
                  {createdCredentials.full_name || 'Staff Member'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Assigned Role:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider border ${
                  createdCredentials.role === 'team_leader' 
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' 
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  {createdCredentials.role === 'team_leader' ? 'Team Leader' : 'Recruiter'}
                </span>
              </div>

              {createdCredentials.team_leader_name && (
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Assigned Team Leader:</span>
                  <span className="font-bold text-blue-300">
                    {createdCredentials.team_leader_name}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Login Email:</span>
                <span className="font-mono font-bold text-white selection:bg-amber-500/30">
                  {createdCredentials.email}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Temporary Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {createdCredentials.password}
                  </span>
                  <button
                    onClick={handleCopyPassword}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy Password"
                  >
                    {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Unique Referral Code:</span>
                <span className="font-mono font-black text-amber-400 tracking-wider bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {createdCredentials.referral_code}
                </span>
              </div>
            </div>

            {/* 1-CLICK COPY CREDENTIALS FOR WHATSAPP BUTTON */}
            <div className="space-y-3">
              <button
                onClick={handleCopyWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                {copiedWhatsApp ? (
                  <>
                    <Check className="w-5 h-5 text-slate-950" />
                    <span>Copied! Ready to Paste in WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-slate-950" />
                    <span>Copy Login Credentials for WhatsApp</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp URL helper */}
              <a
                href={`https://wa.me/${(createdCredentials.whatsapp || createdCredentials.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getWhatsAppMessage(createdCredentials))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                Open Directly in WhatsApp Web / App
              </a>
            </div>

            {/* Preview of the WhatsApp message */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Preview of Generated Message:
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {getWhatsAppMessage(createdCredentials)}
              </pre>
            </div>

            {/* Close Button */}
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setCreatedCredentials(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
