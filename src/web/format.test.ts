import { describe, expect, it } from "vitest";
import { formatStudyDateLong, formatStudyDateRange } from "./format";

it("formats a deadline with its weekday", () => {
  expect(formatStudyDateLong("2026-09-07")).toBe("Monday, 7 September 2026");
});

describe("formatStudyDateRange", () => {
  it("compresses a same-year range without losing either boundary", () => {
    expect(formatStudyDateRange("2026-08-24", "2026-10-23")).toBe(
      "24 Aug–23 Oct 2026",
    );
  });

  it("keeps both years for a cross-year range and formats one known boundary", () => {
    expect(formatStudyDateRange("2026-12-14", "2027-01-08")).toBe(
      "14 Dec 2026–8 Jan 2027",
    );
    expect(formatStudyDateRange("2026-08-24", undefined)).toBe("From 24 Aug 2026");
    expect(formatStudyDateRange(undefined, "2026-10-23")).toBe("Until 23 Oct 2026");
  });
});
