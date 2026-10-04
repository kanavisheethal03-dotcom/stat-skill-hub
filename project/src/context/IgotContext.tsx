/**
 * IgotContext — Demo Mode enrollment state management
 *
 * DEMO MODE: Enrollments are stored in React state (in-memory).
 * PRODUCTION UPGRADE: Replace enrollCourse / updateProgress with
 * authenticated calls to the iGOT Karmayogi API:
 *   POST https://api.igotkarmayogi.gov.in/api/v1/enroll  (OAuth2 bearer)
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { EnrollmentStatus } from '@/types';

interface IgotContextValue {
  enrollments: Record<string, EnrollmentStatus>;
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => void;
  unenrollCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
  enrolledCount: number;
  isDemoMode: boolean;
}

const IgotContext = createContext<IgotContextValue | null>(null);

// Pre-populate demo enrollments matching the learningPath mock data
const initialEnrollments: Record<string, EnrollmentStatus> = {
  igot001: { courseId: 'igot001', enrolledAt: '2026-09-14T10:15:00Z', status: 'completed', progress: 100 },
  igot002: { courseId: 'igot002', enrolledAt: '2026-09-15T08:00:00Z', status: 'in_progress', progress: 60 },
  igot003: { courseId: 'igot003', enrolledAt: '2026-09-15T09:00:00Z', status: 'in_progress', progress: 35 },
};

export function IgotProvider({ children }: { children: ReactNode }) {
  const [enrollments, setEnrollments] = useState<Record<string, EnrollmentStatus>>(initialEnrollments);

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

  const enrolledCount = Object.keys(enrollments).length;

  return (
    <IgotContext.Provider
      value={{
        enrollments,
        isEnrolled,
        enrollCourse,
        unenrollCourse,
        updateProgress,
        enrolledCount,
        isDemoMode: true,
      }}
    >
      {children}
    </IgotContext.Provider>
  );
}

export function useIgot() {
  const ctx = useContext(IgotContext);
  if (!ctx) throw new Error('useIgot must be used inside <IgotProvider>');
  return ctx;
}

