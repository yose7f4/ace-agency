'use client';

import React from 'react';
import { MessageSquare, CalendarCheck, Clock, FileCheck, Send } from 'lucide-react';

interface WhatsAppButtonsProps {
  candidateName: string;
  phone: string;
  whatsapp: string;
  offerTitle?: string;
  interviewDate?: string | null;
}

export function WhatsAppButtons({
  candidateName,
  phone,
  whatsapp,
  offerTitle = 'Selected Position',
  interviewDate,
}: WhatsAppButtonsProps) {
  // Normalize phone number for WhatsApp wa.me link
  const rawNumber = (whatsapp || phone || '').replace(/[^0-9]/g, '');
  // Default international prefix for Egyptian numbers (01xxxxxxxxx -> 201xxxxxxxxx)
  let cleanNumber = rawNumber;
  if (rawNumber.startsWith('01') && rawNumber.length === 11) {
    cleanNumber = '2' + rawNumber;
  }

  const formattedDate = interviewDate
    ? new Date(interviewDate).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'your scheduled interview time';

  // 1. Interview Invitation message with agency attribution
  const inviteMessage = `Hello ${candidateName}! 👋\n\nCongratulations! ACE Recruitment Agency has reviewed your application for the *${offerTitle}* opportunity.\n\nWe would like to invite you for an interview scheduled on: *${formattedDate}*.\n\n📌 *IMPORTANT:* Please confirm that you will clearly state that you applied through *ACE Recruitment Agency* upon arrival.\n\nPlease reply with *CONFIRM* to lock in your interview slot, or let us know if you need to reschedule.\n\nBest regards,\n*ACE Recruitment Agency*`;

  // 2. 24h Double-Check reminder message with mandatory Agency Attribution clause
  const reminderMessage = `Hi ${candidateName}! ⏰\n\nThis is a quick reminder from *ACE Recruitment Agency* regarding your upcoming interview for *${offerTitle}* scheduled for: *${formattedDate}*.\n\n📌 *MANDATORY INSTRUCTION:* When you arrive and speak to HR or the interviewer, please ensure you clearly state that you were referred by *ACE Recruitment Agency* so your candidacy is verified.\n\nPlease confirm your attendance now. Punctuality is essential!\n\nBest regards,\n*ACE Agency Recruitment Team*`;

  // 3. Interview Preparation Briefing guidance message
  const briefingMessage = `Hello ${candidateName}! 📋\n\nHere is your official *ACE Recruitment Agency* Interview Preparation Guide for *${offerTitle}*:\n\n1️⃣ *Agency Mention:* Ensure you state that you applied via *ACE Recruitment Agency* at the front desk.\n2️⃣ *Punctuality:* Arrive 15 minutes before *${formattedDate}*.\n3️⃣ *Dress Code:* Professional Business Casual.\n4️⃣ *Spoken English:* Speak confidently, clearly, and take your time.\n5️⃣ *Identification:* Bring your valid Egyptian National ID card.\n\nWe wish you the best of luck!\n*ACE Recruitment Agency*`;

  const inviteUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(inviteMessage)}`;
  const reminderUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(reminderMessage)}`;
  const briefingUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(briefingMessage)}`;
  const quickChatUrl = `https://wa.me/${cleanNumber}`;

  if (!cleanNumber) {
    return <span className="text-xs text-slate-500 italic">No WhatsApp number</span>;
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Interview Invitation */}
      <a
        href={inviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-sm group"
        title="Send Interview Invitation via WhatsApp"
      >
        <CalendarCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span>Invite</span>
      </a>

      {/* 24h Double-Check Reminder */}
      <a
        href={reminderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-all shadow-sm group"
        title="Send 24h Double-Check Reminder with Agency Attribution Clause"
      >
        <Clock className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
        <span>24h Check</span>
      </a>

      {/* Interview Briefing */}
      <a
        href={briefingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm group"
        title="Send Interview Preparation Briefing Guide"
      >
        <FileCheck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>Briefing</span>
      </a>

      {/* Direct Chat */}
      <a
        href={quickChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all"
        title="Open Direct WhatsApp Chat"
      >
        <MessageSquare className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
