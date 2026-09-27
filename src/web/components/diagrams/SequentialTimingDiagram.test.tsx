import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SequentialTimingDiagram } from "./SequentialTimingDiagram";

test("signed skew shifts both constraints; period fixes only setup, including zero slack", () => {
  render(<SequentialTimingDiagram mode="full" />);
  const period = screen.getByRole("slider", { name: "Clock period (ps)" });
  const skew = screen.getByRole("slider", { name: "Capture skew (ps)" });
  expect(period).toHaveClass("liquid-range");
  expect(skew).toHaveClass("liquid-range");
  expect(skew.style.getPropertyValue("--range-progress")).toBe("50%");
  expect(period).toHaveAttribute("step", "10");
  expect(skew).toHaveAttribute("step", "5");
  const check = (t: number, s: number, setup: string, hold: string) => {
    fireEvent.change(period, { target: { value: String(t) } });
    fireEvent.change(skew, { target: { value: String(s) } });
    expect(screen.getByRole("status")).toHaveTextContent(`Setup slack = ${setup}. Hold slack = ${hold}.`);
    expect(screen.getByRole("img")).toHaveAccessibleName(`Time in picoseconds relative to launch at 0. Data can change from 65 to 170. Same-cycle capture edge ${s}, hold boundary ${s + 50}. Next capture edge ${t + s}, setup deadline ${t + s - 40}.`);
  };
  check(240, 0, "30 ps (met)", "15 ps (met)");
  check(100, -30, "-140 ps (violated)", "45 ps (met)");
  check(100, 30, "-80 ps (violated)", "-15 ps (violated)");
  check(400, 30, "220 ps (met)", "-15 ps (violated)");
  check(400, -30, "160 ps (met)", "45 ps (met)");
  check(210, 0, "0 ps (at the limit)", "15 ps (met)");
  check(200, 15, "5 ps (met)", "0 ps (at the limit)");
  check(180, 30, "0 ps (at the limit)", "-15 ps (violated)");
});
