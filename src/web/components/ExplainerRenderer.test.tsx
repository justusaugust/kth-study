import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ExplainerSpec } from "../../domain/schemas";
import { ExplainerRenderer } from "./ExplainerRenderer";

const quadraticSpec: ExplainerSpec = {
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

const intervalSpec: ExplainerSpec = {
  id: "explainer:sf1690:real-number-intervals",
  atlasOrder: 10,
  kind: "number-line",
  variant: "interval",
  courseId: "course:sf1690",
  slug: "real-number-intervals",
  conceptIds: ["concept:sf1690:real-numbers-and-lines"],
  title: "Inequality to interval",
  caption: "Open and closed endpoints connect both notations.",
  accessibleSummary: "An interactive interval on a number line.",
  sourceIds: [],
  relationships: [],
  lastChecked: "2026-08-24",
  confidence: "fixture",
};

const parabolaSpec = {
  id: "explainer:sf1690:parabola-focus-directrix",
  atlasOrder: 6,
  kind: "conic-section",
  variant: "parabola-focus-directrix",
  courseId: "course:sf1690",
  slug: "parabola-focus-directrix",
  conceptIds: ["concept:sf1690:parabolas-and-shifts"],
  title: "Parabola from equal distances",
  caption: "Move P while its distances to the focus and directrix remain equal.",
  accessibleSummary: "An interactive parabola with a focus and directrix.",
  sourceIds: [],
  relationships: [],
  lastChecked: "2026-08-26",
  confidence: "fixture",
};

const ellipseSpec = {
  id: "explainer:sf1690:ellipse-distance-sum",
  atlasOrder: 5,
  kind: "conic-section",
  variant: "ellipse-distance-sum",
  courseId: "course:sf1690",
  slug: "ellipse-distance-sum",
  conceptIds: ["concept:sf1690:ellipses-and-hyperbolas"],
  title: "Ellipse from a constant distance sum",
  caption: "Move P and change the axes while the focal-distance sum stays fixed.",
  accessibleSummary: "An interactive ellipse with two foci and principal axes.",
  sourceIds: [],
  relationships: [],
  lastChecked: "2026-08-26",
  confidence: "fixture",
};

const breadboardSpec = {
  id: "explainer:ie1204:breadboard-wiring",
  atlasOrder: 23,
  kind: "systems-diagram",
  variant: "breadboard-wiring",
  courseId: "course:ie1204",
  slug: "breadboard-wiring",
  conceptIds: ["concept:ie1204:breadboard-and-safe-wiring"],
  sessionIds: ["session:ie1204:lab-2026-09-03"],
  title: "Probe a breadboard",
  caption: "Probe two holes.",
  accessibleSummary: "An interactive breadboard continuity tester.",
  sourceIds: [],
  relationships: [],
  lastChecked: "2026-09-03",
  confidence: "fixture",
};

describe("ExplainerRenderer", () => {
  it("renders a keyboard-adjustable quadratic plot with a text fallback", () => {
    const { container } = render(
      <ExplainerRenderer spec={quadraticSpec} mode="full" />,
    );

    expect(
      screen.getByRole("img", { name: quadraticSpec.accessibleSummary }),
    ).toBeVisible();
    expect(container.querySelector(".function-plot")).toHaveClass(
      "visual-topic--function",
    );
    const slider = screen.getByRole("slider", { name: "Coefficient a" });
    expect(slider).toHaveValue("1");
    expect(slider.style.getPropertyValue("--range-progress")).toBe("66.667%");
    expect(screen.getByText(quadraticSpec.caption)).toBeVisible();
  });

  it("gives full diagram explainers their complete controls", () => {
    const { container } = render(
      <ExplainerRenderer spec={intervalSpec} mode="full" />,
    );

    expect(container.querySelector(".concept-diagram")).toHaveClass(
      "visual-topic--number",
    );
    expect(screen.getByRole("slider", { name: "Endpoint a" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Reset values" })).toBeVisible();
  });

  it("keeps a parabola point equally distant from its focus and directrix", () => {
    const { container } = render(
      <ExplainerRenderer spec={parabolaSpec as never} mode="full" />,
    );

    expect(container.querySelector(".conic-diagram")).toHaveClass(
      "visual-topic--conic",
    );
    fireEvent.change(screen.getByRole("slider", { name: "Focus distance p" }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Point x-coordinate" }), {
      target: { value: "4" },
    });

    expect(screen.getByText("PF = 4")).toBeVisible();
    expect(screen.getByText("PQ = 4")).toBeVisible();
    expect(screen.getByText("x² = 4py")).toBeVisible();
    const focus = screen.getByRole("img", { name: /Focus F at/ });
    expect(focus).toHaveAttribute("tabindex", "0");
    fireEvent.focus(focus);
    expect(screen.getByText("Focus F")).toBeInTheDocument();
    expect(container.querySelector(".conic-stage > .diagram-hover-label:last-child"))
      .toBeInTheDocument();
  });

  it("keeps an ellipse point's focal-distance sum equal to twice its semimajor axis", () => {
    render(<ExplainerRenderer spec={ellipseSpec as never} mode="full" />);

    fireEvent.change(screen.getByRole("slider", { name: "Semimajor axis a" }), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Semiminor axis b" }), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Point angle" }), {
      target: { value: "90" },
    });

    expect(screen.getAllByText("PF₁ = 5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PF₂ = 5").length).toBeGreaterThan(0);
    expect(screen.getByText("PF₁ + PF₂ = 10 = 2a")).toBeVisible();
  });

  it("shows that a split breadboard rail needs a bridge", () => {
    render(<ExplainerRenderer spec={breadboardSpec as never} mode="full" />);

    expect(screen.getByText("Open circuit")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Bridge the power rail" }));
    expect(screen.getByText("Same electrical node")).toBeVisible();
  });

  it("falls back safely for an unsupported kind", () => {
    const unsupportedSpec = {
      ...quadraticSpec,
      kind: "future-diagram",
      accessibleSummary: "A future visual with a complete text description.",
    };
    render(
      <ExplainerRenderer spec={unsupportedSpec as never} mode="full" />,
    );
    expect(screen.getByText(unsupportedSpec.accessibleSummary)).toBeVisible();
  });
});
