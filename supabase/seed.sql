-- ==============================================================================
-- ACE RECRUITMENT AGENCY — OFFICIAL DATABASE SEED SCRIPT
-- 20 Real Egyptian BPO Offers & Linked Test Team Hierarchy
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Ensure app_reference_code column exists on candidates table
-- ------------------------------------------------------------------------------
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS app_reference_code TEXT UNIQUE NOT NULL 
DEFAULT ('ACE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6)));

CREATE INDEX IF NOT EXISTS idx_candidates_ref_code ON public.candidates(app_reference_code);

-- ------------------------------------------------------------------------------
-- 2. Link Test User Hierarchy (Omar Recruiter -> Ahmed Team Leader)
-- ------------------------------------------------------------------------------
-- Ensure profiles are properly linked
UPDATE public.profiles
SET team_leader_id = (SELECT id FROM public.profiles WHERE email = 'ahmed@ace.com' LIMIT 1)
WHERE email = 'omar@ace.com';

-- ------------------------------------------------------------------------------
-- 3. Clear existing candidates for clean fresh testing
-- ------------------------------------------------------------------------------
DELETE FROM public.candidates;

-- ------------------------------------------------------------------------------
-- 4. Delete existing dummy offers to replace with 20 Real Egyptian BPO Accounts
-- ------------------------------------------------------------------------------
DELETE FROM public.offers;

-- ------------------------------------------------------------------------------
-- 5. Insert 20 Real Egyptian BPO Vacancies
-- ------------------------------------------------------------------------------

-- 1. LPM | Telesales Agent
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent', 'LPM', 'English', 'B2+',
  '20,000 EGP Net + Uncapped Commission (starts at 6K) + Bonuses',
  'On-site', 'Fixed: 3:15 PM – 12:30 AM (Sat & Sun Off)', '6th of October',
  'Return Drop-off (October, Zayed, Haram, Mohandseen - Door-to-door for girls / Drop-off points for guys)',
  '16–30', 'All Grad Status', 'Egyptians & Foreigners', false, 14,
  E'🔥 LPM is hiring Telesales Agents!\n📍 6th of October (Door-to-door girls / points guys)\n💰 20K EGP Net + Uncapped Comm (starts 6K)\n🕒 3:15 PM - 12:30 AM (Fixed, Sat & Sun OFF)\n🎯 English B2+ | No Exp Needed | Age 16-30\nApply here: ',
  2200, 1500, 1900, 2200, 'LPM-TS-OCT', 'active'
);

-- 2. TTC | Telesales Agent (US Account)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent (US Account)', 'TTC', 'English', 'B2+/C1',
  '12,000 EGP Net + Unlimited Commissions + KPIs + Paid testing',
  'On-site', 'Fixed: 3:00 PM – 11:00 PM (Sat & Sun Off)', 'Nasr City (Makram Ebeid)',
  'Return Transportation Provided',
  '18–28', 'All Grad Status', 'Egyptians Only', false, 36,
  E'🔥 TTC is hiring Telesales Agents (US Account)!\n📍 Nasr City (Makram Ebeid) - Return Transport Provided\n💰 12K EGP Net + Unlimited Comm + KPIs\n🕒 Fixed 3:00 PM - 11:00 PM (Sat & Sun OFF)\n🎯 English B2+/C1 | No Exp Needed | Age 18-28 | Egyptians Only\nApply here: ',
  2000, 1200, 1600, 2000, 'TTC-US-NC', 'active'
);

-- 3. Total Trip Planners | Back Office Agent (US Account)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Back Office Agent (US Account)', 'Total Trip Planners', 'English', 'B2',
  '12,000 EGP Net',
  'On-site', 'Fixed Full-Time', 'Heliopolis (Masr El Gedida)',
  'One-way return for Nasr City & Heliopolis',
  '20–30', 'Grads & Undergrads', 'Egyptians & Foreigners', false, 30,
  E'🔥 Total Trip Planners is hiring Back Office Agents (US Account)!\n📍 Heliopolis (Masr El Gedida)\n💰 12K EGP Net | One-way return transport\n🕒 Fixed Full-Time Shift\n🎯 English B2 | Grads & Undergrads | No Exp Needed\nApply here: ',
  1800, 1000, 1400, 1800, 'TTP-BO-HEL', 'active'
);

