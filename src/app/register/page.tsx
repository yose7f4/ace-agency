import { redirect } from 'next/navigation';

/**
 * Public registration is permanently disabled.
 * All accounts (Recruiters, Team Leaders) must be provisioned by Super Admin via the Admin Dashboard.
 */
export default function RegisterPage() {
  redirect('/login');
}
