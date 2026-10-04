import { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  UserCheck,
  Building,
  CheckCircle2,
  Info,
  Sparkles,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import type { UserRole, OfficerDesignation } from '@/types';
import { useApp } from '@/context/AppContext';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const DESIGNATION_OPTIONS: OfficerDesignation[] = [
  'Junior Statistical Officer (JSO)',
  'Senior Statistical Officer (SSO)',
  'Statistical Investigator',
  'Assistant Statistical Officer',
  'Assistant Director',
  'Deputy Director',
  'Director',
  'Other',
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login, register, officers } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [email, setEmail] = useState('sanjana.officer@mospi.gov.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState<OfficerDesignation>('Junior Statistical Officer (JSO)');
  const [customDesignation, setCustomDesignation] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Quick preset demo users
  const quickProfiles = [
    {
      role: 'officer' as UserRole,
      title: 'Officer (JSO)',
      name: 'Sanjana Verma',
      designation: 'Junior Statistical Officer (JSO)',
      email: 'sanjana.officer@mospi.gov.in',
      icon: Users,
      desc: 'Officer with competency gaps in Data Analysis & Python',
    },
    {
      role: 'officer' as UserRole,
      title: 'Officer (SSO)',
      name: 'Amit Patel',
      designation: 'Senior Statistical Officer (SSO)',
      email: 'amit.patel@mospi.gov.in',
      icon: UserCheck,
      desc: 'Senior Officer focusing on Survey Methodology & Quality',
    },
    {
      role: 'admin' as UserRole,
      title: 'Administrator',
      name: 'Anita Desai',
      designation: '',
      email: 'anita.desai@mospi.gov.in',
      icon: BarChart3,
      desc: 'Platform Administrator managing courses, MCQs & analytics',
    },
  ];

  const handleSelectQuickProfile = (p: (typeof quickProfiles)[0]) => {
    setSelectedRole(p.role);
    setEmail(p.email);
    if (p.designation) {
      setDesignation(p.designation as OfficerDesignation);
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalDesignation =
      selectedRole === 'officer'
        ? designation === 'Other'
          ? customDesignation.trim() || 'Statistical Officer'
          : designation
        : undefined;

    if (mode === 'signin') {
      if (!email.trim()) {
        setError('Please enter your official email address.');
        return;
      }
      login(email.trim(), selectedRole, finalDesignation);
      onLogin(selectedRole);
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your official email address.');
        return;
      }
      if (selectedRole === 'officer' && designation === 'Other' && !customDesignation.trim()) {
        setError('Please specify your officer designation.');
        return;
      }
      register(name.trim(), email.trim(), selectedRole, finalDesignation);
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - branding & SIH Overview */}
      <div className="lg:w-1/2 bg-gradient-to-br from-primary-800 via-primary-900 to-neutral-950 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary-400 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <GraduationCap size={26} className="text-secondary-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">STAT-SKILL HUB</h1>
              <p className="text-xs font-medium text-primary-200 uppercase tracking-widest">
                AI-Enabled Competency & iGOT Learning Engine
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/10 border-white/20 text-secondary-200">
                Official Statistics Capacity Building
              </Badge>
              <Badge variant="default" className="bg-emerald-500/20 border-emerald-400/30 text-emerald-200">
                NLP Semantic Matching
              </Badge>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4 text-white">
              Personalized Competency Assessment & iGOT Course Mapping
            </h2>

            <p className="text-primary-100 text-sm lg:text-base leading-relaxed mb-6">
              Empowering India's Official Statistical System with role-based adaptive assessments,
              automated competency gap detection, and NLP-based semantic matching to curated iGOT Karmayogi courses.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-primary-100">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
                <CheckCircle2 size={16} className="text-secondary-300 shrink-0" />
                <span>Role-Based Access: Officer & Administrator</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
                <CheckCircle2 size={16} className="text-secondary-300 shrink-0" />
                <span>Objective Competency Assessments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
                <CheckCircle2 size={16} className="text-secondary-300 shrink-0" />
                <span>NLP Semantic Matching with iGOT Dataset</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
                <CheckCircle2 size={16} className="text-secondary-300 shrink-0" />
                <span>Admin MCQ Review & Question Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Metrics */}
        <div className="relative z-10 pt-8 mt-8 border-t border-white/10 grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold text-white">8+</p>
            <p className="text-xs text-primary-200">Officer Designations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">24+</p>
            <p className="text-xs text-primary-200">Curated iGOT Courses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">94%</p>
            <p className="text-xs text-primary-200">NLP Match Accuracy</p>
          </div>
        </div>
      </div>

      {/* Right panel - Login / Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-neutral-50 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-neutral-200/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                if (selectedRole === 'officer' && !name) {
                  setName('Sanjana Verma');
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <UserPlus size={16} /> Register Officer / Admin
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-neutral-900">
              {mode === 'signin' ? 'Sign In to STAT-SKILL HUB' : 'Create New Account'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {mode === 'signin'
                ? 'Select your role and enter your official credentials to access your dashboard.'
                : 'Register as a Statistical Officer or Administrator with your official designation.'}
            </p>
          </div>

          {/* Quick Demo Profile Selector */}
          {mode === 'signin' && (
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Quick Demo Profiles (One-Click Select)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickProfiles.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedRole === p.role && email === p.email;
                  return (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => handleSelectQuickProfile(p)}
                      className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/70 shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        {isSelected && <Shield size={14} className="text-primary-600" />}
                      </div>
                      <p className="text-xs font-bold text-neutral-900">{p.title}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{p.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <Info size={16} className="text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (for Registration) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanjana Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            {/* Role Selection Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Select Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('officer')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                    selectedRole === 'officer'
                      ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <Users size={16} className={selectedRole === 'officer' ? 'text-primary-600' : 'text-neutral-400'} />
                  Officer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                    selectedRole === 'admin'
                      ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <BarChart3 size={16} className={selectedRole === 'admin' ? 'text-primary-600' : 'text-neutral-400'} />
                  Administrator
                </button>
              </div>
            </div>

            {/* Officer Designation Selection (Shown ONLY when Officer is selected) */}
            {selectedRole === 'officer' && (
              <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-primary-950">
                    Officer Designation <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-primary-600 font-medium">Learner Context</span>
                </div>

                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value as OfficerDesignation)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {DESIGNATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {designation === 'Other' && (
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Enter Custom Designation:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Statistical Officer Grade I"
                      value={customDesignation}
                      onChange={(e) => setCustomDesignation(e.target.value)}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                )}

                <p className="text-[10px] text-primary-700/80 leading-relaxed">
                  Designation provides contextual learner information. Competency scores are evaluated through objective assessment.
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  placeholder="name@mospi.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-xl bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-xl bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button size="lg" type="submit" className="w-full mt-2 font-semibold shadow-md">
              {mode === 'signin' ? (
                <>
                  Sign In as {selectedRole === 'officer' ? 'Officer' : 'Administrator'}
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Create {selectedRole === 'officer' ? 'Officer' : 'Administrator'} Account
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Prototype disclaimer note */}
          <div className="mt-6 p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-center">
            <p className="text-[11px] text-neutral-500 leading-normal">
              <span className="font-semibold text-neutral-700">Prototype Note:</span> Uses a verified curated course dataset to demonstrate iGOT course mapping and role-based workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
