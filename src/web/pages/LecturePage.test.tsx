import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LecturePage } from "./LecturePage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LecturePage", () => {
  it("renders mathematics inside a concept summary", async () => {
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
              links: [],
              outcomeIds: [],
              conceptIds: [],
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-28",
              confidence: "fixture",
            },
            lectures: [{
              id: "lecture:sf1690:2026-08-28-04",
              courseId: "course:sf1690",
              slug: "2026-08-28-04",
              title: "Lecture 4 — combining functions",
              date: "2026-08-28",
              summary: "Combine functions.",
              conceptIds: ["concept:sf1690:function-composition"],
              body: "The inner function acts first.",
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-28",
              confidence: "fixture",
            }],
            concepts: [{
              id: "concept:sf1690:function-composition",
              courseId: "course:sf1690",
              slug: "function-composition",
              title: "Function composition",
              summary: "The composite $(f\\circ g)(x)=f(g(x))$ applies $g$ first.",
              outcomeIds: [],
              lectureIds: ["lecture:sf1690:2026-08-28-04"],
              evidenceStatus: "curriculum",
              body: "",
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-28",
              confidence: "fixture",
            }],
            explainers: [],
            outcomes: [],
            assessments: [],
            sessions: [],
            coursework: [],
            journey: [],
            sources: [],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/courses/sf1690/lectures/2026-08-28-04"]}>
        <Routes>
          <Route
            path="/courses/:courseCode/lectures/:lectureSlug"
            element={<LecturePage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Function composition" }),
    ).toBeVisible();
    expect(document.querySelector(".lecture-concept__body .katex")).toBeInTheDocument();
    expect(document.querySelector(".lecture-note")).toHaveClass("markdown-body");
    expect(screen.queryByText(/\$\(f\\circ g\)\(x\)/)).not.toBeInTheDocument();
  });
});
