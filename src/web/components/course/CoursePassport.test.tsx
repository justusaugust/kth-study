import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Course } from "../../../domain";
import { CoursePassport } from "./CoursePassport";

afterEach(cleanup);

const course: Course = {
  id: "course:sf1690",
  code: "SF1690",
  slug: "sf1690",
  title: "Basic Course in Mathematics",
  academicYear: "2026-27",
  period: "P1",
  summary: "Fixture course",
  credits: 6,
  language: "English",
  startDate: "2026-08-24",
  endDate: "2026-10-23",
  links: [
    {
      kind: "kth",
      label: "Official KTH course page",
      url: "https://www.kth.se/student/kurser/kurs/SF1690?l=en",
    },
  ],
  outcomeIds: [],
  conceptIds: [],
  sourceIds: [],
  relationships: [],
  lastChecked: "2026-08-24",
  confidence: "fixture",
};

describe("CoursePassport", () => {
  it("renders verified course facts as typography rather than icon badges", () => {
    render(<CoursePassport course={course} />);

    expect(
      screen.getByRole("heading", { name: "Basic Course in Mathematics" }),
    ).toBeVisible();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "DD" &&
          element.textContent?.replace(/\s+/g, " ").trim() === "6 ECTS",
      ),
    ).toBeVisible();
    expect(screen.getByText("24 Aug–23 Oct 2026")).toBeVisible();
    expect(screen.getByText("English")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Official KTH course page" }),
    ).toHaveAttribute(
      "href",
      "https://www.kth.se/student/kurser/kurs/SF1690?l=en",
    );
    expect(document.querySelectorAll(".course-passport svg")).toHaveLength(0);
  });

  it("renders a provided dithered artwork with a restrained construction overlay", () => {
    render(
      <CoursePassport
        course={course}
        artifact={{
          kind: "dithered-still-life",
          src: "/course-artifacts/sf1690-mathematics-still-life-dithered-v1.webp",
          alt: "A dithered still life of a drafting compass, a graphite circle, and a glass sphere on paper.",
          caption: "A circle begins with a fixed point and a distance.",
          folio: "Figure 01",
        }}
      />,
    );

    const image = screen.getByRole("img", {
      name: "A dithered still life of a drafting compass, a graphite circle, and a glass sphere on paper.",
    });
    expect(image).toHaveAttribute(
      "src",
      "/course-artifacts/sf1690-mathematics-still-life-dithered-v1.webp",
    );
    expect(screen.getByTestId("course-artwork-overlay")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByText("Figure 01")).toBeVisible();
    expect(
      screen.getByText("A circle begins with a fixed point and a distance."),
    ).toBeVisible();
  });

  it("renders no artefact figure when none is provided", () => {
    render(<CoursePassport course={course} />);
    expect(document.querySelector(".course-artifact")).toBeNull();
  });

  it("omits facts that have not been verified", () => {
    render(
      <CoursePassport
        course={{
          ...course,
          language: undefined,
          startDate: undefined,
          endDate: undefined,
          links: [],
        }}
      />,
    );

    expect(screen.queryByText("Language")).not.toBeInTheDocument();
    expect(screen.queryByText("Teaching")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Course sources" }),
    ).not.toBeInTheDocument();
  });
});
