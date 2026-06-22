import { Suspense, lazy } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AuthGate from '@/components/AuthGate';
import ErrorBoundary from '@/components/ErrorBoundary';
import FeedbackWidget from '@/components/FeedbackWidget';
import WelcomeModal from '@/components/WelcomeModal';

// Route-level code-splitting: each page becomes its own chunk loaded on demand.
const LessonExpander = lazy(() => import('./pages/LessonExpander'));
const AuthHome = lazy(() => import('./pages/AuthHome'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Lightweight full-screen fallback shown while a route chunk loads.
const RouteFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0a0a" }}>
    <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#1a1a1a", borderTopColor: "#b8ff00" }}></div>
  </div>
);

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
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Home: marketing for visitors, personalized progress home once signed in. */}
        <Route path="/" element={
          <LayoutWrapper currentPageName={isAuthenticated ? 'Home' : mainPageKey}>
            {isAuthenticated ? <AuthHome /> : <MainPage />}
          </LayoutWrapper>
        } />

        {/* Auth gate (full screen, no app chrome). */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthGate />} />

        {Object.entries(Pages).map(([path, Page]) => {
          // `Home` is the marketing landing, rendered at `/` for logged-out users.
          // Don't expose a second copy at `/Home`: send authed users to their
          // personalized AuthHome (the `/` route), visitors to the landing.
          if (path === 'Home') {
            return <Route key={path} path={`/${path}`} element={<Navigate to="/" replace />} />;
          }
          return (
            <Route
              key={path}
              path={`/${path}`}
              element={
                PROTECTED.has(path) && !isAuthenticated
                  ? <Navigate to="/login" replace />
                  : <LayoutWrapper currentPageName={path}><Page /></LayoutWrapper>
              }
            />
          );
        })}
        <Route path="/LessonExpander" element={<LayoutWrapper currentPageName="LessonExpander"><LessonExpander /></LayoutWrapper>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
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
      <WelcomeModal />
      <FeedbackWidget />
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Gate />
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
