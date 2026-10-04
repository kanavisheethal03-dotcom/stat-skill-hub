import { useState } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Database,
  Code,
  Brain,
  Shield,
  Layers,
  Users,
  Route,
  Server,
  Cloud,
  GitBranch,
  Target,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Card, Badge, PageHeader } from '@/components/ui';
import { cn } from '@/utils/cn';

interface Section {
  id: string;
  number: string;
  title: string;
  icon: typeof FileText;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'architecture',
    number: '1',
    title: 'Complete System Architecture',
    icon: Layers,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>High-Level Components:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto">
{`┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                 │
│  Learner UI  │  Trainer UI  │  Admin UI  │  Shared Charts  │
└──────────┬──────────────────────────────────────────────┘
           │ REST + WebSocket (polling fallback)
┌──────────▼──────────────────────────────────────────────┐
│              API GATEWAY / LOAD BALANCER (Nginx)           │
└──────────┬──────────────────────────────────────────────┘
           │
    ┌──────┼──────┬──────┬──────┬──────┐
    ▼      ▼      ▼      ▼      ▼      ▼
┌──────┐┌─────┐┌──────┐┌──────┐┌─────┐┌──────┐
│Auth  ││Assess││Courses││AI    ││iGOT ││Admin │
│Svc   ││Svc   ││Svc   ││Quiz  ││Conn ││Svc   │
│      ││      ││      ││Svc   ││Svc  ││      │
└──┬───┘└──┬──┘└──┬───┘└──┬───┘└──┬──┘└──┬───┘
   │       │      │       │       │      │
   ▼       ▼      ▼       ▼       ▼      ▼
┌──────────────────────────────────────────────┐
│         PostgreSQL (Supabase) + RLS           │
│  Users │ Competencies │ Assessments │ Quizzes │
│  Courses │ Recommendations │ iGOT Catalogue   │
└──────────────────────────────────────────────┘
           │                    │
    ┌──────▼──────┐      ┌──────▼──────┐
    │ Vector Store │      │  LLM Service │
    │ (pgvector)   │      │  (OpenAI/    │
    │ Embeddings   │      │   Llama)     │
    └─────────────┘      └─────────────┘
           │
    ┌──────▼──────┐
    │ Document    │
    │ Processing  │
    │ (PDF/DOCX)  │
    └─────────────┘`}
        </div>
        <p><strong>Data Flow (Key Workflow):</strong></p>
        <pre className="bg-neutral-50 rounded p-3 text-xs font-mono">
{`Assessment → Competency Analysis → Gap Detection →
Recommendation Engine → Course Enrollment (iGOT/Internal) →
Learning Path Execution → Material Upload →
AI MCQ Generation → Quiz → Reassessment → Score Comparison`}
        </pre>
        <p><strong>Key Component List:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li><strong>Frontend:</strong> React 18 + Vite, Tailwind CSS, Lucide icons, custom SVG charts</li>
          <li><strong>Backend:</strong> Node.js/Express OR Python/FastAPI (recommend FastAPI for AI workloads)</li>
          <li><strong>Database:</strong> PostgreSQL (Supabase managed) with RLS policies</li>
          <li><strong>AI Services:</strong> LLM (GPT-4 / Llama 3) + pgvector for embeddings</li>
          <li><strong>Document Processing:</strong> pdf-parse, mammoth (DOCX), pptx-parser</li>
          <li><strong>Auth:</strong> Supabase Auth (JWT-based, email/password)</li>
          <li><strong>iGOT Layer:</strong> Mock API (SIMULATED) with OpenAPI spec for live integration</li>
          <li><strong>Cloud:</strong> Supabase (DB + Auth + Edge Functions), Vercel/Netlify (frontend)</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'user-flows',
    number: '2',
    title: 'User Flows',
    icon: Users,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>Learner Flow:</strong></p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Login → Learner Dashboard (view competency scores, progress)</li>
          <li>Take Initial Assessment → 8 questions across competencies</li>
          <li>View Competency Gap Analysis → AI-classified levels + priority</li>
          <li>View AI Recommendations → iGOT + internal courses ranked by match</li>
          <li>Enroll in course (iGOT or internal) OR decline and use platform materials</li>
          <li>Upload study material → AI generates quiz MCQs</li>
          <li>Take AI-generated quiz → receive score + explanations</li>
          <li>Reassessment → compare scores → competency gap closure</li>
        </ol>
        <p><strong>Trainer Flow:</strong></p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Login → Trainer Dashboard (learner overview, dept analytics)</li>
          <li>Upload learning materials (PDF/DOCX/PPTX)</li>
          <li>View auto-extracted concepts and generated MCQs</li>
          <li>Review/approve AI-generated questions before publishing</li>
          <li>Monitor learner progress, identify struggling learners</li>
          <li>Create custom assessments mapped to competencies</li>
        </ol>
        <p><strong>Administrator Flow:</strong></p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Login → Admin Dashboard (platform-wide analytics)</li>
          <li>View department-wise performance, competency distribution</li>
          <li>Manage users, roles, departments</li>
          <li>Configure competency weights and gap thresholds</li>
          <li>Export reports (competency, enrollment, completion)</li>
          <li>Monitor system health and iGOT integration status</li>
        </ol>
        <p><strong>Key Screens (Wireframe Outlines):</strong></p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li><strong>Login/Registration:</strong> Split-screen with branding panel + role selector + email/password form</li>
          <li><strong>Learner Dashboard:</strong> Stat cards (overall score, gaps, courses, hours) + radar chart + progress line + heatmap + learning path timeline + activity feed</li>
          <li><strong>Assessment Page:</strong> Question card with options, navigator sidebar, progress bar, submit confirmation</li>
          <li><strong>Gap Analysis:</strong> Level summary cards + comparison bar chart + heatmap + priority-ranked table + algorithm explanation</li>
          <li><strong>Learning Path:</strong> Timeline view of courses + recommendation cards with match score, reason, gap addressed, enroll button</li>
          <li><strong>AI Quiz:</strong> Upload zone + processing animation + quiz questions + results with explanations + source references</li>
          <li><strong>Trainer Dashboard:</strong> Learner table, department averages chart, activity feed, material management</li>
          <li><strong>Admin Dashboard:</strong> Platform stats, competency donut, enrollment trend, department table, system health</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'ai-workflow',
    number: '3',
    title: 'AI Workflow Pipeline',
    icon: Brain,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto">
{`┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Document    │──▶│  Knowledge   │──▶│  Competency  │
│  Ingestion   │   │  Extraction  │   │  Mapping     │
│              │   │              │   │              │
│ PDF/DOCX/PPT │   │ Concepts,    │   │ Map to       │
│ OCR, segment │   │ facts, steps │   │ ontology     │
└──────────────┘   └──────────────┘   └──────┬───────┘
                                              │
                    ┌──────────────┐         │
                    │  MCQ         │◀────────┘
                    │  Generation  │
                    │              │
                    │ Templates,   │
                    │ distractors, │
                    │ difficulty   │
                    └──────┬───────┘
                           │
              ┌────────────▼────────────┐
              │  Competency-Gap         │
              │  Detection +            │
              │  Recommendation Engine  │
              └─────────────────────────┘`}
        </div>
        <p><strong>Step Details:</strong></p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary-50 border border-primary-100">
            <p className="font-semibold text-primary-900 text-xs">1. Document Ingestion & Preprocessing</p>
            <p className="text-xs mt-1"><strong>Input:</strong> PDF/DOCX/PPTX/TXT file | <strong>Output:</strong> Segmented text chunks | <strong>Tools:</strong> pdf-parse, mammoth, pptx-parser, Tesseract OCR | <strong>Error handling:</strong> Retry on OCR failure, skip corrupt pages</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary-50 border border-secondary-100">
            <p className="font-semibold text-secondary-900 text-xs">2. Knowledge Extraction</p>
            <p className="text-xs mt-1"><strong>Input:</strong> Text chunks | <strong>Output:</strong> Key concepts, definitions, procedures, examples | <strong>Model:</strong> LLM with structured output (JSON schema) | <strong>Freshness:</strong> Re-extract on document update</p>
          </div>
          <div className="p-3 rounded-lg bg-accent-50 border border-accent-100">
            <p className="font-semibold text-accent-900 text-xs">3. Competency Mapping</p>
            <p className="text-xs mt-1"><strong>Input:</strong> Extracted concepts | <strong>Output:</strong> Competency tag assignments | <strong>Method:</strong> Embedding similarity against competency ontology descriptions | <strong>Update:</strong> Triggered on ontology changes</p>
          </div>
          <div className="p-3 rounded-lg bg-success-50 border border-success-100">
            <p className="font-semibold text-success-900 text-xs">4. MCQ Generation</p>
            <p className="text-xs mt-1"><strong>Input:</strong> Concept + context chunk | <strong>Output:</strong> Question + 4 options + correct answer + explanation + difficulty | <strong>Model:</strong> LLM with template prompts | <strong>Validation:</strong> De-duplication, answer-checking, human review</p>
          </div>
          <div className="p-3 rounded-lg bg-warning-50 border border-warning-100">
            <p className="font-semibold text-warning-900 text-xs">5. Competency-Gap Detection</p>
            <p className="text-xs mt-1"><strong>Input:</strong> Assessment scores | <strong>Output:</strong> Classified levels + impact scores | <strong>Rules:</strong> Threshold-based classification (configurable)</p>
          </div>
          <div className="p-3 rounded-lg bg-error-50 border border-error-100">
            <p className="font-semibold text-error-900 text-xs">6. Recommendation Generation</p>
            <p className="text-xs mt-1"><strong>Input:</strong> Gap analysis + course catalogue | <strong>Output:</strong> Ranked course list with explanations | <strong>Scoring:</strong> Gap severity × course relevance × prerequisite fit</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'db-schema',
    number: '4',
    title: 'Database Schema (SQL DDL)',
    icon: Database,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>PostgreSQL DDL for Core Tables:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-[500px]">
{`-- USERS & AUTH
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('learner','trainer','admin')),
  department TEXT NOT NULL,
  position TEXT,
  avatar TEXT,
  joined_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- COMPETENCIES
CREATE TABLE competencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  weight NUMERIC(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE competency_prerequisites (
  competency_id TEXT REFERENCES competencies(id),
  prerequisite_id TEXT REFERENCES competencies(id),
  PRIMARY KEY (competency_id, prerequisite_id)
);

-- COURSES (iGOT mock + internal)
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT CHECK (source IN ('igot','internal')),
  provider TEXT,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy','medium','hard')),
  duration TEXT,
  duration_hours INT,
  rating NUMERIC(2,1) DEFAULT 0,
  enrolled INT DEFAULT 0,
  rating_count INT DEFAULT 0,
  topics TEXT[],
  competency_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LEARNING MATERIALS
CREATE TABLE learning_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('pdf','docx','pptx','text')),
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  page_count INT,
  extracted BOOLEAN DEFAULT false,
  concepts_extracted INT DEFAULT 0,
  mcqs_generated INT DEFAULT 0,
  topics TEXT[],
  file_path TEXT
);

-- ASSESSMENTS & QUESTIONS
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT CHECK (type IN ('initial','reassessment')),
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  competency_id TEXT REFERENCES competencies(id),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy','medium','hard')),
  explanation TEXT,
  source_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id),
  question_id TEXT REFERENCES questions(id),
  user_answer INT,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- QUIZ RESULTS & SCORES
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  material_id UUID REFERENCES learning_materials(id),
  score INT NOT NULL,
  total INT NOT NULL,
  percentage NUMERIC(5,2),
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  competency_id TEXT REFERENCES competencies(id),
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  level TEXT CHECK (level IN ('Strong','Moderate','Needs Improvement','Critical Gap')),
  assessed_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_skill_scores_user ON skill_scores(user_id);
CREATE INDEX idx_skill_scores_comp ON skill_scores(competency_id);

-- RECOMMENDATIONS & LEARNING PATHS
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id TEXT REFERENCES courses(id),
  priority INT,
  match_score INT,
  reason TEXT,
  gap_addressed TEXT,
  estimated_improvement INT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id TEXT REFERENCES courses(id),
  course_order INT,
  status TEXT DEFAULT 'not_started',
  progress INT DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- CERTIFICATES & HISTORY
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id TEXT REFERENCES courses(id),
  issued_at TIMESTAMPTZ DEFAULT now(),
  certificate_url TEXT
);

CREATE TABLE learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_history_user ON learning_history(user_id);

-- iGOT MOCK CATALOGUE (SIMULATED)
CREATE TABLE igot_catalogue (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT DEFAULT 'iGOT Karmayogi',
  description TEXT,
  difficulty TEXT,
  duration TEXT,
  topics TEXT[],
  competency_tags TEXT[],
  rating NUMERIC(2,1),
  enrolled INT,
  is_mock BOOLEAN DEFAULT true
);

-- ENABLE RLS ON ALL TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
-- (RLS policies per table follow bolt-database skill template)`}
        </div>
        <p className="text-xs"><strong>ER Relationships:</strong> Users 1:N Assessments, Users 1:N SkillScores, Users 1:N Recommendations, Competencies N:N Competencies (prerequisites), Courses N:M Competencies (tags), Assessments 1:N AssessmentAnswers, LearningMaterials 1:N QuizResults</p>
      </div>
    ),
  },
  {
    id: 'ui-structure',
    number: '5',
    title: 'UI / Dashboard Structure',
    icon: Target,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>Learner UI Components:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>Dashboard: Stat cards, Radar chart (competency profile), Line chart (progress), Heatmap, Learning path timeline, Activity feed</li>
          <li>Assessment: Question card, Option selector, Progress navigator, Results breakdown</li>
          <li>Gap Analysis: Level summary, Bar comparison chart, Heatmap, Priority table, Algorithm explainer</li>
          <li>Learning Path: Timeline + recommendation cards with match scores and reasoning</li>
          <li>AI Quiz: Upload zone, Processing animation, Quiz interface, Results with explanations</li>
        </ul>
        <p><strong>Trainer UI Components:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>Learner progress table, Department averages bar chart, Activity feed, Material upload + management</li>
        </ul>
        <p><strong>Admin UI Components:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>Platform stat cards, Competency donut chart, Enrollment trend line, Department performance table, Course completion bar chart, System health panel, Report generator</li>
        </ul>
        <p><strong>Key Visualizations:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li><strong>Competency Heatmap:</strong> Color-coded tiles (green=strong, teal=moderate, orange=needs improvement, red=critical)</li>
          <li><strong>Radar Chart:</strong> 8-axis polygon showing current vs. baseline scores</li>
          <li><strong>Progress Timeline:</strong> Line chart showing weekly competency improvement</li>
          <li><strong>Department Aggregate:</strong> Table with progress bars and improvement rates</li>
        </ul>
        <p><strong>Accessibility & Responsiveness:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>WCAG 2.1 AA compliant: semantic HTML, ARIA labels, keyboard navigation</li>
          <li>Color contrast ratios 4.5:1 or higher for all text</li>
          <li>Responsive breakpoints: mobile (320px), tablet (768px), desktop (1024px), wide (1280px)</li>
          <li>Screen reader compatible charts with text alternatives</li>
          <li>Reduced motion support for animations</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'frontend-modules',
    number: '6',
    title: 'Frontend Module Structure',
    icon: Code,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>React Component Breakdown:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto">
{`src/
├── components/
│   ├── ui/              # Button, Card, Badge, ProgressBar, StatCard
│   ├── charts/          # RadarChart, BarChart, LineChart, DonutChart, Heatmap
│   └── AppLayout.tsx    # Sidebar + Header + Role switcher
├── pages/
│   ├── LoginPage.tsx
│   ├── LearnerDashboard.tsx
│   ├── AssessmentPage.tsx
│   ├── GapAnalysisPage.tsx
│   ├── LearningPathPage.tsx
│   ├── QuizGenerationPage.tsx
│   ├── MaterialsPage.tsx
│   ├── TrainerDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── DesignDocPage.tsx
├── types/
│   └── index.ts         # All TypeScript interfaces
├── data/
│   └── mockData.ts      # Simulated data (iGOT, users, scores, etc.)
├── utils/
│   └── cn.ts            # Class name utility
├── services/
│   ├── apiClient.ts     # Axios/fetch wrapper
│   ├── authService.ts   # Auth state management
│   └── analyticsService.ts
├── hooks/
│   ├── useAuth.ts       # Auth context + hooks
│   └── useAsyncData.ts  # Data fetching with loading states
├── store/
│   └── AppContext.tsx   # Global state (user, role, navigation)
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Tailwind + global styles`}
        </div>
        <p className="text-xs"><strong>State Management:</strong> React Context + hooks for global state (current user, role, navigation). No Redux needed — app is simple enough for Context. For async data: custom useAsyncData hook with loading/error states.</p>
        <p className="text-xs"><strong>Routing:</strong> Simple state-based routing via App.tsx (no react-router for prototype). For production: react-router-dom with protected routes.</p>
        <p className="text-xs"><strong>Realtime/Async:</strong> Polling for long jobs (document processing) with 2-sec interval. WebSocket upgrade path via Supabase Realtime for production.</p>
      </div>
    ),
  },
  {
    id: 'backend-api',
    number: '7',
    title: 'Backend API Structure (OpenAPI)',
    icon: Server,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>OpenAPI Spec Outline (REST):</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-[400px]">
{`openapi: 3.0.3
info:
  title: StatLearn AI API
  version: 1.0.0
  description: SIH26101 - AI Personalized Learning Platform

paths:
  # AUTH
  /auth/login:
    post:
      summary: User login
      requestBody: { email, password }
      responses: { 200: { token, user }, 401 }
  /auth/register:
    post:
      requestBody: { email, password, name, department }
      responses: { 201: { user }, 400 }
  /auth/refresh:
    post:
      responses: { 200: { token } }

  # USERS
  /users/{id}:
    get:    responses: { 200: User }
    patch:  requestBody: Partial<User>

  # ASSESSMENTS
  /assessments:
    get:    responses: { 200: [Assessment] }
    post:   requestBody: { type: 'initial' }
  /assessments/{id}/submit:
    post:   requestBody: { answers: [{questionId, answer}] }
            responses: { 200: { score, breakdown } }
  /assessments/{id}/results:
    get:    responses: { 200: { score, perCompetency } }

  # COMPETENCIES
  /competencies:
    get:    responses: { 200: [Competency] }
  /competencies/{id}/map:
    post:   requestBody: { concepts: [] }
            responses: { 200: { mappings: [] } }

  # COURSES
  /courses:
    get:    parameters: [source, difficulty, competencyId]
  /courses/{id}:
    get:    responses: { 200: Course }
  /courses/{id}/enroll:
    post:   responses: { 201: { enrollment } }

  # LEARNING MATERIALS
  /materials/upload:
    post:   requestBody: multipart/form-data
            responses: { 202: { jobId } }
  /materials/{id}/extract:
    get:    responses: { 200: { concepts, mcqs } }

  # QUIZ GENERATION
  /quizzes/generate:
    post:   requestBody: { materialId, count, difficulty }
            responses: { 202: { quizId } }
  /quizzes/{id}:
    get:    responses: { 200: { questions } }
  /quizzes/{id}/submit:
    post:   requestBody: { answers }
            responses: { 200: { score, explanations } }

  # RECOMMENDATIONS
  /recommendations/{userId}:
    get:    responses: { 200: [Recommendation] }

  # iGOT MOCK (SIMULATED)
  /igot/search:
    get:    parameters: [query, competencyId, difficulty]
  /igot/course/{id}:
    get:    responses: { 200: IGOTCourse }

  # ADMIN
  /admin/reports:
    get:    parameters: [type, department, dateRange]
  /admin/users:
    get:    parameters: [role, department]`}
        </div>
        <p className="text-xs"><strong>Sample Request/Response:</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs font-mono">
{`POST /assessments/{id}/submit
Request:
{ "answers": [{"questionId":"q1","answer":1}, ...] }
Response:
{ "score": 6, "total": 8, "percentage": 75,
  "breakdown": [{"competencyId":"c1","score":100,"level":"Strong"}, ...] }`}
        </div>
      </div>
    ),
  },
  {
    id: 'ai-integration',
    number: '8',
    title: 'AI Integration Approach (LLM + RAG)',
    icon: Brain,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>RAG Architecture:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li><strong>LLM:</strong> GPT-4 (commercial) or Llama 3 70B (open, on-premise for government)</li>
          <li><strong>Embedding Model:</strong> text-embedding-3-small (1536 dims) or BGE-M3 (open)</li>
          <li><strong>Vector Store:</strong> pgvector extension in PostgreSQL (same DB, no separate infra)</li>
          <li><strong>Chunking Strategy:</strong> 512-token chunks with 64-token overlap, section-aware splitting</li>
          <li><strong>Context Window:</strong> 128K (GPT-4) / 8K (Llama 3) — manage via top-k retrieval (k=5)</li>
          <li><strong>Chain-of-Thought:</strong> Enabled for complex reasoning (gap analysis, recommendation scoring)</li>
          <li><strong>Safety:</strong> Output validation schema, hallucination checks via source citation requirement</li>
        </ul>
        <p><strong>Prompt Template — MCQ Generation:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs">
{`SYSTEM: You are an expert assessment creator for India's Official
Statistical System. Generate high-quality MCQs from the given text.

USER:
Document chunk: {chunk_text}
Competency tag: {competency_name}
Difficulty: {difficulty_level}
Number of questions: {count}

Rules:
1. Each question must have exactly 4 options (A-D)
2. Exactly one correct answer
3. Distractors must be plausible and same domain
4. Include a clear explanation citing the source text
5. Include source reference (section + page)
6. For 'easy': test definitions/facts
   'medium': test application/understanding
   'hard': test analysis/evaluation

Output JSON:
[{ "question": "...", "options": ["A","B","C","D"],
   "correctAnswer": 0, "difficulty": "easy",
   "explanation": "...", "sourceReference": "..." }]`}
        </div>
        <p><strong>Prompt Template — Recommendation Explanation:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs">
{`SYSTEM: You are a learning path advisor. Explain why a course is
recommended based on the learner's competency gaps.

USER:
Learner gaps: {gap_analysis_json}
Course details: {course_json}
Match score: {match_score}

Generate a 2-3 sentence explanation that:
1. Names the specific competency gap addressed
2. Explains how the course content maps to the gap
3. Mentions prerequisite considerations

Output: { "reason": "...", "gapAddressed": "..." }`}
        </div>
        <p><strong>Sample MCQ Generation (Concrete Example):</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs space-y-2">
          <p><strong>Input text:</strong> "The recommended first step in any data preprocessing pipeline is data profiling — a systematic examination of the dataset to understand its structure, quality, and completeness."</p>
          <p><strong>Generated MCQ (Easy):</strong></p>
          <p>Q: What is the recommended first step in the data preprocessing pipeline?</p>
          <p>A) Apply ML models immediately B) Perform data profiling C) Export to visualization tool D) Delete missing columns</p>
          <p><strong>Correct: B</strong> — Data profiling reveals structure, quality, and completeness before any transformation. (Source: Section 2.1, Page 3)</p>
        </div>
        <p><strong>Evaluation Metrics:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li><strong>Accuracy:</strong> Human expert validation (target: above 90% correct answers)</li>
          <li><strong>Alignment:</strong> Competency tag match rate (target: above 85%)</li>
          <li><strong>Hallucination Check:</strong> Source citation required; automated NLI check against source text</li>
          <li><strong>Distractor Quality:</strong> Plausibility score via embedding distance from correct answer</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'igot-integration',
    number: '9',
    title: 'iGOT Integration / Mock API',
    icon: Cloud,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <div className="p-3 rounded-lg bg-warning-50 border border-warning-200">
          <p className="text-xs font-medium text-warning-800">SIMULATED DATA — The iGOT integration in this prototype is entirely mocked. No live iGOT Karmayogi API is connected.</p>
        </div>
        <p><strong>Live Integration Approach (if APIs available):</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>OAuth 2.0 flow with iGOT Karmayogi for SSO</li>
          <li>REST API for course catalogue sync (daily cron job)</li>
          <li>Webhook for enrollment/completion callbacks</li>
          <li>Rate limit: 100 req/min (estimated), implement exponential backoff</li>
          <li>Map iGOT course metadata to local course schema via field mapping table</li>
        </ul>
        <p><strong>Mock iGOT API (OpenAPI):</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs">
{`# MOCK iGOT API (SIMULATED)
GET /igot/search?query=python&difficulty=hard
→ 200: [{ "id":"igot003", "title":"Python for Statistical Computing",
          "provider":"iGOT Karmayogi", "difficulty":"hard",
          "duration":"20 hours", "rating":4.6, "enrolled":2100,
          "is_mock": true }]

GET /igot/course/igot003
→ 200: { "id":"igot003", ... full course details, "syllabus": [...] }`}
        </div>
        <p><strong>Mock iGOT Course Catalogue (JSON, 8 courses):</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs font-mono max-h-[300px] overflow-y-auto">
{`[
  {"id":"igot001","title":"Statistical Data Analysis Fundamentals","difficulty":"easy","duration":"8h","competencyTags":["c2","c3"],"rating":4.5},
  {"id":"igot002","title":"Data Visualization for Government Reports","difficulty":"medium","duration":"10h","competencyTags":["c4"],"rating":4.7},
  {"id":"igot003","title":"Python for Statistical Computing","difficulty":"hard","duration":"20h","competencyTags":["c5","c3"],"rating":4.6},
  {"id":"igot004","title":"Survey Design and Methodology","difficulty":"easy","duration":"6h","competencyTags":["c6","c1"],"rating":4.3},
  {"id":"igot005","title":"National Accounts Statistics: SNA Framework","difficulty":"hard","duration":"15h","competencyTags":["c7"],"rating":4.4},
  {"id":"igot006","title":"Data Quality Assurance in Official Statistics","difficulty":"medium","duration":"9h","competencyTags":["c8","c3"],"rating":4.5},
  {"id":"igot007","title":"Advanced Regression and Modeling","difficulty":"hard","duration":"18h","competencyTags":["c2","c3"],"rating":4.8},
  {"id":"igot008","title":"Introduction to R for Government Data","difficulty":"medium","duration":"12h","competencyTags":["c5","c4"],"rating":4.2}
]`}
        </div>
      </div>
    ),
  },
  {
    id: 'mcq-pipeline',
    number: '10',
    title: 'MCQ Generation Pipeline',
    icon: FileText,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto">
{`Extraction → Chunking (512 tokens, 64 overlap) → Concept Labeling
→ Question Template Application → Distractor Generation
→ Difficulty Tagging → Validation & De-duplication
→ Enrichment (references + time estimates)`}
        </div>
        <p><strong>Question Templates by Difficulty:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li><strong>Easy:</strong> "What is [concept]?" / "Which statement about [topic] is correct?" — tests recall</li>
          <li><strong>Medium:</strong> "Which method is most appropriate for [scenario]?" / "What is the primary purpose of [technique]?" — tests application</li>
          <li><strong>Hard:</strong> "Given [complex scenario], which combination of methods would you use and why?" — tests analysis/evaluation</li>
        </ul>
        <p><strong>Distractor Generation Rules:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li><strong>Plausibility:</strong> Same domain, similar terminology, near-miss semantics</li>
          <li><strong>Same part of speech:</strong> If answer is a noun phrase, distractors are noun phrases</li>
          <li><strong>Common misconceptions:</strong> Use known error patterns (e.g., confusing p-value with probability H0 is true)</li>
          <li><strong>Embedding distance:</strong> Distractors within 0.3-0.7 cosine distance from correct answer (not too similar, not too different)</li>
        </ul>
        <p><strong>Sample Input → 3 Generated MCQs:</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs space-y-3">
          <p className="font-semibold">Input extract: "Data profiling is the recommended first step... For MCAR data, listwise deletion is valid... Combine Z-score and IQR methods with domain expert review for outliers."</p>
          <div className="border-l-2 border-success-400 pl-3">
            <p><strong>Q1 (Easy):</strong> What is the recommended first step in data preprocessing?</p>
            <p>A) ML models B) Data profiling ✓ C) Visualization D) Delete columns</p>
            <p className="text-neutral-500 italic">Explanation: Data profiling reveals structure, quality, and completeness. (Source: Section 2.1, Page 3)</p>
          </div>
          <div className="border-l-2 border-warning-400 pl-3">
            <p><strong>Q2 (Medium):</strong> For MCAR data, which method is statistically valid?</p>
            <p>A) Hot-deck imputation B) Listwise deletion ✓ C) Multiple imputation (20 iter) D) Mean imputation</p>
            <p className="text-neutral-500 italic">Explanation: MCAR makes listwise deletion unbiased, though it reduces sample size. (Source: Section 3.2, Page 7)</p>
          </div>
          <div className="border-l-2 border-error-400 pl-3">
            <p><strong>Q3 (Hard):</strong> What combination is recommended for robust outlier identification?</p>
            <p>A) Z-score only (threshold 3) B) IQR only (1.5x) C) Z-score + IQR + domain expert review ✓ D) Visual inspection only</p>
            <p className="text-neutral-500 italic">Explanation: Combine Z-scores for normal data, IQR for skewed, plus domain review. (Source: Section 3.4, Page 9)</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'gap-algorithm',
    number: '11',
    title: 'Competency-Gap Algorithm',
    icon: Target,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>Pseudocode:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto">
{`FUNCTION classify_and_prioritize(scores, config):
  # config = { strong: 80, moderate: 60, needs_imp: 40 }
  results = []
  FOR each score IN scores:
    # Classify
    IF score.value >= config.strong:
      level = "Strong"
    ELIF score.value >= config.moderate:
      level = "Moderate"
    ELIF score.value >= config.needs_imp:
      level = "Needs Improvement"
    ELSE:
      level = "Critical Gap"

    # Calculate impact score
    gap = 100 - score.value
    impact = score.weight * gap / 10

    results.append({ score, level, impact })

  # Sort by impact score (descending)
  results.sort(key: r.impact, descending: true)

  RETURN results

# Stopping criteria:
# Competency considered CLOSED when:
#   post_score >= 75 AND improvement >= 20%`}
        </div>
        <p><strong>Sample Calculation (Demo Data):</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-1">Competency</th>
                <th className="text-center py-1">Score</th>
                <th className="text-center py-1">Weight</th>
                <th className="text-center py-1">Gap</th>
                <th className="text-center py-1">Impact</th>
                <th className="text-center py-1">Level</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-neutral-100"><td>Data Collection</td><td className="text-center">85%</td><td className="text-center">1.0</td><td className="text-center">15</td><td className="text-center font-bold">1.5</td><td className="text-center text-success-600">Strong</td></tr>
              <tr className="border-b border-neutral-100"><td>Statistical Methods</td><td className="text-center">72%</td><td className="text-center">1.2</td><td className="text-center">28</td><td className="text-center font-bold">3.4</td><td className="text-center text-secondary-600">Moderate</td></tr>
              <tr className="border-b border-neutral-100"><td>Data Analysis</td><td className="text-center">45%</td><td className="text-center">1.3</td><td className="text-center">55</td><td className="text-center font-bold">7.2</td><td className="text-center text-warning-600">Needs Imp.</td></tr>
              <tr className="border-b border-neutral-100"><td>Data Visualization</td><td className="text-center">35%</td><td className="text-center">1.1</td><td className="text-center">65</td><td className="text-center font-bold">7.2</td><td className="text-center text-error-600">Critical</td></tr>
              <tr><td>Python</td><td className="text-center">30%</td><td className="text-center">1.4</td><td className="text-center">70</td><td className="text-center font-bold">9.8</td><td className="text-center text-error-600">Critical</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs"><strong>Priority Order:</strong> Python (9.8) → Data Analysis (7.2) → Data Viz (7.2) → Statistical Methods (3.4) → Data Collection (1.5)</p>
      </div>
    ),
  },
  {
    id: 'recommendation-algo',
    number: '12',
    title: 'Personalized Recommendation Algorithm',
    icon: Route,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>Pseudocode:</strong></p>
        <div className="bg-neutral-900 text-neutral-300 rounded-lg p-4 font-mono text-xs overflow-x-auto">
{`FUNCTION generate_recommendations(user, gaps, courses):
  recommendations = []

  FOR each course IN courses:
    # 1. Gap severity score (0-40)
    gap_score = 0
    FOR each tag IN course.competency_tags:
      gap = gaps[tag]
      IF gap.level == "Critical Gap": gap_score += 40
      ELIF gap.level == "Needs Improvement": gap_score += 30
      ELIF gap.level == "Moderate": gap_score += 15
      ELSE: gap_score += 5

    # 2. Prerequisite fit (0-20)
    prereq_met = check_prerequisites(user, course)
    prereq_score = prereq_met ? 20 : 0

    # 3. Course relevance (0-20)
    topic_match = cosine_sim(course.topics, user.weaknesses)
    relevance_score = topic_match * 20

    # 4. Difficulty fit (0-10)
    IF course.difficulty == "easy" AND user.avg < 50: diff_score = 10
    ELIF course.difficulty == "medium" AND user.avg < 70: diff_score = 8
    ELIF course.difficulty == "hard" AND user.avg >= 60: diff_score = 6
    ELSE: diff_score = 3

    # 5. Time budget fit (0-10)
    IF course.duration_hours <= user.weekly_budget: time_score = 10
    ELSE: time_score = 5

    total = gap_score + prereq_score + relevance_score + diff_score + time_score
    recommendations.append({ course, score: total })

  recommendations.sort(descending: score)
  RETURN recommendations[:5]  # Top 5`}
        </div>
        <p><strong>Example Ranked Output (Demo):</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs space-y-2">
          <p>1. <strong>Python for Statistical Computing</strong> (94%) — Highest gap (30, weight 1.4), direct topic match, prerequisites met</p>
          <p>2. <strong>Data Visualization for Govt Reports</strong> (88%) — Critical gap (35), direct competency tag match, medium difficulty fit</p>
          <p>3. <strong>Statistical Data Analysis Fundamentals</strong> (82%) — Addresses Data Analysis gap, prerequisite for Python course, easy entry point</p>
          <p>4. <strong>Data Quality Assurance</strong> (76%) — Needs Improvement gap, complementary to analysis training</p>
          <p>5. <strong>Practical Data Cleaning Workshop</strong> (71%) — Internal, short duration, reinforces analysis concepts</p>
        </div>
      </div>
    ),
  },
  {
    id: 'security',
    number: '13',
    title: 'Security Considerations',
    icon: Shield,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <ul className="list-disc list-inside text-xs space-y-2">
          <li><strong>Authentication:</strong> JWT-based via Supabase Auth. Access token (15-min TTL) + refresh token. HTTP-only cookies for token storage.</li>
          <li><strong>Authorization (RBAC):</strong> Three roles — learner, trainer, admin. RLS policies per table. Learners see only own data; trainers see supervised learners; admins see all.</li>
          <li><strong>Encryption:</strong> TLS 1.3 in transit, AES-256 at rest (Supabase managed). PII fields (email, name) encrypted at application layer.</li>
          <li><strong>PII Minimization:</strong> Collect only required fields. No Aadhaar/financial data. Email is primary identifier.</li>
          <li><strong>Audit Logging:</strong> Every API mutation logged in learning_history table with user ID, action, timestamp, IP.</li>
          <li><strong>Indian Data Localization:</strong> Supabase region configured for ap-south-1 (Mumbai). All data stays within India.</li>
          <li><strong>Model Safety:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Hallucination guardrails: source citation required for all AI outputs</li>
              <li>Manual review flow: trainer approves AI-generated MCQs before publishing</li>
              <li>Explainability: every recommendation includes reason + gap addressed + confidence score</li>
              <li>Provenance: each question links to source document section + page</li>
            </ul>
          </li>
          <li><strong>Secure Deployment:</strong> HTTPS only, CSP headers, rate limiting (100 req/min per user), input validation on all endpoints, SQL injection prevention via parameterized queries.</li>
          <li><strong>Pen-Test Recommendations:</strong> OWASP Top 10 audit, authenticated scanning, LLM-specific tests (prompt injection, jailbreak), RLS policy review.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'roadmap',
    number: '14',
    title: 'SIH Prototype Development Plan',
    icon: GitBranch,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>3-Month Delivery Schedule (12 sprints, 2-week each):</strong></p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary-50 border border-primary-100">
            <p className="font-semibold text-primary-900 text-xs">Month 1 (Sprints 1-2): MVP Foundation</p>
            <ul className="text-xs list-disc list-inside mt-2 space-y-1">
              <li>User auth (Supabase), role-based access (learner/trainer/admin)</li>
              <li>Learner Dashboard with competency visualizations</li>
              <li>Initial assessment flow (8 questions, auto-scoring)</li>
              <li>Competency gap analysis page</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-secondary-50 border border-secondary-100">
            <p className="font-semibold text-secondary-900 text-xs">Month 2 (Sprints 3-4): AI + iGOT Integration</p>
            <ul className="text-xs list-disc list-inside mt-2 space-y-1">
              <li>AI quiz generation from uploaded PDFs (LLM + RAG)</li>
              <li>Mock iGOT catalogue + recommendation engine</li>
              <li>Personalized learning path generation</li>
              <li>Trainer dashboard with learner monitoring</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-accent-50 border border-accent-100">
            <p className="font-semibold text-accent-900 text-xs">Month 3 (Sprints 5-6): Analytics + Polish</p>
            <ul className="text-xs list-disc list-inside mt-2 space-y-1">
              <li>Admin dashboard with department analytics</li>
              <li>Reassessment flow + improvement tracking</li>
              <li>Accessibility audit, mobile optimization</li>
              <li>Demo preparation, documentation, testing</li>
            </ul>
          </div>
        </div>
        <p><strong>MVP Acceptance Criteria:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>User can register, login, and take initial assessment</li>
          <li>AI generates 3+ valid MCQs from uploaded PDF within 10 seconds</li>
          <li>Recommendation engine produces 5 ranked courses with explanations</li>
          <li>Gap analysis correctly classifies all 8 competencies</li>
          <li>All dashboards render with mock data on mobile + desktop</li>
        </ul>
        <p><strong>CI/CD:</strong> GitHub Actions → lint + typecheck → build → deploy to Vercel (frontend) + Supabase (DB/functions). Automated tests on PR.</p>
      </div>
    ),
  },
  {
    id: 'team',
    number: '15',
    title: 'Team Member Task Distribution',
    icon: Users,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-2 font-medium text-neutral-500">Role</th>
                <th className="text-left py-2 px-2 font-medium text-neutral-500">Responsibilities</th>
                <th className="text-center py-2 px-2 font-medium text-neutral-500">Effort</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'PM / Scrum Master', tasks: 'Sprint planning, stakeholder communication, demo prep', effort: 'Part-time' },
                { role: 'UI/UX Designer', tasks: 'Wireframes, design system, accessibility audit', effort: '3 weeks' },
                { role: 'Frontend Dev (2)', tasks: 'React UI, charts, responsive design, state management', effort: 'Full-time' },
                { role: 'Backend Dev (1)', tasks: 'API design, Supabase setup, RLS policies, auth', effort: 'Full-time' },
                { role: 'ML Engineer (1)', tasks: 'LLM integration, RAG pipeline, MCQ generation, prompt engineering', effort: 'Full-time' },
                { role: 'Data Engineer', tasks: 'DB schema, mock iGOT data, data pipeline, vector store', effort: '3 weeks' },
                { role: 'QA Engineer', tasks: 'Test plans, E2E tests, accessibility testing, demo validation', effort: 'Part-time' },
                { role: 'DevOps', tasks: 'CI/CD, deployment, monitoring, environment setup', effort: '2 weeks' },
                { role: 'Domain SME', tasks: 'Competency ontology, assessment questions, content review', effort: 'Part-time' },
              ].map((m) => (
                <tr key={m.role} className="border-b border-neutral-100">
                  <td className="py-2 px-2 font-medium text-neutral-800">{m.role}</td>
                  <td className="py-2 px-2 text-neutral-600">{m.tasks}</td>
                  <td className="py-2 px-2 text-center text-neutral-500">{m.effort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: 'innovation',
    number: '16',
    title: 'Innovation Points',
    icon: Sparkles,
    content: (
      <div className="space-y-3 text-sm text-neutral-700">
        {[
          { title: 'AI-Powered Competency Gap Analysis', desc: 'Not just scoring — impact-weighted prioritization considering competency dependencies and learning impact.' },
          { title: 'MCQ Generation from Uploaded Documents', desc: 'Trainers upload any PDF/DOCX and get validated, difficulty-tagged MCQs with source citations — no manual question writing.' },
          { title: 'Explainable Recommendations', desc: 'Every course recommendation includes a natural-language explanation linking it to the specific competency gap addressed.' },
          { title: 'iGOT Karmayogi Ecosystem Integration', desc: 'Seamless bridge between internal competency analysis and the iGOT course catalogue for unified learning.' },
          { title: 'Measurable Improvement Loop', desc: 'Baseline → training → reassessment with before/after comparison proving competency growth — data-driven evidence of training ROI.' },
          { title: 'Adaptive Learning Paths', desc: 'AI sequences courses respecting prerequisite dependencies and learner time budgets, not a one-size-fits-all curriculum.' },
          { title: 'Competency Ontology with Prerequisites', desc: 'Domain-expert-curated competency graph enables intelligent sequencing and prevents skipping foundational gaps.' },
          { title: 'Source-Provenanced AI Output', desc: 'Every AI-generated question links to source document section/page — traceable, auditable, and reviewable.' },
          { title: 'Domain-Specific for Official Statistics', desc: 'Built for the Indian statistical system with NSSO standards, SNA framework, and government data handling practices.' },
          { title: 'Dual-Source Course Catalogue', desc: 'Combines iGOT (government standardized) + internal (NSO-specific) courses in one ranked recommendation list.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
              <p className="text-xs text-neutral-600 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'future-scope',
    number: '17',
    title: 'Future Scope',
    icon: TrendingUp,
    content: (
      <div className="space-y-3 text-sm text-neutral-700">
        <ul className="list-disc list-inside text-xs space-y-2">
          <li><strong>Federated Learning:</strong> Train personalization models across departments without sharing raw learner data — privacy-preserving model improvement.</li>
          <li><strong>Offline Mobile Support:</strong> PWA with IndexedDB sync for field officers with intermittent connectivity during survey operations.</li>
          <li><strong>Multilingual Support:</strong> Hindi, Tamil, Bengali, Marathi, Telugu — critical for statewide statistical staff training.</li>
          <li><strong>Advanced Department Analytics:</strong> Predictive models for competency trends, training budget optimization, workforce planning insights.</li>
          <li><strong>Competency Standardization:</strong> Cross-ministry competency framework alignment — shared ontology across MoSPI, NITI Aayog, state statistical bureaus.</li>
          <li><strong>HR/Payroll Integration:</strong> Link competency achievements to career progression, performance reviews, and promotion criteria.</li>
          <li><strong>Automated Curriculum Design:</strong> AI generates entire course structures from high-level competency goals — not just MCQs but full learning modules.</li>
          <li><strong>Robust Distractor Generation:</strong> Fine-tune domain-specific models for generating higher-quality, more nuanced distractors using learner error patterns.</li>
          <li><strong>Continual Learning:</strong> Model updates based on trainer-approved questions and learner performance data — self-improving question bank.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'demo-strategy',
    number: '18',
    title: 'SIH Demo Strategy',
    icon: CheckCircle2,
    content: (
      <div className="space-y-4 text-sm text-neutral-700">
        <p><strong>Live Demo Script (10 minutes):</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs space-y-2">
          <p><strong>0:00-1:00</strong> — Login as Learner (Priya Sharma, NSO). Show dashboard with competency radar + baseline scores.</p>
          <p><strong>1:00-3:00</strong> — Take Initial Assessment (8 questions). Submit and show results: 52% overall, critical gaps in Python & Data Viz.</p>
          <p><strong>3:00-4:00</strong> — View Gap Analysis: impact-scored priority list, heatmap. Highlight Python (impact 9.8) as top priority.</p>
          <p><strong>4:00-5:30</strong> — View AI Recommendations: 5 ranked courses with explanations. Enroll in Python (iGOT) + Data Viz (iGOT).</p>
          <p><strong>5:30-7:00</strong> — Upload "Data_Preprocessing_Handbook.pdf". Show AI pipeline animation. 3 MCQs generated in ~5 sec.</p>
          <p><strong>7:00-8:30</strong> — Take AI-generated quiz. Score 2/3 (67%). Show explanations with source citations.</p>
          <p><strong>8:30-9:00</strong> — Reassessment results: overall improved from 52% to 71% (+18.5%). Radar chart shows before/after overlay.</p>
          <p><strong>9:00-10:00</strong> — Switch to Admin dashboard. Show department analytics, competency distribution, enrollment growth. Q&A.</p>
        </div>
        <p><strong>KPIs to Highlight:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>Average competency improvement: +18.5% after training</li>
          <li>Critical gaps reduced from 2 to 0 in demo learner</li>
          <li>AI quiz generation time: under 10 seconds per document</li>
          <li>Recommendation match accuracy: 94% top match</li>
          <li>Courses completed: 2 iGOT + 1 internal in learning path</li>
        </ul>
        <p><strong>Failover Plan:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>If LLM latency: pre-generated quiz cached, show from memory</li>
          <li>If network issues: local mock data fallback (all data pre-loaded)</li>
          <li>Backup screenshots of every screen for worst-case</li>
          <li>Recorded video of full demo flow as ultimate fallback</li>
        </ul>
        <p><strong>Demo Credentials:</strong></p>
        <div className="bg-neutral-50 rounded p-3 text-xs font-mono">
{`Learner:  priya.sharma@mospi.gov.in / demo123456
Trainer:  rajesh.kumar@mospi.gov.in / demo123456
Admin:    anita.desai@mospi.gov.in / demo123456`}
        </div>
        <p><strong>Immediate Next Steps (Checklist):</strong></p>
        <div className="space-y-2">
          {[
            'Set up Supabase project with DDL schema and RLS policies',
            'Implement backend API with FastAPI/Express following OpenAPI spec',
            'Integrate LLM (GPT-4 or Llama 3) with RAG pipeline using pgvector',
            'Connect frontend to live API (replace mockData.ts with real fetches)',
            'Implement document upload + processing with pdf-parse',
            'Add assessment + quiz submission with real scoring',
            'Deploy to Vercel + Supabase and conduct end-to-end testing',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-5 h-5 rounded border-2 border-primary-300 flex items-center justify-center text-primary-500">
                {i + 1}
              </div>
              <span className="text-neutral-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

interface DesignDocPageProps {
  defaultOpen?: string;
}

export function DesignDocPage({ defaultOpen }: DesignDocPageProps) {
  const [openSection, setOpenSection] = useState<string | null>(defaultOpen || 'architecture');

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <>
      <PageHeader
        title="System Design Document"
        subtitle="Complete 18-section architecture, AI pipeline, database schema, and delivery plan for SIH26101"
      >
        <Badge variant="primary">
          <FileText size={12} /> 18 Sections
        </Badge>
      </PageHeader>

      <Card className="p-4 mb-4 bg-primary-50 border-primary-200">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-primary-600 shrink-0 mt-0.5" />
          <p className="text-xs text-primary-900">
            This interactive document contains the full system design for the AI-enabled personalized
            learning and competency-building platform implementing SIH26101. Click any section to expand.
            All iGOT data is <strong>simulated/mock</strong> and clearly labeled.
          </p>
        </div>
      </Card>

      <div className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSection === section.id;
          return (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggle(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 text-left transition-colors',
                  isOpen ? 'bg-primary-50/50' : 'hover:bg-neutral-50'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                  isOpen ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-500'
                )}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400">{section.number}</span>
                    <h3 className={cn(
                      'text-sm font-semibold',
                      isOpen ? 'text-primary-900' : 'text-neutral-800'
                    )}>
                      {section.title}
                    </h3>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown size={18} className="text-neutral-400 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-neutral-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 pt-0 animate-slide-up">
                  {section.content}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
