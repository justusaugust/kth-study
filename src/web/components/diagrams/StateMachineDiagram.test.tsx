import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { StateMachineDiagram } from "./StateMachineDiagram";

test("parity changes only when a one is clocked", () => {
  render(<StateMachineDiagram mode="full" />);
  fireEvent.click(screen.getByRole("button", { name: "Next input = 0" }));
  expect(screen.getByRole("status")).toHaveTextContent("Current: Even · Y = 0 · Next: Odd");
  fireEvent.click(screen.getByRole("button", { name: "Clock one bit" }));
  expect(screen.getByRole("status")).toHaveTextContent("Current: Odd · Y = 1");
  fireEvent.click(screen.getByRole("button", { name: "Next input = 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Clock one bit" }));
  expect(screen.getByRole("status")).toHaveTextContent("Current: Odd · Y = 1");
  fireEvent.click(screen.getByRole("button", { name: "Reset machine" }));
  expect(screen.getByRole("status")).toHaveTextContent("Current: Even · Y = 0 · Next: Even · Bits clocked: 0");
});
