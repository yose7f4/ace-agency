import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, referenceCode, voiceNoteUrl } = body;

    if (!phone || !referenceCode || !voiceNoteUrl) {
      return NextResponse.json(
        { error: 'Phone number, reference code, and voice note URL are required.' },
        { status: 400 }
      );
    }

    // Verify valid Vocaroo link
    const vocarooPattern = /(?:vocaroo\.com\/|voca\.ro\/)([a-zA-Z0-9]+)/;
    if (!vocarooPattern.test(voiceNoteUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid Vocaroo link (e.g., https://vocaroo.com/...)' },
        { status: 400 }
      );
    }

    const cleanCode = referenceCode.trim().replace(/^ACE-/i, '').toLowerCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    const localPhone = cleanPhone.startsWith('20') ? '0' + cleanPhone.slice(2) : cleanPhone;
    const intlPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;

    const supabase = createAdminClient();

    // Verify candidate
    const { data: candidates, error: findError } = await supabase
      .from('candidates')
      .select('id, full_name, app_reference_code')
      .or(`phone.eq.${localPhone},phone.eq.${intlPhone},phone.eq.${cleanPhone}`);

    if (findError || !candidates || candidates.length === 0) {
      return NextResponse.json({ error: 'Candidate verification failed.' }, { status: 404 });
    }

    const matchedCandidate = candidates.find(c => {
      const cleanId = c.id ? c.id.replace(/-/g, '').toLowerCase() : '';
      const matchesPrefix = cleanId.startsWith(cleanCode);
      const matchesAppRef = (c as any).app_reference_code && 
        (c as any).app_reference_code.trim().toUpperCase() === referenceCode.trim().toUpperCase();
      return matchesPrefix || matchesAppRef;
    });

    if (!matchedCandidate) {
      return NextResponse.json({ error: 'Candidate verification failed.' }, { status: 404 });
    }

    const candidateId = matchedCandidate.id;

    // Update voice note URL
    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        voice_note_url: voiceNoteUrl.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    if (updateError) {
      console.error('Error updating candidate voice note:', updateError);
      return NextResponse.json({ error: 'Failed to update voice note.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Voice note audition updated successfully!'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
