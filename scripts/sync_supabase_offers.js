const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
});

const sheetOffers = JSON.parse(fs.readFileSync('src/data/sheetOffers.json', 'utf8'));

async function sync() {
  console.log(`Starting sync for ${sheetOffers.length} sheet offers...`);

  // First, let's see how many offers currently exist
  const { data: currentOffers, error: fetchErr } = await supabase
    .from('offers')
    .select('id, title, company_name');

  if (fetchErr) {
    console.error('Error fetching current offers:', fetchErr);
    return;
  }

  console.log(`Found ${currentOffers.length} existing offers in database.`);

  // Prepare payload for 66 offers
  const payload = sheetOffers.map(o => ({
    id: o.id,
    title: o.title,
    company_name: o.company_full,
    location: o.location,
    job_type: 'Full-time',
    work_style: o.work_style,
    language: o.primary_language,
    level: o.level,
    shift: o.shift,
    transport: o.transport,
    min_age: parseInt(o.min_age) || 18,
    max_age: parseInt(o.max_age) || 45,
    grad_status: o.grad_label,
    nationality: 'Egyptians & Foreigners',
    experience_required: o.experience_category === 'experienced',
    salary_range: o.salary_range,
    description: o.description,
    requirements: o.notes,
    benefits: o.bonus_details,
    cooling_period_days: 30,
    commission_amount: 2500,
    recruiter_commission: 2500,
    tl_commission: 500,
    um_commission: 0,
    agency_code: 'ACE',
    internal_notes: o.notes,
    status: o.status === 'On Hold' ? 'hold' : 'active'
  }));

  // Upsert all 66 sheet offers
  const { data: upserted, error: upsertErr } = await supabase
    .from('offers')
    .upsert(payload, { onConflict: 'id' })
    .select('id');

  if (upsertErr) {
    console.error('Error upserting sheet offers:', upsertErr);
    return;
  }
  console.log(`Successfully upserted ${upserted.length} sheet offers into Supabase!`);

  // Now, identify old offers that are not part of the 66 sheet offers
  const sheetIds = new Set(sheetOffers.map(s => s.id));
  const oldIdsToDelete = currentOffers.filter(c => !sheetIds.has(c.id)).map(c => c.id);
  console.log(`Identified ${oldIdsToDelete.length} obsolete offers to archive/remove.`);

  if (oldIdsToDelete.length > 0) {
    // Unlink candidates from old offers first to prevent foreign key errors
    const { error: unlinkErr } = await supabase
      .from('candidates')
      .update({ offer_id: null })
      .in('offer_id', oldIdsToDelete);

    if (unlinkErr) {
      console.warn('Notice unlinking candidates:', unlinkErr.message);
    }

    // Delete or set old offers to closed/archive
    const { error: delErr } = await supabase
      .from('offers')
      .delete()
      .in('id', oldIdsToDelete);

    if (delErr) {
      console.warn('Could not delete old offers, setting status to closed:', delErr.message);
      await supabase
        .from('offers')
        .update({ status: 'closed' })
        .in('id', oldIdsToDelete);
    } else {
      console.log(`Successfully removed ${oldIdsToDelete.length} old offers!`);
    }
  }

  // Final count check
  const { count: finalCount } = await supabase
    .from('offers')
    .select('id', { count: 'exact' });

  console.log(`Final count in Supabase offers table: ${finalCount}`);
}

sync();
