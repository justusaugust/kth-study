import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

function stubSystemPreference(prefersDark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: prefersDark,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
  window.localStorage.clear();
});

describe("ThemeToggle", () => {
  it("defaults to light when the system has no dark preference", () => {
    stubSystemPreference(false);
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("follows a system dark preference on first visit", () => {
    stubSystemPreference(true);
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("honors a theme already applied by the bootstrap script", () => {
    stubSystemPreference(false);
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();
  });

  it("prefers a persisted choice over the system preference", () => {
    stubSystemPreference(true);
    window.localStorage.setItem("kth-study-theme", "light");
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("toggles the applied theme and persists the choice", () => {
    stubSystemPreference(false);
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("kth-study-theme")).toBe("dark");

    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("kth-study-theme")).toBe("light");
  });

  it("does not persist anything until the user chooses", () => {
    stubSystemPreference(true);
    render(<ThemeToggle />);

    expect(window.localStorage.getItem("kth-study-theme")).toBeNull();
  });
});
