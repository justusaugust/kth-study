import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { analyseKarnaughGroup, KarnaughDiagram } from "./KarnaughDiagram";

afterEach(cleanup);

describe("Karnaugh groups", () => {
  it("removes precisely the changing variables in pairs and wrapped rectangles", () => {
    expect(analyseKarnaughGroup([0])).toContain("¬A·¬B·¬C");
    expect(analyseKarnaughGroup([2, 3])).toContain("¬A·B");
    expect(analyseKarnaughGroup([0, 2, 4, 6])).toContain("→ ¬C");
    expect(analyseKarnaughGroup([2, 3, 6, 7])).toContain("→ B");
  });

  it("rejects zero cells, diagonals, L shapes and nonrectangular powers of two", () => {
    expect(analyseKarnaughGroup([0, 1])).toContain("cannot include a 0");
    for (const group of [[0, 6], [0, 2, 4], [0, 2, 3, 4], [0, 2, 3, 4, 6, 7]]) {
      expect(analyseKarnaughGroup(group)).toContain("Invalid group");
    }
  });

  it("keeps all 256 selections consistent with a complete implicant", () => {
    for (let mask = 1; mask < 256; mask++) {
      const selected = Array.from({ length: 8 }, (_, i) => i).filter((i) => mask & (1 << i));
      const bits = [4, 2, 1].filter((bit) => selected.every((i) => (i & bit) === (selected[0] & bit)));
      const covered = Array.from({ length: 8 }, (_, i) => i).filter((i) => bits.every((bit) => (i & bit) === (selected[0] & bit)));
      const valid = covered.length === selected.length && selected.every((i) => [0, 2, 3, 4, 6, 7].includes(i));
      expect(analyseKarnaughGroup(selected).startsWith("Valid")).toBe(valid);
    }
  });

  it("shows Gray order and supports select, deselect, wrap preset and clear", () => {
    render(<KarnaughDiagram mode="full" />);
    expect(screen.getAllByRole("columnheader").map((el) => el.textContent)).toEqual(["A ∖ BC", "00", "01", "11", "10"]);
    const cell = screen.getByRole("button", { name: /^m0,/ });
    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("¬A·¬B·¬C");
    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Show wrap-around group" }));
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(4);
    expect(screen.getByRole("status")).toHaveTextContent("Valid 4-cell group → ¬C");
    fireEvent.click(screen.getByRole("button", { name: "Clear group" }));
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(8);
    expect(screen.getByRole("status")).toHaveTextContent("Select cells");
  });
});
