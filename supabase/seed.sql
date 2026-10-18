-- ==============================================================================
-- ACE RECRUITMENT AGENCY — OFFICIAL DATABASE SEED SCRIPT
-- Complete Active Job Directory Extracted from Partner Spreadsheet Tabs
-- 18 BPO Partners & Accounts in Egypt
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. Ensure Required Columns Exist (Safe Idempotent Guard)
-- ------------------------------------------------------------------------------
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS age_range TEXT NOT NULL DEFAULT '18-45';
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS nationality TEXT NOT NULL DEFAULT 'Egyptians & Foreigners';
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS experience_required BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS minimized_post TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS minimized_description TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS transport TEXT NOT NULL DEFAULT 'Provided';
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS app_reference_code TEXT UNIQUE NOT NULL DEFAULT ('ACE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6)));

-- ------------------------------------------------------------------------------
-- 1. Ensure Profiles Link Test Hierarchy (Omar Recruiter -> Ahmed Team Leader)
-- ------------------------------------------------------------------------------
UPDATE public.profiles
SET team_leader_id = (SELECT id FROM public.profiles WHERE email = 'ahmed@ace.com' LIMIT 1)
WHERE email = 'omar@ace.com';

-- ------------------------------------------------------------------------------
-- 2. Clear Existing Candidates and Offers for a Clean Slate
-- ------------------------------------------------------------------------------
DELETE FROM public.candidates;
DELETE FROM public.offers;

-- ------------------------------------------------------------------------------
-- 3. Insert Comprehensive Directory of Active Job Offers
-- ------------------------------------------------------------------------------

-- ==========================================
-- 1. ALORICA
-- ==========================================

-- 1.1 Alorica English US Airline Account
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'English US Airline Customer Service', 'Alorica', 'English', 'B2–C1',
  'Up to 21,000 EGP / Monthly', 'On-site', 'Rotational (24/7)', 'Sheikh Zayed',
  'Provided across Cairo & Giza', '18–40', 18, 40, 'Graduates & Dropouts', 'Egyptians only', true,
  30, 'English B2–C1 | Minimum 6 months Customer Service experience required | Graduates & Dropouts | Egyptians only | Max age 40 | Military certificate required for males. Process: Online interview (Mon–Fri).',
  E'🔥 ALORICA is hiring Customer Service Agents (US Airline Account)!\n📍 Location: Sheikh Zayed\n💰 Salary: Up to 21,000 EGP / Monthly\n🗣 Language: English (B2–C1)\n🎓 Education: Graduates & Dropouts (Egyptians only, Max age 40)\n💼 Experience: Min 6 months CS experience required\n🎯 Process: Online interview (Mon–Fri)\nApply here: {{APPLY_LINK}}',
  E'🔥 ALORICA is hiring Customer Service Agents (US Airline Account)!\n📍 Location: Sheikh Zayed\n💰 Salary: Up to 21,000 EGP / Monthly\n🗣 Language: English (B2–C1)\n🎓 Education: Graduates & Dropouts (Egyptians only, Max age 40)\n💼 Experience: Min 6 months CS experience required\n🎯 Process: Online interview (Mon–Fri)\nApply here: {{APPLY_LINK}}',
  2000, 2000, 2400, 2700, 'ALO-US-AIR', 'active'
);

-- 1.2 Alorica Bilingual French Account
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Bilingual French Customer Service Agent', 'Alorica', 'French', 'B2+ / C1',
  'Up to 32,000 EGP Gross / Monthly', 'On-site', 'Rotational (9 hrs)', 'Sheikh Zayed',
  'Provided across Cairo & Giza', '18–35', 18, 35, 'Graduates & Undergraduates', 'Egyptians only', false,
  30, 'French & English proficiency | Graduates & Undergraduates | Egyptians only | Max age 35 | Military completed for males. Process: Online interview.',
  E'🔥 ALORICA is hiring Bilingual French CS Agents! 🇨🇵\n📍 Location: Sheikh Zayed\n💰 Salary: Up to 32,000 EGP Gross\n🗣 Language: Fluent French & English\n🎓 Education: Graduates & Undergrads (Egyptians only, Max age 35)\n🎯 Online interview & Fast-track hiring\nApply here: {{APPLY_LINK}}',
  E'🔥 ALORICA is hiring Bilingual French CS Agents! 🇨🇵\n📍 Location: Sheikh Zayed\n💰 Salary: Up to 32,000 EGP Gross\n🗣 Language: Fluent French & English\n🎓 Education: Graduates & Undergrads (Egyptians only, Max age 35)\n🎯 Online interview & Fast-track hiring\nApply here: {{APPLY_LINK}}',
  3000, 3000, 3600, 4000, 'ALO-FR-ZYD', 'active'
);

-- 1.3 Alorica Travel Account English (New Cairo)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Travel Customer Service Representative', 'Alorica', 'English', 'B2–C1',
  'Up to 18,500 EGP / Monthly', 'On-site', 'Rotational', 'New Cairo',
  'Provided across Cairo & Giza', '18–40', 18, 40, 'Graduates only', 'Egyptians only', true,
  30, 'English B2–C1 | Previous Customer Service experience is required | Graduates only | Egyptians only | Max age 40 | Military completed.',
  E'🔥 ALORICA New Cairo is hiring Travel CS Representatives!\n📍 Location: New Cairo\n💰 Salary: Up to 18,500 EGP / Monthly\n🗣 Language: English (B2–C1)\n🎓 Education: Graduates only (Egyptians only, Max age 40)\n💼 Experience: Previous CS experience required\nApply here: {{APPLY_LINK}}',
  E'🔥 ALORICA New Cairo is hiring Travel CS Representatives!\n📍 Location: New Cairo\n💰 Salary: Up to 18,500 EGP / Monthly\n🗣 Language: English (B2–C1)\n🎓 Education: Graduates only (Egyptians only, Max age 40)\n💼 Experience: Previous CS experience required\nApply here: {{APPLY_LINK}}',
  1800, 1800, 2200, 2500, 'ALO-TRV-NC', 'active'
);

-- ==========================================
-- 2. ATAIN
-- ==========================================

-- 2.1 Atain English Travel Advisor (GDS Exp)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'English Travel Advisor (GDS Exp)', 'Atain', 'English', 'B2+ / C1',
  '20,000 EGP Net / Monthly', 'On-site', 'Rotational (9 hrs)', 'Maadi',
  'Allowance / Central Drop-off', '18–40', 18, 40, 'Graduates only', 'Egyptians only', true,
  30, 'English B2+ / C1 | Minimum 1 year GDS Travel experience required | Graduates only | Egyptians only | Max age 40. Process: On-site interview (Mon–Fri, 11:00 AM – 4:00 PM).',
  E'✈️ ATAIN is hiring English Travel Advisors with GDS Experience! 🇬🇧\n📍 Location: Maadi\n💰 Salary: 20,000 EGP Net / Monthly\n🗣 Language: English (B2+ / C1)\n💼 Requirement: Minimum 1 year GDS Travel experience\n🎓 Education: Graduates only (Egyptians only, Max age 40)\n🎯 Process: On-site interview (Mon–Fri, 11 AM - 4 PM)\nApply here: {{APPLY_LINK}}',
  E'✈️ ATAIN is hiring English Travel Advisors with GDS Experience! 🇬🇧\n📍 Location: Maadi\n💰 Salary: 20,000 EGP Net / Monthly\n🗣 Language: English (B2+ / C1)\n💼 Requirement: Minimum 1 year GDS Travel experience\n🎓 Education: Graduates only (Egyptians only, Max age 40)\n🎯 Process: On-site interview (Mon–Fri, 11 AM - 4 PM)\nApply here: {{APPLY_LINK}}',
  2200, 2200, 2600, 3000, 'ATN-EN-GDS', 'active'
);

-- 2.2 Atain German Travel Account Bilingual (GDS Exp)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'German Travel Account Bilingual (GDS Exp)', 'Atain', 'German', 'B2+ / C1',
  '31,400 EGP Net / Monthly', 'On-site', 'Day / Rotational', 'Maadi Technology Park',
  'Provided', '18–40', 18, 40, 'Graduates only', 'Egyptians only', true,
  30, 'German B2+ / C1 & English proficiency | GDS experience required | Graduates only | Egyptians only | Max age 40. On-site interviews in Maadi Technology Park.',
  E'✈️ ATAIN is hiring German Travel Advisors (Bilingual + GDS Exp)! 🇩🇪\n📍 Location: Maadi Technology Park\n💰 Salary: 31,400 EGP Net / Monthly\n🗣 Language: German (B2+/C1) & English\n💼 Requirement: GDS Travel experience required\n🎓 Education: Graduates only (Egyptians only, Max age 40)\nApply here: {{APPLY_LINK}}',
  E'✈️ ATAIN is hiring German Travel Advisors (Bilingual + GDS Exp)! 🇩🇪\n📍 Location: Maadi Technology Park\n💰 Salary: 31,400 EGP Net / Monthly\n🗣 Language: German (B2+/C1) & English\n💼 Requirement: GDS Travel experience required\n🎓 Education: Graduates only (Egyptians only, Max age 40)\nApply here: {{APPLY_LINK}}',
  3500, 3500, 4200, 4800, 'ATN-DE-GDS', 'active'
);

