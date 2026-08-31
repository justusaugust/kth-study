import type { CourseResponse } from "../../domain/api";

type Source = CourseResponse["sources"][number];

export function SourceLinks({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;

  return (
    <ul className="source-link-list">
      {sources.map((source) => (
        <li key={source.id}>
          {source.url ? (
            <a href={source.url} target="_blank" rel="noreferrer">
              <span>{source.title}</span>
              <span className="source-link-list__arrow" aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="source-link-list__local">
              <span>{source.title}</span>
              <small>Stored locally</small>
            </span>
          )}
          {source.locator ? <p>{source.locator}</p> : null}
        </li>
      ))}
    </ul>
  );
}
