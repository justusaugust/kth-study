import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { CourseResponse } from "../../domain/api";
import { getCourse, MissingEntityError } from "../api";
import { PageError } from "../components/PageError";
import { ExplainerRenderer } from "../components/ExplainerRenderer";
import { MathText } from "../components/MathText";
import { SourceLinks } from "../components/SourceLinks";
import { StudyMark } from "../components/StudyMark";
import { formatStudyDate } from "../format";

export function LecturePage() {
  const { courseCode = "", lectureSlug = "" } = useParams();
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
    return <PageError title="Lecture not found." message="This lecture is not in the course archive." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }
  if (error) {
    return <PageError title="Unable to load this lecture." message="Refresh the page to try again." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }
  if (!data) return <p className="loading">Loading lecture…</p>;

  const lecture = data.lectures.find((item) => item.slug === lectureSlug);
  if (!lecture) {
    return <PageError title="Lecture not found." message="This lecture is not in the course archive." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }

  const concepts = lecture.conceptIds
    .map((id) => data.concepts.find((concept) => concept.id === id))
    .filter((concept): concept is CourseResponse["concepts"][number] => Boolean(concept));
  const sources = lecture.sourceIds
    .map((id) => data.sources.find((source) => source.id === id))
    .filter((source): source is CourseResponse["sources"][number] => Boolean(source));

  return (
    <article className="lecture-page page-column">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={`/courses/${data.course.code.toLowerCase()}`}>{data.course.code}</Link>
        <span aria-hidden="true">/</span>
        <span>Lecture archive</span>
      </nav>

      <header className="lecture-heading">
        <StudyMark kind="lecture" className="page-kicker">
          {formatStudyDate(lecture.date)}
        </StudyMark>
        <h1>{lecture.title}</h1>
        <p className="lead">{lecture.summary}</p>
        <div className="lecture-heading__meta">
          <span>{concepts.length} {concepts.length === 1 ? "concept" : "concepts"}</span>
          <span>{sources.length} {sources.length === 1 ? "source" : "sources"}</span>
        </div>
      </header>

      {lecture.body ? (
        <section className="lecture-note markdown-body" aria-labelledby="lecture-note-title">
          <h2 id="lecture-note-title">Lecture overview</h2>
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {lecture.body}
          </ReactMarkdown>
        </section>
      ) : null}

      <section className="lecture-spine" aria-labelledby="lecture-spine-title">
        <header className="course-section-heading">
          <p>Move through the ideas in lecture order</p>
          <h2 id="lecture-spine-title">Lecture spine</h2>
        </header>
        <ol className="lecture-spine__list">
          {concepts.map((concept, index) => {
            const explainer = data.explainers.find((item) =>
              item.conceptIds.includes(concept.id),
            );
            return (
              <li className="lecture-concept" key={concept.id}>
                <span className="lecture-concept__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="lecture-concept__body">
                  <h3>{concept.title}</h3>
                  <MathText as="p">{concept.summary}</MathText>
                  {explainer ? (
                    <div className="figure-frame lecture-concept__visual">
                      <ExplainerRenderer spec={explainer} mode="preview" />
                    </div>
                  ) : null}
                  <Link
                    className="lecture-concept__link"
                    to={`/courses/${data.course.code.toLowerCase()}/concepts/${concept.slug}`}
                  >
                    Study {concept.title.toLowerCase()}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="lecture-sources" aria-labelledby="lecture-sources-title">
        <header className="course-section-heading">
          <p>References for the concepts and examples</p>
          <h2 id="lecture-sources-title">Sources</h2>
        </header>
        <SourceLinks sources={sources} />
      </section>
    </article>
  );
}
