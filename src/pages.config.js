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
const APCS = lazy(() => import('./pages/APCS'));
const Playground = lazy(() => import('./pages/Playground'));
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
    "APCS": APCS,
    "Playground": Playground,
    "Privacy": Privacy,
    "Terms": Terms,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};