import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VisualPage } from "./VisualPage";

afterEach(() => vi.unstubAllGlobals());

describe("VisualPage", () => {
  it("connects the interactive visual back to its concept and course", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            explainer: {
              id: "explainer:sf1690:quadratic-coefficients",
              atlasOrder: 9,
              kind: "function-plot",
              courseId: "course:sf1690",
              slug: "quadratic-coefficients",
              conceptIds: ["concept:sf1690:quadratic-functions"],
              title: "How coefficients move a parabola",
              caption: "Change the coefficients.",
              accessibleSummary: "An interactive quadratic plot.",
              functions: [{ id: "primary", label: "f(x)", family: "quadratic", coefficients: { a: 1, b: 0, c: 0 }, color: "blue" }],
              controls: [{ coefficient: "a", min: -3, max: 3, step: 0.25 }],
              sourceIds: [],
              relationships: [],
              lastChecked: "2026-08-24",
              confidence: "fixture",
            },
            course: {
              id: "course:sf1690", code: "SF1690", slug: "sf1690",
              title: "Basic Course in Mathematics", academicYear: "2026-27", period: "P1",
              summary: "Fixture", credits: 6, links: [], outcomeIds: [], conceptIds: [], sourceIds: [],
              relationships: [], lastChecked: "2026-08-24", confidence: "fixture",
            },
            concepts: [{
              id: "concept:sf1690:quadratic-functions", courseId: "course:sf1690",
              slug: "quadratic-functions", title: "Quadratic functions", summary: "Quadratics.",
              outcomeIds: [], lectureIds: [], relationships: [], sourceIds: [], body: "Body",
              lastChecked: "2026-08-24", confidence: "fixture",
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
      <MemoryRouter initialEntries={["/visuals/quadratic-coefficients"]}>
        <Routes>
          <Route path="/visuals/:visualSlug" element={<VisualPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("img", { name: "An interactive quadratic plot." })).toBeVisible();
    expect(screen.getByRole("link", { name: "Read Quadratic functions" })).toHaveAttribute(
      "href",
      "/courses/sf1690/concepts/quadratic-functions",
    );
    expect(screen.getByRole("link", { name: "Back to SF1690" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "KTH official SF1690 course page" }),
    ).toHaveAttribute(
      "href",
      "https://www.kth.se/student/kurser/kurs/SF1690?l=en",
    );
  });
});
