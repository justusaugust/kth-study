import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { ConceptResponse } from "../../domain/api";
import { getConcept } from "../api";
import { PageError } from "../components/PageError";
import { SourceLinks } from "../components/SourceLinks";

export function ExamGuidePage({ guideSlug = "exam-revision-guide" }: { guideSlug?: "exam-revision-guide" | "course-review" }) {
  const { courseCode = "" } = useParams();
  const review = guideSlug === "course-review";
  const label = review ? "Course review" : "Exam guide";
  const [data, setData] = useState<ConceptResponse>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setData(undefined); setError(false);
    getConcept(courseCode, guideSlug).then(value => { if (active) setData(value); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [courseCode, guideSlug]);
  if (error) return <PageError title={`${label} unavailable`} message="Open the course to browse its lectures and assessment information." linkTo={`/courses/${courseCode}`} linkLabel="Open course" />;
  if (!data) return <p className="loading">Loading {label.toLowerCase()}…</p>;
  return <article className="page-column exam-guide-page">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link to={`/courses/${courseCode}`}>{data.course.code}</Link><span aria-hidden="true">/</span><span>{label}</span></nav>
    <header className="concept-heading"><p className="page-kicker">{review ? "Authored revision · Session date unconfirmed" : "Exam preparation"}</p><h1>{data.concept.title}</h1><p className="lead">{data.concept.summary}</p></header>
    <nav className="course-outline-links" aria-label="Revision resources"><Link to={`/practice?course=${courseCode}`}>Practise questions</Link><Link to={`/courses/${courseCode}#course-lectures`}>All lectures</Link>{review ? <Link to={`/courses/${courseCode}/exam`}>Exam guide</Link> : <Link to="/deadlines">Exam dates and sources</Link>}</nav>
    <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{data.concept.body}</ReactMarkdown></div>
    <details className="course-reference"><summary>Sources and verification dates</summary><SourceLinks sources={data.sources} /></details>
  </article>;
}
