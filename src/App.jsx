import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import LessonExpander from './pages/LessonExpander';
import AuthGate from '@/components/AuthGate';
import AuthHome from './pages/AuthHome';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// App pages that require a signed-in (or guest) profile. Public: marketing Home + LessonDemo.
const PROTECTED = new Set([
  'ChallengeDetail', 'Challenges', 'Dashboard', 'ProjectDetail', 'Projects', 'Portfolio', 'AITrack',
  'Competitive', 'CompetitiveDetail',
]);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Home: marketing for visitors, personalized progress home once signed in. */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={isAuthenticated ? 'Home' : mainPageKey}>
          {isAuthenticated ? <AuthHome /> : <MainPage />}
        </LayoutWrapper>
      } />

      {/* Auth gate (full screen, no app chrome). */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthGate />} />

      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            PROTECTED.has(path) && !isAuthenticated
              ? <Navigate to="/login" replace />
              : <LayoutWrapper currentPageName={path}><Page /></LayoutWrapper>
          }
        />
      ))}
      <Route path="/LessonExpander" element={<LayoutWrapper currentPageName="LessonExpander"><LessonExpander /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

const Gate = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#1a1a1a", borderTopColor: "#b8ff00" }}></div>
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <NavigationTracker />
      <AuthenticatedApp />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Gate />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
