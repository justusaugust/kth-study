import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ExplainerResponse } from "../../domain/api";
import { getExplainer, MissingEntityError } from "../api";
import { ExplainerRenderer } from "../components/ExplainerRenderer";
import { StudyMark } from "../components/StudyMark";
import { formatStudyDate } from "../format";
import { SourceLinks } from "../components/SourceLinks";
import { PageError } from "../components/PageError";

export function VisualPage() {
  const { visualSlug = "" } = useParams();
  const [data, setData] = useState<ExplainerResponse>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    let active = true;
    getExplainer(visualSlug)
      .then((result) => active && setData(result))
      .catch((cause) => active && setError(cause));
    return () => {
      active = false;
    };
  }, [visualSlug]);

  if (error instanceof MissingEntityError) {
    return <PageError title="Visual not found." message="This visual is not in the atlas." linkTo="/visuals" linkLabel="Open the visual atlas" />;
  }
  if (error) {
    return <PageError title="Unable to load this visual." message="Refresh the page to try again." linkTo="/visuals" linkLabel="Open the visual atlas" />;
  }
  if (!data) return <p className="loading">Loading visual…</p>;

  return (
    <article className="visual-page page-column">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={`/courses/${data.course.code.toLowerCase()}`}>{data.course.code}</Link>
        <span aria-hidden="true">/</span>
        <span>Visual atlas</span>
      </nav>
      <StudyMark kind="explainer" className="page-kicker">
        {data.explainer.kind.replace(/-/g, " ")}
      </StudyMark>
      <h1>{data.explainer.title}</h1>
      <p className="lead">{data.explainer.accessibleSummary}</p>
      <ExplainerRenderer spec={data.explainer} mode="full" />
      <section className="visual-context" aria-labelledby="visual-context-title">
        <h2 id="visual-context-title">Context</h2>
        <div className="visual-meta">
          <StudyMark kind="concept">
            {data.concepts.length} concept{data.concepts.length === 1 ? "" : "s"}
          </StudyMark>
          <StudyMark kind="date">Checked {formatStudyDate(data.explainer.lastChecked)}</StudyMark>
        </div>
        <SourceLinks sources={data.sources} />
      </section>
      <div className="context-links">
        {data.concepts.map((concept) => (
          <Link key={concept.id} to={`/courses/${data.course.code.toLowerCase()}/concepts/${concept.slug}`}>
            Read {concept.title}
          </Link>
        ))}
        <Link to={`/courses/${data.course.code.toLowerCase()}`}>Back to {data.course.code}</Link>
      </div>
    </article>
  );
}
