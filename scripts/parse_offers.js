const fs = require('fs');

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
  }
  return rows;
}

const content = fs.readFileSync('src/data/sheet_offers.csv', 'utf8');
const rows = parseCSV(content);
const headers = rows[0];

const rawData = rows.slice(1).map((r, idx) => {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = (r[i] || '').trim();
  });
  return obj;
});

function normalizeOffer(raw, index) {
  const companyRaw = raw['company'] || '';
  const statusRaw = raw['Status'] || 'Active';
  const status = statusRaw.toLowerCase().includes('hold') ? 'On Hold' : 'Active';
  const title = raw['Account / Position'] || '';
  const location = raw['Location'] || '';
  const gradStatus = raw['Graduation Status'] || '';
  const langRaw = raw['Language & Level'] || '';
  const expRaw = raw['Experience Required'] || '';
  const minAge = raw['Min Age'] || '18';
  const maxAge = raw['Max Age'] || '45';
  const salary = raw['Salary Details'] || '';
  const bonus = raw['Commissions & Bonuses'] || '';
  const transport = raw['Transportation Details'] || '';
  const interview = raw['Interview & Selection Process'] || '';
  const shift = raw['Shift & Schedule Details'] || '';
  const notes = raw['Additional Requirements & Notes'] || '';

  // Determine languages
  const langs = [];
  const langLower = (langRaw + ' ' + title + ' ' + companyRaw).toLowerCase();
  if (langLower.includes('english') || langLower.includes('us account') || langLower.includes('telesales') || langLower.includes('b2+') || langLower.includes('c1')) {
    langs.push('English');
  }
  if (langLower.includes('french')) langs.push('French');
  if (langLower.includes('german')) langs.push('German');
  if (langLower.includes('italian')) langs.push('Italian');
  if (langLower.includes('spanish')) langs.push('Spanish');
  if (langLower.includes('portuguese')) langs.push('Portuguese');
  if (langLower.includes('dutch')) langs.push('Dutch');
  if (langLower.includes('arabic')) langs.push('Arabic');

  if (langs.length === 0) {
    langs.push('English');
  }

  // Primary language for badge
  // Check if foreign language is present first
  let primaryLang = 'English';
  const foreignPriorities = ['German', 'French', 'Italian', 'Spanish', 'Portuguese', 'Dutch', 'Arabic'];
  for (const fp of foreignPriorities) {
    if (langs.includes(fp)) {
      primaryLang = fp;
      break;
    }
  }

  // Flag and theme
  let flag = '🇬🇧';
  let theme = 'gold';
  if (primaryLang === 'French') { flag = '🇫🇷'; theme = 'cyan'; }
  else if (primaryLang === 'German') { flag = '🇩🇪'; theme = 'emerald'; }
  else if (primaryLang === 'Italian') { flag = '🇮🇹'; theme = 'purple'; }
  else if (primaryLang === 'Spanish') { flag = '🇪🇸'; theme = 'orange'; }
  else if (primaryLang === 'Portuguese') { flag = '🇵🇹'; theme = 'blue'; }
  else if (primaryLang === 'Dutch') { flag = '🇳🇱'; theme = 'amber'; }
  else if (primaryLang === 'Arabic') { flag = '🇪🇬'; theme = 'rose'; }

  // Extract level
  let level = 'B2';
  if (langRaw.includes('C1')) level = 'C1';
  else if (langRaw.includes('B2+')) level = 'B2+';
  else if (langRaw.includes('B1+')) level = 'B1+';
  else if (langRaw.includes('B1')) level = 'B1';
  else if (langRaw.includes('A2') || langRaw.includes('A1')) level = 'A1/A2';

  // Graduation status logic
  const gradLower = gradStatus.toLowerCase();
  const allowsUndergrads = gradLower.includes('undergrad') || gradLower.includes('student');
  const allowsDropouts = gradLower.includes('dropout') || gradLower.includes('gap');
  const graduatesOnly = !allowsUndergrads && (gradLower.includes('only') || gradLower === 'graduates' || gradLower === 'grads only' || gradLower === 'graduate, dropped out');

  let gradLabel = 'Grads & Undergrads';
  if (graduatesOnly) {
    gradLabel = 'Graduates Only';
  } else if (allowsUndergrads && allowsDropouts) {
    gradLabel = 'Grads, Undergrads & Dropouts';
  } else if (allowsUndergrads) {
    gradLabel = 'Undergrads Welcome';
  } else if (allowsDropouts) {
    gradLabel = 'Grads & Dropouts';
  }

  // Location category
  const locLower = location.toLowerCase();
  let locCategory = 'other';
  if (locLower.includes('new cairo') || locLower.includes('tagamoa') || locLower.includes('1st settlement')) {
    locCategory = 'new_cairo';
  } else if (locLower.includes('maadi') || locLower.includes('kattameya')) {
    locCategory = 'maadi';
  } else if (locLower.includes('smart village') || locLower.includes('october') || locLower.includes('zayed')) {
    locCategory = 'zayed_october';
  } else if (locLower.includes('nasr city') || locLower.includes('heliopolis') || locLower.includes('sheraton') || locLower.includes('abbasiya') || locLower.includes('nozha')) {
    locCategory = 'nasr_heliopolis';
  } else if (locLower.includes('remote') || locLower.includes('wfh') || locLower.includes('home')) {
    locCategory = 'remote';
  }

  // Experience category
  const expLower = expRaw.toLowerCase();
  const isFresh = expLower.includes('no experience') || expLower.includes('not experience') || expLower.includes('0-') || expLower === '' || expLower.includes('plus');
  const expCategory = isFresh ? 'fresh' : 'experienced';

  // Work style
  let workStyle = 'On-site';
  if (locLower.includes('remote') || locLower.includes('wfh') || locLower.includes('home')) {
    workStyle = 'Remote / WFH';
  } else if (locLower.includes('hybrid')) {
    workStyle = 'Hybrid';
  }

  // Company Name clean up
  let companyName = companyRaw;
  if (companyName.includes(' - ')) {
    companyName = companyName.split(' - ')[0].trim();
  }

  const uuid = 'b9000000-0000-4000-8000-' + String(index + 1).padStart(12, '0');

  return {
    id: uuid,
    slug: `sheet-${index + 1}`,
    company_name: companyName,
    company_full: companyRaw,
    title: title,
    status: status,
    location: location,
    location_category: locCategory,
    work_style: workStyle,
    grad_status_raw: gradStatus,
    grad_label: gradLabel,
    allows_undergrads: allowsUndergrads,
    allows_dropouts: allowsDropouts,
    graduates_only: graduatesOnly,
    languages: langs,
    primary_language: primaryLang,
    level: level,
    language_raw: langRaw,
    experience_raw: expRaw,
    experience_category: expCategory,
    min_age: minAge,
    max_age: maxAge,
    salary_range: salary,
    bonus_details: bonus,
    transport: transport,
    interview_process: interview,
    shift: shift,
    notes: notes,
    flag: flag,
    theme: theme,
    description: `${title} at ${companyRaw}. Location: ${location}. Salary: ${salary}. ${bonus ? 'Bonuses: ' + bonus + '. ' : ''}${shift ? 'Shift: ' + shift + '. ' : ''}${transport ? 'Transportation: ' + transport + '.' : ''}`
  };
}

