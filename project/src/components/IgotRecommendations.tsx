/**
 * IgotRecommendations.tsx
 * -----------------------
 * Displays personalized iGOT Karmayogi course recommendations
 * based on identified competency gaps using the NLP Semantic Matching layer.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Star,
  Users,
  Tag,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import type { CompetencyScore, Course } from '@/types';
import { useApp } from '@/context/AppContext';
import { calculateSemanticMatch } from '@/utils/nlpMatcher';
import { cn } from '@/utils/cn';
import { openIGOTCourse, IGOT_COURSE_LIST_URL } from '@/utils/igotUtils';

interface IgotRecommendationsProps {
  /** The identified competency gaps to generate recommendations for */
  gaps?: CompetencyScore[];
  /** Max gaps to show (default: 3) */
  maxGaps?: number;
  onOpenVideo?: (course: Course) => void;
}

export function IgotRecommendations({ gaps, maxGaps = 3, onOpenVideo }: IgotRecommendationsProps) {
  const { userScores, courses, currentUser } = useApp();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const activeScores = gaps || userScores;
  const actionableGaps = activeScores
    .filter((g) => g.level !== 'Strong')
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, maxGaps);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCourse = (course: Course) => {
    openIGOTCourse(course.igotUrl || IGOT_COURSE_LIST_URL);
  };

  if (actionableGaps.length === 0) {
    return (
      <Card className="p-6 bg-emerald-50 border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">All competencies are evaluated as Strong!</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              No immediate critical gaps detected. You may explore advanced statistical topics on the iGOT Catalogue page.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Personalized iGOT Course Recommendations
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Powered by NLP Semantic Matching Layer · Mapped to Curated iGOT Dataset
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200">
          <Sparkles size={11} /> Top {actionableGaps.length} Priority Gaps
        </Badge>
      </div>

      {/* Semantic Pipeline Flow Indicator */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 overflow-x-auto whitespace-nowrap shadow-xs">
        {[
          'Officer Assessment',
          'Competency Scores',
          'Gap Engine',
          'NLP Semantic Matching',
          'iGOT Course Dataset',
          'Personalized Recommendations',
        ].map((step, i, arr) => (
          <React.Fragment key={step}>
            <span
              className={cn(
                'px-2.5 py-1 rounded-lg font-semibold',
                i === 3
                  ? 'bg-primary-600 text-white shadow-xs'
                  : i === 4
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-neutral-600 bg-neutral-100'
              )}
            >
              {step}
            </span>
            {i < arr.length - 1 && <span className="text-neutral-300 font-bold">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Prototype Notice */}
      <div className="p-3.5 rounded-xl bg-neutral-100/90 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
        <Info size={16} className="text-primary-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-neutral-800">Curated Dataset & Semantic Matching:</span> The NLP layer compares each
          competency gap with course names, descriptions, and syllabus tags.
          <span className="italic block text-neutral-600 mt-1 font-medium">
            "Prototype uses a curated course dataset to demonstrate iGOT course mapping. Live API integration can be added when official API access is available."
          </span>
        </p>
      </div>

      {/* Gap-by-Gap Recommendations */}
      <div className="space-y-6">
        {actionableGaps.map((gap) => {
          // Evaluate all courses against this gap via NLP Matcher
          const scoredCourses = courses
            .map((c) => ({
              course: c,
              match: calculateSemanticMatch(gap, c, currentUser.designation),
            }))
            .sort((a, b) => b.match.matchScore - a.match.matchScore)
            .slice(0, 3);

          return (
            <div
              key={gap.competencyId}
              className="border border-neutral-200 bg-white rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Gap Header */}
              <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-neutral-50/80 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-neutral-900">{gap.competencyName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
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
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Current Score: <strong className="text-neutral-700">{gap.score}%</strong> · Impact Priority:{' '}
                      <strong className="text-neutral-700">{gap.impactScore.toFixed(1)}</strong>
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
                  {scoredCourses.length} Semantically Matched Courses
                </span>
              </div>

              {/* Course Cards Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scoredCourses.map(({ course, match }) => {
                  const isExpanded = Boolean(expandedCards[course.id]);

                  return (
                    <div
                      key={course.id}
                      className="rounded-xl border border-neutral-200 bg-white hover:border-primary-400 hover:shadow-md transition-all p-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Match Score & Course ID Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                            Course ID: {course.id}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                            <Sparkles size={11} className="text-emerald-600" />
                            Match: {match.matchScore}%
                          </span>
                        </div>

                        {/* Course Name */}
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug mb-1">
                          {course.title}
                        </h4>

                        {/* Relevant Skill */}
                        <p className="text-xs font-semibold text-primary-700 mb-2">
                          Relevant Skill: <span className="text-neutral-800">{match.relevantSkill}</span>
                        </p>

                        {/* Meta information */}
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 mb-2.5">
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={11} className="text-amber-400 fill-amber-400" /> {course.rating.toFixed(1)}
                          </span>
                          <span className="capitalize px-1.5 py-0.2 rounded text-[10px] bg-neutral-100">
                            {course.difficulty}
                          </span>
                        </div>

                        {/* Short Description */}
                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-2">
                          {course.description}
                        </p>

                        {/* NLP Match Rationale Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(course.id)}
                          className="flex items-center gap-1 text-[11px] text-primary-600 hover:text-primary-800 font-semibold mb-3"
                        >
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {isExpanded ? 'Hide Semantic Rationale' : 'View Semantic Rationale'}
                        </button>

                        {isExpanded && (
                          <div className="mb-3 p-2.5 rounded-lg bg-primary-50/60 border border-primary-100 text-[11px] text-primary-900 leading-relaxed animate-fade-in">
                            <p className="font-semibold text-primary-800 mb-1">NLP Semantic Evaluation:</p>
                            <p>{match.matchReason}</p>
                            {match.matchedConcepts.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {match.matchedConcepts.map((c) => (
                                  <span key={c} className="px-1.5 py-0.2 rounded text-[9px] bg-white text-primary-700 font-bold border border-primary-200">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* View Course Action */}
                      <div className="pt-3 border-t border-neutral-100">
                        <Button
                          size="sm"
                          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold"
                          onClick={() => handleOpenCourse(course)}
                        >
                          <ExternalLink size={13} />
                          View Course
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IgotRecommendations;
