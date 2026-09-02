import type { Course } from "../../../domain";
import { formatStudyDate, formatStudyDateRange } from "../../format";
import { CourseIllustration } from "./CourseIllustration";

export interface CourseArtifact {
  kind: "dithered-still-life";
  src: string;
  alt: string;
  caption: string;
  folio: string;
  overlay?: "geometry" | "signal" | "flow";
}

export function CoursePassport({
  course,
}: {
  course: Course;
}) {
  const dateRange = formatStudyDateRange(course.startDate, course.endDate);

  return (
    <header className="course-passport" id="course-passport">
      <div className="course-passport__identity">
        <p className="course-code">{course.code}</p>
        <h1>{course.title}</h1>
        <p className="lead">{course.summary}</p>
        {course.links.length ? (
          <nav className="course-source-links" aria-label="Course sources">
            {course.links.map((link) => (
              <a
                key={`${link.kind}:${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <span className="course-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        ) : null}
      </div>
      <dl className="course-margin-data">
        <div>
          <dt>Credits</dt>
          <dd>{course.credits} ECTS</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{course.period}</dd>
        </div>
        {dateRange ? (
          <div>
            <dt>Teaching</dt>
            <dd>{dateRange}</dd>
          </div>
        ) : null}
        {course.language ? (
          <div>
            <dt>Language</dt>
            <dd>{course.language}</dd>
          </div>
        ) : null}
        <div>
          <dt>Checked</dt>
          <dd>{formatStudyDate(course.lastChecked)}</dd>
        </div>
      </dl>
    </header>
  );
}

export function CourseArtifactFigure({ artifact }: { artifact?: CourseArtifact }) {
  if (!artifact) return null;
  return (
    <figure className="course-artifact">
      <CourseIllustration src={artifact.src} label={artifact.alt} overlay={artifact.overlay} />
      <figcaption>
        <span className="course-artifact__folio">{artifact.folio}</span>
        {artifact.caption}
      </figcaption>
    </figure>
  );
}
