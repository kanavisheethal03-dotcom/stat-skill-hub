export type UserRole = 'officer' | 'admin' | 'learner' | 'trainer';
export type CompetencyLevel = 'Strong' | 'Moderate' | 'Needs Improvement' | 'Critical Gap';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CourseSource = 'igot' | 'internal';
export type QuestionReviewStatus = 'Pending Review' | 'Approved' | 'Rejected';

export type OfficerDesignation =
  | 'Junior Statistical Officer (JSO)'
  | 'Senior Statistical Officer (SSO)'
  | 'Statistical Investigator'
  | 'Assistant Statistical Officer'
  | 'Assistant Director'
  | 'Deputy Director'
  | 'Director'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  department: string;
  position: string;
  avatar: string;
  joinedDate: string;
  assessmentCompleted?: boolean;
  assessmentScore?: number;
  competencyScores?: CompetencyScore[];
  coursesCompletedCount?: number;
  coursesEnrolledCount?: number;
  learningHours?: number;
}

export interface Competency {
  id: string;
  name: string;
  category: string;
  description: string;
  weight: number;
  prerequisites: string[];
}

export interface CompetencyScore {
  competencyId: string;
  competencyName: string;
  category: string;
  score: number;
  previousScore?: number;
  level: CompetencyLevel;
  weight: number;
  impactScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Course {
  id: string;
  title: string;
  source: CourseSource;
  provider: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  durationHours: number;
  topics: string[];
  competencyTags: string[];
  rating: number;
  enrolled: number;
  ratingCount: number;
  matchScore?: number;
  matchReason?: string;
  relevantSkill?: string;
  /** Direct URL on the iGOT Karmayogi portal (if source === 'igot') */
  igotUrl?: string;
  /** Category / domain on iGOT */
  igotCategory?: string;
  /** Embeddable or streaming video URL for the course */
  videoUrl?: string;
  /** Course modules/lessons breakdown */
  modules?: {
    id: string;
    title: string;
    duration: string;
    videoUrl?: string;
  }[];
}

export interface EnrollmentStatus {
  courseId: string;
  enrolledAt: string;
  status: 'enrolled' | 'in_progress' | 'completed';
  progress: number;
}

export interface AssessmentQuestion {
  id: string;
  competencyId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
  sourceReference: string;
  competencyTag: string;
  status?: QuestionReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  feedbackNotes?: string;
}

export interface Recommendation {
  course: Course;
  priority: number;
  reason: string;
  gapAddressed: string;
  estimatedImprovement: number;
  matchScore: number;
  relevantSkill?: string;
}

export interface LearningPathItem {
  courseId: string;
  courseTitle: string;
  source: CourseSource;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  order: number;
}

export interface DepartmentStat {
  department: string;
  totalLearners: number;
  avgCompetency: number;
  criticalGaps: number;
  coursesCompleted: number;
  improvementRate: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'pptx' | 'text';
  uploadedAt: string;
  uploadedBy: string;
  pages: number;
  extracted: boolean;
  conceptsExtracted: number;
  mcqsGenerated: number;
  topics: string[];
}
