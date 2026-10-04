import { useState, useEffect } from 'react';
import { AppLayout, type PageId } from '@/components/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { LearnerDashboard } from '@/pages/LearnerDashboard';
import { AssessmentPage } from '@/pages/AssessmentPage';
import { GapAnalysisPage } from '@/pages/GapAnalysisPage';
import { LearningPathPage } from '@/pages/LearningPathPage';
import { IgotCoursesPage } from '@/pages/IgotCoursesPage';
import { QuizGenerationPage } from '@/pages/QuizGenerationPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { TrainerDashboard } from '@/pages/TrainerDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { DesignDocPage } from '@/pages/DesignDocPage';
import { AppProvider, useApp } from '@/context/AppContext';
import { MaterialsProvider } from '@/context/MaterialsContext';
import { IgotProvider } from '@/context/IgotContext';
import type { UserRole } from '@/types';

function AppContent() {
  const { currentUser, isLoggedIn } = useApp();
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');

  const currentRole = currentUser.role;

  // Set default page on role change or login
  useEffect(() => {
    if (isLoggedIn) {
      if (currentRole === 'admin') {
        if (!currentPage.startsWith('admin') && currentPage !== 'design-doc') {
          setCurrentPage('admin-dashboard');
        }
      } else {
        if (currentPage.startsWith('admin')) {
          setCurrentPage('dashboard');
        }
      }
    }
  }, [isLoggedIn, currentRole]);

  const handleLogin = (selectedRole: UserRole) => {
    if (selectedRole === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      // Officer pages
      case 'dashboard':
        return <LearnerDashboard onNavigate={setCurrentPage} />;
      case 'assessment':
        return <AssessmentPage onNavigate={setCurrentPage} />;
      case 'gap-analysis':
        return <GapAnalysisPage onNavigate={setCurrentPage} />;
      case 'learning-path':
        return <LearningPathPage />;
      case 'igot-courses':
        return <IgotCoursesPage />;
      case 'quiz':
        return <QuizGenerationPage />;
      case 'materials':
        return <MaterialsPage onNavigate={setCurrentPage} userRole={currentRole === 'admin' ? 'admin' : 'learner'} />;

      // Administrator pages (support direct tab routing)
      case 'admin-dashboard':
        return <AdminDashboard initialTab="overview" />;
      case 'admin-officers':
        return <AdminDashboard initialTab="officers" />;
      case 'admin-materials':
        return <AdminDashboard initialTab="materials" />;
      case 'admin-mcqs':
        return <AdminDashboard initialTab="mcqs" />;
      case 'admin-courses':
        return <AdminDashboard initialTab="courses" />;

      case 'trainer-dashboard':
        return <TrainerDashboard onNavigate={setCurrentPage} />;
      case 'design-doc':
        return <DesignDocPage />;
      default:
        return currentRole === 'admin' ? <AdminDashboard initialTab="overview" /> : <LearnerDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      {renderPage()}
    </AppLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <MaterialsProvider>
        <IgotProvider>
          <AppContent />
        </IgotProvider>
      </MaterialsProvider>
    </AppProvider>
  );
}

export default App;