-- 2.3 Atain French Travel Advisor (GDS Exp)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Travel Advisor (GDS Exp)', 'Atain', 'French', 'B2+ / C1',
  '32,000 EGP Net / Monthly', 'On-site', 'Day / Rotational', 'Maadi',
  'Provided', '18–40', 18, 40, 'Graduates only', 'Egyptians only', true,
  30, 'French B2+ / C1 | GDS Travel experience required | Graduates only | Egyptians only | Max age 40.',
  E'✈️ ATAIN is hiring French Travel Advisors (GDS Exp)! 🇫🇷\n📍 Location: Maadi\n💰 Salary: 32,000 EGP Net / Monthly\n🗣 Language: French (B2+/C1)\n💼 Requirement: GDS Travel experience required\n🎓 Education: Graduates only (Egyptians only, Max age 40)\nApply here: {{APPLY_LINK}}',
  E'✈️ ATAIN is hiring French Travel Advisors (GDS Exp)! 🇫🇷\n📍 Location: Maadi\n💰 Salary: 32,000 EGP Net / Monthly\n🗣 Language: French (B2+/C1)\n💼 Requirement: GDS Travel experience required\n🎓 Education: Graduates only (Egyptians only, Max age 40)\nApply here: {{APPLY_LINK}}',
  3500, 3500, 4200, 4800, 'ATN-FR-GDS', 'active'
);

-- ==========================================
-- 3. Contact Center Source (CCS)
-- ==========================================

-- 3.1 Transfer / Qualification Agent (US Market)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Transfer / Qualification Agent (US Market)', 'Contact Center Source (CCS)', 'English', 'B2 / C1+',
  '11,000 EGP Net + 1,000 Transport + 3,000 KPIs + Unlimited Commission', 'On-site',
  'Fixed Night Shift: 6:00 PM – 3:00 AM (Sat & Sun Off)', 'Nasr City',
  '1,000 EGP Transportation Allowance', '18–28', 18, 28, 'Graduates & Undergrads',
  'Egyptians & Foreigners with valid ID', false, 14,
  'Spoken English B2 / C1+ | No experience needed (Full training provided) | Graduates & Undergrads | Foreigners with valid ID welcome | Max age 28.',
  E'🔥 CCS is hiring Transfer / Qualification Agents (US Market)! 🇺🇸\n📍 Location: Nasr City\n💰 Package: 11K Net + 1K Transport + 3K KPIs + Unlimited Comm\n🕒 Shift: Fixed 6:00 PM – 3:00 AM (Sat & Sun Fixed Off)\n🗣 Language: Spoken English B2 / C1+ (No Experience Needed!)\n🎓 Education: Graduates & Undergrads (Egyptians & Foreigners, Max age 28)\nApply here: {{APPLY_LINK}}',
  E'🔥 CCS is hiring Transfer / Qualification Agents (US Market)! 🇺🇸\n📍 Location: Nasr City\n💰 Package: 11K Net + 1K Transport + 3K KPIs + Unlimited Comm\n🕒 Shift: Fixed 6:00 PM – 3:00 AM (Sat & Sun Fixed Off)\n🗣 Language: Spoken English B2 / C1+ (No Experience Needed!)\n🎓 Education: Graduates & Undergrads (Egyptians & Foreigners, Max age 28)\nApply here: {{APPLY_LINK}}',
  1500, 1500, 1900, 2200, 'CCS-US-TRF', 'active'
);

-- 3.2 Non-Voice Customer Support Representative (Beauty & Healthcare)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Non-Voice Customer Support (Beauty & Healthcare)', 'Contact Center Source (CCS)', 'English', 'Fluent Written English',
  '15,000 EGP Net + 3,000 EGP KPIs + Spiffs & Bonuses', 'On-site',
  '5 days/week (2 days off) | Rotational: 10:00 AM – 7:00 PM or 3:00 PM – 12:00 AM', 'Nasr City',
  'Allowance provided', '18–28', 18, 28, 'Graduates, Undergrads, Gap year, Dropouts',
  'Egyptians & Foreigners', true, 21,
  'At least 1 year Customer Service experience required | Excellent written English | Max age 28 | Graduates, Undergrads, Gap year, Dropouts welcome.',
  E'✨ CCS is hiring Non-Voice Customer Support (Beauty & Healthcare)!\n📍 Location: Nasr City\n💰 Package: 15,000 EGP Net + 3,000 EGP KPIs + Spiffs\n🕒 Shift: 5 days/week (Rotational morning/evening)\n🗣 Language: Excellent Written English\n💼 Requirement: At least 1 year CS experience | Max age 28\n🎓 Grads, Undergrads, Dropouts & Gap Year Welcome!\nApply here: {{APPLY_LINK}}',
  E'✨ CCS is hiring Non-Voice Customer Support (Beauty & Healthcare)!\n📍 Location: Nasr City\n💰 Package: 15,000 EGP Net + 3,000 EGP KPIs + Spiffs\n🕒 Shift: 5 days/week (Rotational morning/evening)\n🗣 Language: Excellent Written English\n💼 Requirement: At least 1 year CS experience | Max age 28\n🎓 Grads, Undergrads, Dropouts & Gap Year Welcome!\nApply here: {{APPLY_LINK}}',
  1700, 1700, 2100, 2400, 'CCS-NON-VOICE', 'active'
);

-- ==========================================
-- 4. CONCENTRIX (CNX)
-- ==========================================

-- 4.1 Concentrix Dutch CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Dutch Customer Service & Tech Support', 'Concentrix', 'Dutch', 'B2–C1',
  '30,000 – 45,000 EGP Gross', 'On-site / Hybrid', '9 hours/day (5 working days / 2 rotational off)',
  'Smart Village / 6th of October / Maadi / New Cairo', 'Door-to-door for females after 9:00 PM',
  '18–45', 18, 45, 'Graduates, Dropouts, Gap year', 'Egyptians & Foreigners', false, 30,
  'Dutch CS & Tech Support. Salary: 30K - 45K Gross (Basic + 35% Cost of Living Allowance). 9 hours/day, 5 days/week, rotational off. Females night door-to-door transportation provided.',
  E'🌍 Concentrix is hiring Dutch CS & Tech Support Representatives!\n📍 Locations: Smart Village, October, Maadi, New Cairo\n💰 Salary: 30,000 – 45,000 EGP Gross\n🗣 Language: Fluent Dutch (B2–C1)\n🎓 Grads, Dropouts & Gap Year Welcome (Age 18–45)\n🚌 Door-to-door transportation for females after 9:00 PM\nApply here: {{APPLY_LINK}}',
  E'🌍 Concentrix is hiring Dutch CS & Tech Support Representatives!\n📍 Locations: Smart Village, October, Maadi, New Cairo\n💰 Salary: 30,000 – 45,000 EGP Gross\n🗣 Language: Fluent Dutch (B2–C1)\n🎓 Grads, Dropouts & Gap Year Welcome (Age 18–45)\n🚌 Door-to-door transportation for females after 9:00 PM\nApply here: {{APPLY_LINK}}',
  3500, 3500, 4200, 4800, 'CNX-DUTCH', 'active'
);

-- 4.2 Concentrix German CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'German Customer Service & Tech Support', 'Concentrix', 'German', 'B2–C1',
  '25,000 – 33,000 EGP Gross', 'On-site', '9 hours/day (5 working days / 2 rotational off)',
  'Smart Village / Maadi / Sheikh Zayed / Alex / Hurghada', 'Door-to-door for females after 9:00 PM',
  '18–45', 18, 45, 'Graduates, Dropouts, Gap year', 'Egyptians & Foreigners', false, 30,
  'German CS & Tech Support. Salary: 25K - 33K Gross. 9 hours/day (including 1.25 hr break) | 5 working days / 2 rotational days off. Door-to-door transportation for females after 9:00 PM.',
  E'🇩🇪 Concentrix is hiring German CS & Tech Support!\n📍 Multiple Locations: Cairo, Giza, Alex, Hurghada\n💰 Salary: 25,000 – 33,000 EGP Gross\n🗣 Language: German B2–C1\n🎓 Graduates, Dropouts, Gap year (Age 18–45)\nApply here: {{APPLY_LINK}}',
  E'🇩🇪 Concentrix is hiring German CS & Tech Support!\n📍 Multiple Locations: Cairo, Giza, Alex, Hurghada\n💰 Salary: 25,000 – 33,000 EGP Gross\n🗣 Language: German B2–C1\n🎓 Graduates, Dropouts, Gap year (Age 18–45)\nApply here: {{APPLY_LINK}}',
  3200, 3200, 3800, 4400, 'CNX-GER', 'active'
);

