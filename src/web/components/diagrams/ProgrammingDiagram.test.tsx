import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ProgrammingDiagram } from "./ProgrammingDiagram";
afterEach(cleanup);
it("shares mutations until one reference is rebound", () => {
  render(<ProgrammingDiagram variant="reference-aliasing" mode="full" />);
  fireEvent.click(screen.getByText("Increment through a"));
  expect(screen.getByText(/b → Counter A: 3/)).toBeTruthy();
  fireEvent.click(screen.getByText("Rebind b to a new counter"));
  fireEvent.click(screen.getByText("Increment through a"));
  expect(screen.getByText(/b → Counter B: 9/)).toBeTruthy();
  expect(screen.getByText("4")).toBeTruthy();
});
it("steps through the chosen traversal and restarts on order change", () => {
  render(<ProgrammingDiagram variant="tree-traversal" mode="full" />);
  fireEvent.click(screen.getByText("Visit next node"));
  expect(screen.getByText("Visited: 2")).toBeTruthy();
  fireEvent.click(screen.getByText("Preorder"));
  fireEvent.click(screen.getByText("Visit next node"));
  expect(screen.getByText("Visited: 4")).toBeTruthy();
});
