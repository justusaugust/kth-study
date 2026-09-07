import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CourseResponse } from "../../domain";
import { getCourse, MissingEntityError } from "../api";
import { PageError } from "../components/PageError";
import { AssessmentBand } from "../components/course/AssessmentBand";
import { CoursePassport } from "../components/course/CoursePassport";
import { CourseSources } from "../components/course/CourseSources";
import { WeekLedger } from "../components/course/WeekLedger";
import { formatStudyDate } from "../format";

export function CoursePage() {
  const { courseCode = "" } = useParams();
  const [data, setData] = useState<CourseResponse>();
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    let active = true;
    setData(undefined);
    setError(undefined);
    getCourse(courseCode).then((result) => active && setData(result)).catch((cause) => active && setError(cause));
    return () => { active = false; };
  }, [courseCode]);

  if (error instanceof MissingEntityError) return <PageError title="Course not found." message="This course is not in the Study Hub." linkTo="/" linkLabel="Browse courses" />;
  if (error) return <PageError title="Unable to load this course." message="Refresh the page to try again." linkTo="/" linkLabel="Browse courses" />;
  if (!data) return <p className="loading">Loading course…</p>;

  const orderedLectures = [...data.lectures].sort(
    (a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug),
  );
  const undated = data.sessions.filter((session) => !session.date).length;

  return <article className="page-column course-page course-dossier">
    <CoursePassport course={data.course} />
    <nav className="course-outline-links" aria-label="Course sections">
      <a href="#course-lectures">Lectures</a>
      <a href="#week-ledger">Study outline</a>
      <Link to={`/practice?course=${courseCode}`}>Practice</Link>
      <a href="#course-assessment">Assessment</a>
      <a href="#course-sources">Sources</a>
    </nav>
    <section id="course-lectures" className="course-archive" aria-labelledby="course-lectures-title">
      <header className="course-section-heading">
        <h2 id="course-lectures-title">Lectures</h2>
      </header>
      {orderedLectures.length ? <ol className="lecture-list">{orderedLectures.map((lecture) => <li key={lecture.id}>
        <Link className="lecture-list__link" to={`/courses/${courseCode}/lectures/${lecture.slug}`}>
          <time dateTime={lecture.date}>{formatStudyDate(lecture.date)}</time>
          <h3>{lecture.title}</h3>
        </Link>
      </li>)}</ol> : <p className="course-empty-note">No lecture notes are saved for this course yet. The weekly outline below still lists the scheduled sessions.</p>}
    </section>
    {undated ? <p className="course-empty-note">{undated} planned session{undated === 1 ? " has" : "s have"} no confirmed date in the saved material. Check the official timetable before attending.</p> : null}
    <WeekLedger groups={data.journey} sessions={data.sessions} coursework={data.coursework} courseStart={data.course.startDate} courseEnd={data.course.endDate} />
    <AssessmentBand courseCredits={data.course.credits} assessments={data.assessments} />
    <details className="course-reference" id="concept-register">
      <summary>Topic index and learning outcomes</summary>
      <ul className="course-topic-index">{data.concepts.map((concept) => <li key={concept.id}>
        <Link to={`/courses/${courseCode}/concepts/${concept.slug}`}>{concept.title}</Link>
      </li>)}</ul>
      <h3>Learning outcomes</h3>
      <ul>{data.outcomes.map((outcome) => <li key={outcome.id}>{outcome.description}</li>)}</ul>
    </details>
    <CourseSources sources={data.sources} />
  </article>;
}