-- 4.3 Concentrix Polish CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Polish Customer Service & Tech Support', 'Concentrix', 'Polish', 'B2–C1',
  '35,000 – 40,000 EGP Gross', 'On-site', '9 hours/day (5 working days / 2 off)',
  'Smart Village / Maadi / New Cairo', 'Provided',
  '18–45', 18, 45, 'Graduates & Dropouts', 'Egyptians & Foreigners', false, 30,
  'Polish CS & Tech Support. Salary: 35K - 40K Gross. Door-to-door transportation for females after 9:00 PM.',
  E'🇵🇱 Concentrix is hiring Polish Customer Service & Tech Representatives!\n📍 Cairo & Giza Hubs\n💰 Salary: 35,000 – 40,000 EGP Gross\n🗣 Language: Fluent Polish (B2–C1)\n🎓 Graduates & Dropouts welcome\nApply here: {{APPLY_LINK}}',
  E'🇵🇱 Concentrix is hiring Polish Customer Service & Tech Representatives!\n📍 Cairo & Giza Hubs\n💰 Salary: 35,000 – 40,000 EGP Gross\n🗣 Language: Fluent Polish (B2–C1)\n🎓 Graduates & Dropouts welcome\nApply here: {{APPLY_LINK}}',
  3500, 3500, 4200, 4800, 'CNX-POL', 'active'
);

-- 4.4 Concentrix French CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Customer Service & Tech Support', 'Concentrix', 'French', 'B2–C1',
  '18,000 – 25,000 EGP Gross', 'On-site', '9 hours/day (5 working days / 2 off)',
  'Smart Village / Maadi / New Cairo / Zayed', 'Door-to-door for females after 9:00 PM',
  '18–45', 18, 45, 'Graduates, Dropouts, Gap year', 'Egyptians & Foreigners', false, 30,
  'French CS & Tech Support accounts across multiple Cairo hubs. Salary: 18K - 25K Gross.',
  E'🇨🇵 Concentrix is hiring French CS & Tech Support!\n📍 Smart Village, Maadi, New Cairo, Zayed\n💰 Salary: 18,000 – 25,000 EGP Gross\n🗣 Language: Fluent French (B2–C1)\n🎓 Grads, Dropouts, Gap year (Age 18–45)\nApply here: {{APPLY_LINK}}',
  E'🇨🇵 Concentrix is hiring French CS & Tech Support!\n📍 Smart Village, Maadi, New Cairo, Zayed\n💰 Salary: 18,000 – 25,000 EGP Gross\n🗣 Language: Fluent French (B2–C1)\n🎓 Grads, Dropouts, Gap year (Age 18–45)\nApply here: {{APPLY_LINK}}',
  2200, 2200, 2600, 3000, 'CNX-FR', 'active'
);

-- 4.5 Concentrix Italian CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Italian Customer Service & Tech Support', 'Concentrix', 'Italian', 'B2–C1',
  '17,000 – 23,000 EGP Gross', 'On-site', '9 hours/day (5 working days / 2 off)',
  'Maadi / New Cairo / 6th of October', 'Provided',
  '18–45', 18, 45, 'Graduates, Dropouts, Gap year', 'Egyptians & Foreigners', false, 30,
  'Italian CS & Tech Support. Salary: 17K - 23K Gross.',
  E'🇮🇹 Concentrix is hiring Italian CS & Tech Specialists!\n📍 Maadi / New Cairo / 6th of October\n💰 Salary: 17,000 – 23,000 EGP Gross\n🗣 Language: Italian B2–C1\nApply here: {{APPLY_LINK}}',
  E'🇮🇹 Concentrix is hiring Italian CS & Tech Specialists!\n📍 Maadi / New Cairo / 6th of October\n💰 Salary: 17,000 – 23,000 EGP Gross\n🗣 Language: Italian B2–C1\nApply here: {{APPLY_LINK}}',
  2000, 2000, 2400, 2800, 'CNX-ITA', 'active'
);

-- 4.6 Concentrix Spanish CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Spanish Customer Service & Tech Support', 'Concentrix', 'Spanish', 'B2–C1',
  '17,000 – 23,000 EGP Gross', 'On-site', '9 hours/day (5 working days / 2 off)',
  'Maadi / 6th of October / New Cairo', 'Provided',
  '18–45', 18, 45, 'Graduates, Dropouts, Gap year', 'Egyptians & Foreigners', false, 30,
  'Spanish CS & Tech Support. Salary: 17K - 23K Gross.',
  E'🇪🇸 Concentrix is hiring Spanish CS & Tech Specialists!\n📍 Maadi / October / New Cairo\n💰 Salary: 17,000 – 23,000 EGP Gross\n🗣 Language: Spanish B2–C1\nApply here: {{APPLY_LINK}}',
  E'🇪🇸 Concentrix is hiring Spanish CS & Tech Specialists!\n📍 Maadi / October / New Cairo\n💰 Salary: 17,000 – 23,000 EGP Gross\n🗣 Language: Spanish B2–C1\nApply here: {{APPLY_LINK}}',
  2000, 2000, 2400, 2800, 'CNX-ES', 'active'
);

-- 4.7 Concentrix English CS / Tech
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'English Customer Service & Tech Support', 'Concentrix', 'English', 'B2–C1',
  '11,000 – 20,000 EGP Gross (up to 18,000 EGP Net)', 'On-site', '9 hours/day (5 working days / 2 off)',
  'Smart Village / Maadi / October / New Cairo / Alex / Hurghada', 'Provided across Cairo, Giza & Alex',
  '18–45', 18, 45, 'Graduates, Dropouts, Gap year', 'Egyptians & Foreigners', false, 30,
  'English CS & Tech Support. Salary: 11K - 20K Gross (up to 18K Net). Door-to-door transportation for females after 9:00 PM.',
  E'🇬🇧 Concentrix is hiring English Customer Service & Tech Agents!\n📍 Multiple Hubs: Cairo, Giza, Alex, Hurghada\n💰 Salary: 11,000 – 20,000 EGP Gross (up to 18,000 Net)\n🗣 Language: English B2–C1\n🎓 Graduates, Dropouts, Gap year (Age 18–45)\nApply here: {{APPLY_LINK}}',
  E'🇬🇧 Concentrix is hiring English Customer Service & Tech Agents!\n📍 Multiple Hubs: Cairo, Giza, Alex, Hurghada\n💰 Salary: 11,000 – 20,000 EGP Gross (up to 18,000 Net)\n🗣 Language: English B2–C1\n🎓 Graduates, Dropouts, Gap year (Age 18–45)\nApply here: {{APPLY_LINK}}',
  1800, 1800, 2200, 2500, 'CNX-EN', 'active'
);

-- ==========================================
-- 5. ENABLE
-- ==========================================

-- 5.1 Enable Dutch Monolingual
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Dutch Monolingual Customer Support', 'Enable', 'Dutch', 'B2–C1',
  '62,000 EGP Gross', 'On-site', 'Rotational 8-hr shifts (9:00 AM – 9:00 PM)', 'Smart Village',
  'Provided across Cairo & Giza', '18–45', 18, 45, 'Graduates & Undergrads', 'Egyptians only', true,
  30, 'Fluent Dutch (B2–C1), Grads & Undergrads, Egyptians only, Customer Service experience required. In-Source Full-Time.',
  E'🇳🇱 ENABLE is hiring Dutch Monolingual Customer Support!\n📍 Location: Smart Village (Full-Time In-Source)\n💰 Salary: 62,000 EGP Gross\n🕒 Shift: Rotational 8-hr shifts (9 AM – 9 PM)\n🗣 Language: Fluent Dutch (B2–C1)\n🎓 Grads & Undergrads (Egyptians only, CS Exp Req)\nApply here: {{APPLY_LINK}}',
  E'🇳🇱 ENABLE is hiring Dutch Monolingual Customer Support!\n📍 Location: Smart Village (Full-Time In-Source)\n💰 Salary: 62,000 EGP Gross\n🕒 Shift: Rotational 8-hr shifts (9 AM – 9 PM)\n🗣 Language: Fluent Dutch (B2–C1)\n🎓 Grads & Undergrads (Egyptians only, CS Exp Req)\nApply here: {{APPLY_LINK}}',
  4500, 4500, 5200, 6000, 'ENB-NL', 'active'
);

-- 5.2 Enable French Monolingual
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Monolingual Customer Support', 'Enable', 'French', 'B2–C1',
  '31,500 EGP / Monthly', 'On-site', 'Fixed morning shift (10:00 AM – 7:00 PM)', 'Smart Village',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians only', true,
  30, 'Fluent French (B2–C1), Grads & Egyptians only, Customer Service experience required. Fixed morning shift.',
  E'🇨🇵 ENABLE is hiring French Monolingual Customer Support!\n📍 Location: Smart Village\n💰 Salary: 31,500 EGP / Monthly\n🕒 Shift: Fixed Morning (10:00 AM – 7:00 PM)\n🗣 Language: Fluent French (B2–C1)\n🎓 Graduates Only (Egyptians only, CS Exp Req)\nApply here: {{APPLY_LINK}}',
  E'🇨🇵 ENABLE is hiring French Monolingual Customer Support!\n📍 Location: Smart Village\n💰 Salary: 31,500 EGP / Monthly\n🕒 Shift: Fixed Morning (10:00 AM – 7:00 PM)\n🗣 Language: Fluent French (B2–C1)\n🎓 Graduates Only (Egyptians only, CS Exp Req)\nApply here: {{APPLY_LINK}}',
  3000, 3000, 3600, 4200, 'ENB-FR', 'active'
);

