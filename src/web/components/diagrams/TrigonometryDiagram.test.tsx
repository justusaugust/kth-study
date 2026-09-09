import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { TrigonometryDiagram } from "./TrigonometryDiagram";

afterEach(cleanup);
it("links circle coordinates and trig values, including undefined tangent", () => {
  render(<TrigonometryDiagram mode="full" />);
  expect(screen.getByRole("slider")).toHaveClass("liquid-range");
  expect(screen.getByRole("slider").style.getPropertyValue("--range-progress")).toBe("8.333%");
  expect(screen.getByText("sin θ = 0.5")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "90°" }));
  expect(screen.getByText("cos θ = 0")).toBeInTheDocument();
  expect(screen.getByText("sin θ = 1")).toBeInTheDocument();
  expect(screen.getByText("tan θ = undefined")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider", { name: "Angle θ (degrees)" }), { target: { value: "180" } });
  expect(screen.getByText("cos θ = -1")).toBeInTheDocument();
  expect(screen.getByText("sin θ = 0")).toBeInTheDocument();
});
