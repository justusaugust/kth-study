import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { FunctionPlotExplainer } from "../../domain/schemas";
import { FunctionPlot } from "./FunctionPlot";

// In test mode the plot renders at a known width, so the true-aspect viewbox
// and its label density can be checked without relying on browser layout.
const spec: FunctionPlotExplainer = {
  id: "explainer:sf1690:quadratic-coefficients",
  atlasOrder: 9,
  kind: "function-plot",
  courseId: "course:sf1690",
  slug: "quadratic-coefficients",
  conceptIds: ["concept:sf1690:quadratic-functions"],
  title: "How coefficients move a parabola",
  caption: "Change a, b, and c to see how each coefficient alters the graph.",
  accessibleSummary: "A quadratic plot controlled by three coefficients.",
  functions: [
    {
      id: "primary",
      label: "f(x)",
      family: "quadratic",
      coefficients: { a: 1, b: 0, c: 0 },
      color: "blue",
    },
  ],
  controls: [
    { coefficient: "a", min: -3, max: 3, step: 0.25 },
    { coefficient: "b", min: -5, max: 5, step: 0.5 },
    { coefficient: "c", min: -5, max: 5, step: 0.5 },
  ],
  sourceIds: [],
  relationships: [],
  lastChecked: "2026-08-24",
  confidence: "fixture",
};

afterEach(cleanup);

describe("FunctionPlot axis labels", () => {
  it("gives the preview enough height for a useful quadratic scale", () => {
    render(<FunctionPlot spec={spec} mode="preview" />);

    // A sufficiently tall preview has room for even-numbered labels. The old
    // shallow strip exposed roughly x ∈ [-19, 19] and only labelled fives.
    expect(screen.queryByText("7")).not.toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
    expect(screen.getAllByText("6").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-2").length).toBeGreaterThan(0);
  });

  it("suppresses labels that would be clipped at the frame edge", () => {
    // A 375px viewport leaves a ~335px frame: the visible range is about
    // x ∈ [-9.9, 9.9], so the ±10 and ±15 labels sit at or beyond the frame
    // edge and would render as truncated glyphs. They must not appear.
    render(<FunctionPlot spec={spec} mode="preview" frameWidth={335} />);

    expect(screen.queryByText("-10")).not.toBeInTheDocument();
    expect(screen.queryByText("-15")).not.toBeInTheDocument();
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-5").length).toBeGreaterThan(0);
  });

  it("labels more densely in the full view where there is room", () => {
    render(<FunctionPlot spec={spec} mode="full" />);

    // ~32px per unit: even integers fit, odd ones would still crowd.
    expect(screen.queryByText("7")).not.toBeInTheDocument();
    expect(screen.getAllByText("6").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-2").length).toBeGreaterThan(0);
  });

  it("turns the quadratic into a readable equation and landmark summary", () => {
    const { container } = render(<FunctionPlot spec={spec} mode="full" />);

    expect(screen.getByText("f(x) = x²")).toBeVisible();
    expect(screen.getByText("Vertex (0, 0)")).toBeVisible();
    expect(screen.getByText("Axis x = 0")).toBeVisible();
    expect(screen.getByText("Double root x = 0")).toBeVisible();
    expect(
      container.querySelectorAll(".plot-landmarks circle"),
    ).toHaveLength(2);
  });

  it("updates roots, vertex, and axis as the coefficients move", () => {
    render(<FunctionPlot spec={spec} mode="full" />);

    fireEvent.change(screen.getByRole("slider", { name: "Coefficient b" }), {
      target: { value: "-2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Coefficient c" }), {
      target: { value: "-3" },
    });

    expect(screen.getByText("f(x) = x² − 2x − 3")).toBeVisible();
    expect(screen.getByText("Vertex (1, −4)")).toBeVisible();
    expect(screen.getByText("Axis x = 1")).toBeVisible();
    expect(screen.getByText("Roots x = −1, 3")).toBeVisible();
  });
});
