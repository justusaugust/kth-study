import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MathText } from "./MathText";
import matter from "gray-matter";

afterEach(cleanup);

it("renders Lecture 6 multiline formulas without swallowing the following prose", () => {
  for (const file of ["concepts/demorgan-and-universal-gates.md", "concepts/unknown-and-high-impedance.md", "examples/nested-demorgan.md"]) {
    const { content } = matter(readFileSync(`courses/2026-27/P1/IE1204/${file}`, "utf8"));
    const { container, unmount } = render(<MathText as="div">{content}</MathText>);
    expect(container.querySelector(".katex-error"), file).toBeNull();
    expect(container.querySelector(".katex"), file).not.toBeNull();
    unmount();
  }
});

it("renders Boolean negation as a full overline in the authored OR example", () => {
  const example = readFileSync("courses/2026-27/P1/IE1204/examples/derive-or-canonical-forms.md", "utf8");
  const equation = example.match(/\$\$[^]*?\$\$/)![0];
  const { container } = render(<MathText as="div">{equation}</MathText>);
  expect(container.querySelectorAll(".overline-line")).toHaveLength(2);
  expect(container.querySelector(".accent")).toBeNull();
  expect(container.querySelector(".katex-error")).toBeNull();
});

it("renders fractions, scripts, radicals and multiline matrices without losing structure", () => {
  const { container } = render(<MathText as="div">{String.raw`Power $\tfrac{1}{2}CV_{DD}^{2}f$ and root $\sqrt{1-x^{2}}$.

$$\begin{aligned}A&=\begin{pmatrix}1&2\\3&4\end{pmatrix}\\ \det A&=-2\end{aligned}$$`}</MathText>);
  expect(container.querySelectorAll(".katex")).toHaveLength(3);
  expect(container.querySelector(".mfrac")).not.toBeNull();
  expect(container.querySelector(".sqrt")).not.toBeNull();
  expect(container.querySelector(".msupsub")).not.toBeNull();
  expect(container.querySelector(".mtable")).not.toBeNull();
  expect(container.querySelector(".katex-error")).toBeNull();
});