-- 4. Crystal Reach | Telesales Agent
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent', 'Crystal Reach', 'English', 'B2+/C1',
  '15,000 EGP Basic + Commissions',
  'On-site', 'Fixed: 3:00 PM – 12:00 AM', 'Cairo',
  'Centrally Located in Cairo',
  '18–32', 'Grads & Undergrads', 'Egyptians & Foreigners', false, 21,
  E'🔥 Crystal Reach is hiring Telesales Agents!\n📍 Cairo\n💰 15K EGP Basic + Commissions\n🕒 Fixed: 3:00 PM - 12:00 AM\n🎯 English B2+/C1 | Grads & Undergrads | Age 18-32\nApply here: ',
  2000, 1200, 1600, 2000, 'CR-TS-CAI', 'active'
);

-- 5. LeadBull | Telesales Agent (Canadian Account)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Telesales Agent (Canadian Account)', 'LeadBull', 'English', 'B2+',
  '15,000 EGP Net + 5K KPIs + Spiffs',
  'Hybrid', 'Fixed: 4:00 PM – 1:00 AM', 'Zahraa El Maadi',
  'Maadi meeting points (WFH after 3 months)',
  '19–35', 'All Grad Status', 'Egyptians Only', false, 30,
  E'🔥 LeadBull is hiring Telesales Agents (Canadian Account)!\n📍 Zahraa El Maadi (Hybrid - WFH after 3 months)\n💰 15K EGP Net + 5K KPIs + Spiffs\n🕒 Fixed: 4:00 PM - 1:00 AM\n🎯 English B2+ | All Grad Status | Age 19-35\nApply here: ',
  2500, 1500, 2000, 2500, 'LB-TS-MAA', 'active'
);

-- 6. Geeky CX | Debt Settlement Sales
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Debt Settlement Sales Specialist', 'Geeky CX', 'English', 'B2+/C1',
  '15,000 Base + 2,000 Transport + USD Comm (Exp: 20K Base + 15K Bonus)',
  'On-site', 'Fixed: 5:00 PM – 2:00 AM', 'Sheikh Zayed',
  '2,000 EGP Transport Allowance Included',
  '19–35', 'Graduates (Undergrads if C1)', 'Egyptians Only', true, 30,
  E'🔥 Geeky CX is hiring Debt Settlement Sales Specialists!\n📍 Sheikh Zayed\n💰 15K-20K Base + 2K Transport + USD Comm\n🕒 Fixed: 5:00 PM - 2:00 AM\n🎯 English B2+/C1 | Sales Exp Required\nApply here: ',
  2500, 1600, 2100, 2500, 'GCX-DSS-ZAY', 'active'
);

-- 7. Geeky CX | Customer Service Agent
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Customer Service Agent', 'Geeky CX', 'English', 'B2+/C1',
  '18,000 Base + 2,000 Transport + $100 USD KPI',
  'On-site', 'Fixed: 7:00 PM – 4:00 AM', 'Sheikh Zayed',
  '2,000 EGP Transport Allowance Included',
  '19–35', 'Graduates (Undergrads if C1)', 'Egyptians Only', true, 30,
  E'🔥 Geeky CX is hiring Customer Service Agents!\n📍 Sheikh Zayed\n💰 18K Base + 2K Transport + $100 USD KPI\n🕒 Fixed: 7:00 PM - 4:00 AM\n🎯 English B2+/C1 | Exp Required\nApply here: ',
  2500, 1600, 2100, 2500, 'GCX-CS-ZAY', 'active'
);

