import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CourseResponse } from "../../domain";
import { getCourse, MissingEntityError } from "../api";
import { PageError } from "../components/PageError";
import { formatStudyDate } from "../format";
import { AssessmentBand } from "../components/course/AssessmentBand";
import { CourseMap } from "../components/course/CourseMap";
import {
  CoursePassport,
  type CourseArtifact,
} from "../components/course/CoursePassport";
import { CourseSources } from "../components/course/CourseSources";
import { ReadingPosition } from "../components/course/ReadingPosition";
import { WeekLedger, resolveCurrentWeek } from "../components/course/WeekLedger";

/* Course-specific cover illustrations. Source evidence remains in the archive. */
const courseArtifacts: Record<string, CourseArtifact> = {
  sf1690: {
    kind: "dithered-still-life",
    src: "/course-artifacts/sf1690-mathematics-still-life-dithered-v1.webp",
    alt: "A dithered still life of a drafting compass, a graphite circle, and a glass sphere on paper.",
    caption: "A circle begins with a fixed point and a distance.",
    folio: "Figure 01",
    overlay: "geometry",
  },
  ie1204: {
    kind: "dithered-still-life",
    src: "/course-artifacts/ie1204-digital-design-still-life-dithered-v1.webp",
    alt: "A dithered still life of a translucent logic block connected to eight ceramic bit tiles by a copper line.",
    caption: "One physical signal; eight positions; a reusable abstraction.",
    folio: "Figure 02",
    overlay: "signal",
  },
  ii1308: {
    kind: "dithered-still-life",
    src: "/course-artifacts/ii1308-programming-still-life-dithered-v1.webp",
    alt: "A dithered still life of a blank name tag, a translucent value stack, and a branching peg connected by thread.",
    caption: "A name meets a value, then control chooses where to go.",
    folio: "Figure 03",
    overlay: "flow",
  },
};

export function CoursePage() {
  const { courseCode = "" } = useParams();
  const [data, setData] = useState<CourseResponse>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    let active = true;
    getCourse(courseCode)
      .then((result) => active && setData(result))
      .catch((cause) => active && setError(cause));
    return () => {
      active = false;
    };
  }, [courseCode]);

  if (error instanceof MissingEntityError) {
    return <PageError title="Course not found." message="This course is not in the Study Hub." linkTo="/" linkLabel="Browse courses" />;
  }
  if (error) {
    return <PageError title="Unable to load this course." message="Refresh the page to try again." linkTo="/" linkLabel="Browse courses" />;
  }
  if (!data) return <p className="loading">Loading course…</p>;

  const currentWeek = resolveCurrentWeek(
    data.journey,
    data.course.startDate,
    data.course.endDate,
  );

  const readingSections = [
    { id: "course-passport", label: "Course passport" },
    ...(data.assessments.length
      ? [{ id: "course-assessment", label: "Assessment" }]
      : []),
    ...(data.outcomes.length || data.concepts.length
      ? [{ id: "course-map", label: "Course map" }]
      : []),
    ...(data.journey.length ? [{ id: "week-ledger", label: "Week ledger" }] : []),
    ...(data.lectures.length
      ? [{ id: "lecture-archive", label: "Lecture archive" }]
      : []),
    { id: "concept-register", label: "Concept register" },
    ...(data.sources.length ? [{ id: "course-sources", label: "Sources" }] : []),
  ];

  return (
    <article className="page-column course-page course-dossier">
      <CoursePassport
        course={data.course}
        artifact={courseArtifacts[courseCode.toLowerCase()]}
      />
      <AssessmentBand
        courseCredits={data.course.credits}
        assessments={data.assessments}
      />
      <CourseMap
        courseCode={courseCode}
        outcomes={data.outcomes}
        concepts={data.concepts}
      />
      <WeekLedger
        groups={data.journey}
        sessions={data.sessions}
        coursework={data.coursework}
        courseStart={data.course.startDate}
        courseEnd={data.course.endDate}
      />
      {data.lectures.length ? (
        <section
          className="course-archive"
          id="lecture-archive"
          aria-labelledby="lecture-archive-title"
        >
          <header className="course-section-heading">
            <p>Notes written after class</p>
            <h2 id="lecture-archive-title">Lecture archive</h2>
          </header>
          <ol className="lecture-list">
            {data.lectures.map((lecture) => (
              <li key={lecture.id} id={`lecture-${lecture.slug}`}>
                <Link
                  className="lecture-list__link"
                  to={`/courses/${courseCode}/lectures/${lecture.slug}`}
                  aria-label={lecture.title}
                >
                  <time className="lecture-date" dateTime={lecture.date}>
                    {formatStudyDate(lecture.date)}
                  </time>
                  <h3>{lecture.title}</h3>
                  <p>{lecture.summary}</p>
                  <span className="lecture-list__action">Open lecture</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <section
        className="course-concepts"
        id="concept-register"
        aria-labelledby="concept-register-title"
      >
        <header className="course-section-heading">
          <p>Core ideas from the course</p>
          <h2 id="concept-register-title">Concept register</h2>
        </header>
        {data.concepts.length ? (
          <ol className="entity-list">
            {data.concepts.map((concept) => (
              <li key={concept.id}>
                <Link to={`/courses/${courseCode}/concepts/${concept.slug}`}>
                  {concept.title}
                </Link>
                <p>{concept.summary}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="course-empty-note">No concept guides are available yet.</p>
        )}
      </section>
      <CourseSources sources={data.sources} />
      <ReadingPosition sections={readingSections} currentWeek={currentWeek} />
    </article>
  );
}
