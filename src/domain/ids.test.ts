import { describe, expect, it } from "vitest";
import { entityUrl } from "./ids";

describe("entityUrl", () => {
  it("deep-links user-facing search entities to existing study pages", () => {
    expect(
      entityUrl({
        id: "lecture:sf1690:2026-08-24-01",
        courseId: "course:sf1690",
        slug: "2026-08-24-01",
      } as never),
    ).toBe("/courses/sf1690/lectures/2026-08-24-01");

    expect(
      entityUrl({
        id: "example:sf1690:reverse-triangle-inequality",
        courseId: "course:sf1690",
        slug: "reverse-triangle-inequality",
        conceptIds: ["concept:sf1690:absolute-value"],
      } as never),
    ).toBe(
      "/courses/sf1690/concepts/absolute-value#example-reverse-triangle-inequality",
    );

    expect(
      entityUrl({
        id: "question:sf1690:absolute-value-distance",
        courseId: "course:sf1690",
        slug: "absolute-value-distance",
        conceptIds: ["concept:sf1690:absolute-value"],
      } as never),
    ).toBe(
      "/courses/sf1690/concepts/absolute-value#question-absolute-value-distance",
    );
  });

  it("anchors dossier entities to their owning course page", () => {
    expect(
      entityUrl({
        id: "assessment:sf1690:ten1",
        courseId: "course:sf1690",
        slug: "ten1",
      } as never),
    ).toBe("/courses/sf1690#assessment-ten1");
    expect(
      entityUrl({
        id: "session:sf1690:lecture-01",
        courseId: "course:sf1690",
        slug: "lecture-01",
      } as never),
    ).toBe("/courses/sf1690#session-lecture-01");
    expect(
      entityUrl({
        id: "coursework:sf1690:exercise-01",
        courseId: "course:sf1690",
        slug: "exercise-01",
      } as never),
    ).toBe("/courses/sf1690#coursework-exercise-01");
  });
});
