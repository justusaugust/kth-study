import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  it("keeps honest provenance visible on the closed folder shelf", () => {
    render(<CourseSources sources={sources} />);

    expect(screen.getByRole("heading", { name: "Sources" })).toBeVisible();
    const curriculumFolder = screen.getByRole("button", {
      name: /Official curriculum/,
    });
    expect(curriculumFolder).toHaveAttribute("aria-expanded", "false");
    expect(curriculumFolder).toHaveTextContent("1 source");
    expect(curriculumFolder).toHaveTextContent("checked 24 Aug 2026");
    expect(document.querySelectorAll(".course-sources svg")).toHaveLength(1);
    expect(document.body).not.toHaveTextContent("material/lectures");
  });

  it("opens a folder into an ordinary inline source list", () => {
    render(<CourseSources sources={sources} />);

    const curriculumFolder = screen.getByRole("button", {
      name: /Official curriculum/,
    });
    fireEvent.click(curriculumFolder);
    expect(curriculumFolder).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("link", { name: /KTH official SF1690/ }),
    ).toHaveAttribute("href", "https://www.kth.se/student/kurser/kurs/SF1690?l=en");

    fireEvent.click(screen.getByRole("button", { name: /Canvas/ }));
    expect(screen.getByText("Page 1, Week 35")).toBeVisible();

    fireEvent.keyDown(curriculumFolder, { key: "Escape" });
    expect(curriculumFolder).toHaveAttribute("aria-expanded", "false");
  });
});
