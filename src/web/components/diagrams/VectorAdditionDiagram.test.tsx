import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { VectorAdditionDiagram } from "./VectorAdditionDiagram";

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
