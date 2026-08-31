import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ConceptDiagram } from "./ConceptDiagram";

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
