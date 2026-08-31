import { entityUrl } from "./ids";
import type { Assessment, CourseSession, Coursework } from "./schemas";

export interface CourseJourneyItem {
  entityId: string;
  entityType: "session" | "coursework" | "assessment";
  kind: string;
  title: string;
  url: string;
  date?: string;
  week?: number;
  sequence: number;
}

export interface CourseJourneyGroup {
  key: string;
  label: string;
  week?: number;
  items: CourseJourneyItem[];
}

function isoWeek(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function sessionItem(session: CourseSession): CourseJourneyItem {
  return {
    entityId: session.id,
    entityType: "session",
    kind: session.kind,
    title: session.title,
    url: entityUrl(session),
    ...(session.date ? { date: session.date } : {}),
    ...(session.week ?? (session.date ? isoWeek(session.date) : undefined)
      ? { week: session.week ?? isoWeek(session.date!) }
      : {}),
    sequence: session.sequence,
  };
}

function courseworkItem(coursework: Coursework): CourseJourneyItem {
  return {
    entityId: coursework.id,
    entityType: "coursework",
    kind: coursework.kind,
    title: coursework.title,
    url: entityUrl(coursework),
    ...(coursework.date ? { date: coursework.date } : {}),
    ...(coursework.week ?? (coursework.date ? isoWeek(coursework.date) : undefined)
      ? { week: coursework.week ?? isoWeek(coursework.date!) }
      : {}),
    sequence: coursework.sequence,
  };
}

function assessmentItem(assessment: Assessment): CourseJourneyItem {
  return {
    entityId: assessment.id,
    entityType: "assessment",
    kind: assessment.kind,
    title: assessment.title,
    url: entityUrl(assessment),
    ...(assessment.date
      ? { date: assessment.date, week: isoWeek(assessment.date) }
      : {}),
    sequence: Number.MAX_SAFE_INTEGER,
  };
}

function compareItems(left: CourseJourneyItem, right: CourseJourneyItem): number {
  if (left.date && right.date && left.date !== right.date) {
    return left.date.localeCompare(right.date);
  }
  if (left.date && !right.date) return -1;
  if (!left.date && right.date) return 1;
  if (left.sequence !== right.sequence) return left.sequence - right.sequence;
  return left.entityId.localeCompare(right.entityId);
}

export function buildCourseJourney({
  sessions,
  coursework,
  assessments,
}: {
  sessions: CourseSession[];
  coursework: Coursework[];
  assessments: Assessment[];
}): CourseJourneyGroup[] {
  const linkedCoursework = new Set(
    sessions.flatMap((session) => session.courseworkIds),
  );
  const items = [
    ...sessions.map(sessionItem),
    ...coursework
      .filter((item) => !linkedCoursework.has(item.id))
      .map(courseworkItem),
    ...assessments.map(assessmentItem),
  ];
  const byGroup = new Map<string, CourseJourneyItem[]>();

  for (const item of items) {
    const key = item.week ? `week-${item.week}` : "unscheduled";
    byGroup.set(key, [...(byGroup.get(key) ?? []), item]);
  }

  return [...byGroup.entries()]
    .sort(([left], [right]) => {
      if (left === "unscheduled") return 1;
      if (right === "unscheduled") return -1;
      return Number(left.slice(5)) - Number(right.slice(5));
    })
    .map(([key, groupItems]) => {
      const week = key === "unscheduled" ? undefined : Number(key.slice(5));
      return {
        key,
        label: week ? `Week ${week}` : "Not yet scheduled",
        week,
        items: groupItems.sort(compareItems),
      };
    });
}
