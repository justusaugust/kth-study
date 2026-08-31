import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SystemsDiagram } from "./SystemsDiagram";

afterEach(cleanup);

describe("SystemsDiagram", () => {
  it("recomputes a binary word when a place is toggled", () => {
    const { container } = render(
      <SystemsDiagram variant="binary-place-value" mode="full" />,
    );

    expect(container.querySelector(".systems-diagram")).toHaveClass(
      "visual-topic--systems",
    );
    expect(screen.getByText("90₁₀")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /weight 1 is 0/i }));
    expect(screen.getByText("91₁₀")).toBeVisible();
  });

  it("classifies voltage ranges through the slider", () => {
    render(<SystemsDiagram variant="logic-levels" mode="full" />);

    fireEvent.change(screen.getByRole("slider", { name: "Input voltage" }), {
      target: { value: "0.5" },
    });
    expect(screen.getByText("Undefined")).toBeVisible();
  });

  it("moves a Python name between differently typed values", () => {
    render(<SystemsDiagram variant="variable-binding" mode="full" />);

    fireEvent.click(screen.getByRole("button", { name: 'x = "KTH"' }));
    expect(screen.getAllByText('"KTH"').length).toBeGreaterThan(0);
    expect(screen.getByText(/type str/i)).toBeVisible();
  });

  it("keeps a two's-complement value stable when it is sign-extended", () => {
    render(<SystemsDiagram variant="twos-complement" mode="full" />);

    expect(screen.getByText("1001₂")).toBeVisible();
    expect(screen.getByText("−7₁₀")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Sign extend to 8 bits" }));
    expect(screen.getByText("11111001₂")).toBeVisible();
    expect(screen.getByText("−7₁₀")).toBeVisible();
  });

  it("shows signed overflow in a fixed-width addition", () => {
    render(<SystemsDiagram variant="fixed-width-adder" mode="full" />);

    fireEvent.change(screen.getByRole("slider", { name: "Operand A" }), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Operand B" }), {
      target: { value: "2" },
    });

    expect(screen.getByText("1001₂ → −7₁₀")).toBeVisible();
    expect(screen.getByText("Signed overflow")).toBeVisible();
  });

  it("recomputes a logic gate when either input changes", () => {
    render(<SystemsDiagram variant="logic-gates" mode="full" />);

    fireEvent.click(screen.getByRole("tab", { name: "XOR" }));
    expect(screen.getByText("Y = 1", { exact: true })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Input B is 0" }));
    expect(screen.getByText("Y = 0", { exact: true })).toBeVisible();
  });

  it("traces complementary CMOS networks", () => {
    render(<SystemsDiagram variant="cmos-gates" mode="full" />);

    expect(screen.getByText("NAND: Y = 1")).toBeVisible();
    const pmosA = screen.getByRole("img", { name: /pMOS Pₐ.*currently off/i });
    expect(pmosA).toBeVisible();
    expect(screen.getByRole("img", { name: /VDD: positive supply rail/i })).toBeVisible();
    fireEvent.focus(pmosA);
    expect(screen.getByText("off now · on when A = 0")).toBeVisible();
    expect(document.querySelector(".diagram-hover-label.is-visible")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Input B is 0" }));
    expect(screen.getByText("NAND: Y = 0")).toBeVisible();
    expect(screen.getByText("Pull-down network conducts")).toBeVisible();
  });

  it("recomputes CMOS power when voltage changes", () => {
    render(<SystemsDiagram variant="cmos-power" mode="full" />);

    expect(screen.getByText("14.400 W")).toBeVisible();
    expect(screen.getByText("0.024 W")).toBeVisible();
    fireEvent.change(screen.getByRole("slider", { name: "Supply voltage" }), {
      target: { value: "2.4" },
    });
    expect(screen.getByText("57.600 W")).toBeVisible();
    expect(screen.getByText("0.048 W")).toBeVisible();
  });

  it("marks an input outside a function's natural domain", () => {
    render(<SystemsDiagram variant="function-machine" mode="full" />);

    fireEvent.click(screen.getByRole("tab", { name: "Square root" }));
    fireEvent.change(screen.getByRole("slider", { name: "Input x" }), {
      target: { value: "-1" },
    });
    expect(screen.getByText("Outside the domain")).toBeVisible();
    expect(screen.getByText("Domain [0, ∞)")).toBeVisible();
  });

  it("connects odd symmetry to opposite function values", () => {
    render(<SystemsDiagram variant="function-symmetry" mode="full" />);

    fireEvent.click(screen.getByRole("tab", { name: "Odd · x³" }));
    expect(screen.getByText("f(−x) = −f(x)")).toBeVisible();
    expect(screen.getByText("Origin symmetry")).toBeVisible();
  });

  it("counts intersections while sweeping the vertical-line test", () => {
    render(<SystemsDiagram variant="vertical-line-test" mode="full" />);

    expect(screen.getByText("One intersection — this is a function of x")).toBeVisible();
    fireEvent.click(screen.getByRole("tab", { name: "Circle" }));
    expect(screen.getByText("Two intersections — not a function of x")).toBeVisible();
    fireEvent.change(screen.getByRole("slider", { name: "Test line x" }), {
      target: { value: "1.2" },
    });
    expect(screen.getByText("No intersection at this input")).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: "Upper semicircle" }));
    expect(screen.getByText("y = √(1 − x²), −1 ≤ x ≤ 1")).toBeVisible();
    expect(document.querySelector(".function-curve")?.getAttribute("d")).toContain(" A190 76 ");
  });

  it("restricts a quotient when its denominator function is zero", () => {
    render(<SystemsDiagram variant="function-arithmetic" mode="full" />);

    fireEvent.click(screen.getByRole("tab", { name: "Quotient" }));
    fireEvent.change(screen.getByRole("slider", { name: "Shared input x" }), {
      target: { value: "1" },
    });

    expect(screen.getByText("Undefined: g(1) = 0")).toBeVisible();
    expect(screen.getByText(/quotient removes x = 1/i)).toBeVisible();
  });

  it("shows that composition order changes both value and domain", () => {
    render(<SystemsDiagram variant="function-composition" mode="full" />);

    fireEvent.change(screen.getByRole("slider", { name: "Composition input x" }), {
      target: { value: "-0.5" },
    });
    expect(screen.getByText("f(g(x)) = 0.707")).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: "g after f" }));
    expect(screen.getByText("Outside the domain of f")).toBeVisible();
    expect(screen.getByText("Domain [0, ∞)")).toBeVisible();
  });

  it("uses the included middle branch at a piecewise boundary", () => {
    render(<SystemsDiagram variant="piecewise-function" mode="full" />);

    fireEvent.change(screen.getByRole("slider", { name: "Piecewise input x" }), {
      target: { value: "-1" },
    });

    expect(screen.getByText("p(−1) = 1")).toBeVisible();
    expect(screen.getByText("−1 ≤ x ≤ 1").closest("span")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