-- 8. Geeky CX | Bilingual CS Agent (Spanish & English)
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Bilingual Customer Service Agent (Spanish & English)', 'Geeky CX', 'Spanish', 'B2+/C1',
  '28,000 Base + 2,000 Transport + $100 USD KPI',
  'On-site', 'Fixed: 7:00 PM – 4:00 AM', 'Sheikh Zayed',
  '2,000 EGP Transport Allowance Included',
  '21–38', 'Graduates Only', 'Egyptians Only', false, 30,
  E'🔥 Geeky CX is hiring Bilingual Spanish & English CS Agents!\n📍 Sheikh Zayed\n💰 28K Base + 2K Transport + $100 USD KPI\n🕒 Fixed: 7:00 PM - 4:00 AM\n🎯 Spanish B2+/C1 + English B2+ | Grads Only\nApply here: ',
  4000, 2500, 3200, 4000, 'GCX-SP-ZAY', 'active'
);

-- 9. ACES | Cold-Calling Telesales Agent
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Cold-Calling Telesales Agent', 'ACES', 'English', 'B2+',
  '12,000 Basic Net + Uncapped Commission',
  'On-site', 'Fixed: 3:30 PM – 11:30 PM (Sat & Sun Off)', 'Abbassia',
  'Night Door-to-Door for females OR 1.5K Allowance for males',
  '18–26', 'All Grad Status', 'Egyptians Only', false, 21,
  E'🔥 ACES is hiring Cold-Calling Telesales Agents!\n📍 Abbassia (Night Door-to-Door for females OR 1.5K allowance for males)\n💰 12K Basic Net + Uncapped Comm\n🕒 Fixed 3:30 PM - 11:30 PM (Sat & Sun OFF)\n🎯 English B2+ | Age 18-26 | No Exp Needed\nApply here: ',
  1800, 1000, 1400, 1800, 'ACES-TS-ABB', 'active'
);

-- 10. TTEC | English Customer Service
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'English Customer Service Specialist', 'TTEC', 'English', 'C1',
  '24,480 EGP Gross + Paid Training',
  'On-site', 'Rotational 9-Hr (24/7)', 'Maadi Tech Park',
  'Provided (Door-to-door for females 10 PM–6 AM)',
  '21–45', 'Graduates Only', 'Egyptians Only', true, 30,
  E'🔥 TTEC is hiring English Customer Service Specialists!\n📍 Maadi Tech Park (Transport Provided / Door-to-door females at night)\n💰 24,480 EGP Gross + Paid Training\n🕒 Rotational 9-Hr shifts\n🎯 English C1 | Graduates Only | 1 yr CS Exp (Mention Mosla Pioneers)\nApply here: ',
  3000, 1800, 2400, 3000, 'TTEC-EN-MAA', 'active'
);

-- 11. TTEC | Dutch Sales Rep
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Dutch Sales Representative', 'TTEC', 'Dutch', 'B2+',
  '64,000 EGP Gross + Commissions + Paid Training',
  'On-site', 'Rotational 9-Hr (24/7)', 'Maadi Tech Park',
  'Provided (Door-to-door for females 10 PM–6 AM)',
  '21–45', 'Graduates Only', 'Egyptians Only', true, 30,
  E'🔥 TTEC is hiring Dutch Sales Representatives!\n📍 Maadi Tech Park (Transport Provided)\n💰 64,000 EGP Gross + Commissions\n🕒 Rotational 9-Hr shifts\n🎯 Dutch B2+ & English B2 | Graduates Only | 1 yr Sales Exp\nApply here: ',
  6000, 4000, 5000, 6000, 'TTEC-NL-MAA', 'active'
);

