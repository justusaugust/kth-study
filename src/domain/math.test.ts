import { describe, expect, it } from "vitest";
import { checkEquivalent } from "./math";

describe("checkEquivalent", () => {
  it("recognises equivalent expressions", () => {
    expect(checkEquivalent("x+x", "2x")).toEqual({ status: "equivalent" });
  });

  it("distinguishes different expressions", () => {
    expect(checkEquivalent("x+1", "x+2")).toEqual({ status: "different" });
  });

  it("contains malformed-input failures", () => {
    expect(checkEquivalent("\\frac{", "x")).toMatchObject({
      status: "unsupported",
    });
  });
});
