import { Children, isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { ConceptResponse } from "../../domain/api";
import { getConcept } from "../api";
import { PageError } from "../components/PageError";
import { SourceLinks } from "../components/SourceLinks";
import { ReadingPosition, type ReadingSection } from "../components/course/ReadingPosition";

// shortcut: authored guide H2s are unique plain text; use a Markdown heading
// visitor if guides gain duplicate or formatted headings.
function guideAnchor(text: string) {
  const slug = text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `guide-${slug}`;
}

function textOf(node: ReactNode): string {
  return Children.toArray(node).map((child) =>
    typeof child === "string" || typeof child === "number" ? String(child)
      : isValidElement<{ children?: ReactNode }>(child) ? textOf(child.props.children) : "",
  ).join("");
}

function guideSections(body: string): ReadingSection[] {
  return [...body.matchAll(/^## +(.+?)\s*$/gm)].map(([, heading]) => ({
    id: guideAnchor(heading),
    // The contents keep the topic; the lecture range stays on the heading itself.
    label: heading.split(" · ")[0],
  }));
}

const guideComponents = {
  h2: ({ children }: { children?: ReactNode }) => <h2 id={guideAnchor(textOf(children))}>{children}</h2>,
};

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
  const sections = useMemo(() => data ? [
    ...guideSections(data.concept.body),
    { id: "guide-sources", label: "Sources and dates" },
  ] : [], [data]);
  if (error) return <PageError title={`${label} unavailable`} message="Open the course to browse its lectures and assessment information." linkTo={`/courses/${courseCode}`} linkLabel="Open course" />;
  if (!data) return <p className="loading">Loading {label.toLowerCase()}…</p>;
  return <article className="page-column exam-guide-page">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link to={`/courses/${courseCode}`}>{data.course.code}</Link><span aria-hidden="true">/</span><span>{label}</span></nav>
    <header className="concept-heading"><p className="page-kicker">{review ? "Authored revision · Session date unconfirmed" : "Exam preparation"}</p><h1>{data.concept.title}</h1><p className="lead">{data.concept.summary}</p></header>
    <nav className="course-outline-links" aria-label="Revision resources"><Link to={`/practice?course=${courseCode}`}>Practise questions</Link><Link to={`/courses/${courseCode}#course-lectures`}>All lectures</Link>{review ? <Link to={`/courses/${courseCode}/exam`}>Exam guide</Link> : <Link to="/deadlines">Exam dates and sources</Link>}</nav>
    <div className="lesson-reader">
      <ReadingPosition sections={sections} kind={review ? "review" : "guide"} />
      <div className="lesson-reader__content">
        <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={guideComponents}>{data.concept.body}</ReactMarkdown></div>
        <details id="guide-sources" className="course-reference"><summary>Sources and verification dates</summary><SourceLinks sources={data.sources} /></details>
      </div>
    </div>
  </article>;
}
