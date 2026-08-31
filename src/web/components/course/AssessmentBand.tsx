import type { CSSProperties } from "react";
import type { Assessment } from "../../../domain";
import { formatStudyDate } from "../../format";

export function AssessmentBand({
  courseCredits,
  assessments,
}: {
  courseCredits: number;
  assessments: Assessment[];
}) {
  const verified = assessments.reduce((total, item) => total + item.credits, 0);
  const unallocated = Math.max(0, courseCredits - verified);

  return (
    <section
      className="assessment-overview"
      id="course-assessment"
      aria-labelledby="assessment-title"
    >
      <h2 id="assessment-title">Assessment</h2>
      {assessments.length ? (
        <>
          <div
            className="assessment-band"
            aria-label={`${verified} of ${courseCredits} credits verified`}
          >
            {assessments.map((assessment) => (
              <span
                key={assessment.id}
                className="assessment-band__segment"
                style={{
                  "--share": assessment.credits / courseCredits,
                } as CSSProperties}
              />
            ))}
            {unallocated > 0 ? (
              <span
                className="assessment-band__segment assessment-band__segment--unverified"
                style={{ "--share": unallocated / courseCredits } as CSSProperties}
              />
            ) : null}
          </div>
          <ul className="assessment-list">
            {assessments.map((assessment) => (
              <li key={assessment.id} id={`assessment-${assessment.slug}`}>
                <strong>{assessment.code}</strong>
                <span>{assessment.title}</span>
                <span>{assessment.credits} ECTS</span>
                {assessment.date ? <time dateTime={assessment.date}>{formatStudyDate(assessment.date)}</time> : null}
              </li>
            ))}
            {unallocated > 0 ? (
              <li className="assessment-list__unverified">
                <strong>Not yet verified</strong>
                <span>{unallocated} ECTS</span>
              </li>
            ) : null}
          </ul>
        </>
      ) : (
        <p className="course-empty-note">Assessment details have not been verified yet.</p>
      )}
    </section>
  );
}
