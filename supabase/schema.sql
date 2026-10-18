-- ==============================================================================
-- ACE RECRUITMENT AGENCY — POSTGRESQL DATABASE SCHEMA & MASTER RULES
-- Architecture specification from AGENT.md
-- ==============================================================================

-- Enable UUID and Cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 0. CLEAN RECREATION (Avoids column drift and conflicts upon re-running)
-- ==============================================================================
DROP TABLE IF EXISTS public.candidates, public.offers CASCADE;

-- ==============================================================================
-- 1. ENUMS & TYPES
-- ==============================================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'team_leader', 'recruiter');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
    CREATE TYPE offer_status AS ENUM ('active', 'hold', 'closed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'candidate_status') THEN
    CREATE TYPE candidate_status AS ENUM (
      'Applied',
      'Screening',
      'Interview_Scheduled',
      'Interviewed',
      'Shortlisted',
      'Offered',
      'Hired',
      'Batch_Started',
      'Commission_Unlocked',
      'Commission_Paid',
      'Rejected',
      'Withdrawn'
    );
  END IF;
END $$;

-- ==============================================================================
-- 2. TABLES DEFINITIONS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 2.1 PROFILES TABLE (Linked with Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'recruiter',
  team_leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8)),
  phone TEXT,
  whatsapp TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2.2 OFFERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Cairo / Remote',
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  work_style TEXT NOT NULL DEFAULT 'On-site', -- 'On-site', 'Remote', 'Hybrid'
  language TEXT NOT NULL DEFAULT 'English',   -- 'English', 'German', 'French', 'Italian', 'Spanish', etc.
  level TEXT NOT NULL DEFAULT 'B2',          -- 'B1', 'B2', 'C1', 'Fluent', etc.
  shift TEXT NOT NULL DEFAULT 'Day Shift',    -- 'Day Shift', 'Night Shift', 'Rotational', '24/7'
  transport TEXT NOT NULL DEFAULT 'Provided',-- 'Provided', 'Allowance', 'None'
  age_range TEXT NOT NULL DEFAULT '18-45',
  min_age INTEGER NOT NULL DEFAULT 18,
  max_age INTEGER NOT NULL DEFAULT 45,
  grad_status TEXT NOT NULL DEFAULT 'Graduates & Undergrads', -- 'Graduates Only', 'Graduates & Undergrads', 'Any'
  nationality TEXT NOT NULL DEFAULT 'Egyptians & Foreigners',
  experience_required BOOLEAN NOT NULL DEFAULT false,
  salary_range TEXT,
  description TEXT,
  minimized_description TEXT, -- Formatted for "Copy Minimized Offer + My Affiliate Link"
  minimized_post TEXT,        -- Alias for minimized_description
  requirements TEXT,
  benefits TEXT,
  cooling_period_days INTEGER NOT NULL DEFAULT 30 CHECK (cooling_period_days >= 0),
  commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (commission_amount >= 0),
  recruiter_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tl_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  um_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  agency_code TEXT,           -- Internal agency code (Confidential: hidden from candidates)
  internal_notes TEXT,        -- Confidential notes (Admin & internal only)
  status offer_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2.3 CANDIDATES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  team_leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code TEXT,         -- Captured ?ref=[referral_code] affiliate attribution
  app_reference_code TEXT UNIQUE NOT NULL DEFAULT ('ACE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6))),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  age INTEGER,
  residence TEXT,             -- Area / City of residence
  grad_status TEXT,           -- 'Graduate', 'Undergrad', etc.
  voice_note_url TEXT,        -- Zero-Storage Voice Notes: Vocaroo.com URL
  cv_url TEXT,                -- Optional portfolio/CV link
  experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  english_level TEXT,         -- 'B1', 'B2', 'C1', 'C2', 'Fluent', etc.
  military_status TEXT,
  call_center_experience TEXT,
  bpo_experience TEXT,
  status candidate_status NOT NULL DEFAULT 'Applied',
  interview_date TIMESTAMPTZ, -- Scheduled interview timestamp
  batch_start_date DATE,      -- When candidate begins onboarding/batch
  commission_unlock_date DATE,-- Automatically calculated: batch_start_date + cooling_period_days
  commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  internal_notes TEXT,        -- Team Leader & Recruiter internal notes
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE & RELIABILITY
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_team_leader_id ON public.profiles(team_leader_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON public.offers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_candidates_offer_id ON public.candidates(offer_id);
CREATE INDEX IF NOT EXISTS idx_candidates_recruiter_id ON public.candidates(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_candidates_team_leader_id ON public.candidates(team_leader_id);
CREATE INDEX IF NOT EXISTS idx_candidates_referral_code ON public.candidates(referral_code);
CREATE INDEX IF NOT EXISTS idx_candidates_ref_code ON public.candidates(app_reference_code);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_phone ON public.candidates(phone);
CREATE INDEX IF NOT EXISTS idx_candidates_whatsapp ON public.candidates(whatsapp);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON public.candidates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_unlock_date ON public.candidates(commission_unlock_date);

-- ==============================================================================
-- 4. SECURITY DEFINER HELPER FUNCTIONS (PREVENTS RLS RECURSION)
-- ==============================================================================

-- Get current authenticated user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Check if current user is Team Leader
CREATE OR REPLACE FUNCTION public.is_team_leader()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'team_leader'
  );
$$;

-- Check if current user is Recruiter
CREATE OR REPLACE FUNCTION public.is_recruiter()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'recruiter'
  );
$$;

-- Public helper to resolve active recruiter by referral code
CREATE OR REPLACE FUNCTION public.get_recruiter_by_referral(p_referral_code TEXT)
RETURNS TABLE (
  recruiter_id UUID,
  recruiter_name TEXT,
  team_leader_id UUID,
  is_active BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, full_name, team_leader_id, is_active
  FROM public.profiles
  WHERE referral_code = p_referral_code AND is_active = true
  LIMIT 1;
$$;

-- ==============================================================================
-- 5. AUTOMATED TRIGGERS & BUSINESS LOGIC
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 5.1 Updated_at Auto Timestamp Trigger
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_candidates_updated_at ON public.candidates;
CREATE TRIGGER trg_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 5.2 Auto Profile Creation on auth.users Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role := 'recruiter';
  v_team_leader_id UUID := NULL;
  v_meta_role TEXT;
  v_meta_leader TEXT;
BEGIN
  -- Extract role from metadata if provided
  v_meta_role := NEW.raw_user_meta_data->>'role';
  IF v_meta_role IN ('admin', 'team_leader', 'recruiter') THEN
    v_role := v_meta_role::user_role;
  END IF;

  v_meta_leader := NEW.raw_user_meta_data->>'team_leader_id';
  IF v_meta_leader IS NOT NULL AND v_meta_leader ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    v_team_leader_id := v_meta_leader::UUID;
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    team_leader_id,
    referral_code,
    phone,
    avatar_url
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    v_role,
    v_team_leader_id,
    UPPER(SUBSTRING(MD5(NEW.id::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5.3 60-Day Anti-Duplicate Lock Trigger
-- AGENT.md: Before inserting a new candidate, check if phone or whatsapp already
-- exists in candidates within the last 60 days. If exists, block submission.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_candidate_duplicate_60_days()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_id UUID;
  v_existing_created TIMESTAMPTZ;
  v_clean_phone TEXT;
  v_clean_whatsapp TEXT;
BEGIN
  -- Clean numbers (digits only for matching)
  v_clean_phone := regexp_replace(NEW.phone, '[^0-9]', '', 'g');
  v_clean_whatsapp := regexp_replace(NEW.whatsapp, '[^0-9]', '', 'g');

  SELECT id, created_at INTO v_existing_id, v_existing_created
  FROM public.candidates
  WHERE (
    regexp_replace(phone, '[^0-9]', '', 'g') IN (v_clean_phone, v_clean_whatsapp)
    OR
    regexp_replace(whatsapp, '[^0-9]', '', 'g') IN (v_clean_phone, v_clean_whatsapp)
  )
  AND created_at >= (timezone('utc'::text, now()) - INTERVAL '60 days')
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION 'DUPLICATE_CANDIDATE_60_DAYS: Candidate with phone (%) or WhatsApp (%) was already submitted on % (within 60-day protection lock).',
      NEW.phone, NEW.whatsapp, to_char(v_existing_created, 'YYYY-MM-DD');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_candidate_duplicate_60_days ON public.candidates;
CREATE TRIGGER trg_check_candidate_duplicate_60_days
  BEFORE INSERT ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.check_candidate_duplicate_60_days();

-- ------------------------------------------------------------------------------
-- 5.4 Affiliate Link Engine Trigger
-- AGENT.md: Capture ?ref=[referral_code] from URL, save in storage/cookie for 30 days.
-- When submitted, look up Recruiter by referral_code and populate recruiter_id AND team_leader_id.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.resolve_candidate_affiliate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recruiter RECORD;
BEGIN
  -- If referral_code was provided in the application
  IF NEW.referral_code IS NOT NULL AND TRIM(NEW.referral_code) <> '' THEN
    SELECT id, role, team_leader_id INTO v_recruiter
    FROM public.profiles
    WHERE UPPER(referral_code) = UPPER(TRIM(NEW.referral_code))
      AND is_active = true
    LIMIT 1;

    IF FOUND THEN
      -- If the referral code belongs to a recruiter
      IF v_recruiter.role = 'recruiter' THEN
        NEW.recruiter_id := COALESCE(NEW.recruiter_id, v_recruiter.id);
        NEW.team_leader_id := COALESCE(NEW.team_leader_id, v_recruiter.team_leader_id);
      -- If the referral code belongs directly to a team leader
      ELSIF v_recruiter.role = 'team_leader' THEN
        NEW.team_leader_id := COALESCE(NEW.team_leader_id, v_recruiter.id);
      ELSIF v_recruiter.role = 'admin' THEN
        NEW.recruiter_id := COALESCE(NEW.recruiter_id, v_recruiter.id);
      END IF;
    END IF;
  END IF;

  -- If recruiter_id is already set but team_leader_id is missing, look it up from recruiter profile
  IF NEW.recruiter_id IS NOT NULL AND NEW.team_leader_id IS NULL THEN
    SELECT team_leader_id INTO NEW.team_leader_id
    FROM public.profiles
    WHERE id = NEW.recruiter_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resolve_candidate_affiliate ON public.candidates;
CREATE TRIGGER trg_resolve_candidate_affiliate
  BEFORE INSERT ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.resolve_candidate_affiliate();

-- ------------------------------------------------------------------------------
-- 5.5 Cooling Period & Commission Timer Trigger
-- AGENT.md: Each offer has cooling_period_days. When candidate status becomes
-- Batch_Started and batch_start_date is set, calculate commission_unlock_date = batch_start_date + cooling_period_days.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_candidate_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cooling_days INTEGER := 30;
  v_offer_commission NUMERIC(10, 2) := 0.00;
BEGIN
  -- If status is Batch_Started and batch_start_date is populated
  IF NEW.status = 'Batch_Started' AND NEW.batch_start_date IS NOT NULL THEN
    -- Look up offer cooling period and commission amount
    IF NEW.offer_id IS NOT NULL THEN
      SELECT cooling_period_days, commission_amount
      INTO v_cooling_days, v_offer_commission
      FROM public.offers
      WHERE id = NEW.offer_id;
    END IF;

    -- Calculate unlock date: batch_start_date + cooling_period_days
    NEW.commission_unlock_date := NEW.batch_start_date + (COALESCE(v_cooling_days, 30) || ' days')::INTERVAL;

    -- Auto-assign commission amount from offer if not explicitly overwritten
    IF NEW.commission_amount IS NULL OR NEW.commission_amount = 0.00 THEN
      NEW.commission_amount := COALESCE(v_offer_commission, 0.00);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calculate_candidate_commission ON public.candidates;
CREATE TRIGGER trg_calculate_candidate_commission
  BEFORE INSERT OR UPDATE OF status, batch_start_date, offer_id ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.calculate_candidate_commission();

-- ==============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- Strict role isolation per AGENT.md
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6.1 PROFILES POLICIES
-- ------------------------------------------------------------------------------

-- Super Admin: Full CRUD access to all profiles
DROP POLICY IF EXISTS "Admin full access on profiles" ON public.profiles;
CREATE POLICY "Admin full access on profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users can view their own profile
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Team Leaders: Can view recruiters assigned to their team (profiles.team_leader_id == current_user.id)
DROP POLICY IF EXISTS "Team Leader view assigned recruiters" ON public.profiles;
CREATE POLICY "Team Leader view assigned recruiters"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    public.is_team_leader() AND team_leader_id = auth.uid()
  );

-- Users can update their own personal profile
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Non-admin cannot elevate own role or change team_leader_id
    AND (public.is_admin() OR role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
  );

-- Public / Anonymous: Can view active profiles' referral_code and name for affiliate attribution
DROP POLICY IF EXISTS "Public view active referral codes" ON public.profiles;
CREATE POLICY "Public view active referral codes"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (is_active = true AND referral_code IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 6.2 OFFERS POLICIES
-- ------------------------------------------------------------------------------

-- Super Admin: Full CRUD access to all offers
DROP POLICY IF EXISTS "Admin full access on offers" ON public.offers;
CREATE POLICY "Admin full access on offers"
  ON public.offers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Team Leaders & Recruiters: Can browse active offers
DROP POLICY IF EXISTS "Recruiters and Leaders view active offers" ON public.offers;
CREATE POLICY "Recruiters and Leaders view active offers"
  ON public.offers
  FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin());

-- Public Candidates (anon): Can view active offers for applying
DROP POLICY IF EXISTS "Public view active offers" ON public.offers;
CREATE POLICY "Public view active offers"
  ON public.offers
  FOR SELECT
  TO anon
  USING (status = 'active');

-- ------------------------------------------------------------------------------
-- 6.3 CANDIDATES POLICIES (STRICT ROLE ISOLATION)
-- ------------------------------------------------------------------------------

-- Super Admin: Full CRUD access to all candidates
DROP POLICY IF EXISTS "Admin full access on candidates" ON public.candidates;
CREATE POLICY "Admin full access on candidates"
  ON public.candidates
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Team Leader: STRICT ISOLATION
-- Can ONLY see Candidates where candidates.team_leader_id == current_user.id
DROP POLICY IF EXISTS "Team Leader select team candidates" ON public.candidates;
CREATE POLICY "Team Leader select team candidates"
  ON public.candidates
  FOR SELECT
  TO authenticated
  USING (
    public.is_team_leader() AND team_leader_id = auth.uid()
  );

-- Team Leader: Update team candidates (status, interview, notes, batch start date)
DROP POLICY IF EXISTS "Team Leader update team candidates" ON public.candidates;
CREATE POLICY "Team Leader update team candidates"
  ON public.candidates
  FOR UPDATE
  TO authenticated
  USING (
    public.is_team_leader() AND team_leader_id = auth.uid()
  )
  WITH CHECK (
    public.is_team_leader() AND team_leader_id = auth.uid()
  );

-- Recruiter: STRICT ISOLATION
-- Can ONLY see Candidates where candidates.recruiter_id == current_user.id
DROP POLICY IF EXISTS "Recruiter select own candidates" ON public.candidates;
CREATE POLICY "Recruiter select own candidates"
  ON public.candidates
  FOR SELECT
  TO authenticated
  USING (
    public.is_recruiter() AND recruiter_id = auth.uid()
  );

-- Recruiter: Can add candidate under their own recruiter_id
DROP POLICY IF EXISTS "Recruiter insert own candidates" ON public.candidates;
CREATE POLICY "Recruiter insert own candidates"
  ON public.candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_recruiter() AND (recruiter_id = auth.uid() OR recruiter_id IS NULL)
  );

-- Public Candidates (Unauthenticated): Can submit application
-- Cannot see internal recruiter notes, agency codes, or commission numbers
DROP POLICY IF EXISTS "Public candidates submit application" ON public.candidates;
CREATE POLICY "Public candidates submit application"
  ON public.candidates
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ==============================================================================
-- 7. SECURE VIEWS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 7.1 Public Offers View
-- Sanitized public view hiding confidential internal notes, agency code & commissions
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_offers AS
SELECT
  id,
  title,
  company_name,
  location,
  job_type,
  work_style,
  language,
  level,
  shift,
  transport,
  age_range,
  min_age,
  max_age,
  grad_status,
  nationality,
  experience_required,
  salary_range,
  description,
  minimized_description,
  minimized_post,
  requirements,
  benefits,
  cooling_period_days,
  status,
  created_at
FROM public.offers
WHERE status = 'active';

GRANT SELECT ON public.public_offers TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 7.2 Commissions & Cooling Status View
-- Helper view for Admin, Team Leader and Recruiter dashboards
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.candidate_commissions_view AS
SELECT
  c.id AS candidate_id,
  c.full_name AS candidate_name,
  c.email AS candidate_email,
  c.phone AS candidate_phone,
  c.status AS candidate_status,
  c.batch_start_date,
  c.commission_unlock_date,
  c.commission_amount,
  o.id AS offer_id,
  o.title AS offer_title,
  o.cooling_period_days,
  r.id AS recruiter_id,
  r.full_name AS recruiter_name,
  r.email AS recruiter_email,
  tl.id AS team_leader_id,
  tl.full_name AS team_leader_name,
  CASE
    WHEN c.status = 'Commission_Paid' THEN 'Paid'
    WHEN c.commission_unlock_date IS NOT NULL AND CURRENT_DATE >= c.commission_unlock_date THEN 'Unlocked'
    WHEN c.status = 'Batch_Started' AND c.commission_unlock_date IS NOT NULL THEN 'In_Cooling'
    ELSE 'Pending_Batch'
  END AS commission_state,
  CASE
    WHEN c.commission_unlock_date IS NOT NULL AND c.commission_unlock_date > CURRENT_DATE
    THEN (c.commission_unlock_date - CURRENT_DATE)
    ELSE 0
  END AS days_remaining
FROM public.candidates c
LEFT JOIN public.offers o ON c.offer_id = o.id
LEFT JOIN public.profiles r ON c.recruiter_id = r.id
LEFT JOIN public.profiles tl ON c.team_leader_id = tl.id;

GRANT SELECT ON public.candidate_commissions_view TO authenticated;
