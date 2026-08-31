import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type {
  CourseJourneyGroup,
  CourseSession,
  Coursework,
} from "../../../domain";
import { WeekLedger } from "./WeekLedger";

afterEach(cleanup);

const coursework: Coursework[] = [
  {
    id: "coursework:sf1690:exercise-01",
    courseId: "course:sf1690",
    slug: "exercise-01",
    kind: "exercise",
    sequence: 2,
    title: "Exercise session 1",
    week: 35,
    requirement: "recommended",
    description: "Recommended exercises for Lecture 1.",
    materials: [
      {
        title: "Calculus",
        section: "P1",
        page: "10",
        exercises: "29, 40, 42, 44, 45",
      },
    ],
    sessionIds: ["session:sf1690:exercise-session-01"],
    lectureIds: [],
    conceptIds: [],
    assessmentIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
  {
    id: "coursework:sf1690:mini-exam-01",
    courseId: "course:sf1690",
    slug: "mini-exam-01",
    kind: "mini-exam",
    sequence: 14,
    title: "Mini-exam · Lectures 1–4",
    week: 37,
    requirement: "scheduled",
    description: "Course-plan checkpoint.",
    materials: [],
    sessionIds: [],
    lectureIds: [],
    conceptIds: [],
    assessmentIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
];

const sessions: CourseSession[] = [
  {
    id: "session:sf1690:lecture-01",
    courseId: "course:sf1690",
    slug: "lecture-01",
    kind: "lecture",
    sequence: 1,
    title: "Lecture 1 · Real numbers",
    date: "2026-08-24",
    week: 35,
    lectureId: "lecture:sf1690:2026-08-24-01",
    courseworkIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
  {
    id: "session:sf1690:exercise-session-01",
    courseId: "course:sf1690",
    slug: "exercise-session-01",
    kind: "exercise",
    sequence: 2,
    title: "Exercise session 1",
    week: 35,
    courseworkIds: ["coursework:sf1690:exercise-01"],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
  {
    id: "session:sf1690:lecture-02",
    courseId: "course:sf1690",
    slug: "lecture-02",
    kind: "lecture",
    sequence: 3,
    title: "Lecture 2 · Lines",
    date: "2026-08-31",
    week: 35,
    courseworkIds: [],
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
];

const groups: CourseJourneyGroup[] = [
  {
    key: "week-35",
    label: "Week 35",
    week: 35,
    items: [
      {
        entityId: "session:sf1690:lecture-01",
        entityType: "session",
        kind: "lecture",
        title: "Lecture 1 · Real numbers",
        url: "/courses/sf1690#session-lecture-01",
        date: "2026-08-24",
        week: 35,
        sequence: 1,
      },
      {
        entityId: "session:sf1690:exercise-session-01",
        entityType: "session",
        kind: "exercise",
        title: "Exercise session 1",
        url: "/courses/sf1690#session-exercise-session-01",
        week: 35,
        sequence: 2,
      },
      {
        entityId: "session:sf1690:lecture-02",
        entityType: "session",
        kind: "lecture",
        title: "Lecture 2 · Lines",
        url: "/courses/sf1690#session-lecture-02",
        date: "2026-08-31",
        week: 35,
        sequence: 3,
      },
    ],
  },
  {
    key: "week-37",
    label: "Week 37",
    week: 37,
    items: [
      {
        entityId: "coursework:sf1690:mini-exam-01",
        entityType: "coursework",
        kind: "mini-exam",
        title: "Mini-exam · Lectures 1–4",
        url: "/courses/sf1690#coursework-mini-exam-01",
        week: 37,
        sequence: 14,
      },
    ],
  },
  {
    key: "unscheduled",
    label: "Not yet scheduled",
    items: [
      {
        entityId: "assessment:sf1690:ten1",
        entityType: "assessment",
        kind: "written-exam",
        title: "Written examination",
        url: "/courses/sf1690#assessment-ten1",
        sequence: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
];

describe("WeekLedger", () => {
  it("merges sessions, coursework, and assessments into one chronological ledger", () => {
    render(
      <WeekLedger
        groups={groups}
        sessions={sessions}
        coursework={coursework}
        courseStart="2026-08-24"
        courseEnd="2026-10-23"
        today={new Date(Date.UTC(2026, 7, 26))}
      />,
    );

    expect(screen.getByRole("heading", { name: "Week ledger" })).toBeVisible();
    expect(screen.getByText("35")).toBeVisible();
    expect(screen.getByText("Not yet scheduled")).toBeVisible();

    const lecture = document.querySelector("#session-lecture-01");
    expect(lecture).not.toBeNull();
    expect(
      within(lecture as HTMLElement).getByRole("link", {
        name: "Lecture 1 · Real numbers",
      }),
    ).toHaveAttribute("href", "/courses/sf1690/lectures/2026-08-24-01");
    expect(lecture).toHaveAttribute("data-availability", "available");
    expect(within(lecture as HTMLElement).getByText("In archive")).toBeVisible();

    const upcomingLecture = document.querySelector("#session-lecture-02");
    expect(upcomingLecture).toHaveAttribute("data-availability", "upcoming");
    expect(within(upcomingLecture as HTMLElement).getByText("Upcoming")).toBeVisible();

    const exercise = document.querySelector("#session-exercise-session-01");
    expect(exercise).not.toBeNull();
    expect(
      within(exercise as HTMLElement).getByText("Recommended", {
        selector: "[data-requirement]",
      }),
    ).toBeVisible();
    expect(exercise).toHaveTextContent("Recommended — exercises for Lecture 1.");
    expect(exercise).not.toHaveTextContent("Recommended — Recommended");
    expect(
      within(exercise as HTMLElement).getByText(/29, 40, 42, 44, 45/),
    ).toBeVisible();
    expect(
      document.querySelector("#session-exercise-session-01 #coursework-exercise-01"),
    ).not.toBeNull();

    expect(screen.getByText(/Scheduled/)).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Written examination" }),
    ).toHaveAttribute("href", "#assessment-ten1");

    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
    expect(document.querySelectorAll(".week-ledger svg")).toHaveLength(0);
    expect(screen.queryByText(/undefined|null/)).not.toBeInTheDocument();
  });

  it("marks the current teaching week from the calendar without implying progress", () => {
    render(
      <WeekLedger
        groups={groups}
        sessions={sessions}
        coursework={coursework}
        courseStart="2026-08-24"
        courseEnd="2026-10-23"
        today={new Date(Date.UTC(2026, 7, 26))}
      />,
    );

    expect(document.querySelector("#ledger-week-35")).toHaveAttribute(
      "data-current",
      "true",
    );
    expect(document.querySelector("#ledger-week-37")).not.toHaveAttribute(
      "data-current",
    );
    expect(screen.queryByText(/complete|done|progress/i)).not.toBeInTheDocument();
  });

  it("keeps out-of-term calendars quiet", () => {
    render(
      <WeekLedger
        groups={groups}
        sessions={sessions}
        coursework={coursework}
        courseStart="2026-08-24"
        courseEnd="2026-10-23"
        today={new Date(Date.UTC(2026, 11, 1))}
      />,
    );

    expect(document.querySelector("[data-current]")).toBeNull();
  });
});
