import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CourseResponse } from "../../domain/api";
import { getCourse, MissingEntityError } from "../api";
import { PageError } from "../components/PageError";
import { SourceLinks } from "../components/SourceLinks";
import { StudyMark } from "../components/StudyMark";
import { formatStudyDateLong } from "../format";

export function LabPage() {
  const { courseCode = "", labSlug = "" } = useParams();
  const [data, setData] = useState<CourseResponse>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    let active = true;
    getCourse(courseCode)
      .then((result) => active && setData(result))
      .catch((cause) => active && setError(cause));
    return () => { active = false; };
  }, [courseCode]);

  if (error instanceof MissingEntityError) {
    return <PageError title="Lab not found." message="This lab is not in the course record." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }
  if (error) {
    return <PageError title="Unable to load this lab." message="Refresh the page to try again." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }
  if (!data) return <p className="loading">Loading lab…</p>;

  const lab = data.sessions.find((session) => session.kind === "laboratory" && session.slug === labSlug);
  if (!lab) {
    return <PageError title="Lab not found." message="This lab is not in the course record." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }

  const assessment = data.assessments.find((item) => item.kind === "laboratory");
  const sources = data.sources.filter((source) => lab.sourceIds.includes(source.id));
  const schedule = [lab.date ? formatStudyDateLong(lab.date) : undefined, lab.time && lab.endTime ? `${lab.time}–${lab.endTime}` : lab.time, lab.location].filter(Boolean).join(" · ");

  return (
    <article className="lab-page page-column">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={`/courses/${data.course.code.toLowerCase()}`}>{data.course.code}</Link>
        <span aria-hidden="true">/</span>
        <span>Lab sessions</span>
      </nav>

      <header className="lecture-heading">
        <StudyMark kind="lecture" className="page-kicker">Lab record</StudyMark>
        <h1>{lab.title}</h1>
        {schedule ? <p className="lead">{schedule}</p> : null}
        {assessment ? (
          <p className="lab-requirement">
            <strong>{assessment.code} · {assessment.title}</strong>
            <span>{assessment.compulsory ? "Compulsory" : "Optional"} · {assessment.credits} ECTS</span>
          </p>
        ) : null}
      </header>

      {lab.agenda?.length ? (
        <section className="lecture-note lab-section" aria-labelledby="lab-plan-title">
          <h2 id="lab-plan-title">Session plan</h2>
          <ol>{lab.agenda.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
      ) : null}

      <section className="lecture-note lab-section" aria-labelledby="lab-recap-title">
        <h2 id="lab-recap-title">What happened</h2>
        {lab.recap ? <p>{lab.recap}</p> : (
          <p className="lab-empty">No post-lab record yet. After the session, share what you built, tested, and anything that failed; that short recap can live here.</p>
        )}
      </section>

      <section className="lecture-sources" aria-labelledby="lab-sources-title">
        <header className="course-section-heading">
          <p>Official references for this session</p>
          <h2 id="lab-sources-title">Sources</h2>
        </header>
        <SourceLinks sources={sources} />
      </section>
    </article>
  );
}
