import { useState } from "react";
import type { CourseResponse } from "../../../domain";
import { formatStudyDate } from "../../format";
import { StudyIcon } from "../StudyMark";

/*
 * Folder shelf adapted from the Rare UI Folder interaction
 * (https://www.rareui.com/components/foldercomponent), rebuilt in-house with
 * CSS transforms only. Rare UI permits use and modification; attribution kept.
 */

const sourceKindLabels: Record<CourseResponse["sources"][number]["kind"], string> = {
  curriculum: "Official curriculum",
  "course-memo": "Course memo",
  "lecture-material": "Lecture material",
  schedule: "Schedule",
  canvas: "Canvas",
  book: "Book",
  fixture: "Fixture",
};

type Source = CourseResponse["sources"][number];

function latestChecked(sources: Source[]): string {
  return sources.reduce(
    (latest, source) => (source.lastChecked > latest ? source.lastChecked : latest),
    sources[0].lastChecked,
  );
}

function SourceFolder({
  label,
  sources,
}: {
  label: string;
  sources: Source[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = `folder-panel-${label.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`;

  return (
    <div className="source-folder" data-open={open || undefined}>
      <button
        type="button"
        className="source-folder__button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
          }
        }}
      >
        <span className="source-folder__object" aria-hidden="true">
          <span className="source-folder__card" />
          <span className="source-folder__card" />
          <span className="source-folder__flap" />
        </span>
        <span className="source-folder__tab">
          <strong>{label}</strong>
          <span className="source-folder__meta">
            {sources.length} {sources.length === 1 ? "source" : "sources"} · checked{" "}
            {formatStudyDate(latestChecked(sources))}
          </span>
        </span>
      </button>
      <div className="source-folder__panel" id={panelId} data-open={open || undefined}>
        <div>
          <ul>
            {sources.map((source) => (
              <li key={source.id}>
                <div>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                  ) : (
                    <strong>{source.title}</strong>
                  )}
                  {source.locator ? <p>{source.locator}</p> : null}
                </div>
                <time dateTime={source.lastChecked}>
                  Checked {formatStudyDate(source.lastChecked)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function CourseSources({ sources }: { sources: CourseResponse["sources"] }) {
  if (!sources.length) return null;

  const grouped = new Map<string, Source[]>();
  for (const source of sources) {
    const label = sourceKindLabels[source.kind];
    grouped.set(label, [...(grouped.get(label) ?? []), source]);
  }

  return (
    <section
      className="course-sources"
      id="course-sources"
      aria-labelledby="course-sources-title"
    >
      <header className="course-section-heading">
        <p>Books, course documents, and lecture material</p>
        <h2 id="course-sources-title">
          <StudyIcon kind="source" size={20} />
          Sources
        </h2>
      </header>
      <div className="course-sources__shelf">
        {[...grouped.entries()].map(([label, groupSources]) => (
          <SourceFolder key={label} label={label} sources={groupSources} />
        ))}
      </div>
    </section>
  );
}
