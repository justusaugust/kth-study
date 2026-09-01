import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConceptPage } from "./ConceptPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ConceptPage", () => {
  it("leads with definitions and a visual study board", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            concept: {
              id: "concept:sf1690:quadratic-functions",
              courseId: "course:sf1690",
              slug: "quadratic-functions",
              title: "Quadratic functions",
              summary:
                "A quadratic function $f(x)=ax^2+bx+c$ has a graph whose shape is controlled by three coefficients.",
              centralInsight: "A concept-specific $x^2$ insight.",
              commonMistake: "A concept-specific $y$ mistake.",
              verifyPrompt: "A concept-specific $z$ verification prompt.",
              outcomeIds: [],
              lectureIds: [],
              relationships: [],
              sourceIds: [],
              lastChecked: "2026-08-24",
              confidence: "fixture",
              body: "A quadratic function has the form $f(x)=ax^2+bx+c$.",
            },
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
              lastChecked: "2026-08-24",
              confidence: "fixture",
            },
            outcomes: [
              {
                id: "outcome:sf1690:first",
                courseId: "course:sf1690",
                slug: "first",
                title: "First outcome",
                description: "First fixture outcome",
                relationships: [],
                sourceIds: [],
                lastChecked: "2026-08-24",
                confidence: "fixture",
              },
              {
                id: "outcome:sf1690:second",
                courseId: "course:sf1690",
                slug: "second",
                title: "Second outcome",
                description: "Second fixture outcome",
                relationships: [],
                sourceIds: [],
                lastChecked: "2026-08-24",
                confidence: "fixture",
              },
            ],
            lectures: [],
            explainers: [],
            definitions: [{
              id: "definition:sf1690:quadratic-function",
              courseId: "course:sf1690",
              slug: "quadratic-function",
              term: "Quadratic function",
              title: "Quadratic function",
              statement: "A function of the form $f(x)=ax^2+bx+c$.",
              notation: "$f(x)=ax^2+bx+c$",
              interpretation: "Its graph is a parabola.",
              conceptIds: ["concept:sf1690:quadratic-functions"],
              relationships: [], sourceIds: [], lastChecked: "2026-08-24", confidence: "fixture"
            }],
            prerequisites: [],
            nextConcepts: [],
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
            examples: [
              {
                id: "example:sf1690:quadratic-evaluation",
                courseId: "course:sf1690",
                slug: "quadratic-evaluation",
                title: "Evaluate a quadratic",
                conceptIds: ["concept:sf1690:quadratic-functions"],
                body: "For $f(x)=x^2-1$, calculate $f(2)=3$.",
                relationships: [],
                sourceIds: [],
                lastChecked: "2026-08-24",
                confidence: "fixture",
              },
            ],
            questions: [
              {
                id: "question:sf1690:quadratic-shape",
                courseId: "course:sf1690",
                slug: "quadratic-shape",
                title: "Predict the opening",
                conceptIds: ["concept:sf1690:quadratic-functions"],
                body: "What does the sign of $a$ tell you?",
                answer: "A positive $a$ opens upward.",
                relationships: [],
                sourceIds: [],
                lastChecked: "2026-08-24",
                confidence: "fixture",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/courses/sf1690/concepts/quadratic-functions"]}>
        <Routes>
          <Route
            path="/courses/:courseCode/concepts/:conceptSlug"
            element={<ConceptPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Quadratic functions" }),
    ).toBeVisible();
    expect(document.querySelector(".concept-heading .katex")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Key definitions" })).toBeVisible();
    expect(screen.getByText("Quadratic function")).toBeVisible();
    expect(document.querySelector('[data-entity-mark="definition"]')).toBeInTheDocument();
    expect(document.querySelector(".definition-board > .section-marker svg")).toBeInTheDocument();
    expect(document.querySelector(".definition-heading svg")).not.toBeInTheDocument();
    expect(document.querySelectorAll("[data-section-marker]").length).toBeGreaterThanOrEqual(4);
    expect(document.querySelector(".register")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Explanation" })).toBeVisible();
    expect(screen.getByText(/2 curriculum outcomes/)).toBeVisible();
    expect(document.querySelectorAll(".katex").length).toBeGreaterThan(2);
    expect(screen.getByRole("heading", { name: "Worked examples" })).toBeVisible();
    expect(screen.getByText("Evaluate a quadratic").closest("article")).toHaveAttribute(
      "id",
      "example-quadratic-evaluation",
    );
    expect(screen.getByRole("heading", { name: "Self-check" })).toBeVisible();
    expect(screen.getByText("Predict the opening").closest("article")).toHaveAttribute(
      "id",
      "question-quadratic-shape",
    );
    expect(
      screen.getByRole("link", { name: "KTH official SF1690 course page" }),
    ).toHaveAttribute(
      "href",
      "https://www.kth.se/student/kurser/kurs/SF1690?l=en",
    );
    expect(screen.queryByRole("textbox", { name: /notes/i })).not.toBeInTheDocument();
  });
});
