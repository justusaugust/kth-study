import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { QuickSearch } from "./QuickSearch";
import { StudyIcon } from "./StudyMark";

export function AppShell() {
  const [searching, setSearching] = useState(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    const reveal = () => {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* A malformed fragment is still a valid literal ID. */ }
      const target = document.getElementById(id);
      if (!target) return false;
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      target.scrollIntoView({ block: "start" });
      return true;
    };
    if (reveal()) return;
    const observer = new MutationObserver(() => { if (reveal()) observer.disconnect(); });
    observer.observe(document.querySelector("main")!, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.inert = searching;
    return () => { if (main) main.inert = false; };
  }, [searching]);

  function closeSearch() {
    setSearching(false);
    requestAnimationFrame(() => searchTrigger.current?.focus());
  }

  return (
    <div className="study-shell">
      <header className="study-header">
        {searching ? (
          <div className="header-search-mode" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); closeSearch(); }
            if (event.key !== "Tab") return;
            const targets = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input, select, button, a[href]')).filter((element) => element.getClientRects().length > 0);
            const first = targets[0];
            const last = targets.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }}>
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
                <NavLink className="atlas-link" to="/practice" aria-label="Practice">
                  <StudyIcon kind="question" />
                  <span className="atlas-link-label">Practice</span>
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