-- 5.3 Enable German Monolingual
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'German Monolingual Customer Support', 'Enable', 'German', 'B2–C1',
  '39,200 EGP / Monthly', 'On-site', 'Fixed morning shift (10:00 AM – 7:00 PM)', 'Smart Village',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians only', true,
  30, 'Fluent German (B2–C1), Grads & Egyptians only, CS experience required. Fixed morning shift.',
  E'🇩🇪 ENABLE is hiring German Monolingual Customer Support!\n📍 Location: Smart Village\n💰 Salary: 39,200 EGP / Monthly\n🕒 Shift: Fixed Morning (10:00 AM – 7:00 PM)\n🗣 Language: Fluent German (B2–C1)\n🎓 Graduates Only (Egyptians only, CS Exp Req)\nApply here: {{APPLY_LINK}}',
  E'🇩🇪 ENABLE is hiring German Monolingual Customer Support!\n📍 Location: Smart Village\n💰 Salary: 39,200 EGP / Monthly\n🕒 Shift: Fixed Morning (10:00 AM – 7:00 PM)\n🗣 Language: Fluent German (B2–C1)\n🎓 Graduates Only (Egyptians only, CS Exp Req)\nApply here: {{APPLY_LINK}}',
  3800, 3800, 4500, 5000, 'ENB-DE', 'active'
);

-- 5.4 Enable Portuguese Monolingual
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Portuguese Monolingual Customer Support', 'Enable', 'Portuguese', 'B2–C1',
  'Up to 42,000 EGP Gross', 'On-site', 'Rotational shifts', 'Smart Village',
  'Provided', '18–45', 18, 45, 'Graduates & Undergrads', 'Egyptians & Foreigners', true,
  30, 'Fluent Portuguese (B2–C1), Grads & Undergrads, Min 20 WPM typing, CS experience required.',
  E'🇵🇹 ENABLE is hiring Portuguese Monolingual Support!\n📍 Location: Smart Village\n💰 Salary: Up to 42,000 EGP Gross\n🗣 Language: Fluent Portuguese (B2–C1)\n🎓 Grads & Undergrads (CS Exp & Min 20 WPM Typing)\nApply here: {{APPLY_LINK}}',
  E'🇵🇹 ENABLE is hiring Portuguese Monolingual Support!\n📍 Location: Smart Village\n💰 Salary: Up to 42,000 EGP Gross\n🗣 Language: Fluent Portuguese (B2–C1)\n🎓 Grads & Undergrads (CS Exp & Min 20 WPM Typing)\nApply here: {{APPLY_LINK}}',
  3800, 3800, 4500, 5000, 'ENB-PT', 'active'
);

-- 5.5 Enable Spanish Monolingual
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Spanish Monolingual Customer Support', 'Enable', 'Spanish', 'B2–C1',
  'Up to 38,000 EGP Gross', 'On-site', 'Rotational shifts', 'Smart Village',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians & Foreigners', true,
  30, 'Fluent Spanish (B2–C1), Grads only, CS experience required. Rotational shifts.',
  E'🇪🇸 ENABLE is hiring Spanish Monolingual Customer Support!\n📍 Location: Smart Village\n💰 Salary: Up to 38,000 EGP Gross\n🗣 Language: Fluent Spanish (B2–C1)\n🎓 Graduates only (CS Exp Req)\nApply here: {{APPLY_LINK}}',
  E'🇪🇸 ENABLE is hiring Spanish Monolingual Customer Support!\n📍 Location: Smart Village\n💰 Salary: Up to 38,000 EGP Gross\n🗣 Language: Fluent Spanish (B2–C1)\n🎓 Graduates only (CS Exp Req)\nApply here: {{APPLY_LINK}}',
  3500, 3500, 4200, 4800, 'ENB-ES', 'active'
);

-- ==========================================
-- 6. EVOLVE MARKETING LLC
-- ==========================================

-- 6.1 PAS Patient Assistance Survey / Telesales Agent
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'PAS Patient Assistance Survey / Telesales Agent', 'Evolve Marketing LLC', 'English', 'B2+ / C1',
  '10,000 EGP Net (8.5K Basic + 1.5K KPIs) + 2.2K–10K Comm + Daily Spiffs', 'On-site',
  'Fixed 4:00 PM – 12:00 AM (Mon to Fri; Fixed Sat & Sun Off)', 'Heliopolis, Cairo',
  'Night drop-off transportation for female employees', '18–29', 18, 29,
  'Graduates, Undergrads, Gap year, Dropouts', 'Egyptians & Foreigners', true, 14,
  'English B2+ / C1 | 1 year sales/telemarketing experience required | Max age 29 | Graduates, Undergrads, Gap year, Dropouts | Night drop-off transportation for female employees.',
  E'📞 EVOLVE MARKETING is hiring PAS Survey & Telesales Agents!\n📍 Location: Heliopolis, Cairo\n💰 Package: 10K Net (8.5K Basic + 1.5K KPIs) + 2.2K–10K Comm + Daily Spiffs\n🕒 Shift: Fixed 4:00 PM – 12:00 AM (Mon–Fri, Sat & Sun Fixed Off)\n🗣 Language: English B2+ / C1\n💼 Requirement: 1 year sales/telemarketing experience | Age up to 29\n🚌 Night drop-off for females\nApply here: {{APPLY_LINK}}',
  E'📞 EVOLVE MARKETING is hiring PAS Survey & Telesales Agents!\n📍 Location: Heliopolis, Cairo\n💰 Package: 10K Net (8.5K Basic + 1.5K KPIs) + 2.2K–10K Comm + Daily Spiffs\n🕒 Shift: Fixed 4:00 PM – 12:00 AM (Mon–Fri, Sat & Sun Fixed Off)\n🗣 Language: English B2+ / C1\n💼 Requirement: 1 year sales/telemarketing experience | Age up to 29\n🚌 Night drop-off for females\nApply here: {{APPLY_LINK}}',
  1500, 1500, 1900, 2200, 'EVL-PAS', 'active'
);

-- ==========================================
-- 7. MINISTER FITNESS PHARMA
-- ==========================================

-- 7.1 Sales Agent (Females Only)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Sales Agent (Females Only)', 'Minister Fitness Pharma', 'Arabic', 'Arabic Native (English B1 preferred)',
  '7,000 – 10,000 EGP + Attractive Monthly Commission & Incentives', 'On-site',
  'Fixed Morning Shift: 10:00 AM – 6:00 PM (6 days/week, Friday Off)', 'New Cairo (1st Settlement)',
  'None', '18–35', 18, 35, 'Graduates only', 'Egyptians only', true, 21,
  'Female candidates ONLY | Minimum 1 year Sales experience required | Arabic account (English B1 preferred) | Graduate | Max age 35.',
  E'🌸 MINISTER FITNESS PHARMA is hiring Sales Agents (Females Only)!\n📍 Location: New Cairo (1st Settlement)\n💰 Salary: 7,000 – 10,000 EGP + Attractive Monthly Commission\n🕒 Shift: Fixed Morning 10:00 AM – 6:00 PM (Friday Off)\n🗣 Language: Arabic Native (English B1 preferred)\n💼 Requirement: Minimum 1 year Sales experience | Females ONLY\nApply here: {{APPLY_LINK}}',
  E'🌸 MINISTER FITNESS PHARMA is hiring Sales Agents (Females Only)!\n📍 Location: New Cairo (1st Settlement)\n💰 Salary: 7,000 – 10,000 EGP + Attractive Monthly Commission\n🕒 Shift: Fixed Morning 10:00 AM – 6:00 PM (Friday Off)\n🗣 Language: Arabic Native (English B1 preferred)\n💼 Requirement: Minimum 1 year Sales experience | Females ONLY\nApply here: {{APPLY_LINK}}',
  1200, 1200, 1600, 1900, 'MFP-SALES-F', 'active'
);

