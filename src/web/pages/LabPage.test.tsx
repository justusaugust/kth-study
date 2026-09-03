import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LabPage } from "./LabPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LabPage", () => {
  it("shows the source-backed plan without inventing an attendance record", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      course: {
        id: "course:ie1204", code: "IE1204", slug: "ie1204", title: "Digital Design",
        academicYear: "2026-27", period: "P1", summary: "Fixture", credits: 7.5,
        links: [], outcomeIds: [], conceptIds: [], sourceIds: [], relationships: [],
        lastChecked: "2026-09-03", confidence: "fixture",
      },
      outcomes: [], lectures: [], concepts: [], explainers: [], definitions: [], examples: [], questions: [],
      assessments: [{
        id: "assessment:ie1204:laba", courseId: "course:ie1204", slug: "laba", code: "LABA",
        title: "Laboratory work", kind: "laboratory", credits: 3.5, compulsory: true,
        description: "Laboratory work.", outcomeIds: [], conceptIds: [], sourceIds: [], relationships: [],
        lastChecked: "2026-09-03", confidence: "fixture",
      }],
      sessions: [{
        id: "session:ie1204:lab-2026-09-03", courseId: "course:ie1204", slug: "lab-2026-09-03",
        kind: "laboratory", sequence: 4.1, title: "Laboratory session", date: "2026-09-03",
        time: "15:00", endTime: "17:00", location: "Q15", courseworkIds: [],
        agenda: ["Collect the lab kit."], sourceIds: ["source:ie1204:lecture-4"], relationships: [],
        lastChecked: "2026-09-03", confidence: "fixture",
      }],
      coursework: [], journey: [],
      sources: [{
        id: "source:ie1204:lecture-4", courseId: "course:ie1204", title: "Lecture 4",
        kind: "lecture-material", url: "https://example.com/lecture-4", lastChecked: "2026-09-03",
        confidence: "fixture",
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    render(
      <MemoryRouter initialEntries={["/courses/ie1204/labs/lab-2026-09-03"]}>
        <Routes>
          <Route path="/courses/:courseCode/labs/:labSlug" element={<LabPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Laboratory session" })).toBeVisible();
    expect(screen.getByText("Thursday, 3 September 2026 · 15:00–17:00 · Q15")).toBeVisible();
    expect(screen.getByText("Compulsory · 3.5 ECTS")).toBeVisible();
    expect(screen.getByText("Collect the lab kit.")).toBeVisible();
    expect(screen.getByText(/No post-lab record yet/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Lecture 4" })).toHaveAttribute("href", "https://example.com/lecture-4");
  });
});