-- 12. TTEC | Portuguese Sales Rep
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Portuguese Sales Representative', 'TTEC', 'Portuguese', 'B2+',
  '42,200 EGP Gross + Commissions + Paid Training',
  'On-site', 'Rotational 9-Hr (24/7)', 'Maadi Tech Park',
  'Provided (Door-to-door for females 10 PM–6 AM)',
  '21–45', 'Graduates Only', 'Egyptians Only', true, 30,
  E'🔥 TTEC is hiring Portuguese Sales Representatives!\n📍 Maadi Tech Park (Transport Provided)\n💰 42,200 EGP Gross + Commissions\n🕒 Rotational 9-Hr shifts\n🎯 Portuguese B2+ & English B2 | Graduates Only | 1 yr Sales Exp\nApply here: ',
  5000, 3000, 4000, 5000, 'TTEC-PT-MAA', 'active'
);

-- 13. TTEC | French Sales Rep
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'French Sales Representative', 'TTEC', 'French', 'B2+',
  '33,500 EGP Gross + Commissions + Paid Training',
  'On-site', 'Rotational 9-Hr (24/7)', 'Maadi Tech Park',
  'Provided (Door-to-door for females 10 PM–6 AM)',
  '21–45', 'Graduates Only', 'Egyptians Only', true, 30,
  E'🔥 TTEC is hiring French Sales Representatives!\n📍 Maadi Tech Park (Transport Provided)\n💰 33,500 EGP Gross + Commissions\n🕒 Rotational 9-Hr shifts\n🎯 French B2+ & English B2 | Graduates Only | 1 yr Sales Exp\nApply here: ',
  4200, 2500, 3300, 4200, 'TTEC-FR-MAA', 'active'
);

-- 14. TTEC | Spanish Sales Rep
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Spanish Sales Representative', 'TTEC', 'Spanish', 'B2+',
  '28,500 EGP Gross + Commissions + Paid Training',
  'On-site', 'Rotational 9-Hr (24/7)', 'Maadi Tech Park',
  'Provided (Door-to-door for females 10 PM–6 AM)',
  '21–45', 'Graduates Only', 'Egyptians Only', true, 30,
  E'🔥 TTEC is hiring Spanish Sales Representatives!\n📍 Maadi Tech Park (Transport Provided)\n💰 28,500 EGP Gross + Commissions\n🕒 Rotational 9-Hr shifts\n🎯 Spanish B2+ & English B2 | Graduates Only | 1 yr Sales Exp\nApply here: ',
  3800, 2200, 3000, 3800, 'TTEC-ES-MAA', 'active'
);

-- 15. eClerx | Customer Support Specialist
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Customer Support Specialist', 'eClerx', 'English', 'B2',
  '20,000 – 21,000 EGP Net',
  'On-site', 'Rotational Night & Overnight', 'Maadi Tech Park',
  'Provided (Door-to-door for females)',
  '21–38', 'Graduates Only', 'Egyptians Only', true, 30,
  E'🔥 eClerx is hiring Customer Support Specialists!\n📍 Maadi Tech Park (Transport Provided / Door-to-door for females)\n💰 20K - 21K EGP Net\n🕒 Rotational Night & Overnight shifts\n🎯 English B2 | Graduates Only | 6+ mos exp\nApply here: ',
  2500, 1600, 2100, 2500, 'ECL-CS-MAA', 'active'
);

-- 16. Cxperts | Outbound Telesales / Lead Gen
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Outbound Telesales & Lead Generation Specialist', 'Cxperts', 'English', 'C1+',
  '15,000 Basic + 5K KPIs + 2.2K Transport + $50–$100 USD/lead',
  'On-site', 'Rotational Evening/Night (Sat & Sun Off)', 'Downtown Cairo (Elbostan Mall)',
  '2,200 EGP Transport Allowance Included',
  '18–30', 'Grads, Undergrads & Dropouts', 'Egyptians & Foreigners', true, 21,
  E'🔥 Cxperts is hiring Outbound Telesales & Lead Gen Specialists!\n📍 Downtown Cairo (Elbostan Mall)\n💰 15K Basic + 5K KPIs + 2.2K Transport + $50-$100 USD/lead\n🕒 Rotational Evening/Night (Sat & Sun OFF)\n🎯 English C1+ | Grads, Undergrads & Dropouts | 1-2 yrs Sales Exp\nApply here: ',
  2500, 1500, 2000, 2500, 'CXP-LG-DOW', 'active'
);