-- 7.2 Sales Manager
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Sales Manager', 'Minister Fitness Pharma', 'Arabic', 'Arabic Native & English B2',
  'Up to 12,000 EGP / Monthly', 'On-site', 'Fixed Day Shift', 'New Cairo (1st Settlement)',
  'None', '25–35', 25, 35, 'Graduates only', 'Egyptians only', true, 30,
  'Minimum 1 year experience as Sales Manager | Both genders | Graduate | Max age 35.',
  E'👔 MINISTER FITNESS PHARMA is hiring a Sales Manager!\n📍 Location: New Cairo (1st Settlement)\n💰 Salary: Up to 12,000 EGP / Monthly\n💼 Requirement: Minimum 1 year experience as Sales Manager | Both genders\nApply here: {{APPLY_LINK}}',
  E'👔 MINISTER FITNESS PHARMA is hiring a Sales Manager!\n📍 Location: New Cairo (1st Settlement)\n💰 Salary: Up to 12,000 EGP / Monthly\n💼 Requirement: Minimum 1 year experience as Sales Manager | Both genders\nApply here: {{APPLY_LINK}}',
  1800, 1800, 2200, 2500, 'MFP-MGR', 'active'
);

-- ==========================================
-- 8. GEEKYCX
-- ==========================================

-- 8.1 Customer Service Representative (Bilingual English & Spanish)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Bilingual English & Spanish Customer Service', 'GeekyCX', 'Spanish', 'English C1 & Spanish C1',
  '26,000 – 30,000 EGP Net / Monthly', 'On-site', 'Rotational 9-hour shifts', 'Sheikh Zayed',
  'Provided', '18–40', 18, 40, 'Graduates & Undergrads', 'Egyptians & Foreigners', false, 30,
  'English C1 & Spanish C1 | Clear phone communication skills. On-site in Sheikh Zayed.',
  E'🌎 GEEKYCX is hiring Bilingual English & Spanish CS Representatives!\n📍 Location: Sheikh Zayed (On-site)\n💰 Salary: 26,000 – 30,000 EGP Net\n🗣 Language: English C1 & Spanish C1\n🎯 Clear phone communication skills\nApply here: {{APPLY_LINK}}',
  E'🌎 GEEKYCX is hiring Bilingual English & Spanish CS Representatives!\n📍 Location: Sheikh Zayed (On-site)\n💰 Salary: 26,000 – 30,000 EGP Net\n🗣 Language: English C1 & Spanish C1\n🎯 Clear phone communication skills\nApply here: {{APPLY_LINK}}',
  2800, 2800, 3400, 3900, 'GKX-ES-EN', 'active'
);

-- 8.2 Debt Relief Sales Specialist
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Debt Relief Sales Specialist', 'GeekyCX', 'English', 'B2+ / C1',
  '15,000 – 20,000 EGP Basic + 2,000 Transport + Commissions ($25–$50/deal)', 'On-site',
  'Fixed US Shift', 'Sheikh Zayed', '2,000 EGP Transportation Allowance',
  '18–35', 18, 35, 'Graduates & Undergrads', 'Egyptians only', false, 21,
  'Standard Offer: 15,000 EGP Basic + 2,000 EGP Transport + Commissions ($25 to $50 per deal). Exp. Offer (with Debt Relief Exp.): 20,000 EGP Basic + Transport + Commissions ($25–$50/deal).',
  E'💼 GEEKYCX is hiring Debt Relief Sales Specialists!\n📍 Location: Sheikh Zayed (On-site)\n💰 Package: 15K–20K Basic + 2K Transport + Commissions ($25 to $50/deal)\n🗣 Language: English B2+/C1\nApply here: {{APPLY_LINK}}',
  E'💼 GEEKYCX is hiring Debt Relief Sales Specialists!\n📍 Location: Sheikh Zayed (On-site)\n💰 Package: 15K–20K Basic + 2K Transport + Commissions ($25 to $50/deal)\n🗣 Language: English B2+/C1\nApply here: {{APPLY_LINK}}',
  2200, 2200, 2600, 3000, 'GKX-DEBT', 'active'
);

-- ==========================================
-- 9. INNOVIA SPANISH
-- ==========================================

-- 9.1 Spanish/English Bilingual On-Call Coordinator (Home Care Agency)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Bilingual Spanish/English On-Call Coordinator', 'Innovia Spanish', 'Spanish', 'B2+ English & Spanish',
  '32,200 EGP Net (26K Basic + 2K KPIs + 2.2K Transport + 6K Quarterly Bonus)', 'On-site',
  'Fixed 4:00 PM – 12:00 AM', 'Maadi', '2,200 EGP Transport Allowance',
  '18–40', 18, 40, 'Graduates & Undergrads', 'Egyptians & Foreigners', false, 30,
  'Minimum B2+ level in both English and Spanish | Graduates & Undergrads | Medical and social insurance provided. Home Care Agency coordination.',
  E'🏥 INNOVIA is hiring Bilingual Spanish/English On-Call Coordinators!\n📍 Location: Maadi\n💰 Salary: 32,200 EGP Net (26K Basic + 2K KPIs + 2.2K Transport + 6K Quarterly Bonus)\n🕒 Shift: Fixed 4:00 PM – 12:00 AM\n🗣 Language: Minimum B2+ in both English & Spanish\n🎓 Grads & Undergrads Welcome (Medical & Social Insurance)\nApply here: {{APPLY_LINK}}',
  E'🏥 INNOVIA is hiring Bilingual Spanish/English On-Call Coordinators!\n📍 Location: Maadi\n💰 Salary: 32,200 EGP Net (26K Basic + 2K KPIs + 2.2K Transport + 6K Quarterly Bonus)\n🕒 Shift: Fixed 4:00 PM – 12:00 AM\n🗣 Language: Minimum B2+ in both English & Spanish\n🎓 Grads & Undergrads Welcome (Medical & Social Insurance)\nApply here: {{APPLY_LINK}}',
  3200, 3200, 3800, 4400, 'INV-SP-COORD', 'active'
);

-- ==========================================
-- 10. LPM
-- ==========================================

-- 10.1 Sales Agent (US Telesales Account)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Sales Agent (US Telesales Account)', 'LPM', 'English', 'B2+',
  '20,000 EGP Net + Uncapped Commission (starts 6K) + Daily & Weekly Bonuses', 'On-site',
  'Fixed 3:15 PM – 12:30 AM (Fixed Sat & Sun Off)', '6th of October City',
  'Return Drop-off (Door-to-door for girls / Drop-off points for guys)', '17–30', 17, 30,
  'Graduates, Undergrads, Dropouts, Gap year', 'Egyptians only', false, 14,
  'English B2+ | Grads, Undergrads, Dropouts, Gap year | Egyptians only | Age 17–30 | Door-to-door transportation for females, drop-off points for males.',
  E'🔥 LPM is hiring Telesales Agents (US Account)!\n📍 Location: 6th of October City\n💰 Salary: 20,000 EGP Net + Uncapped Commission (starts 6K) + Bonuses\n🕒 Shift: Fixed 3:15 PM – 12:30 AM (Fixed Sat & Sun Off)\n🗣 Language: English B2+\n🎓 Grads, Undergrads, Dropouts, Gap Year (Age 17–30)\n🚌 Door-to-door for females, points for males\nApply here: {{APPLY_LINK}}',
  E'🔥 LPM is hiring Telesales Agents (US Account)!\n📍 Location: 6th of October City\n💰 Salary: 20,000 EGP Net + Uncapped Commission (starts 6K) + Bonuses\n🕒 Shift: Fixed 3:15 PM – 12:30 AM (Fixed Sat & Sun Off)\n🗣 Language: English B2+\n🎓 Grads, Undergrads, Dropouts, Gap Year (Age 17–30)\n🚌 Door-to-door for females, points for males\nApply here: {{APPLY_LINK}}',
  2200, 2200, 2600, 3000, 'LPM-TS-OCT', 'active'
);

-- ==========================================
-- 11. LONG TERM SOLUTIONS (LTS)
-- ==========================================

-- 11.1 Hotel Surveys (Outbound)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Hotel Surveys Outbound Representative', 'Long Term Solutions (LTS)', 'English', 'B2+',
  '12,000 EGP Base + 2,000 KPIs (Increases to 15K + 12K Bonus after 3 mo) + Comm', 'On-site',
  'Fixed Shift (Mon–Fri)', 'Sheraton El-Matar', 'Provided / Allowance',
  '18–35', 18, 35, 'Graduates & Undergrads', 'Egyptians only', false, 21,
  'English B2+ | Graduates & Undergrads | Egyptians only | Age 18–35. Increases to 15,000 EGP after 3-month probation + 12,000 EGP bonus + Commissions up to 30 EGP per transfer.',
  E'🏨 LTS is hiring Hotel Surveys Outbound Representatives!\n📍 Location: Sheraton El-Matar\n💰 Salary: 12K Base + 2K KPIs (Increases to 15K + 12K Bonus after 3 mo) + Comm\n🗣 Language: English B2+\n🎓 Grads & Undergrads (Egyptians only, Age 18–35)\nApply here: {{APPLY_LINK}}',
  E'🏨 LTS is hiring Hotel Surveys Outbound Representatives!\n📍 Location: Sheraton El-Matar\n💰 Salary: 12K Base + 2K KPIs (Increases to 15K + 12K Bonus after 3 mo) + Comm\n🗣 Language: English B2+\n🎓 Grads & Undergrads (Egyptians only, Age 18–35)\nApply here: {{APPLY_LINK}}',
  1500, 1500, 1900, 2200, 'LTS-HTL', 'active'
);

