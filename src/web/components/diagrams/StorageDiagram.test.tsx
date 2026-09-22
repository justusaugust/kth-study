import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { StorageDiagram } from "./StorageDiagram";

test("latch follows a high clock while flip-flop captures only rising edges", () => {
  render(<StorageDiagram mode="full" />);
  const toggle = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
  const check = (latch: number, flipFlop: number) => {
    expect(screen.getByRole("status")).toHaveTextContent(`Latch Q = ${latch}`);
    expect(screen.getByRole("status")).toHaveTextContent(`Flip-flop Q = ${flipFlop}`);
  };
  check(0, 0);
  toggle("Toggle D");
  check(0, 0);
  toggle("Toggle clock");
  check(1, 1);
  toggle("Toggle D");
  check(0, 1);
  toggle("Toggle D");
  check(1, 1);
  toggle("Toggle D");
  check(0, 1);
  toggle("Toggle clock");
  check(0, 1);
  toggle("Toggle D");
  check(0, 1);
  toggle("Toggle D");
  toggle("Toggle clock");
  check(0, 0);
  expect(screen.getByRole("img")).toHaveAccessibleName(/latch Q 1, 0, 1, 0, 0, 0, 0, 0; flip-flop Q 1, 1, 1, 1, 1, 1, 1, 0/);
  toggle("Reset example");
  check(0, 0);
  expect(screen.getByRole("button", { name: "Toggle D" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("button", { name: "Toggle clock" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("img")).toHaveAccessibleName("Recent input steps, oldest to newest. D 0; clock 0; latch Q 0; flip-flop Q 0.");
});
