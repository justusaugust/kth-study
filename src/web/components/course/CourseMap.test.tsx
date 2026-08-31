import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import type { Concept, CurriculumOutcome } from "../../../domain";
import { CourseMap } from "./CourseMap";

afterEach(cleanup);

const outcome: CurriculumOutcome = {
  id: "outcome:sf1690:solve-and-present",
  courseId: "course:sf1690",
  slug: "solve-and-present",
  title: "Solve and present mathematical problems",
  description: "Use relevant concepts and methods to solve problems.",
  sourceIds: [],
  lastChecked: "2026-08-24",
  confidence: "fixture",
  relationships: [
    {
      type: "supports",
      from: "outcome:sf1690:solve-and-present",
      to: "concept:sf1690:quadratic-functions",
    },
  ],
};

const concepts: Concept[] = [
  {
    id: "concept:sf1690:quadratic-functions",
    courseId: "course:sf1690",
    slug: "quadratic-functions",
    title: "Quadratic functions",
    summary: "Understand the shape of a quadratic graph.",
    outcomeIds: [outcome.id],
    lectureIds: [],
    evidenceStatus: "curriculum",
    body: "",
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
  {
    id: "concept:sf1690:extra-example",
    courseId: "course:sf1690",
    slug: "extra-example",
    title: "Supplemental example",
    summary: "A supporting topic.",
    outcomeIds: [],
    lectureIds: [],
    evidenceStatus: "supplemental",
    body: "",
    sourceIds: [],
    lastChecked: "2026-08-24",
    confidence: "fixture",
    relationships: [],
  },
];

describe("CourseMap", () => {
  it("connects outcomes to concepts and keeps supplemental topics quieter", () => {
    render(
      <MemoryRouter>
        <CourseMap courseCode="sf1690" outcomes={[outcome]} concepts={concepts} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Course map" })).toBeVisible();
    expect(screen.getByText(outcome.title)).toBeVisible();
    expect(screen.getByRole("link", { name: "Quadratic functions" })).toHaveAttribute(
      "href",
      "/courses/sf1690/concepts/quadratic-functions",
    );
    expect(
      screen.getByRole("link", { name: "Supplemental example" }).closest("li"),
    ).toHaveAttribute("data-evidence", "supplemental");
    expect(document.querySelectorAll(".course-map__row svg")).toHaveLength(0);
  });
});
