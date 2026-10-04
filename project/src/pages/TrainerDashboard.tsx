import React, { useState } from 'react';
import {
  GraduationCap,
  Users as UsersIcon,
  BookOpen,
  FileText,
  File,
  Presentation,
  TrendingUp,
  Upload,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, ProgressBar, PageHeader, Button, StatCard } from '@/components/ui';
import { BarChart } from '@/components/charts';
import { competencies } from '@/data/mockData';
import { useMaterials } from '@/context/MaterialsContext';
import { UploadMaterialModal } from '@/components/UploadMaterialModal';
import type { PageId } from '@/components/AppLayout';

interface TrainerDashboardProps {
  onNavigate?: (page: PageId) => void;
}

const learnerProgress = [
  { name: 'Priya Sharma', dept: 'NSO', overall: 71, gaps: 0, coursesCompleted: 2, status: 'On Track' },
  { name: 'Amit Patel', dept: 'NSO', overall: 58, gaps: 2, coursesCompleted: 1, status: 'Needs Attention' },
  { name: 'Sneha Reddy', dept: 'NSSO', overall: 75, gaps: 1, coursesCompleted: 3, status: 'On Track' },
  { name: 'Vikram Singh', dept: 'NSO', overall: 42, gaps: 3, coursesCompleted: 0, status: 'Critical' },
  { name: 'Deepika Nair', dept: 'CSO', overall: 68, gaps: 1, coursesCompleted: 2, status: 'On Track' },
  { name: 'Rohan Gupta', dept: 'NSO', overall: 80, gaps: 0, coursesCompleted: 4, status: 'Excellent' },
];

const competencyAverages = [
  { label: 'Data Coll.', value: 78, previousValue: 72 },
  { label: 'Stat. Methods', value: 71, previousValue: 65 },
  { label: 'Data Analysis', value: 55, previousValue: 48 },
  { label: 'Data Viz', value: 48, previousValue: 40 },
  { label: 'Python', value: 42, previousValue: 35 },
  { label: 'Survey Design', value: 76, previousValue: 70 },
  { label: 'Nat. Accounts', value: 62, previousValue: 58 },
  { label: 'Data Quality', value: 65, previousValue: 60 },
];

const typeIconMap = {
  pdf: { icon: FileText, color: 'text-error-500' },
  docx: { icon: File, color: 'text-primary-500' },
  pptx: { icon: Presentation, color: 'text-accent-500' },
  text: { icon: FileText, color: 'text-neutral-500' },
};

export function TrainerDashboard({ onNavigate }: TrainerDashboardProps) {
  const { materials, activityLogs, loadMaterialForQuiz } = useMaterials();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const totalMcqs = materials.reduce((sum, m) => sum + (m.mcqsGenerated || 0), 0);

  const handleLaunchQuiz = (mat: any) => {
    loadMaterialForQuiz(mat);
    if (onNavigate) {
      onNavigate('quiz');
    }
  };

  return (
    <>
      <PageHeader
        title="Trainer Dashboard"
        subtitle="Manage learners, upload materials, and monitor competency progress"
      >
        <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
          <Upload size={14} /> Upload Material
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Learners" value="6" icon={<UsersIcon size={20} />} variant="primary" />
        <StatCard
          label="Materials Uploaded"
          value={materials.length}
          icon={<FileText size={20} />}
          variant="secondary"
        />
        <StatCard
          label="Avg Competency"
          value="62%"
          icon={<TrendingUp size={20} />}
          trend={{ value: '+8% from baseline', direction: 'up' }}
          variant="success"
        />
        <StatCard label="MCQs Generated" value={totalMcqs} icon={<Plus size={20} />} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Learner progress table */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Learner Progress Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Learner</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Dept</th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Overall</th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Gaps</th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Courses</th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {learnerProgress.map((learner, i) => (
                  <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="py-3 px-3 font-medium text-neutral-800">{learner.name}</td>
                    <td className="py-3 px-3 text-neutral-500 text-xs">{learner.dept}</td>
                    <td className="py-3 px-3 text-center font-semibold tabular-nums">{learner.overall}%</td>
                    <td className="py-3 px-3 text-center">
                      <span className={learner.gaps === 0 ? 'text-success-600' : learner.gaps <= 1 ? 'text-warning-600' : 'text-error-600 font-semibold'}>
                        {learner.gaps}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums">{learner.coursesCompleted}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={
                          learner.status === 'Excellent' ? 'success' :
                          learner.status === 'On Track' ? 'secondary' :
                          learner.status === 'Needs Attention' ? 'warning' : 'error'
                        }
                      >
                        {learner.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Competency averages chart */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Department Competency Averages</h3>
          <p className="text-xs text-neutral-500 mb-4">All learners under your supervision</p>
          <BarChart data={competencyAverages} height={200} />
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {activityLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                  <BookOpen size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{log.action}</p>
                  <p className="text-xs text-neutral-500 truncate">{log.userName} — {log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Materials management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Uploaded Materials</h3>
            <p className="text-xs text-neutral-500">Curriculum documents for AI quiz generation ({materials.length} files)</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={14} /> Upload New
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materials.map((mat) => {
            const Icon = typeIconMap[mat.type]?.icon || FileText;
            const iconColor = typeIconMap[mat.type]?.color || 'text-error-500';
            return (
              <div
                key={mat.id}
                className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={`${iconColor} shrink-0`} />
                    <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-primary-700">
                      {mat.title}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {mat.uploadedBy} · {mat.pages} {mat.type === 'pptx' ? 'slides' : 'pages'}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <Badge variant="primary">{mat.conceptsExtracted} concepts</Badge>
                    <Badge variant="secondary">{mat.mcqsGenerated} MCQs</Badge>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchQuiz(mat)}
                  className="mt-3.5 pt-2 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <Sparkles size={12} /> Generate / Take Quiz
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upload Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        userRole="trainer"
        onGenerateQuiz={() => {
          if (onNavigate) {
            onNavigate('quiz');
          }
        }}
      />
    </>
  );
}
