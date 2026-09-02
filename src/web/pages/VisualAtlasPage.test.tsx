import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VisualAtlasPage } from "./VisualAtlasPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.search}</span>;
}

const visual = (figureNumber: number, courseCode: string, kind: "systems-diagram" | "conic-section", title: string) => ({
  figureNumber,
  courseCode,
  courseTitle: courseCode === "IE1204" ? "Digital Design" : "Basic Course in Mathematics",
  explainer: {
    id: `explainer:${courseCode.toLowerCase()}:${figureNumber}`,
    atlasOrder: figureNumber,
    kind,
    variant: kind === "systems-diagram" ? "binary-place-value" : "ellipse-distance-sum",
    courseId: `course:${courseCode.toLowerCase()}`,
    slug: `visual-${figureNumber}`,
    conceptIds: [`concept:${courseCode.toLowerCase()}:fixture`],
    title,
    caption: `${title} caption.`,
    accessibleSummary: `${title} accessible summary.`,
    sourceIds: [],
    relationships: [],
    lastChecked: "2026-08-27",
    confidence: "fixture",
  },
});

function stubAtlas() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            visual(1, "IE1204", "systems-diagram", "Build a binary value"),
            visual(5, "SF1690", "conic-section", "Ellipse from a constant distance sum"),
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ),
  );
}

describe("VisualAtlasPage", () => {
  it("shows the result count and keeps figure numbers stable while filtering", async () => {
    stubAtlas();

    render(
      <MemoryRouter initialEntries={["/visuals"]}>
        <VisualAtlasPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Fig. 01")).toBeVisible();
    expect(screen.getByText("Fig. 05")).toBeVisible();
    expect(screen.getByText("2 visuals")).toBeVisible();

    const courseSelect = screen.getByRole("combobox", { name: /^Course/ });
    fireEvent.click(courseSelect);
    fireEvent.click(
      screen.getByRole("option", { name: /SF1690.*Basic Course in Mathematics/ }),
    );

    expect(screen.queryByText("Fig. 01")).not.toBeInTheDocument();
    expect(screen.getByText("Fig. 05")).toBeVisible();
    expect(screen.getByText("1 visual")).toBeVisible();
    expect(courseSelect).toHaveTextContent(/SF1690.*Basic Course in Mathematics/);
  });

  it("filters by visual form and writes the choice into the URL", async () => {
    stubAtlas();

    render(
      <MemoryRouter initialEntries={["/visuals"]}>
        <VisualAtlasPage />
        <LocationProbe />
      </MemoryRouter>,
    );

    await screen.findByText("Fig. 01");

    fireEvent.click(screen.getByRole("combobox", { name: /^Visual form/ }));
    fireEvent.click(screen.getByRole("option", { name: "Conic sections" }));

    expect(screen.getByText("1 visual")).toBeVisible();
    expect(screen.getByTestId("location")).toHaveTextContent("kind=conic-section");
  });

  it("opens with the filters carried in the URL already applied", async () => {
    stubAtlas();

    render(
      <MemoryRouter initialEntries={["/visuals?course=SF1690&kind=conic-section"]}>
        <VisualAtlasPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Fig. 05")).toBeVisible();
    expect(screen.queryByText("Fig. 01")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /^Course/ })).toHaveTextContent(
      /SF1690.*Basic Course in Mathematics/,
    );
    expect(screen.getByRole("combobox", { name: /^Visual form/ })).toHaveTextContent(
      "Conic sections",
    );
  });

  it("drops unknown URL filters instead of hiding every visual behind an All label", async () => {
    stubAtlas();

    render(
      <MemoryRouter initialEntries={["/visuals?course=UNKNOWN&kind=other"]}>
        <VisualAtlasPage />
        <LocationProbe />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Fig. 01")).toBeVisible();
    expect(screen.getByText("Fig. 05")).toBeVisible();
    expect(screen.getByTestId("location")).toHaveTextContent(/^$/);
  });
});
