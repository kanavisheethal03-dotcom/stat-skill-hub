/**
 * AppContext.tsx — Unified Platform State & Access Control for STAT-SKILL HUB
 * ------------------------------------------------------------------------
 * Manages:
 *  1. Role-based Authentication & Officer Designation profile
 *  2. Officer Registry & Monitoring
 *  3. Curated iGOT Course Dataset Management (syncs with NLP matcher)
 *  4. Question Bank Management (AI-MCQ Review & Approval Workflow)
 *  5. Learning Materials Management
 *  6. Assessment State & Competency Scores
 *  7. Course Enrollments & Learning Progress
 */

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  UserRole,
  OfficerDesignation,
  Course,
  CompetencyScore,
  AssessmentQuestion,
  QuizQuestion,
  QuestionReviewStatus,
  LearningMaterial,
  EnrollmentStatus,
  ActivityLog,
  Recommendation,
} from '@/types';
import {
  demoUser,
  adminUser,
  trainerUser,
  mockIGOTCatalogue,
  internalCourses,
  initialScores,
  postTrainingScores,
  assessmentQuestions as initialAssessmentQuestions,
  generatedQuizQuestions as initialQuizQuestions,
  learningMaterials as initialMaterials,
  activityLogs as initialLogs,
  sampleDocumentText,
} from '@/data/mockData';
import { generateNlpRecommendations } from '@/utils/nlpMatcher';
import { allMospiNsstaQuestions } from '@/data/mospiNsstaQuizData';

// ─── Initial Registered Officers Data ──────────────────────────────────────────

export const initialOfficers: User[] = [
  {
    id: 'u001',
    name: 'Sanjana Verma',
    email: 'sanjana.officer@mospi.gov.in',
    role: 'officer',
    designation: 'Junior Statistical Officer (JSO)',
    department: 'National Statistical Office (NSO)',
    position: 'Junior Statistical Officer',
    avatar: 'SV',
    joinedDate: '2026-06-15',
    assessmentCompleted: true,
    assessmentScore: 74,
    competencyScores: postTrainingScores,
    coursesCompletedCount: 2,
    coursesEnrolledCount: 4,
    learningHours: 24.5,
  },
  {
    id: 'u002',
    name: 'Priya Sharma',
    email: 'priya.sharma@mospi.gov.in',
    role: 'officer',
    designation: 'Junior Statistical Officer (JSO)',
    department: 'National Statistical Office (NSO)',
    position: 'Junior Statistical Officer',
    avatar: 'PS',
    joinedDate: '2026-07-01',
    assessmentCompleted: true,
    assessmentScore: 71,
    competencyScores: postTrainingScores,
    coursesCompletedCount: 2,
    coursesEnrolledCount: 3,
    learningHours: 22.0,
  },
  {
    id: 'u003',
    name: 'Amit Patel',
    email: 'amit.patel@mospi.gov.in',
    role: 'officer',
    designation: 'Senior Statistical Officer (SSO)',
    department: 'Field Operations Division (FOD)',
    position: 'Senior Statistical Officer',
    avatar: 'AP',
    joinedDate: '2026-05-10',
    assessmentCompleted: true,
    assessmentScore: 62,
    competencyScores: initialScores,
    coursesCompletedCount: 1,
    coursesEnrolledCount: 2,
    learningHours: 14.0,
  },
  {
    id: 'u004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@mospi.gov.in',
    role: 'officer',
    designation: 'Statistical Investigator',
    department: 'Survey Design and Research Division',
    position: 'Statistical Investigator Gr. I',
    avatar: 'SR',
    joinedDate: '2026-08-01',
    assessmentCompleted: true,
    assessmentScore: 78,
    competencyScores: postTrainingScores,
    coursesCompletedCount: 3,
    coursesEnrolledCount: 4,
    learningHours: 31.0,
  },
  {
    id: 'u005',
    name: 'Vikram Singh',
    email: 'vikram.singh@mospi.gov.in',
    role: 'officer',
    designation: 'Assistant Statistical Officer',
    department: 'Economic Statistics Division',
    position: 'Assistant Statistical Officer',
    avatar: 'VS',
    joinedDate: '2026-08-15',
    assessmentCompleted: false,
    assessmentScore: 45,
    competencyScores: initialScores,
    coursesCompletedCount: 0,
    coursesEnrolledCount: 1,
    learningHours: 6.5,
  },
  {
    id: 'u006',
    name: 'Deepika Nair',
    email: 'deepika.nair@mospi.gov.in',
    role: 'officer',
    designation: 'Assistant Director',
    department: 'National Accounts Division (NAD)',
    position: 'Assistant Director (Statistics)',
    avatar: 'DN',
    joinedDate: '2026-04-20',
    assessmentCompleted: true,
    assessmentScore: 82,
    competencyScores: postTrainingScores,
    coursesCompletedCount: 4,
    coursesEnrolledCount: 5,
    learningHours: 42.0,
  },
  {
    id: 'u007',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@mospi.gov.in',
    role: 'officer',
    designation: 'Deputy Director',
    department: 'Coordination & Publications Division',
    position: 'Deputy Director',
    avatar: 'RG',
    joinedDate: '2026-03-12',
    assessmentCompleted: true,
    assessmentScore: 88,
    competencyScores: postTrainingScores,
    coursesCompletedCount: 5,
    coursesEnrolledCount: 5,
    learningHours: 48.0,
  },
  {
    id: 'u008',
    name: 'Dr. Arvind Mehta',
    email: 'arvind.mehta@mospi.gov.in',
    role: 'officer',
    designation: 'Director',
    department: 'NSSTA Training Academy',
    position: 'Director (Training)',
    avatar: 'AM',
    joinedDate: '2026-01-15',
    assessmentCompleted: true,
    assessmentScore: 92,
    competencyScores: postTrainingScores,
    coursesCompletedCount: 6,
    coursesEnrolledCount: 6,
    learningHours: 56.0,
  },
];

