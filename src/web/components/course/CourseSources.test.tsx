import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CourseResponse } from "../../../domain";
import { CourseSources } from "./CourseSources";

afterEach(cleanup);

const sources: CourseResponse["sources"] = [
  {
    id: "source:sf1690:official-course-page",
    courseId: "course:sf1690",
    title: "KTH official SF1690 course page and syllabus",
    kind: "curriculum",
    url: "https://www.kth.se/student/kurser/kurs/SF1690?l=en",
    locator: "Content and learning outcomes",
    lastChecked: "2026-08-24",
    confidence: "verified",
  },
  {
    id: "source:sf1690:course-plan",
    courseId: "course:sf1690",
    title: "SF1690 HT26 Course plan 26",
    kind: "canvas",
    locator: "Page 1, Week 35",
    lastChecked: "2026-08-24",
    confidence: "verified",
  },
];

describe("CourseSources", () => {
  it("shows source-specific provenance in a simple visible reference list", () => {
    render(<CourseSources sources={sources} />);

    expect(screen.getByRole("heading", { name: "Sources" })).toBeVisible();
    expect(screen.getAllByText(/Checked 24 Aug 2026/)).toHaveLength(2);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent("material/lectures");
  });

  it("groups title, context and action inside one link, without fake local links", () => {
    render(<CourseSources sources={sources} />);

    const link = screen.getByRole("link", { name: /KTH official SF1690/ });
    expect(link).toHaveAccessibleName("KTH official SF1690 course page and syllabus Content and learning outcomes Open source · Checked 24 Aug 2026");
    expect(link).toHaveAttribute("href", "https://www.kth.se/student/kurser/kurs/SF1690?l=en");
    expect(within(link).getByText("Content and learning outcomes")).toBeVisible();
    expect(screen.getByText("Page 1, Week 35")).toBeVisible();
    expect(screen.getByText(/No public document link/)).toBeVisible();
    expect(screen.queryByRole("link", { name: /Course plan 26/ })).not.toBeInTheDocument();
  });
});
