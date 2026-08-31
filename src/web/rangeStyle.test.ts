import { describe, expect, it } from "vitest";
import { liquidRangeStyle } from "./rangeStyle";

describe("liquidRangeStyle", () => {
  it("clamps progress to the native rounded track", () => {
    expect(liquidRangeStyle(4, 2, 5)["--range-progress"]).toBe("66.667%");
    expect(liquidRangeStyle(1, 2, 5)["--range-progress"]).toBe("0%");
    expect(liquidRangeStyle(6, 2, 5)["--range-progress"]).toBe("100%");
  });
});
