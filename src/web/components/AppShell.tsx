import { useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { QuickSearch } from "./QuickSearch";
import { StudyIcon } from "./StudyMark";

export function AppShell() {
  const [searching, setSearching] = useState(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);

  function closeSearch() {
    setSearching(false);
    requestAnimationFrame(() => searchTrigger.current?.focus());
  }

  return (
    <div className="study-shell">
      <header className="study-header">
        {searching ? (
          <div className="header-search-mode">
            <QuickSearch
              id="global-search"
              label="Search all courses"
              placeholder="Search courses, lectures, concepts…"
              variant="header"
              autoFocus
              onDismiss={closeSearch}
            />
            <button className="header-search-close" type="button" onClick={closeSearch}>
              Close
            </button>
          </div>
        ) : (
          <>
            <Link className="study-wordmark" to="/">
              KTH Study
            </Link>
            <nav className="course-rail" aria-label="Primary">
              <div className="course-rail__group">
                <NavLink className="course-link" to="/courses/sf1690">
                  SF1690
                </NavLink>
                <NavLink className="course-link" to="/courses/ie1204">
                  IE1204
                </NavLink>
                <NavLink className="course-link" to="/courses/ii1308">
                  II1308
                </NavLink>
              </div>
              <div className="course-rail__group course-rail__group--tools">
                <NavLink className="atlas-link" to="/visuals" aria-label="Visual atlas">
                  <StudyIcon kind="explainer" />
                  <span className="atlas-link-label">Visuals</span>
                </NavLink>
                <NavLink className="atlas-link" to="/deadlines" aria-label="Deadlines">
                  <StudyIcon kind="date" />
                  <span className="atlas-link-label">Deadlines</span>
                </NavLink>
              </div>
            </nav>
            <button
              ref={searchTrigger}
              className="header-search-trigger"
              type="button"
              aria-label="Search"
              onClick={() => setSearching(true)}
            >
              <StudyIcon kind="search" />
              <span className="header-action-label">Search</span>
            </button>
            <ThemeToggle />
          </>
        )}
      </header>

      <main className="study-main">
        <Outlet />
      </main>
    </div>
  );
}
