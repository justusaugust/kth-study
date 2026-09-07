import type { CourseResponse } from "../../domain/api";
import { formatStudyDate } from "../format";

type Source = CourseResponse["sources"][number];

export function SourceLinks({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;

  return (
    <ul className="source-link-list">
      {sources.map((source) => {
        const description = <span className="source-link-list__copy">
          <strong>{source.title}</strong>{" "}
          {source.locator ? <><span>{source.locator}</span>{" "}</> : null}
          <small>{source.url ? (source.url.startsWith("https://canvas.kth.se/") ? "Canvas · Sign-in required" : "Open source") : "No public document link"} · Checked {formatStudyDate(source.lastChecked)}</small>
        </span>;
        return (
        <li key={source.id}>
          {source.url ? (
            <a href={source.url} target="_blank" rel="noreferrer">
              {description}
              <span className="source-link-list__arrow" aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="source-link-list__local">
              {description}
            </span>
          )}
        </li>
      );})}
    </ul>
  );
}
