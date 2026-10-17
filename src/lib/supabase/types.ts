export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'team_leader' | 'recruiter';

export type OfferStatus = 'active' | 'hold' | 'closed';

export type CandidateStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview_Scheduled'
  | 'Interviewed'
  | 'Shortlisted'
  | 'Offered'
  | 'Hired'
  | 'Batch_Started'
  | 'Commission_Unlocked'
  | 'Commission_Paid'
  | 'Rejected'
  | 'Withdrawn';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          team_leader_id: string | null;
          referral_code: string;
          phone: string | null;
          whatsapp: string | null;
          is_active: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          team_leader_id?: string | null;
          referral_code?: string;
          phone?: string | null;
          whatsapp?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          team_leader_id?: string | null;
          referral_code?: string;
          phone?: string | null;
          whatsapp?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          id: string;
          title: string;
          company_name: string;
          location: string;
          job_type: string;
          work_style: string;
          language: string;
          level: string;
          shift: string;
          transport: string;
          min_age: number;
          max_age: number;
          grad_status: string;
          salary_range: string | null;
          description: string;
          minimized_description: string | null;
          requirements: string | null;
          benefits: string | null;
          cooling_period_days: number;
          commission_amount: number;
          recruiter_commission: number;
          tl_commission: number;
          um_commission: number;
          agency_code: string | null;
          internal_notes: string | null;
          status: OfferStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company_name: string;
          location?: string;
          job_type?: string;
          work_style?: string;
          language?: string;
          level?: string;
          shift?: string;
          transport?: string;
          min_age?: number;
          max_age?: number;
          grad_status?: string;
          salary_range?: string | null;
          description: string;
          minimized_description?: string | null;
          requirements?: string | null;
          benefits?: string | null;
          cooling_period_days?: number;
          commission_amount?: number;
          recruiter_commission?: number;
          tl_commission?: number;
          um_commission?: number;
          agency_code?: string | null;
          internal_notes?: string | null;
          status?: OfferStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company_name?: string;
          location?: string;
          job_type?: string;
          work_style?: string;
          language?: string;
          level?: string;
          shift?: string;
          transport?: string;
          min_age?: number;
          max_age?: number;
          grad_status?: string;
          salary_range?: string | null;
          description?: string;
          minimized_description?: string | null;
          requirements?: string | null;
          benefits?: string | null;
          cooling_period_days?: number;
          commission_amount?: number;
          recruiter_commission?: number;
          tl_commission?: number;
          um_commission?: number;
          agency_code?: string | null;
          internal_notes?: string | null;
          status?: OfferStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      candidates: {
        Row: {
          id: string;
          offer_id: string | null;
          recruiter_id: string | null;
          team_leader_id: string | null;
          referral_code: string | null;
          full_name: string;
          email: string;
          phone: string;
          whatsapp: string;
          age: number | null;
          residence: string | null;
          grad_status: string | null;
          voice_note_url: string | null;
          cv_url: string | null;
          experience_years: number;
          english_level: string | null;
          status: CandidateStatus;
          interview_date: string | null;
          batch_start_date: string | null;
          commission_unlock_date: string | null;
          commission_amount: number;
          internal_notes: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          offer_id?: string | null;
          recruiter_id?: string | null;
          team_leader_id?: string | null;
          referral_code?: string | null;
          full_name: string;
          email: string;
          phone: string;
          whatsapp: string;
          age?: number | null;
          residence?: string | null;
          grad_status?: string | null;
          voice_note_url?: string | null;
          cv_url?: string | null;
          experience_years?: number;
          english_level?: string | null;
          status?: CandidateStatus;
          interview_date?: string | null;
          batch_start_date?: string | null;
          commission_unlock_date?: string | null;
          commission_amount?: number;
          internal_notes?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          offer_id?: string | null;
          recruiter_id?: string | null;
          team_leader_id?: string | null;
          referral_code?: string | null;
          full_name?: string;
          email?: string;
          phone?: string;
          whatsapp?: string;
          age?: number | null;
          residence?: string | null;
          grad_status?: string | null;
          voice_note_url?: string | null;
          cv_url?: string | null;
          experience_years?: number;
          english_level?: string | null;
          status?: CandidateStatus;
          interview_date?: string | null;
          batch_start_date?: string | null;
          commission_unlock_date?: string | null;
          commission_amount?: number;
          internal_notes?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      public_offers: {
        Row: {
          id: string;
          title: string;
          company_name: string;
          location: string;
          job_type: string;
          work_style: string;
          language: string;
          level: string;
          shift: string;
          transport: string;
          min_age: number;
          max_age: number;
          grad_status: string;
          salary_range: string | null;
          description: string;
          minimized_description: string | null;
          requirements: string | null;
          benefits: string | null;
          cooling_period_days: number;
          status: OfferStatus;
          created_at: string;
        };
        Relationships: [];
      };
      candidate_commissions_view: {
        Row: {
          candidate_id: string;
          candidate_name: string;
          candidate_email: string;
          candidate_phone: string;
          candidate_status: CandidateStatus;
          batch_start_date: string | null;
          commission_unlock_date: string | null;
          commission_amount: number;
          offer_id: string | null;
          offer_title: string | null;
          cooling_period_days: number | null;
          recruiter_id: string | null;
          recruiter_name: string | null;
          recruiter_email: string | null;
          team_leader_id: string | null;
          team_leader_name: string | null;
          commission_state: 'Paid' | 'Unlocked' | 'In_Cooling' | 'Pending_Batch';
          days_remaining: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_team_leader: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_recruiter: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_recruiter_by_referral: {
        Args: {
          p_referral_code: string;
        };
        Returns: {
          recruiter_id: string;
          recruiter_name: string;
          team_leader_id: string | null;
          is_active: boolean;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
      offer_status: OfferStatus;
      candidate_status: CandidateStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Offer = Database['public']['Tables']['offers']['Row'];
export type Candidate = Database['public']['Tables']['candidates']['Row'];
export type PublicOffer = Database['public']['Views']['public_offers']['Row'];
export type CandidateCommission = Database['public']['Views']['candidate_commissions_view']['Row'];
