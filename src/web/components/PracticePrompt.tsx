import { useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { Question } from "../../domain";

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {children}
    </ReactMarkdown>
  );
}

export function PracticePrompt({
  question,
  hints = [],
}: {
  question: Question;
  hints?: Array<string | undefined>;
}) {
  const attemptId = useId();
  const [attempt, setAttempt] = useState("");
  const [writing, setWriting] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const availableHints = [...new Set(hints.filter((hint): hint is string => Boolean(hint)))];
  const changed = writing || attempt.length > 0 || hintCount > 0 || solutionOpen;

  function reset() {
    setAttempt("");
    setWriting(false);
    setHintCount(0);
    setSolutionOpen(false);
  }

  return (
    <article className="practice-prompt" id={`question-${question.slug}`}>
      <header>
        <span>Self-check</span>
        <h4>{question.title}</h4>
      </header>
      <div className="practice-prompt__question">
        <Markdown>{question.body}</Markdown>
      </div>
      {writing ? (
        <>
          <label htmlFor={attemptId}>Work it out</label>
          <textarea
            id={attemptId}
            value={attempt}
            onChange={(event) => setAttempt(event.target.value)}
            placeholder="Write your reasoning here before revealing the solution."
            rows={4}
            autoFocus
          />
        </>
      ) : null}
      <div className="practice-prompt__controls">
        {!writing ? <button type="button" onClick={() => setWriting(true)}>Write your reasoning</button> : null}
        {hintCount < availableHints.length ? (
          <button type="button" onClick={() => setHintCount((count) => count + 1)}>
            {hintCount ? "Another hint" : "Show a hint"}
          </button>
        ) : null}
        {question.answer ? (
          <button
            type="button"
            aria-expanded={solutionOpen}
            onClick={() => setSolutionOpen((open) => !open)}
          >
            {solutionOpen ? "Hide solution" : "Reveal solution"}
          </button>
        ) : null}
        {changed ? <button type="button" onClick={reset}>Reset</button> : null}
      </div>
      {hintCount ? (
        <div className="practice-prompt__hints" aria-live="polite">
          {availableHints.slice(0, hintCount).map((hint, index) => (
            <div key={hint}>
              <strong>Hint {String(index + 1).padStart(2, "0")}</strong>
              <Markdown>{hint}</Markdown>
            </div>
          ))}
        </div>
      ) : null}
      {solutionOpen && question.answer ? (
        <div className="practice-prompt__solution">
          <strong>Solution</strong>
          <Markdown>{question.answer}</Markdown>
        </div>
      ) : null}
    </article>
  );
}
