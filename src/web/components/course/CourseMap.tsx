import { useState } from "react";
import { Link } from "react-router-dom";
import type { Concept, CurriculumOutcome } from "../../../domain";

function conceptBelongsToOutcome(
  concept: Concept,
  outcome: CurriculumOutcome,
): boolean {
  if (concept.outcomeIds.includes(outcome.id)) return true;

  return [...concept.relationships, ...outcome.relationships].some(
    (relationship) =>
      (relationship.from === outcome.id && relationship.to === concept.id) ||
      (relationship.from === concept.id && relationship.to === outcome.id),
  );
}

function ConceptLink({
  concept,
  courseCode,
}: {
  concept: Concept;
  courseCode: string;
}) {
  return (
    <li data-evidence={concept.evidenceStatus ?? "curriculum"}>
      <Link to={`/courses/${courseCode}/concepts/${concept.slug}`}>
        {concept.title}
      </Link>
    </li>
  );
}

function OutcomeDisclosure({ description }: { description: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="outcome-disclosure">
      <button
        type="button"
        className="outcome-disclosure__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Hide full outcome" : "Show full outcome"}
      </button>
      <div className="outcome-disclosure__panel" data-open={open || undefined}>
        <div>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export function CourseMap({
  courseCode,
  outcomes,
  concepts,
}: {
  courseCode: string;
  outcomes: CurriculumOutcome[];
  concepts: Concept[];
}) {
  const linkedConceptIds = new Set<string>();
  const rows = outcomes.map((outcome) => {
    const related = concepts.filter((concept) =>
      conceptBelongsToOutcome(concept, outcome),
    );
    related.forEach((concept) => linkedConceptIds.add(concept.id));
    return { outcome, concepts: related };
  });
  const unlinkedConcepts = concepts.filter(
    (concept) => !linkedConceptIds.has(concept.id),
  );

  if (!outcomes.length && !concepts.length) return null;

  return (
    <section className="course-map" id="course-map" aria-labelledby="course-map-title">
      <header className="course-section-heading">
        <p>What the course asks of you</p>
        <h2 id="course-map-title">Course map</h2>
      </header>
      <ol className="course-map__rows">
        {rows.map(({ outcome, concepts: related }, index) => (
          <li className="course-map__row" key={outcome.id}>
            <span className="course-map__index" aria-hidden="true">
              {index + 1}
            </span>
            <div className="course-map__outcome">
              <h3>{outcome.title}</h3>
              <OutcomeDisclosure description={outcome.description} />
              <p className="course-map__label">Built through</p>
              {related.length ? (
                <ul className="course-map__concepts">
                  {related.map((concept) => (
                    <ConceptLink
                      key={concept.id}
                      concept={concept}
                      courseCode={courseCode}
                    />
                  ))}
                </ul>
              ) : (
                <p className="course-empty-note">
                  No concepts are linked to this outcome yet.
                </p>
              )}
            </div>
          </li>
        ))}
        {unlinkedConcepts.length ? (
          <li className="course-map__row course-map__row--supporting">
            <span className="course-map__index" aria-hidden="true">
              {rows.length + 1}
            </span>
            <div className="course-map__outcome">
              <h3>Supporting material</h3>
              <p className="course-map__supporting-note">
                Concepts that support the course without mapping to one listed outcome.
              </p>
              <p className="course-map__label">Explore</p>
              <ul className="course-map__concepts">
                {unlinkedConcepts.map((concept) => (
                  <ConceptLink
                    key={concept.id}
                    concept={concept}
                    courseCode={courseCode}
                  />
                ))}
              </ul>
            </div>
          </li>
        ) : null}
      </ol>
    </section>
  );
}
