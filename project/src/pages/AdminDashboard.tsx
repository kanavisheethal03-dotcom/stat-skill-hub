import React, { useState } from 'react';
import {
  BarChart3,
  Users as UsersIcon,
  Building2,
  TrendingUp,
  Award,
  Download,
  FileBarChart,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Upload,
  BookOpen,
  Sparkles,
  Layers,
  Database,
  CheckSquare,
  Eye,
  AlertTriangle,
  ExternalLink,
  Shield,
  FileText,
  UserCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { Card, Badge, ProgressBar, PageHeader, Button, StatCard } from '@/components/ui';
import { BarChart, DonutChart, LineChart } from '@/components/charts';
import { useApp } from '@/context/AppContext';
import type { User, Course, ManagedQuestion, LearningMaterial, OfficerDesignation, QuestionReviewStatus, Difficulty } from '@/types';
import { UploadMaterialModal } from '@/components/UploadMaterialModal';

interface AdminDashboardProps {
  initialTab?: 'overview' | 'officers' | 'materials' | 'mcqs' | 'courses';
}

export function AdminDashboard({ initialTab = 'overview' }: AdminDashboardProps) {
  const {
    officers,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    questionBank,
    approveQuestion,
    rejectQuestion,
    updateQuestion,
    addQuestion,
    deleteQuestion,
    materials,
    deleteMaterial,
    activityLogs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'officers' | 'materials' | 'mcqs' | 'courses'>(initialTab);

  // ─── Officer Management State ───
  const [officerSearch, setOfficerSearch] = useState('');
  const [designationFilter, setDesignationFilter] = useState<string>('All');
  const [selectedOfficer, setSelectedOfficer] = useState<User | null>(null);

  // ─── Question Bank (MCQ Review) State ───
  const [mcqStatusFilter, setMcqStatusFilter] = useState<'All' | QuestionReviewStatus>('All');
  const [mcqSearch, setMcqSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<ManagedQuestion | null>(null);
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);

  // ─── Course Dataset Management State ───
  const [courseSearch, setCourseSearch] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);

  // ─── Materials State ───
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // ─── Aggregated Statistics ───
  const totalOfficers = officers.length;
  const assessedOfficers = officers.filter((o) => o.assessmentCompleted).length;
  const assessmentCompletionRate = Math.round((assessedOfficers / (totalOfficers || 1)) * 100);

  const pendingMcqs = questionBank.filter((q) => q.status === 'Pending Review').length;
  const approvedMcqs = questionBank.filter((q) => q.status === 'Approved').length;
  const rejectedMcqs = questionBank.filter((q) => q.status === 'Rejected').length;

  // Breakdown by Designation
  const designationCounts: Record<string, number> = {};
  officers.forEach((o) => {
    const des = o.designation || 'Other';
    const key = des.includes('JSO')
      ? 'JSO'
      : des.includes('SSO')
      ? 'SSO'
      : des.includes('Investigator')
      ? 'Investigator'
      : des.includes('Assistant Director')
      ? 'Asst. Director'
      : des.includes('Deputy Director')
      ? 'Dy. Director'
      : des.includes('Director')
      ? 'Director'
      : 'Other';
    designationCounts[key] = (designationCounts[key] || 0) + 1;
  });

  const designationChartData = Object.entries(designationCounts).map(([label, value]) => ({
    label,
    value,
  }));

  const competencyDistribution = [
    { label: 'Strong (>=80%)', value: 3, color: '#22c55e' },
    { label: 'Moderate (60-79%)', value: 3, color: '#14b8a6' },
    { label: 'Needs Impr. (40-59%)', value: 1, color: '#f97316' },
    { label: 'Critical Gap (<40%)', value: 1, color: '#ef4444' },
  ];

  // ─── Filtered Lists ───
  const filteredOfficers = officers.filter((o) => {
    const matchQuery =
      o.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(officerSearch.toLowerCase()) ||
      (o.designation && o.designation.toLowerCase().includes(officerSearch.toLowerCase()));

    const matchDesignation =
      designationFilter === 'All' ||
      (designationFilter === 'JSO' && o.designation?.includes('JSO')) ||
      (designationFilter === 'SSO' && o.designation?.includes('SSO')) ||
      (designationFilter === 'Statistical Investigator' && o.designation?.includes('Investigator')) ||
      (designationFilter === 'Assistant Director' && o.designation?.includes('Assistant Director')) ||
      (designationFilter === 'Other' &&
        !o.designation?.includes('JSO') &&
        !o.designation?.includes('SSO') &&
        !o.designation?.includes('Investigator') &&
        !o.designation?.includes('Assistant Director'));

    return matchQuery && matchDesignation;
  });

  const filteredMcqs = questionBank.filter((q) => {
    const matchStatus = mcqStatusFilter === 'All' || q.status === mcqStatusFilter;
    const matchSearch =
      !mcqSearch ||
      q.question.toLowerCase().includes(mcqSearch.toLowerCase()) ||
      q.sourceReference.toLowerCase().includes(mcqSearch.toLowerCase()) ||
      q.competencyTag.toLowerCase().includes(mcqSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredCourses = courses.filter((c) => {
    return (
      !courseSearch ||
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.topics.some((t) => t.toLowerCase().includes(courseSearch.toLowerCase()))
    );
  });

  return (
    <>
      <PageHeader
        title="Administrator Control Center"
        subtitle="Platform governance, officer management, question review, and iGOT course catalogue management"
      >
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="bg-primary-50 text-primary-700 border-primary-200">
            <Shield size={12} /> Administrator Authorized
          </Badge>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Download size={14} /> Export Report
          </Button>
        </div>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-200/80 rounded-2xl mb-6 overflow-x-auto whitespace-nowrap">
        {[
          { id: 'overview', label: 'Admin Overview', icon: BarChart3 },
          { id: 'officers', label: `Officer Management (${totalOfficers})`, icon: UsersIcon },
          { id: 'materials', label: `Learning Materials (${materials.length})`, icon: Layers },
          {
            id: 'mcqs',
            label: `MCQ Review & Question Bank (${questionBank.length})`,
            icon: CheckSquare,
            badge: pendingMcqs > 0 ? `${pendingMcqs} Pending` : undefined,
          },
          { id: 'courses', label: `iGOT Course Dataset (${courses.length})`, icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-primary-600' : 'text-neutral-500'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-neutral-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: OVERVIEW & ANALYTICS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Registered Officers"
              value={totalOfficers}
              icon={<UsersIcon size={20} />}
              trend={{ value: 'Across 8 Designations', direction: 'up' }}
              variant="primary"
            />
            <StatCard
              label="Assessment Completion"
              value={`${assessmentCompletionRate}%`}
              icon={<UserCheck size={20} />}
              trend={{ value: `${assessedOfficers} of ${totalOfficers} Completed`, direction: 'up' }}
              variant="success"
            />
            <StatCard
              label="Available iGOT Courses"
              value={courses.length}
              icon={<Database size={20} />}
              trend={{ value: 'Curated Dataset Active', direction: 'up' }}
              variant="secondary"
            />
            <StatCard
              label="Question Bank Status"
              value={`${approvedMcqs} Approved`}
              icon={<CheckSquare size={20} />}
              trend={{ value: `${pendingMcqs} Pending Review`, direction: pendingMcqs > 0 ? 'down' : 'up' }}
              variant={pendingMcqs > 0 ? 'warning' : 'accent'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Officers by Designation Chart */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">Officers by Designation</h3>
                  <p className="text-xs text-neutral-500">Distribution across statistical cadres in the platform</p>
                </div>
                <Badge variant="secondary">Cadre Breakdown</Badge>
              </div>
              <BarChart data={designationChartData} height={220} />
            </Card>

            {/* Competency Level Distribution */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">Competency Level Distribution</h3>
              <p className="text-xs text-neutral-500 mb-4">Overall evaluated officer skill proficiency</p>
              <div className="flex justify-center">
                <DonutChart
                  segments={competencyDistribution}
                  size={190}
                  centerValue={`${assessedOfficers}`}
                  centerLabel="Evaluated"
                />
              </div>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              className="p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActiveTab('officers')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary-50 text-primary-600 group-hover:scale-105 transition-transform">
                  <UsersIcon size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Manage Officers</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Filter by cadre, view scores & progress</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActiveTab('mcqs')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Review AI-Generated MCQs</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {pendingMcqs} questions pending administrative approval
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActiveTab('courses')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary-50 text-secondary-600 group-hover:scale-105 transition-transform">
                  <Database size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Manage iGOT Course Dataset</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Add, edit tags & URLs for NLP matching</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: OFFICER MANAGEMENT
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'officers' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Registered Statistical Officers</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Monitor individual designations, competency assessment scores, and learning paths
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search officer name, designation..."
                    value={officerSearch}
                    onChange={(e) => setOfficerSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Designation Filters */}
            <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-neutral-500 mr-2 flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              {['All', 'JSO', 'SSO', 'Statistical Investigator', 'Assistant Director', 'Other'].map((des) => (
                <button
                  key={des}
                  onClick={() => setDesignationFilter(des)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    designationFilter === des
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {des === 'All' ? 'All Officers' : des}
                </button>
              ))}
            </div>

            {/* Officers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Officer</th>
                    <th className="py-3 px-3">Cadre / Designation</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3 text-center">Assessment Status</th>
                    <th className="py-3 px-3 text-center">Overall Score</th>
                    <th className="py-3 px-3 text-center">Courses Completed</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOfficers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {officer.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900">{officer.name}</p>
                            <p className="text-[10px] text-neutral-400">{officer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-800">
                        <span className="px-2 py-0.5 rounded-md text-[11px] bg-neutral-100 text-neutral-700 border border-neutral-200">
                          {officer.designation || 'Statistical Officer'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600">{officer.department}</td>
                      <td className="py-3 px-3 text-center">
                        {officer.assessmentCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-700 bg-success-50 border border-success-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={11} /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Clock size={11} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {officer.assessmentScore ? (
                          <span className="font-bold text-xs text-neutral-900">{officer.assessmentScore}%</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center tabular-nums font-semibold text-neutral-700">
                        {officer.coursesCompletedCount || 0} / {officer.coursesEnrolledCount || 0}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] py-1 px-2.5"
                          onClick={() => setSelectedOfficer(officer)}
                        >
                          <Eye size={12} /> View Results
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredOfficers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-neutral-400">
                        No officers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Officer Detail Modal */}
          {selectedOfficer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                      {selectedOfficer.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">{selectedOfficer.name}</h3>
                      <p className="text-xs text-neutral-500">
                        {selectedOfficer.designation} · {selectedOfficer.department}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOfficer(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                      <p className="text-[10px] text-neutral-500 uppercase font-semibold">Assessment Score</p>
                      <p className="text-lg font-bold text-primary-600 mt-0.5">
                        {selectedOfficer.assessmentScore || 70}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                      <p className="text-[10px] text-neutral-500 uppercase font-semibold">Courses Done</p>
                      <p className="text-lg font-bold text-neutral-800 mt-0.5">
                        {selectedOfficer.coursesCompletedCount || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                      <p className="text-[10px] text-neutral-500 uppercase font-semibold">Learning Hours</p>
                      <p className="text-lg font-bold text-neutral-800 mt-0.5">
                        {selectedOfficer.learningHours || 18}h
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                      Competency Breakdown
                    </h4>
                    <div className="space-y-2">
                      {(selectedOfficer.competencyScores || []).map((score) => (
                        <div
                          key={score.competencyId}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        >
                          <span className="font-semibold text-neutral-800">{score.competencyName}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-neutral-900">{score.score}%</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                score.level === 'Strong'
                                  ? 'bg-green-100 text-green-700'
                                  : score.level === 'Moderate'
                                  ? 'bg-blue-100 text-blue-700'
                                  : score.level === 'Needs Improvement'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {score.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-100 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedOfficer(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 3: LEARNING MATERIALS MANAGEMENT
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Official Learning Materials & Training Circulars</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Upload official NSSTA manuals, government circulars, and textbooks used for AI question generation
                </p>
              </div>
              <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
                <Upload size={14} /> Upload New Material
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-600">
                        {mat.type}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(mat.uploadedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 mb-1 line-clamp-2">{mat.title}</h4>
                    <p className="text-xs text-neutral-500 mb-3">Uploaded by {mat.uploadedBy} · {mat.pages} pages</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="primary">{mat.conceptsExtracted} Concepts</Badge>
                      <Badge variant="secondary">{mat.mcqsGenerated} MCQs</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mat.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-600">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[10px] text-success-700 font-bold bg-success-50 px-2 py-0.5 rounded">
                      Ready for Question Gen
                    </span>
                    <button
                      onClick={() => deleteMaterial(mat.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Material"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <UploadMaterialModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            userRole="admin"
          />
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 4: QUESTION BANK & AI-MCQ REVIEW WORKFLOW
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'mcqs' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">MCQ Review & Question Bank Management</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Authorize, edit, or reject AI-generated questions before they are served in official competency assessments
                </p>
              </div>
              <Button size="sm" onClick={() => setIsNewQuestionModalOpen(true)}>
                <Plus size={14} /> Add New Question
              </Button>
            </div>

            {/* Purpose Banner */}
            <div className="p-3 mb-5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p>
                <span className="font-bold">Administrative Quality Control:</span> All AI-extracted MCQs remain in{' '}
                <span className="font-bold text-amber-700">"Pending Review"</span> status until verified and approved by
                authorized administrators or NSSTA training officers. Only <strong>Approved</strong> questions are served in learner assessments.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['All', 'Pending Review', 'Approved', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMcqStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mcqStatusFilter === st
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {st === 'All' ? `All Questions (${questionBank.length})` : `${st}`}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search questions or reference..."
                  value={mcqSearch}
                  onChange={(e) => setMcqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3.5">
              {filteredMcqs.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    q.status === 'Pending Review'
                      ? 'border-amber-300 bg-amber-50/20'
                      : q.status === 'Approved'
                      ? 'border-neutral-200 bg-white'
                      : 'border-red-200 bg-red-50/20 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                        {q.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          q.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : q.status === 'Pending Review'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {q.status}
                      </span>
                      <Badge
                        variant={
                          q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'error'
                        }
                        className="text-[10px] capitalize"
                      >
                        {q.difficulty}
                      </Badge>
                      <span className="text-[11px] text-neutral-400">Competency: {q.competencyTag}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {q.status !== 'Approved' && (
                        <button
                          onClick={() => approveQuestion(q.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                      )}
                      {q.status !== 'Rejected' && (
                        <button
                          onClick={() => rejectQuestion(q.id)}
                          className="px-2.5 py-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                        title="Edit Question"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-neutral-900 mb-2">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3 text-xs">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border ${
                          optIdx === q.correctAnswer
                            ? 'border-emerald-300 bg-emerald-50/60 font-semibold text-emerald-900'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>

                  {q.sourceReference && (
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1 bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <BookOpen size={11} className="text-neutral-400 shrink-0" />
                      <span><strong>Source Reference:</strong> {q.sourceReference}</span>
                    </p>
                  )}
                </div>
              ))}

              {filteredMcqs.length === 0 && (
                <div className="text-center py-8 text-neutral-400">
                  No questions match your current filter.
                </div>
              )}
            </div>
          </Card>

          {/* Edit MCQ Modal */}
          {editingQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900">Edit Assessment Question</h3>
                  <button onClick={() => setEditingQuestion(null)} className="p-1.5 text-neutral-400 hover:text-neutral-700">
                    <X size={18} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateQuestion(editingQuestion.id, editingQuestion);
                    setEditingQuestion(null);
                  }}
                  className="p-6 overflow-y-auto space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Question Text</label>
                    <textarea
                      rows={3}
                      value={editingQuestion.question}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  {editingQuestion.options.map((opt, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-neutral-700">Option {String.fromCharCode(65 + idx)}</label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={editingQuestion.correctAnswer === idx}
                            onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: idx })}
                          />
                          <span className="text-[10px] text-emerald-700 font-bold">Mark Correct</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editingQuestion.options];
                          newOpts[idx] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Difficulty</label>
                      <select
                        value={editingQuestion.difficulty}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as Difficulty })}
                        className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Status</label>
                      <select
                        value={editingQuestion.status}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, status: e.target.value as QuestionReviewStatus })}
                        className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Source Reference</label>
                    <input
                      type="text"
                      value={editingQuestion.sourceReference || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, sourceReference: e.target.value })}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Explanation</label>
                    <textarea
                      rows={2}
                      value={editingQuestion.explanation || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingQuestion(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Question Modal */}
          {isNewQuestionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900">Add Question to Question Bank</h3>
                  <button onClick={() => setIsNewQuestionModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700">
                    <X size={18} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    addQuestion({
                      question: form.qText.value,
                      options: [form.optA.value, form.optB.value, form.optC.value, form.optD.value],
                      correctAnswer: parseInt(form.correctOpt.value, 10),
                      difficulty: form.diff.value,
                      competencyTag: form.compTag.value,
                      sourceReference: form.sourceRef.value,
                      explanation: form.expl.value,
                      status: 'Approved',
                    });
                    setIsNewQuestionModalOpen(false);
                  }}
                  className="p-6 overflow-y-auto space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Question Text *</label>
                    <textarea name="qText" rows={2} required className="w-full p-2 border border-neutral-300 rounded-lg" />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-neutral-700">Answer Options *</label>
                    <input name="optA" placeholder="Option A" required className="w-full px-3 py-1.5 border rounded-lg" />
                    <input name="optB" placeholder="Option B" required className="w-full px-3 py-1.5 border rounded-lg" />
                    <input name="optC" placeholder="Option C" required className="w-full px-3 py-1.5 border rounded-lg" />
                    <input name="optD" placeholder="Option D" required className="w-full px-3 py-1.5 border rounded-lg" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Correct Option</label>
                      <select name="correctOpt" className="w-full px-2 py-1.5 border rounded-lg">
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Difficulty</label>
                      <select name="diff" className="w-full px-2 py-1.5 border rounded-lg">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Competency</label>
                      <select name="compTag" className="w-full px-2 py-1.5 border rounded-lg">
                        <option value="c3">Data Analysis</option>
                        <option value="c5">Python for Statistics</option>
                        <option value="c4">Data Visualization</option>
                        <option value="c2">Statistical Methods</option>
                        <option value="c6">Survey Design</option>
                        <option value="c7">National Accounts</option>
                        <option value="c8">Data Quality</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Source Reference</label>
                    <input name="sourceRef" placeholder="Manual / Document reference" className="w-full px-3 py-1.5 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Explanation</label>
                    <textarea name="expl" rows={2} placeholder="Explanation for answer" className="w-full p-2 border rounded-lg" />
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewQuestionModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Add to Bank
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 5: iGOT COURSE DATASET MANAGEMENT (SYNCED WITH NLP MATCHER)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Curated iGOT Course Dataset Management</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage the verified iGOT dataset. Changes made here immediately update the NLP Semantic Recommendation Engine for Officers.
                </p>
              </div>
              <Button size="sm" onClick={() => setIsNewCourseModalOpen(true)}>
                <Plus size={14} /> Add New Course
              </Button>
            </div>

            {/* Prototype note banner */}
            <div className="p-3 mb-5 rounded-xl bg-neutral-100 border border-neutral-200 flex items-start gap-2 text-xs text-neutral-600">
              <Sparkles size={15} className="text-primary-600 shrink-0 mt-0.5" />
              <p>
                <span className="font-semibold text-neutral-800">Live NLP Sync:</span> Updating course descriptions,
                competency tags, or titles instantly recalculates semantic match scores on all officer dashboards.
                <span className="italic block text-neutral-500 mt-0.5">
                  "Prototype uses a curated course dataset to demonstrate iGOT course mapping. Live API integration can be added when official API access is available."
                </span>
              </p>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search courses by title, topic, or ID..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Course ID</th>
                    <th className="py-2.5 px-3">Title & Provider</th>
                    <th className="py-2.5 px-3">Competency Tags</th>
                    <th className="py-2.5 px-3 text-center">Difficulty</th>
                    <th className="py-2.5 px-3 text-center">Duration</th>
                    <th className="py-2.5 px-3 text-center">Portal URL</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-600">{c.id}</td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-bold text-neutral-900 line-clamp-1">{c.title}</p>
                        <p className="text-[10px] text-neutral-500 line-clamp-1">{c.provider}</p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {c.topics.slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-100 text-neutral-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge
                          variant={c.difficulty === 'easy' ? 'success' : c.difficulty === 'medium' ? 'warning' : 'error'}
                          className="capitalize text-[10px]"
                        >
                          {c.difficulty}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center text-neutral-600">{c.duration}</td>
                      <td className="py-3 px-3 text-center">
                        {c.igotUrl ? (
                          <a
                            href={c.igotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 text-[11px] font-semibold"
                          >
                            <ExternalLink size={11} /> Link
                          </a>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingCourse(c)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                            title="Edit Course"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteCourse(c.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete Course"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Edit Course Modal */}
          {editingCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900">Edit iGOT Course ({editingCourse.id})</h3>
                  <button onClick={() => setEditingCourse(null)} className="p-1.5 text-neutral-400 hover:text-neutral-700">
                    <X size={18} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateCourse(editingCourse.id, editingCourse);
                    setEditingCourse(null);
                  }}
                  className="p-6 overflow-y-auto space-y-3.5 text-xs"
                >
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Course Title *</label>
                    <input
                      type="text"
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Provider</label>
                      <input
                        type="text"
                        value={editingCourse.provider}
                        onChange={(e) => setEditingCourse({ ...editingCourse, provider: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Duration</label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Skill / Competency Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={editingCourse.topics.join(', ')}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          topics: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">iGOT Portal URL</label>
                    <input
                      type="url"
                      value={editingCourse.igotUrl || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, igotUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingCourse(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save & Sync NLP
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Course Modal */}
          {isNewCourseModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900">Add New iGOT Course to Dataset</h3>
                  <button onClick={() => setIsNewCourseModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700">
                    <X size={18} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = e.target as any;
                    addCourse({
                      id: f.cId.value.trim() || undefined,
                      title: f.cTitle.value.trim(),
                      description: f.cDesc.value.trim(),
                      provider: f.cProvider.value.trim() || 'iGOT Karmayogi Bharat',
                      duration: f.cDuration.value.trim() || '6 hours',
                      durationHours: 6,
                      difficulty: f.cDiff.value,
                      source: 'igot',
                      topics: f.cTags.value.split(',').map((t: string) => t.trim()).filter(Boolean),
                      competencyTags: ['c3'],
                      igotUrl: f.cUrl.value.trim() || 'https://igotkarmayogi.gov.in/',
                      rating: 4.6,
                      enrolled: 500,
                      ratingCount: 50,
                    });
                    setIsNewCourseModalOpen(false);
                  }}
                  className="p-6 overflow-y-auto space-y-3.5 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">Course ID</label>
                      <input name="cId" placeholder="e.g. IGOT-STAT-101" className="w-full px-3 py-1.5 border rounded-lg font-mono" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Difficulty</label>
                      <select name="cDiff" className="w-full px-3 py-1.5 border rounded-lg">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Course Name / Title *</label>
                    <input name="cTitle" placeholder="e.g. Advanced Survey Data Analytics" required className="w-full px-3 py-1.5 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Course Description *</label>
                    <textarea name="cDesc" rows={3} placeholder="Comprehensive description for NLP matching..." required className="w-full p-2 border rounded-lg" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Provider</label>
                      <input name="cProvider" defaultValue="iGOT Karmayogi Bharat (MoSPI)" className="w-full px-3 py-1.5 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Duration</label>
                      <input name="cDuration" defaultValue="8 hours" className="w-full px-3 py-1.5 border rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Competency & Topic Tags (Comma Separated)</label>
                    <input name="cTags" placeholder="e.g. Data Analysis, Sampling, Tabulation" defaultValue="Data Analysis, Statistics" className="w-full px-3 py-1.5 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Course URL</label>
                    <input name="cUrl" defaultValue="https://igotkarmayogi.gov.in/" className="w-full px-3 py-1.5 border rounded-lg font-mono text-[11px]" />
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewCourseModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Add Course to Dataset
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
