import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  ConceptDiagram,
  CoordinateGrid,
  GridLabels,
  unitRange,
} from "./ConceptDiagram";

afterEach(cleanup);

describe("ConceptDiagram", () => {
  it("updates interval and inequality notation from its controls", () => {
    render(<ConceptDiagram slug="real-numbers-and-lines" />);

    fireEvent.change(screen.getByRole("slider", { name: "Endpoint a" }), {
      target: { value: "-1" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Endpoint b" }), {
      target: { value: "4" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Include endpoint a" }));

    expect(screen.getByText("[-1, 4]")).toBeVisible();
    expect(screen.getByText("−1 ≤ x ≤ 4")).toBeVisible();
  });

  it("compares distance from zero with distance between two points", () => {
    render(<ConceptDiagram slug="absolute-value" />);

    fireEvent.change(screen.getByRole("slider", { name: "Point a" }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Point b" }), {
      target: { value: "5" },
    });

    expect(screen.getByText("Same side of zero")).toBeVisible();
    expect(screen.getByText("|a − b| = 3")).toBeVisible();
    expect(screen.getByText("||a| − |b|| = 3")).toBeVisible();
  });

  it("keeps the a-distance segment clear of the draggable point label", () => {
    const { container } = render(<ConceptDiagram slug="absolute-value" />);

    const segment = container.querySelector(".diagram-distance-a");
    const pointLabel = container.querySelector(".diagram-handle .diagram-point-label");
    const handle = pointLabel?.parentElement;
    const handleY = Number(handle?.getAttribute("transform")?.match(/\s([\d.]+)\)/)?.[1]);
    const segmentY = Number(segment?.getAttribute("y1"));
    const pointLabelY = handleY + Number(pointLabel?.getAttribute("y"));

    expect(pointLabelY - segmentY).toBeGreaterThanOrEqual(36);
  });

  it("recalculates the Cartesian distance when a coordinate changes", () => {
    const { container } = render(
      <ConceptDiagram slug="cartesian-distance-circles" />,
    );

    expect(container.querySelector(".concept-diagram")).toHaveClass(
      "visual-topic--geometry",
    );

    fireEvent.change(screen.getByRole("slider", { name: "P x-coordinate" }), {
      target: { value: "-2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "P y-coordinate" }), {
      target: { value: "-2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Q x-coordinate" }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Q y-coordinate" }), {
      target: { value: "2" },
    });

    expect(screen.getAllByText("Δx = 4")).not.toHaveLength(0);
    expect(screen.getAllByText("Δy = 4")).not.toHaveLength(0);
    expect(screen.getByText("d = √32 ≈ 5.66")).toBeVisible();
  });

  it("places gridlines and labels at the coordinates they name", () => {
    const axes = {
      x: {
        values: unitRange(-1, 1, 0.5),
        labels: [1],
        project: (value: number) => 100 + value * 40,
      },
      y: {
        values: unitRange(-1, 1, 0.5),
        labels: [1],
        project: (value: number) => 60 - value * 20,
      },
    };

    const { container } = render(
      <svg>
        <CoordinateGrid {...axes} />
        <GridLabels {...axes} gap={20} />
      </svg>,
    );

    // Half-unit steps land on their mapped x, and the zero lines are left to
    // the figure's own axes.
    const verticals = [
      ...container.querySelectorAll("line.diagram-grid"),
    ].filter((line) => line.getAttribute("x1") === line.getAttribute("x2"));
    expect(verticals.map((line) => line.getAttribute("x1"))).toEqual([
      "60",
      "80",
      "120",
      "140",
    ]);
    expect(verticals[0]).toHaveAttribute("y1", "40");
    expect(verticals[0]).toHaveAttribute("y2", "80");
    expect(container.querySelector(".diagram-grid.diagram-axis")).toBeNull();

    const [xLabel, yLabel] = [
      ...container.querySelectorAll("text.diagram-grid-label"),
    ];
    expect(xLabel).toHaveAttribute("x", "140");
    expect(xLabel).toHaveAttribute("y", "80");
    expect(yLabel).toHaveAttribute("x", "88");
    expect(yLabel).toHaveAttribute("y", "45");

    const cartesian = render(
      <ConceptDiagram slug="cartesian-distance-circles" />,
    ).container;
    const atTwo = [...cartesian.querySelectorAll("line.diagram-grid")].find(
      (line) => line.getAttribute("x1") === "380",
    );
    expect(atTwo).toHaveAttribute("y1", "40");
    expect(atTwo).toHaveAttribute("y2", "340");
  });

  it("explains that a vertical line has undefined slope", () => {
    render(<ConceptDiagram slug="lines-and-slopes" />);

    fireEvent.change(screen.getByRole("slider", { name: "P x-coordinate" }), {
      target: { value: "-2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Q x-coordinate" }), {
      target: { value: "-2" },
    });

    expect(screen.getAllByText("run = 0")).not.toHaveLength(0);
    expect(screen.getByText("slope = undefined")).toBeVisible();
    expect(screen.getByText("x = −2")).toBeVisible();
  });
});
