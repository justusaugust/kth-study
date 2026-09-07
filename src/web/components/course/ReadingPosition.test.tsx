import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ReadingPosition } from "./ReadingPosition";

beforeEach(() => { vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} }); });
afterEach(() => { cleanup(); document.body.innerHTML = ""; history.replaceState(null, "", "/"); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const sections = [{ id: "concept-one", label: "First concept" }, { id: "sources", label: "Sources" }];

it("offers stable section links and a custom mobile section picker", () => {
  render(<ReadingPosition sections={sections} />);
  expect(screen.getByRole("navigation", { name: "Lesson contents" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Sources" })).toHaveAttribute("href", "#sources");
  expect(screen.getByRole("combobox", { name: /In this lesson/ })).toHaveTextContent("Jump to a section");
  expect(document.querySelector("select")).toBeNull();
});

it("moves focus and the reading anchor when choosing a section", () => {
  const section = document.createElement("section");
  section.id = "sources";
  section.scrollIntoView = vi.fn();
  document.body.append(section);
  render(<ReadingPosition sections={sections} />);
  const picker = screen.getByRole("combobox");
  fireEvent.keyDown(picker, { key: "ArrowDown" });
  fireEvent.keyDown(picker, { key: "End" });
  fireEvent.keyDown(picker, { key: "Enter" });
  expect(section.scrollIntoView).toHaveBeenCalledWith({ block: "start" });
  expect(section).toHaveFocus();
  expect(location.hash).toBe("#sources");
});

it("tracks scrolling forward and back, reaching the last section at the lesson end", () => {
  let scroll = 0;
  for (const [index, { id }] of sections.entries()) {
    const section = document.createElement("section");
    section.id = id;
    section.getBoundingClientRect = () => ({ top: 100 + index * 1000 - scroll, bottom: 1100 + index * 1000 - scroll } as DOMRect);
    document.body.append(section);
  }
  render(<ReadingPosition sections={sections} />);
  expect(screen.getByRole("progressbar")).toHaveAttribute("value", "0");
  scroll = 200;
  fireEvent.scroll(window);
  expect(screen.getByRole("link", { name: "First concept" })).toHaveAttribute("aria-current", "location");
  expect(screen.getByRole("combobox")).toHaveTextContent("First concept");
  scroll = 1500;
  fireEvent.scroll(window);
  expect(screen.getByRole("link", { name: "Sources" })).toHaveAttribute("aria-current", "location");
  expect(screen.getByRole("progressbar")).toHaveAttribute("value", "100");
  scroll = 0;
  fireEvent.scroll(window);
  expect(screen.getByRole("link", { name: "Sources" })).not.toHaveAttribute("aria-current");
  expect(screen.getByRole("progressbar")).toHaveAttribute("value", "0");
});
