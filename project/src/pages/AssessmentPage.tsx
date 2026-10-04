import { useState, useMemo } from 'react';
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  Sparkles,
  Shield,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar, PageHeader } from '@/components/ui';
import { competencies, assessmentQuestions as defaultAssessmentQuestions } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/components/AppLayout';
import type { CompetencyScore, CompetencyLevel } from '@/types';
import { cn } from '@/utils/cn';

interface AssessmentPageProps {
  onNavigate: (page: PageId) => void;
}

export function AssessmentPage({ onNavigate }: AssessmentPageProps) {
  const { questionBank, updateUserAssessment, currentUser } = useApp();

  // Standardize competency assessment to strictly 25 questions
  const activeQuestionList = useMemo(() => {
    const approved = questionBank.filter((q) => q.status === 'Approved');
    const sourcePool = approved.length >= 25 ? approved : defaultAssessmentQuestions;

    // Group by competency (c1 to c8)
    const byComp: Record<string, typeof sourcePool> = {};
    competencies.forEach((c) => {
      byComp[c.id] = [];
    });

    sourcePool.forEach((q) => {
      const tag = ('competencyTag' in q ? q.competencyTag : (q as any).competencyId) || 'c1';
      if (byComp[tag]) {
        byComp[tag].push(q);
      } else {
        byComp['c1'].push(q);
      }
    });

    // Exactly 25 questions total: 3 per competency (24) + 1 for comprehensive balance
    const target = 25;
    const perComp = Math.floor(target / competencies.length);
    const remainder = target % competencies.length;

    const selected: typeof sourcePool = [];
    competencies.forEach((comp, idx) => {
      const countToPick = perComp + (idx < remainder ? 1 : 0);
      const compQuestions = byComp[comp.id] || [];

      // Sort to prioritize official MoSPI and NSSTA questions
      const sorted = [...compQuestions].sort((a, b) => {
        const aOfficial = ('source' in a && (a.source === 'mospi' || a.source === 'nssta')) ? 1 : 0;
        const bOfficial = ('source' in b && (b.source === 'mospi' || b.source === 'nssta')) ? 1 : 0;
        return bOfficial - aOfficial;
      });

      selected.push(...sorted.slice(0, countToPick));
    });

    // Safeguard ensuring exactly 25 questions
    if (selected.length < target) {
      const selectedIds = new Set(selected.map((q) => q.id));
      for (const q of sourcePool) {
        if (!selectedIds.has(q.id)) {
          selected.push(q);
          selectedIds.add(q.id);
          if (selected.length >= target) break;
        }
      }
    }

    return selected.slice(0, target);
  }, [questionBank]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  const totalQuestions = activeQuestionList.length;
  const currentQuestion = activeQuestionList[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  const score = activeQuestionList.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleSubmit = () => {
    // Dynamically calculate updated competency scores
    const updatedScores: CompetencyScore[] = competencies.map((comp) => {
      const relatedQuestions = activeQuestionList.filter(
        (q) => ('competencyTag' in q ? q.competencyTag === comp.id : (q as any).competencyId === comp.id)
      );

      let compScore = 65; // default fallback
      if (relatedQuestions.length > 0) {
        const correctCount = relatedQuestions.filter((q) => answers[q.id] === q.correctAnswer).length;
        compScore = Math.round((correctCount / relatedQuestions.length) * 100);
      } else {
        // slight variation around overall score
        compScore = Math.max(30, Math.min(95, scorePercentage + (comp.id === 'c3' || comp.id === 'c5' ? -15 : 10)));
      }

      let level: CompetencyLevel = 'Moderate';
      if (compScore >= 80) level = 'Strong';
      else if (compScore >= 60) level = 'Moderate';
      else if (compScore >= 40) level = 'Needs Improvement';
      else level = 'Critical Gap';

      const impactScore = Number(((comp.weight * (100 - compScore)) / 10).toFixed(2));

      return {
        competencyId: comp.id,
        competencyName: comp.name,
        category: comp.category,
        score: compScore,
        previousScore: 50,
        level,
        weight: comp.weight,
        impactScore,
        trend: compScore >= 50 ? 'up' : 'down',
      };
    });

    updateUserAssessment(updatedScores, scorePercentage);
    setSubmitted(true);
  };

  const competencyName =
    competencies.find((c) =>
      'competencyTag' in currentQuestion
        ? c.id === (currentQuestion as any).competencyTag
        : c.id === (currentQuestion as any).competencyId
    )?.name || 'Official Statistics';

  if (submitted) {
    return (
      <>
        <PageHeader
          title="Assessment Results"
          subtitle="Your competency assessment has been evaluated and synced with the Gap Engine"
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRetake}>
              <RotateCcw size={14} /> Retake Assessment
            </Button>
            <Button variant="outline" onClick={() => onNavigate('gap-analysis')}>
              View Gap Analysis <ChevronRight size={16} />
            </Button>
            <Button onClick={() => onNavigate('learning-path')}>
              <Sparkles size={14} /> View Mapped iGOT Courses
            </Button>
          </div>
        </PageHeader>

        {/* Results Banner */}
        <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-primary-900 to-neutral-900 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold shadow-inner border border-white/20',
                scorePercentage >= 75
                  ? 'bg-success-500 text-white'
                  : scorePercentage >= 50
                  ? 'bg-amber-500 text-white'
                  : 'bg-error-500 text-white'
              )}
            >
              {scorePercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                {currentUser.designation && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-medium">
                    {currentUser.designation}
                  </span>
                )}
              </div>
              <p className="text-xs text-primary-200 mt-0.5">
                Evaluation Complete: {score} of {totalQuestions} questions correct · Mapped to iGOT dataset
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 size={14} /> NLP Recommendation Engine Ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 lg:col-span-1 flex flex-col items-center justify-center text-center">
            <div
              className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold mb-3 shadow-sm',
                scorePercentage >= 75
                  ? 'bg-success-100 text-success-700 border-2 border-success-200'
                  : scorePercentage >= 50
                  ? 'bg-warning-100 text-warning-700 border-2 border-warning-200'
                  : 'bg-error-100 text-error-700 border-2 border-error-200'
              )}
            >
              {scorePercentage}%
            </div>
            <p className="text-sm font-bold text-neutral-900">Overall Competency Score</p>
            <p className="text-xs text-neutral-500 mt-1">
              {score} out of {totalQuestions} correct
            </p>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="text-sm font-bold text-neutral-900 mb-4">Question-by-Question Assessment Breakdown</h3>
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {activeQuestionList.map((q, i) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                const compTag = ('competencyTag' in q ? q.competencyTag : (q as any).competencyId) || 'c3';
                const compName = competencies.find((c) => c.id === compTag)?.name;

                return (
                  <div
                    key={q.id}
                    className={cn(
                      'flex items-start gap-3 p-3.5 rounded-xl border transition-colors',
                      isCorrect ? 'bg-success-50/60 border-success-200' : 'bg-error-50/60 border-error-200'
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={18} className="text-success-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={18} className="text-error-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800">
                        Q{i + 1}. {q.question}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Competency: <strong>{compName}</strong> · Difficulty: <span className="capitalize">{q.difficulty}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-neutral-700 mt-1 font-medium">
                          <span className="text-emerald-700">Correct Answer:</span> {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 mt-1 italic">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Next Steps CTA */}
        <Card className="p-6 bg-neutral-50 border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary-100 text-primary-700">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Next Steps: Explore Personalized Learning</h3>
              <p className="text-xs text-neutral-500">
                Your scores have been processed by the Gap Engine and matched against the curated iGOT Course dataset.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2 flex-wrap">
            <Button onClick={() => onNavigate('gap-analysis')}>
              View Competency Gap Analysis <ArrowRight size={14} />
            </Button>
            <Button variant="outline" onClick={() => onNavigate('learning-path')}>
              <Sparkles size={14} /> View Recommended iGOT Courses
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Competency Assessment"
        subtitle="Objective standardized assessment to evaluate official statistics skill levels (25 Questions)"
      >
        <div className="flex items-center gap-2">
          <Badge variant="primary">
            <Clock size={12} /> 25 questions
          </Badge>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Shield size={12} /> MoSPI & NSSTA Bank
          </Badge>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question panel */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default">Q{currentIndex + 1} of {totalQuestions}</Badge>
                <Badge
                  variant={
                    currentQuestion.difficulty === 'easy'
                      ? 'success'
                      : currentQuestion.difficulty === 'medium'
                      ? 'warning'
                      : 'error'
                  }
                  className="capitalize"
                >
                  {currentQuestion.difficulty}
                </Badge>
                {'source' in currentQuestion && currentQuestion.source === 'mospi' && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                    MoSPI Official
                  </Badge>
                )}
                {'source' in currentQuestion && currentQuestion.source === 'nssta' && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                    NSSTA Module
                  </Badge>
                )}
              </div>
              <span className="text-xs font-semibold text-primary-700">{competencyName}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-6 leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => {
                const isSelected = answers[currentQuestion.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-full border-2 text-xs font-bold shrink-0',
                        isSelected
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-neutral-300 text-neutral-500'
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span
                      className={cn(
                        'text-sm',
                        isSelected ? 'text-primary-950 font-semibold' : 'text-neutral-700'
                      )}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              {currentIndex < totalQuestions - 1 ? (
                <Button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  disabled={answers[currentQuestion.id] === undefined}
                >
                  Next <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                >
                  <CheckCircle2 size={16} /> Submit Assessment
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Assessment Progress</h3>
            <ProgressBar
              value={answeredCount}
              max={totalQuestions}
              variant={allAnswered ? 'success' : 'primary'}
              showLabel
              className="mb-3"
            />
            <p className="text-xs text-neutral-500">
              {answeredCount} of {totalQuestions} questions answered
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Question Navigator</h3>
            <div className="grid grid-cols-4 gap-2">
              {activeQuestionList.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      'aspect-square rounded-xl text-xs font-bold transition-all',
                      isCurrent
                        ? 'bg-primary-600 text-white ring-2 ring-primary-200 ring-offset-1'
                        : isAnswered
                        ? 'bg-success-100 text-success-800 hover:bg-success-200'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 bg-neutral-50 border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList size={16} className="text-primary-600" />
              <h3 className="text-xs font-bold text-neutral-900">Standardized MoSPI & NSSTA Assessment</h3>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Strictly standardized {totalQuestions}-question evaluation (20–25 questions) balanced evenly across all 8 statistical competencies (3 per domain). Questions are derived from official MoSPI publications and NSSTA training modules to evaluate real-world official statistics proficiency.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