-- 11.2 Inbound Vacation Packages (Holiday Inn Club Vacations)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Inbound Vacation Packages Sales Agent (Holiday Inn)', 'Long Term Solutions (LTS)', 'English', 'Fluent English C1',
  '16,000 – 22,000 EGP Net + Uncapped Commissions', 'On-site', 'Fixed / Rotational', 'Sheraton El-Matar',
  'Provided', '18–35', 18, 35, 'Graduates & Undergrads', 'Egyptians only', true, 30,
  'Fluent English C1 | Prior inbound sales/vacation package experience required. Holiday Inn Club Vacations account.',
  E'🌴 LTS is hiring Inbound Vacation Packages Sales Agents (Holiday Inn)!\n📍 Location: Sheraton El-Matar\n💰 Salary: 16,000 – 22,000 EGP Net + Uncapped Commissions\n🗣 Language: Fluent English C1\n💼 Requirement: Prior inbound sales/vacation package experience\nApply here: {{APPLY_LINK}}',
  E'🌴 LTS is hiring Inbound Vacation Packages Sales Agents (Holiday Inn)!\n📍 Location: Sheraton El-Matar\n💰 Salary: 16,000 – 22,000 EGP Net + Uncapped Commissions\n🗣 Language: Fluent English C1\n💼 Requirement: Prior inbound sales/vacation package experience\nApply here: {{APPLY_LINK}}',
  2000, 2000, 2400, 2800, 'LTS-VAC', 'active'
);

-- ==========================================
-- 12. LEADBULL
-- ==========================================

-- 12.1 Canadian Telesales Account
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent (Canadian Account)', 'LeadBull', 'English', 'B2+',
  '15,000 EGP Net Basic + 2,500 – 5,000 EGP KPIs + Spiffs & Profit Share', 'On-site / Hybrid',
  'Fixed US Shift: 3:00/4:00 PM – 12:00/1:00 AM', 'Zahraa El Maadi',
  'Allowance provided', '18–35', 18, 35, 'Graduates & Dropouts', 'Egyptians & Foreigners', false, 21,
  'Spoken English B2+ | Graduates & Dropouts | Max age 35 | Own PC/Laptop with headset required. WFH option available after 3 months.',
  E'🍁 LEADBULL is hiring Telesales Agents (Canadian Account)!\n📍 Location: Zahraa El Maadi (WFH option after 3 months)\n💰 Package: 15K Net Basic + 2.5K–5K KPIs + Spiffs + Profit Share\n🕒 Shift: Fixed 3:00/4:00 PM – 12:00/1:00 AM\n🗣 Language: English B2+\n💻 Requirement: Own PC/Laptop with headset\nApply here: {{APPLY_LINK}}',
  E'🍁 LEADBULL is hiring Telesales Agents (Canadian Account)!\n📍 Location: Zahraa El Maadi (WFH option after 3 months)\n💰 Package: 15K Net Basic + 2.5K–5K KPIs + Spiffs + Profit Share\n🕒 Shift: Fixed 3:00/4:00 PM – 12:00/1:00 AM\n🗣 Language: English B2+\n💻 Requirement: Own PC/Laptop with headset\nApply here: {{APPLY_LINK}}',
  1800, 1800, 2200, 2500, 'LDB-CA-TS', 'active'
);

-- ==========================================
-- 13. O4U & DIAL EXPERT
-- ==========================================

-- 13.1 Dial Expert (Hybrid)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Customer Support Representative (Hybrid)', 'Dial Expert', 'English', 'English C1',
  '14,000 – 18,000 EGP (Full-time 9h) / Pro-rated (Part-time 6h)', 'Hybrid',
  'Full-time (9 hrs) / Part-time (6 hrs)', 'Cairo / Hybrid', 'Allowance',
  '18–35', 18, 35, 'Graduates & Undergrads', 'Egyptians & Foreigners', false, 21,
  'English C1 | No experience required | Full-time (9 hrs) / Part-time (6 hrs) options.',
  E'🎧 DIAL EXPERT is hiring Customer Support Agents (Hybrid)!\n📍 Location: Cairo / Hybrid\n💰 Salary: 14,000 – 18,000 EGP (Full-time 9h) / Part-time 6h\n🗣 Language: English C1 (No Experience Required!)\nApply here: {{APPLY_LINK}}',
  E'🎧 DIAL EXPERT is hiring Customer Support Agents (Hybrid)!\n📍 Location: Cairo / Hybrid\n💰 Salary: 14,000 – 18,000 EGP (Full-time 9h) / Part-time 6h\n🗣 Language: English C1 (No Experience Required!)\nApply here: {{APPLY_LINK}}',
  1600, 1600, 2000, 2300, 'DLX-HYB', 'active'
);

-- 13.2 O4U Telesales (UK Account)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent (UK Account)', 'O4U', 'English', 'B2+',
  'Up to 16,000 EGP Package + Unlimited Commission up to 6,000 EGP', 'On-site',
  'Fixed Mon–Thu (12:15 PM – 8:30 PM), Fri (11:00 AM – 8:30 PM) | Sat & Sun Off', 'Maadi',
  'Provided', '16–38', 16, 38, 'Grads, Undergrads, Dropouts, Gap year',
  'Egyptians & Foreigners', false, 21,
  'English B2+ | Grads, Undergrads, Dropouts, Gap year | Age 16–38. Fixed UK shifts with weekends off.',
  E'🇬🇧 O4U is hiring Telesales Agents (UK Account)!\n📍 Location: Maadi\n💰 Package: Up to 16,000 EGP + Unlimited Commission (up to 6K)\n🕒 Shift: Mon–Thu (12:15 PM – 8:30 PM), Fri (11:00 AM – 8:30 PM) | Sat & Sun OFF\n🗣 Language: English B2+\n🎓 Grads, Undergrads, Dropouts, Gap Year (Age 16–38)\nApply here: {{APPLY_LINK}}',
  E'🇬🇧 O4U is hiring Telesales Agents (UK Account)!\n📍 Location: Maadi\n💰 Package: Up to 16,000 EGP + Unlimited Commission (up to 6K)\n🕒 Shift: Mon–Thu (12:15 PM – 8:30 PM), Fri (11:00 AM – 8:30 PM) | Sat & Sun OFF\n🗣 Language: English B2+\n🎓 Grads, Undergrads, Dropouts, Gap Year (Age 16–38)\nApply here: {{APPLY_LINK}}',
  1700, 1700, 2100, 2400, 'O4U-UK-TS', 'active'
);

-- 13.3 O4U HR Generalist
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'HR Generalist', 'O4U', 'English', 'B2 / C1',
  '12,000 – 20,000 EGP (based on experience)', 'On-site', 'Fixed Day Shift', 'Maadi',
  'None', '25–40', 25, 40, 'Graduates only', 'Egyptians only', true, 30,
  'English B2/C1 | Previous HR experience required | Minimum age 25.',
  E'📋 O4U is hiring an HR Generalist!\n📍 Location: Maadi\n💰 Salary: 12,000 – 20,000 EGP (based on experience)\n🗣 Language: English B2/C1\n💼 Requirement: Previous HR experience | Min age 25\nApply here: {{APPLY_LINK}}',
  E'📋 O4U is hiring an HR Generalist!\n📍 Location: Maadi\n💰 Salary: 12,000 – 20,000 EGP (based on experience)\n🗣 Language: English B2/C1\n💼 Requirement: Previous HR experience | Min age 25\nApply here: {{APPLY_LINK}}',
  1800, 1800, 2200, 2500, 'O4U-HR', 'active'
);

-- 13.4 O4U Sales Team Leader
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Sales Team Leader', 'O4U', 'English', 'B2–C1',
  '15,000 – 27,000 EGP + Attractive Commissions', 'On-site', 'Fixed Day / Afternoon', 'Maadi',
  'Provided', '25–38', 25, 38, 'Graduates only', 'Egyptians only', true, 30,
  'Minimum 2 years Sales experience + leadership experience | English B2–C1 | Graduates only | Age 25–38.',
  E'🚀 O4U is hiring a Sales Team Leader!\n📍 Location: Maadi\n💰 Salary: 15,000 – 27,000 EGP + Attractive Commissions\n🗣 Language: English B2–C1\n💼 Requirement: Min 2 years Sales exp + leadership exp | Age 25–38\nApply here: {{APPLY_LINK}}',
  E'🚀 O4U is hiring a Sales Team Leader!\n📍 Location: Maadi\n💰 Salary: 15,000 – 27,000 EGP + Attractive Commissions\n🗣 Language: English B2–C1\n💼 Requirement: Min 2 years Sales exp + leadership exp | Age 25–38\nApply here: {{APPLY_LINK}}',
  2500, 2500, 3000, 3500, 'O4U-STL', 'active'
);

-- ==========================================
-- 14. TELEPERFORMANCE (TP)
-- ==========================================

