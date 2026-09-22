import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ComplexPlaneDiagram } from "./ComplexPlaneDiagram";

test("complex-plane readout handles quadrant and zero without a false argument", () => {
  render(<ComplexPlaneDiagram mode="full" />);
  const [real, imaginary] = screen.getAllByRole("slider");
  fireEvent.change(real, { target: { value: "-3" } });
  fireEvent.change(imaginary, { target: { value: "4" } });
  expect(screen.getByRole("status")).toHaveTextContent("|z| = 5 · Arg z = 2.214 rad");
  fireEvent.change(real, { target: { value: "0" } });
  fireEvent.change(imaginary, { target: { value: "0" } });
  expect(screen.getByRole("status")).toHaveTextContent("Arg z = undefined");
  expect(real).toHaveClass("liquid-range");
});
