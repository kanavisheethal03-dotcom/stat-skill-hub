import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Shield,
  UserCheck,
  GraduationCap,
  FileCheck,
} from 'lucide-react';
import { Card, Badge, ProgressBar, StatCard, PageHeader, Button } from '@/components/ui';
import { CompetencyHeatmap, RadarChart, LineChart } from '@/components/charts';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/components/AppLayout';
import { initialScores } from '@/data/mockData';

interface LearnerDashboardProps {
  onNavigate: (page: PageId) => void;
}

export function LearnerDashboard({ onNavigate }: LearnerDashboardProps) {
  const { currentUser, userScores, getOfficerRecommendations, enrollments, courses } = useApp();

  const currentScores = userScores || currentUser.competencyScores || initialScores;
  const overallScore = Math.round(
    currentScores.reduce((sum, s) => sum + s.score, 0) / currentScores.length
  );
  const baselineOverall = Math.round(
    initialScores.reduce((sum, s) => sum + s.score, 0) / initialScores.length
  );
  const improvement = overallScore - baselineOverall;
  const criticalGaps = currentScores.filter((s) => s.level === 'Critical Gap').length;
  const needsImprovementGaps = currentScores.filter((s) => s.level === 'Needs Improvement').length;

  const enrolledList = Object.values(enrollments);
  const completedCount = enrolledList.filter((e) => e.status === 'completed').length;

  // NLP Semantic Recommendations
  const recommendations = getOfficerRecommendations(currentScores).slice(0, 3);

  const radarData = currentScores.map((s) => ({
    label: s.competencyName.split(' ').slice(0, 2).join(' '),
    value: s.score,
    previousValue: s.previousScore || 50,
  }));

  const progressData = [
    { label: 'Week 1', value: 52 },
    { label: 'Week 2', value: 58 },
    { label: 'Week 3', value: 63 },
    { label: 'Week 4', value: 67 },
    { label: 'Week 5', value: 71 },
    { label: 'Week 6', value: overallScore },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome, ${currentUser.name}`}
        subtitle="AI-Enabled Officer Competency Dashboard & iGOT Learning Engine"
      >
        <div className="flex items-center gap-2">
          <Badge variant="success">
            <Flame size={12} /> 6-Day Streak
          </Badge>
          <Button size="sm" onClick={() => onNavigate('assessment')}>
            <FileCheck size={14} /> Take Competency Assessment
          </Button>
        </div>
      </PageHeader>

      {/* ─── 1. Officer Profile & Context Card ─── */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-primary-900 via-primary-800 to-neutral-900 text-white border-0 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-extrabold text-white shrink-0 shadow-inner">
              {currentUser.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-white tracking-tight">{currentUser.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Role: Officer
                </span>
                {currentUser.designation && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-500/20 text-secondary-200 border border-secondary-400/30">
                    Designation: {currentUser.designation}
                  </span>
                )}
              </div>
              <p className="text-xs text-primary-200 mt-1 flex items-center gap-3 flex-wrap">
                <span><strong>Department:</strong> {currentUser.department}</span>
                <span>•</span>
                <span><strong>Official Email:</strong> {currentUser.email}</span>
                <span>•</span>
                <span><strong>Joined:</strong> {new Date(currentUser.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-right max-w-sm shrink-0">
            <p className="text-[11px] text-primary-200 leading-tight">
              <span className="font-semibold text-white">Learner Context:</span> Officer designation provides institutional context. Competency levels are evaluated through objective assessments.
            </p>
          </div>
        </div>
      </Card>

      {/* ─── 2. Key Performance Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Overall Competency"
          value={`${overallScore}%`}
          icon={<Target size={20} />}
          trend={{ value: `${improvement >= 0 ? '+' : ''}${improvement}% from baseline`, direction: improvement >= 0 ? 'up' : 'down' }}
          variant="primary"
        />
        <StatCard
          label="Identified Skill Gaps"
          value={criticalGaps + needsImprovementGaps}
          icon={<AlertCircle size={20} />}
          trend={{ value: `${criticalGaps} Critical Gaps`, direction: criticalGaps > 0 ? 'down' : 'up' }}
          variant={criticalGaps > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="iGOT Courses Completed"
          value={completedCount}
          icon={<Award size={20} />}
          variant="secondary"
        />
        <StatCard
          label="Learning Hours"
          value={`${currentUser.learningHours || 24.5}h`}
          icon={<Clock size={20} />}
          variant="accent"
        />
      </div>

      {/* ─── 3. Competency Profile & Progress ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Radar profile */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-neutral-900">Competency Radar Profile</h3>
            <Badge variant="primary">Assessment</Badge>
          </div>
          <p className="text-xs text-neutral-500 mb-4">Current score vs. Baseline</p>
          <div className="flex justify-center">
            <RadarChart data={radarData} size={280} />
          </div>
        </Card>

        {/* Progress over time */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Competency Growth Trend</h3>
              <p className="text-xs text-neutral-500">Continuous skill building across 6 assessment cycles</p>
            </div>
            <Badge variant="success">
              <TrendingUp size={12} /> +{improvement}% Growth
            </Badge>
          </div>
          <LineChart data={progressData} height={210} />
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <p className="text-xs text-neutral-500">Baseline Score</p>
              <p className="text-lg font-bold text-neutral-700">{baselineOverall}%</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Current Score</p>
              <p className="text-lg font-bold text-primary-600">{overallScore}%</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Target Benchmark</p>
              <p className="text-lg font-bold text-neutral-400">80%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── 4. Heatmap & Competency Breakdown ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-neutral-900">Competency Heatmap</h3>
            <Button size="sm" variant="ghost" onClick={() => onNavigate('gap-analysis')}>
              View Gaps <ArrowRight size={14} />
            </Button>
          </div>
          <p className="text-xs text-neutral-500 mb-4">Color-coded competency ratings across foundational, core, and technical domains</p>
          <CompetencyHeatmap
            data={currentScores.map((s) => ({
              name: s.competencyName,
              category: s.category,
              score: s.score,
            }))}
          />
        </Card>

        {/* Competency Gap Summary */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-neutral-900">Identified Competency Gaps</h3>
              <Badge variant="warning">Action Required</Badge>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Competencies requiring focused learning interventions based on your recent assessment
            </p>

            <div className="space-y-3">
              {currentScores
                .filter((s) => s.level !== 'Strong')
                .slice(0, 4)
                .map((gap) => (
                  <div
                    key={gap.competencyId}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{gap.competencyName}</p>
                      <p className="text-[11px] text-neutral-500">
                        Current Score: <span className="font-semibold text-neutral-800">{gap.score}%</span> · Weight: {gap.weight}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        gap.level === 'Critical Gap'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : gap.level === 'Needs Improvement'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {gap.level}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Mapped to Curated iGOT Courses</span>
            <Button size="sm" onClick={() => onNavigate('learning-path')}>
              View Personalized Path <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

      {/* ─── 5. NLP Semantic Course Recommendations Display ─── */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-100 text-primary-700">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Personalized iGOT Course Recommendations</h3>
              <p className="text-xs text-neutral-500">
                Generated via NLP Semantic Matching Layer · Curated iGOT Course Dataset
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate('learning-path')}>
            View All Recommendations ({recommendations.length}) <ArrowRight size={14} />
          </Button>
        </div>

        {/* Prototype note banner */}
        <div className="mb-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
          <Sparkles size={14} className="text-primary-600 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-neutral-800">Curated iGOT Dataset + NLP Semantic Matching:</span>{' '}
            The NLP layer semantically compares your competency gaps with course names, descriptions, and competency tags.
            <span className="italic block text-neutral-500 mt-0.5">
              "Prototype uses a curated course dataset to demonstrate iGOT course mapping. Live API integration can be added when official API access is available."
            </span>
          </p>
        </div>

        {/* Recommended Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const course = rec.course;
            return (
              <div
                key={course.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-neutral-100 text-neutral-600">
                      ID: {course.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Match: {rec.matchScore}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 leading-snug mb-1 line-clamp-2">
                    {course.title}
                  </h4>

                  <p className="text-[11px] font-semibold text-primary-700 mb-2">
                    Relevant Skill: <span className="text-neutral-800">{rec.relevantSkill || 'Official Statistics'}</span>
                  </p>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-3">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Clock size={11} /> {course.duration}
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-xs px-3 py-1.5"
                    onClick={() => onNavigate('learning-path')}
                  >
                    View Course <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
