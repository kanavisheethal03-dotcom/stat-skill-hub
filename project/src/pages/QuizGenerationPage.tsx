import React, { useState, useRef } from 'react';
import {
  FileQuestion,
  Upload,
  FileText,
  File,
  Presentation,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar, PageHeader } from '@/components/ui';
import { sampleDocumentText } from '@/data/mockData';
import { cn } from '@/utils/cn';
import type { Difficulty, QuizQuestion } from '@/types';
import { useMaterials } from '@/context/MaterialsContext';
import { parseUploadedDocument } from '@/utils/fileParser';
import { generateQuizFromText } from '@/utils/quizGenerator';

const difficultyConfig: Record<Difficulty, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  easy: { variant: 'success', label: 'Easy' },
  medium: { variant: 'warning', label: 'Medium' },
  hard: { variant: 'error', label: 'Hard' },
};

const typeIconMap = {
  pdf: { icon: FileText, color: 'text-error-500', bg: 'bg-error-50', badge: 'PDF' },
  docx: { icon: File, color: 'text-primary-500', bg: 'bg-primary-50', badge: 'Word DOCX' },
  pptx: { icon: Presentation, color: 'text-accent-500', bg: 'bg-accent-50', badge: 'PowerPoint PPTX' },
  text: { icon: FileText, color: 'text-neutral-500', bg: 'bg-neutral-100', badge: 'Plain Text' },
};

