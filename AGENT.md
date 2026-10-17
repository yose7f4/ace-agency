# ACE Recruitment Agency — Architecture & Master Rules

## 1. Brand & Tech Stack
- **Brand Name:** ACE Recruitment Agency (or "ACE Agency")
- **Framework:** Next.js (App Router, TypeScript), Tailwind CSS, Shadcn UI, Lucide Icons.
- **Database & Auth:** Supabase (`@supabase/supabase-js` and `@supabase/ssr`).
- **Design Theme:** Dark/Modern Corporate UI (Slate/Zinc dark mode with Gold & Royal Blue accents) featuring the **ACE Agency** brand header. Mobile-first responsiveness.

## 2. Strict Role-Based Access & Data Isolation
There are 3 authenticated roles (`admin`, `team_leader`, `recruiter`) and 1 public role (Candidate):
1. **Super Admin (`admin`):**
   - Full CRUD access to all Offers, Users, Teams, Candidates, and Commissions at `/dashboard/admin`.
   - Can manually add/edit offers (Method 1) and toggle Offer Status (`active`, `hold`, `closed`).
2. **Team Leader (`team_leader`):**
   - Accesses `/dashboard/leader`.
   - **STRICT ISOLATION:** Can ONLY see Recruiters where `profiles.team_leader_id == current_user.id` AND Candidates where `candidates.team_leader_id == current_user.id`.
   - Can update candidate statuses, schedule interviews, listen to Vocaroo voice notes, and trigger 1-click WhatsApp messages.
3. **Recruiter (`recruiter`):**
   - Accesses `/dashboard/recruiter`.
   - **STRICT ISOLATION:** Can ONLY see Candidates where `candidates.recruiter_id == current_user.id`.
   - Can browse Active Offers and click "Copy Minimized Offer + My Affiliate Link".
4. **Public Candidate (Unauthenticated):**
   - Accesses `/apply/[offerId]?ref=[referral_code]` or `/apply?ref=[referral_code]`.
   - Cannot see internal recruiter notes, agency codes, or commission numbers.

## 3. Core Business Logic
- **Zero-Storage Voice Notes:** Candidates submit a **Vocaroo.com link** in the `voice_note_url` field so we use 0 MB of file storage.
- **Affiliate Link Engine:** Capture `?ref=[referral_code]` from the URL, save it in `localStorage` and cookies for 30 days. When a candidate submits an application, automatically look up the Recruiter by `referral_code` and populate both `recruiter_id` AND that recruiter's `team_leader_id` on the candidate record.
- **60-Day Anti-Duplicate Lock:** Before inserting a new candidate, check if `phone` or `whatsapp` already exists in `candidates` within the last 60 days. If it exists, block submission with a clear message.
- **Cooling Period & Commission Timer:** Each offer has `cooling_period_days` (e.g., 14, 21, 30, 36, 45). When a candidate's status becomes `Batch_Started` and `batch_start_date` is set, automatically calculate `commission_unlock_date = batch_start_date + cooling_period_days`.