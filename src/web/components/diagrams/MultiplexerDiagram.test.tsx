import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MultiplexerDiagram } from "./MultiplexerDiagram";

test("all eight mux input combinations select exactly one data bit", () => {
  render(<MultiplexerDiagram mode="full" />);
  const current = [0, 1, 0];
  for (let word = 0; word < 8; word++) {
    const next = [word & 1, (word >> 1) & 1, (word >> 2) & 1];
    ["D0", "D1", "S"].forEach((label, index) => {
      if (current[index] !== next[index]) fireEvent.click(screen.getByRole("button", { name: `Toggle ${label}` }));
      current[index] = next[index];
    });
    expect(screen.getByRole("status")).toHaveTextContent(`S = ${next[2]}: Y = D${next[2]} = ${next[next[2]]}`);
  }
});