-- 14.1 TP English Customer Service Account
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'English Customer Service Representative', 'Teleperformance', 'English', 'B2+',
  'Up to 18,000 EGP (80% Basic + 20% KPIs)', 'On-site',
  'Rotational 9-hour shifts (Females last shift 2:00–3:00 AM)', 'New Cairo',
  'Transportation provided across Cairo & Giza', '18–45', 18, 45, 'Graduates only', 'Egyptians only', false, 30,
  'English B2+ | Graduates only | Max age 45 | Transportation provided across Cairo & Giza.',
  E'🌟 TELEPERFORMANCE is hiring English Customer Service Representatives!\n📍 Location: New Cairo\n💰 Salary: Up to 18,000 EGP (80% Basic + 20% KPIs)\n🗣 Language: English B2+\n🎓 Graduates only (Max age 45)\n🚌 Door-to-door transportation provided across Cairo & Giza\nApply here: {{APPLY_LINK}}',
  E'🌟 TELEPERFORMANCE is hiring English Customer Service Representatives!\n📍 Location: New Cairo\n💰 Salary: Up to 18,000 EGP (80% Basic + 20% KPIs)\n🗣 Language: English B2+\n🎓 Graduates only (Max age 45)\n🚌 Door-to-door transportation provided across Cairo & Giza\nApply here: {{APPLY_LINK}}',
  2000, 2000, 2400, 2800, 'TP-EN-NC', 'active'
);

-- 14.2 TP Customer Support Portuguese Account (Email & Chat)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Portuguese Customer Support (Email & Chat)', 'Teleperformance', 'Portuguese', 'Portuguese C1 & English B1+',
  'Up to 26,800 EGP Net / Monthly', 'On-site', 'Rotational 9 hours', 'One Kattameya / Plaza',
  'Provided across Cairo & Giza', '18–40', 18, 40, 'Graduates only', 'Egyptians & Foreigners', false, 30,
  'Portuguese proficiency + English B1+ | Non-voice (Email & Chat) | Graduates | Max age 40.',
  E'🇵🇹 TELEPERFORMANCE is hiring Portuguese Customer Support (Chat & Email)!\n📍 Location: One Kattameya / Plaza\n💰 Salary: Up to 26,800 EGP Net / Monthly\n🗣 Language: Portuguese proficiency + English B1+\n🎓 Graduates only (Max age 40)\n🚌 Transportation provided\nApply here: {{APPLY_LINK}}',
  E'🇵🇹 TELEPERFORMANCE is hiring Portuguese Customer Support (Chat & Email)!\n📍 Location: One Kattameya / Plaza\n💰 Salary: Up to 26,800 EGP Net / Monthly\n🗣 Language: Portuguese proficiency + English B1+\n🎓 Graduates only (Max age 40)\n🚌 Transportation provided\nApply here: {{APPLY_LINK}}',
  2800, 2800, 3400, 3900, 'TP-PT-CHAT', 'active'
);

-- 14.3 TP French Travel Account
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Travel Advisor', 'Teleperformance', 'French', 'French B1 & English B1+/B2',
  '28,625 EGP Gross / Monthly', 'On-site',
  'Rotational (3:00 PM – 4:00 AM males / max 2:00 AM females)', 'One Kattameya',
  'Provided across Cairo & Giza', '18–40', 18, 40, 'Graduates only', 'Egyptians only', false, 30,
  'French B1 & English B1+/B2 | Graduates only | Rotational shifts (3:00 PM – 4:00 AM males / max 2:00 AM females).',
  E'🇨🇵 TELEPERFORMANCE is hiring French Travel Advisors!\n📍 Location: One Kattameya\n💰 Salary: 28,625 EGP Gross / Monthly\n🗣 Language: French B1 & English B1+/B2\n🎓 Graduates only (Max age 40)\nApply here: {{APPLY_LINK}}',
  E'🇨🇵 TELEPERFORMANCE is hiring French Travel Advisors!\n📍 Location: One Kattameya\n💰 Salary: 28,625 EGP Gross / Monthly\n🗣 Language: French B1 & English B1+/B2\n🎓 Graduates only (Max age 40)\nApply here: {{APPLY_LINK}}',
  2800, 2800, 3400, 3900, 'TP-FR-TRV', 'active'
);

-- 14.4 TP French Customer Service & Technical Support
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Customer Service & Technical Support', 'Teleperformance', 'French', 'French B2 & English B1',
  'Up to 31,975 EGP Net / Monthly', 'On-site', 'Rotational Voice & Non-Voice', 'One Kattameya / City Walk',
  'Provided across Cairo & Giza', '18–40', 18, 40, 'Graduates only', 'Egyptians only', false, 30,
  'French B2 & English B1 | Voice & Non-Voice options | Graduates | Max age 40.',
  E'🇨🇵 TELEPERFORMANCE is hiring French CS & Tech Support!\n📍 Location: One Kattameya / City Walk\n💰 Salary: Up to 31,975 EGP Net / Monthly\n🗣 Language: French B2 & English B1 (Voice & Non-Voice)\n🎓 Graduates only (Max age 40)\nApply here: {{APPLY_LINK}}',
  E'🇨🇵 TELEPERFORMANCE is hiring French CS & Tech Support!\n📍 Location: One Kattameya / City Walk\n💰 Salary: Up to 31,975 EGP Net / Monthly\n🗣 Language: French B2 & English B1 (Voice & Non-Voice)\n🎓 Graduates only (Max age 40)\nApply here: {{APPLY_LINK}}',
  3000, 3000, 3600, 4200, 'TP-FR-CS', 'active'
);

-- 14.5 TP French Sales Account (Dubai & Sharm El Sheikh)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Sales Account (Dubai & Sharm El Sheikh)', 'Teleperformance', 'French', 'French B1+/B2',
  '28,000 – 34,000 EGP Gross + Commission', 'On-site', 'Rotational shifts', 'Katameya',
  'Provided across Cairo & Giza', '18–38', 18, 38, 'Graduates only', 'Egyptians only', true, 30,
  'French B1+/B2 | Sales experience & Dubai culture awareness preferred | Max age 38.',
  E'✨ TELEPERFORMANCE is hiring French Sales Specialists (Dubai & Sharm Account)!\n📍 Location: Katameya\n💰 Salary: 28,000 – 34,000 EGP Gross + Attractive Commissions\n🗣 Language: French B1+/B2\n💼 Sales experience & Dubai culture awareness preferred\nApply here: {{APPLY_LINK}}',
  E'✨ TELEPERFORMANCE is hiring French Sales Specialists (Dubai & Sharm Account)!\n📍 Location: Katameya\n💰 Salary: 28,000 – 34,000 EGP Gross + Attractive Commissions\n🗣 Language: French B1+/B2\n💼 Sales experience & Dubai culture awareness preferred\nApply here: {{APPLY_LINK}}',
  3000, 3000, 3600, 4200, 'TP-FR-SLS', 'active'
);

-- ==========================================
-- 15. TTC (The Telecommunication Company)
-- ==========================================

-- 15.1 TTC Telesales Agents (US Accounts)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent (US Account)', 'TTC', 'English', 'B2+ / C1',
  '12,000 EGP Net + Unlimited Commissions + KPIs + Bonuses', 'On-site',
  'Fixed: 3:00 PM – 11:00 PM (7 Working Hours + 1 hr break) | Sat & Sun Fixed Off', 'Makram Ebid, Nasr City',
  'Provided (back-way)', '18–28', 18, 28, 'Graduates & Undergrads', 'Egyptians only', false, 14,
  'Spoken English B2+ / C1 | No experience needed | Graduates & Undergrads | Egyptians only | Age 18–28 | Transportation provided (back-way).',
  E'🔥 TTC is hiring Telesales Agents (US Accounts)! 🇺🇸\n📍 Location: Makram Ebid, Nasr City\n💰 Package: 12,000 EGP Net + Unlimited Commissions + KPIs + Bonuses\n🕒 Shift: Fixed 3:00 PM – 11:00 PM (Sat & Sun Fixed Off)\n🗣 Language: English B2+/C1 (No Exp Needed!)\n🎓 Grads & Undergrads (Egyptians only, Age 18–28)\n🚌 Transportation provided back-way\nApply here: {{APPLY_LINK}}',
  E'🔥 TTC is hiring Telesales Agents (US Accounts)! 🇺🇸\n📍 Location: Makram Ebid, Nasr City\n💰 Package: 12,000 EGP Net + Unlimited Commissions + KPIs + Bonuses\n🕒 Shift: Fixed 3:00 PM – 11:00 PM (Sat & Sun Fixed Off)\n🗣 Language: English B2+/C1 (No Exp Needed!)\n🎓 Grads & Undergrads (Egyptians only, Age 18–28)\n🚌 Transportation provided back-way\nApply here: {{APPLY_LINK}}',
  1600, 1600, 2000, 2300, 'TTC-US-TS', 'active'
);

-- ==========================================
-- 16. TTEC
-- ==========================================