-- 17. Teleperformance | Call Center Agent
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Call Center Agent', 'Teleperformance', 'English', 'B2+',
  '18,000 – 19,000 EGP Net + Paid Training + Gym Access',
  'On-site', 'Rotational 9-Hr', 'New Cairo',
  'Provided (Door-to-door for females after 10 PM)',
  '21–45', 'Graduates Only', 'Egyptians Only', false, 30,
  E'🔥 Teleperformance is hiring Call Center Agents!\n📍 New Cairo (Transport Provided / Door-to-door for females after 10 PM)\n💰 18K - 19K EGP Net + Paid Training + Gym Access\n🕒 Rotational 9-Hr shifts\n🎯 English B2+ | Graduates Only | No Exp Needed\nApply here: ',
  2500, 1500, 2000, 2500, 'TP-CS-NCA', 'active'
);

-- 18. Alorica | Customer Support Advisor
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Customer Support Advisor (US Airline)', 'Alorica', 'English', 'B2+',
  'Competitive Net Salary + KPIs',
  'On-site', 'Rotational 24/7', 'Sheikh Zayed',
  'Transportation Provided',
  '21–40', 'Graduates & Dropouts', 'Egyptians Only', false, 30,
  E'🔥 Alorica is hiring Customer Support Advisors (US Airline)!\n📍 Sheikh Zayed (Transport Provided)\n💰 Competitive Net Salary + KPIs\n🕒 Rotational 24/7 shifts\n🎯 English B2+ | Grads & Dropouts | No Exp Needed\nApply here: ',
  2500, 1500, 2000, 2500, 'ALO-AIR-ZAY', 'active'
);

-- 19. VX Alex | Business Travel Consultant
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Business Travel Consultant (Aviation BPO)', 'VX Alex', 'English', 'C1',
  '13,000 Base + Uncapped USD Commissions (Avg $700+/mo)',
  'Hybrid', 'Fixed: 5:00 PM – 2:00 AM', 'Alexandria',
  'Centrally Located (WFH after 90 days)',
  '21–30', 'Grads & Undergrads', 'Egyptians Only', true, 30,
  E'🔥 VX Alex is hiring Business Travel Consultants (Aviation BPO)!\n📍 Alexandria (Hybrid - WFH after 90 days)\n💰 13K Base + Uncapped USD Commissions (Avg $700+/mo)\n🕒 Fixed: 5:00 PM - 2:00 AM\n🎯 English C1 | 2+ yrs Sales Exp (No cold calling)\nApply here: ',
  2500, 1500, 2000, 2500, 'VX-BTC-ALX', 'active'
);

-- 20. LFB | Sales Coordinator
INSERT INTO public.offers (
  title, company_name, language, level, salary_range, work_style, shift, location,
  transport, age_range, grad_status, nationality, experience_required, cooling_period_days,
  minimized_post, commission_amount, recruiter_commission, tl_commission, um_commission,
  agency_code, status
) VALUES (
  'Sales Coordinator', 'LFB', 'English', 'B2',
  '12,000 EGP Net + Annual Bonus + Paid Training',
  'On-site', 'Fixed: 8:30 AM – 4:30 PM (Sun–Thu)', 'Abu Rawash, Giza',
  'Included in Salary',
  '21–35', 'Business / Commerce Grads', 'Egyptians Only', true, 30,
  E'🔥 LFB is hiring Sales Coordinators!\n📍 Abu Rawash, Giza\n💰 12K EGP Net + Annual Bonus + Paid Training\n🕒 Fixed: 8:30 AM - 4:30 PM (Sun - Thu)\n🎯 English B2 | Business/Commerce Grads | 1-3 yrs Exp\nApply here: ',
  2000, 1200, 1600, 2000, 'LFB-SC-ABU', 'active'
);
