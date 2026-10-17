import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase/server';
import type { Database, UserRole } from '@/lib/supabase/types';

// Initialize Supabase Admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Missing Supabase admin environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

const supabaseAdmin = createClient<Database>(
  supabaseUrl || '',
  serviceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Generate a unique referral code in the format ACE-XXXXX (e.g., ACE- + 5 random uppercase characters)
 */
async function generateUniqueReferralCode(): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let attempt = 0; attempt < 20; attempt++) {
    let suffix = '';
    for (let i = 0; i < 5; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `ACE-${suffix}`;

    const { data } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();

    if (!data) {
      return code;
    }
  }

  // Fallback random code
  return `ACE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server misconfiguration: Supabase Service Role Key is not configured.' },
        { status: 500 }
      );
    }

    // 1. Verify caller session and admin role
    const serverSupabase = await createServerClient();
    const {
      data: { user: callerUser },
      error: callerAuthError,
    } = await serverSupabase.auth.getUser();

    let callerId = callerUser?.id;

    // Optional fallback: support Authorization header (Bearer token)
    if (!callerId) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: tokenData } = await supabaseAdmin.auth.getUser(token);
        callerId = tokenData.user?.id;
      }
    }

    if (!callerId) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in as an administrator to create accounts.' },
        { status: 401 }
      );
    }

    // Verify caller has role === 'admin' in profiles table
    const { data: callerProfile, error: callerProfileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, is_active')
      .eq('id', callerId)
      .single();

    if (callerProfileError || !callerProfile || callerProfile.role !== 'admin' || !callerProfile.is_active) {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin privileges are required to perform this action.' },
        { status: 403 }
      );
    }

    // 2. Parse and validate request body
    const body = await req.json();
    const {
      full_name,
      email,
      password,
      phone,
      whatsapp,
      role = 'recruiter',
      team_leader_id,
    } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['admin', 'team_leader', 'recruiter'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role "${role}". Allowed roles: admin, team_leader, recruiter.` },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = full_name ? String(full_name).trim() : null;
    const cleanPhone = phone ? String(phone).trim() : null;
    const cleanWhatsapp = whatsapp ? String(whatsapp).trim() : cleanPhone;

    // Validate assigned team leader if creating a recruiter
    let assignedTeamLeaderId: string | null = null;
    if (role === 'recruiter' && team_leader_id && String(team_leader_id).trim()) {
      const targetTlId = String(team_leader_id).trim();
      const { data: tlProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, role, is_active')
        .eq('id', targetTlId)
        .maybeSingle();

      if (tlProfile && tlProfile.role === 'team_leader') {
        assignedTeamLeaderId = tlProfile.id;
      } else {
        return NextResponse.json(
          { error: 'Selected Team Leader was not found or does not have the team_leader role.' },
          { status: 400 }
        );
      }
    }

    // 3. Generate unique referral code (ACE-XXXXX)
    const referralCode = await generateUniqueReferralCode();

    // 4. Create user in Supabase Auth via admin.createUser with email_confirm: true
    const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanFullName,
        role,
        team_leader_id: assignedTeamLeaderId,
        phone: cleanPhone,
        whatsapp: cleanWhatsapp,
        referral_code: referralCode,
      },
    });

    if (createAuthError || !authData.user) {
      return NextResponse.json(
        { error: createAuthError?.message || 'Failed to create user in Supabase Auth.' },
        { status: 400 }
      );
    }

    const newUserId = authData.user.id;

    // 5. Upsert their record in public.profiles table
    const profilePayload = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanFullName,
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      role: role as UserRole,
      team_leader_id: assignedTeamLeaderId,
      referral_code: referralCode,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { data: savedProfile, error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting profile in admin create-user route:', upsertError);
      return NextResponse.json(
        { error: `User created in auth, but failed to setup database profile: ${upsertError.message}` },
        { status: 500 }
      );
    }

    // 6. Return response with credentials and details for WhatsApp sharing
    return NextResponse.json({
      success: true,
      message: `User account created successfully for ${cleanEmail}`,
      user: {
        id: newUserId,
        email: cleanEmail,
        full_name: savedProfile.full_name,
        role: savedProfile.role,
        team_leader_id: savedProfile.team_leader_id,
        referral_code: savedProfile.referral_code,
        phone: savedProfile.phone,
        whatsapp: savedProfile.whatsapp,
        created_at: savedProfile.created_at,
      },
      credentials: {
        email: cleanEmail,
        password,
        referral_code: savedProfile.referral_code,
        full_name: savedProfile.full_name,
        role: savedProfile.role,
        phone: savedProfile.phone,
        whatsapp: savedProfile.whatsapp,
      },
    });
  } catch (err: unknown) {
    console.error('Unhandled error in admin create-user route:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