const normalized = rawData.map(normalizeOffer);
console.log('Normalized count:', normalized.length);

const outTS = `// Autogenerated from Google Sheet (Doc ID: 1R2ETTh8ocUGguNLtVEsNKW3xvRNM3Q0T71fGoAhJkjA)
// 66 Verified Corporate BPO Vacancies across Cairo, Giza, Alexandria & Remote

export interface SheetOffer {
  id: string;
  slug: string;
  company_name: string;
  company_full: string;
  title: string;
  status: 'Active' | 'On Hold';
  location: string;
  location_category: 'new_cairo' | 'maadi' | 'zayed_october' | 'nasr_heliopolis' | 'remote' | 'other';
  work_style: string;
  grad_status_raw: string;
  grad_label: string;
  allows_undergrads: boolean;
  allows_dropouts: boolean;
  graduates_only: boolean;
  languages: string[];
  primary_language: string;
  level: string;
  language_raw: string;
  experience_raw: string;
  experience_category: 'fresh' | 'experienced';
  min_age: string;
  max_age: string;
  salary_range: string;
  bonus_details: string;
  transport: string;
  interview_process: string;
  shift: string;
  notes: string;
  flag: string;
  theme: string;
  description: string;
}

export const SHEET_OFFERS: SheetOffer[] = ${JSON.stringify(normalized, null, 2)};
`;

fs.writeFileSync('src/data/sheetOffers.ts', outTS, 'utf8');
fs.writeFileSync('src/data/sheetOffers.json', JSON.stringify(normalized, null, 2), 'utf8');

// Generate SQL seed for Postgres / Supabase
const sqlLines = [
  '-- ==============================================================================',
  '-- REAL CORPORATE OFFERS SEED (Imported directly from Google Sheet)',
  '-- 66 Open Vacancies: Concentrix, Teleperformance, TTEC, Enable, Xceed, Innovia, etc.',
  '-- ==============================================================================',
  ''
];

normalized.forEach(o => {
  const escapeSql = (s) => (s || '').replace(/'/g, "''");
  sqlLines.push(`
INSERT INTO public.offers (
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
  min_age,
  max_age,
  grad_status,
  salary_range,
  description,
  requirements,
  benefits,
  cooling_period_days,
  status
) VALUES (
  '${o.id}',
  '${escapeSql(o.title)}',
  '${escapeSql(o.company_full)}',
  '${escapeSql(o.location)}',
  'Full-time',
  '${escapeSql(o.work_style)}',
  '${escapeSql(o.primary_language)}',
  '${escapeSql(o.level)}',
  '${escapeSql(o.shift)}',
  '${escapeSql(o.transport)}',
  ${parseInt(o.min_age) || 18},
  ${parseInt(o.max_age) || 45},
  '${escapeSql(o.grad_label)}',
  '${escapeSql(o.salary_range)}',
  '${escapeSql(o.description)}',
  '${escapeSql(o.notes)}',
  '${escapeSql(o.bonus_details)}',
  30,
  '${o.status === 'On Hold' ? 'hold' : 'active'}'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  company_name = EXCLUDED.company_name,
  location = EXCLUDED.location,
  work_style = EXCLUDED.work_style,
  language = EXCLUDED.language,
  level = EXCLUDED.level,
  shift = EXCLUDED.shift,
  transport = EXCLUDED.transport,
  grad_status = EXCLUDED.grad_status,
  salary_range = EXCLUDED.salary_range,
  description = EXCLUDED.description,
  requirements = EXCLUDED.requirements,
  benefits = EXCLUDED.benefits,
  status = EXCLUDED.status;
`);
});

fs.writeFileSync('supabase/sheet_offers_seed.sql', sqlLines.join('\n'), 'utf8');
console.log('Successfully written to src/data/sheetOffers.ts, sheetOffers.json, and supabase/sheet_offers_seed.sql');
