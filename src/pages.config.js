/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
// Route-level code-splitting: every page is lazily imported so it ships in its
// own chunk and is only fetched when its route is visited. Lazy components are
// rendered behind a <Suspense> boundary in App.jsx. The Layout stays eager
// because it wraps every route and is part of the app shell.
import { lazy } from 'react';

const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Home = lazy(() => import('./pages/Home'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const AITrack = lazy(() => import('./pages/AITrack'));
const LessonDemo = lazy(() => import('./pages/LessonDemo'));
const Competitive = lazy(() => import('./pages/Competitive'));
const CompetitiveDetail = lazy(() => import('./pages/CompetitiveDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
import __Layout from './Layout.jsx';


export const PAGES = {
    "ChallengeDetail": ChallengeDetail,
    "Challenges": Challenges,
    "Dashboard": Dashboard,
    "Home": Home,
    "ProjectDetail": ProjectDetail,
    "Projects": Projects,
    "Portfolio": Portfolio,
    "AITrack": AITrack,
    "LessonDemo": LessonDemo,
    "Competitive": Competitive,
    "CompetitiveDetail": CompetitiveDetail,
    "Privacy": Privacy,
    "Terms": Terms,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};