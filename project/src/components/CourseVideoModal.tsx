import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ExternalLink,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  FileText,
  Shield,
  Video,
  Presentation,
  UserCheck,
  Radio,
  Mic,
  BarChart3,
  Code2,
  Tv,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '@/components/ui';
import { useIgot } from '@/context/IgotContext';
import { openIGOTCourse } from '@/utils/igotUtils';
import type { Course } from '@/types';
import { getMockIgotVideoUrl, getMockIgotVideoData } from '@/services/igotMockApi';
import type { IgotVideoData } from '@/services/igotMockApi';

interface CourseVideoModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

interface LectureSlide {
  title: string;
  topic: string;
  speakerScript: string;
  bullets: string[];
  visualType: 'chart' | 'code' | 'framework' | 'guideline';
  visualContent: string;
  keyTakeaway: string;
}

export function CourseVideoModal({ course, isOpen, onClose }: CourseVideoModalProps) {
  const { isEnrolled, enrollCourse, enrollments, updateProgress } = useIgot();
  const [igotVideoUrl, setIgotVideoUrl] = useState<string>('');
  const [igotVideoData, setIgotVideoData] = useState<IgotVideoData | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'classroom' | 'video_stream' | 'quiz'>('classroom');
  const [classroomLayout, setClassroomLayout] = useState<'split' | 'video_focus' | 'slide_focus'>('split');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize modal state
  useEffect(() => {
    if (isOpen && course) {
      // Reset modal state
      setActiveModuleIndex(0);
      setCurrentSlideIndex(0);
      setIsPlaying(false);
      setElapsedSeconds(0);
      setQuizSubmitted(false);
      setSelectedAnswer(null);
      // Fetch mock iGOT video data for this course
      getMockIgotVideoData(course.id).then((data) => {
        setIgotVideoData(data);
        setIgotVideoUrl(data.embedUrl);
      });
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  // Rich course-specific lecture slides
  const getCourseSlides = (c: Course): LectureSlide[] => {
    if (c.id === 'igot002' || c.title.toLowerCase().includes('visualization')) {
      return [
        {
          title: 'Principles of Effective Government Data Visualization',
          topic: 'Unit 1: Foundational Visual Analytics',
          speakerScript: 'Welcome to Data Visualization for Government Reports. In this lecture, we examine core guidelines established by the Ministry of Statistics for presenting transparent and accessible data to policy makers and citizens.',
          bullets: [
            'Clarity over complexity: Aligning visuals with policy objectives and citizen understanding',
            'Selecting chart encodings: Bar charts for discrete comparison, Line charts for time-series trends',
            'MoSPI Color Standards: Avoiding visual clutter and adhering to WCAG 2.1 accessibility',
            'Zero distortion rule: Mandatory zero baselines on continuous numeric axes',
          ],
          visualType: 'chart',
          visualContent: 'Bar Charts (Discrete) | Line Plots (Trends) | Chloropleth (Geographic)',
          keyTakeaway: 'Effective government visuals translate complex national datasets into trustworthy, actionable policy insights.',
        },
        {
          title: 'Designing Accessible Charts for Official Publications',
          topic: 'Unit 2: Colorblind Safety & Universal Design',
          speakerScript: 'In Unit 2, we focus on universal accessibility. All published tables and graphs must support high contrast and dual-coding for black-and-white printing and screen readers.',
          bullets: [
            'Colorblind-safe palettes: Utilizing Viridis and ColorBrewer schemes for inclusive reading',
            'Direct labeling vs. legends: Reducing cognitive load in high-density survey reports',
            'Dual-coding indicators: Combining patterns, shapes, and colors for printed administrative circulars',
            'Data-ink ratio maximization: Eliminating non-essential gridlines, 3D effects, and background textures',
          ],
          visualType: 'guideline',
          visualContent: 'Accessibility Contrast Ratio >= 4.5:1 (WCAG 2.1 AA Standard)',
          keyTakeaway: 'Official reports must be readable by all citizens, regardless of visual impairment or reproduction medium.',
        },
        {
          title: 'Real-Time Administrative Dashboards & KPIs',
          topic: 'Unit 3: Executive Monitoring & Decisions',
          speakerScript: 'Unit 3 covers administrative dashboard architecture, enabling district collectors and ministry secretaries to monitor national scheme progress in real-time.',
          bullets: [
            'KPI Card hierarchy: Top-level summary metrics with comparative delta badges (YoY / MoM)',
            'Drill-down workflows: National → State → District granularity with synchronized filters',
            'Data refresh protocols: Automated validation pipelines ensuring zero stale cached records',
            'Export capabilities: Formatted PDF/Excel summaries for cabinet reviews and parliament questions',
          ],
          visualType: 'framework',
          visualContent: 'KPI Cards → Regional Filter Map → Drilldown Data Table',
          keyTakeaway: 'Executive dashboards empower district collectors and ministry secretaries to make fast, evidence-based decisions.',
        },
      ];
    } else if (c.id === 'igot003' || c.title.toLowerCase().includes('python')) {
      return [
        {
          title: 'Python Analytical Sandbox for Official Statistics',
          topic: 'Unit 1: Environment & NumPy Arrays',
          speakerScript: 'Welcome to Python for Statistical Computing. In this lecture, we explore how Python streamlines data preparation for official statistics and NSSO survey processing.',
          bullets: [
            'Setting up a secure Python analytical sandbox for government department data',
            'NumPy array structures for high-speed statistical computations on microdata',
            'Vectorization vs. iteration: Achieving 100x performance gains on large survey samples',
            'Data types & memory optimization for multi-gigabyte administrative datasets',
          ],
          visualType: 'code',
          visualContent: 'import numpy as np\n# Fast Vectorized Operations\ndata = np.array(census_samples)\nz_scores = (data - np.mean(data)) / np.std(data)',
          keyTakeaway: 'Python provides an open, auditable foundation for modernizing official statistical compilation.',
        },
        {
          title: 'Tabular Processing with Pandas DataFrames',
          topic: 'Unit 2: Data Cleaning & Aggregation',
          speakerScript: 'In Unit 2, we dive into Pandas DataFrames, cleaning survey files and generating multi-dimensional cross-tabulations for government reports.',
          bullets: [
            'Loading and parsing complex NSSO / PLFS unit-level survey data files',
            'Handling missing values: Multiple imputation vs. domain-specific hot-decking',
            'Groupby aggregations for generating multi-district summary cross-tabulations',
            'Exporting publication-ready tables with automated metadata headers',
          ],
          visualType: 'code',
          visualContent: 'import pandas as pd\ndf = pd.read_csv("plfs_survey_data.csv")\nsummary = df.groupby(["state", "sector"])["income"].agg(["mean", "median"])',
          keyTakeaway: 'Pandas enables reproducible data pipelines with complete auditability for national statistical releases.',
        },
      ];
    } else {
      return [
        {
          title: `Core Methodologies of ${c.title}`,
          topic: 'Unit 1: Foundational Framework',
          speakerScript: `Welcome to ${c.title}. This course is designed under Mission Karmayogi to build specialized competencies for official public service and evidence-based governance.`,
          bullets: [
            'Alignment with National Framework for Roles, Activities and Competencies (FRAC)',
            'Standardized operational protocols for government statistical officers',
            'Evidence-based methodology for policy evaluation and program monitoring',
            'Ensuring data integrity, confidentiality, and quality assurance standards',
          ],
          visualType: 'framework',
          visualContent: 'National Capacity Building Framework (DoPT Standards)',
          keyTakeaway: 'Mastering these foundational concepts strengthens administrative execution and public service delivery.',
        },
        {
          title: 'Applied Case Studies & Governance Workflows',
          topic: 'Unit 2: Implementation Blueprint',
          speakerScript: 'In Unit 2, we examine practical case studies and operational workflows to apply these competencies directly within your department.',
          bullets: [
            'Step-by-step case study execution using real-world government datasets',
            'Identifying and mitigating common sampling, estimation, and procedural errors',
            'Inter-departmental collaboration and standardized reporting formats',
            'Continuous monitoring, evaluation, and outcome benchmarking',
          ],
          visualType: 'guideline',
          visualContent: 'Ministry Implementation Blueprint & Case Study Walkthrough',
          keyTakeaway: 'Applied practice ensures direct transfer of training competencies into everyday administrative workflows.',
        },
      ];
    }
  };

  const slides = getCourseSlides(course);
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const modules = course.modules && course.modules.length > 0 ? course.modules : [
    { id: 'm1', title: 'Unit 1: Overview of Core Framework & Principles', duration: '45 mins', videoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4' },
    { id: 'm2', title: 'Unit 2: Practical Implementation & Official Case Studies', duration: '55 mins', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
    { id: 'm3', title: 'Unit 3: Quality Compliance & Outcome Assessment', duration: '40 mins', videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
  ];

  const currentModule = modules[activeModuleIndex] || modules[0];
  const primaryVideoUrl = igotVideoUrl || currentModule.videoUrl || course.videoUrl || 'https://media.w3.org/2010/05/video/movie_300.mp4';

  const enrolled = isEnrolled(course.id);
  const enrollment = enrollments[course.id];
  const progress = enrollment?.progress ?? (enrolled ? 30 : 0);

  // Play / Pause Lecture & Sync Video
  const handlePlay = () => {
    setIsPlaying(true);
    if (!enrolled) enrollCourse(course.id);

    const v = activeTab === 'video_stream' ? streamVideoRef.current : videoRef.current;
    if (v) {
      v.play().catch((err) => {
        console.warn('Playback error fallback:', err);
      });
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    const v = activeTab === 'video_stream' ? streamVideoRef.current : videoRef.current;
    if (v) {
      v.pause();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (streamVideoRef.current) {
      streamVideoRef.current.muted = nextMuted;
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      handleCompleteModule();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleCompleteModule = () => {
    if (!enrolled) enrollCourse(course.id);
    const newProgress = Math.min(100, Math.round(((activeModuleIndex + 1) / modules.length) * 100));
    updateProgress(course.id, newProgress);
    if (activeModuleIndex < modules.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-gradient-to-r from-[#172b4d] via-[#1a365d] to-[#0f172a] text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-lg">
              <span className="font-black text-amber-400 text-sm tracking-wider">कर्मयोगी भारत</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold border-l border-white/20 pl-2">
                iGOT Platform
              </span>
            </div>

            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-white line-clamp-1">{course.title}</h2>
              <p className="text-[11px] text-neutral-300">{course.provider} • National e-Learning</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Player"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 px-5 sm:px-6 bg-neutral-50 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('classroom')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'classroom'
                ? 'border-primary-600 text-primary-700 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Video size={15} /> iGOT Lecturer Classroom (Active)
          </button>
          <button
            onClick={() => setActiveTab('video_stream')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'video_stream'
                ? 'border-primary-600 text-primary-700 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Presentation size={15} /> MP4 Video Feed
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'quiz'
                ? 'border-primary-600 text-primary-700 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <HelpCircle size={15} /> Knowledge Check
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950 text-white">
          {/* TAB 1: IGOT LECTURER CLASSROOM */}
          {activeTab === 'classroom' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {/* Main Lecturer Board (Left 2 Cols) */}
              <div className="lg:col-span-2 space-y-3">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 sm:p-6 border border-neutral-700 shadow-2xl flex flex-col justify-between">
                  {/* Top Bar on Stage */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700/70 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-amber-400">iGOT LIVE LECTURE SESSION</span>
                      <span className="text-neutral-400 hidden sm:inline">• {currentSlide.topic}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Layout Toggles */}
                      <div className="hidden sm:flex items-center gap-1 bg-neutral-800/90 p-0.5 rounded-lg border border-neutral-700 text-[11px]">
                        <button
                          onClick={() => setClassroomLayout('split')}
                          className={`px-2 py-1 rounded transition-colors ${
                            classroomLayout === 'split' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                          }`}
                          title="Video and Slides Split View"
                        >
                          Dual
                        </button>
                        <button
                          onClick={() => setClassroomLayout('video_focus')}
                          className={`px-2 py-1 rounded transition-colors ${
                            classroomLayout === 'video_focus' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                          }`}
                          title="Full Lecturer Video"
                        >
                          Video
                        </button>
                        <button
                          onClick={() => setClassroomLayout('slide_focus')}
                          className={`px-2 py-1 rounded transition-colors ${
                            classroomLayout === 'slide_focus' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                          }`}
                          title="Slide Presentation"
                        >
                          Slides
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-neutral-300 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700">
                        <span>{formatTimer(elapsedSeconds)}</span>
                        <span>|</span>
                        <span>Slide {currentSlideIndex + 1}/{slides.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lecturer Spotlight Bar */}
                  <div className="flex items-center gap-3 bg-neutral-800/90 p-3 rounded-xl border border-neutral-700 my-2.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center font-black text-white text-sm shadow-md border border-primary-400/30 shrink-0">
                      {igotVideoData?.lecturer?.split(' ').pop()?.slice(0, 2).toUpperCase() ?? 'KB'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{igotVideoData?.lecturer ?? 'Dr. R. K. Sharma'}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {igotVideoData?.institution ?? 'iGOT / MoSPI'}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-200 mt-0.5 line-clamp-1 italic">
                        "{igotVideoData?.title ?? currentSlide.speakerScript}"
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 shrink-0">
                      <span className="w-1 h-3 bg-emerald-400 animate-bounce" />
                      <span className="w-1 h-5 bg-emerald-400 animate-bounce delay-100" />
                      <span className="w-1 h-2 bg-emerald-400 animate-bounce delay-200" />
                    </div>
                  </div>

                  {/* LIVE LECTURER VIDEO SCREEN — YouTube Embed */}
                  {(classroomLayout === 'split' || classroomLayout === 'video_focus') && (
                    <div className={`relative w-full rounded-xl overflow-hidden bg-black border border-neutral-700/80 shadow-inner mb-3 ${
                      classroomLayout === 'video_focus' ? 'aspect-video max-h-[400px]' : 'aspect-video max-h-[280px]'
                    }`}>
                      {igotVideoUrl ? (
                        <iframe
                          key={igotVideoUrl}
                          src={`${igotVideoUrl}?autoplay=0&rel=0&modestbranding=1&fs=1`}
                          title={igotVideoData?.title ?? course.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                          style={{ border: 'none' }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                          <div className="flex flex-col items-center gap-2 text-neutral-400">
                            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs">Loading iGOT lecture…</span>
                          </div>
                        </div>
                      )}

                      {/* Video overlay watermark */}
                      <div className="absolute top-2 left-2 pointer-events-none bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        iGOT Mock Stream • NPTEL Lecture
                      </div>
                    </div>
                  )}

                  {/* Slide Content */}
                  {(classroomLayout === 'split' || classroomLayout === 'slide_focus') && (
                    <div className="py-1 space-y-2.5">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                          {currentSlide.title}
                        </h3>
                        <p className="text-xs text-amber-300 font-medium">{currentSlide.topic}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {currentSlide.bullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 bg-neutral-800/70 p-2.5 rounded-lg border border-neutral-700/60 text-xs text-neutral-200"
                          >
                            <div className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <p className="leading-relaxed">{bullet}</p>
                          </div>
                        ))}
                      </div>

                      {/* Visual demo box */}
                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-700 text-xs text-emerald-400 font-mono">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1 font-sans">
                          <BarChart3 size={12} className="text-amber-400" />
                          Curriculum Concept Blueprint
                        </div>
                        <p className="line-clamp-2">{currentSlide.visualContent}</p>
                      </div>
                    </div>
                  )}

                  {/* Player Stage Controls */}
                  <div className="pt-3 mt-2 border-t border-neutral-700/70 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={togglePlay}
                        className="bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                        {isPlaying ? 'Pause Lecture' : 'Play Lecture'}
                      </Button>

                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
                        title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentSlideIndex === 0}
                        onClick={handlePrevSlide}
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      >
                        <ChevronLeft size={14} /> Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNextSlide}
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      >
                        {currentSlideIndex < slides.length - 1 ? (
                          <>Next <ChevronRight size={14} /></>
                        ) : (
                          <>Complete Unit <CheckCircle2 size={14} className="text-emerald-400" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {enrolled && (
                  <div className="bg-neutral-800 p-3.5 rounded-xl border border-neutral-700 text-xs">
                    <div className="flex justify-between text-neutral-300 mb-1">
                      <span>Course Progress on iGOT</span>
                      <span className="font-bold text-amber-400">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} variant={progress === 100 ? 'success' : 'primary'} />
                  </div>
                )}
              </div>

              {/* Units Playlist (Right 1 Col) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen size={16} className="text-amber-400" />
                    Course Units ({modules.length})
                  </h3>
                  <span className="text-xs text-neutral-400">{course.duration}</span>
                </div>

                <div className="space-y-2 max-h-[440px] overflow-y-auto">
                  {modules.map((mod, idx) => {
                    const isActive = activeModuleIndex === idx;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          setActiveModuleIndex(idx);
                          setCurrentSlideIndex(0);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                          isActive
                            ? 'bg-amber-400/15 border-amber-400/50 shadow-md text-white'
                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              isActive ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-700 text-neutral-300'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-snug line-clamp-2">{mod.title}</p>
                            <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
                              <Clock size={11} /> {mod.duration}
                            </p>
                          </div>
                        </div>

                        {isActive && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-neutral-950 shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700/60 text-xs text-neutral-400">
                  <p className="font-semibold text-neutral-200 mb-1">Official Accreditation</p>
                  <p className="text-[11px] leading-relaxed">
                    Published under the National Programme for Civil Services Capacity Building (NPCSCB).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RAW MP4 STREAM FEED */}
          {activeTab === 'video_stream' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-neutral-800">
                {igotVideoUrl ? (
                  <iframe
                    key={igotVideoUrl + '_stream'}
                    src={`${igotVideoUrl}?autoplay=0&rel=0&modestbranding=1&fs=1`}
                    title={igotVideoData?.title ?? course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Stream: HD 1080p Video Feed</p>
                  <p className="text-neutral-400">Audio: Stereo 48kHz (Official iGOT Stream)</p>
                </div>
                <Button size="sm" onClick={handleCompleteModule}>
                  <CheckCircle2 size={14} className="text-emerald-400" /> Complete Unit
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 max-w-3xl mx-auto space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                <h3 className="text-sm font-bold text-white">Unit Knowledge Assessment</h3>
                <Badge variant="primary">FRAC Evaluation</Badge>
              </div>

              <p className="font-semibold text-neutral-200">
                Q: What is the primary objective of applying standardized {course.title.toLowerCase()} in official government data workflows?
              </p>

              <div className="space-y-2">
                {[
                  'To automate manual reporting and increase transparency across department divisions',
                  'To ensure statistical validity, eliminate sampling bias, and enhance evidence-based policy making',
                  'To replace all existing legacy government paper records without audit trails',
                  'To restrict data access only to central administrators',
                ].map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAnswer === idx
                        ? 'border-amber-400 bg-amber-400/10 text-white font-medium'
                        : 'border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz_unit_opt"
                      checked={selectedAnswer === idx}
                      onChange={() => setSelectedAnswer(idx)}
                      className="mt-0.5 text-amber-400 focus:ring-amber-400"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-700 flex items-center justify-between">
                <Button
                  size="sm"
                  disabled={selectedAnswer === null}
                  onClick={() => setQuizSubmitted(true)}
                >
                  Submit Answer
                </Button>

                {quizSubmitted && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    Correct! +10 XP added to your competency profile.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-neutral-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Course Provider: <strong className="text-neutral-800">{course.provider}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openIGOTCourse(course.igotUrl)}
              className="text-xs"
            >
              <ExternalLink size={13} /> Open on official iGOT ↗
            </Button>
            <Button size="sm" onClick={onClose} className="text-xs">
              Close Player
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
