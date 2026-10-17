# ACE Agency — Recruitment Architecture & Affiliate Commission Engine

> **Next-Generation Multilingual Talent Acquisition Platform & Affiliate Commission Engine** built with Next.js 16 (App Router & Turbopack), React 19, Tailwind CSS v4, and Supabase PostgreSQL with strict Row-Level Security (RLS).

---

## 🌟 Executive Overview

**ACE Agency** bridges international BPO conglomerates and multinational corporate partners with elite multilingual talent (German, Italian, French, English). The platform features an automated affiliate engine with 30-day cookie attribution, a strict 60-day anti-theft candidate lock, zero-storage Vocaroo voice auditions, and cooling-period commission wallets.

---

## ✨ Key Features & Architectural Capabilities

### 1. 💼 Multilingual Candidate Fast-Track Portal
* **1-Minute Application Flow:** No tedious resume upload or parsing barriers.
* **Zero-Storage Voice Auditions:** Candidates record a 45–60s spoken audition on Vocaroo and paste the URL. Audio evaluates directly in-browser, preventing cloud storage bloat and protecting PII.
* **Instant WhatsApp Coordinator Routing:** One-click coordinator engagement with pre-filled message templates.
* **60-Day Anti-Duplicate Shield:** Enforces database constraints and triggers preventing candidate submissions with duplicate phone or WhatsApp numbers within 60 days.

### 2. ⚡ Affiliate Recruiter & Commission Engine
* **Dynamic Referral Link Engine:** Generates cryptographically verifiable referral query parameters (`?ref=YOUR_CODE`).
* **30-Day Cookie Attribution:** Automatically captures and persists affiliate referrals across browser sessions for 30 days.
* **Cooling Period Commission Wallet:** Commissions enter a 30-day probation cooling timer upon hire, unlocking automatically for disbursement.
* **1-Click Minimized Ad Generator:** Copies pre-formatted job vacancies with embedded affiliate links ready for social distribution.

### 3. 🛡️ Three Isolated Operational Command Hubs
* **Super Admin Hub:** Manual Method 1 offer creator, 1-click status toggling, staff account provisioning, and agency-wide commission analytics.
* **Team Leader Hub:** Real-time visibility into supervised recruiters, team performance metrics, inline Vocaroo audio player, and candidate scheduling.
* **Recruiter Portal:** Vacancies marketplace, commission balance ledger, and lead conversion tracker.
* **Database Row-Level Security (RLS):** Total data isolation at the PostgreSQL database layer ensuring strict role boundaries.

### 4. 🎨 Design System: Executive Dark Glass & Amber Luxury
* Dark obsidian backdrop (`#070a12`) with micro-dot and architectural grid patterns.
* Champagne gold and warm amber metallics paired with electric sapphire and emerald trust badges.
* Interactive vacancy filters, live audio wave visualizers, and an interactive recruiter earnings calculator.

---

## 🚀 Technology Stack

* **Framework:** Next.js 16.4 (App Router & Turbopack)
* **Frontend:** React 19, Tailwind CSS v4, Lucide Icons
* **Database & Auth:** Supabase PostgreSQL with Row-Level Security (RLS) policies
* **Audio Integration:** Vocaroo Embed Player & Zero-Storage Audio Evaluation
* **Language:** TypeScript 5

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yose7f4/ace-agency.git
cd ace-agency
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production build
```bash
npm run build
```

---

## 🔒 Security & Anti-Fraud Architecture

* **Candidate Deduplication:** Database triggers reject applications reusing contact numbers within 60 calendar days.
* **Role Hierarchy Isolation:** Team Leaders can only access records mapped to their assigned sub-recruiters.
* **PII & Audio Safeguards:** Voice notes are streamed directly via third-party iframe embeds without storing audio binaries in application databases.

---

## 📄 License
Private & Proprietary — Developed for ACE Recruitment Agency.
