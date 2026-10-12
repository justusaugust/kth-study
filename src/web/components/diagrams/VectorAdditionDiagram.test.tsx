import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { VectorAdditionDiagram } from "./VectorAdditionDiagram";

afterEach(cleanup);

test("adds components tip-to-tail, including zero b and zero sum", () => {
  const { container } = render(<VectorAdditionDiagram mode="full" />);
  const x = screen.getByRole("slider", { name: "Vector b x component" });
  const y = screen.getByRole("slider", { name: "Vector b y component" });
  expect(x).toHaveClass("liquid-range");
  expect(y).toHaveClass("liquid-range");
  expect(x.style.getPropertyValue("--range-progress")).toBe("75%");
  expect(screen.getByRole("status")).toHaveTextContent("a + b = (3, 3)");
  expect(container.querySelector('[data-vector="b"]')).toHaveAttribute("d", "M292 184 L328 112");
  expect(container.querySelector('[data-vector="b"]')).toHaveAttribute("marker-end");
  fireEvent.change(x, { target: { value: "0" } });
  fireEvent.change(y, { target: { value: "0" } });
  expect(screen.getByRole("status")).toHaveTextContent("a + b = (2, 1)");
  expect(container.querySelector('circle[data-vector="b"]')).toBeInTheDocument();
  fireEvent.change(x, { target: { value: "-2" } });
  fireEvent.change(y, { target: { value: "-1" } });
  expect(screen.getByRole("status")).toHaveTextContent("a + b = (0, 0)");
  expect(container.querySelector('circle[data-vector="sum"]')).toHaveAttribute("cx", "220");
  expect(container.querySelector('[data-vector="b"]')).toHaveAttribute("d", "M292 184 L220 220");
  fireEvent.change(x, { target: { value: "2" } });
  fireEvent.change(y, { target: { value: "-2" } });
  expect(screen.getByRole("status")).toHaveTextContent("a + b = (4, -1)");
  expect(container.querySelector('[data-vector="sum"]')).toHaveAttribute("d", "M220 220 L364 256");
});

test("vector labels stay finite and inside the plot for every allowed component", () => {
  const { container } = render(<VectorAdditionDiagram mode="full" />);
  const x = screen.getByRole("slider", { name: "Vector b x component" });
  const y = screen.getByRole("slider", { name: "Vector b y component" });
  for (let bx = -2; bx <= 2; bx++) for (let by = -2; by <= 2; by++) {
    fireEvent.change(x, { target: { value: String(bx) } });
    fireEvent.change(y, { target: { value: String(by) } });
    const labels = container.querySelectorAll(".vector-addition__names text");
    expect(labels).toHaveLength(3);
    for (const label of labels) for (const axis of ["x", "y"]) {
      const coordinate = Number(label.getAttribute(axis));
      expect(Number.isFinite(coordinate)).toBe(true);
      expect(coordinate).toBeGreaterThanOrEqual(24);
      expect(coordinate).toBeLessThanOrEqual(416);
    }
  }
});
