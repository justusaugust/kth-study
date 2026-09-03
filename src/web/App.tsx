import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { PageError } from "./components/PageError";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const SearchPage = lazy(() => import("./pages/SearchPage").then((module) => ({ default: module.SearchPage })));
const CoursePage = lazy(() => import("./pages/CoursePage").then((module) => ({ default: module.CoursePage })));
const LecturePage = lazy(() => import("./pages/LecturePage").then((module) => ({ default: module.LecturePage })));
const LabPage = lazy(() => import("./pages/LabPage").then((module) => ({ default: module.LabPage })));
const ConceptPage = lazy(() => import("./pages/ConceptPage").then((module) => ({ default: module.ConceptPage })));
const VisualPage = lazy(() => import("./pages/VisualPage").then((module) => ({ default: module.VisualPage })));
const VisualAtlasPage = lazy(() => import("./pages/VisualAtlasPage").then((module) => ({ default: module.VisualAtlasPage })));
const DeadlinesPage = lazy(() => import("./pages/DeadlinesPage").then((module) => ({ default: module.DeadlinesPage })));

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<Suspense fallback={<p className="loading">Loading…</p>}><OutletRoutes /></Suspense>}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="courses/:courseCode" element={<CoursePage />} />
          <Route path="courses/:courseCode/lectures/:lectureSlug" element={<LecturePage />} />
          <Route path="courses/:courseCode/labs/:labSlug" element={<LabPage />} />
          <Route path="courses/:courseCode/concepts/:conceptSlug" element={<ConceptPage />} />
          <Route path="visuals" element={<VisualAtlasPage />} />
          <Route path="visuals/:visualSlug" element={<VisualPage />} />
          <Route path="deadlines" element={<DeadlinesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <PageError
      title="Page not found"
      message="This link does not point to a course, lecture, lab, concept, or visual."
      linkTo="/"
      linkLabel="Go to Study Hub"
    />
  );
}

function OutletRoutes() {
  return <Outlet />;
}
