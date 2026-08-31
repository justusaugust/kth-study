import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { Definition } from "../../domain";
import { SectionMarker, StudyMark } from "./StudyMark";

function MathMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {children}
    </ReactMarkdown>
  );
}

export function DefinitionBoard({
  definitions,
  register,
}: {
  definitions: Definition[];
  register?: string;
}) {
  if (!definitions.length) return null;
  return (
    <section
      className="definition-board registered"
      aria-labelledby="definitions-title"
    >
      {register ? (
        <SectionMarker kind="definition" number={register} />
      ) : null}
      <h2 id="definitions-title">Key definitions</h2>
      <div className="registered-body definition-list">
        {definitions.map((definition) => (
          <article id={`definition-${definition.slug}`} key={definition.id}>
            <div className="definition-heading" data-entity-mark="definition">
              <h3>{definition.term}</h3>
            </div>
            {definition.notation ? (
              <div className="definition-notation">
                <StudyMark kind="notation">Notation</StudyMark>
                <MathMarkdown>{definition.notation}</MathMarkdown>
              </div>
            ) : null}
            <MathMarkdown>{definition.statement}</MathMarkdown>
            {definition.interpretation ? (
              <div className="definition-interpretation">
                <StudyMark kind="interpretation">In words</StudyMark>
                <MathMarkdown>{definition.interpretation}</MathMarkdown>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
