import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { ConceptResponse } from "../../domain/api";
import { getConcept, MissingEntityError } from "../api";
import { ExplainerRenderer } from "../components/ExplainerRenderer";
import { ConceptDiagram } from "../components/ConceptDiagram";
import { DefinitionBoard } from "../components/DefinitionBoard";
import { SectionMarker, StudyMark } from "../components/StudyMark";
import { SourceLinks } from "../components/SourceLinks";
import { formatStudyDate } from "../format";
import { PageError } from "../components/PageError";
import { PracticePrompt } from "../components/PracticePrompt";
import { BooleanFormsDiagram, StringIndexDiagram } from "../components/SystemsDiagram";

function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ p: ({ children: content }) => <>{content}</> }}
    >
      {children}
    </ReactMarkdown>
  );
}

export function ConceptPage() {
  const { courseCode = "", conceptSlug = "" } = useParams();
  const [data, setData] = useState<ConceptResponse>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    let active = true;
    getConcept(courseCode, conceptSlug)
      .then((result) => active && setData(result))
      .catch((cause) => active && setError(cause));
    return () => {
      active = false;
    };
  }, [courseCode, conceptSlug]);

  if (error instanceof MissingEntityError) {
    return <PageError title="Concept not found." message="This concept is not in the course guide." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }
  if (error) {
    return <PageError title="Unable to load this concept." message="Refresh the page to try again." linkTo={`/courses/${courseCode}`} linkLabel="Open the course" />;
  }
  if (!data) return <p className="loading">Loading concept…</p>;

  const { concept, course } = data;
  const chatgptAppUrl = import.meta.env.VITE_CHATGPT_APP_URL?.trim();
  let sectionCount = 0;
  const nextRegister = () => String(++sectionCount).padStart(2, "0");

  return (
    <article className="concept-page page-column">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={`/courses/${course.code.toLowerCase()}`}>{course.code}</Link>
        <span aria-hidden="true">/</span>
        <span>{concept.title}</span>
      </nav>
      <header className="concept-heading">
        <StudyMark kind="concept" className="page-kicker">Concept guide</StudyMark>
        <h1>{concept.title}</h1>
        <p className="lead"><InlineMarkdown>{concept.summary}</InlineMarkdown></p>
        <div className="context-line">
          <StudyMark kind="outcome">
            {data.outcomes.length
              ? `${data.outcomes.length} curriculum outcome${data.outcomes.length === 1 ? "" : "s"}`
              : "No linked course outcome"}
          </StudyMark>
          {data.lectures.length ? (
            <Link
              className="context-line__link"
              to={`/courses/${course.code.toLowerCase()}/lectures/${data.lectures[0].slug}`}
            >
              <StudyMark kind="lecture">
                {data.lectures.length} lecture{data.lectures.length === 1 ? "" : "s"}
              </StudyMark>
            </Link>
          ) : (
            <StudyMark kind="lecture">No linked lecture</StudyMark>
          )}
        </div>
      </header>

      {data.definitions.length ? (
        <DefinitionBoard register={nextRegister()} definitions={data.definitions} />
      ) : null}

      <section className="registered" aria-labelledby="primary-visual-title">
        <SectionMarker kind="explainer" number={nextRegister()} />
        <h2 id="primary-visual-title">See the idea</h2>
        <div className="registered-body">
          <div className="figure-frame">
            {data.explainers[0] ? (
              <ExplainerRenderer spec={data.explainers[0]} mode="preview" />
            ) : concept.slug === "boolean-equations-and-algebra" ? (
              <BooleanFormsDiagram mode="preview" />
            ) : concept.slug === "characters-and-strings" ? (
              <StringIndexDiagram mode="preview" />
            ) : (
              <ConceptDiagram slug={concept.slug} />
            )}
          </div>
          {data.explainers[0] ? (
            <Link className="figure-link" to={`/visuals/${data.explainers[0].slug}`}>
              Open the interactive visual
            </Link>
          ) : null}
        </div>
      </section>

      <section className="registered" aria-labelledby="explanation-title">
        <SectionMarker kind="explanation" number={nextRegister()} />
        <h2 id="explanation-title">Explanation</h2>
        <div className="registered-body">
          <p className="insight">
            <strong>Central insight.</strong>{" "}
            <InlineMarkdown>
              {concept.centralInsight ?? concept.summary}
            </InlineMarkdown>
          </p>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {concept.body}
            </ReactMarkdown>
          </div>
          {data.examples.length ? (
            <div className="pedagogy-list">
              <h3>Worked examples</h3>
              {data.examples.map((example) => (
                <article key={example.id} id={`example-${example.slug}`}>
                  <h4>{example.title}</h4>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {example.body}
                  </ReactMarkdown>
                </article>
              ))}
            </div>
          ) : null}
          <aside className="common-mistake">
            <h3>Common mistake</h3>
            <p>
              <InlineMarkdown>
                {concept.commonMistake ??
                  "Do not skip the definition or its assumptions when applying a rule."}
              </InlineMarkdown>
            </p>
          </aside>
        </div>
      </section>

      <section className="registered" aria-labelledby="verify-title">
        <SectionMarker kind="check" number={nextRegister()} />
        <h2 id="verify-title">Check your understanding</h2>
        <div className="registered-body">
          <p className="verify-prompt">
            <InlineMarkdown>
              {concept.verifyPrompt ??
                "Explain the main idea in your own words, then test it on one example."}
            </InlineMarkdown>
          </p>
          {data.questions.length ? (
            <div className="practice-list">
              <h3>Self-check</h3>
              {data.questions.map((question) => (
                <PracticePrompt
                  key={question.id}
                  question={question}
                  hints={[concept.centralInsight, concept.commonMistake]}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <footer className="source-footer">
        <p className="chatgpt-handoff">
          <strong>Ask ChatGPT</strong>
          {chatgptAppUrl ? (
            <a href={chatgptAppUrl} rel="noreferrer" target="_blank">Open KTH Study in ChatGPT</a>
          ) : (
            <span>The official KTH Study app link will appear here after launch.</span>
          )}
        </p>
        <div className="source-summary">
          <StudyMark kind="date">Checked {formatStudyDate(concept.lastChecked)}</StudyMark>
        </div>
        <SourceLinks sources={data.sources} />
      </footer>
    </article>
  );
}
