import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { InverseFunctionDiagram } from "./InverseFunctionDiagram";

test("domain branches swap coordinates and preserve the shared slider", () => {
  render(<InverseFunctionDiagram mode="full" />);
  expect(screen.getByRole("status")).toHaveTextContent("(1.5, 2.25) ↔ (2.25, 1.5)");
  fireEvent.click(screen.getByRole("button", { name: "x ≤ 0" }));
  expect(screen.getByRole("status")).toHaveTextContent("(-1.5, 2.25) ↔ (2.25, -1.5)");
  const slider = screen.getByRole("slider");
  expect(slider).toHaveClass("liquid-range");
  fireEvent.change(slider, { target: { value: "0" } });
  expect(screen.getByRole("status")).toHaveTextContent("(0, 0) ↔ (0, 0)");
});
