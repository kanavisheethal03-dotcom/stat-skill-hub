import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Target,
  Route,
  FileQuestion,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
  Layers,
  Database,
  CheckSquare,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/types';
import { useApp } from '@/context/AppContext';

export type PageId =
  | 'dashboard'
  | 'assessment'
  | 'gap-analysis'
  | 'learning-path'
  | 'igot-courses'
  | 'quiz'
  | 'materials'
  | 'admin-dashboard'
  | 'admin-officers'
  | 'admin-materials'
  | 'admin-mcqs'
  | 'admin-courses'
  | 'trainer-dashboard'
  | 'design-doc';

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  // Officer Views
  { id: 'dashboard', label: 'Officer Dashboard', icon: LayoutDashboard, roles: ['officer', 'learner'] },
  { id: 'assessment', label: 'Competency Assessment', icon: ClipboardList, roles: ['officer', 'learner'] },
  { id: 'gap-analysis', label: 'Competency Gap Analysis', icon: Target, roles: ['officer', 'learner'] },
  { id: 'learning-path', label: 'Personalized Recommendations', icon: Route, roles: ['officer', 'learner'], badge: 'NLP' },
  { id: 'igot-courses', label: 'iGOT Course Catalogue', icon: GraduationCap, roles: ['officer', 'learner'] },
  { id: 'quiz', label: 'Self-Paced Quiz Generator', icon: FileQuestion, roles: ['officer', 'learner', 'trainer'] },
  { id: 'materials', label: 'Learning Materials', icon: BookOpen, roles: ['officer', 'learner', 'trainer'] },

  // Administrator Views
  { id: 'admin-dashboard', label: 'Admin Overview', icon: BarChart3, roles: ['admin'] },
  { id: 'admin-officers', label: 'Officer Management', icon: Users, roles: ['admin'] },
  { id: 'admin-materials', label: 'Learning Materials', icon: Layers, roles: ['admin'] },
  { id: 'admin-mcqs', label: 'MCQ Review & Question Bank', icon: CheckSquare, roles: ['admin'], badge: 'Review' },
  { id: 'admin-courses', label: 'iGOT Course Dataset', icon: Database, roles: ['admin'] },

  // System Architecture
  { id: 'design-doc', label: 'System Design Architecture', icon: FileText, roles: ['officer', 'learner', 'trainer', 'admin'] },
];

interface AppLayoutProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  children: ReactNode;
}

export function AppLayout({ currentPage, onPageChange, children }: AppLayoutProps) {
  const { currentUser, logout, switchDemoRole, questionBank } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Normalize role matching (support 'officer' and legacy 'learner')
  const currentRole = currentUser.role === 'learner' ? 'officer' : currentUser.role;

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(currentRole as UserRole) || (currentRole === 'officer' && item.roles.includes('learner'))
  );

  const pendingMcqCount = questionBank.filter((q) => q.status === 'Pending Review').length;

  const handleNavClick = (page: PageId) => {
    onPageChange(page);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative z-40 flex flex-col bg-neutral-900 text-neutral-300 transition-all duration-300 h-full border-r border-neutral-800 shadow-xl',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'left-0' : '-left-64 lg:left-0'
        )}
      >
        {/* Platform Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-neutral-800 shrink-0 bg-neutral-950/40">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 text-white shrink-0 shadow-md">
            <GraduationCap size={20} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-extrabold text-white tracking-wide whitespace-nowrap">STAT-SKILL HUB</p>
              <p className="text-[10px] text-primary-300 font-medium whitespace-nowrap">MoSPI · iGOT Engine</p>
            </div>
          )}
        </div>

        {/* Current Active Role Badge banner */}
        {!collapsed && (
          <div className="px-3 py-2.5 mx-2 my-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  currentRole === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
                )}
              />
              <div className="truncate">
                <p className="text-[11px] font-bold text-neutral-200 capitalize">
                  {currentRole === 'admin' ? 'Administrator' : 'Officer'} Mode
                </p>
                {currentRole === 'officer' && currentUser.designation && (
                  <p className="text-[10px] text-neutral-400 truncate">{currentUser.designation}</p>
                )}
              </div>
            </div>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider',
                currentRole === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              )}
            >
              {currentRole}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isMcqItem = item.id === 'admin-mcqs';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={17} className="shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                    {isMcqItem && pendingMcqCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-neutral-950 ml-1">
                        {pendingMcqCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Demo Role Switcher */}
        {!collapsed && (
          <div className="px-3 py-2.5 border-t border-neutral-800 bg-neutral-950/40">
            <p className="text-[10px] text-neutral-400 mb-1.5 font-bold uppercase tracking-wider">
              Quick Role Switch (Demo)
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  switchDemoRole('officer');
                  onPageChange('dashboard');
                }}
                className={cn(
                  'py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1',
                  currentRole === 'officer'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                )}
              >
                <Users size={12} /> Officer
              </button>
              <button
                onClick={() => {
                  switchDemoRole('admin');
                  onPageChange('admin-dashboard');
                }}
                className={cn(
                  'py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1',
                  currentRole === 'admin'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                )}
              >
                <Shield size={12} /> Admin
              </button>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <div className="p-2 border-t border-neutral-800 bg-neutral-950/70">
          <button
            onClick={logout}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors',
              collapsed && 'justify-center'
            )}
            title="Sign Out"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-9 border-t border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with Role & Designation Badge */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
            >
              <ChevronRight size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">{currentUser.department}</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  )}
                >
                  {currentUser.role === 'admin' ? 'Administrator' : 'Officer'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                STAT-SKILL HUB: AI-Enabled Competency Assessment & iGOT Learning Engine
              </p>
            </div>
          </div>

          {/* User Profile Bar */}
          <div className="flex items-center gap-3">
            {/* Prototype Curated Dataset Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[11px] font-medium">
              <Sparkles size={12} className="text-primary-600" />
              <span>Curated iGOT Dataset + NLP Matcher</span>
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-xs border border-primary-200">
                {currentUser.avatar}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-neutral-900 leading-tight">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {currentUser.role === 'officer' && currentUser.designation ? (
                    <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                      {currentUser.designation}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-medium">
                      Platform Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50/70">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
