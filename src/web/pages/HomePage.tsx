import { Link } from "react-router-dom";
import { QuickSearch } from "../components/QuickSearch";
import { StudyMark } from "../components/StudyMark";

export function HomePage() {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="page-meta">
        <StudyMark kind="date">Läsår 2026–27</StudyMark>
        <StudyMark kind="period">Period 1</StudyMark>
      </div>
      <h1 id="welcome-title">Find the idea you need.</h1>
      <p className="welcome-copy">
        Search the curriculum, lecture explanations, worked examples, and
        visual models without maintaining a second set of notes.
      </p>
      <QuickSearch
        id="home-search"
        label="Search course material"
        placeholder="Try “quadratic”, “graph”, or a course code"
        variant="home"
      />
      <div className="home-links">
        <Link to="/courses/sf1690">Open SF1690</Link>
        <Link to="/courses/ie1204">Open IE1204</Link>
        <Link to="/courses/ii1308">Open II1308</Link>
        <Link to="/visuals">Browse visual explainers</Link>
        <Link to="/deadlines">See upcoming deadlines</Link>
      </div>
    </section>
  );
}
