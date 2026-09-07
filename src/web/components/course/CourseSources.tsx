import type { CourseResponse } from "../../../domain";
import { SourceLinks } from "../SourceLinks";

export function CourseSources({ sources }: { sources: CourseResponse["sources"] }) {
  if (!sources.length) return null;
  return <section className="course-sources" id="course-sources" aria-labelledby="course-sources-title">
    <h2 id="course-sources-title">Sources</h2>
    <SourceLinks sources={sources} />
  </section>;
}
