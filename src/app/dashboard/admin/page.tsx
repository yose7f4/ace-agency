'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Offer, Profile, UserRole, OfferStatus } from '@/lib/supabase/types';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Users, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Globe, 
  MapPin, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ChevronDown,
  Layers,
  Search,
  Filter,
  Eye,
  Lock,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { CreateAccountPanel } from '@/components/admin/CreateAccountPanel';

export default function AdminDashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'offers' | 'users'>('offers');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Offer Builder Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(true);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState<OfferStatus>('active');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('B2');
  const [location, setLocation] = useState('New Cairo / On-site');
  const [workStyle, setWorkStyle] = useState('On-site');
  const [shift, setShift] = useState('Day Shift');
  const [salaryRange, setSalaryRange] = useState('18,000 - 24,000 EGP');
  const [transport, setTransport] = useState('Provided (Door to Door / Meeting Points)');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [gradStatus, setGradStatus] = useState('Graduates & Undergrads');
  const [recruiterCommission, setRecruiterCommission] = useState(1500);
  const [tlCommission, setTlCommission] = useState(500);
  const [umCommission, setUmCommission] = useState(250);
  const [coolingPeriodDays, setCoolingPeriodDays] = useState(30);
  const [agencyCode, setAgencyCode] = useState('ACE-VOX-01');
  const [internalNotes, setInternalNotes] = useState('');
  const [description, setDescription] = useState('');
  const [minimizedDescription, setMinimizedDescription] = useState('');

  const supabase = createBrowserClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [offersRes, usersRes] = await Promise.all([
        supabase.from('offers').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);

      if (offersRes.data) setOffers(offersRes.data as Offer[]);
      if (usersRes.data) setUsers(usersRes.data as Profile[]);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate standard minimized post template
  const generateMinimizedTemplate = () => {
    const template = `🔥 NEW VACANCY ALERT — ACE RECRUITMENT 🔥
💼 Position: ${title || 'Customer Service Advisor'}
🏢 Account: ${companyName || 'Top Tier Corporate'}
🗣 Language: ${language} (${level})
📍 Location: ${location} (${workStyle})
⏰ Shift: ${shift}
🚌 Transportation: ${transport}
💰 Net Salary: ${salaryRange}
🎓 Education: ${gradStatus}
🎂 Age: ${minAge} to ${maxAge} Years

✅ Fast-Track Interview & Zero Fees!
👇 Apply now in under 2 minutes:
{{APPLY_LINK}}`;

    setMinimizedDescription(template);
  };

  const handleOpenCreateForm = () => {
    setEditingOfferId(null);
    setTitle('');
    setCompanyName('');
    setStatus('active');
    setLanguage('English');
    setLevel('B2');
    setLocation('New Cairo');
    setWorkStyle('On-site');
    setShift('Day Shift');
    setSalaryRange('18,000 - 24,000 EGP');
    setTransport('Provided');
    setMinAge(18);
    setMaxAge(40);
    setGradStatus('Graduates & Undergrads');
    setRecruiterCommission(1500);
    setTlCommission(500);
    setUmCommission(250);
    setCoolingPeriodDays(30);
    setAgencyCode('ACE-' + Math.floor(100 + Math.random() * 900));
    setInternalNotes('');
    setDescription('Full-time professional customer engagement advisor handling incoming international inquiries.');
    
    // Auto populate template
    setMinimizedDescription(`🔥 NEW VACANCY — ACE RECRUITMENT 🔥\n💼 Position: Customer Service Advisor\n🗣 Language: English (B2)\n📍 Location: New Cairo (On-site)\n💰 Net Salary: 18,000 - 24,000 EGP\n🚌 Transportation: Provided\n🎓 ${gradStatus}\n\n👇 Apply here:\n{{APPLY_LINK}}`);
    setIsFormOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setTitle(offer.title);
    setCompanyName(offer.company_name);
    setStatus(offer.status);
    setLanguage(offer.language || 'English');
    setLevel(offer.level || 'B2');
    setLocation(offer.location);
    setWorkStyle(offer.work_style || 'On-site');
    setShift(offer.shift || 'Day Shift');
    setSalaryRange(offer.salary_range || '');
    setTransport(offer.transport || 'Provided');
    setMinAge(offer.min_age || 18);
    setMaxAge(offer.max_age || 45);
    setGradStatus(offer.grad_status || 'Graduates & Undergrads');
    setRecruiterCommission(offer.recruiter_commission || 1500);
    setTlCommission(offer.tl_commission || 500);
    setUmCommission(offer.um_commission || 250);
    setCoolingPeriodDays(offer.cooling_period_days);
    setAgencyCode(offer.agency_code || '');
    setInternalNotes(offer.internal_notes || '');
    setDescription(offer.description);
    setMinimizedDescription(offer.minimized_description || '');
    setIsFormOpen(true);
  };

  const handleToggleOfferStatus = async (offer: Offer) => {
    const nextStatus: OfferStatus = offer.status === 'active' ? 'hold' : 'active';
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: nextStatus })
        .eq('id', offer.id);

      if (error) throw error;

      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, status: nextStatus } : o));
      showNotify('success', `Offer status updated to ${nextStatus.toUpperCase()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      showNotify('error', msg);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const payload = {
        title,
        company_name: companyName,
        status,
        language,
        level,
        location,
        work_style: workStyle,
        shift,
        salary_range: salaryRange,
        transport,
        min_age: Number(minAge),
        max_age: Number(maxAge),
        grad_status: gradStatus,
        recruiter_commission: Number(recruiterCommission),
        tl_commission: Number(tlCommission),
        um_commission: Number(umCommission),
        commission_amount: Number(recruiterCommission), // Base recruiter commission
        cooling_period_days: Number(coolingPeriodDays),
        agency_code: agencyCode,
        internal_notes: internalNotes,
        description,
        minimized_description: minimizedDescription,
      };

      if (editingOfferId) {
        const { error } = await supabase
          .from('offers')
          .update(payload)
          .eq('id', editingOfferId);
        if (error) throw error;
        showNotify('success', 'Offer updated successfully.');
      } else {
        const { error } = await supabase
          .from('offers')
          .insert(payload);
        if (error) throw error;
        showNotify('success', 'New offer created successfully.');
      }

      setIsFormOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving offer';
      showNotify('error', msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showNotify('success', `User role updated to ${newRole}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating user role';
      showNotify('error', msg);
    }
  };

  const handleAssignTeamLeader = async (recruiterId: string, leaderId: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team_leader_id: leaderId })
        .eq('id', recruiterId);

      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === recruiterId ? { ...u, team_leader_id: leaderId } : u));
      showNotify('success', 'Assigned team leader updated.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error assigning team leader';
      showNotify('error', msg);
    }
  };

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const teamLeaders = users.filter(u => u.role === 'team_leader');

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.language?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Command Center</h1>
            </div>
            <p className="text-sm text-slate-400">
              Method 1 Offer Builder, Role Orchestration, and Agency-Wide Operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('users');
                setIsCreateUserOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
            <button
              onClick={handleOpenCreateForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Method 1: Create Job Offer
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            notification.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Job Offers</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{offers.length}</span>
              <span className="text-xs text-amber-400 font-medium">
                {offers.filter(o => o.status === 'active').length} Active
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Registered Recruiters</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{users.filter(u => u.role === 'recruiter').length}</span>
              <span className="text-xs text-blue-400 font-medium">
                {teamLeaders.length} Team Leaders
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total System Users</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{users.length}</span>
              <span className="text-xs text-emerald-400 font-medium">All Roles</span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Max Offer Commission</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400">
                {Math.max(...offers.map(o => o.recruiter_commission || o.commission_amount || 0), 0)} EGP
              </span>
              <span className="text-xs text-slate-400">Per Hired Batch</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'offers' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Offers & Method 1 Builder ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'users' 
                ? 'border-blue-400 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Users & Team Hierarchy ({users.length})
          </button>
        </div>

        {/* TAB 1: OFFERS MANAGEMENT */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search offers by title, account..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-xs text-slate-400">
                Showing {filteredOffers.length} offers
              </span>
            </div>

            {/* Offers Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Offer / Account</th>
                      <th className="py-3 px-4">Language & Shift</th>
                      <th className="py-3 px-4">Location / Work Style</th>
                      <th className="py-3 px-4">Commissions (Recruiter / TL / UM)</th>
                      <th className="py-3 px-4">Cooling Days</th>
                      <th className="py-3 px-4">Quick Status Toggle</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOffers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500 italic">
                          No job offers found. Click "Method 1: Create Job Offer" to add your first vacancy.
                        </td>
                      </tr>
                    ) : (
                      filteredOffers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-bold text-white text-sm block">{offer.title}</span>
                              <span className="text-amber-400 font-medium">{offer.company_name}</span>
                              <span className="text-[10px] text-slate-500 block">Code: {offer.agency_code || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-blue-300">
                              <Globe className="w-3 h-3 text-blue-400" />
                              {offer.language} ({offer.level})
                            </span>
                            <span className="text-slate-400 block text-[11px] mt-0.5">{offer.shift}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-300 font-medium block">{offer.location}</span>
                            <span className="text-[11px] text-emerald-400">{offer.work_style}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1 font-mono font-bold text-xs">
                              <span className="text-amber-300">R: {offer.recruiter_commission || offer.commission_amount}</span>
                              <span className="text-slate-600">|</span>
                              <span className="text-blue-300">TL: {offer.tl_commission || 0}</span>
                              <span className="text-slate-600">|</span>
                              <span className="text-slate-400">UM: {offer.um_commission || 0}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Net: {offer.salary_range}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {offer.cooling_period_days} Days
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleOfferStatus(offer)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                offer.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : offer.status === 'hold'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
                              }`}
                              title="Click to toggle Active / Hold"
                            >
                              {offer.status === 'active' ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-amber-400" />
                                  <span>On Hold</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditOffer(offer)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="Edit Offer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & TEAM HIERARCHY */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Create Account Panel */}
            {isCreateUserOpen ? (
              <CreateAccountPanel
                teamLeaders={teamLeaders}
                onClose={() => setIsCreateUserOpen(false)}
                onUserCreated={() => {
                  loadData();
                  showNotify('success', 'User account created and added to roster!');
                }}
              />
            ) : (
              <div className="glass-panel rounded-2xl border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Manual Staff & Recruiter Account Provisioning</h3>
                    <p className="text-xs text-slate-400">Create new Team Leader or Recruiter accounts with WhatsApp-ready credentials.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateUserOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Open Account Creator
                </button>
              </div>
            )}

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Agency Roster & Strict Role Isolation</h3>
                  <p className="text-xs text-slate-400">Manage admin permissions and link recruiters to Team Leaders</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">User / Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Affiliate Ref Code</th>
                      <th className="py-3 px-4">Role Assignment</th>
                      <th className="py-3 px-4">Assigned Team Leader</th>
                      <th className="py-3 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-sm block">
                            {user.full_name || 'Anonymous User'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {user.id.slice(0, 8)}...</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {user.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {user.referral_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                          >
                            <option value="recruiter">Recruiter</option>
                            <option value="team_leader">Team Leader</option>
                            <option value="admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          {user.role === 'recruiter' ? (
                            <select
                              value={user.team_leader_id || ''}
                              onChange={(e) => handleAssignTeamLeader(user.id, e.target.value ? e.target.value : null)}
                              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-blue-400 focus:outline-none max-w-[180px]"
                            >
                              <option value="">No Team Leader</option>
                              {teamLeaders.map(tl => (
                                <option key={tl.id} value={tl.id}>
                                  {tl.full_name || tl.email}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-500 italic">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* METHOD 1 OFFER BUILDER MODAL */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700 p-6 sm:p-8 my-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingOfferId ? 'Edit Job Offer (Method 1)' : 'Method 1: Manual Offer Builder'}
                    </h2>
                    <p className="text-xs text-slate-400">Configure parameters, commission levels, and marketing post template</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="space-y-6">
                {/* 1. Core Corporate Identification */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company / Account Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Teleperformance / Vodafone"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Job Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Technical Support Specialist"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as OfferStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="active">Active (Available for Recruiters)</option>
                      <option value="hold">On Hold</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* 2. Language & Requirements */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="French">French</option>
                      <option value="Italian">Italian</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Level Required</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="B1">B1 (Intermediate)</option>
                      <option value="B2">B2 (Upper-Intermediate)</option>
                      <option value="C1">C1 (Advanced)</option>
                      <option value="Fluent">Fluent / Native</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Work Style</label>
                    <select
                      value={workStyle}
                      onChange={(e) => setWorkStyle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Shift Type</label>
                    <select
                      value={shift}
                      onChange={(e) => setShift(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Day Shift">Day Shift</option>
                      <option value="Night Shift">Night Shift</option>
                      <option value="Rotational">Rotational</option>
                      <option value="24/7">24/7 Shifts</option>
                    </select>
                  </div>
                </div>

                {/* 3. Compensation & Eligibility */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Net Salary Range</label>
                    <input
                      type="text"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. 20,000 - 25,000 EGP"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Location Details</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New Cairo / Maadi"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Transportation</label>
                    <input
                      type="text"
                      value={transport}
                      onChange={(e) => setTransport(e.target.value)}
                      placeholder="e.g. Provided Door to Door"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* 4. Age & Grad Status */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Min Age</label>
                    <input
                      type="number"
                      value={minAge}
                      onChange={(e) => setMinAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Max Age</label>
                    <input
                      type="number"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Graduation Status</label>
                    <select
                      value={gradStatus}
                      onChange={(e) => setGradStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Graduates & Undergrads">Graduates & Undergrads</option>
                      <option value="Graduates Only">Graduates Only</option>
                      <option value="Undergrads Allowed">Undergrads Allowed</option>
                    </select>
                  </div>
                </div>

                {/* 5. Commissions & Cooling Period */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    Commission Structure & Cooling Timer
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Recruiter Commission (EGP)</label>
                      <input
                        type="number"
                        value={recruiterCommission}
                        onChange={(e) => setRecruiterCommission(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Team Leader Commission (EGP)</label>
                      <input
                        type="number"
                        value={tlCommission}
                        onChange={(e) => setTlCommission(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-blue-300 font-bold focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Unit Manager Commission (EGP)</label>
                      <input
                        type="number"
                        value={umCommission}
                        onChange={(e) => setUmCommission(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cooling Period (Days)</label>
                      <select
                        value={coolingPeriodDays}
                        onChange={(e) => setCoolingPeriodDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      >
                        <option value={14}>14 Days</option>
                        <option value={21}>21 Days</option>
                        <option value={30}>30 Days (Standard)</option>
                        <option value={36}>36 Days</option>
                        <option value={45}>45 Days</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 6. Confidential Agency Code & Internal Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Agency Code (Internal Confidential)</label>
                    <input
                      type="text"
                      value={agencyCode}
                      onChange={(e) => setAgencyCode(e.target.value)}
                      placeholder="e.g. ACE-VOX-01"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Internal Notes (Hidden from Candidates)</label>
                    <input
                      type="text"
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="e.g. Target batch starts next Monday, high priority"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 7. Standard Minimized Post Template */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-amber-400 uppercase">
                      Standard Minimized Post Template (Affiliate Link Hook)
                    </label>
                    <button
                      type="button"
                      onClick={generateMinimizedTemplate}
                      className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      Generate from Fields
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={minimizedDescription}
                    onChange={(e) => setMinimizedDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                    placeholder="Recruiter 1-click marketing post text..."
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Note: Recruiter dashboard will replace <code className="text-amber-400">{"{{APPLY_LINK}}"}</code> with their personalized affiliate link (?ref=CODE).
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {formSubmitting ? 'Saving Offer...' : editingOfferId ? 'Update Offer' : 'Publish Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
