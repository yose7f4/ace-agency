import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, referenceCode } = body;

    if (!phone || !referenceCode) {
      return NextResponse.json(
        { error: 'Phone number and Application Reference Code are required.' },
        { status: 400 }
      );
    }

    const cleanCode = referenceCode.trim().replace(/^ACE-/i, '').toLowerCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    // Common Egyptian phone variations (e.g. 010... vs 2010... vs +2010...)
    const localPhone = cleanPhone.startsWith('20') ? '0' + cleanPhone.slice(2) : cleanPhone;
    const intlPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;

    const supabase = createAdminClient();

    // Query candidate matching phone and reference code prefix
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select(`
        id,
        full_name,
        email,
        phone,
        whatsapp,
        status,
        interview_date,
        batch_start_date,
        voice_note_url,
        english_level,
        grad_status,
        created_at,
        offer_id,
        recruiter_id
      `)
      .or(`phone.eq.${localPhone},phone.eq.${intlPhone},phone.eq.${cleanPhone},whatsapp.eq.${localPhone},whatsapp.eq.${intlPhone}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching candidate tracking data:', error);
      return NextResponse.json({ error: 'Failed to look up application.' }, { status: 500 });
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: 'No matching application found. Please verify your phone number and Reference Code.' },
        { status: 404 }
      );
    }

    // Match candidate by Reference Code (matches id prefix or app_reference_code)
    const candidate = candidates.find(c => {
      const cleanId = c.id ? c.id.replace(/-/g, '').toLowerCase() : '';
      const matchesPrefix = cleanId.startsWith(cleanCode);
      const matchesAppRef = (c as any).app_reference_code && 
        (c as any).app_reference_code.trim().toUpperCase() === referenceCode.trim().toUpperCase();
      return matchesPrefix || matchesAppRef;
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'No matching application found. Please verify your phone number and Reference Code.' },
        { status: 404 }
      );
    }

    // Fetch Offer details if attached
    let offer = null;
    if (candidate.offer_id) {
      const { data: offerData } = await supabase
        .from('offers')
        .select('title, company_name, language, level, salary_range, work_style, location, shift, transport')
        .eq('id', candidate.offer_id)
        .single();
      offer = offerData;
    }

    // Fetch assigned Recruiter's WhatsApp for direct coordination
    let coordinatorWhatsapp = '201000000000'; // Default Agency Central WhatsApp
    let coordinatorName = 'ACE Talent Coordinator';

    if (candidate.recruiter_id) {
      const { data: recruiter } = await supabase
        .from('profiles')
        .select('full_name, whatsapp, phone')
        .eq('id', candidate.recruiter_id)
        .single();

      if (recruiter) {
        if (recruiter.whatsapp || recruiter.phone) {
          coordinatorWhatsapp = (recruiter.whatsapp || recruiter.phone || '').replace(/[^0-9]/g, '');
        }
        if (recruiter.full_name) {
          coordinatorName = recruiter.full_name;
        }
      }
    }

    // Format formatted reference code
    const formattedCode = 'ACE-' + candidate.id.replace(/-/g, '').slice(0, 6).toUpperCase();

    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate.id,
        referenceCode: formattedCode,
        fullName: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,
        interviewDate: candidate.interview_date,
        batchStartDate: candidate.batch_start_date,
        voiceNoteUrl: candidate.voice_note_url,
        englishLevel: candidate.english_level,
        gradStatus: candidate.grad_status,
        createdAt: candidate.created_at,
        offer,
        coordinator: {
          name: coordinatorName,
          whatsapp: coordinatorWhatsapp
        }
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
