import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  File,
  Presentation,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { parseUploadedDocument, type ExtractedDocument } from '@/utils/fileParser';
import { useMaterials } from '@/context/MaterialsContext';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (materialId: string, doc: ExtractedDocument) => void;
  onGenerateQuiz?: (doc: ExtractedDocument) => void;
  userRole?: 'learner' | 'trainer' | 'admin';
  initialFile?: File | null;
}

const typeIconMap = {
  pdf: { icon: FileText, color: 'text-error-500', bg: 'bg-error-50', badge: 'PDF' },
  docx: { icon: File, color: 'text-primary-500', bg: 'bg-primary-50', badge: 'Word DOCX' },
  pptx: { icon: Presentation, color: 'text-accent-500', bg: 'bg-accent-50', badge: 'PowerPoint PPTX' },
  text: { icon: FileText, color: 'text-neutral-500', bg: 'bg-neutral-100', badge: 'Plain Text' },
};

export function UploadMaterialModal({
  isOpen,
  onClose,
  onSuccess,
  onGenerateQuiz,
  userRole = 'learner',
  initialFile = null,
}: UploadMaterialModalProps) {
  const { addMaterial, setActiveDocument } = useMaterials();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ExtractedDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileProcess = async (file: File) => {
    setError(null);
    setSelectedFile(file);
    setIsParsing(true);

    const validExtensions = ['pdf', 'docx', 'pptx', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext) && !file.type.startsWith('text/')) {
      setError(`Unsupported file format (.${ext || 'unknown'}). Please upload a PDF, DOCX, PPTX, or TXT file.`);
      setIsParsing(false);
      return;
    }

    try {
      const doc = await parseUploadedDocument(file);
      setParsedDoc(doc);
    } catch (err: any) {
      console.error('Error parsing document:', err);
      setError(err?.message || 'Failed to extract content from file. Please ensure the file is not corrupted.');
    } finally {
      setIsParsing(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialFile) {
      handleFileProcess(initialFile);
    }
  }, [isOpen, initialFile]);

  if (!isOpen) return null;

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
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleSaveMaterial = (generateQuizRightNow = false) => {
    if (!parsedDoc) return;

    const uploaderName = userRole === 'trainer' ? 'Dr. Rajesh Kumar' : 'Priya Sharma';

    const created = addMaterial(
      {
        title: parsedDoc.title,
        type: parsedDoc.type,
        uploadedBy: uploaderName,
        pages: parsedDoc.pages,
        extracted: true,
        conceptsExtracted: Math.max(12, Math.min(60, Math.round(parsedDoc.wordCount / 25))),
        mcqsGenerated: 3,
        topics: parsedDoc.topics.length > 0 ? parsedDoc.topics : ['General Study Material'],
      },
      parsedDoc.text
    );

    if (generateQuizRightNow) {
      setActiveDocument({
        title: parsedDoc.title,
        type: parsedDoc.type,
        text: parsedDoc.text,
        pages: parsedDoc.pages,
        topics: parsedDoc.topics,
        conceptsCount: Math.max(12, Math.min(60, Math.round(parsedDoc.wordCount / 25))),
        fileSize: parsedDoc.fileSize,
      });
      if (onGenerateQuiz) {
        onGenerateQuiz(parsedDoc);
      }
    } else {
      if (onSuccess) {
        onSuccess(created.id, parsedDoc);
      }
    }

    onClose();
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setParsedDoc(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const typeConfig = parsedDoc ? typeIconMap[parsedDoc.type] : null;
  const TypeIcon = typeConfig ? typeConfig.icon : FileText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
              <Upload size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Upload Learning Material</h3>
              <p className="text-xs text-neutral-500">Supports PDF, DOCX, PPTX, and TXT files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-error-50 border border-error-200 text-error-800 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-error-600" />
              <div className="flex-1">{error}</div>
              <button onClick={() => setError(null)} className="text-xs text-error-600 font-semibold underline">
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
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          {!parsedDoc ? (
            /* Drag & Drop Upload Zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={openFilePicker}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer select-none group relative ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100 scale-[1.01]'
                  : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/20'
              }`}
            >
              {isParsing ? (
                <div className="flex flex-col items-center gap-3 py-6 pointer-events-none">
                  <div className="relative">
                    <Loader2 size={36} className="text-primary-600 animate-spin" />
                    <Sparkles size={16} className="absolute inset-0 m-auto text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      Reading & Extracting {selectedFile?.name}...
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Analyzing structure, headings, and key concepts
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 pointer-events-none">
                  <div
                    className={`p-4 rounded-2xl transition-all ${
                      isDragging
                        ? 'bg-primary-100 text-primary-700 scale-110'
                        : 'bg-primary-50 text-primary-600 ring-8 ring-primary-50/50 group-hover:scale-105'
                    }`}
                  >
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-neutral-800">
                      {isDragging ? 'Drop file here to upload!' : 'Click to choose a file or drag & drop here'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1.5">
                      Works with <strong className="text-neutral-700">.pdf</strong>,{' '}
                      <strong className="text-neutral-700">.docx</strong>,{' '}
                      <strong className="text-neutral-700">.pptx</strong>, and{' '}
                      <strong className="text-neutral-700">.txt</strong> (up to 50MB)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                      PDF Document
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Word .docx
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                      PowerPoint .pptx
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                      Text .txt
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-600 text-white shadow-sm group-hover:bg-primary-700 transition-colors">
                      <Upload size={13} /> Select File from Device
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Document Parsed Summary & Preview */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-success-200 bg-success-50/30 flex items-start gap-4">
                <div className={`p-3 rounded-xl ${typeConfig?.bg} shrink-0`}>
                  <TypeIcon size={24} className={typeConfig?.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-neutral-900 truncate">{parsedDoc.title}</h4>
                    <Badge variant="success">Extracted</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 mt-1">
                    <span>{typeConfig?.badge}</span>
                    <span>•</span>
                    <span>{parsedDoc.fileSize} KB</span>
                    <span>•</span>
                    <span>{parsedDoc.pages} {parsedDoc.type === 'pptx' ? 'slides' : 'pages'}</span>
                    <span>•</span>
                    <span>{parsedDoc.wordCount} words</span>
                  </div>
                  {parsedDoc.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {parsedDoc.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={resetSelection}
                  className="text-xs text-neutral-500 hover:text-neutral-800 underline shrink-0"
                >
                  Change File
                </button>
              </div>

              {/* Text Preview Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Extracted Text Preview
                  </p>
                  <span className="text-xs text-neutral-400">
                    {parsedDoc.text.length} characters parsed
                  </span>
                </div>
                <div className="bg-neutral-900 text-neutral-200 rounded-xl p-3.5 text-xs font-mono max-h-48 overflow-y-auto leading-relaxed border border-neutral-800">
                  <pre className="whitespace-pre-wrap font-sans">
                    {parsedDoc.text.slice(0, 1200)}
                    {parsedDoc.text.length > 1200 && '\n\n... [Content continues for full quiz analysis]'}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          {parsedDoc && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSaveMaterial(false)}>
                <CheckCircle2 size={15} /> Save to Materials
              </Button>
              <Button size="sm" onClick={() => handleSaveMaterial(true)}>
                <Sparkles size={15} /> Save & Generate Quiz
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
