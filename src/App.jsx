import { Suspense, lazy, useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AuthGate from '@/components/AuthGate';
import ErrorBoundary from '@/components/ErrorBoundary';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
import FeedbackWidget from '@/components/FeedbackWidget';
import AppSkeleton from '@/components/ui/AppSkeleton';

// True inside the Tauri desktop shell. Desktop users already came through the
// marketing site to download, so we skip the landing page for them.
const isDesktop = typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);

const LessonExpander = lazy(() => import('./pages/LessonExpander'));
const AuthHome = lazy(() => import('./pages/AuthHome'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const RouteFallback = () => <AppSkeleton />;

// Web-first: lesson/course content is public (no sign-in wall). Only truly
// personal pages require an account; cloud sync is still opt-in via sign-in.
const PROTECTED = new Set([
  'Dashboard', 'Portfolio',
]);

const ProjectDetailPage = Pages['ProjectDetail'];

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<RouteFallback />}>
      <RouteErrorBoundary>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            <LayoutWrapper currentPageName="Home"><AuthHome /></LayoutWrapper>
          ) : isDesktop ? (
            <Navigate to="/login" replace />
          ) : (
            <LayoutWrapper currentPageName={mainPageKey}><MainPage /></LayoutWrapper>
          )
        } />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthGate />} />

        {Object.entries(Pages).map(([path, Page]) => {
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
        {ProjectDetailPage && (
          <>
            <Route path="/learn/:projectSlug/:lessonSlug" element={<LayoutWrapper currentPageName="ProjectDetail"><ProjectDetailPage /></LayoutWrapper>} />
            <Route path="/learn/:projectSlug" element={<LayoutWrapper currentPageName="ProjectDetail"><ProjectDetailPage /></LayoutWrapper>} />
          </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </RouteErrorBoundary>
    </Suspense>
  );
};

// Surfaces a single toast when localStorage writes start failing (private mode /
// quota full) so a student knows their progress isn't being saved instead of
// silently losing it. Fired at most once per session by progressStore.
const StorageWatcher = () => {
  useEffect(() => {
    const onErr = () => toast({
      title: "Progress may not be saving",
      description: "Your browser is blocking local storage (private mode or full disk). Free up space or exit private browsing to keep your progress.",
      variant: "destructive",
    });
    window.addEventListener('codeflow:storage-error', onErr);
    return () => window.removeEventListener('codeflow:storage-error', onErr);
  }, []);
  return null;
};

const Gate = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#15130E" }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#262219", borderTopColor: "#E8A33C" }}></div>
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <NavigationTracker />
      <AuthenticatedApp />
      <FeedbackWidget />
      <StorageWatcher />
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
