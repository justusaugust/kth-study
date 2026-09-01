import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { QuickSearch } from "./QuickSearch";
import { StudyIcon } from "./StudyMark";

export function AppShell() {
  return (
    <div className="study-shell">
      <header className="study-header">
        <Link className="study-wordmark" to="/">
          KTH Study Hub
        </Link>
        <nav className="course-rail" aria-label="Courses">
          <NavLink className="course-link" to="/courses/sf1690">
            SF1690
          </NavLink>
          <NavLink className="course-link" to="/courses/ie1204">
            IE1204
          </NavLink>
          <NavLink className="course-link" to="/courses/ii1308">
            II1308
          </NavLink>
          <NavLink className="atlas-link" to="/visuals" aria-label="Visual atlas">
            <StudyIcon kind="explainer" />
            <span className="atlas-link-label">Visual atlas</span>
          </NavLink>
          <NavLink className="atlas-link" to="/deadlines" aria-label="Deadlines">
            <StudyIcon kind="date" />
            <span className="atlas-link-label">Deadlines</span>
          </NavLink>
        </nav>
        <QuickSearch
          id="global-search"
          label="Search all courses"
          placeholder="Search all courses"
          variant="header"
        />
        <ThemeToggle />
      </header>

      <main className="study-main">
        <Outlet />
      </main>
    </div>
  );
}