export function QuizGenerationPage() {
  const { activeDocument, setActiveDocument, addActivityLog } = useMaterials();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [stage, setStage] = useState<'upload' | 'processing' | 'quiz' | 'results'>('upload');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active quiz questions generated for this document
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return generateQuizFromText({
      title: activeDocument.title,
      text: activeDocument.text,
      topics: activeDocument.topics,
      count: 3,
    }).questions;
  });

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setIsParsing(true);

    const validExtensions = ['pdf', 'docx', 'pptx', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext) && !file.type.startsWith('text/')) {
      setErrorMessage(`Unsupported format (.${ext}). Please upload a PDF, DOCX, PPTX, or TXT file.`);
      setIsParsing(false);
      return;
    }

    try {
      const extracted = await parseUploadedDocument(file);
      const generated = generateQuizFromText({
        title: extracted.title,
        text: extracted.text,
        topics: extracted.topics,
        count: 3,
      });

      setActiveDocument({
        title: extracted.title,
        type: extracted.type,
        text: extracted.text,
        pages: extracted.pages,
        topics: extracted.topics,
        conceptsCount: generated.conceptsCount,
        fileSize: extracted.fileSize,
      });

      setQuestions(generated.questions);
      setAnswers({});
      setShowExplanations({});
    } catch (err: any) {
      console.error('Failed to parse file:', err);
      setErrorMessage(err?.message || 'Failed to read document content.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleStartGeneration = () => {
    // Generate questions for current active document
    const generated = generateQuizFromText({
      title: activeDocument.title,
      text: activeDocument.text,
      topics: activeDocument.topics,
      count: 3,
    });
    setQuestions(generated.questions);
    setAnswers({});
    setShowExplanations({});

    setStage('processing');
    setTimeout(() => {
      setStage('quiz');
      addActivityLog({
        userId: 'u001',
        userName: 'Priya Sharma',
        action: 'AI Quiz Generated',
        details: `Generated ${generated.questions.length} MCQs from ${activeDocument.title}`,
      });
    }, 2200);
  };

  const handleLoadSampleDocument = () => {
    setActiveDocument({
      title: 'Data_Preprocessing_Handbook.pdf',
      type: 'pdf',
      text: sampleDocumentText,
      pages: 12,
      topics: ['Data Profiling', 'Missing Data', 'Outlier Detection', 'Data Transformation', 'Normalization'],
      conceptsCount: 28,
      fileSize: 245,
    });

    const generated = generateQuizFromText({
      title: 'Data_Preprocessing_Handbook.pdf',
      text: sampleDocumentText,
      topics: ['Data Profiling', 'Missing Data', 'Outlier Detection'],
      count: 3,
    });
    setQuestions(generated.questions);
    setAnswers({});
    setShowExplanations({});
    setErrorMessage(null);
  };

  const handleSubmitQuiz = () => {
    setStage('results');
    const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    addActivityLog({
      userId: 'u001',
      userName: 'Priya Sharma',
      action: 'Quiz Completed',
      details: `Completed AI Quiz for ${activeDocument.title}: Score ${correctCount}/${questions.length} (${Math.round((correctCount / questions.length) * 100)}%)`,
    });
  };

  const handleReset = () => {
    setStage('upload');
    setAnswers({});
    setShowExplanations({});
  };

  const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const scorePercentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const typeConfig = typeIconMap[activeDocument.type] || typeIconMap.pdf;
  const ActiveIcon = typeConfig.icon;

  if (stage === 'processing') {
    return (
      <>
        <PageHeader
          title="AI Quiz Generation"
          subtitle={`Generating assessment MCQs from "${activeDocument.title}"`}
        />
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary-200" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
              <Sparkles size={20} className="absolute inset-0 m-auto text-primary-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-neutral-900">Processing Document</h3>
            <p className="text-sm text-neutral-500 mt-1 text-center max-w-md">
              Extracting text, identifying key concepts, and generating questions with
              AI-powered distractor creation...
            </p>
            <div className="mt-6 w-full max-w-md space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-success-500" />
                <span className="text-neutral-700">Text extraction ({activeDocument.type.toUpperCase()} → parsed text)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-success-500" />
                <span className="text-neutral-700">
                  Document segmentation ({activeDocument.pages} {activeDocument.type === 'pptx' ? 'slides' : 'pages'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-success-500" />
                <span className="text-neutral-700">
                  Concept extraction ({activeDocument.conceptsCount || 28} concepts identified)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
                <span className="text-primary-600 font-medium">Generating {questions.length} MCQs with distractors...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                <span>Validation & source citation linking</span>
              </div>
            </div>
          </div>
        </Card>
      </>
    );
  }

  if (stage === 'results') {
    return (
      <>
        <PageHeader
          title="Quiz Results"
          subtitle={`AI-generated assessment for ${activeDocument.title}`}
        >
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw size={14} /> New Quiz / Change File
          </Button>
        </PageHeader>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold',
                  scorePercentage >= 67
                    ? 'bg-success-100 text-success-700'
                    : 'bg-warning-100 text-warning-700'
                )}
              >
                {scorePercentage}%
              </div>
              <p className="text-sm font-medium text-neutral-700 mt-2">Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{score}/{questions.length}</p>
              <p className="text-sm text-neutral-500 mt-1">Correct Answers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">+{scorePercentage >= 67 ? '15%' : '8%'}</p>
              <p className="text-sm text-neutral-500 mt-1">Competency Gain</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const showExp = showExplanations[q.id];
            return (
              <Card
                key={q.id}
                className={cn(
                  'p-5 border-l-4',
                  isCorrect ? 'border-l-success-500' : 'border-l-error-500'
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 size={20} className="text-success-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={20} className="text-error-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-neutral-400">Q{i + 1}</span>
                      <Badge variant={difficultyConfig[q.difficulty].variant}>
                        {difficultyConfig[q.difficulty].label}
                      </Badge>
                      <Badge variant="default">
                        <Tag size={10} /> {q.competencyTag}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 mb-3">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, j) => {
                        const isUserAnswer = userAnswer === j;
                        const isCorrectAnswer = q.correctAnswer === j;
                        return (
                          <div
                            key={j}
                            className={cn(
                              'flex items-center gap-2 p-2.5 rounded-lg text-sm',
                              isCorrectAnswer
                                ? 'bg-success-50 border border-success-200 text-success-800 font-medium'
                                : isUserAnswer
                                  ? 'bg-error-50 border border-error-200 text-error-800'
                                  : 'bg-neutral-50 border border-neutral-100 text-neutral-600'
                            )}
                          >
                            <span className="text-xs font-bold w-5 shrink-0">
                              {String.fromCharCode(65 + j)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectAnswer && <CheckCircle2 size={14} className="text-success-600 shrink-0" />}
                            {isUserAnswer && !isCorrectAnswer && <XCircle size={14} className="text-error-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() =>
                        setShowExplanations({ ...showExplanations, [q.id]: !showExp })
                      }
                      className="flex items-center gap-1 mt-3 text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      <Lightbulb size={12} />
                      {showExp ? 'Hide' : 'Show'} explanation & source
                      {showExp ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    {showExp && (
                      <div className="mt-2 p-3 rounded-lg bg-primary-50 border border-primary-100">
                        <p className="text-xs text-neutral-700">
                          <span className="font-semibold">Explanation: </span>
                          {q.explanation}
                        </p>
                        <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                          <BookOpen size={12} /> Source: {q.sourceReference}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-5 mt-6 bg-neutral-50 border-neutral-200">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-primary-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neutral-700">AI Quiz Generation Pipeline</p>
              <p className="text-xs text-neutral-500 mt-1">
                Questions were generated dynamically: document text extraction ({activeDocument.type.toUpperCase()}) → chunking → concept
                labeling → distractor generation → validation & de-duplication → enrichment with source references.
              </p>
            </div>
          </div>
        </Card>
      </>
    );
  }

  if (stage === 'quiz') {
    const allAnswered = Object.keys(answers).length === questions.length;
    return (
      <>
        <PageHeader
          title="AI-Generated Quiz"
          subtitle={`${questions.length} MCQs from "${activeDocument.title}"`}
        >
          <Badge variant="primary">
            <Sparkles size={12} /> AI Generated
          </Badge>
        </PageHeader>

        <Card className="p-4 mb-6 bg-primary-50 border-primary-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <ActiveIcon size={20} className={typeConfig.color} />
              <div>
                <p className="text-sm font-semibold text-primary-900">{activeDocument.title}</p>
                <p className="text-xs text-primary-700">
                  {activeDocument.pages} {activeDocument.type === 'pptx' ? 'slides' : 'pages'} · {activeDocument.conceptsCount || 28} concepts extracted · {questions.length} MCQs generated
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProgressBar value={Object.keys(answers).length} max={questions.length} showLabel className="w-32" />
              <Button size="sm" variant="ghost" onClick={handleReset}>
                Change Document
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={q.id} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-neutral-400">Q{i + 1}</span>
                <Badge variant={difficultyConfig[q.difficulty].variant}>
                  {difficultyConfig[q.difficulty].label}
                </Badge>
                <Badge variant="default">
                  <Tag size={10} /> {q.competencyTag}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-neutral-900 mb-4">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => {
                  const isSelected = answers[q.id] === j;
                  return (
                    <button
                      key={j}
                      onClick={() => setAnswers({ ...answers, [q.id]: j })}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-400'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-5 h-5 rounded-full border-2 text-[10px] font-bold shrink-0',
                          isSelected
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-neutral-300 text-neutral-400'
                        )}
                      >
                        {String.fromCharCode(65 + j)}
                      </div>
                      <span
                        className={cn(
                          'text-sm',
                          isSelected ? 'text-primary-900 font-medium' : 'text-neutral-700'
                        )}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={handleReset}>
            Cancel Quiz
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleSubmitQuiz}
            disabled={!allAnswered}
          >
            <CheckCircle2 size={18} /> Submit Quiz ({Object.keys(answers).length}/{questions.length})
          </Button>
        </div>
      </>
    );
  }

  // Upload stage
  return (
    <>
      <PageHeader
        title="AI Quiz Generation"
        subtitle="Upload study materials (PDF, DOCX, PPTX, TXT) and let AI generate assessment questions automatically"
      />

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-error-50 border border-error-200 text-error-800 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-error-600" />
          <div className="flex-1">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="text-xs text-error-700 font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.pptx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onClick={(e) => {
          (e.currentTarget as HTMLInputElement).value = '';
        }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFile(e.target.files[0]);
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload zone */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900">Upload Document</h3>
            <span className="text-xs text-neutral-400">PDF, DOCX, PPTX, TXT</span>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={openFilePicker}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer select-none group relative ${
              isDragging
                ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100 scale-[1.01]'
                : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30'
            }`}
          >
            {isParsing ? (
              <div className="flex flex-col items-center gap-3 py-2 pointer-events-none">
                <Loader2 size={32} className="text-primary-600 animate-spin" />
                <p className="text-sm font-medium text-neutral-800">Reading & parsing document...</p>
                <p className="text-xs text-neutral-500">Extracting text and identifying key concepts</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <div
                  className={`p-4 rounded-full transition-all ${
                    isDragging
                      ? 'bg-primary-100 text-primary-700 scale-110'
                      : 'bg-primary-50 text-primary-600 group-hover:scale-105'
                  }`}
                >
                  <Upload size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {isDragging ? 'Drop file now to upload!' : 'Drag & drop or click to upload your document'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Supports PDF, DOCX, PPTX, TXT (up to 50MB)
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">PDF</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">DOCX</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">PPTX</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-700">TXT</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-600 text-white shadow-sm group-hover:bg-primary-700 transition-colors">
                    <Upload size={13} /> Select File from Device
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Active / Selected Document Summary */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Active Document for Assessment
              </p>
              <button
                onClick={handleLoadSampleDocument}
                className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
              >
                Reset to Sample Handbook
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className={`p-2 rounded-lg ${typeConfig.bg} shrink-0`}>
                <ActiveIcon size={20} className={typeConfig.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">{activeDocument.title}</p>
                <p className="text-xs text-neutral-500">
                  {activeDocument.pages} {activeDocument.type === 'pptx' ? 'slides' : 'pages'} · {typeConfig.badge}
                  {activeDocument.fileSize ? ` · ${activeDocument.fileSize} KB` : ''}
                </p>
              </div>
              <Badge variant="success">
                <FileCheck size={12} className="mr-1 inline" /> Ready
              </Badge>
            </div>
          </div>

          <Button className="w-full mt-4" size="lg" onClick={handleStartGeneration} disabled={isParsing}>
            <Sparkles size={18} /> Generate Quiz from Document
          </Button>

          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Clock size={12} /> ~2-3 sec AI pipeline
            </span>
            <span className="flex items-center gap-1">
              <FileQuestion size={12} /> {questions.length} MCQs per generation
            </span>
          </div>
        </Card>

        {/* Preview document text */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-900">Document Text Preview</h3>
              <Badge variant="secondary">{typeConfig.badge}</Badge>
            </div>
            <span className="text-xs text-neutral-500">
              {activeDocument.text.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4 max-h-[380px] overflow-y-auto border border-neutral-200 font-mono">
            <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-sans leading-relaxed">
              {activeDocument.text}
            </pre>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <p className="text-lg font-bold text-primary-600">{activeDocument.pages}</p>
              <p className="text-xs text-neutral-500">{activeDocument.type === 'pptx' ? 'Slides' : 'Pages'}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <p className="text-lg font-bold text-secondary-600">{activeDocument.conceptsCount || 28}</p>
              <p className="text-xs text-neutral-500">Concepts</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <p className="text-lg font-bold text-accent-600">{questions.length}</p>
              <p className="text-xs text-neutral-500">MCQs Ready</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline visualization */}
      <Card className="p-6 mt-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">AI Quiz Generation Pipeline</h3>
        <div className="flex flex-wrap items-center gap-2">
          {[
            'Document Extraction',
            'Chunking',
            'Concept Labeling',
            'Question Templates',
            'Distractor Generation',
            'Difficulty Tagging',
            'Validation',
            'Source Citations',
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-200 text-xs font-medium text-primary-700">
                {i + 1}. {step}
              </div>
              {i < 7 && <span className="text-neutral-300">→</span>}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
