// src/services/igotMockApi.ts

/**
 * Mock iGOT Karmayogi API integration.
 * In production, replace this with real API calls using your VITE_IGOT_API_KEY.
 *
 * Each course is mapped to a real YouTube educational lecture embed URL
 * relevant to its topic (NPTEL / government statistics lectures).
 * Videos play inside an <iframe> with full audio & video.
 */

export interface IgotVideoData {
  type: 'youtube' | 'mp4';
  /** YouTube embed URL or direct MP4 URL */
  embedUrl: string;
  title: string;
  lecturer: string;
  institution: string;
}

/** Course ID → video metadata */
const mockCourseVideoMap: Record<string, IgotVideoData> = {
  // Statistical Data Analysis Fundamentals
  igot001: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/xxpc-HPKN28',
    title: 'Introduction to Statistics (NPTEL)',
    lecturer: 'Prof. Arnab Kumar Laha',
    institution: 'IIM Ahmedabad / NPTEL',
  },
  // Data Visualization for Government Reports
  igot002: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/hVimVzgtD6w',
    title: 'Data Visualization Techniques',
    lecturer: 'Prof. Raghu Mahajan',
    institution: 'IIT Madras / NPTEL',
  },
  // Python for Statistical Computing
  igot003: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/ZyhVh-qejZQ',
    title: 'Python for Data Science & Statistics',
    lecturer: 'Prof. Ragunathan Rengasamy',
    institution: 'IIT Madras / NPTEL',
  },
  // Survey Design and Methodology
  igot004: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/UiJFq5zLd5M',
    title: 'Survey Research Methods & Design',
    lecturer: 'Prof. Soma Roy',
    institution: 'IIT Kanpur / NPTEL',
  },
  // National Accounts Statistics: SNA Framework
  igot005: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/nHJFkQeHWoQ',
    title: 'National Income Accounting & GDP Measurement',
    lecturer: 'Prof. Surajit Das',
    institution: 'Jawaharlal Nehru University',
  },
  // Data Quality Assurance in Official Statistics
  igot006: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/IjL94QVE3B4',
    title: 'Data Quality & Validation Frameworks',
    lecturer: 'Prof. Bimal Kumar Roy',
    institution: 'ISI Kolkata / NPTEL',
  },
  // Advanced Regression and Modeling
  igot007: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/7ArmBVF2dCs',
    title: 'Regression Analysis & Statistical Modeling',
    lecturer: 'Prof. Shalabh',
    institution: 'IIT Kanpur / NPTEL',
  },
  // Introduction to R for Government Data
  igot008: {
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/ANMuuq502IDc',
    title: 'R Programming for Data Analysis',
    lecturer: 'Prof. Soumen Maity',
    institution: 'IIT Kharagpur / NPTEL',
  },
};

/** Default fallback lecture */
const defaultVideo: IgotVideoData = {
  type: 'youtube',
  embedUrl: 'https://www.youtube.com/embed/xxpc-HPKN28',
  title: 'Foundations of Statistical Methods (NPTEL)',
  lecturer: 'Prof. Arnab Kumar Laha',
  institution: 'IIM Ahmedabad / NPTEL',
};

/**
 * Simulates an async API call to the iGOT Karmayogi platform.
 * Returns the embed URL for the given course ID.
 */
export async function getMockIgotVideoUrl(courseId: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 150)); // simulate network
  return (mockCourseVideoMap[courseId] ?? defaultVideo).embedUrl;
}

/**
 * Full video metadata for richer UI display (lecturer name, institution, etc.)
 */
export async function getMockIgotVideoData(courseId: string): Promise<IgotVideoData> {
  await new Promise((r) => setTimeout(r, 150));
  return mockCourseVideoMap[courseId] ?? defaultVideo;
}

export default { getMockIgotVideoUrl, getMockIgotVideoData };
