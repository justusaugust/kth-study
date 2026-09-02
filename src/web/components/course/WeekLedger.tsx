import type {
  CourseJourneyGroup,
  CourseJourneyItem,
  CourseSession,
  Coursework,
} from "../../../domain";
import { currentStudyDate, formatStudyDate } from "../../format";

const requirementLabels: Record<Coursework["requirement"], string> = {
  required: "Required",
  recommended: "Recommended",
  scheduled: "Scheduled",
  optional: "Optional",
};

function kindLabel(kind: string): string {
  return kind.replaceAll("-", " ");
}

function slugOf(entityId: string): string {
  return entityId.split(":").at(-1) ?? entityId;
}

function materialLine(material: Coursework["materials"][number]): string {
  return [
    material.title,
    material.section ? `Section ${material.section}` : undefined,
    material.page ? `p. ${material.page}` : undefined,
    material.exercises ? `Exercises ${material.exercises}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

function courseworkDescription(coursework: Coursework): string {
  const label = requirementLabels[coursework.requirement];
  const repeatedPrefix = new RegExp(`^${label}\\s+`, "i");
  return coursework.description.replace(repeatedPrefix, "");
}

export function isoWeekOf(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

export function resolveCurrentWeek(
  groups: CourseJourneyGroup[],
  courseStart?: string,
  courseEnd?: string,
  today = new Date(),
): number | undefined {
  if (!courseStart || !courseEnd) return undefined;
  const iso = currentStudyDate(today);
  if (iso < courseStart || iso > courseEnd) return undefined;
  const week = isoWeekOf(iso);
  return groups.some((group) => group.week === week) ? week : undefined;
}

function CourseworkDetail({
  coursework,
  anchored,
}: {
  coursework: Coursework;
  anchored: boolean;
}) {
  return (
    <div
      className="ledger-work"
      id={anchored ? `coursework-${coursework.slug}` : undefined}
    >
      <p className="ledger-work__note">
        <span data-requirement={coursework.requirement}>
          {requirementLabels[coursework.requirement]}
        </span>{" "}
        — {courseworkDescription(coursework)}
      </p>
      {coursework.materials.length ? (
        <ul className="ledger-work__materials">
          {coursework.materials.map((material, index) => (
            <li key={`${coursework.id}:material:${index}`}>
              {materialLine(material)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function LedgerEntry({
  item,
  session,
  courseworkById,
  todayIso,
}: {
  item: CourseJourneyItem;
  session?: CourseSession;
  courseworkById: Map<string, Coursework>;
  todayIso: string;
}) {
  const slug = slugOf(item.entityId);
  const linkedWork =
    session?.courseworkIds
      .map((id) => courseworkById.get(id))
      .filter((work): work is Coursework => Boolean(work)) ?? [];
  const standalone =
    item.entityType === "coursework" ? courseworkById.get(item.entityId) : undefined;
  const lectureSlug = session?.lectureId ? slugOf(session.lectureId) : undefined;
  const lectureAvailability = item.kind === "lecture"
    ? lectureSlug
      ? "available"
      : item.date && item.date > todayIso
        ? "upcoming"
        : "unavailable"
    : undefined;
  const courseCode = session ? slugOf(session.courseId) : undefined;
  const anchorId =
    item.entityType === "session"
      ? `session-${slug}`
      : item.entityType === "coursework"
        ? `coursework-${slug}`
        : undefined;

  return (
    <li
      className="ledger-entry"
      id={anchorId}
      data-kind={item.kind}
      data-entity={item.entityType}
      data-availability={lectureAvailability}
    >
      <span className="ledger-entry__mark" aria-hidden="true" />
      <div className="ledger-entry__body">
        <div className="ledger-entry__head">
          <h4>
            {lectureSlug ? (
              <a href={`/courses/${courseCode}/lectures/${lectureSlug}`}>
                {item.title}
              </a>
            ) : item.entityType === "assessment" ? (
              <a href={`#assessment-${slug}`}>{item.title}</a>
            ) : (
              item.title
            )}
          </h4>
          <span className="ledger-entry__kind">
            {lectureAvailability === "available"
              ? "In archive"
              : lectureAvailability === "upcoming"
                ? "Upcoming"
                : lectureAvailability === "unavailable"
                  ? "Not in archive"
                  : kindLabel(item.kind)}
          </span>
          {item.date ? (
            <time dateTime={item.date}>{formatStudyDate(item.date)}</time>
          ) : null}
        </div>
        {linkedWork.map((work) => (
          <CourseworkDetail key={work.id} coursework={work} anchored />
        ))}
        {standalone ? (
          <CourseworkDetail coursework={standalone} anchored={false} />
        ) : null}
      </div>
    </li>
  );
}

export function WeekLedger({
  groups,
  sessions,
  coursework,
  courseStart,
  courseEnd,
  today,
}: {
  groups: CourseJourneyGroup[];
  sessions: CourseSession[];
  coursework: Coursework[];
  courseStart?: string;
  courseEnd?: string;
  today?: Date;
}) {
  if (!groups.length) return null;

  const sessionById = new Map(sessions.map((session) => [session.id, session]));
  const courseworkById = new Map(coursework.map((work) => [work.id, work]));
  const currentWeek = resolveCurrentWeek(groups, courseStart, courseEnd, today);
  const todayIso = currentStudyDate(today ?? new Date());

  return (
    <section
      className="week-ledger"
      id="week-ledger"
      aria-labelledby="week-ledger-title"
    >
      <header className="course-section-heading">
        <p>Teaching, practice and assessment, week by week</p>
        <h2 id="week-ledger-title">Week ledger</h2>
      </header>
      <ol className="week-ledger__weeks">
        {groups.map((group) => (
          <li
            className="week-ledger__week"
            key={group.key}
            id={`ledger-${group.key}`}
            data-current={
              group.week !== undefined && group.week === currentWeek
                ? "true"
                : undefined
            }
          >
            <details open={group.week === currentWeek}>
            <summary className="week-ledger__register">
              {group.week ? (
                <>
                  <span className="week-ledger__register-word">Week</span>
                  <span className="week-ledger__register-number">
                    {group.week}
                  </span>
                  {group.week === currentWeek ? (
                    <span className="week-ledger__now">This week</span>
                  ) : null}
                </>
              ) : (
                <span className="week-ledger__register-word">
                  Not yet scheduled
                </span>
              )}
              <span className="week-ledger__count">{group.items.length}</span>
            </summary>
            <ol className="week-ledger__entries">
              {group.items.map((item) => (
                <LedgerEntry
                  key={item.entityId}
                  item={item}
                  session={
                    item.entityType === "session"
                      ? sessionById.get(item.entityId)
                      : undefined
                  }
                  courseworkById={courseworkById}
                  todayIso={todayIso}
                />
              ))}
            </ol>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
