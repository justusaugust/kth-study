import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchPage } from "./SearchPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("SearchPage", () => {
  it("drops an unknown result type instead of displaying an All filter with a stale URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ query: "", results: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    function LocationProbe() {
      return <output data-testid="location-search">{useLocation().search}</output>;
    }

    render(
      <MemoryRouter initialEntries={["/search?type=bogus"]}>
        <Routes>
          <Route path="/search" element={<><SearchPage /><LocationProbe /></>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "All", pressed: true })).toBeVisible();
    await waitFor(() => expect(screen.getByTestId("location-search")).toBeEmptyDOMElement());
  });

  it("routes visual-only search into the dedicated atlas", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "quadratic",
            results: [
              {
                id: "explainer:sf1690:quadratic-coefficients",
                entityType: "explainer",
                title: "Quadratic coefficients",
                summary: "See how coefficients alter a parabola.",
                url: "/visuals/quadratic-coefficients",
                score: 10,
                courseId: "course:sf1690",
                visualKind: "function-plot",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/search?q=quadratic&type=explainer"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/visuals" element={<p>Dedicated visual atlas</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Dedicated visual atlas")).toBeVisible();
  });

  it("updates full results while typing and exposes the shared filters", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "absolute",
            results: [
              {
                id: "concept:sf1690:absolute-value",
                entityType: "concept",
                title: "Absolute value",
                summary: "The absolute value $|x|$ is distance from zero.",
                url: "/courses/sf1690/concepts/absolute-value",
                score: 10,
                courseId: "course:sf1690",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/search"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "All", pressed: true })).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search query" }), {
      target: { value: "absolute" },
    });

    const result = await screen.findByRole("link", { name: "Absolute value" });
    expect(result).toBeVisible();
    expect(result.closest("li")?.querySelector(".katex")).toBeInTheDocument();
    expect(result.closest("li")?.querySelector(".result-type-label")).toHaveTextContent("Concept");
    expect(result.closest("li")?.querySelector(".result-type-label svg")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Definitions" }).querySelector("svg")).toBeInTheDocument();
  });

  it("does not repeat the active result type on every row", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "",
            results: [
              {
                id: "example:sf1690:absolute-value-equation-and-band",
                entityType: "example",
                title: "Solve an absolute-value equation and inequality",
                summary: "For $|3x-2|=4$, split into two cases.",
                url: "/courses/sf1690/concepts/absolute-value#example-absolute-value-equation-and-band",
                score: 0,
                courseId: "course:sf1690",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter initialEntries={["/search?type=example"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const result = await screen.findByRole("link", {
      name: "Solve an absolute-value equation and inequality",
    });
    expect(result.closest("li")?.querySelector(".result-type-label")).not.toBeInTheDocument();
    expect(result.closest("li")?.querySelector("[data-entity-mark]")).not.toBeInTheDocument();
  });
});