// ─── Initial Unified Question Bank ─────────────────────────────────────────────

export interface ManagedQuestion extends QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  sourceReference: string;
  competencyTag: string;
  status: QuestionReviewStatus;
  submittedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdDate: string;
}

export const initialQuestionBank: ManagedQuestion[] = [
  ...initialAssessmentQuestions.map((q, i) => ({
    id: `qb-core-${i + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation,
    sourceReference: 'NSSTA Official Statistics Standard Assessment Framework',
    competencyTag: q.competencyId,
    status: 'Approved' as QuestionReviewStatus,
    reviewedBy: 'NSSTA Trainer Committee',
    reviewedAt: '2026-08-10T10:00:00Z',
    createdDate: '2026-08-01',
  })),
  {
    id: 'qb-ai-1',
    question: 'What is the recommended first step in the data preprocessing pipeline described in the official handbook?',
    options: [
      'Apply machine learning models immediately',
      'Perform data profiling to understand structure, quality, and completeness',
      'Export the data to a visualization tool',
      'Delete all columns with any missing values',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Data profiling is the recommended first step because it reveals structure, quality issues, and completeness before transformations.',
    sourceReference: 'Data_Preprocessing_Handbook.pdf — Section 2.1: Data Preprocessing Pipeline, Page 3',
    competencyTag: 'c3',
    status: 'Approved',
    reviewedBy: 'Dr. Rajesh Kumar (NSSTA)',
    reviewedAt: '2026-09-15T11:30:00Z',
    createdDate: '2026-09-15',
  },
  {
    id: 'qb-ai-2',
    question: 'Which imputation method is statistically valid when data is Missing Completely at Random (MCAR)?',
    options: [
      'Hot-deck imputation with arbitrary nearest neighbors',
      'Listwise deletion is statistically valid',
      'Multiple imputation with 20 iterations is required',
      'Mean replacement with zero variance adjustment',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'When data is MCAR, listwise deletion produces unbiased estimates without introducing systematic distortion.',
    sourceReference: 'Data_Preprocessing_Handbook.pdf — Section 3.2: Handling Missing Data, Page 7',
    competencyTag: 'c3',
    status: 'Approved',
    reviewedBy: 'Dr. Rajesh Kumar (NSSTA)',
    reviewedAt: '2026-09-15T11:35:00Z',
    createdDate: '2026-09-15',
  },
  {
    id: 'qb-ai-3',
    question: 'In robust outlier detection for official survey microdata, what combined approach is mandated?',
    options: [
      'Only the Z-score method with threshold 3',
      'Only the IQR method with 1.5 multiplier without verification',
      'Z-score for normal distributions, IQR for skewed data, and mandatory domain expert review',
      'Automatic algorithmic deletion of the top 5% observations',
    ],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: 'Outliers in official statistics may represent valid extreme economic units, requiring statistical screening combined with expert review.',
    sourceReference: 'Data_Preprocessing_Handbook.pdf — Section 3.4: Outlier Detection Strategies, Page 9',
    competencyTag: 'c3',
    status: 'Pending Review',
    createdDate: '2026-09-18',
  },
  {
    id: 'qb-ai-4',
    question: 'Under the System of National Accounts (SNA), how is Gross Value Added (GVA) at basic prices derived?',
    options: [
      'Gross output plus intermediate consumption',
      'Gross output minus intermediate consumption',
      'Total tax revenues minus direct subsidies',
      'Aggregate household final consumption expenditure',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'GVA at basic prices equals Gross Output minus Intermediate Consumption according to SNA standards.',
    sourceReference: 'GDP_Compilation_Methods.docx — Chapter 1: Production Approach, Page 2',
    competencyTag: 'c7',
    status: 'Pending Review',
    createdDate: '2026-09-20',
  },
  {
    id: 'qb-ai-5',
    question: 'In survey sampling design, what is the key benefit of stratified multi-stage sampling over simple random sampling?',
    options: [
      'It guarantees that sample size can be reduced by 90%',
      'It ensures geographical representation and reduces standard error across heterogeneous strata',
      'It eliminates the need for primary sampling units (PSUs)',
      'It avoids any non-sampling errors during field enumeration',
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Stratification ensures balanced representation of diverse regional subpopulations and yields higher precision.',
    sourceReference: 'Survey_Methodology_Guide.pdf — Section 1: Probability Sampling, Page 4',
    competencyTag: 'c1',
    status: 'Pending Review',
    createdDate: '2026-09-22',
  },
  // ── MoSPI & NSSTA Official Quiz Bank (Auto-seeded) ───────────────────
  ...allMospiNsstaQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation,
    sourceReference: `${q.source === 'mospi' ? 'MoSPI' : 'NSSTA'} — ${q.sourcePublication}`,
    competencyTag: q.competencyTag,
    status: 'Approved' as QuestionReviewStatus,
    reviewedBy: q.source === 'mospi'
      ? 'MoSPI Data Standards Division'
      : 'NSSTA Curriculum Review Board',
    reviewedAt: '2026-09-01T10:00:00Z',
    createdDate: '2026-08-20',
  })),
];

// ─── Initial Curated iGOT Courses ─────────────────────────────────────────────

export const initialCuratedCourses: Course[] = [
  ...mockIGOTCatalogue,
  ...internalCourses,
];

// ─── Context Interface ────────────────────────────────────────────────────────

interface AppContextType {
  // Auth state
  currentUser: User;
  isLoggedIn: boolean;
  login: (email: string, role: UserRole, designation?: string) => void;
  register: (name: string, email: string, role: UserRole, designation?: string) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole, designation?: string) => void;

  // Officers Management (Admin & Platform)
  officers: User[];
  addOfficer: (officer: User) => void;
  updateOfficer: (id: string, updates: Partial<User>) => void;

  // Curated iGOT Course Dataset Management
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'> & { id?: string }) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Question Bank (MCQ Review & Assessment)
  questionBank: ManagedQuestion[];
  approveQuestion: (id: string, reviewerName?: string) => void;
  rejectQuestion: (id: string, reviewerName?: string) => void;
  updateQuestion: (id: string, updates: Partial<ManagedQuestion>) => void;
  addQuestion: (q: Omit<ManagedQuestion, 'id' | 'createdDate'>) => void;
  deleteQuestion: (id: string) => void;

  // Learning Materials Management
  materials: LearningMaterial[];
  addMaterial: (material: Omit<LearningMaterial, 'id' | 'uploadedAt'>, text?: string) => LearningMaterial;
  updateMaterial: (id: string, updates: Partial<LearningMaterial>) => void;
  deleteMaterial: (id: string) => void;
  documentTexts: Record<string, string>;

  // Recommendations & NLP Matching
  getOfficerRecommendations: (officerScores?: CompetencyScore[]) => Recommendation[];

  // Enrollments & Learning Progress
  enrollments: Record<string, EnrollmentStatus>;
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => void;
  unenrollCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;

  // Assessment
  userScores: CompetencyScore[];
  updateUserAssessment: (newScores: CompetencyScore[], overallScore: number) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: { action: string; details: string; userId?: string; userName?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Auth & Current User
  const [currentUser, setCurrentUser] = useState<User>(() => initialOfficers[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Officers
  const [officers, setOfficers] = useState<User[]>(() => initialOfficers);

  // 3. Courses
  const [courses, setCourses] = useState<Course[]>(() => initialCuratedCourses);

  // 4. Question Bank
  const [questionBank, setQuestionBank] = useState<ManagedQuestion[]>(() => initialQuestionBank);

  // 5. Materials
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => initialMaterials);
  const [documentTexts, setDocumentTexts] = useState<Record<string, string>>({
    'Data_Preprocessing_Handbook.pdf': sampleDocumentText,
    'Survey_Methodology_Guide.pdf': `Survey Methodology & Sampling Design Guide\n\nSection 1: Probability Sampling\nProbability sampling ensures every unit in the population has a known, non-zero probability of selection. In official statistics, stratified multi-stage sampling is the gold standard for household surveys, reducing standard errors while maintaining geographical representation.\n\nSection 2: Questionnaire Validation\nPre-testing and cognitive interviewing are essential to identify ambiguous questions, leading phrasing, and recall burden before survey rollout.\n\nSection 3: Field Verification and Quality Audits\nField supervisors must conduct random back-checks on at least 10% of enumerated households to verify interview integrity and reduce non-sampling errors.`,
    'GDP_Compilation_Methods.docx': `System of National Accounts (SNA) — GDP Compilation Framework\n\nChapter 1: Production Approach\nGross Value Added (GVA) at basic prices is calculated by subtracting intermediate consumption from gross output. Taxes on products are added and subsidies subtracted to arrive at GDP at market prices.\n\nChapter 2: Expenditure Approach\nGDP equals Private Final Consumption Expenditure (PFCE) + Government Final Consumption Expenditure (GFCE) + Gross Fixed Capital Formation (GFCF) + Changes in Inventories + Net Exports.\n\nChapter 3: Deflators and Base Year Revisions\nVolume estimates are obtained by double deflation using producer price indices (PPI) and consumer price indices (CPI). Periodic rebasing aligns national accounts with structural economic shifts.`,
  });

  // 6. Enrollments
  const [enrollments, setEnrollments] = useState<Record<string, EnrollmentStatus>>({
    igot001: { courseId: 'igot001', enrolledAt: '2026-09-14T10:15:00Z', status: 'completed', progress: 100 },
    igot002: { courseId: 'igot002', enrolledAt: '2026-09-15T08:00:00Z', status: 'in_progress', progress: 60 },
    igot003: { courseId: 'igot003', enrolledAt: '2026-09-15T09:00:00Z', status: 'in_progress', progress: 35 },
  });

  // 7. Assessment scores for current officer
  const [userScores, setUserScores] = useState<CompetencyScore[]>(() => postTrainingScores);

  // 8. Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => initialLogs);

  // ─── Auth Handlers ─────────────────────────────────────────────────────────

  const login = (email: string, role: UserRole, designation?: string) => {
    // Look up existing officer or create logged in user
    let user = officers.find((o) => o.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      if (role === 'admin') {
        user = {
          id: 'admin-01',
          name: 'Anita Desai',
          email,
          role: 'admin',
          department: 'Platform Administration Division',
          position: 'Administrator',
          avatar: 'AD',
          joinedDate: '2026-06-01',
        };
      } else {
        const namePart = email.split('@')[0].replace('.', ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const initials = formattedName.split(' ').map((n) => n[0]).join('').toUpperCase() || 'OF';
        const defaultDesig = designation || 'Junior Statistical Officer (JSO)';

        user = {
          id: `u-${Date.now()}`,
          name: formattedName || 'Statistical Officer',
          email,
          role: 'officer',
          designation: defaultDesig,
          department: 'National Statistical Office (NSO)',
          position: defaultDesig,
          avatar: initials,
          joinedDate: new Date().toISOString().split('T')[0],
          assessmentCompleted: false,
          competencyScores: initialScores,
          coursesCompletedCount: 0,
          coursesEnrolledCount: 0,
          learningHours: 0,
        };
        setOfficers((prev) => [user!, ...prev]);
      }
    } else if (designation && user.role === 'officer') {
      user = { ...user, designation, position: designation };
    }

    setCurrentUser(user);
    if (user.competencyScores) {
      setUserScores(user.competencyScores);
    }
    setIsLoggedIn(true);

    addActivityLog({
      action: 'User Signed In',
      details: `${user.name} logged in as ${user.role.toUpperCase()}${user.designation ? ` (${user.designation})` : ''}`,
      userId: user.id,
      userName: user.name,
    });
  };

  const register = (name: string, email: string, role: UserRole, designation?: string) => {
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'OF';
    const finalDesignation = role === 'officer' ? (designation || 'Junior Statistical Officer (JSO)') : undefined;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      designation: finalDesignation,
      department: role === 'admin' ? 'Administration & IT Division' : 'National Statistical Office (NSO)',
      position: finalDesignation || (role === 'admin' ? 'Platform Administrator' : 'Statistical Officer'),
      avatar: initials,
      joinedDate: new Date().toISOString().split('T')[0],
      assessmentCompleted: false,
      competencyScores: initialScores,
      coursesCompletedCount: 0,
      coursesEnrolledCount: 0,
      learningHours: 0,
    };

    if (role === 'officer') {
      setOfficers((prev) => [newUser, ...prev]);
    }

    setCurrentUser(newUser);
    setUserScores(initialScores);
    setIsLoggedIn(true);

    addActivityLog({
      action: 'User Registered',
      details: `${name} registered as ${role.toUpperCase()}${finalDesignation ? ` with designation ${finalDesignation}` : ''}`,
      userId: newUser.id,
      userName: name,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const switchDemoRole = (role: UserRole, designation?: string) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'a001',
        name: 'Anita Desai',
        email: 'anita.desai@mospi.gov.in',
        role: 'admin',
        department: 'IT & eGovernance Division',
        position: 'Platform Administrator',
        avatar: 'AD',
        joinedDate: '2026-06-01',
      });
    } else {
      const desig = designation || 'Junior Statistical Officer (JSO)';
      const matched = officers.find((o) => o.designation === desig) || initialOfficers[0];
      setCurrentUser({
        ...matched,
        role: 'officer',
        designation: desig,
      });
      if (matched.competencyScores) {
        setUserScores(matched.competencyScores);
      }
    }
  };

  // ─── Officers Management ───────────────────────────────────────────────────

  const addOfficer = (officer: User) => {
    setOfficers((prev) => [officer, ...prev]);
  };

  const updateOfficer = (id: string, updates: Partial<User>) => {
    setOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  // ─── Course Dataset Management (Admin) ─────────────────────────────────────

  const addCourse = (courseData: Omit<Course, 'id'> & { id?: string }) => {
    const newId = courseData.id || `IGOT-${Date.now().toString().slice(-4)}`;
    const newCourse: Course = {
      ...courseData,
      id: newId,
      source: courseData.source || 'igot',
      rating: courseData.rating || 4.5,
      enrolled: courseData.enrolled || 100,
      ratingCount: courseData.ratingCount || 10,
    };

    setCourses((prev) => [newCourse, ...prev]);

    addActivityLog({
      action: 'Course Added to Dataset',
      details: `Admin added "${newCourse.title}" (ID: ${newCourse.id}) to iGOT dataset`,
      userId: currentUser.id,
      userName: currentUser.name,
    });
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));

    addActivityLog({
      action: 'Course Updated in Dataset',
      details: `Admin modified course "${updates.title || id}" in iGOT catalogue`,
      userId: currentUser.id,
      userName: currentUser.name,
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));

    addActivityLog({
      action: 'Course Removed from Dataset',
      details: `Admin removed course "${id}" from iGOT catalogue`,
      userId: currentUser.id,
      userName: currentUser.name,
    });
  };

  // ─── Question Bank Management (Admin MCQ Review) ───────────────────────────

  const approveQuestion = (id: string, reviewerName = currentUser.name) => {
    setQuestionBank((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: 'Approved',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
            }
          : q
      )
    );

    addActivityLog({
      action: 'MCQ Approved',
      details: `Administrator approved question "${id}" for assessment pool`,
      userId: currentUser.id,
      userName: reviewerName,
    });
  };

  const rejectQuestion = (id: string, reviewerName = currentUser.name) => {
    setQuestionBank((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: 'Rejected',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
            }
          : q
      )
    );

    addActivityLog({
      action: 'MCQ Rejected',
      details: `Administrator rejected question "${id}"`,
      userId: currentUser.id,
      userName: reviewerName,
    });
  };

  const updateQuestion = (id: string, updates: Partial<ManagedQuestion>) => {
    setQuestionBank((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const addQuestion = (q: Omit<ManagedQuestion, 'id' | 'createdDate'>) => {
    const newQ: ManagedQuestion = {
      ...q,
      id: `qb-custom-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: q.status || 'Pending Review',
    };
    setQuestionBank((prev) => [newQ, ...prev]);
  };

  const deleteQuestion = (id: string) => {
    setQuestionBank((prev) => prev.filter((q) => q.id !== id));
  };

  // ─── Materials Management ─────────────────────────────────────────────────

  const addMaterial = (
    matData: Omit<LearningMaterial, 'id' | 'uploadedAt'>,
    extractedText?: string
  ): LearningMaterial => {
    const newMaterial: LearningMaterial = {
      ...matData,
      id: `lm-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    setMaterials((prev) => [newMaterial, ...prev]);

    if (extractedText) {
      setDocumentTexts((prev) => ({
        ...prev,
        [newMaterial.title]: extractedText,
      }));
    }

    addActivityLog({
      action: 'Material Uploaded',
      details: `Uploaded: ${newMaterial.title} (${newMaterial.pages} pages, ${newMaterial.type.toUpperCase()})`,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    return newMaterial;
  };

  const updateMaterial = (id: string, updates: Partial<LearningMaterial>) => {
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // ─── NLP Semantic Matching & Recommendations ──────────────────────────────

  const getOfficerRecommendations = useCallback(
    (customScores?: CompetencyScore[]): Recommendation[] => {
      const targetScores = customScores || userScores;
      return generateNlpRecommendations(targetScores, courses, currentUser.designation);
    },
    [userScores, courses, currentUser.designation]
  );

  // ─── Enrollments ──────────────────────────────────────────────────────────

  const isEnrolled = useCallback(
    (courseId: string) => Boolean(enrollments[courseId]),
    [enrollments]
  );

  const enrollCourse = useCallback((courseId: string) => {
    setEnrollments((prev) => {
      if (prev[courseId]) return prev;
      return {
        ...prev,
        [courseId]: {
          courseId,
          enrolledAt: new Date().toISOString(),
          status: 'enrolled',
          progress: 0,
        },
      };
    });
  }, []);

  const unenrollCourse = useCallback((courseId: string) => {
    setEnrollments((prev) => {
      const next = { ...prev };
      delete next[courseId];
      return next;
    });
  }, []);

  const updateProgress = useCallback((courseId: string, progress: number) => {
    setEnrollments((prev) => {
      if (!prev[courseId]) return prev;
      const status: EnrollmentStatus['status'] = progress >= 100 ? 'completed' : 'in_progress';
      return { ...prev, [courseId]: { ...prev[courseId], progress, status } };
    });
  }, []);

  // ─── Assessment & Scores ──────────────────────────────────────────────────

  const updateUserAssessment = (newScores: CompetencyScore[], overallScore: number) => {
    setUserScores(newScores);
    setCurrentUser((prev) => ({
      ...prev,
      assessmentCompleted: true,
      assessmentScore: overallScore,
      competencyScores: newScores,
    }));

    // Update in officers registry
    setOfficers((prev) =>
      prev.map((o) =>
        o.id === currentUser.id
          ? {
              ...o,
              assessmentCompleted: true,
              assessmentScore: overallScore,
              competencyScores: newScores,
            }
          : o
      )
    );

    addActivityLog({
      action: 'Competency Assessment Submitted',
      details: `${currentUser.name} completed assessment. Overall score: ${overallScore}%`,
      userId: currentUser.id,
      userName: currentUser.name,
    });
  };

  // ─── Activity Log Helper ──────────────────────────────────────────────────

  const addActivityLog = ({
    action,
    details,
    userId = currentUser.id,
    userName = currentUser.name,
  }: {
    action: string;
    details: string;
    userId?: string;
    userName?: string;
  }) => {
    const newLog: ActivityLog = {
      id: `al-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      userName,
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        register,
        logout,
        switchDemoRole,
        officers,
        addOfficer,
        updateOfficer,
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
        addMaterial,
        updateMaterial,
        deleteMaterial,
        documentTexts,
        getOfficerRecommendations,
        enrollments,
        isEnrolled,
        enrollCourse,
        unenrollCourse,
        updateProgress,
        userScores,
        updateUserAssessment,
        activityLogs,
        addActivityLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
