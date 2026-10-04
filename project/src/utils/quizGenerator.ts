import type { QuizQuestion, Difficulty } from '@/types';
import { generatedQuizQuestions as defaultQuestions } from '@/data/mockData';

interface GenerateQuizOptions {
  title: string;
  text: string;
  topics?: string[];
  count?: number;
}

/**
 * Clean sentence for use in questions
 */
function cleanSentence(s: string): string {
  return s.replace(/^[•\-\*\d\.\)\s]+/, '').trim();
}

/**
 * Generate MCQs from arbitrary document text
 */
export function generateQuizFromText({
  title,
  text,
  topics = [],
  count = 3,
}: GenerateQuizOptions): {
  questions: QuizQuestion[];
  conceptsCount: number;
} {
  // If it's the default sample handbook, return the rich pre-authored questions
  if (title.toLowerCase().includes('data_preprocessing_handbook') || text.includes('Data Preprocessing Pipeline')) {
    return {
      questions: defaultQuestions,
      conceptsCount: 28,
    };
  }

  // Split text into meaningful paragraphs and sentences
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 50);

  const rawSentences: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const sList = line.split(/(?<=[.?!])\s+/);
    for (const s of sList) {
      const clean = cleanSentence(s);
      if (clean.length > 40 && clean.length < 180 && !clean.startsWith('http')) {
        rawSentences.push(clean);
      }
    }
  }

  // Calculate estimated concepts count (words / 30, bounded between 12 and 60)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const conceptsCount = Math.min(60, Math.max(12, Math.round(wordCount / 25)));

  const questions: QuizQuestion[] = [];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  // Identify informative sentences (sentences containing "is", "defined as", "requires", "recommended", "important", "used for")
  const informativeSentences = rawSentences.filter((s) =>
    /\b(is|are|defined|recommended|requires|ensures|method|approach|process|primary|key|critical)\b/i.test(s)
  );

  const pool = informativeSentences.length >= count ? informativeSentences : rawSentences;

  const usedSentences = new Set<string>();

  for (let i = 0; i < count; i++) {
    const diff = difficulties[i % difficulties.length];
    const candidate = pool.find((s) => !usedSentences.has(s)) || pool[i % pool.length];
    if (candidate) {
      usedSentences.add(candidate);
    }

    const docTopic = topics[i % (topics.length || 1)] || 'Core Concepts';

    if (candidate && candidate.length > 30) {
      // Craft question based on the candidate sentence
      const words = candidate.split(' ');
      const keyChunk = words.slice(0, Math.min(6, words.length)).join(' ');

      const questionText = `According to the uploaded document "${title}", which statement correctly describes ${docTopic.toLowerCase()}?`;

      // The correct answer is the actual statement or a refined formulation
      const correctAnswerText = candidate.endsWith('.') ? candidate : `${candidate}.`;

      // Generate plausible distractors
      const distractor1 = `It is primarily an optional post-hoc step that has minimal impact on ${docTopic.toLowerCase()}.`;
      const distractor2 = `It should be bypassed when dealing with large-scale or unverified statistical datasets.`;
      const distractor3 = `It only applies to historical records and is superseded by automated raw inputs.`;

      questions.push({
        id: `gen-q-${Date.now()}-${i + 1}`,
        question: questionText,
        options: [
          distractor1,
          correctAnswerText,
          distractor2,
          distractor3,
        ],
        correctAnswer: 1, // index 1
        difficulty: diff,
        explanation: `As detailed in "${title}" under the topic of ${docTopic}: "${candidate}". This directly supports correct implementation and analysis standards.`,
        sourceReference: `Document: ${title} — ${docTopic}`,
        competencyTag: 'c3',
      });
    } else {
      // Fallback question if text is short
      questions.push({
        id: `gen-q-${Date.now()}-${i + 1}`,
        question: `Based on the key objectives in "${title}", what is the primary focus of ${docTopic}?`,
        options: [
          `To provide systematic guidelines, methods, and verification for ${docTopic}.`,
          `To eliminate the need for any quality checks or domain reviews.`,
          `To replace all statistical procedures with arbitrary approximations.`,
          `To restrict information access solely to external unverified vendors.`,
        ],
        correctAnswer: 0,
        difficulty: diff,
        explanation: `The uploaded material "${title}" outlines the critical framework and best practices required for ${docTopic}.`,
        sourceReference: `Document: ${title}`,
        competencyTag: 'c3',
      });
    }
  }

  return {
    questions,
    conceptsCount,
  };
}
