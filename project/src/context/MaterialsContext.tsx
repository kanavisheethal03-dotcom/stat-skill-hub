import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { LearningMaterial, ActivityLog } from '@/types';
import { learningMaterials as initialMaterials, activityLogs as initialLogs, sampleDocumentText } from '@/data/mockData';

export interface ActiveDocumentState {
  title: string;
  type: 'pdf' | 'docx' | 'pptx' | 'text';
  text: string;
  pages: number;
  topics: string[];
  conceptsCount?: number;
  fileSize?: number;
}

interface MaterialsContextType {
  materials: LearningMaterial[];
  activityLogs: ActivityLog[];
  activeDocument: ActiveDocumentState;
  documentTexts: Record<string, string>;
  addMaterial: (
    material: Omit<LearningMaterial, 'id' | 'uploadedAt'>,
    extractedText?: string
  ) => LearningMaterial;
  setActiveDocument: (doc: ActiveDocumentState) => void;
  loadMaterialForQuiz: (material: LearningMaterial) => void;
  addActivityLog: (log: { userId: string; userName: string; action: string; details: string }) => void;
}

const defaultActiveDoc: ActiveDocumentState = {
  title: 'Data_Preprocessing_Handbook.pdf',
  type: 'pdf',
  text: sampleDocumentText,
  pages: 12,
  topics: ['Data Profiling', 'Missing Data', 'Outlier Detection', 'Data Transformation', 'Normalization'],
  conceptsCount: 28,
  fileSize: 245,
};

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<LearningMaterial[]>(initialMaterials);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialLogs);
  const [activeDocument, setActiveDocument] = useState<ActiveDocumentState>(defaultActiveDoc);
  const [documentTexts, setDocumentTexts] = useState<Record<string, string>>({
    'Data_Preprocessing_Handbook.pdf': sampleDocumentText,
    'Survey_Methodology_Guide.pdf': `Survey Methodology & Sampling Design Guide\n\nSection 1: Probability Sampling\nProbability sampling ensures every unit in the population has a known, non-zero probability of selection. In official statistics, stratified multi-stage sampling is the gold standard for household surveys, reducing standard errors while maintaining geographical representation.\n\nSection 2: Questionnaire Validation\nPre-testing and cognitive interviewing are essential to identify ambiguous questions, leading phrasing, and recall burden before survey rollout.\n\nSection 3: Field Verification and Quality Audits\nField supervisors must conduct random back-checks on at least 10% of enumerated households to verify interview integrity and reduce non-sampling errors.`,
    'GDP_Compilation_Methods.docx': `System of National Accounts (SNA) — GDP Compilation Framework\n\nChapter 1: Production Approach\nGross Value Added (GVA) at basic prices is calculated by subtracting intermediate consumption from gross output. Taxes on products are added and subsidies subtracted to arrive at GDP at market prices.\n\nChapter 2: Expenditure Approach\nGDP equals Private Final Consumption Expenditure (PFCE) + Government Final Consumption Expenditure (GFCE) + Gross Fixed Capital Formation (GFCF) + Changes in Inventories + Net Exports.\n\nChapter 3: Deflators and Base Year Revisions\nVolume estimates are obtained by double deflation using producer price indices (PPI) and consumer price indices (CPI). Periodic rebasing aligns national accounts with structural economic shifts.`,
  });

  const addActivityLog = ({
    userId,
    userName,
    action,
    details,
  }: {
    userId: string;
    userName: string;
    action: string;
    details: string;
  }) => {
    const newLog: ActivityLog = {
      id: `al-${Date.now()}`,
      userId,
      userName,
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

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
      userId: 'u001',
      userName: matData.uploadedBy || 'Priya Sharma',
      action: 'Material Uploaded',
      details: `Uploaded: ${newMaterial.title} (${newMaterial.pages} pages, ${newMaterial.type.toUpperCase()})`,
    });

    return newMaterial;
  };

  const loadMaterialForQuiz = (material: LearningMaterial) => {
    const text = documentTexts[material.title] || `Document: ${material.title}\nTopics: ${material.topics.join(', ')}\n\nExtracted content prepared for automated quiz generation and assessment.`;
    setActiveDocument({
      title: material.title,
      type: material.type,
      text,
      pages: material.pages,
      topics: material.topics,
      conceptsCount: material.conceptsExtracted,
    });
  };

  return (
    <MaterialsContext.Provider
      value={{
        materials,
        activityLogs,
        activeDocument,
        documentTexts,
        addMaterial,
        setActiveDocument,
        loadMaterialForQuiz,
        addActivityLog,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials() {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error('useMaterials must be used within a MaterialsProvider');
  }
  return context;
}
