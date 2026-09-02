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
import { PracticePrompt } from "../components/PracticePrompt";
import { SourceLinks } from "../components/SourceLinks";
import { StudyMark } from "../components/StudyMark";
import { BooleanFormsDiagram, StringIndexDiagram } from "../components/SystemsDiagram";
import { formatStudyDate, formatStudyDateLong } from "../format";

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
  const lectureSourceIds = new Set(lecture.sourceIds);
  const knownLectureSourceIds = new Set(data.lectures.flatMap((item) => item.sourceIds));
  const belongsToLecture = (item: { sourceIds: string[] }) => {
    const scopedSourceIds = item.sourceIds.filter((id) => knownLectureSourceIds.has(id));
    return !scopedSourceIds.length || scopedSourceIds.some((id) => lectureSourceIds.has(id));
  };
  const coursework = data.coursework.filter((item) =>
    item.lectureIds.includes(lecture.id),
  );
  const questions = data.questions.filter((question) =>
    question.conceptIds.some((conceptId) => lecture.conceptIds.includes(conceptId)) &&
    belongsToLecture(question),
  );
  const relatedSourceIds = new Set([
    ...lecture.sourceIds,
    ...concepts.flatMap((concept) => concept.sourceIds),
    ...data.explainers
      .filter((item) => item.conceptIds.some((id) => lecture.conceptIds.includes(id)))
      .flatMap((item) => item.sourceIds),
    ...data.definitions
      .filter((item) => item.conceptIds.some((id) => lecture.conceptIds.includes(id)))
      .flatMap((item) => item.sourceIds),
    ...data.examples
      .filter((item) =>
        item.conceptIds.some((id) => lecture.conceptIds.includes(id)) && belongsToLecture(item),
      )
      .flatMap((item) => item.sourceIds),
    ...questions.flatMap((item) => item.sourceIds),
    ...coursework.flatMap((item) => item.sourceIds),
  ]);
  const sources = data.sources.filter((source) => relatedSourceIds.has(source.id));
  const orderedLectures = [...data.lectures].sort(
    (a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug),
  );
  const lectureIndex = orderedLectures.findIndex((item) => item.id === lecture.id);
  const previousLecture = orderedLectures[lectureIndex - 1];
  const nextLecture = orderedLectures[lectureIndex + 1];

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
          <span>{questions.length} {questions.length === 1 ? "self-check" : "self-checks"}</span>
          {coursework.length ? <span>{coursework.length} assigned set{coursework.length === 1 ? "" : "s"}</span> : null}
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
          <h2 id="lecture-spine-title">Lecture guide</h2>
        </header>
        <ol className="lecture-spine__list">
          {concepts.map((concept, index) => {
            const explainer = data.explainers.find((item) =>
              item.conceptIds.includes(concept.id),
            );
            const definitions = data.definitions.filter((item) =>
              item.conceptIds.includes(concept.id),
            );
            const examples = data.examples.filter((item) =>
              item.conceptIds.includes(concept.id) && belongsToLecture(item),
            );
            const conceptQuestions = questions.filter((item) => item.conceptIds.includes(concept.id));
            return (
              <li key={concept.id}>
                <details className="lecture-concept" open={index === 0}>
                  <summary className="lecture-concept__summary">
                    <span className="lecture-concept__index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="lecture-concept__summary-copy">
                      <span role="heading" aria-level={3}>{concept.title}</span>
                      <MathText as="span">{concept.summary}</MathText>
                    </span>
                    <span className="lecture-concept__disclosure" aria-hidden="true">
                    </span>
                  </summary>
                  <div className="lecture-concept__body">
                    <div className="lecture-concept__explanation">
                      <MathText as="p" className="lecture-concept__insight">
                        {concept.centralInsight ?? concept.summary}
                      </MathText>
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {concept.body}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {definitions.length ? (
                      <div className="lecture-concept__definitions">
                        <h4>Key definitions</h4>
                        <div>
                          {definitions.map((definition) => (
                            <article key={definition.id}>
                              <h5>{definition.term}</h5>
                              {definition.notation ? <MathText as="div">{definition.notation}</MathText> : null}
                              <MathText as="p">{definition.statement}</MathText>
                              {definition.interpretation ? <MathText as="p">{definition.interpretation}</MathText> : null}
                            </article>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {explainer ? (
                      <div className="figure-frame lecture-concept__visual">
                        <ExplainerRenderer spec={explainer} mode="preview" />
                      </div>
                    ) : concept.slug === "boolean-equations-and-algebra" ? (
                      <div className="figure-frame lecture-concept__visual">
                        <BooleanFormsDiagram mode="preview" />
                      </div>
                    ) : concept.slug === "characters-and-strings" ? (
                      <div className="figure-frame lecture-concept__visual">
                        <StringIndexDiagram mode="preview" />
                      </div>
                    ) : null}
                    {examples.length ? (
                      <div className="lecture-concept__examples">
                        <h4>Worked examples</h4>
                        {examples.map((example) => (
                          <article key={example.id} id={`example-${example.slug}`}>
                            <h5>{example.title}</h5>
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {example.body}
                            </ReactMarkdown>
                          </article>
                        ))}
                      </div>
                    ) : null}
                    {conceptQuestions.length ? (
                      <div className="lecture-concept__practice">
                        <p className="lecture-concept__eyebrow">Try it yourself</p>
                        {conceptQuestions.map((question) => (
                          <PracticePrompt
                            key={question.id}
                            question={question}
                            hints={[concept.centralInsight, concept.commonMistake]}
                          />
                        ))}
                      </div>
                    ) : null}
                    <Link
                      className="lecture-concept__link"
                      to={`/courses/${data.course.code.toLowerCase()}/concepts/${concept.slug}`}
                    >
                      Open the standalone concept guide
                    </Link>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </section>

      {coursework.length ? (
        <section className="lecture-practice" aria-labelledby="lecture-practice-title">
          <header className="course-section-heading">
            <p>Continue with the official course-plan work</p>
            <h2 id="lecture-practice-title">Assigned exercises</h2>
          </header>
          <div className="lecture-practice__list">
            {coursework.map((item) => (
              <article key={item.id}>
                <div>
                  <div className="lecture-practice__meta">
                    <span className="lecture-practice__requirement">{item.requirement}</span>
                    {item.date ? (
                      <time dateTime={`${item.date}${item.time ? `T${item.time}` : ""}`}>
                        Due {formatStudyDateLong(item.date)}{item.time ? ` at ${item.time}` : ""}
                      </time>
                    ) : null}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                {item.materials.length ? (
                  <dl>
                    {item.materials.map((material) => (
                      <div key={`${material.title}-${material.section ?? ""}`}>
                        <dt>
                          {material.url ? (
                            <a href={material.url} target="_blank" rel="noreferrer">
                              {material.title}
                            </a>
                          ) : material.title}
                        </dt>
                        <dd>
                          {material.section ?? (material.page ? `Page ${material.page}` : "Course material")}
                          {material.section && material.page ? ` · Page ${material.page}` : ""}
                          {material.exercises ? ` · Exercises ${material.exercises}` : ""}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="lecture-sources" aria-labelledby="lecture-sources-title">
        <header className="course-section-heading">
          <p>References for the concepts and examples</p>
          <h2 id="lecture-sources-title">Sources</h2>
        </header>
        <SourceLinks sources={sources} />
      </section>

      {previousLecture || nextLecture ? (
        <nav className="lecture-pagination" aria-label="Lecture navigation">
          {previousLecture ? (
            <Link to={`/courses/${data.course.code.toLowerCase()}/lectures/${previousLecture.slug}`}>
              <span>Previous lecture</span>
              <strong>{previousLecture.title}</strong>
            </Link>
          ) : null}
          {nextLecture ? (
            <Link className="lecture-pagination__next" to={`/courses/${data.course.code.toLowerCase()}/lectures/${nextLecture.slug}`}>
              <span>Next lecture</span>
              <strong>{nextLecture.title}</strong>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