-- 16.1 TTEC German Account Outbound Sales Exp
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'German Outbound Sales Specialist', 'TTEC', 'German', 'B2–C1',
  'Up to 48,000 EGP / Monthly', 'On-site', 'Fixed Day / Rotational', 'Maadi Technology Park',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians & Foreigners', true, 30,
  'German B2–C1 | 2 Years Sales experience required | Graduates | Max age 45. Maadi Tech Park.',
  E'🇩🇪 TTEC is hiring German Outbound Sales Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 48,000 EGP / Monthly\n🗣 Language: German B2–C1\n💼 Requirement: 2 Years Sales experience | Graduates only\nApply here: {{APPLY_LINK}}',
  E'🇩🇪 TTEC is hiring German Outbound Sales Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 48,000 EGP / Monthly\n🗣 Language: German B2–C1\n💼 Requirement: 2 Years Sales experience | Graduates only\nApply here: {{APPLY_LINK}}',
  4000, 4000, 4800, 5500, 'TTEC-DE-SLS', 'active'
);

-- 16.2 TTEC Portuguese Account Sales Exp
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Portuguese Sales Representative', 'TTEC', 'Portuguese', 'Portuguese B2+ / C1',
  'Up to 42,000 EGP / Monthly', 'On-site', 'Rotational', 'Maadi',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians & Foreigners', true, 30,
  'Portuguese proficiency | Minimum 1 year Sales experience | Graduates | Max age 45.',
  E'🇵🇹 TTEC is hiring Portuguese Sales Specialists!\n📍 Location: Maadi\n💰 Salary: Up to 42,000 EGP / Monthly\n🗣 Language: Portuguese proficiency\n💼 Requirement: Min 1 year Sales experience\nApply here: {{APPLY_LINK}}',
  E'🇵🇹 TTEC is hiring Portuguese Sales Specialists!\n📍 Location: Maadi\n💰 Salary: Up to 42,000 EGP / Monthly\n🗣 Language: Portuguese proficiency\n💼 Requirement: Min 1 year Sales experience\nApply here: {{APPLY_LINK}}',
  3800, 3800, 4500, 5200, 'TTEC-PT-SLS', 'active'
);

-- 16.3 TTEC French Account CS & Outbound Sales Exp
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Customer Service & Outbound Sales', 'TTEC', 'French', 'French B2+ & English B2',
  'Up to 33,000 EGP / Monthly', 'On-site', 'Day / Rotational', 'Maadi Technology Park',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians & Foreigners', true, 30,
  'French B2+ & English B2 | 2 Years CS or Sales experience required | Graduates | Max age 45.',
  E'🇨🇵 TTEC is hiring French CS & Outbound Sales Agents!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 33,000 EGP / Monthly\n🗣 Language: French B2+ & English B2\n💼 Requirement: 2 Years CS or Sales experience\nApply here: {{APPLY_LINK}}',
  E'🇨🇵 TTEC is hiring French CS & Outbound Sales Agents!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 33,000 EGP / Monthly\n🗣 Language: French B2+ & English B2\n💼 Requirement: 2 Years CS or Sales experience\nApply here: {{APPLY_LINK}}',
  3200, 3200, 3800, 4400, 'TTEC-FR-SLS', 'active'
);

-- 16.4 TTEC Spanish Account CS & Sales Exp
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Spanish Customer Service & Sales Specialist', 'TTEC', 'Spanish', 'Spanish B2–C1',
  'Up to 33,000 EGP / Monthly', 'On-site', 'Rotational', 'Maadi Technology Park',
  'Provided', '18–45', 18, 45, 'Graduates only', 'Egyptians & Foreigners', true, 30,
  'Spanish B2–C1 | 2 Years CS or Sales experience | Graduates | Max age 45.',
  E'🇪🇸 TTEC is hiring Spanish CS & Sales Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 33,000 EGP / Monthly\n🗣 Language: Spanish B2–C1\n💼 Requirement: 2 Years CS or Sales experience\nApply here: {{APPLY_LINK}}',
  E'🇪🇸 TTEC is hiring Spanish CS & Sales Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 33,000 EGP / Monthly\n🗣 Language: Spanish B2–C1\n💼 Requirement: 2 Years CS or Sales experience\nApply here: {{APPLY_LINK}}',
  3200, 3200, 3800, 4400, 'TTEC-ES-SLS', 'active'
);

-- 16.5 TTEC English Account CS & Outbound Sales Exp
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'English Customer Service & Outbound Sales', 'TTEC', 'English', 'B2+ / C1',
  'Up to 24,000 EGP / Monthly', 'On-site', 'Rotational 9 hours', 'Maadi Technology Park',
  'Provided across Cairo & Giza', '18–45', 18, 45, 'Graduates only', 'Egyptians & Foreigners', true, 30,
  'English B2+ / C1 | At least 2 years Customer Service or Sales experience required | Graduates | Max age 45.',
  E'🇬🇧 TTEC is hiring English CS & Outbound Sales Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 24,000 EGP / Monthly\n🗣 Language: English B2+/C1\n💼 Requirement: At least 2 years CS or Sales experience\nApply here: {{APPLY_LINK}}',
  E'🇬🇧 TTEC is hiring English CS & Outbound Sales Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: Up to 24,000 EGP / Monthly\n🗣 Language: English B2+/C1\n💼 Requirement: At least 2 years CS or Sales experience\nApply here: {{APPLY_LINK}}',
  2400, 2400, 2900, 3300, 'TTEC-EN-SLS', 'active'
);

-- ==========================================
-- 17. UNITED FUND (UCC)
-- ==========================================

-- 17.1 Call Center Agents (US Debt Settlement Account)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Debt Settlement Call Center Agent (US Account)', 'United Fund (UCC)', 'English', 'Spoken English C1 or above',
  '15,000 EGP Basic + Commissions on qualified transfers + Daily bonuses', 'On-site',
  'Fixed Shift: 5:00 PM – 2:00 AM (Monday to Friday)', 'Zahraa El Maadi',
  'Provided / Allowance', '16–30', 16, 30, 'Graduates, Undergrads, Gap, Dropouts',
  'Egyptians & Foreigners', true, 21,
  'Spoken English C1 or above | Debt settlement experience required | Graduates, Undergrads, Gap, Dropouts | Age 16–30. Monday to Friday fixed US hours.',
  E'💵 UNITED FUND (UCC) is hiring Call Center Agents (Debt Settlement)! 🇺🇸\n📍 Location: Zahraa El Maadi\n💰 Salary: 15,000 EGP Basic + Commissions on Transfers + Daily Bonuses\n🕒 Shift: Fixed 5:00 PM – 2:00 AM (Mon–Fri)\n🗣 Language: Spoken English C1+\n💼 Requirement: Debt settlement experience | Age 16–30\nApply here: {{APPLY_LINK}}',
  E'💵 UNITED FUND (UCC) is hiring Call Center Agents (Debt Settlement)! 🇺🇸\n📍 Location: Zahraa El Maadi\n💰 Salary: 15,000 EGP Basic + Commissions on Transfers + Daily Bonuses\n🕒 Shift: Fixed 5:00 PM – 2:00 AM (Mon–Fri)\n🗣 Language: Spoken English C1+\n💼 Requirement: Debt settlement experience | Age 16–30\nApply here: {{APPLY_LINK}}',
  2000, 2000, 2400, 2800, 'UCC-DEBT', 'active'
);

-- ==========================================
-- 18. eCLERX
-- ==========================================

-- 18.1 Customer Support Specialists
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, min_age, max_age, grad_status, nationality, experience_required,
  cooling_period_days, description, minimized_description, minimized_post,
  commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Customer Support Specialist', 'eClerx', 'English', 'B2',
  '15,500 EGP Net Basic + KPIs', 'On-site', 'Rotational Night & Overnight Shifts', 'Maadi Technology Park',
  'Provided across Cairo & Giza', '18–40', 18, 40, 'Graduates only', 'Egyptians only', true, 30,
  'English B2 | BPO Customer Service experience required | Graduates only | Egyptians | Max age 40. Process: On-site interviews (Sunday to Thursday, 1:00 PM – 5:00 PM).',
  E'💼 eCLERX is hiring Customer Support Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: 15,500 EGP Net Basic + KPIs\n🗣 Language: English B2\n💼 Requirement: BPO Customer Service experience | Graduates only\n🎯 Process: On-site interviews (Sun–Thu, 1 PM – 5 PM)\nApply here: {{APPLY_LINK}}',
  E'💼 eCLERX is hiring Customer Support Specialists!\n📍 Location: Maadi Technology Park\n💰 Salary: 15,500 EGP Net Basic + KPIs\n🗣 Language: English B2\n💼 Requirement: BPO Customer Service experience | Graduates only\n🎯 Process: On-site interviews (Sun–Thu, 1 PM – 5 PM)\nApply here: {{APPLY_LINK}}',
  1800, 1800, 2200, 2500, 'ECL-CS-MAADI', 'active'
);
