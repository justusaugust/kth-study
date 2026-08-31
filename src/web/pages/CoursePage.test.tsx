import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CoursePage } from "./CoursePage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CoursePage", () => {
  it("distinguishes a missing course from a temporary loading failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { code: "not_found" } }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/courses/unknown"]}>
        <Routes>
          <Route path="/courses/:courseCode" element={<CoursePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Course not found.");
    expect(screen.getByRole("link", { name: "Browse courses" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("presents a progressively complete course dossier in the intended order", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            course: {
              id: "course:sf1690",
              code: "SF1690",
              slug: "sf1690",
              title: "Basic Course in Mathematics",
              academicYear: "2026-27",
              period: "P1",
              summary: "Fixture course",
              credits: 6,
              language: "English",
              startDate: "2026-08-24",
              endDate: "2026-10-23",
              links: [],
              outcomeIds: [
                "outcome:sf1690:solve-and-present",
                "outcome:sf1690:read-mathematics",
              ],
              conceptIds: [],
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-24",
              confidence: "fixture",
            },
            outcomes: [
              {
                id: "outcome:sf1690:solve-and-present",
                courseId: "course:sf1690",
                slug: "solve-and-present",
                title: "Solve and present mathematical problems",
                description: "Solve and present mathematical problems.",
                relationships: [], sourceIds: [], lastChecked: "2026-08-24", confidence: "fixture",
              },
              {
                id: "outcome:sf1690:read-mathematics",
                courseId: "course:sf1690",
                slug: "read-mathematics",
                title: "Read and comprehend mathematical text",
                description: "Read and comprehend mathematical text.",
                relationships: [], sourceIds: [], lastChecked: "2026-08-24", confidence: "fixture",
              },
            ],
            lectures: [{
              id: "lecture:sf1690:2026-08-24-01",
              courseId: "course:sf1690",
              slug: "2026-08-24-01",
              title: "Lecture 1",
              date: "2026-08-24",
              summary: "The first lecture.",
              conceptIds: [],
              body: "",
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-24",
              confidence: "fixture",
            }],
            concepts: [{
              id: "concept:sf1690:quadratic-functions",
              courseId: "course:sf1690",
              slug: "quadratic-functions",
              title: "Quadratic functions",
              summary: "Understand the shape of a quadratic graph.",
              outcomeIds: ["outcome:sf1690:solve-and-present"],
              lectureIds: [],
              evidenceStatus: "curriculum",
              body: "",
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-24",
              confidence: "fixture",
            }],
            explainers: [],
            assessments: [{
              id: "assessment:sf1690:ten1",
              courseId: "course:sf1690",
              slug: "ten1",
              code: "TEN1",
              title: "Written examination",
              kind: "written-exam",
              credits: 6,
              compulsory: true,
              description: "Written examination.",
              outcomeIds: [], conceptIds: [], sourceIds: [], relationships: [],
              lastChecked: "2026-08-24", confidence: "fixture",
            }],
            sessions: [{
              id: "session:sf1690:lecture-01",
              courseId: "course:sf1690",
              slug: "lecture-01",
              kind: "lecture",
              sequence: 1,
              title: "Lecture 1",
              date: "2026-08-24",
              week: 35,
              courseworkIds: [], sourceIds: [], relationships: [],
              lastChecked: "2026-08-24", confidence: "fixture",
            }],
            coursework: [{
              id: "coursework:sf1690:exercise-01",
              courseId: "course:sf1690",
              slug: "exercise-01",
              kind: "exercise",
              sequence: 2,
              title: "Exercise session 1",
              week: 35,
              requirement: "recommended",
              description: "Recommended exercises.",
              materials: [{ title: "Calculus", section: "P1", page: "10", exercises: "29, 40" }],
              sessionIds: [], lectureIds: [], conceptIds: [], assessmentIds: [],
              sourceIds: [], relationships: [], lastChecked: "2026-08-24", confidence: "fixture",
            }],
            journey: [{
              key: "week-35",
              label: "Week 35",
              week: 35,
              items: [{
                entityId: "session:sf1690:lecture-01",
                entityType: "session",
                kind: "lecture",
                title: "Lecture 1",
                url: "/courses/sf1690#session-lecture-01",
                date: "2026-08-24",
                week: 35,
                sequence: 1,
              }],
            }],
            sources: [{
              id: "source:sf1690:official-course-page",
              courseId: "course:sf1690",
              title: "KTH official SF1690 course page",
              kind: "curriculum",
              url: "https://www.kth.se/student/kurser/kurs/SF1690?l=en",
              locator: "Course content",
              lastChecked: "2026-08-24",
              confidence: "fixture",
            }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/courses/sf1690"]}>
        <Routes>
          <Route path="/courses/:courseCode" element={<CoursePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Basic Course in Mathematics" })).toBeVisible();
    expect(screen.getAllByText("6 ECTS").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/24 Aug 2026/).length).toBeGreaterThan(0);
    expect(screen.queryByText("2026-08-24")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Lecture 1" })[0]).toHaveAttribute(
      "href",
      "/courses/sf1690/lectures/2026-08-24-01",
    );
    const sectionNames = [...document.querySelectorAll("article > section h2")].map(
      (heading) => heading.textContent?.trim(),
    );
    expect(sectionNames).toEqual([
      "Assessment",
      "Course map",
      "Week ledger",
      "Lecture archive",
      "Concept register",
      "Sources",
    ]);
    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
  });
});
