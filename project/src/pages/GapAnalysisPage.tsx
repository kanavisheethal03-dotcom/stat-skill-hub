import {
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, PageHeader, Button } from '@/components/ui';
import { CompetencyHeatmap, BarChart } from '@/components/charts';
import { initialScores } from '@/data/mockData';
import { IgotRecommendations } from '@/components/IgotRecommendations';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/components/AppLayout';
import type { CompetencyLevel } from '@/types';
import { cn } from '@/utils/cn';

interface GapAnalysisPageProps {
  onNavigate: (page: PageId) => void;
}

const levelConfig: Record<CompetencyLevel, { color: string; variant: 'success' | 'secondary' | 'warning' | 'error'; description: string }> = {
  'Strong': { color: 'text-success-600', variant: 'success', description: 'Score >= 80% — Proficient in this competency' },
  'Moderate': { color: 'text-secondary-600', variant: 'secondary', description: 'Score 60-79% — Solid foundation with room for growth' },
  'Needs Improvement': { color: 'text-warning-600', variant: 'warning', description: 'Score 40-59% — Significant gaps requiring targeted training' },
  'Critical Gap': { color: 'text-error-600', variant: 'error', description: 'Score < 40% — Urgent intervention needed' },
};

export function GapAnalysisPage({ onNavigate }: GapAnalysisPageProps) {
  const { userScores, currentUser } = useApp();

  const activeScores = userScores || currentUser.competencyScores || initialScores;
  const sortedByPriority = [...activeScores].sort((a, b) => b.impactScore - a.impactScore);

  const levelCounts = activeScores.reduce(
    (acc, s) => {
      acc[s.level] = (acc[s.level] || 0) + 1;
      return acc;
    },
    {} as Record<CompetencyLevel, number>
  );

  const barData = activeScores.map((s) => {
    const prev = initialScores.find((i) => i.competencyId === s.competencyId);
    return {
      label: s.competencyName.split(' ').slice(0, 2).join(' '),
      value: s.score,
      previousValue: prev?.score || 50,
    };
  });

  return (
    <>
      <PageHeader
        title="Competency Gap Analysis"
        subtitle="AI-powered analysis of your assessment results with prioritized improvement recommendations"
      >
        <Button size="sm" onClick={() => onNavigate('learning-path')}>
          <Sparkles size={14} /> View Recommendations
        </Button>
      </PageHeader>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(Object.keys(levelConfig) as CompetencyLevel[]).map((level) => (
          <Card key={level} className="p-4" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500">{level}</p>
                <p className={cn('text-2xl font-bold mt-1', levelConfig[level].color)}>
                  {levelCounts[level] || 0}
                </p>
              </div>
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  levelConfig[level].variant === 'success' && 'bg-success-50',
                  levelConfig[level].variant === 'secondary' && 'bg-secondary-50',
                  levelConfig[level].variant === 'warning' && 'bg-warning-50',
                  levelConfig[level].variant === 'error' && 'bg-error-50'
                )}
              >
                {level === 'Strong' ? (
                  <CheckCircle2 size={20} className={levelConfig[level].color} />
                ) : (
                  <AlertCircle size={20} className={levelConfig[level].color} />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bar chart comparison */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Score Comparison: Baseline vs. Current</h3>
            <p className="text-xs text-neutral-500">Evaluated competency scores across official statistical domains</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-neutral-300" />
              <span className="text-neutral-500">Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary-500" />
              <span className="text-neutral-500">Current</span>
            </div>
          </div>
        </div>
        <BarChart data={barData} height={240} />
      </Card>

      {/* Heatmap */}
      <Card className="p-6 mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Competency Heatmap</h3>
        <p className="text-xs text-neutral-500 mb-4">Color-coded by performance level</p>
        <CompetencyHeatmap
          data={activeScores.map((s) => ({
            name: s.competencyName,
            category: s.category,
            score: s.score,
          }))}
        />
      </Card>

      {/* Priority table */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Priority-Ranked Competency Gaps</h3>
            <p className="text-xs text-neutral-500">Sorted by impact score (weight × gap size)</p>
          </div>
          <Button size="sm" onClick={() => onNavigate('learning-path')}>
            View Recommendations <ArrowRight size={14} />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Priority</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Competency</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Score</th>
                <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Change</th>
                <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Level</th>
                <th className="text-center py-2 px-3 font-medium text-neutral-500 text-xs uppercase tracking-wide">Impact</th>
              </tr>
            </thead>
            <tbody>
              {sortedByPriority.map((score, i) => {
                const change = score.previousScore !== undefined ? score.score - score.previousScore : 0;
                const config = levelConfig[score.level];
                return (
                  <tr
                    key={score.competencyId}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className={cn(
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                        i < 2 ? 'bg-error-100 text-error-700' : i < 4 ? 'bg-warning-100 text-warning-700' : 'bg-neutral-100 text-neutral-600'
                      )}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-800">{score.competencyName}</td>
                    <td className="py-3 px-3 text-neutral-500 text-xs">{score.category}</td>
                    <td className="py-3 px-3 text-center font-semibold tabular-nums">{score.score}%</td>
                    <td className="py-3 px-3 text-center">
                      {change > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-success-600 text-xs font-medium">
                          <TrendingUp size={12} /> +{change}
                        </span>
                      ) : change < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-error-600 text-xs font-medium">
                          <TrendingDown size={12} /> {change}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-neutral-400 text-xs">
                          <Minus size={12} />
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={config.variant}>{score.level}</Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-xs font-semibold tabular-nums text-neutral-700">
                        {score.impactScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Algorithm explanation */}
      <Card className="p-6 bg-neutral-50 border-neutral-200 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} className="text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-900">How Gap Analysis & Scoring Operates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
          <div>
            <p className="font-medium text-neutral-800 mb-1">Classification Rules</p>
            <ul className="text-xs space-y-1 text-neutral-500">
              <li>Strong: Score 80% or above</li>
              <li>Moderate: Score 60-79%</li>
              <li>Needs Improvement: Score 40-59%</li>
              <li>Critical Gap: Score below 40%</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-neutral-800 mb-1">Priority Formula</p>
            <p className="text-xs text-neutral-500">
              Impact Score = Competency Weight × (100 - Score) / 10
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Higher impact score = prioritized training intervention in the NLP semantic matching pipeline.
            </p>
          </div>
        </div>
      </Card>

      {/* ─── iGOT Karmayogi NLP Recommendations Component ─── */}
      <IgotRecommendations
        gaps={activeScores}
        maxGaps={3}
      />
    </>
  );
}
