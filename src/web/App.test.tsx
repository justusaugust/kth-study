import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { AppShell } from "./components/AppShell";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function searchHit(
  id: string,
  entityType: string,
  title: string,
  url = "/target",
) {
  return {
    id,
    entityType,
    title,
    summary: `${title} summary`,
    url,
    score: 10,
    courseId: "course:sf1690",
  };
}

function openGlobalSearch() {
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  return screen.getByRole("searchbox", { name: "Search all courses" });
}

describe("App", () => {
  it("gives an unknown route a useful way back into the app", () => {
    render(
      <MemoryRouter initialEntries={["/missing-page"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Go to Study Hub" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("grounds the interface in KTH Study", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("KTH Study");
    expect(screen.getByRole("button", { name: "Search" })).toBeVisible();
  });

  it("shows up to five eligible live results and respects the active filter", async () => {
    const unfiltered = [
      searchHit("outcome:sf1690:first", "outcome", "Hidden outcome"),
      searchHit("course:sf1690", "course", "Basic Course in Mathematics"),
      searchHit("lecture:sf1690:first", "lecture", "Lecture 1"),
      searchHit("concept:sf1690:absolute-value", "concept", "Absolute value"),
      searchHit("definition:sf1690:absolute-value", "definition", "Absolute value definition"),
      searchHit("example:sf1690:absolute-value", "example", "Absolute-value example"),
      searchHit("question:sf1690:absolute-value", "question", "Absolute-value question"),
    ];
    const concepts = [
      searchHit("concept:sf1690:first", "concept", "First concept"),
      searchHit("concept:sf1690:second", "concept", "Second concept"),
      searchHit("concept:sf1690:third", "concept", "Third concept"),
    ];
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      const results = url.includes("type=concept") ? concepts : unfiltered;
      return Promise.resolve(
        new Response(JSON.stringify({ query: "absolute", results }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>Home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const input = openGlobalSearch();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "absolute" } });

    expect(await screen.findAllByRole("option")).toHaveLength(5);
    expect(screen.queryByText("Hidden outcome")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Concepts" }));
    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([url]) => String(url).includes("type=concept"))).toBe(true),
    );
    expect(await screen.findAllByRole("option")).toHaveLength(3);
  });

  it("keeps touch filter taps available when blur has no next focus target", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ query: "", results: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>Home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const input = openGlobalSearch();
    fireEvent.focus(input);
    fireEvent.blur(input, { relatedTarget: null });
    fireEvent.click(screen.getByRole("button", { name: "Concepts" }));

    expect(screen.getByRole("button", { name: "Concepts" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows only the available recent items before a query is entered", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "",
            results: [
              searchHit("concept:sf1690:first", "concept", "First recent item"),
              searchHit("definition:sf1690:second", "definition", "Second recent item"),
              searchHit("explainer:sf1690:third", "explainer", "Third recent item"),
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>Home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.focus(openGlobalSearch());
    expect(await screen.findAllByRole("option")).toHaveLength(3);
    const recentLabel = screen.getByText("Recently added");
    expect(recentLabel).toBeVisible();
    expect(recentLabel.closest(".search-popover-kicker")?.querySelector("svg")).not.toBeInTheDocument();
  });

  it("makes each live suggestion a direct link with quiet text metadata", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "absolute",
            results: [
              searchHit("concept:sf1690:absolute-value", "concept", "Absolute value"),
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>Home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const input = openGlobalSearch();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "absolute" } });

    const option = await screen.findByRole("option");
    expect(option).toHaveAttribute("href", "/target");
    expect(option.querySelector(".suggestion-kind")).toHaveTextContent("Concept");
    expect(option.querySelector(".suggestion-kind svg")).not.toBeInTheDocument();
  });

  it("opens the highlighted live result with the keyboard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "absolute",
            results: [searchHit("concept:sf1690:absolute-value", "concept", "Absolute value")],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>Home</p>} />
            <Route path="target" element={<p>Target reached</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const input = openGlobalSearch();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "absolute" } });
    await screen.findByRole("option");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(await screen.findByText("Target reached")).toBeVisible();
  });

  it("reaches the last suggestion with ArrowUp from an unselected search field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            query: "absolute",
            results: [
              searchHit("concept:sf1690:first", "concept", "First result", "/first"),
              searchHit("concept:sf1690:last", "concept", "Last result", "/last"),
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<p>Home</p>} />
            <Route path="first" element={<p>First reached</p>} />
            <Route path="last" element={<p>Last reached</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const input = openGlobalSearch();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "absolute" } });
    await screen.findAllByRole("option");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(await screen.findByText("Last reached")).toBeVisible();
  });
});
