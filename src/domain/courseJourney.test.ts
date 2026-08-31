import { describe, expect, it } from "vitest";
import type { Assessment, CourseSession, Coursework } from "./schemas";
import { buildCourseJourney } from "./courseJourney";

function session(overrides: Partial<CourseSession> = {}): CourseSession {
  return {
    id: "session:sf1690:exercise-01",
    courseId: "course:sf1690",
    slug: "exercise-01",
    kind: "exercise",
    sequence: 2,
    title: "Exercise session 1",
    week: 35,
    courseworkIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
    ...overrides,
  };
}

function coursework(overrides: Partial<Coursework> = {}): Coursework {
  return {
    id: "coursework:sf1690:exercise-01",
    courseId: "course:sf1690",
    slug: "exercise-01",
    kind: "exercise",
    sequence: 2,
    title: "Exercise session 1",
    week: 35,
    requirement: "recommended",
    description: "Recommended exercises.",
    materials: [],
    sessionIds: [],
    lectureIds: [],
    conceptIds: [],
    assessmentIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
    ...overrides,
  };
}

function assessment(overrides: Partial<Assessment> = {}): Assessment {
  return {
    id: "assessment:sf1690:ten1",
    courseId: "course:sf1690",
    slug: "ten1",
    code: "TEN1",
    title: "Written examination",
    kind: "written-exam",
    credits: 6,
    compulsory: true,
    description: "Written examination.",
    outcomeIds: [],
    conceptIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
    ...overrides,
  };
}

describe("buildCourseJourney", () => {
  it("groups exact-date and week-only items without inventing dates", () => {
    const groups = buildCourseJourney({
      sessions: [
        session({
          id: "session:sf1690:lecture-01",
          slug: "lecture-01",
          kind: "lecture",
          title: "Lecture 1",
          date: "2026-08-24",
          week: 35,
          sequence: 1,
        }),
        session({
          id: "session:sf1690:lecture-02",
          slug: "lecture-02",
          kind: "lecture",
          title: "Lecture 2",
          date: undefined,
          week: 35,
          sequence: 3,
        }),
      ],
      coursework: [],
      assessments: [assessment({ date: undefined })],
    });

    expect(groups[0]).toMatchObject({ week: 35, label: "Week 35" });
    expect(groups[0].items.map((item) => item.entityId)).toEqual([
      "session:sf1690:lecture-01",
      "session:sf1690:lecture-02",
    ]);
    expect(groups.at(-1)).toMatchObject({ label: "Not yet scheduled" });
    expect(groups.at(-1)?.items[0]).not.toHaveProperty("date");
  });

  it("does not duplicate coursework already linked to a session", () => {
    const groups = buildCourseJourney({
      sessions: [
        session({ courseworkIds: ["coursework:sf1690:exercise-01"] }),
      ],
      coursework: [
        coursework({ sessionIds: ["session:sf1690:exercise-01"] }),
      ],
      assessments: [],
    });

    expect(groups.flatMap((group) => group.items)).toHaveLength(1);
  });

  it("derives an ISO week from an exact date when no week is supplied", () => {
    const groups = buildCourseJourney({
      sessions: [],
      coursework: [coursework({ date: "2026-09-07", week: undefined })],
      assessments: [],
    });

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ week: 37, label: "Week 37" });
  });
});
