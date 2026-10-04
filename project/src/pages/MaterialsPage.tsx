import React, { useState, useRef } from 'react';
import {
  BookOpen,
  FileText,
  File,
  Presentation,
  Upload,
  Sparkles,
  Tag,
  Clock,
  User as UserIcon,
  X,
  FileCheck,
  Search,
} from 'lucide-react';
import { Card, Badge, Button, PageHeader } from '@/components/ui';
import { useMaterials } from '@/context/MaterialsContext';
import { UploadMaterialModal } from '@/components/UploadMaterialModal';
import type { LearningMaterial } from '@/types';
import type { PageId } from '@/components/AppLayout';

interface MaterialsPageProps {
  onNavigate?: (page: PageId) => void;
  userRole?: 'learner' | 'trainer' | 'admin';
}

const typeIcons = {
  pdf: FileText,
  docx: File,
  pptx: Presentation,
  text: FileText,
};

const typeColors = {
  pdf: { icon: 'text-error-500', bg: 'bg-error-50', badge: 'PDF' },
  docx: { icon: 'text-primary-500', bg: 'bg-primary-50', badge: 'DOCX' },
  pptx: { icon: 'text-accent-500', bg: 'bg-accent-50', badge: 'PPTX' },
  text: { icon: 'text-neutral-500', bg: 'bg-neutral-100', badge: 'TXT' },
};

export function MaterialsPage({ onNavigate, userRole = 'learner' }: MaterialsPageProps) {
  const { materials, documentTexts, loadMaterialForQuiz } = useMaterials();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<LearningMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'docx' | 'pptx' | 'text'>('all');
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [isDraggingOverCard, setIsDraggingOverCard] = useState(false);
  const dragCounter = useRef(0);

  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mat.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || mat.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleLaunchQuiz = (mat: LearningMaterial) => {
    loadMaterialForQuiz(mat);
    if (onNavigate) {
      onNavigate('quiz');
    }
  };

  const handleCardDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOverCard(true);
    }
  };

  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOverCard(true);
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDraggingOverCard(false);
    }
  };

  const handleCardDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDraggingOverCard(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setDroppedFile(e.dataTransfer.files[0]);
      setIsUploadModalOpen(true);
    }
  };

  const handleCardClick = () => {
    setDroppedFile(null);
    setIsUploadModalOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Learning Materials"
        subtitle="Documents uploaded for AI-powered quiz generation, concept extraction, and self-paced learning"
      >
        <Button size="sm" onClick={() => { setDroppedFile(null); setIsUploadModalOpen(true); }}>
          <Upload size={14} /> Upload Material
        </Button>
      </PageHeader>

      {/* Upload zone button card */}
      <Card
        onDragEnter={handleCardDragEnter}
        onDragOver={handleCardDragOver}
        onDragLeave={handleCardDragLeave}
        onDrop={handleCardDrop}
        onClick={handleCardClick}
        className={`p-6 mb-6 border-2 border-dashed transition-all cursor-pointer select-none group relative ${
          isDraggingOverCard
            ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100 scale-[1.005]'
            : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
          <div className="flex items-center gap-4">
            <div
              className={`p-3.5 rounded-2xl transition-all ${
                isDraggingOverCard
                  ? 'bg-primary-100 text-primary-700 scale-110'
                  : 'bg-primary-50 text-primary-600 group-hover:scale-105'
              }`}
            >
              <Upload size={26} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                {isDraggingOverCard ? 'Drop file now to upload!' : 'Upload New Study Material'}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Drop your PDF, DOCX, PPTX, or TXT file here or click to choose from your computer.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700">PDF</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700">DOCX</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-700">PPTX</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-200 text-neutral-700">TXT</span>
            <span className="hidden sm:inline-flex ml-2 px-3 py-1 text-xs font-semibold rounded-lg bg-primary-600 text-white shadow-sm">
              Upload
            </span>
          </div>
        </div>
      </Card>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, topic, or uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'pdf', 'docx', 'pptx', 'text'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === type
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Materials list */}
      <div className="space-y-4">
        {filteredMaterials.map((mat) => {
          const Icon = typeIcons[mat.type] || FileText;
          const colors = typeColors[mat.type] || typeColors.pdf;
          return (
            <Card key={mat.id} className="p-5" hover>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className={`p-3 rounded-xl ${colors.bg} shrink-0`}>
                  <Icon size={24} className={colors.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-neutral-900 truncate">{mat.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                      {colors.badge}
                    </span>
                    {mat.extracted ? (
                      <Badge variant="success">
                        <FileCheck size={10} className="mr-0.5 inline" /> Processed
                      </Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
                    <span className="flex items-center gap-1">
                      <UserIcon size={12} /> {mat.uploadedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />{' '}
                      {new Date(mat.uploadedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>{mat.pages} {mat.type === 'pptx' ? 'slides' : 'pages'}</span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} className="text-primary-500" /> {mat.conceptsExtracted} concepts
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> {mat.mcqsGenerated} MCQs ready
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mat.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-initial"
                    onClick={() => setPreviewMaterial(mat)}
                  >
                    <BookOpen size={14} /> Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => handleLaunchQuiz(mat)}
                  >
                    <Sparkles size={14} /> Generate Quiz
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
            <p className="text-sm font-medium text-neutral-700">No documents match your query.</p>
            <p className="text-xs text-neutral-500 mt-1">Upload a PDF, DOCX, PPTX, or TXT file to get started.</p>
            <Button size="sm" className="mt-4" onClick={() => setIsUploadModalOpen(true)}>
              <Upload size={14} /> Upload Material Now
            </Button>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${typeColors[previewMaterial.type]?.bg || 'bg-neutral-100'}`}>
                  {React.createElement(typeIcons[previewMaterial.type] || FileText, {
                    size: 20,
                    className: typeColors[previewMaterial.type]?.icon || 'text-neutral-600',
                  })}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 truncate max-w-md">
                    {previewMaterial.title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {previewMaterial.pages} {previewMaterial.type === 'pptx' ? 'slides' : 'pages'} · Uploaded by {previewMaterial.uploadedBy}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex flex-wrap gap-2">
                {previewMaterial.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Document Content Preview
                </p>
                <div className="bg-neutral-50 rounded-xl p-4 text-xs font-mono text-neutral-700 max-h-96 overflow-y-auto border border-neutral-200 leading-relaxed">
                  <pre className="whitespace-pre-wrap font-sans">
                    {documentTexts[previewMaterial.title] ||
                      `Content for ${previewMaterial.title} ready for automated concept analysis and MCQ generation.`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setPreviewMaterial(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const mat = previewMaterial;
                  setPreviewMaterial(null);
                  handleLaunchQuiz(mat);
                }}
              >
                <Sparkles size={14} /> Open in Quiz Generator
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setDroppedFile(null);
        }}
        initialFile={droppedFile}
        userRole={userRole}
        onGenerateQuiz={() => {
          if (onNavigate) {
            onNavigate('quiz');
          }
        }}
      />
    </>
  );
}
