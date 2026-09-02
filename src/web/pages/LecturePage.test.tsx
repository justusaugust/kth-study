import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LecturePage } from "./LecturePage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LecturePage", () => {
  it("expands a lecture into concept content, practice, and assigned exercises", async () => {
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
              id: "lecture:sf1690:2026-08-27-03",
              courseId: "course:sf1690",
              slug: "2026-08-27-03",
              title: "Lecture 3 — functions",
              date: "2026-08-27",
              summary: "Functions.",
              conceptIds: ["concept:sf1690:function-composition"],
              sourceIds: ["source:sf1690:lecture-03"],
              relationships: [],
              lastChecked: "2026-08-27",
              confidence: "fixture",
            }, {
              id: "lecture:sf1690:2026-08-28-04",
              courseId: "course:sf1690",
              slug: "2026-08-28-04",
              title: "Lecture 4 — combining functions",
              date: "2026-08-28",
              summary: "Combine functions.",
              conceptIds: ["concept:sf1690:function-composition", "concept:sf1690:second"],
              body: "The inner function acts first.",
              sourceIds: ["source:sf1690:lecture-04"],
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
              centralInsight: "Start with the inner function.",
              commonMistake: "Do not reverse the order.",
              outcomeIds: [],
              lectureIds: ["lecture:sf1690:2026-08-27-03", "lecture:sf1690:2026-08-28-04"],
              evidenceStatus: "curriculum",
              body: "",
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-28",
              confidence: "fixture",
            }, {
              id: "concept:sf1690:second",
              courseId: "course:sf1690",
              slug: "second",
              title: "A second concept",
              summary: "This concept starts collapsed.",
              outcomeIds: [],
              lectureIds: ["lecture:sf1690:2026-08-28-04"],
              evidenceStatus: "curriculum",
              body: "",
              sourceIds: [], relationships: [], lastChecked: "2026-08-28", confidence: "fixture",
            }],
            explainers: [],
            definitions: [{
              id: "definition:sf1690:composite-function",
              courseId: "course:sf1690",
              slug: "composite-function",
              term: "Composite function",
              statement: "A function formed by applying one function after another.",
              notation: "$(f\\circ g)(x)=f(g(x))$",
              interpretation: "Evaluate $g$ before $f$.",
              conceptIds: ["concept:sf1690:function-composition"],
              sourceIds: ["source:sf1690:lecture-04"], relationships: [], lastChecked: "2026-08-28", confidence: "fixture",
            }],
            examples: [{
              id: "example:sf1690:composition-order",
              courseId: "course:sf1690",
              slug: "composition-order",
              title: "Compare the order",
              conceptIds: ["concept:sf1690:function-composition"],
              body: "If $g(x)=x+1$, substitute that expression into $f$.",
              sourceIds: ["source:sf1690:lecture-04"], relationships: [], lastChecked: "2026-08-28", confidence: "fixture",
            }],
            questions: [{
              id: "question:sf1690:composition-order",
              courseId: "course:sf1690",
              slug: "composition-order",
              title: "Which function acts first?",
              conceptIds: ["concept:sf1690:function-composition"],
              body: "In $(f\\circ g)(x)$, which function is evaluated first?",
              answer: "$g$ is evaluated first.",
              sourceIds: ["source:sf1690:lecture-04"], relationships: [], lastChecked: "2026-08-28", confidence: "fixture",
            }, {
              id: "question:sf1690:previous-lecture",
              courseId: "course:sf1690",
              slug: "previous-lecture",
              title: "Question from the previous lecture",
              conceptIds: ["concept:sf1690:function-composition"],
              body: "This should not leak into Lecture 4.",
              answer: "It does not.",
              sourceIds: ["source:sf1690:lecture-03"], relationships: [], lastChecked: "2026-08-27", confidence: "fixture",
            }],
            outcomes: [],
            assessments: [],
            sessions: [],
            coursework: [{
              id: "coursework:sf1690:exercise-04",
              courseId: "course:sf1690",
              slug: "exercise-04",
              kind: "exercise",
              sequence: 8,
              title: "Exercise session 4",
              date: "2026-09-07",
              time: "10:00",
              week: 36,
              requirement: "recommended",
              description: "Recommended exercises for Lecture 4.",
              materials: [{ title: "Open exercise sheet", url: "https://example.com/exercise", section: "P5", page: "38", exercises: "2, 7c-d, 10" }],
              sessionIds: [],
              lectureIds: ["lecture:sf1690:2026-08-28-04"],
              conceptIds: ["concept:sf1690:function-composition"],
              assessmentIds: [], sourceIds: [], relationships: [], lastChecked: "2026-08-28", confidence: "fixture",
            }],
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
    expect(screen.getByRole("heading", { name: "Key definitions" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Worked examples" })).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "Work it out" })).not.toBeInTheDocument();

    const concept = document.querySelector("details.lecture-concept") as HTMLDetailsElement;
    expect(concept.open).toBe(true);
    expect(document.querySelectorAll("details.lecture-concept")[1]).not.toHaveAttribute("open");
    expect(screen.queryByText("Question from the previous lecture")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Function composition").closest("summary")!);
    expect(concept.open).toBe(false);
    fireEvent.click(screen.getByText("Function composition").closest("summary")!);
    expect(concept.open).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Write your reasoning" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Work it out" }), {
      target: { value: "g acts first" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Show a hint" }));
    expect(screen.getByText("Hint 01")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Reveal solution" }));
    expect(
      document.querySelector(".practice-prompt__solution"),
    ).toHaveTextContent("is evaluated first");

    expect(screen.getByRole("heading", { name: "Assigned exercises" })).toBeVisible();
    expect(screen.getByText("Due Monday, 7 September 2026 at 10:00")).toBeVisible();
    expect(screen.getByRole("link", { name: "Open exercise sheet" })).toHaveAttribute(
      "href",
      "https://example.com/exercise",
    );
    expect(screen.getByText(/Exercises 2, 7c-d, 10/)).toBeVisible();
    expect(document.querySelector(".lecture-pagination a")).toHaveAttribute(
      "href",
      "/courses/sf1690/lectures/2026-08-27-03",
    );
  });
});
