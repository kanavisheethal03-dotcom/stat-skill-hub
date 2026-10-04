/**
 * ============================================================
 *  MOCK iGOT Karmayogi API Service
 *  src/services/igotApiService.ts
 * ============================================================
 *
 *  ⚠️  PROTOTYPE / MOCK API — SIH Demonstration Only
 *
 *  This module simulates REST API calls to the iGOT Karmayogi platform.
 *  No real iGOT credentials are used or required.
 *
 *  Environment mode is read from:
 *    VITE_IGOT_API_MODE  (default: "mock")
 *
 *  Architecture note:
 *  ------------------
 *  All external iGOT calls MUST go through this service.
 *  To upgrade to the official iGOT API:
 *    1. Set VITE_IGOT_API_MODE=live in .env.local
 *    2. Set VITE_IGOT_API_BASE_URL to the authorized endpoint
 *    3. Implement the `live*` variants of each function below
 *    4. Remove the mock data import
 *
 *  Endpoints simulated:
 *    GET /api/igot/courses
 *    GET /api/igot/course/:id
 *    GET /api/igot/recommendations?skill=&level=
 * ============================================================
 */

import courseData from '@/data/igotCourses.json';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface IgotCourse {
  id: string;
  title: string;
  description: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  provider: string;
  igotUrl: string;
  rating: number;
  enrolled: number;
}

export interface IgotRecommendationResponse {
  skill: string;
  level: string;
  courses: IgotCourse[];
  isMock: true;
}

export interface IgotApiError {
  code: string;
  message: string;
  userMessage: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────

const API_MODE = (import.meta.env.VITE_IGOT_API_MODE ?? 'mock') as string;
const SIMULATED_LATENCY_MS = 600; // realistic network simulation

/** Skill alias map: normalize competency names → catalogue skill names */
const SKILL_ALIAS_MAP: Record<string, string> = {
  'python for statistics': 'Python',
  'python': 'Python',
  'statistical methods': 'Statistics',
  'statistics': 'Statistics',
  'data analysis': 'Data Analysis',
  'data quality & assurance': 'Data Analysis',
  'data quality': 'Data Analysis',
  'data visualization': 'Data Visualization',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'sql': 'SQL',
  'database': 'SQL',
  'communication': 'Communication',
  'leadership': 'Leadership',
  'survey design': 'Statistics',
  'national accounts statistics': 'Statistics',
  'data collection & sampling': 'Data Analysis',
};

/** Competency level → iGOT difficulty level */
const LEVEL_MAP: Record<string, IgotCourse['level'][]> = {
  'critical gap': ['Beginner'],
  'needs improvement': ['Beginner', 'Intermediate'],
  'moderate': ['Intermediate'],
  'strong': ['Intermediate', 'Advanced'],
  'beginner': ['Beginner'],
  'intermediate': ['Intermediate'],
  'advanced': ['Advanced'],
};

// ─── Internal helpers ────────────────────────────────────────────────────────

const allCourses = courseData.courses as IgotCourse[];

function normalizeSkill(rawSkill: string): string {
  const lower = rawSkill.toLowerCase().trim();
  return SKILL_ALIAS_MAP[lower] ?? rawSkill;
}

function normalizeLevels(rawLevel: string): IgotCourse['level'][] {
  const lower = rawLevel.toLowerCase().trim();
  return LEVEL_MAP[lower] ?? ['Beginner', 'Intermediate'];
}

function simulateLatency(): Promise<void> {
  // Add slight randomness for realism
  const jitter = Math.random() * 200;
  return new Promise((r) => setTimeout(r, SIMULATED_LATENCY_MS + jitter));
}

// ─── Public API functions (Mock implementation) ──────────────────────────────

/**
 * GET /api/igot/courses
 * Returns all courses in the mock catalogue.
 */
export async function getAllCourses(): Promise<IgotCourse[]> {
  if (API_MODE !== 'mock') {
    throw new Error('Live iGOT API not yet configured. Set VITE_IGOT_API_MODE=mock.');
  }
  await simulateLatency();
  return [...allCourses];
}

/**
 * GET /api/igot/course/:id
 * Returns a single course by ID, or throws a typed error.
 */
export async function getCourseById(id: string): Promise<IgotCourse> {
  await simulateLatency();
  const course = allCourses.find((c) => c.id === id);
  if (!course) {
    const err: IgotApiError = {
      code: 'COURSE_NOT_FOUND',
      message: `Course with ID "${id}" not found in mock catalogue.`,
      userMessage: `The course "${id}" could not be found. It may have been removed from the catalogue.`,
    };
    throw err;
  }
  return { ...course };
}

/**
 * GET /api/igot/recommendations?skill={skill}&level={level}
 *
 * Primary endpoint used after competency gap analysis.
 * Accepts raw competency names (e.g. "Python for Statistics", "Critical Gap")
 * and returns relevant iGOT courses.
 *
 * Fallback: If no exact match, returns courses for the same skill at any level,
 * then cross-skill suggestions. Never returns empty.
 */
export async function getRecommendations(
  rawSkill: string,
  rawLevel: string
): Promise<IgotRecommendationResponse> {
  if (!rawSkill || !rawLevel) {
    const err: IgotApiError = {
      code: 'INVALID_PARAMS',
      message: 'Both skill and level parameters are required.',
      userMessage: 'Please provide a valid skill and competency level to get recommendations.',
    };
    throw err;
  }

  await simulateLatency();

  const skill = normalizeSkill(rawSkill);
  const levels = normalizeLevels(rawLevel);

  // 1. Exact match: same skill AND matching levels
  let matched = allCourses.filter(
    (c) => c.skill === skill && levels.includes(c.level)
  );

  // 2. Fallback: same skill, any level
  if (matched.length === 0) {
    matched = allCourses.filter((c) => c.skill === skill);
  }

  // 3. Fallback: fuzzy skill match (partial string match)
  if (matched.length === 0) {
    const skillLower = skill.toLowerCase();
    matched = allCourses.filter(
      (c) =>
        c.skill.toLowerCase().includes(skillLower) ||
        skillLower.includes(c.skill.toLowerCase())
    );
  }

  // 4. Last resort: return first-level Beginner courses across Data Skills
  if (matched.length === 0) {
    matched = allCourses
      .filter((c) => c.level === 'Beginner' && c.category === 'Data Skills')
      .slice(0, 3);
  }

  return {
    skill,
    level: rawLevel,
    courses: matched.slice(0, 6), // return max 6 recommendations
    isMock: true,
  };
}

/**
 * Batch recommendations: given multiple competency gaps,
 * return one recommendation set per gap (used by dashboard).
 */
export async function getBatchRecommendations(
  gaps: { skill: string; level: string }[]
): Promise<IgotRecommendationResponse[]> {
  // Sequential to avoid race conditions in mock
  const results: IgotRecommendationResponse[] = [];
  for (const gap of gaps) {
    const res = await getRecommendations(gap.skill, gap.level);
    results.push(res);
  }
  return results;
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export const igotApiService = {
  getAllCourses,
  getCourseById,
  getRecommendations,
  getBatchRecommendations,
  isMockMode: API_MODE === 'mock',
};

export default igotApiService;
