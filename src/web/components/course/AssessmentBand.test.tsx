import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Assessment } from "../../../domain";
import { AssessmentBand } from "./AssessmentBand";

afterEach(cleanup);

const ten1: Assessment = {
  id: "assessment:sf1690:ten1",
  courseId: "course:sf1690",
  slug: "ten1",
  code: "TEN1",
  title: "Written examination",
  kind: "written-exam",
  credits: 6,
  compulsory: true,
  description: "Written examination.",
  outcomeIds: [],
  conceptIds: [],
  sourceIds: [],
  lastChecked: "2026-08-24",
  confidence: "fixture",
  relationships: [],
};

describe("AssessmentBand", () => {
  it("shows complete credit allocation without inventing an exam date", () => {
    render(<AssessmentBand courseCredits={6} assessments={[ten1]} />);

    expect(screen.getByText("TEN1")).toBeVisible();
    expect(screen.getByText("6 ECTS")).toBeVisible();
    expect(screen.queryByText("Not yet verified")).not.toBeInTheDocument();
    expect(screen.getByLabelText("6 of 6 credits verified")).toBeVisible();
    expect(screen.queryByText(/exam date/i)).not.toBeInTheDocument();
  });

  it("makes an incomplete allocation explicit", () => {
    render(
      <AssessmentBand
        courseCredits={6}
        assessments={[{ ...ten1, credits: 4 }]}
      />,
    );

    expect(screen.getByText("Not yet verified").closest("li")).toHaveTextContent(
      "2 ECTS",
    );
    expect(screen.getByLabelText("4 of 6 credits verified")).toBeVisible();
  });

  it("states when no assessment details have been verified", () => {
    render(<AssessmentBand courseCredits={6} assessments={[]} />);
    expect(
      screen.getByText("Assessment details have not been verified yet."),
    ).toBeVisible();
  });
});
